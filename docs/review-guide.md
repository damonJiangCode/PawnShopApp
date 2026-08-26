# Code Review Guide

Use this order when reviewing changes.

## 1. Start With The Flow

Open `docs/flows.md` first.

Find the feature name and read the listed chain before opening files. This
keeps review focused on the actual user action instead of the folder tree.

## 2. Review Shared Contracts Before Runtime Code

If a change touches communication between renderer and main, review in this
order:

```text
src/shared/models
src/shared/payload-contracts
src/shared/api-contracts
src/preload/index.cjs
src/main/ipc/channels.ts
```

Check:

- method name is action-first
- payload has a clear owner
- renderer and preload expose the same shape
- IPC channel name matches the action
- no business logic was put into preload

## 3. Review Main Process Flow

For database or business behavior, review in this order:

```text
handler
input
service
repo
mapper
database schema
```

Check:

- handler only receives and returns
- input validation is explicit
- service owns rules and transactions
- repo owns SQL
- mapper owns row-to-model conversion
- schema constraints match the service rule

## 4. Review Renderer Flow

For UI behavior, review in this order:

```text
page/window
hook
handlers
dialogs/components
module api
shared renderer helpers
```

Check:

- page/window reads clearly as the screen
- hook owns state, data loading, and creates handlers
- handlers make UI state changes explicit
- helpers are pure and do not call APIs or set React state
- dialogs do not call database APIs directly unless already established locally
- reusable pieces are not moved to shared too early

Renderer naming standard:

```text
hook = owns state, loads data, creates handlers
handler = handles user action, may call API and set state
helper = pure function, no API call, no setState, no side effect
```

## 5. Review Styling Last

After behavior is understood, review layout and styling.

Check:

- no accidental scroll traps
- tables show enough rows
- selected rows are visible after data reload
- buttons are disabled when action context is unsafe
- form fields show errors directly on the field when possible

## 6. Common Risk Areas

Ticket/money:

- amount calculation
- interest calculation
- partial payment rule
- pickup amount paid
- ticket status transitions
- selected ticket after save

History:

- newest ticket selected and visible
- only history statuses appear
- repawn does not duplicate item rows
- load window add button stays disabled until Transaction context is safe

Migration:

- sequences reset after manual insert
- unknown client/location/category mappings
- photo path exists and loads
- client statistics recalculated after migration

Windows:

- singleton windows merge payload correctly
- reused window updates itself
- window position does not block the workflow

## 7. Naming Checklist

Use these names consistently:

- `api-contracts`: method shapes for `window.appAPI`
- `payload-contracts`: method inputs and result shapes
- `models`: business data shapes
- `renderer module api`: UI wrapper around `getAppApi()`
- `handler`: IPC receiver
- `service`: business logic
- `repo`: database access
- `mapper`: database row to app model
