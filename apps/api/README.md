# API

The FastAPI service powers the journal backend for uncalledfor. It validates Clerk bearer tokens, stores each journal entry in PostgreSQL, and streams a short AI-written reflection from Groq back to the client.

## Files

- `main.py` mounts the API router and serves the static frontend shell.
- `database.py` configures the async PostgreSQL engine and request-scoped sessions.
- `schema.sql` creates the `entries` table.
- `entries/models.py` defines the SQLAlchemy `Entry` model.
- `entries/schemas.py` defines the request/response payloads.
- `entries/router.py` contains the auth, CRUD, and streaming logic.

## Environment variables

Set these in `apps/api/.env` or your deployment environment:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>
CLERK_SECRET_KEY=your_clerk_secret_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

`GROQ_MODEL` is optional and defaults to `openai/gpt-oss-120b`.

## Database setup

Apply the SQL in `schema.sql` once to create the `entries` table:

```sql
CREATE TABLE entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    entry TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

The async engine in `database.py` accepts a standard PostgreSQL URL and converts it to `postgresql+asyncpg`, removing unsupported libpq-only params such as `sslmode` and `channel_binding` before connecting with TLS.

## Local development

From the project root:

```bash
cd apps/api
uv sync
uv run fastapi dev main.py --host 127.0.0.1 --port 8000
```

The app is served on `http://127.0.0.1:8000` and the web app proxies `/api` there during local development.

## Endpoints

### `GET /api/v1/entries/`

Returns the signed-in user’s latest 10 entries.

### `POST /api/v1/entries/`

Accepts a JSON body like:

```json
{
  "entry": "I am nervous about the next step, but I want to move forward anyway."
}
```

Requires a valid Clerk bearer token in the `Authorization` header.

The handler:

1. Authenticates the Clerk request
2. Saves the journal entry to Neon/PostgreSQL
3. Streams a `text/event-stream` response
4. Emits an `entry` event with the saved entry metadata
5. Sends `data` events with JSON deltas such as `{ "delta": "..." }`
6. Finishes with `[DONE]`
7. Saves the final generated comment back to the database

The client reads the stream and renders the message as it arrives.

## Useful files

- `database.py` — database engine and session factory
- `entries/models.py` — `Entry` ORM model
- `entries/schemas.py` — `EntryCreate` and `EntryRead`
- `entries/router.py` — auth, fetch, and streaming endpoints
