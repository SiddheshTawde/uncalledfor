# API Database

Set `DATABASE_URL` in `apps/api/.env` or the deployment environment to the Neon PostgreSQL connection URL. The async engine adapts standard `postgresql://` URLs for `asyncpg`, removes libpq-only `sslmode` and `channel_binding` parameters, and requires TLS.

Apply [`schema.sql`](schema.sql) once in the Neon SQL Editor to create the `entries` table. Use `get_db` from `database.py` for request-scoped async sessions, `Entry` from `entries/models.py` for the ORM model, and `EntryCreate` / `EntryRead` from `entries/schemas.py` for API payloads. The feature router lives in `entries/router.py`.

Set `CLERK_SECRET_KEY` and `GROQ_API_KEY` in `apps/api/.env` or the deployment environment. `GROQ_MODEL` is optional and defaults to `openai/gpt-oss-120b`. The web app needs `VITE_CLERK_PUBLISHABLE_KEY` in `apps/web/.env.local`; `VITE_API_URL` is optional and defaults to `/api/v1`. In development, Vite proxies `/api` to FastAPI at `http://127.0.0.1:8000`.

`POST /api/v1/entries/` accepts `{"entry":"..."}` with a Clerk bearer token. It commits the entry to Neon before starting generation, then responds as `text/event-stream`: an `entry` event carries the saved entry ID, and subsequent `data` events carry JSON `{ "delta": "..." }` chunks, followed by `[DONE]`. The generated comment is saved incrementally and finalized in Neon. The client reads the stream and renders the response as it arrives. `GET /api/v1/entries/` returns the signed-in user's latest ten entries.
