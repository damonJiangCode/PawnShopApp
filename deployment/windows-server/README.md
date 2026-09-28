# PawnSystem Production Docker

This directory contains the versioned configuration for the production PostgreSQL
service on the Windows server. Local development uses the separate configuration
in [`development/README.md`](../../development/README.md).

## Production Setup Record (2026-09-28)

The production database service has been created, restored, and verified.

1. Confirmed Docker Desktop was running with Linux containers, host port 5432 was
   free, and no previous production container or data directory existed.
2. Verified the migration dump against its SHA-256 manifest. The verified hash is
   `49d501cfe3e025bd0fc4855cf8c59a8619e6440c7bcefd5aa25075ee5e018cf0`.
3. Generated an independent administrator password and saved it in
   `C:\PawnSystemServer\.env.prod`. The password was not printed or committed.
4. Started the empty production service and verified its health, port mapping,
   and bind-mounted data directory before restoring any data.
5. Restored the custom-format dump with `--exit-on-error`, `--single-transaction`,
   `--no-owner`, and `--no-acl`. A failed restore would therefore roll back instead
   of leaving a partially restored database.
6. Generated a separate application password, created `pawnsystem_app_prod`, and
   granted the application the required table, sequence, and function permissions.
7. Saved the local production connection settings in
   `C:\PawnSystemServer\.env.app.prod`. Employee computers must use the server's
   fixed LAN IP instead of the file's local `127.0.0.1` value.
8. Verified production authentication, read/write permissions, restored row counts,
   and all database image paths. The temporary dump inside the container was removed.

No development data or development credentials are shared with production.

## Naming and Ports

Project-defined names follow `pawnsystem_<role>_<environment>` and use underscores.

| Object | Production value |
| --- | --- |
| Compose project | `pawnsystem_prod` |
| Compose service and container | `pawnsystem_db_prod` |
| Database | `pawnsystem_db_prod` |
| Initialization administrator | `pawnsystem_admin_prod` |
| Application login | `pawnsystem_app_prod` |
| Windows host address and port | `127.0.0.1:5432` until LAN access is configured |
| Container port | `5432` |
| Image | `postgres:16-bookworm` |
| Database data directory | `C:\PawnSystemServer\pawnsystem_db_prod` |
| Production image directory | `C:\PawnSystemServer\images` |

The development service remains independent on `127.0.0.1:5433`.

## Files and Data

| Path | Purpose |
| --- | --- |
| `deployment/windows-server/compose.yaml` | Versioned production service definition |
| `C:\PawnSystemServer\compose.yaml` | Deployed copy used by Docker Compose |
| `C:\PawnSystemServer\.env.prod` | Generated database administrator password |
| `C:\PawnSystemServer\.env.app.prod` | Generated application connection settings |
| `C:\PawnSystemServer\import\pawnsystemdb-2026-09-26.dump` | Original migration backup |
| `C:\PawnSystemServer\images` | Live production client and item images |
| `C:\PawnSystemServer\pawnsystem_db_prod` | Live PostgreSQL data files |

The dump is a backup input. The `pawnsystem_db_prod` directory is the live database
and changes as the application is used. Never manually edit or delete that directory.
Database rows store image paths; the actual image files remain in `images`.

The `.env.prod` and `.env.app.prod` files contain secrets. Do not commit, print,
email, or place them in a shared folder. Changing `.env.prod` after database
initialization does not automatically change the password inside PostgreSQL.

## Start and Inspect

Run production Compose commands from the deployed directory:

```powershell
Set-Location C:\PawnSystemServer
docker compose --project-name pawnsystem_prod --env-file .env.prod -f compose.yaml config --quiet
docker compose --project-name pawnsystem_prod --env-file .env.prod -f compose.yaml up -d --wait --wait-timeout 120
docker compose --project-name pawnsystem_prod --env-file .env.prod -f compose.yaml ps
```

Useful daily commands:

```powershell
docker logs --tail 50 pawnsystem_db_prod
docker stop pawnsystem_db_prod
docker start pawnsystem_db_prod
docker inspect --format '{{.State.Health.Status}}' pawnsystem_db_prod
```

Docker Desktop must be running. `restart: unless-stopped` restarts the container
after Docker starts, but it does not start Docker Desktop itself. Configure Docker
Desktop to start when the server signs in.

## Restore Procedure

The database has already been restored. Do not run the restore script during normal
startup or application use. Restarting the container never requires another restore.

`restore-database.ps1` is a destructive recovery tool: it disconnects users, drops
the production database, recreates it, and imports the dump. It refuses to run unless
the explicit `-ConfirmRestore` switch is supplied.

```powershell
Set-Location C:\PawnSystemServer
Set-ExecutionPolicy -Scope Process Bypass
.\restore-database.ps1 -ConfirmRestore
```

Before any future restore, preserve a current database backup and the production
images, confirm the dump checksum, and ensure all application users are offline.

## Restore Verification

| Table | Rows |
| --- | ---: |
| `client` | 56,259 |
| `client_id` | 127,035 |
| `ticket` | 635,850 |
| `item` | 494,034 |
| `ticket_item` | 1,074,786 |
| `employee` | 102 |

The database contains 98,543 non-empty image paths. Every path was checked against
`C:\PawnSystemServer\images`; all 98,543 files were present.

## Employee Application Settings

Use the values from `C:\PawnSystemServer\.env.app.prod`, but replace `DB_HOST` with
the Windows server's fixed LAN IP on employee computers:

```dotenv
DB_HOST=<server-fixed-LAN-IP>
DB_PORT=5432
DB_NAME=pawnsystem_db_prod
DB_USER=pawnsystem_app_prod
DB_PASSWORD=<value from C:\PawnSystemServer\.env.app.prod>
IMAGE_ROOT=<Windows network path to the shared production images folder>
```

On the server itself, `DB_HOST=127.0.0.1` and
`IMAGE_ROOT=C:/PawnSystemServer/images` are correct.

## Remaining Server Work

The database service is ready locally. Before employee computers connect:

1. Assign the Windows server a fixed LAN IP or DHCP reservation.
2. Share `C:\PawnSystemServer\images` with the required employee read/write access.
3. Change `POSTGRES_BIND_ADDRESS` in `C:\PawnSystemServer\.env.prod` from
   `127.0.0.1` to the server's fixed LAN IP and re-run the Compose `up` command.
4. Allow inbound TCP 5432 in Windows Firewall only on the Private profile and only
   from the store's trusted LAN subnet.
5. Test one employee workstation with the production application configuration.
6. Establish scheduled backups for both PostgreSQL and the production image folder.

The firewall rule and Windows image share are intentionally not created by Compose.
They depend on the final server IP, subnet, share name, and employee access policy.
