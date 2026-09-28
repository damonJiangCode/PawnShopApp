# PawnSystem Dev Docker

## Setup Record (2026-09-27)

Current status: the dev database is running, the migration dump has been restored,
the application login is configured, and the development image copy is complete.
No production container has been created.

1. Checked the environment: Docker uses Linux containers, port 5433 was free,
   and no containers existed.
2. Added `compose_dev.yaml` for the independent dev service. Both the container
   and database are named `pawnsystem_db_dev`, bound only to `127.0.0.1:5433`.
3. Generated 32 random bytes with a cryptographically secure generator for the
   administrator password and saved it in `C:\PawnSystemServer\.env.dev`.
   The password is not recorded in documentation or logs.
4. Validated the configuration and ran the `up -d --wait` command below to
   download the image and initialize an empty database.
5. Verified that the container is healthy and runs PostgreSQL 16.15. Data is
   mounted at `C:\PawnSystemServer\pawnsystem_db_dev`. Authentication and SQL
   queries from Windows through port 5433 succeeded.
6. Confirmed that the `public` schema contains zero application tables and that
   the original dump's SHA-256 checksum is unchanged.
7. Rechecked the target and restored the verified custom-format dump in one
   transaction with `pg_restore --exit-on-error --single-transaction`.
8. Created `pawnsystem_app_dev` with a separate random password. It has connection,
   schema usage, table read/write, sequence, and function execution permissions.
9. Copied the source images into `C:\PawnSystemServer\pawnsystem_images_dev`,
   excluding macOS metadata files. The source images were not changed.
10. Updated the project root `.env` to connect to the dev database and image copy.
11. Verified the restored row counts, application authentication and permissions,
    and every database image path. All 98,543 stored image paths resolve to files.

Names consistently use underscores: `pawnsystem_<role>_<environment>`.
The Compose project `pawnsystem_dev` groups the dev resources together;
individual object names are listed below.

The dev database and image data are ready for application testing. The project
root `.env` now uses the restricted application login and dev image path. Do not
run the old `restore-database.ps1`; it does not use this naming scheme.

## Naming

Use underscores for all project-defined names: `pawnsystem_<role>_<environment>`.
PostgreSQL is the implementation, so `postgres` appears in the image name only.

| Object | Dev value |
| --- | --- |
| Compose project | `pawnsystem_dev` |
| Compose service and container | `pawnsystem_db_dev` |
| Database | `pawnsystem_db_dev` |
| Initialization administrator | `pawnsystem_admin_dev` |
| Application login | `pawnsystem_app_dev` |
| Host address | `127.0.0.1:5433` |
| Container port | `5432` |
| Image | `postgres:16-bookworm` |
| Data directory | `C:\PawnSystemServer\pawnsystem_db_dev` |
| Development image directory | `C:\PawnSystemServer\pawnsystem_images_dev` |

Compose's own generated resource names are implementation details, not application names.

## Files

- Repository `development/compose_dev.yaml`: versioned dev configuration.
- `C:\PawnSystemServer\compose_dev.yaml`: the configuration used by the running deployment.
- `C:\PawnSystemServer\.env.dev`: generated administrator password; do not commit or share.
- `C:\PawnSystemServer\.env.app.dev`: generated application connection settings;
  do not commit or share.
- Repository `development/.env.dev.example`: placeholder only, not usable credentials.
- Project root `.env`: local Electron development connection settings.

The two Compose files should have identical contents. If changing the repository
copy later, review and update the deployment copy before applying the change.
Running from the repository would otherwise create a different relative data directory.

## Setup Steps

1. Confirm Docker Desktop uses Linux containers, port 5433 is free, and there is
   no existing dev container or data directory to overwrite.
2. Save the dev Compose file in both locations above. Bind the port to loopback
   only; do not expose this development instance to the LAN.
3. Generate a unique password using a cryptographic random generator and save
   `POSTGRES_PASSWORD=<generated value>` in the deployment `.env.dev`.
4. Validate and start using the commands below. The first start downloads the
   image and initializes an empty database in the bound data directory.
5. Check health, mount location, port mapping, and a SQL connection. Confirm the
   database has no application tables before any restore is approved.

```powershell
Set-Location C:\PawnSystemServer
docker compose --project-name pawnsystem_dev --env-file .env.dev -f compose_dev.yaml config --quiet
docker compose --project-name pawnsystem_dev --env-file .env.dev -f compose_dev.yaml up -d --wait --wait-timeout 120
docker compose --project-name pawnsystem_dev --env-file .env.dev -f compose_dev.yaml ps
docker exec pawnsystem_db_dev psql -U pawnsystem_admin_dev -d pawnsystem_db_dev -c "SELECT current_database(), current_user;"
```

Avoid printing unrestricted `docker inspect` or `docker compose config` output:
they can include credentials. Changing `.env.dev` after initialization does not
change the password stored in an existing database.

## Daily Use

```powershell
# Inspect recent database logs.
docker logs --tail 50 pawnsystem_db_dev
# Stop or restart only the development database.
docker stop pawnsystem_db_dev
docker start pawnsystem_db_dev
```

Docker Desktop must be running. `restart: unless-stopped` does not start Docker
Desktop itself. Restarting the container does not require restoring the dump.
Do not delete or manually edit `pawnsystem_db_dev`; it contains the live database.

## Restore Verification

The restored database was verified with these row counts:

| Table | Rows |
| --- | ---: |
| `client` | 56,259 |
| `client_id` | 127,035 |
| `ticket` | 635,850 |
| `item` | 494,034 |
| `ticket_item` | 1,074,786 |
| `employee` | 102 |

The development image copy contains 37,926 client files and 60,617 item files,
with no zero-byte files. All 98,543 non-empty image paths stored in the database
were checked against this copy and all were present.

## Remaining Work

- Run the Electron app with `npm.cmd run dev` and verify representative client,
  item, ticket, image, and write workflows through the UI.
- Keep all development changes in this dev database and image copy. Production
  remains separate and has not been created.

Do not run the existing `restore-database.ps1` for this setup. It targets the old
container/configuration and drops its target database. No production container
is created by these dev instructions. The original `import` and `images` folders
are not mounted into this container and are not modified by startup.
