# Feature Flow Map

This file is the first stop when tracing how a feature works.

Use it to find the code path before opening individual files.

## Main Workspace Startup

```text
src/renderer/boot/index.tsx
  -> RendererApp.tsx
  -> WorkspaceApp.tsx
  -> WorkspaceLayout.tsx
  -> useWorkspaceLayout.ts
```

Purpose:

- boot React
- decide main workspace vs child window
- keep current tab
- keep selected client
- keep selected transaction ticket
- open secondary windows

## Client Search

```text
SearchBar
  -> useWorkspaceLayout.handleSearch
  -> ClientPage
  -> useClientPage / useClientSearch
  -> client.api.ts
  -> appAPI.client.searchClients
  -> preload/index.cjs
  -> client.handlers.ts
  -> client.service.ts
  -> client.repo.ts
```

Important files:

- `src/renderer/workspace/shell/SearchBar.tsx`
- `src/renderer/workspace/useWorkspaceLayout.ts`
- `src/renderer/modules/clients/pages/ClientPage.tsx`
- `src/renderer/modules/clients/hooks/useClientPage.ts`
- `src/renderer/modules/clients/hooks/useClientSearch.ts`
- `src/main/modules/clients/client.handlers.ts`
- `src/main/modules/clients/client.service.ts`
- `src/main/modules/clients/client.repo.ts`

## Add Or Edit Client

```text
ClientPage
  -> ClientAddEditDialog
  -> clientDialogValidation
  -> client.api.ts
  -> preload/index.cjs
  -> client.handlers.ts
  -> client.input.ts
  -> client.service.ts
  -> client.repo.ts
```

Important details:

- client photo capture is in `ClientPhotoCapture.tsx`
- client image saving uses `main/shared/imageStorage.ts`
- client image display uses the controlled `pawn-image://` protocol
- app-wide client shape is `shared/models/client.model.ts`
- create/update inputs are in `shared/payload-contracts/client.contract.ts`

## Transaction Page Load

```text
WorkspaceLayout tab 1
  -> TransactionPage
  -> useTransactionPage
  -> ticket.api.ts / item.api.ts
  -> preload/index.cjs
  -> ticket.handlers.ts / item.handlers.ts
  -> services
  -> repos
```

Purpose:

- show active tickets
- active ticket statuses are `pawned` and `sold`
- show items for selected ticket
- create pawn/sell tickets
- edit, convert, expire, pickup, transfer tickets

Important files:

- `src/renderer/modules/transactions/pages/TransactionPage.tsx`
- `src/renderer/modules/transactions/hooks/useTransactionPage.ts`
- `src/renderer/modules/transactions/handlers/transactionTicketHandlers.ts`
- `src/renderer/modules/transactions/handlers/transactionItemHandlers.ts`
- `src/renderer/modules/tickets/components/transaction/TransactionTicketsPanel.tsx`
- `src/renderer/modules/items/components/transaction/TransactionItemsPanel.tsx`

## Create Pawn Ticket

```text
TransactionPage
  -> TicketPawnDialog
  -> useTransactionPage.handlePawnSave
  -> ticket.api.createPawnTicket
  -> appAPI.ticket.createPawnTicket
  -> preload ADD_PAWN_TICKET
  -> ticket.handlers.ts
  -> ticket.service.ts
  -> ticket.repo.ts
  -> ticketApi.printEnvelopeTicket
```

Important rules:

- zero amount is allowed by database, but UI confirms before creating.
- one-time fee and partial payment can be selected manually but skipped during tab flow.
- after pawn/sell, the new ticket should be selected in Transaction.
- ticket number should come from the database sequence, not start from 1.

## Create Sell Ticket

```text
TransactionPage
  -> TicketSellDialog
  -> useTransactionPage.handleSellSave
  -> ticket.api.createSellTicket
  -> preload ADD_SELL_TICKET
  -> ticket.handlers.ts
  -> ticket.service.ts
  -> ticket.repo.ts
```

Important rules:

- sell tickets use status `sold`.
- transaction table shows active `pawned` and `sold` tickets.
- location identifies the physical location/type for active tickets.

## Edit Ticket

```text
TransactionTicketActions
  -> TicketEditDialog
  -> useTransactionPage.handleEditSave
  -> ticket.api.updateTicket
  -> preload UPDATE_TICKET
  -> ticket.handlers.ts
  -> ticket.service.ts
  -> ticket.repo.ts
```

Important rules:

- edit must preserve selected ticket after save.
- sell ticket edit should work like pawn ticket edit.
- number inputs should not change from mouse wheel scrolling.

## History Page Load

```text
WorkspaceLayout tab 2
  -> HistoryPage
  -> useHistoryPage
  -> ticket.api.loadTickets
  -> item.api.loadItems
```

Purpose:

- show historical tickets only
- history statuses are `pawned_expired`, `pawned_picked_up`, `sold_expired`
- newest history ticket should be selected and visible by default

Important files:

- `src/renderer/modules/history/pages/HistoryPage.tsx`
- `src/renderer/modules/history/hooks/useHistoryPage.ts`
- `src/renderer/modules/tickets/components/history/HistoryTicketsPanel.tsx`
- `src/renderer/modules/tickets/components/history/HistoryTicketsTable.tsx`
- `src/renderer/modules/items/components/history/HistoryItemsPanel.tsx`

