# Docker (dev only)

Use Docker Desktop with Linux containers. The database is `pawnsystem_db_dev`, available at `127.0.0.1:5433`.

## Start

Run from the project root:

```powershell
Copy-Item docker/compose_dev.yaml C:\PawnSystemServer\compose_dev.yaml
docker compose --project-name pawnsystem_dev --env-file C:\PawnSystemServer\.env.dev -f C:\PawnSystemServer\compose_dev.yaml up -d --wait
docker compose --project-name pawnsystem_dev --env-file C:\PawnSystemServer\.env.dev -f C:\PawnSystemServer\compose_dev.yaml ps
```

On this computer, keep the existing `.env.dev`. On a new computer, create `C:\PawnSystemServer`, copy `docker/.env.dev.example` to `C:\PawnSystemServer\.env.dev`, and set a unique password before running these commands. The first start creates an empty database; business data and the application account require separate initialization or migration.

## Local files

All paths below are relative to `C:\PawnSystemServer`.

| Path | Purpose |
| --- | --- |
| `compose_dev.yaml` | Dev service configuration |
| `.env.dev` | Database administrator credentials |
| `.env.app.dev` | App connection settings for dev |
| `pawnsystem_db_dev/` | Mounted dev database files |
| `pawnsystem_images_dev/` | Dev business images |
| `import/`, `images/` | Original migration backup and source images |

Always start the service using the YAML in the server directory so the relative mount points to the existing database. Do not overwrite existing credentials or delete the dev data directory.

```powershell
docker stop pawnsystem_db_dev
docker start pawnsystem_db_dev
```

The project `.env` and the installed App both use dev. See [packaging](../packaging/README.md) for App packaging instructions.
