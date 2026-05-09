# 동네로 크롤링 작업 스케줄러 등록 스크립트
# 한 번만 실행하면 됩니다.

$scriptPath = Join-Path $PSScriptRoot "crawl_local.ps1"
$taskName   = "동네로_크롤링"
$logPath    = Join-Path $PSScriptRoot "crawl_log.txt"

# 기존 작업 있으면 제거 후 재등록
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "기존 작업 삭제됨" -ForegroundColor Yellow
}

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`" >> `"$logPath`" 2>&1" `
    -WorkingDirectory $PSScriptRoot

$trigger  = New-ScheduledTaskTrigger -Daily -At "07:00"

$settings = New-ScheduledTaskSettingsSet `
    -RunOnlyIfNetworkAvailable `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "동네로 일자리 크롤링 & GitHub 자동 배포 (매일 07:00)" `
    -RunLevel Highest | Out-Null

Write-Host "작업 스케줄러 등록 완료!" -ForegroundColor Green
Write-Host "  작업명: $taskName" -ForegroundColor Cyan
Write-Host "  실행: 매일 07:00 (PC 켜져있을 때)" -ForegroundColor Cyan
Write-Host "  로그: $logPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "확인: 작업 스케줄러 앱 → 작업 스케줄러 라이브러리 → '$taskName'" -ForegroundColor Gray
