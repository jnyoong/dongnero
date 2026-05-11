# dongnero local crawl & auto-deploy
# Usage: .\crawl_local.ps1

Set-Location $PSScriptRoot

$logPath = Join-Path $PSScriptRoot "crawl_log.txt"
$today   = (Get-Date).ToString('yyyy-MM-dd')

function Log($msg) {
    $line = "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $msg"
    Write-Host $line
    Add-Content -Path $logPath -Value $line -Encoding Default
}

Log "=== crawl start ($today) ==="

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
$changed = git diff --cached --quiet; $hasChanges = ($LASTEXITCODE -ne 0)

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

# Prevent git from opening GUI credential prompts in non-interactive context
$env:GIT_TERMINAL_PROMPT = "0"
$env:GCM_INTERACTIVE      = "never"

Log "pull --rebase..."
# -X ours: auto-resolve conflicts by preferring local crawl data
git pull --rebase -X ours github main
if ($LASTEXITCODE -ne 0) {
    Log "pull --rebase failed (exit $LASTEXITCODE). attempting push anyway."
}

Log "push..."
git push github main
if ($LASTEXITCODE -ne 0) {
    Log "push failed (exit $LASTEXITCODE)."
    exit 1
}

Log "deploy done: $today"
