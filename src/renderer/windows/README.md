# Windows Code Map

`windows/` routes and frames non-main app windows.

It does not own the business content of those windows.

## Structure

```text
windows/
  WindowLayout.tsx
  WindowView.tsx
  windowRegistry.ts
```

## Responsibilities

- `WindowView.tsx`: reads the `screen` value from the URL.
- `windowRegistry.ts`: maps screen keys to window components.
- `WindowLayout.tsx`: provides a common window frame.

## Flow

```text
main/window/openWindowHost.ts
  -> renderer URL with window=host and screen=...
  -> RendererApp
  -> WindowView
  -> windowRegistry
  -> owning module component
```

## Rule

Actual window content belongs in the owning module:

- payment: `modules/tickets/payment`
- ticket search: `modules/tickets/menu-actions`
- item search: `modules/items/menu-actions/item-search-window`
- reports: `modules/reports/menu-actions`
- admin: `modules/admin` or `modules/employees/admin`
