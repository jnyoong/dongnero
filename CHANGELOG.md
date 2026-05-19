# 동네로 변경 이력

---

## [v0.89] 2026-05-19 — 로컬 크롤링 후 알림톡 발송 추가

- `crawl_local.ps1` — crawler.py 완료 직후 `.env.local` 전체 환경변수 로드 후 `notify.py` 실행
- 기존: 로컬 크롤링 성공 시 GitHub Actions가 skip되어 notify.py가 실행 안 됨 → 구독자 알림 미발송 문제 수정
- notify.py 실패해도 git push는 계속 진행됨

## [v0.88] 2026-05-19 — crawl_local.ps1 RunGit 버그 수정 (push 실패 근본 원인)

- `crawl_local.ps1` — `RunGit` 함수 파라미터명 `$args`→`$gitArgs` 변경
- 원인: `$args`는 PowerShell 예약 자동변수라 `@args` splatting이 항상 빈 값으로 git 호출됨 → fetch·pull·push 모두 무인자 실행 → 크롤링 후 push 항상 실패하던 버그

## [v0.87] 2026-05-19 — crawl_local.ps1 UTF-8 BOM 수정 (로컬 07:00 크롤링 복구)

- `crawl_local.ps1` — UTF-8 BOM 없이 저장되어 PowerShell 5.1이 ANSI로 읽어 한글 parse error 발생 → BOM 추가로 수정
- 증상: `동네로_크롤링` 작업 스케줄러 태스크가 매일 07:00 실행되나 exit code 1로 즉시 실패 (log·lock 파일도 생성 안 됨)

## [v0.86] 2026-05-19 — GitHub Actions 텔레그램 알림 + Secrets 등록

- `.github/workflows/crawl.yml` — 시작·완료 텔레그램 알림 단계 추가 (PC 꺼져있어도 Actions 크롤링 시 알림 수신)
- `crawl.yml` — 크롤러 실행 단계에 TELEGRAM_BOT_TOKEN·TELEGRAM_CHAT_ID 환경변수 추가 (완료 요약 발송)
- `crawl.yml` — last_crawl.txt도 커밋 대상에 포함
- GitHub Secrets 등록: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

## [v0.85] 2026-05-19 — /subs 오늘 신규 건수 + 중복제거 키 수정

- `telegram_bot.py` — /subs: 오늘(KST) 신규 구직카드 N명 한 줄 추가
- `telegram_bot.py` — /subs 중복제거 키 오류 수정: `phone` → `contact_phone` (항상 빈값이라 이름만으로 중복제거되던 문제)

## [v0.84] 2026-05-19 — 어드민 날짜 UTC→KST 수정

- `admin-dongnero.html` — 구직카드 최근 7일 신청현황: `toISOString()` UTC → KST (+9h) 변환 적용
  - 오늘(5/19) KST이 5/18로 잘못 표시되던 문제 해소
  - KST 자정 전후 등록 시 날짜 집계 오류 해소
- `admin-dongnero.html` — 클릭통계 오늘 필터도 동일하게 KST 기준 적용

## [v0.83] 2026-05-19 — 구직카드 알림 완전 수정 (3단계 근본 원인)

- Supabase 트리거 `net.http_post()` body 타입 오류: `text` → `jsonb` 수정 (pg_net v0.20.0 실제 시그니처 반영)
- Edge Function Telegram 메시지 Markdown → HTML 전환 (이름에 `_` 포함 시 400 오류 해소)
- 전체 경로 검증 완료: INSERT → 트리거 → pg_net → Edge Function → Telegram

## [v0.82] 2026-05-19 — 구직카드 등록 오류 수정

- Supabase `seeker_cards` INSERT RLS 정책 누락 → `anon_can_insert` 정책 추가 (폼 등록 정상화)
- DB 트리거 오류 수정: pg_net 미활성화 상태에서 INSERT 전체 실패하던 문제 → pg_net 활성화, 트리거에 EXCEPTION 처리 추가
- Edge Function `contact_phone` 컬럼명 오류 수정 (`rec.phone` → `rec.contact_phone`)

## [v0.81] 2026-05-19 — 구직카드 신규 알림 Supabase Edge Function으로 이전

- `supabase/functions/notify-new-seeker/index.ts` — Edge Function 신규: seeker_cards INSERT → 텔레그램 즉시 발송, 중복 자동 감지
- Supabase DB 트리거 `on_seeker_cards_insert` 생성 (pg_net 기반)
- `telegram_bot.py` — 60초 폴링 코드 전량 제거 (PC 꺼져도 알림 동작)
- `.gitignore` — supabase 임시 파일 제외 추가

## [v0.80] 2026-05-19 — 텔레그램 봇 버그수정 + 구직카드 실시간 알림

- `telegram_bot.py`:
  - `/today` — jobs_data.js updated_at 기준으로 수정 (last_crawl.txt 제거, 5/14 오류 해소)
  - `/clicks` — KST→UTC 변환 적용 (0건 오류 해소), 오늘+어제 동시 표시
  - `/status` — 출처합계·중복제거수 명시 (최종건수 계산 과정 투명화)
  - `/error` — "봇 Python 에러(bot.log)" 명시, /log와 역할 구분 안내
  - 구직카드 신규 알림 — 60초 폴링, 증가 감지 시 이름·번호뒷4자리·단계 즉시 발송, 중복건 표시

## [v0.79] 2026-05-19 — 텔레그램 봇 명령어 전면 개편

- `telegram_bot.py` 전체 개편:
  - `/jobs` 제거
  - `/status` — 출처별 증감·중복제거·이상 플래그 포함 어드민 수준 상세
  - `/subs` — `admin_get_seeker_cards` RPC + p_pw 인증, 레벨 1/2/3 정확한 매핑 (기존 0명 오류 수정)
  - `/today` 신규 — 오늘 크롤링 완료 여부 + 수집 건수
  - `/clicks` 신규 — 오늘 공고 클릭 수 + 출처별 분포
  - `/uptime` 신규 — 봇 시작시각 + 가동시간
  - `/error` 신규 — bot.log 최근 에러 10줄
  - `_sb_get()` / `_sb_rpc()` 공통 Supabase 헬퍼 추출

## [v0.78] 2026-05-19 — 텔레그램 봇 중복 실행 방지 (Named Mutex)

- `start_bot.ps1` — Named Mutex 추가: 이미 실행 중이면 즉시 종료 (두 번 응답 현상 완전 차단)

## [v0.77] 2026-05-19 — 봇 데이터 기준 수정 (jobs_data.js 동기화)

- `telegram_bot.py` — /status·/jobs가 jobs_data.js(사이트 기준) 읽도록 수정, jobs.json 폴백 유지
- `jobs.json` — jobs_data.js와 동기화 (git rebase 충돌로 인한 439건 불일치 해소)

## [v0.76] 2026-05-19 — 텔레그램 봇 버그 수정 3건

- `start_bot.ps1` — Start-Process try/catch 추가, 연속 5회 즉시종료 시 자동재시작 중단 + 알림 (스팸 방지), UTF-8 BOM 인코딩 저장으로 PS5.1 파싱 문제 해결
- `telegram_bot.py` — /subs Supabase 응답이 list가 아닐 경우 명시적 오류 처리 추가

## [v0.75] 2026-05-19 — 텔레그램 봇 보안·운영 강화 + watchdog 자동재시작

- `telegram_bot.py` — `/crawl` 30분 쿨다운, 메인루프 지수 백오프 에러복구, `bot.log` 에러 파일 기록
- `start_bot.ps1` — watchdog 무한루프: 봇 죽으면 10초 후 자동재시작 + 텔레그램 알림, 중복실행 방지
- `crawl_local.ps1` — `crawl.lock` 동시실행 방지(60분 이내 중복 차단), `CleanExit` 함수로 락 파일 정리, `SendTelegram` ForEach-Object → foreach 전환
- 작업 스케줄러 `dongnero_crawl` 신규 등록: WakeToRun 활성화(절전 해제 후 실행), 배터리 제한 해제, 실행제한 2시간
- Windows 레지스트리 HKCU\Run에 `dongnero_telegram_bot` 등록 (PC 시작 시 봇 자동실행)

## [v0.74] 2026-05-19 — 파일 정리: 불필요 삭제 + 메모.md 통합

