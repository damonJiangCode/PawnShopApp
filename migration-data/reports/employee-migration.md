# Employee Migration

Generated: 2026-07-09T21:23:43.746Z

Source: `EM200EMPLOYEE` in `superpawnconv.mdb`

Target database: `pawnsystemdb_migration`

Mode: commit

## Summary

| Metric | Count |
| --- | ---: |
| Legacy employee rows | 101 |
| Employees prepared | 102 |
| Terminated employees | 16 |
| Default DOB rows | 3 |
| Employees with address | 78 |
| Employees with phone | 86 |
| Employees with email | 40 |

## Rules

- Add placeholder employee `999 / Legacy Employee` for legacy tickets that used employee number 999.
- Set `gender` to `unknown` for all migrated employees.
- Set missing or invalid birth dates to `1900-01-01`.
- Map `EM200Terminated = 1` to `is_terminated = true`; terminated employee passwords cannot authorize app actions.
- No employee photo field is migrated because `EM200PICTURE` has no usable photo rows.
- After commit, ticket `employee_name` placeholders are backfilled from migrated employee nicknames.
