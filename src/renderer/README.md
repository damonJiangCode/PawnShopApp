# Renderer Code Map

This folder is the React side of the app. The structure is feature-first:
most code should live in the module that owns the screen, workflow, or data it
is working with.

## Top Level

```text
renderer/
  boot/
  main/
  windows/
  modules/
  shared/
```

- `boot/` starts the renderer and chooses whether to show the main app or a window view.
- `main/` owns the main app shell.
- `windows/` chooses which non-main window view to show.
- `modules/` contains feature and workflow code.
- `shared/` contains only renderer utilities that are truly reused across modules.

## `boot/`

`boot/` owns renderer startup and top-level routing.

```text
boot/
  index.tsx
  RendererApp.tsx
```

- `index.tsx`: mounts React into the DOM.
- `RendererApp.tsx`: chooses `MainApp` or `WindowView` from the URL.

## `main/`

`main/` owns the main app shell.

```text
main/
  MainApp.tsx
  MainLayout.tsx
  useMainLayout.ts
  shell/
```

- `MainApp.tsx`: main window entry.
- `MainLayout.tsx`: tabs, top bar, and main page layout.
- `useMainLayout.ts`: main app state and actions.
- `shell/`: top-bar and shell-only controls.

Do not put feature business logic in `boot/` or `main/`. If logic belongs to clients,
tickets, items, payment, history, or admin, put it in the matching module.

## `windows/`

`windows/` owns routing for non-main app windows.

```text
windows/
  WindowLayout.tsx
  WindowView.tsx
  windowRegistry.ts
```

- `WindowLayout.tsx`: common frame for non-main app windows.
- `WindowView.tsx`: reads the URL `screen` value and renders the matching window component.
- `windowRegistry.ts`: maps each screen key to its component.

The actual window content stays in the owning module. For example, ticket
search lives in `modules/tickets/menu-actions`, payment lives in
`modules/tickets/payment`, and item load lives in `modules/items/item-load`.

## `modules/`

Modules are either domain modules or workflow modules.

Domain modules:

- `clients/`: client API wrapper, client page, dialogs, profile/results UI, client image/search hooks.
- `tickets/`: ticket API wrapper, ticket dialogs, ticket tables, ticket menu windows, payment workflow, print helper.
- `items/`: item API wrapper, item dialogs, item tables, item load window, item search window.
- `employees/`: employee API wrapper and employee admin window.
- `admin/`: color, holiday, and location admin windows.
- `reports/`: report secondary windows.

Workflow modules:

- `transactions/`: active pawn/sell page, transaction hook, transaction actions.
- `history/`: history page and history hook.

Common local file roles:

- `*.api.ts`: renderer wrapper around `getAppApi()?.domain`.
- `*.helpers.ts`: pure local helpers for that module.
- `*.types.ts`: local UI/workflow types, not database models.
- `*Layout.ts`: module-owned layout constants or layout components.
- `components/`: reusable pieces inside that module.
- `hooks/`: React hooks owned by that module.
- `pages/`: primary page components.
- `menu-actions/`: secondary windows opened from menu/action buttons.

If a component is only used by one module, keep it in that module. Do not move
it into `shared/` just because it looks reusable.

## `shared/`

`shared/` is for renderer code that is genuinely cross-module.

```text
shared/
  api/
    app.api.ts
  components/
    CellTooltip.tsx
    ClientBar.tsx
  styles/
    layoutSizing.ts
    actionButtonStyles.ts
  utils/
    formError.ts
    formatters.ts
    imageDataUrl.ts
```

- `api/app.api.ts`: declares `window.appAPI` on the renderer side and exposes `getAppApi()`.
- `components/`: small cross-module React components.
- `styles/`: shared sizing and style helpers used by more than one module.
- `utils/`: pure formatting, image, and form-error helpers.

Avoid calling `window.appAPI` directly from components. Use module API files or
`getAppApi()` inside module-level code:

```text
component/page -> module api or hook -> getAppApi().domain -> preload -> main handler -> service -> repo/db
```

## Shared Models And Contracts

Renderer code imports app-wide data shapes from `src/shared`, not from
`renderer/shared`.

- `src/shared/models/`: app data models such as `Client`, `Ticket`, `Item`.
- `src/shared/contracts/`: IPC/API inputs and response shapes.
- `src/shared/api/`: shape of `AppApi`, including `client`, `ticket`, `item`, `window`.

Renderer `shared/` is only for renderer helpers. App-wide model/API contracts
belong in `src/shared`.

## Naming Rules

- API methods should be action-first: `searchClients`, `createPawnTicket`, `loadItemsByTicket`.
- Renderer API files should use `*.api.ts`: `client.api.ts`, `ticket.api.ts`.
- Window frame layout belongs in `windows/WindowLayout.tsx`, not `shared/`.
- Top-level apps end in `App`: `RendererApp`, `MainApp`.
- Domain components should keep domain words when ambiguity is likely:
  `TransactionTicketsTable`, `HistoryTicketsTable`, `ItemActionsLayout`.
- If a layout belongs to one module, keep it in that module:
  `items/components/shared/ItemActionsLayout.tsx`,
  `tickets/components/shared/TicketActionsLayout.tsx`.

## Placement Rules

1. If it belongs to one domain, put it in that domain module.
2. If it belongs to one workflow, put it in that workflow module.
3. If it is used by multiple modules and has no domain ownership, put it in `renderer/shared`.
4. If it defines app data shape or IPC/API shape, put it in `src/shared`, not `renderer/shared`.
5. If a file grows too large, split local helpers, actions, columns, dialog sections, or hooks next to the owner.

The goal is that review usually starts in one module and only leaves it for
`src/shared` contracts/models or small renderer helpers.
