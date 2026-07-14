# Final Migration Runbook

Use this file for the final production migration after the last legacy Access export is copied into `migration-data/source/`.

The goal is to make the final run repeatable: replace the source files, reset the migration database, run scripts in order, verify reports, test the app against the migrated database, then cut over.

## Source Files

Place the latest legacy exports here with these exact names:

```txt
migration-data/source/superpawnconv.mdb
migration-data/source/Pictureconv.mdb
```

`superpawnconv.mdb` is used for clients, cities, employees, tickets, items, categories, locations, and client photos.

`Pictureconv.mdb` is used for item photos.

## Preflight

Run from the project root:

```bash
cd /Users/damon/Documents/PawnShopApp
npm install
which mdb-export
npm run build
```

If `mdb-export` is missing, install `mdbtools` before continuing.

Before the final cutover, stop the old app or make sure no one is writing new tickets in the old system while the final Access files are being copied.

## Reset Migration Database

The migration scripts default to `pawnsystemdb_migration`.

For a clean final run, reset the migration database before running any commit script:

```bash
psql -h localhost -p 5432 -U "$(whoami)" -d postgres \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'pawnsystemdb_migration';"

dropdb -h localhost -p 5432 -U "$(whoami)" --if-exists pawnsystemdb_migration

MIGRATION_DB_NAME=pawnsystemdb_migration \
DB_HOST=localhost \
DB_PORT=5432 \
DB_USER=moneyexpress \
DB_PASSWORD=0236 \
ADMIN_DB_USER="$(whoami)" \
bash migration-data/scripts/setup-migration-db.sh
```

This creates `pawnsystemdb_migration`, initializes the current app schema, and loads the current seed data.

## Clean Photo Exports

Remove old test exports before the final photo export:

```bash
rm -rf migration-data/exports/client-photos migration-data/exports/item-photos
mkdir -p migration-data/exports/client-photos migration-data/exports/item-photos
```

This keeps final image paths clean and prevents duplicate suffixes like `_2` or `_3`.

## Migration Order

Run the scripts in this order.

### 1. Static Reference Check

```bash
node migration-data/scripts/migrate-static.cjs
```

Review:

```txt
migration-data/reports/static-migration.md
```

Stop if the new source contains unmapped ID types, hair colors, eye colors, locations, categories, or subcategories that should not map to existing rules.

### 2. City Migration

```bash
node migration-data/scripts/migrate-city.cjs
```

Review:

```txt
migration-data/reports/city-migration.md
```

Expected final rule: Canadian cities are preserved; non-Canada legacy locations map to `OTHER / OTHER / OTHER`.

### 3. Client Migration

Preview first:

```bash
node migration-data/scripts/migrate-client.cjs
```

Review:

```txt
migration-data/reports/client-migration.md
```

Commit only when blockers are clear:

```bash
node migration-data/scripts/migrate-client.cjs --commit
```

Known rules:

- Preserve legacy client numbers unless a source client number is duplicated.
- Duplicate legacy client numbers get a new client number and keep the same copied client data.
- Missing DOB defaults to `1900-01-01`.
- Missing client for legacy tickets maps to `Unknown Legacy Client`.
- Legacy apartment/unit field is merged into the front of `address`.
- Legacy disabled flag is ignored.

### 4. Client Photo Export

```bash
node migration-data/scripts/migrate-client-photos.cjs --update-db
```

Review the `Client Photo Export` section in:

```txt
migration-data/reports/client-migration.md
```

Photos are exported to:

```txt
migration-data/exports/client-photos/
```

The `client.image` path is updated to point to the exported local file.

### 5. Employee Migration

Preview first:

```bash
node migration-data/scripts/migrate-employee.cjs
```

Review:

```txt
migration-data/reports/employee-migration.md
```

Commit:

```bash
node migration-data/scripts/migrate-employee.cjs --commit
```

Known rules:

- Employee `999` is the legacy fallback employee.
- Gender defaults to `unknown`.
- Terminated employees are migrated so their password cannot be used for new tickets.
- No employee photo field is migrated.

### 6. Ticket Migration

Preview first:

```bash
node migration-data/scripts/migrate-ticket.cjs
```

Review:

