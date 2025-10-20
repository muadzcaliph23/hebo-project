# hebo-project

Minimal admin UI + API for managing models (frontend + server) built with Bun.

## Features

- Frontend: Vite + React (TypeScript), Tailwind UI components
- Backend: Bun-based API (server/server.ts)
- Create / update models (POST, PUT), delete models (DELETE)
- Keyboard shortcuts and small UX helpers (copy path, quick nav)

## Prerequisites

- Bun (v1.3.0+ recommended) — install from https://bun.sh
- Git (to clone / push repo)

Verify:

```bash
bun -v
git --version
```

## Frontend Quickstart (local, Windows)

From project root:

1. Install dependencies

```powershell
bun install
```

2. In a new terminal start the frontend

```powershell
cd frontend
bun run dev
```

Open http://localhost:5173 (or the URL printed by the dev server) to view the UI.

## Environment

- Server and frontend may read .env files. Create `.env` or `.env.local` in the relevant folder and set variables used by your server (e.g. DB connection, API keys). Example:

```
# server/.env
DATABASE_URL=..
PORT=3000

ENVIRONMENT="development"
VITE_FRONTEND_URL="http://localhost:5173"
VITE_API_URL="http://localhost:3000"
```

## Setup Database / Prisma

This project uses Prisma as the ORM. Quick steps to add Prisma and generate the client (example uses Bun):

1. Install Prisma and the client

```powershell
bun add -d prisma
bun add @prisma/client
```

2. Initialize prisma

```powershell
bunx prisma init
```

3. Create migration and generate client (SDLite)

```powershell
bunx prisma migrate dev --name init
bunx prisma generate
```

4. Open prisma studio to see the database

```powershell
bunx prisma studio
```

## Start the backend

1. Run backend API (serves on http://localhost:3000)

```powershell
bun run server/server.ts
```

## API

- POST /api/models — add model
- PUT /api/models — update model
- DELETE /api/models — delete model

(Check server/server.ts for exact routes and payload formats.)

## Folder structure (important files)

- server/ — Bun backend (server.ts, api handlers)
- frontend/ — React frontend (src/, components/, pages/)
- README.md — this file
