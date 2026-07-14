# Ticket Migration

Generated: 2026-07-14T16:35:05.850Z

Source: `SA100TRAN` in `superpawnconv.mdb`

Target database: `pawnsystemdb_migration`

Mode: commit

## Summary

| Metric | Count |
| --- | ---: |
| Legacy ticket rows scanned | 631,995 |
| Duplicate earlier rows skipped | 5 |
| Rows inserted | 631,990 |
| Target ticket rows after commit | 631,990 |
| Missing clients mapped to Unknown Legacy Client | 6 |

## Blockers

_none_

## Statuses

```txt
 484443  pawned_picked_up
 129850  pawned_expired
  14944  sold_expired
   2753  pawned
```

## Status Rules

```txt
 472954  P treated as P with payback
 129850  E
  14944  E at BIWK
  10771  B treated as B
   2738  P treated as active P
    693  S/stolen with payback
     25  A treated as B
     15  S/stolen active
```

## Amount Sources

```txt
 607369  pawn amount
  13647  sale amount from amount paid
  10974  zero amount allowed
```

## Pickup Amount Paid Sources

```txt
 472650  SA100AMOUNPB
 147547  not picked up
  10775  SA100AMOUNTPAY fallback
   1018  zero pickup amount
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
