# PawnShopApp

PawnShopApp is an Electron desktop application for pawn shop operations. It supports client management, pawn and sell tickets, ticket history, payments, item records, reports, and admin data such as employees, holidays, colors, and locations.

The project uses Electron for the desktop shell, React + Vite + MUI for the renderer UI, TypeScript across the app, PostgreSQL for persistent data, and IPC contracts shared between the main and renderer processes.

## Project Structure

```text
.
├── renderer/                 # Vite renderer entry files and renderer tsconfig
│   ├── index.html
│   ├── index.tsx
│   ├── tsconfig.json
│   └── vite.config.ts
├── scripts/                  # Build, test, migration, and maintenance scripts
│   ├── migrations/
│   ├── prepareElectronBuild.cjs
│   └── runTests.cjs
├── src/
│   ├── main/                 # Electron main process
│   │   ├── database/         # PostgreSQL connection, schema, initialization, seeds
│   │   ├── ipc/              # IPC channel names and handler registration
│   │   ├── modules/          # Domain modules: handlers, services, repos, input mapping
│   │   ├── shared/           # Main-process helpers
│   │   └── window/           # Electron BrowserWindow creation and routing
│   ├── preload/              # Electron preload bridge exposed to renderer
│   ├── renderer/             # React application source
│   │   ├── app/              # Renderer bootstrap, app routing, window registry
│   │   ├── modules/          # Feature modules and workflows
│   │   └── shared/           # Reusable renderer API, UI, layout, and utilities
│   └── shared/               # Shared types, IPC API contracts, utilities, and tests
├── images/                   # Local client and item image storage
├── package.json              # npm scripts and dependencies
├── package-lock.json         # Locked dependency tree
├── tsconfig.json             # Shared TypeScript config
└── tsconfig.main.json        # Main-process TypeScript config
```

## Main Process

`src/main` owns Electron startup, native windows, menu actions, IPC handler registration, database access, and server-side business rules.

```text
src/main/
├── database/
│   ├── schema/
│   │   ├── client/
│   │   ├── employee/
│   │   ├── item/
│   │   └── ticket/
│   ├── seed/
│   ├── connection.ts
│   ├── initialize.ts
│   └── runInit.ts
├── ipc/
│   ├── channels.ts
│   ├── register.ts
│   └── window.handlers.ts
├── modules/
│   ├── clients/
│   ├── employees/
│   ├── items/
│   ├── reports/
│   └── tickets/
├── shared/
├── window/
└── index.ts
```

Each domain module keeps related IPC handlers, services, repositories, input validation/mapping, and module exports together. A typical request path is:

```text
renderer module api -> window.electronAPI -> main IPC handler -> service -> repo -> database
```

## Renderer Process

`src/renderer` is the React UI. It is organized by app orchestration first, feature modules second, and shared UI/helpers last.

```text
src/renderer/
├── app/                      # React mount, app/window selection, main shell
│   ├── main/                 # Main window app, layout, hooks, and shell UI
│   │   └── shell/
│   └── window-host/
├── modules/
│   ├── admin/                # Holiday, location, hair color, eye color admin windows
│   ├── clients/              # Client page, hook, API wrapper, and components
│   ├── employees/            # Employee API and admin window
│   ├── history/              # Ticket history workflow
│   ├── items/                # Item API, dialogs, load/search windows
│   ├── reports/              # Report secondary-window screens
│   ├── tickets/              # Ticket API, menu screens, payment workflow
│   └── transactions/         # Active pawn/sell transaction workflow
├── shared/
│   ├── api/
│   ├── layout/
│   ├── menu-action/
│   ├── ui/
│   └── utils/
```

For more renderer-specific conventions, see `src/renderer/README.md`.

## Shared Code

`src/shared` contains code used by both the main and renderer processes:

```text
src/shared/
├── ipc/                      # Typed IPC API contracts
├── test/                     # Shared test helpers
├── types/                    # Domain and payload types
└── utils/                    # Pure shared utilities and tests
```

Calculation and formatting logic that is independent of Electron should live here so it can be tested without launching the desktop app.

## Development

Install dependencies:

```bash
npm install
```

Run the Electron app in development:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run type checks:

```bash
npm run typecheck:main
npm run typecheck:renderer
```

Build the app:

```bash
npm run build
```

Initialize the database:

```bash
npm run db:init
```

Format the codebase:

```bash
npm run format
```

## Generated And Local Data

```text
.electron-build/             # Generated Electron build output used during dev/build
images/                      # Local client and item images
node_modules/                # Installed npm dependencies
test-results/                # Local test output
```

These directories are generated or runtime data. They are not the primary source structure.