- 삭제: `kakao-icon-export.html` / `.gitlab-ci.yml` / `crawl_log.txt` / `CRAWL_TARGETS.md` / `BM.md` / `당근커뮤니티_홍보문구.txt`
- 신규: `메모.md` — 수익화BM·AI경쟁우위·크롤링확장계획·당근홍보문구 통합
- `.gitignore` 정리 (메모.md 추가, pycache 추가)

## [v0.73] 2026-05-19 — 크롤링 시작 텔레그램 알림 + GUIDE.md 전면 업데이트

- `crawl_local.ps1` — 크롤링 시작·실패·GitHub push 성공/실패 텔레그램 알림 추가
- `GUIDE.md` — v0.72 기준 전면 업데이트 (로컬 Primary 구조·이상감지·텔레그램·category2·To-do 반영)

## [v0.72] 2026-05-19 — 텔레그램 크롤링 전체 요약 알림

- `crawler.py` — 크롤링 완료 시 항상 텔레그램 전송: 총 건수·출처별 증감·이상 감지 포함

## [v0.71] 2026-05-19 — 크롤링 이상 감지 고도화 + 텔레그램 알림

- `admin-dongnero.html` — 소스 모니터 3버튼 필터 (타임아웃/조기종료/60%미만), 카드 색 제거
- `crawler.py` — 타임아웃 1회 재시도, 이상 감지 시 텔레그램 Bot 알림
- `crawl.yml` — TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 시크릿 연결

## [v0.70] 2026-05-19 — 크롤링 이상 감지 + 어드민 경고 표시

- `crawler.py` — 출처별 에러·조기종료·건수 이상(전일 대비 60%↓) 감지, `crawl_log` jobs.json에 포함
- `admin-dongnero.html` — 소스 모니터 카드에 🚨/⚠️ 경고 배지 표시

## [v0.69] 2026-05-19 — 어드민 업종 필터·태그 추가 + 크롤러 자동 분류 통합

- `admin-dongnero.html` — 업종(category2) 필터 드롭다운 + 제목 셀 파란 태그 표시
- `crawler.py` — 크롤링 저장 직전 classify_jobs.classify() 호출 → 이후 크롤링도 자동 분류

## [v0.68] 2026-05-18 — 공고 상세 업종 분류 (category2) 추가 — 6481건 95.1% 분류

- `classify_jobs.py` 신규 작성 — 키워드 룰 기반 상세 업종 분류기
  - 74개 세부 카테고리 (방문요양보호사 / 영아돌봄 / 식당 / 경비 / 미화 등)
  - 잡아바 category 필드 폴백 + 출처별 2차 매칭 로직
  - 6481건 중 6162건(95.1%) 분류, 기타 319건(4.9%)
- `jobs.json` — 전체 공고에 `category2` 필드 추가 완료

## [v0.67] 2026-05-18 — 어드민 알림신청 중복 제거 + 일별 현황

- `admin-dongnero.html`: 구직카드 탭 개선
  - 이름+전화번호 동일 시 중복 1건으로 처리 (`_dedupedCards`)
  - 요약 칩에 "중복 제외" 건수 표시
  - 일별 알림신청 현황 카드 추가 (중복 제외 기준)
  - 하단 표시 텍스트에 중복 제외/전체 건수 병기

## [v0.66] 2026-05-18 — 시니어로 크롤러 전면 재작성 (136건 → 969건)

- `crawler.py`: 시니어로 수집 방식 변경
  - 구: `searchWork.do` HTML 파싱 → 신: `searchJobList.do` JSON API
  - 전국 267개 지역별 조회 + JOB_ID 기준 중복 제거
  - `_seniorro_get_areas()` + `scrape_seniorro_all()` 함수로 교체

## [v0.65] 2026-05-18 — 정보글 추가: 퇴직 실업급여 신청 가이드

- `posts_data.js`: 신규 글 추가 (id: unemployment-benefit-2026) — 실업급여 수급 조건·금액·신청 절차
- `posts/unemployment-benefit-2026.html`: build_posts.py로 자동 생성
- `sitemap.xml`: 신규 URL 추가

## [v0.64] 2026-05-16 — 정보글 추가: 50대 첫 면접 완전 준비 가이드

### posts_data.js / posts/interview-senior-2026.html
- 신규 정보글: "50대 첫 면접, 이것만 알면 떨리지 않아요"
- 카테고리: 취업 준비 / 태그: 면접준비, 50대면접, 60대재취업, 시니어면접
- 면접 전날 체크리스트, 자주 나오는 질문 5가지 실제 답변 스크립트, 복장 가이드, 감사 문자 예시 포함

---

## [v0.63] 2026-05-16 — 재방문자 추적 (localStorage + 어드민 통계)

### jobs.html
- `_getVisitorId()`: localStorage 기반 영구 방문자 ID (브라우저 닫아도 유지)
- `_trackVisit()`: 세션당 1회 Supabase `visitor_logs` 테이블에 방문 기록
- `job_clicks` 로그에 `visitor_id` 포함 (클릭-방문 연계 분석 가능)
- 페이지 로드 시 자동 호출

### admin-dongnero.html
- 📊 클릭 통계 탭: 재방문자 현황 섹션 추가
  - 신규 방문 / 재방문 수 / 재방문율 / 평균 방문횟수

---

## [v0.62] 2026-05-15 — 세션 ID 추가 (1인당 평균 클릭수 추적)

### jobs.html
- `_getSessionId()`: sessionStorage 기반 익명 세션 ID 자동 생성 (로그인 불필요)
- Supabase `job_clicks` 로그에 `session_id` 포함

### admin-dongnero.html
- 📊 클릭 통계 탭: 순 세션 수 + 클릭/세션 평균 칩 추가

---

## [v0.61] 2026-05-15 — 공고 클릭 추적 (GA4 + Supabase + 어드민 통계)

### jobs.html
- `openJobLink()` 신규: GA4 `job_click` 이벤트 발송 (출처·공고명·업체명 파라미터)
- 맘시터 공고 클릭 시에도 GA4 이벤트 추가
- 외부 링크에 UTM 파라미터 자동 부착 (`utm_source=dongnero&utm_medium=referral&utm_campaign=job_apply`)
- Supabase `job_clicks` 테이블에 클릭 로그 저장 (fire-and-forget)

### admin-dongnero.html
- 📊 클릭 통계 탭 추가: 총/오늘/7일 클릭수, 출처별 클릭 비율 바, 최근 100건 목록

---

## [v0.60] 2026-05-15 — 크롤링 복구 + 중복 실행 충돌 방지

### 크롤링
- 로컬·GitHub Actions 동시 실행으로 발생한 rebase 충돌 수동 해결 후 push
- 6,392건 수집 (Actions 6,334건보다 최신)

### crawl_local.ps1
- 크롤 완료 후 GitHub fetch → 오늘 데이터 이미 있으면 sync만 하고 스킵 (Actions 중복 방지)
- `git pull --rebase` 전략: `-X ours` → `-X theirs` (로컬 데이터 우선으로 방향 수정)

---

## [v0.59] 2026-05-15 — info.html 정보글 조회수 카운트 수정

### info.html
- `incrementViewCount` 함수 추가: 글 열람 시 Supabase `post_views` 테이블 조회수 증가
- `openPost` 함수에서 `incrementViewCount(id)` 호출 (기존엔 어드민에서 읽기만 하고 쓰지 않았음)

---

## [v0.58] 2026-05-14 — 맘시터 중복 제거 버그 수정 + 공고 수 대폭 증가 + PWA 배너 수정

### crawler.py
- **맘시터 중복 버그 수정**: apply_link가 고유한 공고는 title+company가 같아도 중복으로 제거하지 않음
  - 맘시터: 수집 1,000건 → 최종 998건 (이전 403건에서 크게 증가)
  - 부산일자리: 18건 전부 저장 (이전 1건에서 18건으로)
- **대전 구 보완**: wantedAuthNo 역매핑으로 고용24 location에서 구 정보 보완 → 대전 483건 모두 구 분류
- **크롤러 expired 변수 참조 오류 수정** (NameError 완전 제거)
- 후처리 단계별 통계 출력 확인
  - 맘시터 중복: 598건 → 2건 / 부산 중복: 0건 / 잡아바 만료: 1,096건 (정상)

