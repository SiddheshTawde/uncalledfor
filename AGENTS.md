<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# Repository guidance for uncalledfor

This monorepo contains a React + Vite frontend, a FastAPI backend, and shared tooling packages for a journaling app that stores honest entries and returns a brief AI reflection.

## Workspace map

- `apps/web`: frontend client using React, TypeScript, Vite, and Clerk
- `apps/api`: FastAPI service, SQLAlchemy models, route layer, and environment config
- `apps/api/schema.sql`: PostgreSQL schema for entries
- `packages/ui`: shared frontend components
- `packages/eslint-config` and `packages/typescript-config`: shared config packages

## Typical commands

Install workspace dependencies:

```bash
pnpm install
```

Start both apps via TurboRepo:

```bash
pnpm dev
```

Run the API manually:

```bash
cd apps/api
uv sync
uv run fastapi dev main.py --host 127.0.0.1 --port 8000
```

Run the web app manually:

```bash
pnpm --filter web dev
```

Run lint/build checks at the repo root:

```bash
pnpm lint
pnpm build
```

## Environment and configuration

- Create `apps/api/.env` for `DATABASE_URL`, `CLERK_SECRET_KEY`, and `GROQ_API_KEY`.
- Create `apps/web/.env.local` for `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL`.
- The Vite dev server proxies `/api` requests to the FastAPI app on `http://127.0.0.1:8000`.
- Keep the database schema and API model layer aligned when changing the entry contract.

## Working conventions

- Prefer small, focused changes that stay within one app or one concern at a time.
- Keep backend and frontend contracts in sync when adding fields, modifying request payloads, or changing response shapes.
- When changing API behavior, update the corresponding route, schema, and any relevant docs or examples in `apps/api/README.md`.
- Reuse shared UI primitives from `packages/ui` instead of duplicating components in the app.
- Follow the existing TypeScript and Python project structure rather than introducing new architecture patterns.

## Key product behavior

- Signed-in users create entries.
- Entries are stored in PostgreSQL.
- The API streams a short AI-generated reflection back to the client.
- The user can fetch their latest entries through the authenticated API.

When making changes, prefer the simplest implementation that preserves this flow and avoids breaking the app’s journaling experience.
