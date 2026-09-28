param(
  [switch]$ConfirmRestore
)

$ErrorActionPreference = "Stop"

if (-not $ConfirmRestore) {
  throw "This operation drops and recreates the production database. Re-run with -ConfirmRestore only after preserving a current backup and stopping application access."
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $root ".env.prod"
$appEnvFile = Join-Path $root ".env.app.prod"
$composeFile = Join-Path $root "compose.yaml"
$dumpFile = Join-Path $root "import\pawnsystemdb-2026-09-26.dump"
$container = "pawnsystem_db_prod"
$dbName = "pawnsystem_db_prod"
$dbAdmin = "pawnsystem_admin_prod"
$dbApp = "pawnsystem_app_prod"

foreach ($requiredFile in @($envFile, $appEnvFile, $composeFile, $dumpFile)) {
  if (-not (Test-Path -LiteralPath $requiredFile)) {
    throw "Required production file not found: $requiredFile"
  }
}

$appSettings = @{}
Get-Content -LiteralPath $appEnvFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -and -not $line.StartsWith("#")) {
    $parts = $line.Split("=", 2)
    if ($parts.Count -eq 2) {
      $appSettings[$parts[0].Trim()] = $parts[1].Trim()
    }
  }
}

$appPassword = $appSettings["DB_PASSWORD"]
if ($appSettings["DB_NAME"] -ne $dbName -or $appSettings["DB_USER"] -ne $dbApp) {
  throw "The production application credential file targets an unexpected database or user."
}
if ($appPassword -notmatch '^[A-Fa-f0-9]{64}$') {
  throw "The production application password is missing or has an unexpected format."
}

Push-Location $root
try {
  docker compose --project-name pawnsystem_prod --env-file $envFile -f $composeFile up -d --wait --wait-timeout 120
  if ($LASTEXITCODE -ne 0) { throw "Docker Compose failed to start production PostgreSQL." }

  docker cp $dumpFile "${container}:/tmp/pawnsystem_prod_restore.dump"
  if ($LASTEXITCODE -ne 0) { throw "Could not copy the database backup into PostgreSQL." }

  docker exec $container psql -v ON_ERROR_STOP=1 -U $dbAdmin -d postgres `
    -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$dbName';"
  if ($LASTEXITCODE -ne 0) { throw "Could not close existing production connections." }

  docker exec $container dropdb -U $dbAdmin --if-exists $dbName
  if ($LASTEXITCODE -ne 0) { throw "Could not drop the production database." }

  docker exec $container createdb -U $dbAdmin -O $dbAdmin $dbName
  if ($LASTEXITCODE -ne 0) { throw "Could not create the production database." }

  docker exec $container pg_restore --exit-on-error --single-transaction `
    --no-owner --no-acl -U $dbAdmin -d $dbName /tmp/pawnsystem_prod_restore.dump
  if ($LASTEXITCODE -ne 0) { throw "Production database restore failed." }

  $roleExists = docker exec $container psql -U $dbAdmin -d $dbName -Atc `
    "SELECT 1 FROM pg_roles WHERE rolname = '$dbApp';"
  if ($LASTEXITCODE -ne 0) { throw "Could not inspect the production application role." }

  if ($roleExists.Trim() -ne "1") {
    docker exec $container psql -v ON_ERROR_STOP=1 -U $dbAdmin -d $dbName `
      -c "CREATE ROLE $dbApp LOGIN PASSWORD '$appPassword';"
  } else {
    docker exec $container psql -v ON_ERROR_STOP=1 -U $dbAdmin -d $dbName `
      -c "ALTER ROLE $dbApp WITH LOGIN PASSWORD '$appPassword';"
  }
  if ($LASTEXITCODE -ne 0) { throw "Could not configure the production application role." }

  $grants = @"
GRANT CONNECT ON DATABASE $dbName TO $dbApp;
GRANT USAGE ON SCHEMA public TO $dbApp;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $dbApp;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $dbApp;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO $dbApp;
ALTER DEFAULT PRIVILEGES FOR ROLE $dbAdmin IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $dbApp;
ALTER DEFAULT PRIVILEGES FOR ROLE $dbAdmin IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO $dbApp;
ALTER DEFAULT PRIVILEGES FOR ROLE $dbAdmin IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $dbApp;
"@
  $grants | docker exec -i $container psql -v ON_ERROR_STOP=1 -U $dbAdmin -d $dbName
  if ($LASTEXITCODE -ne 0) { throw "Could not grant production application permissions." }

  docker exec $container rm -f /tmp/pawnsystem_prod_restore.dump
  Write-Host "Production database restore completed successfully." -ForegroundColor Green
}
finally {
  Pop-Location
}