### 크롤링 (2026-05-14 최종)
- 최종 공고: **6,126건** (이전 5,603건 대비 +523건)
- 고용24: 1,000건 / 서울일자리포털: 1,500건 / 잡아바: 1,858건 / 맘시터: 998건 / 알바천국: 55건 / 대전일자리: 483건 / 시니어로: 129건 / 부산일자리: 18건 / 어르신일자리: 7건

### jobs.html
- **PWA 배너 X버튼 항상 작동**: `dismissBannerGlobal`을 early return 전에 등록 → PC·데스크톱에서도 닫힘
- **배너 열릴 때 설치 안내 항상 표시**: 내부 버튼 모두 숨겨져 빈 화면이던 문제 해결

---

## [v0.57] 2026-05-14 — 어르신·부산일자리 중복 제거 버그 수정 + 어드민 제거 통계 개선

### crawler.py
- **버그 수정**: 어르신일자리(45건→1건)·부산일자리(18건→1건) — apply_link가 공통 URL 하나라서 2번째부터 전부 중복 제거되던 문제
  - `SHARED_APPLY_LINKS` set 도입: `ELDER_JOBS_LINK`, `BUSAN_SITE_URL`은 apply_link 중복 체크에서 제외
- 맘시터 597건 제거는 버그 아님 — 만료+필터 제거이며 중복과 무관
- 잡아바 1169건 제거는 정상 — 고용24·서울포털과 wantedAuthNo 동일 공고 제거
- 대전 구 분류: td[2]에서 파싱으로 변경 (title만 보던 방식 개선)

### admin-dongnero.html
- 출처 카드 제거 건수 표시 개선: dedup_removed 있으면 "중복 N건 · 만료/필터 M건" 분리, 없으면 "합산 제거 N건(만료·필터·중복)"으로 명시

---

## [v0.56] 2026-05-14 — 대전 구 분류 개선 + 어드민 카드 중복제거 표시 수정

### crawler.py
- 대전일자리: td[2]("대전 유성구 시급 10320원" 형태)에서 구·급여 파싱으로 변경
  - 기존: title에서만 추출 → 57건만 분류
  - 개선: td[2] 우선 + title 폴백 → 전체 662건 구 분류 가능
- 대전 salary 필드 파싱 추가 (시급/월급/연봉)
- 크롤러 재실행으로 jobs.json 전면 갱신

### admin-dongnero.html
- 출처 카드 중복제거 행: `dedup_removed` 비어있을 때 `raw - final`로 폴백 표시

---

## [v0.55] 2026-05-14 — 어드민 출처별 비교 개선 + 중복제거 통계 + 정보글 조회수

### crawler.py
- `_deduplicate`: 출처별 중복제거 건수(`dedup_removed`) 반환하도록 수정
- 저장 시 이전 `source_counts`를 `prev_source_counts`로 보존 → 어드민 전회 비교용
- `jobs.json`에 `prev_source_counts`, `dedup_removed` 필드 추가

### admin-dongnero.html
- 출처별 모니터링: Supabase seen_jobs 조회 제거 → `jobs.json`의 `prev_source_counts` 활용
- 각 카드에 "수집 N건 / 전회 대비 ±X% / 중복제거 N건 → 최종 N건" 표시
- 정보글 탭: 조회수 컬럼 추가 (Supabase `post_views` 테이블 연동)

### build_posts.py
- 각 `/posts/{id}.html`에 Supabase `post_views` upsert JS 추가 (페이지 로드 시 조회수 +1)

> ⚠️ **Supabase `post_views` 테이블 생성 필요** (아래 SQL을 대시보드 SQL Editor에서 실행)
> ```sql
> CREATE TABLE post_views (
>   post_id text PRIMARY KEY,
>   view_count integer NOT NULL DEFAULT 0,
>   updated_at timestamptz DEFAULT now()
> );
> ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
> CREATE POLICY "public_read"   ON post_views FOR SELECT USING (true);
> CREATE POLICY "public_insert" ON post_views FOR INSERT WITH CHECK (true);
> CREATE POLICY "public_update" ON post_views FOR UPDATE USING (true);
> ```

---

## [v0.54] 2026-05-14 — 운영자 가이드(GUIDE.md) 신규 작성 + CHANGELOG 규칙 강화

### GUIDE.md (신규)
- 서비스 개요, 주요 페이지, 기능별 흐름(크롤링·정보글·알림톡·알림신청) 정리
- 어드민 사용법, 정보글 작성법, 인프라 정보, 남은 할 일, 파일 구조 한눈에 보기

### CLAUDE.md
- CHANGELOG 규칙 강화: "세션 바뀌어도 필수, push 전 반드시 기록" 명시
- GUIDE.md 존재 안내 추가
- 버전 표기 v0.53으로 업데이트

---

## [v0.53] 2026-05-14 — 어드민 정보글 탭 복원 (posts_data.js 기반) + 구 AI 발행 방식 제거

### admin-dongnero.html
- "정보 글" 탭 재추가 — posts_data.js의 POSTS_DATA를 직접 읽어 표시 (Supabase 불필요)
- 각 글마다 "네이버 발행 준비" 버튼: 제목/요약/본문 HTML 복사 + 렌더링 미리보기 모달
- 네이버 블로그 3단계 포스팅 가이드 안내 (HTML 모드 붙여넣기, 각색 리마인더)
- 구 Supabase info_posts 기반 탭·모달·JS 전체 제거
- posts_data.js 스크립트 로드 추가

### backend.py
- SQLite 기반 초기 알림 API — Supabase 전환 후 미사용, 파일 삭제

### crawler.py
- `import os` 누락 수정 (BUSAN_API_KEY os.environ 참조 오류)

### CLAUDE.md
- 정보글 발행 방식 현행화 (posts_data.js + build_posts.py 절차 명시)
- "새로운 정보글 오늘도 작성해줘" 요청 처리 원칙 추가
- RSS URL 오류 수정 (kahn2005 → kyungmh95)
- 버전 표기 v0.52, 게시물 6개로 업데이트

### Supabase
- info_posts 테이블 발행예정 글 전체 삭제 (구 방식 완전 정리)

### 크롤링 (2026-05-14)
- 총 5603건 수집 (만료 1090건 제외 → 4513건 저장)
- 고용24 1000 / 알바천국 300 / 시니어로 130 / 서울일자리포털 1500 / 잡아바 3056 / 어르신일자리 45 / 맘시터 1000 / 대전일자리 707 / 부산일자리 18

---

## [v0.52] 2026-05-14 — 정보게시판 정적 HTML 자동 빌드 (SEO)

### build_posts.py (신규)
- posts_data.js를 파싱해 `/posts/{id}.html` 정적 파일 자동 생성
- 각 파일: title/description/canonical/og 메타태그 + GA + 네이버 인증 포함
- post-tip/post-compare/post-example 등 info.html CSS 클래스 동일하게 적용
- 하단 CTA: 채용공고 바로가기 + 정보게시판 전체보기 버튼

### sitemap.xml
- posts/ 6개 URL 자동 등재 (각 포스트 date 기준 lastmod)

### .github/workflows/crawl.yml
- 매일 크롤링 후 `python build_posts.py` 자동 실행
- `git add`에 `posts/ sitemap.xml` 추가

---

## [v0.51] 2026-05-14 — 정보게시판 글 6편 전면 재작성 (품질 개선)

### posts_data.js
- 기존 6편 모두 전면 재작성 — AI티 제거, 실제 시나리오·대화 예시 추가, 시니어 공감형 서술로 개선
- job-scam-2026: 실제 피해 사례(박영순 씨) 도입, 사기 수법 구체화, 신고 방법 명시
- labor-contract-2026: 실제 피해 상황(최정희 씨) 도입, 주휴수당 계산 예시, 요청 스크립트 추가
- senior-job-support-2026: 방문 전 전화 예시, 처음 방문 가이드, 어떤 분께 맞는지 상세화
- resume-ai-2025: 도입부 개선, 지원 직종별 맞춤 AI 요청 스크립트 추가
- apply-parttime-2025: 전화 지원 스크립트·거절 대응·면접 질문별 답변 예시 대폭 확충
- speech-modern-2025: 카카오톡 예절 비교 예시, 면접 전 연습법 추가

---

## [v0.50] 2026-05-14 — 프로모 카드 개선 + PWA 배너 버그 수정

