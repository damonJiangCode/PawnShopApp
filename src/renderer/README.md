# Renderer Code Map

This folder is the React UI side of the Electron app. It should stay organized by responsibility, not only by file type. The goal is that a future feature has an obvious place to live.

## Top-Level Rule

Keep these layers separate:

- `app/`: app startup, window routing, and whole-app state wiring.
- `pages/`: screen-level pages, such as Client, Transaction, and History.
- `components/`: reusable UI pieces used by pages.
- `services/`: renderer-facing API wrappers around `window.electronAPI`.
- `hooks/`: reusable React behavior.
- `utils/`: pure formatting and form helpers.
- `assets/`: small renderer-only constants or visual assets.

If a file starts doing two jobs, split it. For example, layout should not also own transaction business logic; move that logic into a hook like `useMainLayoutState`.

## `app/`

The `app` folder is for renderer entry orchestration.

```text
app/
  main.tsx
  RendererRoot.tsx
  windowRegistry.tsx
  main/
    MainApp.tsx
    MainLayout.tsx
    useMainLayoutState.ts
  windows/
    itemLoad/
      ItemLoadWindowApp.tsx
```

- `main.tsx`: only mounts React into `#root`.
- `RendererRoot.tsx`: asks which renderer app should run.
- `windowRegistry.tsx`: maps `?window=item-load` style URL keys to window apps.
- `main/MainApp.tsx`: the normal primary app window.
- `main/MainLayout.tsx`: visual shell for the main window.
- `main/useMainLayoutState.ts`: cross-page state and handlers for the main window.
- `windows/*`: independent Electron child-window UIs.

To add a new Electron renderer window:

1. Create `app/windows/newWindow/NewWindowApp.tsx`.
2. Add it to `windowRegistry.tsx`.
3. Load it from Electron with `http://localhost:5173?window=new-window`.
4. Put IPC payload types in `shared/types`, and expose the renderer call through a `services/*Service.ts` file.

## `pages/`

Pages are screen-level containers. They are allowed to load data, hold page-specific state, and connect components together.

Current pages:

- `ClientPage.tsx`: search, select, show profile/results for clients.
- `TransactionPage.tsx`: active pawn/sell transaction workflow.
- `HistoryPage.tsx`: historical tickets/items and repawn/load workflows.

Rule of thumb:

- If it owns a full screen area, it is probably a page.
- If it is a repeated or reusable visual piece, put it in `components/`.
- If it is page logic that makes the page hard to read, move it into a nearby hook.

## `components/`

Components are grouped by domain or UI role.

```text
components/
  appShell/
  client/
  history/
  layout/
  shared/
  transaction/
```

### `components/appShell`

Top-level app shell controls:

- `TopBar`
- `SearchBar`
- `SideButtons`

These belong to the main app shell, not to generic layout.

### `components/layout`

Small reusable layout primitives and sizing constants:

- `ItemActionsLayout`
- `TicketActionsLayout`
- `layoutSizing`

These should not know about pawn tickets, clients, or business behavior. They should receive config and render a consistent layout.

### `components/shared`

Small shared UI components that are used across domains:

- `CellTooltip`
- `ClientBar`
- shared button style constants

Use this folder for simple cross-domain pieces. If a component becomes domain-specific, move it into that domain folder.

### `components/client`

Client-specific UI:

- `dialogs/`: add/edit client dialog and its fields.
- `profile/`: client profile display.
- `results/`: client search result table, image, and actions.

### `components/transaction`

Active transaction UI:

- `dialogs/`: ticket/item dialogs.
- `items/`: transaction item table, image, side panel, actions.
- `tickets/`: transaction ticket table, panel, actions.

### `components/history`

History-only UI:

- `tickets/`: history ticket table/panel/actions.
- `items/`: history item panel/actions.

History components may reuse transaction components when the UI is intentionally identical, such as the shared item table.

## `services/`

Renderer services are the only place pages/components should call `window.electronAPI` directly.

Examples:

- `clientService.ts`
- `ticketService.ts`
- `itemService.ts`
- `windowService.ts`
- `electronApi.ts`

Good pattern:

```ts
page/component -> service -> window.electronAPI -> main handler -> repo/db
```

Avoid calling `window.electronAPI` from random components. It makes the app harder to test and harder to refactor.

## `hooks/`

Hooks hold reusable React behavior:

- `useClientSearch`
- `useClientImage`

Use a hook when behavior needs state/effects and is reused, or when a page is becoming too large.

## `utils/`

Utilities should be pure functions with no React state and no IPC:

- `formatters`
- `formError`
- `defaultClient`

If a helper talks to Electron, it is a service. If it uses React state/effects, it is a hook.

## Naming Rules

- Domain components should include the domain when ambiguity is likely:
  - `TransactionTicketsTable`
  - `HistoryTicketsTable`
  - `TransactionItemsTable`
- Generic layout components should describe the layout role:
  - `ItemActionsLayout`
  - `TicketActionsLayout`
- Window apps should end with `WindowApp`:
  - `ItemLoadWindowApp`

## Maintenance Habit

Before adding a feature, decide which layer it belongs to:

1. Does it create a new top-level Electron window? Use `app/windows` and `windowRegistry`.
2. Is it a full screen/page workflow? Use `pages`.
3. Is it a visual piece used inside a page? Use `components/<domain>`.
4. Is it an API call? Use `services`.
5. Is it reusable React behavior? Use `hooks`.
6. Is it pure formatting/calculation? Use `utils`.

This is the same kind of problem larger teams have. The common solution is not perfect architecture on day one. It is small, written conventions and periodic cleanup before the structure becomes painful.
