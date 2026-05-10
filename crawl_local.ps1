# 동네로 로컬 크롤링 & 자동 배포 스크립트
# 사용법: 터미널에서 .\crawl_local.ps1

Set-Location $PSScriptRoot

$logPath = Join-Path $PSScriptRoot "crawl_log.txt"
$today   = (Get-Date).ToString('yyyy-MM-dd')

function Log($msg) {
    $line = "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $msg"
    Write-Host $line
    Add-Content -Path $logPath -Value $line -Encoding utf8
}

Log "=== 크롤링 시작 ($today) ==="

python crawler.py
if ($LASTEXITCODE -ne 0) {
    Log "크롤러 오류 (exit $LASTEXITCODE). 배포 중단."
    exit 1
}
Log "크롤러 완료"

# 오늘 날짜 기록
Set-Content -Path "last_crawl.txt" -Value $today -Encoding utf8NoBOM

Log "커밋 준비 중..."
git add jobs.json jobs_data.js excluded_data.js last_crawl.txt
$changed = git diff --cached --quiet; $hasChanges = ($LASTEXITCODE -ne 0)

if (-not $hasChanges) {
    Log "변경된 공고 없음. 배포 스킵."
    exit 0
}

git commit -m "crawl: 로컬 크롤링 $today"
if ($LASTEXITCODE -ne 0) {
    Log "커밋 실패 (exit $LASTEXITCODE)."
    exit 1
}
Log "커밋 완료"

# 비대화형 강제: GUI 자격증명 창이 열리지 않게 함 (스케줄러 환경에서 hang 방지)
$env:GIT_TERMINAL_PROMPT = "0"
$env:GCM_INTERACTIVE      = "never"

Log "pull --rebase 시작..."
git pull --rebase github main
if ($LASTEXITCODE -ne 0) {
    Log "pull --rebase 실패 (exit $LASTEXITCODE). push 시도는 계속합니다."
}

Log "push 시작..."
git push github main
if ($LASTEXITCODE -ne 0) {
    Log "push 실패 (exit $LASTEXITCODE). 다음 실행 시 재시도됩니다."
    exit 1
}

Log "배포 완료: $today"
