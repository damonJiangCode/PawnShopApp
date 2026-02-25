# PawnShopApp

Electron + React desktop app for pawn shop workflows.

## Stack
- Electron (desktop shell + IPC)
- React + Vite + MUI (frontend)
- PostgreSQL (database)
- Shared TypeScript models in `shared/`

## Project Structure

```text
.
├── electron/
│   ├── main.ts
│   ├── preload.cjs
│   ├── ipc/
│   ├── services/
│   └── db/
│       ├── initDb.ts
│       ├── repositories/
│       ├── tables/
│       └── seed/
├── frontend/
│   ├── src/
│   └── ...
├── shared/
│   └── types/
└── .env.example
```

## First-Time Setup

1. Install dependencies:
```bash
npm install
cd frontend && npm install && cd ..
```

2. Create local env file:
```bash
cp .env.example .env
```

3. Update `.env` with your local PostgreSQL values:
```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
```

4. Initialize database tables and seed data:
```bash
npm run db:init
```

## Run In Development

Start frontend + Electron together:
```bash
npm run dev
```

## Scripts
- `npm run dev`: run frontend and Electron in parallel
- `npm run dev:frontend`: run Vite frontend only
- `npm run dev:electron`: run Electron only (waits for frontend)
- `npm run db:init`: create/init DB tables and seed lookup data

## Data Flow

`frontend -> api -> preload (window.electronAPI) -> ipc handlers -> services -> repositories -> PostgreSQL`

## Notes
- DB connection values now come from `.env`.
- `.env` is gitignored; use `.env.example` as template.
- Client search/add/update and lookup flows are wired through IPC.
