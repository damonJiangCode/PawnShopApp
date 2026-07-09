# Client City Migration

Generated: 2026-07-09T21:24:56.990Z

Scope: migrate city/province/country values actually used by legacy `AR200CLIENT` into the migration database `city` table, then remove current city rows that overlap those legacy cities but are not legacy-used.

Target database:

```txt
localhost:5432/pawnsystemdb_migration as moneyexpress
```

## Summary

```txt
Legacy client rows: 54744
Distinct legacy-used city combos: 596
City rows before migration: 2136
Legacy-used combos inserted: 0
Legacy client rows covered by inserted combos: 0
Overlapping unused current city rows deleted: 0
City rows after cleanup: 2136
Legacy-used combos still missing: 0
```

## Deleted Overlapping Unused Current Rows

_none_

## Inserted Legacy-Used City Combos

_none_


## Still Missing

_none_