## Repawn From History

```text
HistoryTicketsPanel Repawn button
  -> useHistoryPage.handleRepawn
  -> open Item Search window immediately with source ticket items
  -> TicketPawnDialog opens
  -> Save creates pawn ticket
  -> print envelope ticket
  -> Workspace switches to Transaction
  -> new ticket becomes selected
  -> Item Search window can add checked items to selected Transaction ticket
```

Important rules:

- Item Search opens before the new ticket is created so staff can check item availability.
- Item Search opens near the top-left of the desktop, not centered.
- Add To Ticket stays disabled unless the main workspace is on Transaction and a transaction ticket is selected.

Important files:

- `src/renderer/modules/history/hooks/useHistoryPage.ts`
- `src/renderer/workspace/useWorkspaceLayout.ts`
- `src/main/window/window.handlers.ts`
- `src/renderer/modules/items/menu-actions/item-search-window/ItemSearchWindow.tsx`
- `src/renderer/modules/items/menu-actions/item-search-window/useItemSearchWindow.ts`

## Load Items From History

```text
HistoryTicketsPanel Load button
  -> useHistoryPage.handleLoad
  -> Workspace opens/reuses Item Search window
  -> Item Search window receives focus
  -> source ticket items are appended without duplicates
  -> Add To Ticket waits for Transaction page + selected ticket
```

Purpose:

- load items from one or more history tickets into the same Item Search window
- use checkbox selection for Add To Ticket
- use row selection for image preview

## Item Search Window

```text
Side button Item
  -> useWorkspaceLayout.handleOpenItemSearch
  -> appAPI.window.openItemSearchWindow
  -> preload OPEN_ITEM_SEARCH_WINDOW
  -> window.handlers.ts
  -> openFeatureWindow screen=item-search
  -> WindowView
  -> windowRegistry
  -> ItemSearchWindow
  -> useItemSearchWindow
```

Search modes:

- Detail search: category + subcategory + brand + model + serial number.
- Item number search: exact item number.

Important rules:

- Detail fields use AND search.
- At least one search field is required.
- Switching search mode should not clear checked rows.
- New search keeps checked rows and replaces unchecked search results.
- Go To Ticket requires exactly one checked item.
- Add To Ticket supports multiple checked items.
- Only row selection changes the preview image.

## Payment Window

```text
Side button Payment
  -> useWorkspaceLayout.handlePayment
  -> appAPI.window.openPaymentWindow
  -> preload OPEN_PAYMENT_WINDOW
  -> window.handlers.ts
  -> openFeatureWindow screen=payment
  -> WindowView
  -> PaymentWindow
  -> usePaymentWindow
  -> ticket.api payment methods
```

Important files:

- `src/renderer/modules/tickets/payment/PaymentWindow.tsx`
- `src/renderer/modules/tickets/payment/usePaymentWindow.tsx`
- `src/renderer/modules/tickets/payment/payment.columns.tsx`
- `src/main/modules/tickets/ticket-payment.service.ts`

## Ticket Search Window

```text
Side button Ticket
  -> useWorkspaceLayout.handleOpenTicketSearch
  -> appAPI.window.openTicketSearchWindow
  -> window.handlers.ts
  -> WindowView
  -> TicketSearchWindow
```

Important rule:

- if ticket is not found, focus should return to the search input.

## Print Envelope Ticket

```text
create pawn ticket / repawn
  -> ticketApi.printEnvelopeTicket
  -> print/ticketPrintTemplate.ts
  -> browser print window
```

Important files:

- `src/renderer/modules/tickets/ticket.api.ts`
- `src/renderer/modules/tickets/print/ticketPrintTemplate.ts`

Important rules:

- template is printed on colored paper, so template itself should not add paper background color.
- layout should match the envelope ticket format as closely as possible.

## Client And Item Photos

Client photo:

```text
ClientPhotoCapture
  -> client.api.saveClientImage
  -> preload SAVE_CLIENT_IMAGE
  -> client.handlers.ts
  -> imageStorage.ts
  -> client.image_path in database
```

Item photo:

```text
ItemPhotoCapture
  -> item.api.saveItemImage
  -> preload SAVE_ITEM_IMAGE
  -> item.handlers.ts
  -> imageStorage.ts
  -> item.image_path in database
```

Photo display:

```text
stored image_path
  -> renderer getImageUrl
  -> pawn-image:// URL
  -> main image.protocol.ts
  -> imageStorage.resolveImageFile
  -> Chromium image response
```

Important rules:

- database stores local image path, not raw image data.
- renderer never receives raw image bytes through IPC.
- main only serves images from approved client, item, and migration photo directories.

## Reference Data Admin

Admin windows:

- colors
- holiday dates
- locations
- employees

Flow:

```text
admin window
  -> module api
  -> preload
  -> main handler
  -> service/repo
  -> seed/schema tables
```

Important files:

- `src/renderer/modules/admin`
- `src/renderer/modules/employees/admin`
- `src/main/modules/clients/client-reference.service.ts`
- `src/main/modules/tickets/ticket-admin.service.ts`
- `src/main/database/seed`
