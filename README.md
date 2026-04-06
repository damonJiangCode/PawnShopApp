# PawnShopApp

Electron + React desktop app for pawn shop workflows.

## Stack
- Electron for the desktop shell, main process, and preload bridge
- React + Vite + MUI for the renderer UI
- PostgreSQL for persistence
- Shared TypeScript models and calculation helpers in `src/shared`

## Architecture

The project is organized by runtime responsibility at the top level:

```text
src/
├── renderer/  # React UI
├── main/      # Electron main process, IPC handlers, business services, repos
├── preload/   # Safe bridge exposed to window.electronAPI
├── shared/    # Types, IPC constants, and pure shared utilities
└── db/        # Database connection, initialization, schema, seed data
```

Inside `renderer` and `main`, code is grouped by business object where it makes sense:
- `client`
- `ticket`
- `item`
- `employee`

This keeps the app aligned with the actual pawn shop workflow instead of page names.

## Current Folder Layout

```text
.
├── renderer/
│   ├── index.html
│   ├── main.tsx
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── src/
│   ├── renderer/
│   │   ├── app/
│   │   ├── pages/
│   │   ├── components/
│   │   │   ├── client/
│   │   │   ├── ticket/
│   │   │   ├── item/
│   │   │   ├── transaction/
│   │   │   └── layout/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── assets/
│   │
│   ├── main/
│   │   ├── handlers/
│   │   ├── repos/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── preload/
│   │   └── index.cjs
│   │
│   ├── shared/
│   │   ├── ipc/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── db/
│       ├── connection.ts
│       ├── initialize.ts
│       ├── runInit.ts
│       ├── schema/
│       │   ├── client/
│       │   ├── ticket/
│       │   ├── item/
│       │   └── employee/
│       └── seed/
│
├── package.json
└── .env.example
```

## What Each Layer Does

### `src/renderer`

The renderer is the React app.

- `app/`
  Application bootstrap and layout shell.
- `pages/`
  Top-level screens such as client, transaction, and history.
- `components/`
  Reusable UI grouped by object. For example, ticket dialogs live under `components/ticket/dialogs`.
- `services/`
  Frontend-side wrappers around `window.electronAPI`, grouped by object such as `clientService` and `ticketService`.
  These services read their payload and return types from `src/shared/ipc/contracts.ts`.
- `hooks/`
  UI-specific reusable logic.
- `utils/`
  Renderer-only helpers like form error mapping.

### `src/main`

The main process owns IPC registration and business logic.

- `handlers/`
  Electron IPC handlers. These are thin adapters that receive renderer calls and forward them to services.
- `services/`
  Business rules. This is where validation, authorization, ticket calculations, and transaction workflows live.
- `repos/`
  Data access code. Repos talk to PostgreSQL and return domain-shaped data.
- `utils/`
  Shared main-process helpers such as transaction wrappers, field-error formatting, and image storage helpers.

### `src/preload`

The preload layer exposes a safe API to the renderer through `window.electronAPI`.

It is intentionally nested by object:
- `electronAPI.client.*`
- `electronAPI.ticket.*`
- `electronAPI.item.*`

### `src/shared`

This folder is only for code used by both sides.

- `ipc/`
  Shared IPC channel constants and request/response contracts used across the bridge
- `types/`
  Shared domain models like `Client`, `Ticket`, and `Item`
- `utils/`
  Pure shared helpers such as ticket amount and due-date calculations

### `src/db`

The database layer owns setup and schema definition.

- `connection.ts`
  PostgreSQL pool and connection helper
- `initialize.ts`
  Creates tables and inserts lookup data
- `runInit.ts`
  CLI entry used by `npm run db:init`
- `schema/`
  Table creation and insert helpers, grouped by business object
- `seed/`
  Seed source files such as `canadacities.csv`

## Data Flow

Most app actions follow this path:

```text
renderer component
-> renderer service
-> preload bridge
-> main handler
-> main service
-> repo
-> PostgreSQL
```

Example:

```text
PawnTicketDialog
-> ticketService.createPawnTicket()
-> window.electronAPI.ticket.createPawn()
-> ipcMain.handle("add-pawn-ticket")
-> main ticketService.createPawnTicket()
-> ticketRepo.create()
-> ticket table
```

## Business Grouping Rules

These are the conventions the current code follows:

- Client lookup data belongs to `client`
  Examples: `city`, `hair_color`, `eye_color`, `id_type`
- Ticket lookup data belongs to `ticket`
  Example: `location`
- Employee password authorization belongs to `employee`
- Shared date and amount calculations belong to `src/shared/utils`
- Renderer-only form error presentation belongs to `src/renderer/utils`

## First-Time Setup

1. Install root dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env
```

3. Update `.env` with your local PostgreSQL credentials:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
```

4. Initialize the database:

```bash
npm run db:init
```

## Development

Run renderer + Electron together:

```bash
npm run dev
```

Run only the renderer:

```bash
npm run dev:frontend
```

Run only the main-process build watcher:

```bash
npm run dev:main
```

Run only the Electron app against the built main process:

```bash
npm run dev:app
```

Build the app:

```bash
npm run build
```

## Scripts

- `npm run dev`
  Starts the renderer dev server, main-process TypeScript watcher, and Electron app together
- `npm run dev:frontend`
  Starts the renderer dev server from `renderer/`
- `npm run dev:main`
  Watches and compiles `src/main`, `src/db`, and `src/shared` into `.electron-build/`
- `npm run dev:app`
  Starts Electron against the compiled app in `.electron-build/`
- `npm run build:main`
  Builds the Electron-side TypeScript into `.electron-build/`
- `npm run build`
  Builds both the Electron-side code and the renderer bundle
- `npm run db:init`
  Builds the Electron-side code first, then runs database initialization from `.electron-build/db/runInit.js`

## Practical Notes

- Renderer source lives in `src/renderer`, while renderer tooling lives in top-level `renderer/`
- Electron-side code is compiled into `.electron-build/` for development and CLI database tasks
- The preload file is `src/preload/index.cjs` so Electron can load it directly without an extra build step
- Main services use shared helpers in `src/main/utils` for field errors, transactions, and image storage
- Schema files are grouped by object so database structure matches the app's domain model