### jobs.html
- 프로모 카드: 알림신청 완료자(`notify_registered_v3` 키)는 알림신청 카드 제외, 다른 타입으로 대체
- 프로모 카드: 정보게시판 글을 랜덤 대신 POSTS_DATA 순서대로 순환 (인기/최신 우선 노출)
- PWA 배너 버그 수정: `window.openPwaBanner`를 early return 이전에 노출해 dismiss 상태·데스크탑에서도 호출 가능
- 프로모 카드 홈화면 추가 탭 시 dismiss 상태 초기화 후 배너 강제 표시

---

## [v0.49] 2026-05-13 — jobs.html 프로모 카드 (10개마다 랜덤 삽입)

### jobs.html
- 공고 10개마다 3종 중 랜덤 프로모 카드 삽입: ① 홈화면 추가 ② 알림신청 ③ 정보게시판 글
- `PROMO_ENABLED = false` 로 전체 비활성화 가능 (단일 플래그)
- `PROMO_INTERVAL` 상수로 삽입 간격 조정 가능
- 필터·지역 변경 시 카운터 초기화, 연속 동일 타입 방지

### CLAUDE.md
- 프로모 카드 제거 방법 명시 (`PROMO_ENABLED = false`)

---

## [v0.48] 2026-05-13 — 어드민 출처별 공고 수 모니터링 (오늘 vs 어제)

### admin-dongnero.html
- 공고 탭 상단에 "출처별 현황" 섹션 추가
- 오늘 jobs.json 기준 각 출처별 공고 수 표시
- seen_jobs Supabase 테이블에서 yesterday first_seen 건수와 비교해 증감 표시
- 크게 차이나는 출처(±30% 이상) 주황 경고 표시 → 크롤링 이상 탐지용

---

## [v0.47] 2026-05-13 — 부산광역시 공공부문 일자리 크롤러 추가

### crawler.py
- `scrape_busan()` 신규 추가 — data.go.kr BusanJobOpnngInfoService REST API
  - HTTP only (HTTPS 401), 5페이지 × 100건
  - 합격자 발표·서류전형 결과 등 공지성 항목 자동 제거 (11개 키워드 필터)
  - 최근 1년 이내 등록 공고만 수집, 마감일 있는 경우 오늘 이후만
- `BUSAN_API_KEY` 환경변수 또는 하드코딩 키 사용
- 크롤링 단계: [9/9] → [10/10]

### jobs.html
- 부산일자리 색상·CSS 추가 (`#0369A1` 파란색)
- 출처 필터 드롭다운, 푸터, srcList/colors에 부산일자리 추가

### CLAUDE.md
- 크롤링 출처 9개 → 10개

---

## [v0.46] 2026-05-13 — 대전일자리 크롤러 추가 + 전체 출처 중복제거 개선

### crawler.py
- `scrape_daejeon()` 신규 추가 — jobdaejeon.or.kr POST 스크래핑 (72페이지 × 10건 ≈ 710건)
- `_deduplicate()` 3단계 개선: wantedAuthNo(work24 URL 파라미터) → apply_link → (title+company) 순서
  - 대전일자리 ↔ 고용24 같은 공고 wantedAuthNo로 자동 제거
- `_extract_wanted_no()` 헬퍼 추가
- 크롤링 단계: [8/8] → [9/9]

### jobs.html
- 대전일자리 색상·CSS 클래스 추가 (`#B45309` 갈색)
- 출처 필터 드롭다운, 푸터 출처 목록에 대전일자리 추가

### CLAUDE.md
- 크롤링 출처 8개 → 9개로 업데이트
- 중복 제거 로직 항목 추가

---

## [v0.45] 2026-05-13 — 잡아바 직종 필드 수집 + 알림톡 매칭 정확도 개선

### crawler.py
- 잡아바 공고에 `category` 필드 추가 (`RECRUT_FIELD_NM` — 채용직종 분류)

### notify.py
- `JOBABA_CATEGORY_MAP` 추가 — 잡아바 직종 분류 → desired_job 태그 매핑
- `match_job_type()` 개선 — category 필드 우선 매칭 후 title 키워드 폴백
- level2 구독자 알림 누락 버그 수정 — `is_active` 필터 제거 (is_active는 구직카드 공개 여부, 알림 수신 여부 아님)

---

## [v0.44] 2026-05-13 — 신규 일자리 알림톡 자동 발송 시스템

### notify.py (신규)
- 매일 크롤링 후 신규 공고 감지 → 활성 구독자(alert_level ≥ 2)와 지역·직종 매칭 → Solapi 카카오 알림톡 발송
- Supabase `seen_jobs` 테이블로 전일 공고와 비교해 신규만 추출
- `notify_sent_log` 테이블로 당일 중복 발송 방지
- 신규 3건 미만이면 미발송 (스팸 방지)
- 운영자에게 발송 완료 SMS 요약

### .github/workflows/crawl.yml
- 크롤링 후 `python notify.py` 자동 실행 단계 추가
- GitHub Secrets 참조: SOLAPI_API_KEY, SOLAPI_API_SECRET, SUPABASE_URL, SUPABASE_KEY, OPERATOR_PHONE, KAKAO_PFID, KAKAO_TMPL_WITH_JOB, KAKAO_TMPL_NO_JOB, SENDER_NUMBER

### Supabase (수동 실행 필요)
- `seen_jobs` 테이블: apply_link(PK), title, location, source, first_seen
- `notify_sent_log` 테이블: seeker_card_id + sent_date UNIQUE 제약

---

## [v0.43] 2026-05-13 — PWA 설치 버튼 개선 + manifest 동네로 업데이트

### manifest.json
- name/short_name `시니어취업` → `동네로`
- PNG 아이콘 추가: `icon-192.png`(192×192), `icon-512.png`(512×512) — Android Chrome 설치 프롬프트 필수 조건
- SVG만 있던 이전 설정 → PNG 우선 + SVG 폴백으로 변경
- background_color `#F7F8FA` → `#FFF9F4`, theme_color `#2563EB` → `#FF6B35` (사이트 색상 통일)

### jobs.html
- PWA 배너 Android 설치 버튼: 즉시 표시 → `beforeinstallprompt` 실제 발화 후에만 표시
- 미지원 브라우저(Firefox Android 등): 처음부터 수동 안내 노출

---

## [v0.42] 2026-05-13 — SEO 개선 (RSS 피드, sitemap lastmod, robots.txt)

### rss.xml (신규)
- 정보게시판 6개 글을 RSS 2.0 형식으로 제공
- 네이버 서치어드바이저 RSS 제출용 (색인 속도 개선)

### sitemap.xml
- 각 URL에 `<lastmod>` 날짜 추가

### robots.txt
- `Sitemap: https://dongnero.kr/rss.xml` 라인 추가

---

## [v0.41] 2026-05-09 — 어드민 구직카드 휴지통(소프트삭제) 기능

### admin-dongnero.html
- 구직카드 "선택 삭제" → "휴지통으로" 소프트삭제 방식으로 전환
- 휴지통 보기 버튼: 삭제된 항목 목록 + 삭제 시각 표시
- 항목별 "복구" 버튼으로 정상 목록 복원 가능
- Supabase SQL: `deleted_at timestamptz` 컬럼 추가, `admin_trash/restore/get_trash_seeker_cards(uuid[])` 함수 생성
- uuid 타입 오류 수정 (bigint[] → uuid[]), 중복 함수 정리

---

## [v0.40] 2026-05-09 — 어드민 구직카드 선택 삭제 + desired_job 표시

### admin-dongnero.html
- 구직카드 테이블 체크박스 + 선택 삭제 버튼 추가
- Supabase RPC `admin_get_seeker_cards` → `RETURNS SETOF seeker_cards`로 변경해 `desired_job`(기타 입력 포함) 표시
- `admin_delete_seeker_cards(uuid[])` 함수 생성

---

## [v0.39] 2026-05-09 — UX 세부 개선 (탭·카드·맘시터·공고수)

### jobs.html
- 공고카드 이모지(🏢📍💰📅) 제거 → 텍스트 라벨(위치·급여·마감)로 교체
- 고용형태 "미기재" 태그 숨김 (정규직·계약직·시간제만 표시)
- 맘시터 토글 버튼 텍스트 "맘시터 공고 ON/OFF" 추가
- 맘시터 OFF 시 지역 공고수(`regionLabel`)도 맘시터 제외한 수로 갱신 (버그 수정)
- 지역 공고수 표시 "서울 — 50건" → "50건"으로 간소화
- 알림신청 자동팝업 30초 → 60초로 변경
- 활성 탭 `font-weight: 900` 강화

