$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $root ".env.server"
$composeFile = Join-Path $root "compose.yaml"
$dumpFile = Join-Path $root "import\pawnsystemdb-2026-09-26.dump"
$container = "moneyexpress-postgres"

if (-not (Test-Path $envFile)) {
  throw "Create .env.server from .env.server.example first."
}

if (-not (Test-Path $dumpFile)) {
  throw "Database backup not found: $dumpFile"
}

$settings = @{}
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -and -not $line.StartsWith("#")) {
    $parts = $line.Split("=", 2)
    if ($parts.Count -eq 2) {
      $settings[$parts[0].Trim()] = $parts[1].Trim()
    }
  }
}

$dbName = $settings["POSTGRES_DB"]
$dbUser = $settings["POSTGRES_USER"]
$dbPassword = $settings["POSTGRES_PASSWORD"]

if ($dbName -notmatch '^[A-Za-z_][A-Za-z0-9_]*$') {
  throw "POSTGRES_DB is not a valid database name."
}

if ($dbUser -notmatch '^[A-Za-z_][A-Za-z0-9_]*$') {
  throw "POSTGRES_USER is not a valid database user."
}

if (-not $dbPassword -or $dbPassword.StartsWith("REPLACE_")) {
  throw "Set a real POSTGRES_PASSWORD in .env.server."
}

Push-Location $root
try {
  docker compose --env-file $envFile -f $composeFile up -d
  if ($LASTEXITCODE -ne 0) { throw "Docker Compose failed to start PostgreSQL." }

  $healthy = $false
  for ($attempt = 1; $attempt -le 60; $attempt += 1) {
    $status = docker inspect --format '{{.State.Health.Status}}' $container 2>$null
    if ($status -eq "healthy") {
      $healthy = $true
      break
    }
    Start-Sleep -Seconds 2
  }

  if (-not $healthy) {
    throw "PostgreSQL did not become healthy. Run: docker logs $container"
  }

  docker cp $dumpFile "${container}:/tmp/pawnsystemdb.dump"
  if ($LASTEXITCODE -ne 0) { throw "Could not copy the database backup into PostgreSQL." }

  docker exec -e "PGPASSWORD=$dbPassword" $container psql `
    -v ON_ERROR_STOP=1 -U $dbUser -d postgres `
    -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$dbName';"
  if ($LASTEXITCODE -ne 0) { throw "Could not close existing database connections." }

  docker exec -e "PGPASSWORD=$dbPassword" $container dropdb `
    -U $dbUser --if-exists $dbName
  if ($LASTEXITCODE -ne 0) { throw "Could not reset the target database." }

  docker exec -e "PGPASSWORD=$dbPassword" $container createdb `
    -U $dbUser -O $dbUser $dbName
  if ($LASTEXITCODE -ne 0) { throw "Could not create the target database." }

  docker exec -e "PGPASSWORD=$dbPassword" $container pg_restore `
    -v -U $dbUser -d $dbName --no-owner --no-acl /tmp/pawnsystemdb.dump
  if ($LASTEXITCODE -ne 0) { throw "Database restore failed." }

  docker exec $container rm -f /tmp/pawnsystemdb.dump
  Write-Host "Database restore completed successfully." -ForegroundColor Green
}
finally {
  Pop-Location
}
