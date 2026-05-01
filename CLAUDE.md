# 동네로

스택: HTML/CSS/JS (빌드 없음) · GitLab → Netlify 자동배포 · Supabase

## 파일
- `index.html` — 메인 (지역 선택, 위치 기반 배너, 구 선택 바텀시트)
- `jobs.html` — 공고 목록 (`?region=서울&district=강남구` 필터)
- `local.html` — 동네 일자리 (`?sido=서울&gu=강남구` 필터)
- `jobs_data.js` — 크롤링 데이터
- `.gitlab-ci.yml` — 자동 크롤링 CI

## Git
```
git add <파일> && git commit -m "메시지" && git push
```