### info.html
- 탭바 디자인 jobs.html과 통일 (연하늘 배경, 1rem 폰트)

---

## [v0.38] 2026-05-09 — 하단 탭바 + 스크롤 상단 개선

### jobs.html
- 하단 탭바 추가: 홈·공고·정보·알림신청 (텍스트 전용, 연하늘 배경)
- 스크롤 시 toolbar(필터행 포함) 슬라이드업 — `position: fixed` + `transform` 방식으로 layout-jump 제거
- FAB 버튼 탭바 위 고정 (`bottom: 72px`), PWA 배너 표시 시 배너 높이 동적 계산
- 스크롤 후 상단 가로선(header/toolbar border) 숨김 처리
- PWA 배너 표시 시 FAB 위치 동적 계산 (`banner.offsetHeight + 16px`)

### info.html
- 하단 탭바 추가 (정보 탭 active), 알림신청 탭 → `jobs.html#notify`로 이동

---

## [v0.37] 2026-05-09 — SEO 설정 + 네이버 인증

### index.html / jobs.html / info.html
- `description`, `keywords`, `canonical`, `og:` 태그 추가
- 네이버 서치어드바이저 소유권 인증 태그 추가 (index.html)
- 도메인 `dongnero.kr` 기준으로 모든 URL 통일

### sitemap.xml / robots.txt (신규)
- sitemap.xml 생성 (index·jobs·info 3페이지, dongnero.kr 기준)
- robots.txt 생성 (admin 제외, sitemap 경로 명시)

---

## [v0.36] 2026-05-09 — PWA GA 이벤트 + 드로어 아이콘 확대

### jobs.html
- 드로어 햄버거 아이콘 크기 1.25rem → 1.7rem 확대
- PWA 배너 GA 이벤트 추가: `pwa_banner_show(trigger)` / `pwa_install_tap(platform)` / `pwa_install_done`

---

## [v0.35] 2026-05-09 — index.html 메인 헤더 개편

### index.html
- 소개 문구 "50대 이상을 위한 전국 일자리…" 제거
- 8개 출처 칩(고용24·알바몬·알바천국 등) 추가
- 한 줄 소개: "공신력 있는 8개 사이트 공고를 내 동네 맞춤으로 드려요"

---

## [v0.34] 2026-05-09 — 크롤링·정보글 발행 스케줄 KST 07:00 통일

### .github/workflows/crawl.yml / daily-post.yml
- 크롤링: `0 23 * * *`(08시 KST) → `0 22 * * *`(07시 KST)
- 정보글 발행: `0 1 * * *`(10시 KST) → `0 22 * * *`(07시 KST)

---

## [v0.33] 2026-05-09 — 알림신청 UX 개선

### jobs.html
- FAB 노출 타이밍: 스크롤 3회 → 첫 스크롤 또는 10초 후
- 알림신청 자동팝업: 페이지 진입 60초 후 1회 (미등록·미노출 사용자)
- GA4 이벤트: `notify_auto_popup` 추가

---

## [v0.32] 2026-05-09 — GA 이벤트 + 구글·네이버 Search Console 등록

### jobs.html
- GA4 이벤트: `notify_modal_open` / `notify_form_submit` 추가
- Google Search Console: GA 연동으로 소유권 확인 완료, sitemap 제출
- Naver Search Advisor: 소유권 확인 완료, sitemap 제출

---

## [v0.31] 2026-05-09 — 홈화면 배너 고정·알림버튼 애니·GA 이벤트

### jobs.html
- 홈화면 추가 힌트 바(`home-hint-bar`)를 `sticky-top` 안으로 이동 — 스크롤해도 상단 고정
- 알림신청 FAB 깜박임 애니(`fab-blink`) 강화 — 최대 1.25배 확대·8px 상하이동·주황↔빨강↔노랑 색상 전환
- GA4 이벤트 추가: `notify_modal_open`(버튼 클릭 시) / `notify_form_submit`(등록 완료 시)
  → Explore > 퍼널 탐색에서 두 이벤트 비교 시 미등록 이탈률 측정 가능

---

## [v0.30] 2026-05-08 — 어드민 UX 개선

### admin-dongnero.html
- 구직카드 등록일 컬럼에 시:분 표시 추가 (`5/8 21:12` 형식)
- CSV 내보내기도 `2026-05-08 21:12` 형식으로 통일
- 정보글 탭 **발행상태 배지** 추가 — ✅ 발행됨(날짜) / 📅 발행예정 구분
- 정보글 탭 **👁 미리보기 버튼** 추가 — info.html과 동일한 형태로 본문 모달 팝업
- 발행예정 글 미리보기 시 주황색 배너("아직 공개되지 않았습니다") 표시
- 모달 외부 클릭으로 닫기 지원

---

## [v0.29] 2026-05-08 — 알림신청 저장 버그 수정

### index.html
- 알림신청 폼 제출 시 Supabase 에러를 `catch (_) {}`로 무시하던 버그 수정
- `res.ok` 체크 추가 — HTTP 4xx/5xx 에러 시 빨간 에러 메시지 표시
- 네트워크 오류 별도 처리 — "인터넷 연결을 확인해 주세요" 메시지
- 에러 발생 시 버튼 재활성화 (재시도 가능)
- 성공 시에만 localStorage 저장 (기존: 에러 여부 무관하게 저장)

### Supabase (직접 수정)
- `seeker_cards.location_sido` NOT NULL 제약 제거 → nullable
- `seeker_cards.desired_job` NOT NULL 제약 제거 → nullable
- 1·2단계 신청자(지역·직종 미입력)도 정상 저장되도록 수정

---

## [v0.28] 2026-05-08 — 정보게시판 AI 예약 발행 + 어드민 글 삭제

### info.html
- 게시물 카드 UI 단순화 — 제목 + 한 줄 부제목만 표시, 작성자·태그 푸터 제거
- Supabase `info_posts` 테이블 연동 — AI 생성 글을 정적 글과 병합해 노출
- 발행된 글만 표시 (`published_at IS NOT NULL` 필터), AI 글이 상단 정렬
- `allPosts` 전역 배열로 통합 관리, `openPost()` / popstate 핸들러 동일하게 수정
- 드로어 `구직카드 · 알림 신청` → `내 동네 일자리 알림` 문구 통일

### admin-dongnero.html
- **📝 정보 글 탭** 신규 추가 — Supabase `info_posts` 목록 조회 + 행별 삭제 버튼
- `loadInfoPosts()` / `deleteInfoPost(id)` 함수 추가

### .github/workflows/daily-post.yml (신규)
- 매일 KST 10:00 (UTC 01:00) 자동 실행
- Supabase에서 `published_at = NULL`인 가장 오래된 글 1개를 찾아 `published_at = now()` 설정
- Anthropic API 불필요 — 미리 작성된 30개 예약 글 순차 발행

### Supabase (수동 실행 필요)
- `info_posts` 테이블 생성 (uuid PK, category, title, summary, content, tags, author, created_at, published_at)
- RLS: 공개 SELECT / anon INSERT / anon DELETE 정책 설정
- 30개 정보 글 INSERT (근로계약서·4대보험·주휴수당·최저임금·퇴직금 등 노동 권리·취업 준비 주제)

---

## [v0.27] 2026-05-08 — UI 문구 통일 + FAB 깜박임 애니메이션

### jobs.html
- 플로팅 버튼 텍스트 `구직카드 · 알림 신청` → `내 동네 일자리 알림`
- FAB 20초 주기 깜박임 애니메이션 추가 (`@keyframes fab-blink`, 3초 딜레이 후 시작)
- 드로어 `공고 직접 등록` → `공고 등록`
- 드로어 `구직카드 · 알림 신청` → `내 동네 일자리 알림`

### info.html
- 드로어 `공고 직접 등록` → `공고 등록`
- 드로어 `구직카드 · 알림 신청` → `내 동네 일자리 알림`

### index.html
- FAB 버튼 텍스트 `구직카드 · 알림 신청` → `내 동네 일자리 알림`

---