```txt
migration-data/reports/ticket-migration.md
```

Commit:

```bash
node migration-data/scripts/migrate-ticket.cjs --commit
```

Known rules:

- Legacy transaction number becomes `ticket.ticket_number`.
- Duplicate ticket number keeps the later/second source row.
- Missing legacy client maps to `Unknown Legacy Client`.
- Amount `0` is allowed for legacy signature/identity tickets.
- Status mapping is limited to the app's five statuses:
  - `pawned`
  - `pawned_expired`
  - `pawned_picked_up`
  - `sold`
  - `sold_expired`
- `BIWK` location counts as a sell ticket.
- Active ticket page should display only `pawned` and `sold`.
- History page should display only `pawned_expired`, `pawned_picked_up`, and `sold_expired`.
- History status display:
  - `E` for `pawned_expired` and `sold_expired`
  - `P` for `pawned_picked_up`
- `pickup_amount_paid` rule:
  - use `SA100AMOUNPB` when greater than `0`
  - otherwise use `SA100AMOUNTPAY` when greater than `0`
  - otherwise use `0`
- `partial_payment` is only a record field and must not reduce payment calculations.
- After commit, the ticket sequence must be set to the max migrated ticket number.

### 7. Item And Ticket-Item Migration

Preview first:

```bash
node migration-data/scripts/migrate-item.cjs
```

Review:

```txt
migration-data/reports/item-migration.md
```

Commit:

```bash
node migration-data/scripts/migrate-item.cjs --commit
```

Known rules:

- `WC400INVEN` is the primary item source.
- `SA110ITEM` is used as a fallback when needed.
- Blank descriptions default to `Unknown item`.
- Invalid legacy item number `0` rows get generated item numbers.
- Category/subcategory mapping is based on the lowest useful legacy category/subcategory, with legacy `OTHER` handled by parent context.
- After commit, the item sequence must be set to the max migrated item number.

### 8. Item Photo Export

```bash
node migration-data/scripts/migrate-item-photos.cjs --update-db
```

Review the `Item Photo Export` section in:

```txt
migration-data/reports/item-migration.md
```

Photos are exported to:

```txt
migration-data/exports/item-photos/
```

The `item.image` path is updated to point to the exported local file.

### 9. Client Statistics Recalculation

Preview first:

```bash
node migration-data/scripts/migrate-client-statistics.cjs
```

Commit:

```bash
node migration-data/scripts/migrate-client-statistics.cjs --commit
```

Rules:

- `redeem_count`: count tickets where `status = 'pawned_picked_up'`.
- `expire_count`: count tickets where `status = 'pawned_expired'`.
- `sell_count`: count tickets where `status in ('sold', 'sold_expired')` or `location = 'BIWK'`.

These values are written into the `client` table so the app does not need to recalculate them on every client page load.

## Validation Queries

Run these against `pawnsystemdb_migration` after all commit scripts finish.

```bash
psql -h localhost -p 5432 -U moneyexpress -d pawnsystemdb_migration
```

Check core counts:

```sql
SELECT COUNT(*) FROM client;
SELECT COUNT(*) FROM employee;
SELECT status, COUNT(*) FROM ticket GROUP BY status ORDER BY status;
SELECT COUNT(*) FROM item;
SELECT COUNT(*) FROM ticket_item;
```

Check ticket and item sequences:

```sql
SELECT last_value FROM pg_sequences
WHERE schemaname = 'public'
  AND sequencename = split_part(pg_get_serial_sequence('ticket', 'ticket_number'), '.', 2);

SELECT MAX(ticket_number) FROM ticket;

SELECT last_value FROM pg_sequences
WHERE schemaname = 'public'
  AND sequencename = split_part(pg_get_serial_sequence('item', 'item_number'), '.', 2);

SELECT MAX(item_number) FROM item;
```

Check client statistics:

