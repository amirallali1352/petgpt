[CmdletBinding()]
param(
    [string]$ApiUrl = "http://127.0.0.1:8001",
    [string]$FrontendUrl = "http://127.0.0.1:8000"
)

$ErrorActionPreference = "Stop"
$ApiUrl = $ApiUrl.TrimEnd("/")
$FrontendUrl = $FrontendUrl.TrimEnd("/")

function Assert-Equal {
    param(
        [Parameter(Mandatory = $true)] $Actual,
        [Parameter(Mandatory = $true)] $Expected,
        [Parameter(Mandatory = $true)] [string]$Message
    )
    if ($Actual -ne $Expected) {
        throw "$Message. Expected '$Expected', got '$Actual'."
    }
}

function Invoke-ExpectedStatus {
    param(
        [Parameter(Mandatory = $true)] [string]$Uri,
        [Parameter(Mandatory = $true)] [int]$ExpectedStatus
    )
    try {
        Invoke-WebRequest -Uri $Uri -Method Get -UseBasicParsing | Out-Null
        throw "Request unexpectedly succeeded: $Uri"
    }
    catch {
        $response = $_.Exception.Response
        if (-not $response) {
            throw
        }
        $actualStatus = [int]$response.StatusCode
        Assert-Equal $actualStatus $ExpectedStatus "Unexpected HTTP status for $Uri"
    }
}

Write-Host "1/5 Checking API health..."
$health = Invoke-RestMethod -Uri "$ApiUrl/api/health" -Method Get
Assert-Equal ([bool]$health.ok) $true "API health check failed"
Assert-Equal $health.service "petclinic-api" "Unexpected API service name"

Write-Host "2/5 Checking frontend entrypoint..."
$index = Invoke-WebRequest -Uri "$FrontendUrl/index.html" -Method Get -UseBasicParsing
Assert-Equal ([int]$index.StatusCode) 200 "Frontend entrypoint is unavailable"
if ($index.Content -notmatch 'id="loginScreen"') {
    throw "Frontend login screen marker was not found."
}

Write-Host "3/5 Checking unauthenticated protection..."
Invoke-ExpectedStatus "$ApiUrl/api/customers" 401

Write-Host "4/5 Checking authentication and authenticated read..."
$loginBody = @{
    email    = "admin@petclinic.local"
    password = "123456"
} | ConvertTo-Json
$login = Invoke-RestMethod `
    -Uri "$ApiUrl/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

if ([string]::IsNullOrWhiteSpace($login.token)) {
    throw "Login response did not contain a token."
}
if (-not $login.user -or $login.user.role -ne "admin") {
    throw "Login response did not contain the expected admin user."
}

$headers = @{ Authorization = "Bearer $($login.token)" }
$customers = Invoke-RestMethod -Uri "$ApiUrl/api/customers" -Headers $headers -Method Get
if ($null -eq $customers.items) {
    throw "Authenticated customers response did not contain items."
}

Write-Host "5/5 Checking invalid credentials..."
try {
    Invoke-RestMethod `
        -Uri "$ApiUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{ email = "admin@petclinic.local"; password = "wrong" } | ConvertTo-Json) | Out-Null
    throw "Invalid credentials unexpectedly succeeded."
}
catch {
    $response = $_.Exception.Response
    if (-not $response) {
        throw
    }
    Assert-Equal ([int]$response.StatusCode) 401 "Invalid credentials status mismatch"
}

Write-Host ""
Write-Host "PetClinic HTTP smoke checks passed."