## [v0.26] 2026-05-08 — jobs.html 무한 스크롤 + info.html 드로어 링크 수정

### jobs.html
- **무한 스크롤** 도입 — 최초 50건만 렌더링, 스크롤 하단 300px 근접 시 50건씩 추가 (`IntersectionObserver`)
- 필터·지역·검색 변경 시 Observer 초기화 후 첫 배치부터 재렌더링
- 지역별 구 그룹 헤더 순서 유지, 직접등록 공고 섹션 우선 표시

### info.html
- 드로어 `구직카드 · 알림 신청` 링크 `seeker-card-form.html` → `index.html?notify=1` 변경

### index.html
- `?notify=1` URL 파라미터 감지 시 구직카드·알림 모달 자동 오픈

---

## [v0.25] 2026-05-08 — 크롤링 시간 조정 + 로컬 작업스케줄러 제거

### .github/workflows/crawl.yml
- 크론 `0 0 * * *` (UTC 00:00 = KST 09:00) → `0 23 * * *` (UTC 23:00 = KST 08:00)
- UTC 자정 혼잡 시간대 회피로 실제 실행 지연 감소

### 삭제 파일
- `register_task.bat` — Windows 작업스케줄러 등록 스크립트 (GitHub Actions로 대체)
- `run_crawler.bat` — 로컬 크롤러 실행 배치 파일

---

## [v0.24] 2026-05-04 — 알림 신청·구직카드 통합 모달 (레벨 슬라이더)

### jobs.html
- **알림 신청 모달 전면 재설계** — 구직카드 등록과 알림 신청 통합
  - 3단계 레벨 슬라이더 도입 (클릭형 step tracker)
    - 1단계 정보보기: 연령대·지역만 (연락 불필요)
    - 2단계 알림받기: 전화번호 추가 필수 → 새 일자리 문자 알림
    - 3단계 적극구직: 이름·희망직종 추가 → 구직카드 업체 공개
  - 저장 대상: `seeker_cards` 테이블 (`alert_level`, `is_active` 컬럼 활용)
  - 레벨별 성공 메시지 분리, 연령대·고용형태 탭버튼으로 UX 개선
  - FAB 텍스트: "구직카드 · 알림 신청"으로 변경
- 드로어 "구직카드 등록" → 모달 직접 오픈으로 통합

### Supabase (추가 SQL 필요)
- `seeker_cards` 테이블: `alert_level INT` 컬럼 추가
- `name`, `contact_phone` NOT NULL 제약 해제 (1단계는 불필요)

## [v0.23] 2026-05-04 — 기업 직접 공고 등록 + 구직카드 시스템

### 신규 페이지
- **company-job-form.html** — 기업 공고 직접 등록 폼
  - 회사정보·공고내용·근무지역 입력 후 Supabase `company_jobs`에 저장
  - 등록 후 `company_token`(UUID) 화면에 표시 + 복사 기능
- **seeker-card-form.html** — 구직자 프로필 카드 등록 폼
  - 이름·연령대·희망직종·연락처 등 입력, Supabase `seeker_cards`에 저장
  - 개인정보 수집·이용 동의 체크 필수
- **supabase_setup.sql** — Supabase SQL Editor에서 실행할 테이블·RLS·RPC 전체 스크립트

### Supabase 테이블 및 보안
- `company_jobs` 테이블: pending/approved/rejected 상태 관리, `company_token` UUID 자동생성
- `seeker_cards` 테이블: RLS로 직접 SELECT 차단, RPC로만 접근 가능
- RPC 함수 4개: `admin_get_company_jobs`, `admin_update_company_job`, `get_seeker_cards_by_token`, `admin_get_seeker_cards`
  - 승인된 기업의 `company_token`으로만 구직카드 열람 가능

### jobs.html
- Supabase에서 승인된 기업공고(`status=approved`) 비동기 로드
- 직접공고를 지역 목록 **최상단**에 고정 노출 ("📌 동네로 인증 공고" 섹션)
- **동네로 인증** 블루 체크 배지 + 파란 테두리 카드 스타일 적용
- 출처 필터 적용 시 직접공고 자동 제외 (UX 일관성)
- 드로어 메뉴에 📝 공고 직접 등록, 💼 구직카드 등록 항목 추가

### local.html
- 지역 선택 시 해당 지역 직접공고도 최상단 노출
- `loadDirectJobsLocal(sido, gu)` 비동기 함수로 Supabase 조회 후 prepend

### admin-dongnero.html
- **📝 기업공고 탭** 추가
  - `admin_get_company_jobs` RPC로 전체 공고(pending 포함) 조회
  - 건별 승인(초록)/반려(빨강) 버튼, 반려 시 사유 입력
  - 기업 토큰 복사 버튼 (승인 후 기업에 전달용)
  - 상태별 요약 칩 (대기/승인/반려 건수)
- **💼 구직카드 탭** 추가
  - `admin_get_seeker_cards` RPC로 전체 구직카드 조회
  - 이름·연령대·희망지역·희망직종·연락처 표시

## [v0.22] 2026-05-03 — 정보게시판(info.html) 신설

### 신규: info.html + posts_data.js
- **정보게시판 페이지** 신설 — 운영자 블로그형 칼럼 + 독자 댓글
  - 게시물 목록 뷰 → 카드 클릭 시 상세 뷰 (해시 라우팅, 브라우저 뒤로가기 지원)
  - 본문 스타일: 팁 박스, 예시 박스, 전·후 비교 박스
  - 댓글: Supabase `post_comments` 테이블 연동 (닉네임·내용·시간 표시)
  - 댓글 등록 즉시 목록 갱신, XSS 방지 처리
- **posts_data.js** — 운영자가 편집하는 정적 게시물 파일
  - 1호: AI로 이력서 작성하는 법
  - 2호: 알바 지원 단계별 완전정복
  - 3호: 면접에서 손해 보는 말투 고치기
- **Supabase `post_comments` 테이블** 생성 SQL을 info.html 주석에 포함

### jobs.html
- 드로어 메뉴에 📰 정보게시판 항목 추가

---

## [v0.21] 2026-05-03 — 맘시터 공고 1000건 확대 + jobs.html 토글 버튼 추가

### crawler.py
- `MOMSITTER_PAGES` 20 → 100 (최대 1000건 수집)

### jobs.html
- **맘시터 공고 토글 버튼**: 지역버튼 우측에 `맘시터 공고` 버튼 추가
  - 기본 OFF: 맘시터 공고 숨김 (기존 동작 유지)
  - 버튼 누르면 ON: 맘시터 공고 함께 노출, 오렌지색 활성 표시
  - 다시 누르면 OFF: 맘시터 공고 숨김
- 맘시터 카드 스타일 추가 (오렌지 라인·뱃지 `#FF7F25`)
- 출처 필터 드롭다운에 `맘시터` 옵션 추가
- 헤더 통계 칩에 맘시터 수집 건수 표시
- 푸터 출처 목록에 `맘시터` 추가

---

## [v0.20] 2026-05-03 — 맘시터 베이비시터 구인공고 수집 추가

### crawler.py
- **맘시터(mom-sitter.com) 출처 추가** — 부모님이 베이비시터를 구하는 공고 수집
  - 공개 JSON API (`POST https://api.mom-sitter.com/public-web-api/v1/parents/search`) 사용, 인증 불필요
  - 페이지당 10건, 최대 20페이지(200건) 수집
  - 제목·지역·급여(월정액/협의)·돌봄 유형(정기/단기)·아이 정보 파싱
  - 상세 링크: `https://www.mom-sitter.com/parent/{userId}` (로그인 후 열람 가능)
- 출처 단계 번호 일괄 수정: 기존 [1/6]~[7/7] → [1/8]~[8/8]

---

## [v0.19] 2026-05-03 — jobs.html UI 개선: 지역 드롭버튼 + 검색 토글

### jobs.html
- **지역 탭 → 드롭버튼**: 스크롤 탭 제거, "서울전체 ▾" 형태 버튼으로 교체
  - 클릭 시 바텀시트에서 구/군 선택 (공고 수 표시)
  - 전국 페이지에서는 시/도 선택 바텀시트
  - 선택 상태 표시: 구 선택 시 파란색 활성화
- **검색창 → 돋보기 토글**: 항상 노출 대신 🔍 아이콘 클릭 시 검색창 슬라이드다운
  - ✕ 버튼으로 닫기, 닫을 때 검색어 초기화

