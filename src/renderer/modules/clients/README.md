# Clients Module

`clients/` owns client search results, client profile display, add/edit dialogs,
client images, and client renderer API wrapper.

## Structure

```text
clients/
  client.api.ts
  pages/
  hooks/
  data/
    defaultClient.ts
  layout/
    clientLayout.ts
  styles/
    statColors.ts
  components/
    dialogs/
    profile/
    results/
```

## Responsibilities

This module owns:

- client search page content
- client selection display
- add/edit client dialog
- client validation UI
- client image capture/display
- client statistics display
- client renderer API calls

## Main Flow

```text
ClientPage
  -> useClientPage / useClientSearch
  -> client.api.ts
  -> preload
  -> client.handlers.ts
  -> client.service.ts
  -> client.repo.ts
```

## Client Images

Important files:

- `components/dialogs/fields/ClientPhotoCapture.tsx`
- `components/results/ClientImage.tsx`
- `hooks/useClientImage.ts`

Rules:

- database stores image path.
- renderer asks API to load image data.
- photo updated date should be visible but compact.

## Review Notes

When reviewing this module, check:

- name fields are uppercased consistently
- gender displays uppercase and edits correctly
- missing required ID fields show field-level errors
- add client sequence is valid after migration
- image path loads after migration
