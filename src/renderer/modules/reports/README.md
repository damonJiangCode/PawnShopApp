# Reports Module

`reports/` owns report windows opened from menu actions.

## Structure

```text
reports/
  menu-actions/
    BuybackReportWindow.tsx
    DailyReportWindow.tsx
    InterestReportWindow.tsx
    PoliceXmlWindow.tsx
```

## Main Flow

```text
report window
  -> ticket.api or report api wrapper
  -> preload
  -> report.handlers.ts
  -> report.service.ts
  -> report.repo.ts
```

## Review Notes

When reviewing this module, check:

- date range inputs are passed correctly
- money totals match ticket/payment service behavior
- generated police XML uses migrated category/location data correctly