---

## [v0.18] 2026-05-03 — jobs.html 지역 탭 구 단위 전환 + 구별 그룹 정렬

### jobs.html
- **지역 탭 동작 변경**: 특정 시/도로 진입 시(`?region=서울` 등) 지역 탭이 해당 지역의 구/군 탭으로 전환 (공고 수 많은 순 정렬)
- **구별 그룹 정렬**: 특정 구 미선택 상태에서 구 헤더(강남구 N건, 강동구 N건...)로 공고를 그룹핑
- **`setDistrict(d, el)`** 함수 추가 — 구 탭 클릭 핸들러
- **`renderCard(job)`** 함수 분리 — 그룹 헤더 삽입 로직 위해 카드 렌더링 함수화
- **`sortArr(arr)`** 내부 헬퍼 — 그룹 내에서도 동일 정렬 기준 적용
- **CSS `.district-header`** 추가 — 구/군 그룹 구분선 스타일

---

## [v0.17] 2026-05-02 — 위치 배너 플로팅 전환 + 내 동네 일자리 섹션 삭제

### index.html
- **위치 기반 배너 → 하단 플로팅 배너**: `<main>` 인라인 슬라이드 → `position:fixed` 하단 슬라이드업 방식으로 변경
- **내 동네 일자리 찾기 버튼 삭제**: `local.html` 연결 버튼 제거

---

## [v0.16] 2026-05-02 — 시니어 부적합 필터 대폭 확장

### crawler.py — EXCLUDE_COMPANIES 확장 (33 → 51개)
- **게임회사**: 넥슨·넷마블·엔씨소프트·크래프톤·펄어비스·스마일게이트·컴투스·게임빌·카카오게임즈·위메이드
- **젊은층 패션**: 무신사·에이블리·지그재그·브랜디·스파오·탑텐
- **배달앱**: 쿠팡이츠·배달의민족·요기요
- **피트니스 프랜차이즈**: 애니타임피트니스·스포애니·더피트·24시스포츠

### crawler.py — EXCLUDE_KEYWORDS 확장 (29 → 60개)
- **IT 확장**: 프론트엔드·백엔드·풀스택(suffix 없이도), devops, sre, 웹퍼블리셔, 서비스 기획자, python/java 개발, llm, mlops, 블록체인, web3
- **디지털 디자인**: 그래픽 디자이너·브랜드 디자이너·모션 그래픽·영상 편집·3d 디자이너·게임 아티스트·웹툰 작가
- **게임·e스포츠**: 게임 기획·게임 디자인·e스포츠·스트리머
- **SNS 크리에이터 확장**: 유튜브 편집·틱톡 운영·숏폼·릴스·인터넷 방송
- **퍼포먼스 마케팅**: 퍼포먼스 마케터·그로스 마케터·seo 마케터·앱 마케터
- **배달 라이더**: 배달 라이더·배달기사·새벽 배송 기사·쿠팡 로켓배송
- **피트니스 강사**: 헬스 트레이너·퍼스널 트레이너·필라테스·요가 강사
- **인턴·신입 공채**: 인턴십·채용연계형 인턴·대졸 신입 공채

---

## [v0.15] 2026-05-02 — Google Analytics 4 추가

### 전체 HTML 파일 (5개)
- `index.html`, `jobs.html`, `local.html`, `privacy.html`, `admin-dongnero.html` `<head>` 최상단에 GA4 스크립트 삽입
- 측정 ID: G-PYD0Q5NTPD
- 방문자수·유입채널·페이지뷰·지역·기기 등 분석 가능

---

## [v0.14] 2026-05-02 — index.html 지역별 공고수 집계 수정

### index.html — REGION_MAP jobs.html과 동기화
- **원인**: index.html의 REGION_MAP이 단순 약칭만 포함 → 도 전체명(충청북도 등), 경기도 시군명(용인시 등)을 매핑 못해 지역 공고수가 jobs.html과 불일치
- **수정**: jobs.html REGION_MAP과 동일하게 확장
  - 도 전체명 9개 추가 (충청북도·충청남도·전라북도·전라남도·경상북도·경상남도·경기도·강원도·제주도)
  - 경기도 시군 30개 추가 (수원·성남·의정부·안양·부천·광명·동두천·안산 등)
  - 광주 중의성 처리: 광주광역시 → 광주, 광주시 → 경기

---

## [v0.13] 2026-05-02 — 경기도 시군 지역 분류 수정

### jobs.html — REGION_MAP 경기도 시군 추가 (30개)
- 잡아바 데이터가 "용인시", "시흥시" 등 시군 이름만 제공해 기타 2353건 발생
- 경기도 31개 시군 전체를 "경기"로 매핑 추가:
  수원·성남·의정부·안양·부천·광명·동두천·안산·과천·구리·남양주·오산·시흥·군포·
  의왕·하남·용인·파주·이천·안성·김포·화성·평택·양주·포천·여주·고양·가평군·양평군·연천군
- 광주시 충돌 처리: "광주시" → 경기도 광주시로 먼저 매핑 (광주광역시 키 분리)
- **결과**: 기타 2353건 → 522건 (빈값 485건 + 지역무관 37건만 기타, 실질 미분류 0건)

### crawler.py
- 잡아바 WORK_REGION_CONT 빈값 시 기본값 "경기" 처리 (잡아바는 경기도 전용 포털)

---

## [v0.12] 2026-05-02 — 지역 분류 기타 버그 수정

### jobs.html — REGION_MAP 확장
- **원인**: 일부 공고 location이 도명 전체 표기(충청북도, 경상남도 등)를 사용해 약칭 매핑 누락 → 기타 분류
- **수정**: 전체 도명 → 약칭 매핑 9개 추가
  - 충청북도→충북, 충청남도→충남, 전라북도→전북, 전라남도→전남
  - 경상북도→경북, 경상남도→경남, 경기도→경기, 강원도→강원, 제주도→제주
- **결과**: 실질 미분류 70건 → 0건 (지역무관 39건은 기타 유지가 올바름)

---

## [v0.11] 2026-05-02 — GitLab CI 오류 수정 + GitHub 자동 push

### .gitlab-ci.yml 수정
- **버그 수정**: `git add`에 `excluded_data.js` 누락 → `git pull --rebase` 시 unstaged 충돌 발생하던 문제 해결
- **`--autostash` 추가**: pull --rebase 시 미스테이징 파일 있어도 안전하게 rebase 진행
- **GitHub 자동 push 추가**:
  - GitLab CI 완료 후 `github.com/jnyoong/dongnero` 로 자동 push
  - GitLab CI/CD 변수 `GITHUB_TOKEN` 설정 필요 (Settings → CI/CD → Variables)
  - 토큰 미설정 시 경고 메시지 출력 후 스킵 (파이프라인 실패 안 함)

### .github/workflows/crawl.yml 수정
- `excluded_data.js` git add에 추가 (GitHub Actions도 동일하게 수집)
- pip install에서 `-r requirements.txt` → 직접 패키지 명시로 변경 (requirements.txt 의존 제거)

---

## [v0.10] 2026-05-02 — 경기도 어르신자립형일자리사업 출처 추가

### crawler.py
- `scrape_elder_jobs_sheet()` 신규 추가
  - 데이터: `data.gg.go.kr` 어르신자립형일자리사업 현황 (infId: AXMYYE3KRB83S1MRYS0Z21195052)
  - Sheet API 방식, 인증 불필요, 잡아바와 동일한 방법
  - **"모집중" 상태인 공고만 필터링**해서 수집
  - 필드 매핑: 운영기관명(company), 시군명(location), 임금정보(salary), 공고종료일(deadline)
  - 개별 링크 없음 → 데이터셋 페이지 링크로 대체
  - run_crawler 7단계로 추가
- 출처명: `어르신일자리`

### admin-dongnero.html / jobs.html
- `어르신일자리` 출처 배지·색상·필터 드롭다운 추가 (초록 계열)

---

## [v0.9] 2026-05-02 — 잡아바 Sheet API 임시 수집 (키 없이 동작)

