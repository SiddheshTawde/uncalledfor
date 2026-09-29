from collections.abc import AsyncIterator
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL, make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase


class DatabaseSettings(BaseSettings):
    database_url: str = Field(alias="DATABASE_URL", min_length=1)
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent / ".env",
        extra="ignore",
        case_sensitive=False,
    )


settings = DatabaseSettings()


def _async_database_url(value: str) -> URL:
    url = make_url(value)
    if url.drivername in {"postgres", "postgresql"}:
        url = url.set(drivername="postgresql+asyncpg")
    if url.drivername != "postgresql+asyncpg":
        raise ValueError("DATABASE_URL must use a PostgreSQL connection URL")

    query = dict(url.query)
    query.pop("sslmode", None)
    query.pop("channel_binding", None)
    return url.set(query=query)


engine = create_async_engine(
    _async_database_url(settings.database_url),
    connect_args={"ssl": "require"},
    pool_pre_ping=True,
)
SessionFactory = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncIterator[AsyncSession]:
    async with SessionFactory() as session:
        yield session
