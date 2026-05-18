# dongnero scheduler setup
Set-Location $PSScriptRoot
$scriptPath = Join-Path $PSScriptRoot "crawl_local.ps1"
$taskName   = "dongnero_crawl"
$logPath    = Join-Path $PSScriptRoot "crawl_log.txt"

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File "$scriptPath"" `
    -WorkingDirectory $PSScriptRoot

$trigger  = New-ScheduledTaskTrigger -Daily -At "07:00"
$settings = New-ScheduledTaskSettingsSet `
    -RunOnlyIfNetworkAvailable `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 60) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "dongnero daily crawl 07:00" `
    -RunLevel Highest | Out-Null

Write-Host "OK: $taskName registered (daily 07:00)"
