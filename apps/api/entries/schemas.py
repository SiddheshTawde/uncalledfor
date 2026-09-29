from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EntryCreate(BaseModel):
    entry: str
    comment: str | None = None


class EntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: str
    entry: str
    comment: str | None
    created_at: datetime | None