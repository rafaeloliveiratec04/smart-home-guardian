$ErrorActionPreference = "Stop"

$backendPath = Join-Path $PSScriptRoot "backend"
$packagePath = Join-Path $backendPath "package.json"
$envPath = Join-Path $backendPath ".env"
$examplePath = Join-Path $backendPath ".env.example"

if (-not (Test-Path -LiteralPath $packagePath)) {
  throw "Backend package.json was not found at $backendPath."
}

if (-not (Test-Path -LiteralPath $envPath)) {
  Copy-Item -LiteralPath $examplePath -Destination $envPath
  Write-Host "Created backend/.env from the example. Add your SMTP credentials before sending email." -ForegroundColor Yellow
}

Push-Location $backendPath
try {
  npm install
  if ($LASTEXITCODE -ne 0) {
    throw "npm install failed with exit code $LASTEXITCODE."
  }
} finally {
  Pop-Location
}

Write-Host "Backend dependencies are ready. Start the API with: npm --prefix backend run dev" -ForegroundColor Green
