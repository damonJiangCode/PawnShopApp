# Windows App Packaging

Run from the project root:

```powershell
npm run package:win
```

The installer is saved to `release/`. `electron-builder.yml` contains the packaging configuration, and `app.env.example` is the connection settings template.

The installed App currently uses dev. Its connection settings are stored in `%APPDATA%\PawnSystem\app.env`. For initial setup, run:

```powershell
node packaging/configure-app.cjs C:\PawnSystemServer\.env.app.dev
```

To replace an existing configuration, append `--force`, then restart the App. Credentials are not included in the installer.

See [docker](../docker/README.md) for database startup instructions.
