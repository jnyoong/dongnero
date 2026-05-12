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

Log "=== crawl start ($today) ==="

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
$exitCode = RunGit "pull", "--rebase", "-X", "ours", "github", "main"
if ($exitCode -ne 0) {
    Log "pull --rebase failed (exit $exitCode). aborting rebase..."
    RunGit "rebase", "--abort" | Out-Null
    Log "rebase aborted. pushing local commit..."
}

Log "push..."
$exitCode = RunGit "push", "github", "main"
if ($exitCode -ne 0) {
    Log "push failed (exit $exitCode)."
    exit 1
}

Log "deploy done: $today"
