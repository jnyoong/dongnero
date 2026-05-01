# 동네로

스택: HTML/CSS/JS (빌드 없음) · GitHub → GitHub Pages 자동배포 · Supabase

## 호스팅 구조
- 저장소: github.com/jnyoong/dongnero (main 브랜치)
- 배포: GitHub Pages (main 브랜치 루트, 커밋 즉시 자동반영)
- 크롤러: GitHub Actions (.github/workflows/crawl.yml) — 매일 09시(KST) 자동실행
- DB: Supabase (알림 신청 저장)

## 주요 파일
- `index.html` — 메인 (지역 선택, 위치 기반 배너, 구 선택 바텀시트)
- `jobs.html` — 공고 목록 (`?region=서울&district=강남구` 필터)
- `local.html` — 동네 일자리 (`?sido=서울&gu=강남구` 필터)
- `jobs_data.js` — 크롤링 데이터 (Actions가 매일 갱신)
- `crawler.py` — 크롤러 본체

## Git
```
git add <파일> && git commit -m "메시지" && git push github main
```
