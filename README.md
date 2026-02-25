# PawnSystem Desktop App

Electron + React desktop application for pawn shop workflows.  
The project uses:
- `Electron` as the desktop shell and secure IPC layer
- `React + Vite + MUI` for the UI
- `PostgreSQL` for persistent data
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
│       ├── repositories/
│       ├── tables/
│       └── seed/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── components/
│   │   │   ├── client/
│   │   │   │   ├── fields/
│   │   │   │   ├── profile/
│   │   │   │   └── search/
│   │   │   ├── transaction/
│   │   │   └── topbar/
│   │   ├── assets/
│   │   └── utils/
│   └── public/
├── shared/
│   └── types/
├── procedures.txt
└── test.py
```

## Folder Descriptions

- `electron/main.ts`: Creates the desktop window and boots IPC handlers.
- `electron/preload.cjs`: Exposes a safe `window.electronAPI` bridge to the renderer.
- `electron/ipc/`: Maps renderer requests to backend services.
- `electron/services/`: Application-level business logic (clients, lookups, image storage).
- `electron/db/repositories/`: SQL access layer (queries and data mapping).
- `electron/db/tables/`: Table definitions and DB initialization logic.
- `electron/db/seed/`: Seed assets (for example, Canadian cities CSV).

- `frontend/src/main.tsx`, `frontend/src/App.tsx`: React entry point and app root.
- `frontend/src/layouts/`: High-level layout (tabs, top bar, page container).
- `frontend/src/pages/`: Main pages (`Client`, `Transaction`, `History`).
- `frontend/src/components/client/`: Client UI (form, profile, search results, field groups).
- `frontend/src/components/transaction/`: Ticket/item tables, controls, ticket dialogs.
- `frontend/src/components/topbar/`: Search and quick action buttons.
- `frontend/src/api/`: Direct calls to `window.electronAPI`.
- `frontend/src/services/`: UI-facing service wrappers and guards.
- `frontend/src/hooks/`: Data-loading hooks (`useClientSearch`, `useTickets`, etc.).
- `frontend/src/assets/`: Static option lists/constants for UI usage.
- `frontend/src/utils/`: Small frontend utilities (for example default client object).

- `shared/types/`: Shared TypeScript interfaces (`Client`, `Ticket`, `Item`) used by both frontend and Electron.
- `procedures.txt`: Quick setup notes captured during development.
- `test.py`: Small local scratch/test file.

## Data Flow

`frontend -> api -> window.electronAPI (preload) -> ipc handlers -> services -> repositories -> PostgreSQL`

## Run Locally

1. Install dependencies in the root:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

3. Ensure PostgreSQL is running and update DB connection values in:
`electron/db/tables/createTables.ts`

4. Start development (Vite + Electron together):
```bash
npm run dev
```

## Notes

- The current codebase has complete client search/add and lookup flows wired through IPC.
- Transaction ticket/item APIs exist in the frontend layer and can be expanded with matching Electron IPC handlers.
