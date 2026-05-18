# dongnero local crawl & auto-deploy
# Usage: .\crawl_local.ps1

Set-Location $PSScriptRoot

$logPath = Join-Path $PSScriptRoot "crawl_log.txt"
$today   = (Get-Date).ToString('yyyy-MM-dd')

function Log($msg) {
    $line = "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $msg"
    Write-Host $line
    Add-Content -Path $logPath -Value $line -Encoding UTF8
}

function RunGit {
    param([string[]]$args)
    $result = & git @args 2>&1
    $result | ForEach-Object { Log "  git> $_" }
    return $LASTEXITCODE
}

# 텔레그램 알림 함수 (.env.local에서 토큰 로드)
function SendTelegram($text) {
    $envFile = Join-Path $PSScriptRoot ".env.local"
    $token = ""; $chatId = ""
    if (Test-Path $envFile) {
        Get-Content $envFile -Encoding UTF8 | ForEach-Object {
            if ($_ -match "^TELEGRAM_BOT_TOKEN=(.+)") { $token = $Matches[1].Trim() }
            if ($_ -match "^TELEGRAM_CHAT_ID=(.+)")   { $chatId = $Matches[1].Trim() }
        }
    }
    if ($token -and $chatId) {
        try {
            $body = @{ chat_id=$chatId; text=$text; parse_mode="Markdown" } | ConvertTo-Json -Compress
            Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/sendMessage" `
                -Method Post -Body $body -ContentType "application/json; charset=utf-8" `
                -TimeoutSec 10 | Out-Null
        } catch { Log "telegram error: $_" }
    }
}

Log "=== crawl start ($today) ==="
SendTelegram "🚀 *동네로 크롤링 시작* ($today $((Get-Date).ToString('HH:mm')))`n10개 출처 수집 중... 15~25분 소요"

# 이전 실행에서 rebase가 중단된 채 남아있으면 정리
$rebaseHead = Join-Path $PSScriptRoot ".git\REBASE_HEAD"
if (Test-Path $rebaseHead) {
    Log "stale rebase detected — aborting..."
    RunGit "rebase", "--abort" | Out-Null
    Log "rebase aborted"
}

python crawler.py
if ($LASTEXITCODE -ne 0) {
    Log "crawler error (exit $LASTEXITCODE). abort."
    SendTelegram "❌ *동네로 크롤링 실패* ($today)`ncrawler.py exit code: $LASTEXITCODE"
    exit 1
}
Log "crawler done"

# PS 5.1 compatible: write date without BOM (utf8NoBOM is PS6+ only)
[System.IO.File]::WriteAllText(
    (Join-Path $PSScriptRoot "last_crawl.txt"),
    $today,
    [System.Text.UTF8Encoding]::new($false)
)
Log "last_crawl.txt written: $today"

# GitHub Actions가 이미 오늘 크롤링을 완료했는지 확인
Log "GitHub 최신 상태 확인..."
RunGit "fetch", "github", "main" | Out-Null

$remoteDate = ""
try {
    $remoteJson = (& git show "github/main:jobs.json" 2>$null) -join "`n"
    if ($remoteJson) {
        $remoteDate = ($remoteJson | & python -c "import sys,json; d=json.load(sys.stdin); print(d.get('updated_at','')[:10])").Trim()
    }
} catch {}

if ($remoteDate -eq $today) {
    Log "GitHub에 오늘 데이터 있음 ($remoteDate). 로컬 결과 버리고 GitHub 버전으로 sync."
    RunGit "pull", "--rebase", "github", "main" | Out-Null
    Log "sync 완료. 로컬 크롤 스킵."
    exit 0
}

# GitHub에 오늘 데이터 없음 → 로컬 크롤 결과를 push
Log "staging..."
git add jobs.json jobs_data.js excluded_data.js last_crawl.txt
$hasChanges = (git diff --cached --quiet; $LASTEXITCODE -ne 0)

if (-not $hasChanges) {
    Log "no changes. skip deploy."
    exit 0
}

git commit -m "crawl: $today"
if ($LASTEXITCODE -ne 0) {
    Log "commit failed (exit $LASTEXITCODE)."
    exit 1
}
Log "commit done"

Log "pull --rebase..."
$exitCode = RunGit "pull", "--rebase", "-X", "theirs", "github", "main"
if ($exitCode -ne 0) {
    Log "pull --rebase failed (exit $exitCode). aborting rebase..."
    RunGit "rebase", "--abort" | Out-Null
    Log "rebase aborted. pushing local commit..."
}

Log "push..."
$exitCode = RunGit "push", "github", "main"
if ($exitCode -ne 0) {
    Log "push failed (exit $exitCode)."
    SendTelegram "⚠️ *동네로 push 실패* ($today)`ngit push exit: $exitCode`n크롤링은 완료됐지만 GitHub 반영 안됨"
    exit 1
}

Log "deploy done: $today"
SendTelegram "✅ *동네로 GitHub 배포 완료* ($today)`njobs.json push → dongnero.kr 반영 중"
