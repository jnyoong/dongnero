# dongnero local crawl & auto-deploy
# Usage: .\crawl_local.ps1

Set-Location $PSScriptRoot

$logPath  = Join-Path $PSScriptRoot "crawl_log.txt"
$lockFile = Join-Path $PSScriptRoot "crawl.lock"
$today    = (Get-Date).ToString('yyyy-MM-dd')

function Log($msg) {
    $line = "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $msg"
    Write-Host $line
    Add-Content -Path $logPath -Value $line -Encoding UTF8
}

function RunGit {
    param([string[]]$gitArgs)
    $result = & git @gitArgs 2>&1
    $result | ForEach-Object { Log "  git> $_" }
    return $LASTEXITCODE
}

function SendTelegram($text) {
    $envFile = Join-Path $PSScriptRoot ".env.local"
    $token = ""; $chatId = ""
    if (Test-Path $envFile) {
        foreach ($line in (Get-Content $envFile -Encoding UTF8)) {
            if ($line -match "^TELEGRAM_BOT_TOKEN=(.+)") { $token = $Matches[1].Trim() }
            if ($line -match "^TELEGRAM_CHAT_ID=(.+)")   { $chatId = $Matches[1].Trim() }
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

function CleanExit($code) {
    if (Test-Path $lockFile) { Remove-Item $lockFile -Force }
    exit $code
}

# ── 동시 실행 방지 ───────────────────────────────────────────
if (Test-Path $lockFile) {
    $lockAge = [int]((Get-Date) - (Get-Item $lockFile).LastWriteTime).TotalMinutes
    if ($lockAge -lt 60) {
        Log "=== already running (lock ${lockAge}min old) — skip ==="
        exit 0
    }
    Log "stale lock (${lockAge}min) — removing"
    Remove-Item $lockFile -Force
}
$null | Out-File $lockFile -Encoding ASCII

# ── 크롤링 시작 ──────────────────────────────────────────────
Log "=== crawl start ($today) ==="
SendTelegram "🚀 *동네로 크롤링 시작* ($today $((Get-Date).ToString('HH:mm')))`n10개 출처 수집 중... 15~25분 소요"

# 이전 rebase 잔재 정리
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
    CleanExit 1
}
Log "crawler done"

# PS 5.1 compatible: write date without BOM
[System.IO.File]::WriteAllText(
    (Join-Path $PSScriptRoot "last_crawl.txt"),
    $today,
    [System.Text.UTF8Encoding]::new($false)
)
Log "last_crawl.txt written: $today"

# ── GitHub Actions 중복 방지 ─────────────────────────────────
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
    Log "GitHub에 오늘 데이터 있음 ($remoteDate). sync 후 종료."
    RunGit "pull", "--rebase", "github", "main" | Out-Null
    CleanExit 0
}

# ── Git push ─────────────────────────────────────────────────
Log "staging..."
git add jobs.json jobs_data.js excluded_data.js last_crawl.txt
git diff --cached --quiet
$hasChanges = ($LASTEXITCODE -ne 0)

if (-not $hasChanges) {
    Log "no changes. skip deploy."
    CleanExit 0
}

git commit -m "crawl: $today"
if ($LASTEXITCODE -ne 0) {
    Log "commit failed (exit $LASTEXITCODE)."
    CleanExit 1
}
Log "commit done"

Log "pull --rebase..."
$exitCode = RunGit "pull", "--rebase", "-X", "theirs", "github", "main"
if ($exitCode -ne 0) {
    Log "pull --rebase failed. aborting..."
    RunGit "rebase", "--abort" | Out-Null
    Log "rebase aborted. pushing local commit..."
}

Log "push..."
$exitCode = RunGit "push", "github", "main"
if ($exitCode -ne 0) {
    Log "push failed (exit $exitCode)."
    SendTelegram "⚠️ *동네로 push 실패* ($today)`ngit push exit: $exitCode`n크롤링은 완료됐지만 GitHub 반영 안됨"
    CleanExit 1
}

Log "deploy done: $today"
SendTelegram "✅ *동네로 GitHub 배포 완료* ($today)`njobs.json push → dongnero.kr 반영 중"
CleanExit 0
