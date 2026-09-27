# Windows PostgreSQL Server

1. Copy this folder to `C:\PawnShopServer`.
2. Copy `pawnsystemdb-2026-09-26.dump` into `C:\PawnShopServer\import`.
3. Copy the exported `images` folder into `C:\PawnShopServer\images`.
4. Rename `.env.server.example` to `.env.server` and replace the password.
5. Open PowerShell in this folder and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\restore-database.ps1
```

After the restore succeeds:

- Give the Dell a fixed local IP address.
- Allow inbound TCP `5432` in Windows Firewall only for the private local network.
- Share `C:\PawnShopServer\images` with the employee computers.
- Keep Docker Desktop and the `moneyexpress-postgres` container configured to start with Windows.

The employee app uses:

```text
DB_HOST=<Dell fixed IP>
DB_PORT=5432
DB_NAME=pawnsystemdb
DB_USER=moneyexpress
DB_PASSWORD=<value from .env.server>
IMAGE_ROOT=<shared images folder>
```
