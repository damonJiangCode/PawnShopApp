# Migration Status

Generated: 2026-07-09

This is the index for the migration workspace. Reports are kept to one file per migration subject.

## Reports

```txt
static-migration.md     ID type, hair color, and eye color mapping
city-migration.md       City/province/country reference migration
location-migration.md   Store/location mapping
category-migration.md   Item category/subcategory mapping
client-migration.md     Client migration plus client photo export
employee-migration.md   Employee migration and ticket employee backfill rule
ticket-migration.md     Ticket migration
```

## Scripts

```txt
setup-migration-db.sh       Create/reset the isolated migration database
migrate-static.cjs          Static-data comparison report
migrate-city.cjs            City/province/country migration
migrate-client.cjs          Client migration; preview unless --commit is passed
migrate-client-photos.cjs   Client photo export; DB update when --update-db is passed
migrate-employee.cjs        Employee migration; preview unless --commit is passed
migrate-ticket.cjs          Ticket migration; preview unless --commit is passed
```

## Completed

- Static mapping for ID types, hair colors, and eye colors is approved.
- City migration is complete in `pawnsystemdb_migration`.
- Location mapping is approved.
- Category/subcategory mapping is approved.
- Client migration is complete, including address apartment merge, notes, and photo path update.
- Employee migration is complete, including employee `999` and terminated-password handling.
- Ticket migration is complete, including zero amounts, status mapping, pickup amount paid, missing clients, and employee-name backfill.

## Pending

- Item dry-run and migration.
- Item photo export from `Pictureconv.mdb.WC405ITEMPIC`.
