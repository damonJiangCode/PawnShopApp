# Win Setup

1. winget -e --id OpenJS.NodeJS.LTS
2. winget install -e --id PostgreSQL.PostgreSQL.16
3. Start-Service postgresql-x64-16
   (4. Set-Service postgresql-x64-16 -StartupType Automatic)
4. $env:Path += ";C:\Program Files\PostgreSQL\16\bin"
5. psql -U postgres
6. CREATE USER moneyexpress WITH PASSWORD '0236';
   CREATE DATABASE pawnshopdb OWNER moneyexpress;
   GRANT ALL PRIVILEGES ON DATABASE pawnshopdb TO me;
   \q

7. download vsode
8. Create Documents\PawnShopApp
9. git clone https://github.com/damonJiangCode/PawnShopApp.git .

# PawnShopApp

user: process.env.DB_USER ?? "damon",
host: process.env.DB_HOST ?? "localhost",
database: process.env.DB_NAME ?? "pawnshopdb",
password: process.env.DB_PASSWORD ?? "0236",
port: Number(process.env.DB_PORT ?? 5432),
Electron + React desktop app for pawn shop workflows.

## Stack

- Electron for the desktop shell, main process, and preload bridge
- React + Vite + MUI for the renderer UI
- PostgreSQL for persistence
- Shared TypeScript types and calculation helpers in `src/shared`

## Mental Model

Most day-to-day work happens in `src/`.

- `src/renderer`
  Frontend source code
- `src/main`
  Electron main-process source code
- `src/preload`
  Safe IPC bridge exposed to the renderer
- `src/shared`
  Code shared by renderer and main
- `src/db`
  Database connection, initialization, schema, and seed logic

Outside `src/`, the other important directories are:

- `renderer/`
  Renderer tooling config such as `index.html`, `vite.config.ts`, and renderer `tsconfig`
- `scripts/`
  Small project scripts used by the build/dev workflow
- `.electron-build/`
  Generated runtime output for Electron-side code. This is a build artifact, not source code.

## Top-Level Structure

```text
.
├── renderer/               # Vite entry + renderer tooling config
├── scripts/                # Build helper scripts
├── src/
│   ├── renderer/           # React source
│   ├── main/               # Electron main source
│   ├── preload/            # Preload bridge
│   ├── shared/             # Shared contracts, types, utils
│   └── db/                 # DB connection, init, schema, seed
├── package.json
├── tsconfig.json
└── tsconfig.main.json
```

## Source Map

### `src/renderer`

Renderer-side React code.

- `app/`
  App bootstrap and main layout
- `pages/`
  Top-level screens: client, transaction, history
- `components/client/`
  Client forms, profile, results table, image panel
- `components/ticket/`
  Ticket table, ticket actions, pawn/sell/edit dialogs
- `components/item/`
  Item table and item actions
- `components/layout/`
  Top bar, search bar, side buttons
- `services/`
  Renderer-side object services that call `window.electronAPI`
- `hooks/`
  Reusable renderer logic such as image loading and client search
- `utils/`
  Renderer-only helpers such as form error handling

### `src/main`

Electron main-process code.

- `index.ts`
  Main Electron entry
- `handlers/`
  IPC handler registration grouped by object
- `services/`
  Business rules grouped by object
- `repos/`
  Data access layer grouped by object
- `utils/`
  Shared main-process helpers such as transactions, field errors, and image storage

### `src/preload`

- `index.cjs`
  Exposes the safe API used by the renderer as `window.electronAPI`

### `src/shared`

Shared contracts and pure utilities.

- `ipc/contracts.ts`
  Shared IPC channel constants
- `ipc/contracts.ts`
  Shared request/response and API contract types
- `types/`
  Shared domain models like `Client`, `Ticket`, and `Item`
- `utils/calculation.ts`
  Shared ticket/date/amount calculation helpers

### `src/db`

Database-side source code.

- `connection.ts`
  PostgreSQL pool and connection helper
- `initialize.ts`
  Creates tables and seeds lookup data
- `runInit.ts`
  Entry used by `npm run db:init`
- `schema/client/`
  Client-related tables and lookup tables
- `schema/ticket/`
  Ticket and location tables
- `schema/item/`
  Item tables
- `schema/employee/`
  Employee tables
- `seed/`
  Seed source files like `canadacities.csv`

## Runtime Flow

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
-> ticket handler
-> main ticketService.createPawnTicket()
-> ticketRepo.create()
-> ticket table
```

## Grouping Rules

The codebase is primarily grouped by object:

- `client`
  Client data and client-related lookup data such as cities, hair colors, eye colors, and ID types
- `ticket`
  Ticket workflows and ticket-related lookup data such as locations
- `item`
  Item tables and item loading
- `employee`
  Employee authorization logic such as password checks

Cross-cutting rules:

- Shared domain contracts go in `src/shared`
- Renderer-only UI helpers stay in `src/renderer`
- Database table and seed logic stays in `src/db`

## Development Workflow

### Install

```bash
npm install
```

### Configure Database

Create a local env file:

```bash
cp .env.example .env
```

Then set your PostgreSQL values:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
```

### Initialize Database

```bash
npm run db:init
```

### Start Development

```bash
npm run dev
```

This starts three processes together:

- `dev:frontend`
  Starts the Vite dev server from `renderer/`
- `dev:main`
  Compiles Electron-side TypeScript into `.electron-build/` in watch mode
- `dev:app`
  Starts Electron using the compiled app in `.electron-build/`

## Scripts

- `npm run dev`
  Starts renderer dev server, Electron-side watcher, and Electron app together
- `npm run dev:frontend`
  Starts the renderer dev server
- `npm run dev:main`
  Watches and compiles `src/main`, `src/db`, and `src/shared` into `.electron-build/`
- `npm run dev:app`
  Starts Electron against `.electron-build/`
- `npm run typecheck:main`
  Type-checks Electron-side code
- `npm run typecheck:renderer`
  Type-checks renderer-side code
- `npm run build:main`
  Builds Electron-side code into `.electron-build/`
- `npm run build`
  Builds Electron-side code and the renderer bundle
- `npm run db:init`
  Builds Electron-side code and runs database initialization from `.electron-build/db/runInit.js`

## Build Artifacts

`.electron-build/` is generated output.

- It is created by `scripts/prepareElectronBuild.cjs` and the Electron-side TypeScript build
- It is used at runtime by `dev:app` and `db:init`
- It is ignored by git
- You should not manually edit files inside it

## Practical Notes

- Your main workplace is `src/`
- `renderer/` is configuration for the renderer toolchain, not business logic
- `scripts/prepareElectronBuild.cjs` prepares `.electron-build/package.json` before Electron-side compilation
- `src/preload/index.cjs` stays as CJS so Electron can load it directly as preload
