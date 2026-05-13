# 동네로

## 작업 규칙 (Claude 필독)
- **코드 변경이 있을 때마다 CHANGELOG.md 상단에 새 버전 항목을 추가하고 커밋·push한다.**
  - 버전 형식: `## [v숫자.숫자] YYYY-MM-DD — 한 줄 요약`
  - 변경된 파일별 bullet 기록, 최신이 위 (현재 최신: **v0.46**)
  - 사용자가 요청하지 않아도 작업 완료 시 자동으로 실행

스택: HTML/CSS/JS (빌드 없음) · GitHub → GitHub Pages 자동배포 · Supabase

## 호스팅 구조
- 저장소: github.com/jnyoong/dongnero (main 브랜치)
- 배포: GitHub Pages (main 브랜치 루트, 커밋 즉시 자동반영)
- **도메인: https://dongnero.kr/** (커스텀 도메인, canonical·sitemap·robots.txt 모두 이 도메인 기준)
- 크롤러: GitHub Actions (.github/workflows/crawl.yml) — 매일 09시(KST) 자동실행
- DB: Supabase (`riomousxlyvwmembuhvc`) — 알림신청(notify_signups) + 댓글(post_comments)
- git remote: `github` = GitHub (push 대상), `origin` = GitLab (무시)

## 주요 파일
| 파일 | 역할 |
|------|------|
| `index.html` | 메인: 지역 카드 그리드, 플로팅 위치 배너 |
| `jobs.html` | 공고 목록: 지역→구 드릴다운, 햄버거 드로어 |
| `info.html` | 정보게시판: 칼럼 목록/상세 + Supabase 댓글 |
| `local.html` | 동네 일자리 (`?sido=서울&gu=강남구`) |
| `install.html` | 홈화면 추가 안내 |
| `admin-dongnero.html` | 관리자: 공고 수동필터·화이트리스트 |
| `crawler.py` | 크롤러 본체 |
| `jobs.json` / `jobs_data.js` | 크롤링 결과 (Actions가 매일 갱신) |
| `posts_data.js` | 정보게시판 게시물 (운영자가 직접 편집) |
| `excluded_data.js` | 필터링 제외 공고 |
| `whitelist_data.js` | 수동 화이트리스트 |
| `manual_excluded.js` | 수동 필터 목록 |

## Git
```
git add <파일> && git commit -m "메시지" && git push github main
```
push 실패(fetch first) 시: `git pull --rebase github main && git push github main`

## 크롤링 출처 9개 (crawler.py)
| 출처 | 방식 | 비고 |
|------|------|------|
| 고용24 | POST 스크래핑 (API키 없으면 웹) | birthToYY=1976 (50세↑), 전국 최신 1,000건 |
| 알바몬 | GET + `__NEXT_DATA__` 파싱 | 시니어 키워드 검색 |
| 알바천국 | GET HTML 파싱 | 중장년 채용관 |
| 시니어로 | POST 스크래핑 | SSL verify=False |
| 서울일자리포털 | POST AJAX | region=11000 |
| 잡아바 | POST Sheet API | 경기데이터드림, 인증불필요, RECRUT_FIELD_NM 수집 |
| 어르신일자리 | POST Sheet API | 경기, 모집중만 수집 |
| 맘시터 | POST JSON API | `api.mom-sitter.com/public-web-api/v1/parents/search`, 인증불필요, 최대 1000건(100페이지×10) |
| 대전일자리 | POST 스크래핑 | jobdaejeon.or.kr, 72페이지×10건≈710건, work24 중복은 wantedAuthNo로 제거 |

맘시터 apply_link: `https://www.mom-sitter.com/search/parent` (개별 /parent/{id}는 서버 404)

## 중복 제거 (_deduplicate)
우선순위: 1) wantedAuthNo (work24 URL 파라미터) → 2) apply_link 완전 일치 → 3) (title+company) 쌍

## jobs.html UI 구조
```
header:  [☰] [동네로→index.html]                    [🔍]
row1:    [📍 서울전체˅]  N건          [맘시터 공고] ← 토글버튼(기본 OFF)
row2:    [업종▾] [고용형태▾] [출처▾] [정렬▾]
row3:    [검색창] (슬라이드다운)
```
- 맘시터 토글 OFF(기본): 맘시터 공고 숨김 / ON: 함께 표시
- 드로어: 🗺️처음지역선택 / 💼채용공고 / 📰정보게시판 / 📱홈화면추가 / 🔔알림받기

## 정보게시판 (info.html + posts_data.js)
- 목록→상세 해시 라우팅(`#post-id`), 브라우저 뒤로가기 지원
- 댓글: Supabase `post_comments` 테이블 (RLS 설정 완료)
  - 누구나 읽기/쓰기 가능, 500자 제한
- 게시물 추가: `posts_data.js`에 객체 추가 후 커밋
- 현재 게시물 3개: resume-ai-2025 / apply-parttime-2025 / speech-modern-2025

## Supabase
- URL: `https://riomousxlyvwmembuhvc.supabase.co`
- anon key: `sb_publishable_EULGblJ83IkmxLh9VMXnxQ_lcMgnmAh`
- 테이블: `notify_signups`, `post_comments`

## 필터링 (crawler.py)
- `EXCLUDE_COMPANIES`: 올리브영·CGV·스타벅스·맥도날드·게임회사 등
- `EXCLUDE_KEYWORDS`: 개발자·백엔드·프론트엔드·영상편집·인턴십 등
- 잡아바 고용형태 정규화: 원문 → 정규직/계약직/시간제/빈값

## 소스 색상
| 출처 | 색상 |
|------|------|
| 고용24 | #2563EB |
| 알바몬 | #EA580C |
| 알바천국 | #16A34A |
| 시니어로 | #0891B2 |
| 서울일자리포털 | #0F766E |
| 잡아바 | #7C3AED |
| 어르신일자리 | #15803D |
| 맘시터 | #FF7F25 |
| 대전일자리 | #B45309 |

## Google Analytics
측정 ID: G-PYD0Q5NTPD (전체 HTML에 삽입)
