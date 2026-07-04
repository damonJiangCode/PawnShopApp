# Renderer Code Map

This folder is the React UI side of the Electron app. It is organized by feature modules first, with shared UI and API helpers separated out.

## Top-Level Rule

- `app/`: renderer startup, window routing, and whole-app state wiring.
- `modules/`: feature/domain code. Put pages, windows, components, hooks, and renderer API wrappers near the feature that owns them.
- `shared/`: reusable renderer UI, layout, formatting, and Electron API access.

If a feature needs client code, start in `modules/clients`. If it needs ticket code, start in `modules/tickets`. Cross-feature pages such as transactions and history live in their own modules and import ticket/item/client components as needed.

## `app/`

The `app` folder is for renderer entry orchestration.

```text
app/
  index.tsx
  RendererRoot.tsx
  windowRegistry.tsx
  main/
    MainApp.tsx
    MainLayout.tsx
    useMainLayout.ts
    shell/
  window-host/
    WindowHostApp.tsx
    windowHostRegistry.ts
```

- `index.tsx`: only mounts React into `#root`.
- `RendererRoot.tsx`: chooses which renderer app should run.
- `windowRegistry.tsx`: maps URL window keys to window apps.
- `main/`: the primary app shell, layout, and shell-only UI.
- `window-host/`: the secondary-window host and screen registry.

## `modules/`

Current modules:

- `clients/`: client API, client page hook, client profile/results/dialogs, client image/search hooks.
- `tickets/`: ticket API, ticket dialogs, ticket tables, ticket menu screens, payment workflow.
- `items/`: item API, item dialogs, item tables, item load screen, item search screen.
- `transactions/`: active pawn/sell transaction page, hook, and action helpers.
- `history/`: history page and hook.
- `employees/`: employee API and employee admin UI.
- `reports/`: report secondary-window screens.
- `admin/`: color, holiday, and location admin screens.

Rule of thumb:

- If it belongs to one feature, keep it inside that module.
- If it is a cross-feature workflow, give the workflow its own module.
- If it is generic UI or formatting, move it to `shared/`.
- If a file approaches 500 lines, split helpers, columns, dialog sections, or action handlers into local sibling files.

## `shared/`

Shared renderer code:

```text
shared/
  api/
  layout/
  menu-action/
  ui/
  utils/
```

- `api/`: `electron.api` and window-level API wrappers.
- `layout/`: small reusable layout primitives and sizing constants.
- `menu-action/`: shared layout for menu-style secondary windows.
- `ui/`: simple cross-domain UI pieces such as `CellTooltip` and `ClientBar`.
- `utils/`: pure formatting and form helpers.

Avoid calling `window.electronAPI` from random components. Use module API files or `shared/api` so the chain stays readable:

```ts
page/component -> module api -> window.electronAPI -> main handler -> service -> repo/db
```

## Naming Rules

- Renderer API wrappers use `*.api.ts`, such as `client.api.ts` and `ticket.api.ts`.
- Local helper files should name what they own, such as `payment.rowActions.ts` or `itemSearchColumns.tsx`.
- Top-level renderer apps should end with `App`; secondary-window entries should use `Screen` or a domain-specific component name.
- Domain components should keep domain words when ambiguity is likely, such as `TransactionTicketsTable` and `HistoryTicketsTable`.

## Maintenance Habit

Before adding a feature, decide its home:

1. New primary workflow? Add or update a module page and hook.
2. New secondary window screen? Put the screen in the owning module and register it in `app/window-host/windowHostRegistry.ts`.
3. New IPC call? Add it to the owning module API and the matching main module.
4. Reusable visual helper? Put it in `shared/ui` or `shared/layout`.
5. Pure formatting/calculation? Put it in `shared/utils`.

The structure is meant to reduce jumping. A normal feature review should start in one module and only leave it for shared utilities or cross-module workflows.
