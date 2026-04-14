Renderer components are organized by business domain first, then by role inside the domain.

Use these rules:

1. Organize primarily by screen or business flow.
   Examples:
   - `client/`
   - `transaction/`
   - `history/`

2. Inside a screen/domain folder, split by role when it helps.
   Examples:
   - `transaction/tickets/`, `transaction/items/`, `transaction/dialogs/`
   - `client/results/`, `client/profile/`, `client/dialogs/`

3. Put truly generic UI in `shared/` or `layout/`.
   Examples:
   - `shared/ClientBar.tsx`
   - `layout/TopBar.tsx`

4. Keep page files as orchestration layers.
   Pages should compose panels, wire handlers, and hold screen-level state.
   Reusable rendering blocks should move into `components/`.

5. Avoid organizing top-level folders only by visual part.
   Folders like `dialogs/`, `tables/`, `panels/` are useful inside a domain, but not as the main global structure.

Current mental model:

- `components/client`: client-only UI
  Example split:
  - `results/` for search results table and side preview
  - `profile/` for the full client profile panel
  - `dialogs/` for client add/edit flows
- `components/transaction`: transaction flow UI
  Example split:
  - `tickets/` for transaction ticket table and actions
  - `items/` for transaction item table and side panel
  - `dialogs/` for transaction dialogs, even if history reuses some of them
- `components/history`: history-page-only UI
- `components/shared`: small shared widgets reused across domains
- `components/layout`: app chrome and layout scaffolding