### crawler.py — 경기도 잡아바 수집 방식 변경
- **기존**: `openapi.gg.go.kr` API 키 필요 방식 (이 데이터셋은 해당 엔드포인트 미지원 확인)
- **변경**: `data.gg.go.kr` Sheet API 방식 — 인증 없이 즉시 동작
  - 엔드포인트: `POST /portal/data/sheet/searchSheetData.do`
  - 회당 1,000건, 페이지네이션으로 전체 수집 (~3,000건 이상)
  - 데이터 출처: https://data.gg.go.kr 경기도 잡아바 채용정보 공개 데이터셋
- **이중 모드 유지**
  - `JOBABA_API_KEY` 미입력 → Sheet 모드로 자동 실행 (현재)
  - `JOBABA_API_KEY` 입력 시 → 공식 API 키 모드로 자동 전환 (키 발급 후)
  - API 키 모드 오류 발생 시 Sheet 모드로 자동 폴백

---

## [v0.8] 2026-05-02 — 크롤링 출처 확장 + 전면 안정화

### 신규 크롤링 출처
- **서울시 일자리포털** (`job.seoul.go.kr`) — 즉시 동작, API 키 불필요
  - POST AJAX 방식으로 최대 15페이지(1,500건) 수집
  - 제목·회사·위치·급여·마감일 파싱
- **경기도 잡아바** (`openapi.gg.go.kr/JOBABARecrtInfo`) — API 키 필요
  - `JOBABA_API_KEY` 변수에 키 입력 시 자동 활성화 (최대 20페이지)
  - 키 발급: https://data.gg.go.kr/portal/myPage/actKeyPage.do
  - 키 미설정 시 스킵하고 발급 URL 안내 출력

### 크롤링 안정성 전면 개선 (crawler.py)
- **`requests.Session()` 도입** — 출처별 독립 세션으로 쿠키 유지, 커넥션 재사용
- **헤더 강화** — Accept, Accept-Language, Accept-Encoding, Connection, DNT 등 실제 브라우저와 동일하게 설정
- **페이지 간 지연** — 기존 고정 2.0초 → 3.0초 + 랜덤 0~2.0초 jitter
- **출처 전환 시 대기** — 5~10초 랜덤 대기 추가 (사이트 입장에서 자연스러운 브라우저 동작처럼 보이게)
- **지수 백오프 재시도** — 고정 3초 재시도 → 2^n + 랜덤 jitter 방식으로 교체
  - 1차 재시도: ~2초, 2차: ~4초, 3차: ~8초
- **`_crawl_source()` 헬퍼** 추가 — 페이지 루프·대기·조기종료 로직 일원화
- 알바몬·알바천국·시니어로 페이지 수 소폭 확대 (알바천국 4→6, 시니어로 6→8)

### admin-dongnero.html / jobs.html
- 서울일자리포털·잡아바 출처 배지 색상 추가 (청록·보라)
- 출처 필터 드롭다운에 두 출처 추가
- 통계 칩·카드 상단 라인 색상 등록

---

## [v0.7] 2026-05-02 — 공고 목록 탭 수동 필터 처리 기능 추가

### 관리자 페이지 (admin-dongnero.html)
- **공고 목록 탭 — 수동 필터 처리 기능 추가**
  - 각 행에 체크박스 + 전체선택 체크박스 추가
  - 🚫 선택 필터 처리 / ✅ 필터 해제 버튼
  - 💾 manual_excluded.js 생성 (복사/다운로드)
  - 수동 필터된 행은 빨간 배경 + 🚫 수동필터 배지
  - 상단 "수동 필터됨 N건" 요약 칩
  - 상태 필터 드롭다운 (전체 / 수동필터됨만 / 정상만)

### 신규 파일
- `manual_excluded.js` — 수동 필터 목록 (커밋 시 jobs.html에 자동 반영)

### jobs.html
- `manual_excluded.js` 로드 추가
- 수동 필터 등록된 공고는 메인 목록에서 제외

---

## [v0.6] 2026-05-02 — 수동 필터·수동 해제 기능 + 필터 대폭 확장

### 관리자 페이지 (admin-dongnero.html)
- **공고 목록 탭 — 수동 필터 처리 기능 추가**
  - 각 행에 체크박스 + 전체선택 체크박스 추가
  - 🚫 선택 필터 처리 : 체크한 공고를 수동으로 숨김 처리
  - ✅ 필터 해제 : 수동 필터된 공고 복원
  - 💾 manual_excluded.js 생성 : 변경사항을 파일로 내보내기 (복사/다운로드)
  - 전체 초기화 버튼
  - 수동 필터된 행은 빨간 배경 + 🚫 수동필터 배지로 구분
  - 상단에 "수동 필터됨 N건" 요약 칩 추가
  - 상태 필터 드롭다운 추가 (전체 / 수동필터됨만 / 정상 공고만)
- **필터링 제외 탭 — 수동 해제 기능 추가** (이번 세션 첫 번째 작업)
  - 각 행에 체크박스 + 전체선택 추가
  - ✅ 선택 해제 처리 : 잘못 필터된 공고를 복원 등록
  - 🚫 해제 취소 : 복원 취소
  - 💾 whitelist_data.js 생성 : 내보내기
  - 해제된 행은 초록 배경 + ✅ 해제됨 배지
  - 상태 필터 드롭다운 추가
  - localStorage 기반 저장 (브라우저 영속)

### 크롤러 필터 확장 (crawler.py)
- **업체명 블랙리스트 14 → 32개로 확장**
  - 패스트푸드: 롯데리아, 맥도날드, KFC, 버거킹, 서브웨이, 파파이스, 노브랜드버거, 맘스터치, 쉐이크쉑, 파이브가이즈
  - 카페 추가: 메가커피, 엔제리너스, 커피빈, 블루보틀, 더벤티, 카페베네
  - 디저트: 배스킨라빈스, 던킨, 크리스피크림
  - 편의점: 이마트24, GS25, CU편의점, 세븐일레븐
- **IT 직군 키워드 15 → 30개로 확장**
  - `'개발자'` 단독 추가 → "Java 개발자", "Python 개발자" 등 광범위 캐치
  - 추가: 웹 개발자, UI 디자이너, 데이터 분석가, 데이터 엔지니어, QA 엔지니어
  - 추가: 프로덕트 매니저, 프로덕트 디자이너, 게임 PD
  - 기술 스택: node.js, react, vue.js, spring, flutter, kotlin, typescript
  - `'병역특례'` 추가 (청년 IT 개발자 채용 신호)

### 신규 파일
- `whitelist_data.js` : 수동 해제 공고 저장 파일 (커밋 시 실제 반영)
- `manual_excluded.js` : 수동 필터 공고 저장 파일 (커밋 시 실제 반영)

### jobs.html
- `whitelist_data.js`, `manual_excluded.js` 로드 추가
- 화이트리스트 공고는 메인 목록에 병합 표시
- 수동 필터 공고는 메인 목록에서 제외

---

## [v0.5] 2026-05-01 — IT·SNS·체력직 필터 추가 + 관리자 키워드 목록 표시
- `crawler.py` : IT 개발직, SNS 크리에이터, 극한 체력직 키워드 필터 추가
- `admin-dongnero.html` : 필터링 제외 탭에 업체명·키워드 블랙리스트 목록 표시

---

## [v0.4] 2026-05-01 — 고용24 안정성 개선
- `crawler.py` : timeout 30초로 증가, 최대 3회 재시도 로직 추가

---

## [v0.3] 2026-05-01 — 관리자 페이지 공고·필터링 탭 + excluded_data.js
- `admin-dongnero.html` : 공고 목록 탭, 필터링 제외 탭 추가
- `crawler.py` : excluded_data.js 파일 자동 생성 추가
- 관리자 페이지 미생성 상태 안내 메시지 처리

---

## [v0.2] 2026-05-01 — 시니어 부적합 필터 + 관리자 페이지 기초
- `crawler.py` : 올리브영·CGV·주점 등 업체명·키워드 필터 최초 추가
- `admin-dongnero.html` : 관리자 페이지 기초 구현 (알림 신청 탭)
- 크롤러 실행 시각 KST 적용

---

## [v0.1] 2026-05-01 — 프로젝트 기초
- GitHub Pages 이전 (Netlify 제거)
- 위치 기반 공고 필터 및 구 선택 바텀시트 추가
- 내 동네 일자리 페이지 (`local.html`) 추가
- 고용24 / 알바몬 / 알바천국 / 시니어로 크롤러 구현
