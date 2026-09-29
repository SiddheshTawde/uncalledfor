# uncalledfor

uncalledfor is a private journaling app that lets signed-in users write honest thoughts and receive a brief AI-generated reflection back in real time.

## Overview

This monorepo contains:

- `apps/web`: a React + Vite frontend with Clerk authentication
- `apps/api`: a FastAPI backend that stores entries in PostgreSQL and streams AI responses from Groq
- `packages/ui`: shared UI primitives for the client app
- `packages/eslint-config` and `packages/typescript-config`: shared workspace tooling

## Tech stack

- Frontend: React, TypeScript, Vite
- Backend: FastAPI, SQLAlchemy async, PostgreSQL, Neon
- Auth: Clerk
- AI: Groq
- Tooling: TurboRepo, pnpm, uv

## Prerequisites

- Node.js 24.20+
- pnpm 11+
- Python 3.10+
- A PostgreSQL connection string (Neon is the intended setup)
- Clerk secret key and publishable key
- Groq API key

## Environment setup

Create `apps/api/.env` with:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>
CLERK_SECRET_KEY=your_clerk_secret_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Create `apps/web/.env.local` with:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=/api/v1
```

If you want to bypass the dev proxy, you can set:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

## Database

Apply the schema in `apps/api/schema.sql` once in your Neon SQL editor or PostgreSQL database:

```sql
CREATE TABLE entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    entry TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Local development

Install the JavaScript dependencies:

```bash
pnpm install
```

Set up the Python API environment:

```bash
cd apps/api
uv sync
```

Start the API:

```bash
cd apps/api
uv run fastapi dev main.py --host 127.0.0.1 --port 8000
```

Start the web app:

```bash
pnpm --filter web dev
```

Or run both via TurboRepo:

```bash
pnpm dev
```

The Vite dev server proxies `/api` requests to the FastAPI app on `http://127.0.0.1:8000`.

## App behavior

- Users sign in with Clerk.
- A journal entry is saved and immediately returned as a streaming event-source response.
- The backend streams a brief reflective message while generating it.
- Each user can retrieve their latest 10 entries with the API.

## API endpoints

- `POST /api/v1/entries/` — create an entry and stream the generated response
- `GET /api/v1/entries/` — fetch the signed-in user’s most recent entries

For implementation details, see the API docs in [apps/api/README.md](apps/api/README.md).
