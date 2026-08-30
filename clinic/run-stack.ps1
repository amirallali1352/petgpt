$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPort = 8000
$apiPort = 8001
$backend = Join-Path $root "backend"

if (-not (Get-Command py -ErrorAction SilentlyContinue)) {
    throw "Python launcher (py) is required. Install Python 3.10+ and try again."
}

$apiExisting = Get-NetTCPConnection -LocalPort $apiPort -State Listen -ErrorAction SilentlyContinue
if (-not $apiExisting) {
    Start-Process py -ArgumentList "server.py" -WorkingDirectory $backend -WindowStyle Hidden
    Start-Sleep -Milliseconds 500
}

$frontendExisting = Get-NetTCPConnection -LocalPort $frontendPort -State Listen -ErrorAction SilentlyContinue
if (-not $frontendExisting) {
    Start-Process py -ArgumentList "-m", "http.server", $frontendPort -WorkingDirectory $root -WindowStyle Hidden
    Start-Sleep -Milliseconds 500
}

$apiHealth = Invoke-WebRequest -Uri "http://127.0.0.1:$apiPort/api/health" -UseBasicParsing
$frontendHealth = Invoke-WebRequest -Uri "http://127.0.0.1:$frontendPort/index.html" -UseBasicParsing
if ($apiHealth.StatusCode -ne 200 -or $frontendHealth.StatusCode -ne 200) {
    throw "PetClinic services did not respond successfully."
}

Write-Host ""
Write-Host "PetClinic is ready:"
Write-Host "  Frontend: http://127.0.0.1:$frontendPort/index.html"
Write-Host "  API:      http://127.0.0.1:$apiPort"
Write-Host ""
Write-Host "Data is stored in SQLite and served through the local API."