```sql
WITH stats AS (
  SELECT
    client_number,
    COUNT(*) FILTER (WHERE status = 'pawned_picked_up')::int AS redeem_count,
    COUNT(*) FILTER (WHERE status = 'pawned_expired')::int AS expire_count,
    COUNT(*) FILTER (WHERE status IN ('sold', 'sold_expired') OR location = 'BIWK')::int AS sell_count
  FROM ticket
  WHERE client_number IS NOT NULL
  GROUP BY client_number
)
SELECT COUNT(*) AS mismatched_clients
FROM client c
LEFT JOIN stats s ON s.client_number = c.client_number
WHERE c.redeem_count <> COALESCE(s.redeem_count, 0)
   OR c.expire_count <> COALESCE(s.expire_count, 0)
   OR c.sell_count <> COALESCE(s.sell_count, 0);
```

Expected result:

```txt
mismatched_clients = 0
```

Check active unknown locations:

```sql
SELECT status, location, COUNT(*)
FROM ticket
WHERE location = 'UNKNOWN'
GROUP BY status, location
ORDER BY status;
```

If active `pawned` tickets have `UNKNOWN`, stop and add the real location before cutover.

Check orphan ticket items:

```sql
SELECT COUNT(*) AS missing_ticket_links
FROM ticket_item ti
LEFT JOIN ticket t ON t.ticket_number = ti.ticket_number
WHERE t.ticket_number IS NULL;

SELECT COUNT(*) AS missing_item_links
FROM ticket_item ti
LEFT JOIN item i ON i.item_number = ti.item_number
WHERE i.item_number IS NULL;
```

Expected result:

```txt
missing_ticket_links = 0
missing_item_links = 0
```

## App Smoke Test

Point the app to `pawnsystemdb_migration`:

```bash
DB_NAME=pawnsystemdb_migration npm run dev
```

Smoke test:

- Search a known migrated client.
- Confirm client photo displays.
- Confirm client statistics match the recalculation report.
- Search a known migrated ticket near the newest ticket number.
- Confirm active transaction page only shows `pawned` and `sold`.
- Confirm history page shows latest tickets at the bottom and uses `E` or `P`.
- Confirm item photos display.
- Create a test pawn/sell ticket in the migration database and confirm the next ticket number continues after the max migrated ticket number.

Do not use this test ticket database as production if test tickets were created. Reset and rerun the final migration before cutover.

## Cutover

After validation and smoke testing pass, create a final backup before replacing production:

```bash
mkdir -p migration-data/backups

pg_dump -h localhost -p 5432 -U moneyexpress -Fc \
  -f migration-data/backups/pawnsystemdb-before-final-migration.dump \
  pawnsystemdb
```

Recommended cutover method:

1. Stop the app.
2. Confirm no one is using the old system.
3. Reset and rerun the full migration one final time from the latest Access files.
4. Run all validation queries.
5. Back up the old production database.
6. Replace production from `pawnsystemdb_migration`.

Production replacement command:

```bash
psql -h localhost -p 5432 -U "$(whoami)" -d postgres \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'pawnsystemdb';"

dropdb -h localhost -p 5432 -U "$(whoami)" --if-exists pawnsystemdb
createdb -h localhost -p 5432 -U "$(whoami)" -O moneyexpress pawnsystemdb

pg_dump -h localhost -p 5432 -U moneyexpress -Fc pawnsystemdb_migration \
  | pg_restore -h localhost -p 5432 -U moneyexpress -d pawnsystemdb
```

Then start the app with:

```txt
DB_NAME=pawnsystemdb
```

## Stop Conditions

Stop and fix mapping or code before cutover if any of these happen:

- Any commit script reports blockers.
- New source values appear that are not covered by the approved static, location, or category mappings.
- Active `pawned` tickets map to `UNKNOWN` location.
- Client statistic mismatch count is not `0`.
- Ticket or item sequence is lower than the max migrated number.
- Client or item photo paths are blank for records that exported a photo.
- App smoke test cannot load migrated clients, active tickets, history, item photos, or new ticket numbers correctly.

## Reports To Keep

After the final run, these are the only reports that should matter:

```txt
migration-data/reports/migration-status.md
migration-data/reports/static-migration.md
migration-data/reports/city-migration.md
migration-data/reports/location-migration.md
migration-data/reports/category-migration.md
migration-data/reports/client-migration.md
migration-data/reports/employee-migration.md
migration-data/reports/ticket-migration.md
migration-data/reports/item-migration.md
migration-data/reports/final-migration-runbook.md
```
