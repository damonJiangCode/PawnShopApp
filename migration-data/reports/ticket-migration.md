# Ticket Migration

Generated: 2026-09-27T04:12:12.888Z

Source: `SA100TRAN` in `superpawnconv.mdb`

Target database: `pawnsystemdb_migration`

Mode: commit

## Summary

| Metric | Count |
| --- | ---: |
| Legacy ticket rows scanned | 635,855 |
| Duplicate earlier rows skipped | 5 |
| Rows inserted | 635,850 |
| Target ticket rows after commit | 635,850 |
| Missing clients mapped to Unknown Legacy Client | 6 |

## Blockers

_none_

## Statuses

```txt
 486989  pawned_picked_up
 130781  pawned_expired
  15332  sold_expired
   2748  pawned
```

## Status Rules

```txt
 475553  P treated as P with payback
 130781  E
  15332  E at BIWK
  10711  B treated as B
   2740  P treated as active P
    700  S/stolen with payback
     25  A treated as B
      8  S/stolen active
```

## Amount Sources

```txt
 610906  pawn amount
  14030  sale amount from amount paid
  10914  zero amount allowed
```

## Pickup Amount Paid Sources

```txt
 475242  SA100AMOUNPB
 148861  not picked up
  10715  SA100AMOUNTPAY fallback
   1032  zero pickup amount
```

## Interest Paid Month Sources

```txt
 610335  derived from dates and original due days
  15332  sell ticket
  10183  INTFLAG fallback
```

## Warnings

```txt
    533  due date derived from transaction date plus due days
      6  client missing from target mapped to Unknown Legacy Client
      5  duplicate earlier row skipped
```

## Employee Backfill

During insert, `employee_name` is staged as `Legacy Employee {legacy_employee_number}`.
Before commit, migrated employee nicknames are backfilled from the `employee` table.
The ticket number identity sequence is also advanced to the maximum migrated ticket number.
