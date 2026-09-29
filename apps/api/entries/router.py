import json
from collections.abc import AsyncIterator
from pathlib import Path
from uuid import UUID

from clerk_backend_api import Clerk
from clerk_backend_api.models.clerkbaseerror import ClerkBaseError
from clerk_backend_api.security.types import AuthenticateRequestOptions, RequestState
from database import SessionFactory, get_db
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer
from groq import APIError, AsyncGroq
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from entries.models import Entry
from entries.schemas import EntryCreate, EntryRead


class ClerkSettings(BaseSettings):
    secret_key: str = Field(alias="CLERK_SECRET_KEY", min_length=1)
    groq_api_key: str = Field(alias="GROQ_API_KEY", min_length=1)
    groq_model: str = Field(default="openai/gpt-oss-120b", alias="GROQ_MODEL")
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        extra="ignore",
        case_sensitive=False,
    )


settings = ClerkSettings()

clerk_client = Clerk()
groq_client = AsyncGroq(api_key=settings.groq_api_key)


security_scheme = HTTPBearer()


def verify_clerk_token(request: Request) -> RequestState:
    try:
        request_state = clerk_client.authenticate_request(
            request=request,
            options=AuthenticateRequestOptions(secret_key=settings.secret_key),
        )

        if not request_state.is_signed_in:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Clerk token",
            )

        return request_state

    except ClerkBaseError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {e!s}",
        )


router = APIRouter(
    prefix="/entries",
    tags=["Entries"],
    dependencies=[Depends(security_scheme), Depends(verify_clerk_token)],
)
clerk_state_dependency = Depends(verify_clerk_token)
database_session_dependency = Depends(get_db)


@router.get("/")
async def get_entries(
    request_state: RequestState = clerk_state_dependency,
    session: AsyncSession = database_session_dependency,
) -> list[EntryRead]:
    user_id = (request_state.payload or {}).get("sub")
    if not isinstance(user_id, str) or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Clerk token is missing a user ID",
        )

    result = await session.scalars(
        select(Entry)
        .where(Entry.user_id == user_id)
        .order_by(Entry.created_at.desc().nulls_last())
        .limit(10)
    )
    return list(result.all())


async def stream_comment(entry_id: UUID, entry_text: str) -> AsyncIterator[str]:
    yield f"event: entry\ndata: {json.dumps({'id': str(entry_id), 'entry': entry_text, 'comment': ''})}\n\n"

    comment = ""
    chunks_since_save = 0
    try:
        completion = await groq_client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Respond to the user's journal entry with a brief, warm, "
                        "thoughtful reflection. Be specific and nonjudgmental. "
                        "Do not diagnose or give medical advice."
                    ),
                },
                {"role": "user", "content": entry_text},
            ],
            stream=True,
        )

        async for chunk in completion:
            delta = chunk.choices[0].delta.content
            if not delta:
                continue

            comment += delta
            chunks_since_save += 1
            if chunks_since_save >= 20:
                async with SessionFactory() as session:
                    await session.execute(
                        update(Entry)
                        .where(Entry.id == entry_id)
                        .values(comment=comment)
                    )
                    await session.commit()
                chunks_since_save = 0

            yield f"data: {json.dumps({'delta': delta})}\n\n"

        yield "data: [DONE]\n\n"
    except APIError:
        yield "event: error\ndata: {\"message\":\"Comment generation failed\"}\n\n"
    finally:
        async with SessionFactory() as session:
            await session.execute(
                update(Entry).where(Entry.id == entry_id).values(comment=comment)
            )
            await session.commit()


@router.post("/", response_class=StreamingResponse)
async def create_entry(
    data: EntryCreate,
    request_state: RequestState = clerk_state_dependency,
    session: AsyncSession = database_session_dependency,
) -> StreamingResponse:
    user_id = (request_state.payload or {}).get("sub")
    if not isinstance(user_id, str) or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Clerk token is missing a user ID",
        )

    entry = Entry(user_id=user_id, entry=data.entry, comment="")
    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    return StreamingResponse(
        stream_comment(entry.id, entry.entry),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
