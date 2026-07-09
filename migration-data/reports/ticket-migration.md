# Ticket Migration

Generated: 2026-07-09T20:49:34.965Z

Source: `SA100TRAN` in `superpawnconv.mdb`

Target database: `pawnsystemdb_migration`

Mode: commit

## Summary

| Metric | Count |
| --- | ---: |
| Legacy ticket rows scanned | 607,896 |
| Duplicate earlier rows skipped | 5 |
| Rows inserted | 607,891 |
| Target ticket rows after commit | 607,891 |
| Missing clients mapped to Other Migration | 6 |

## Blockers

_none_

## Statuses

```txt
 468050  picked_up
 124698  pawn_expired
  12799  sell_expired
   2344  pawned
```

## Status Rules

```txt
 456671  P treated as P with payback
 124698  E
  12799  E at BIWK
  10663  B treated as B
   2342  P treated as active P
    691  S/stolen with payback
     25  A treated as B
      2  S/stolen active
```

## Amount Sources

```txt
 585432  pawn amount
  11599  sale amount from amount paid
  10860  zero amount allowed
```

## Pickup Amount Paid Sources

```txt
 456368  SA100AMOUNPB
 139841  not picked up
  10668  SA100AMOUNTPAY fallback
   1014  zero pickup amount
```

## Warnings

```txt
    533  due date derived from transaction date plus due days
      6  client missing from target mapped to Other Migration
      5  duplicate earlier row skipped
```

## Employee Placeholder

`employee_name` is temporarily stored as `Legacy Employee {legacy_employee_number}`.
After employee migration is complete, update tickets by re-reading
`SA100EMPLOYEENO` / `SA100EMPLOYEENO2` and replacing this placeholder with the
resolved employee name.
