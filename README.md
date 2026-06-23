# PawnShopApp

PawnShopApp is an Electron desktop application for pawn shop operations. It helps staff manage clients, pawn and sell tickets, ticket history, payments, item records, reports, and admin lookup data such as employees, colors, holidays, and locations.

The app uses React, Vite, and MUI for the renderer UI, Electron for the desktop shell and IPC bridge, TypeScript across the codebase, and PostgreSQL for persistent data.

## Project Structure

```text
.
├── renderer/                 # Vite renderer entry and renderer TypeScript config
├── scripts/                  # Build, test, and maintenance scripts
├── src/
│   ├── db/                   # PostgreSQL connection, schema, initialization, and seed data
│   │   ├── schema/           # Table definitions grouped by domain
│   │   └── seed/             # Seed data for clients, tickets, items, and city data
│   ├── main/                 # Electron main process
│   │   ├── handlers/         # IPC handlers
│   │   ├── repos/            # Database access layer
│   │   ├── services/         # Main-process business logic
│   │   └── utils/            # Main-process helpers
│   ├── preload/              # Electron preload bridge exposed to the renderer
│   ├── renderer/             # React application source
│   │   ├── app/              # App bootstrap, main layout, and window registry
│   │   ├── assets/           # Renderer-side static constants/assets
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Renderer hooks
│   │   ├── pages/            # Main app pages: Client, Transaction, History
│   │   ├── services/         # Renderer services that call the preload API
│   │   ├── utils/            # Renderer utilities and tests
│   │   └── windows/          # Secondary Electron windows and menu action screens
│   └── shared/               # Shared IPC contracts, domain types, utilities, and tests
├── package.json              # npm scripts and dependencies
├── package-lock.json         # Locked dependency tree
├── tsconfig.json             # Shared TypeScript config
└── tsconfig.main.json        # Main-process TypeScript config
```

## Source Areas

### `src/renderer`

The React frontend. It contains the main client workflow, transaction workflow, history workflow, payment window, item load window, menu action windows, dialogs, tables, and renderer-side service wrappers.

### `src/main`

The Electron main process. It owns application window creation, menu actions, IPC handler registration, service logic, database repository calls, transactions, and filesystem-backed image storage.

### `src/preload`

The preload bridge. It exposes a controlled `window.electronAPI` surface so renderer code can call Electron and database-backed operations through IPC.

### `src/shared`

Code shared between main and renderer. This includes domain models, IPC API types, payload types, calculation utilities, and related tests.

### `src/db`

Database setup code. It defines PostgreSQL tables, seed data, initialization logic, and the connection helper used by repositories.

### `renderer`

Vite-specific renderer entry files and config. The actual React application source lives in `src/renderer`.

### `scripts`

Project scripts for preparing Electron build output and running tests.

## Generated And Local Data

```text
.electron-build/             # Generated Electron-side build output
images/                      # Local client and item images
node_modules/                # Installed npm dependencies
test-results/                # Local test output
```

These directories are runtime or generated data rather than primary source code.
