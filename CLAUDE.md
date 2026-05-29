# 동네로

## 작업 규칙 (Claude 필독)

### 세션 종료 시 필수 행동
사용자가 대화를 마무리하는 신호("수고했어", "오늘은 여기까지", "끝", "bye" 등)를 보내면:
1. 짧게 인사한다.
2. **GUIDE.md를 열어 이번 세션에서 변경·추가된 내용을 반영한다.**
   - 새 기능, 삭제된 기능, 변경된 흐름, 남은 할 일 업데이트 등
   - 변경이 없으면 생략해도 됨
3. GUIDE.md 수정이 있으면 커밋·push한다.

---

- **프로모 카드 기능 (jobs.html)**: 공고 10개마다 홈화면추가·알림신청·정보게시판 카드가 랜덤 삽입됨.
  제거하려면 jobs.html에서 `const PROMO_ENABLED = true` → `false` 로만 변경하면 됨. 코드 삭제 불필요.
- **코드 변경이 있을 때마다 CHANGELOG.md 상단에 새 버전 항목을 추가하고 커밋·push한다.**
  - 버전 형식: `## [v숫자.숫자] YYYY-MM-DD — 한 줄 요약`
  - 변경된 파일별 bullet 기록, 최신이 위 (현재 최신: **v0.53**)
  - **이것은 선택이 아닌 필수다. 사용자가 말하지 않아도, 세션이 바뀌어도 반드시 실행한다.**
  - 작업을 마치고 커밋할 때 CHANGELOG 없이 push하는 것은 금지다.

### 세션 시작 시 자동 체크 (하루 1회)
**매 새 대화 세션 시작 시 아래를 수행한다:**
1. `posts_data.js`를 읽어 동네로 정보게시판 글 목록(id, title) 추출
2. `https://rss.blog.naver.com/kyungmh95.xml` 을 fetch해 네이버 블로그 발행 글 목록 확인
3. 동네로 글 제목의 핵심 키워드(2개 이상)가 네이버 블로그 글 제목에 없으면 → **미발행** 으로 판단
4. 미발행 글이 있으면 사용자에게 다음 형식으로 보고:

```
📋 네이버 블로그 미발행 글 확인
아직 네이버 블로그에 올라가지 않은 동네로 정보글이 N편 있습니다:
• [글 제목] (posts_data.js 등록일: YYYY-MM-DD)
• ...
네이버 블로그(https://blog.naver.com/kyungmh95)에 발행해주세요.
```

5. 모두 발행되어 있으면 조용히 넘어간다 (사용자에게 불필요한 메시지 없음)

> 운영자 네이버 블로그: https://blog.naver.com/kyungmh95
> RSS: https://rss.blog.naver.com/kyungmh95.xml
> 동네로 정보글 → 네이버 블로그 발행 전략: 내용은 동일하되 도입부·마무리를 살짝 각색 (중복 패널티 방지)

## 정보게시판 글 발행 방식 (현재 채택)

### 새 글 발행 절차
1. `posts_data.js`에 새 글 객체 추가 (id, category, categoryColor, title, summary, date, author, content)
2. `python build_posts.py` 실행 → `/posts/{id}.html` 자동 생성 + `sitemap.xml` 업데이트
3. `git add posts/ sitemap.xml posts_data.js && git commit && git push github main`
4. 네이버 블로그(https://blog.naver.com/kyungmh95)에 각색 발행 (도입부·마무리 약간 변경)

> GitHub Actions crawl.yml이 매일 실행 시 `build_posts.py`도 자동 실행 → 정적 HTML 최신 유지

### "새로운 정보글 오늘도 작성해줘" 요청 처리
이 요청이 오면 **아래 원칙을 모두 반영**해서 글을 작성하고 즉시 발행한다:
- AI 느낌 없는 자연스러운 한국어 (실제 시나리오, 사람 이름, 구체적 상황 활용)
- 50~60대 시니어 관점의 공감형 도입부 (독자가 "내 얘기네"라고 느끼게)
- 구체적인 대화 스크립트·체크리스트·예시 금액 포함
- SEO 원칙: 제목에 검색 키워드 포함, meta description 80자 내 핵심 요약, h3 헤딩 구조화
- 롱테일 키워드 전략: "50대 알바", "60대 재취업", "시니어 단기알바" 등 자연스럽게 삽입
- 글 완성 후 `posts_data.js` 추가 → `build_posts.py` 실행 → 커밋·push까지 자동 완료

### 알림톡 자동 발송
- `notify.py` 구현 완료, GitHub Actions `crawl.yml`에 연동
- 카카오 알림톡 템플릿 심사 완료 후 GitHub Secrets에 `KAKAO_TMPL_WITH_JOB`, `KAKAO_TMPL_NO_JOB` 추가 필요

---

스택: HTML/CSS/JS (빌드 없음) · GitHub → GitHub Pages 자동배포 · Supabase

## 호스팅 구조
- 저장소: github.com/jnyoong/dongnero (main 브랜치)
- 배포: GitHub Pages (main 브랜치 루트, 커밋 즉시 자동반영)
- **도메인: https://dongnero.kr/** (커스텀 도메인, canonical·sitemap·robots.txt 모두 이 도메인 기준)
- 크롤러: GitHub Actions (.github/workflows/crawl.yml) — 매일 08:30(KST) 자동실행
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

## 크롤링 출처 10개 (crawler.py)
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
| 부산일자리 | GET REST API | data.go.kr BusanJobOpnngInfoService, HTTP only(HTTPS 401), 5페이지×100건, 합격자발표 필터 |

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
- 게시물 추가: `posts_data.js`에 객체 추가 → `build_posts.py` 실행 → `/posts/{id}.html` 생성
- 현재 게시물 6개: job-scam-2026 / labor-contract-2026 / senior-job-support-2026 / resume-ai-2025 / apply-parttime-2025 / speech-modern-2025

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
| 부산일자리 | #0369A1 |
| 사람인 | #E60012 |

## Google Analytics
측정 ID: G-PYD0Q5NTPD (전체 HTML에 삽입)

## 운영자 가이드
전체 기능 흐름·인프라·할 일 목록은 `GUIDE.md` 참조.
