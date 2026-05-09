# 동네로 로컬 크롤링 & 자동 배포 스크립트
# 사용법: 터미널에서 .\crawl_local.ps1

Set-Location $PSScriptRoot

Write-Host "크롤링 시작..." -ForegroundColor Cyan
python crawler.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "크롤러 오류 발생. 배포를 중단합니다." -ForegroundColor Red
    exit 1
}

# 오늘 날짜(KST) 기록
$today = (Get-Date).ToString('yyyy-MM-dd')
Set-Content -Path "last_crawl.txt" -Value $today -Encoding utf8NoBOM

Write-Host "커밋 & 푸시 중..." -ForegroundColor Cyan
git add jobs.json jobs_data.js excluded_data.js last_crawl.txt
$changed = git diff --cached --quiet; $hasChanges = ($LASTEXITCODE -ne 0)
if ($hasChanges) {
    git commit -m "crawl: 로컬 크롤링 $today"
    git pull --rebase github main
    git push github main
    Write-Host "배포 완료: $today" -ForegroundColor Green
} else {
    Write-Host "변경된 공고 없음. 배포 스킵." -ForegroundColor Yellow
}
