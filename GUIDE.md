# 동네로 운영 가이드

> 최종 업데이트: 2026-05-19 (v0.86)  
> 운영자: kyungmh95 / kahn201130@gmail.com

---

## 1. 서비스 한 줄 요약

**동네로(dongnero.kr)** — 50대·60대 시니어·중장년 특화 취업정보 플랫폼.  
10개 출처에서 매일 크롤링한 공고 + 74개 업종 자동 분류 + 시니어 맞춤 정보글 + 카카오 알림톡 서비스.

---

## 2. 주요 페이지와 역할

| 페이지 | URL | 역할 |
|--------|-----|------|
| 메인 | `/` (index.html) | 지역 카드 그리드, 위치 배너 |
| 채용공고 | `/jobs.html` | 지역·업종·출처 필터, 맘시터 토글, 프로모 카드 |
| 정보게시판 | `/info.html` | 칼럼 목록·상세 + Supabase 댓글 |
| 동네일자리 | `/local.html` | 시도·구 기반 필터 (`?sido=서울&gu=강남구`) |
| 홈화면추가 | `/install.html` | PWA 설치 안내 |
| **어드민** | `/admin-dongnero.html` | 공고 관리·필터·구직카드·정보글·클릭통계 |

---

## 3. 기능별 흐름

### 3-1. 크롤링 — 핵심 기능 ⚡ (매일 자동, 서비스의 근간)

**로컬 PC가 PRIMARY, GitHub Actions는 FALLBACK.**

```
매일 08:30 — Windows 작업 스케줄러 (동네로_크롤링, 실행제한 2시간)
    ↓
crawl_local.ps1 실행
    │
    ├─ crawl.lock 생성 (동시 실행 방지, 60분 이내 중복 차단)
    ├─ 텔레그램 🚀 "크롤링 시작" 발송
    │
    ├─ python crawler.py (~15~25분)
    │       ├─ 고용24       (최대 1,000건)
    │       ├─ 알바몬       (최대 80건)
    │       ├─ 알바천국     (최대 300건)
    │       ├─ 시니어로     (최대 969건)
    │       ├─ 서울일자리포털 (최대 1,500건)
    │       ├─ 잡아바       (최대 3,000건+)
    │       ├─ 어르신일자리  (경기, Sheet API)
    │       ├─ 맘시터       (최대 1,000건)
    │       ├─ 대전일자리   (최대 540건)
    │       └─ 부산일자리   (data.go.kr API)
    │       ↓
    │       이상 감지 (타임아웃·조기종료·전일 60%↓) → 1회 자동 재시도
    │       업종 자동 분류 (category2, 74개 카테고리, 95%+ 커버)
    │       출처간 중복제거 → jobs.json + jobs_data.js 동시 저장 (항상 동기화)
    │       텔레그램 📊 크롤링 결과 요약 발송 (출처별 건수·증감·이상)
    │
    ├─ last_crawl.txt에 오늘 날짜 기록 (GitHub Actions 스킵 트리거)
    ├─ crawl.lock 삭제
    │
    ├─ git commit + push → GitHub Pages 자동 배포 (dongnero.kr 반영)
    │       └─ 텔레그램 ✅ "GitHub 배포 완료" 발송
    │
    └─ 실패 시 텔레그램 ❌ "크롤링 실패" 발송

같은 날 GitHub Actions (UTC 23:30 = KST 08:30) 실행 시
    → last_crawl.txt = 오늘 날짜 → 스킵 (로컬 우선)
    → 오늘 날짜 아님 (PC 꺼져있었음) → Actions가 직접 크롤링 실행
```

**텔레그램 봇:** @jnyoong_bot (chat_id: 8741560901)  
**자격증명:** `.env.local` (gitignore됨, 로컬에만 존재)

**크롤러 이상 감지 3종 (어드민 소스 모니터에서 확인):**
- 🚨 **타임아웃** — 페이지 요청 중 연결 오류, 1회 자동 재시도 후 기록
- ⚠️ **조기종료** — 에러 없이 예정 페이지보다 적게 수집
- 📉 **60%미만** — 전일 대비 40% 이상 감소

**크롤러 후처리 단계 (순서 중요):**
1. 대전 구 보완 — wantedAuthNo 역매핑으로 고용24 location에서 구 추출
2. `_deduplicate()` — wantedAuthNo → apply_link → title+company 3순위
3. 부적합 업체/키워드 필터
4. 만료 제거 — 잡아바 Sheet API만 해당
5. 업종 분류 — classify_jobs.py, 74개 category2 필드 추가 (95.1% 분류)

**로컬 크롤링 문제 발생 시 점검 순서:**
1. 텔레그램에서 `/today` 또는 `/status` 확인
2. 텔레그램 `/log` 로 크롤 로그 확인
3. 작업 스케줄러 확인: `schtasks /query /tn "동네로_크롤링" /fo LIST`
4. 수동 실행: 프로젝트 폴더에서 `.\crawl_local.ps1`

---

### 3-2. 텔레그램 봇 원격 제어

**폰에서 언제든 서비스 상태 확인·운영 가능.**

```
PC 시작 시 레지스트리(HKCU\Run) → start_bot.ps1 자동 시작 (Hidden)
    ↓
start_bot.ps1 — watchdog 무한루프
    ├─ telegram_bot.py 실행 (Hidden)
    ├─ 봇 종료 시 10초 후 자동재시작
    ├─ 5회 연속 즉시종료 시 재시작 중단 + 텔레그램 경고
    └─ Named Mutex로 중복 실행 완전 차단
```

**봇 명령어 전체:**

| 명령어 | 설명 |
|--------|------|
| `/status` | 크롤링 출처별 건수·증감·중복제거·이상 (어드민 수준) |
| `/today` | 오늘 크롤링 완료 여부 + 최종 수집건수 |
| `/subs` | 구직카드 가입자 현황 (lv1 정보보기 / lv2 알림받기 / lv3 적극구직) |
| `/clicks` | 오늘·어제 공고 클릭 수 + 출처별 순위 |
| `/log` | 최근 크롤 로그 20줄 (crawl_log.txt) |
| `/error` | 봇 Python 에러 10줄 (bot.log) |
| `/uptime` | 봇 시작 시각 + 가동시간 |
| `/crawl` | 크롤링 즉시 실행 (30분 쿨다운) |
| `/help` | 명령어 목록 |

**자동 알림:**
- 크롤링 시작 / 완료 / 실패 → 자동 발송 (로컬·Actions 모두)
- 구직카드 신규 가입 즉시 → 이름·전화뒷4자리·단계 발송 (**Supabase Edge Function, PC 꺼져도 작동**)
- 봇 프로세스 재시작 시 → 재시작 횟수·이유 발송

**PC 꺼져도 살아있는 것:** 구직카드 신규 알림(Edge Function), 크롤링(GitHub Actions), 사이트 서비스(GitHub Pages)  
**PC 켜야 작동:** 텔레그램 봇 명령어(/status 등)

---

### 3-3. 정보글 발행

```
운영자가 posts_data.js에 글 객체 추가
  └─ python build_posts.py
       └─ /posts/{id}.html 자동 생성 (SEO: canonical, og, sitemap)
  └─ git add posts/ sitemap.xml posts_data.js && git push github main
  └─ 네이버 블로그(blog.naver.com/kyungmh95)에 도입부·마무리 각색 후 발행
```

**어드민 → "정보 글" 탭**에서 글 목록 확인 + "네이버 발행 준비" 버튼으로 제목/요약/HTML 복사 가능.

---

### 3-3-1. 구직카드 신규 가입 즉시 알림 (Supabase Edge Function)

```
사용자가 구직카드 등록
  → seeker_cards INSERT
  → DB 트리거 on_seeker_cards_insert 발동
  → pg_net.http_post → Edge Function notify-new-seeker 호출
  → 텔레그램 "🔔 신규 구직카드 등록!" 즉시 발송
      이름 / 전화번호 뒷4자리 / 단계(lv1~3) / 중복 여부
```

- Edge Function URL: `https://riomousxlyvwmembuhvc.supabase.co/functions/v1/notify-new-seeker`
- pg_net v0.20.0, Supabase 서버에서 실행 → PC 꺼져도 100% 동작
- 트리거에 `EXCEPTION WHEN OTHERS THEN RETURN NEW` 적용 → 알림 실패해도 등록은 항상 성공

---

### 3-4. 카카오 알림톡

```
notify.py (매일 크롤링 후 자동 실행 — GitHub Actions)
  └─ Supabase seeker_cards에서 alert_level=3 구독자 조회
  └─ 오늘 신규 공고 중 구독자 희망지역·직종 매칭
  └─ Solapi API로 카카오 알림톡 발송
       ├─ 직종 있음 → KAKAO_TMPL_WITH_JOB 템플릿
       └─ 직종 없음 → KAKAO_TMPL_NO_JOB 템플릿
```

> ⚠️ **현재 상태**: 솔라피 검수 완료. GitHub Secrets 등록 후 crawl.yml notify 단계 활성화 필요.  
> crawl.yml의 notify 단계는 현재 `if: false`로 비활성화 상태.

---

## 4. 어드민 사용법 (admin-dongnero.html)

비밀번호: `dongnero2024`

| 탭 | 용도 |
|----|------|
| 공고 목록 | 전체 공고 확인, 업종(category2) 필터, 수동 필터 처리 |
| 필터링 제외 | 자동 필터된 공고 확인, 화이트리스트 복원 |
| 구직카드 | 알림 신청자 구직카드 조회 (lv1/2/3 단계별, 중복제거 기준) |
| **정보 글** | posts_data.js 기반 글 목록, 네이버 발행 준비 |
| **📊 클릭 통계** | 공고 클릭수·출처별 비율·재방문자 현황 |

**소스 모니터 (공고 목록 탭 상단):**  
출처별 수집 건수 + 전일 비교. 이상 감지 버튼 3개:  
`타임아웃` | `조기종료` | `60%미만` — 클릭 시 해당 출처만 필터링

---

## 5. 정보글 새로 작성하는 법

Claude에게 아래처럼 요청하면 됩니다:

> "새로운 정보글 오늘도 작성해줘"

Claude가 자동으로:
1. 시니어 공감형 글 작성 (AI 티 없이, 실사례 포함)
2. `posts_data.js`에 추가
3. `build_posts.py` 실행 → HTML 생성
4. 커밋·push까지 완료

그 다음 어드민 → "정보 글" 탭 → "네이버 발행 준비" 버튼으로 네이버 블로그에 각색 발행.

---

## 6. 크롤링 스케줄 (전체 구조)

| 주체 | 방식 | 시간 | 역할 |
|------|------|------|------|
| **로컬 PC (Primary)** | Windows 작업 스케줄러 `동네로_크롤링` | 매일 08:30 KST | crawl_local.ps1 → crawler.py → push |
| GitHub Actions (Fallback) | crawl.yml | 매일 08:30 KST (UTC 23:30) | 로컬 안 됐을 때만 실행 |

**우선순위 메커니즘:**
- 로컬 성공 → `last_crawl.txt` = 오늘 날짜로 기록 + push
- GitHub Actions → `last_crawl.txt` 확인 → 오늘 날짜면 스킵
- GitHub Actions: 시작·완료 텔레그램 알림 추가됨 (로컬과 동일 수준)
- GitHub Actions notify 단계: 현재 비활성화 (`if: false`) — 카카오 Secrets 등록 후 활성화 필요

**작업 스케줄러 설정 (동네로_크롤링):**
- 실행 제한: 2시간 (변경 완료)
- 배터리 제한: 해제
- 새 인스턴스 정책: 새 인스턴스 실행 안 함

---

## 7. 인프라 정보

| 항목 | 값 |
|------|----|
| 저장소 | github.com/jnyoong/dongnero (main 브랜치) |
| 배포 | GitHub Pages (push 즉시 자동 반영) |
| 도메인 | https://dongnero.kr |
| DB | Supabase (`riomousxlyvwmembuhvc`) |
| 알림 API | Solapi (카카오 알림톡) — 검수 완료, Secrets 등록 필요 |
| 텔레그램 봇 | @jnyoong_bot — watchdog 상시 운영, 명령어 8개, 구독자 실시간 알림 |
| Supabase Edge Function | notify-new-seeker — 구직카드 INSERT 즉시 알림 (PC 무관) |
| Analytics | Google Analytics G-PYD0Q5NTPD |
| 네이버 블로그 | blog.naver.com/kyungmh95 |

**Supabase 테이블:**
- `seeker_cards` — 구직카드 (lv1 정보보기 / lv2 알림받기 / lv3 적극구직)
- `post_comments` — 정보글 댓글
- `seen_jobs` — 신규 공고 추적 (notify.py용)
- `notify_sent_log` — 알림 발송 로그
- `job_clicks` — 공고 클릭 로그
- `visitor_logs` — 방문자 로그 (재방문 추적)
- `post_views` — 정보글 조회수

---

## 8. 남은 할 일 (To-do)

- [ ] **카카오 알림톡 활성화**: GitHub Secrets에 `KAKAO_TMPL_WITH_JOB`, `KAKAO_TMPL_NO_JOB`, `KAKAO_PFID`, `SENDER_NUMBER`, `SOLAPI_API_KEY`, `SOLAPI_API_SECRET` 등록 → crawl.yml UI에서 notify 단계 `if: false` 제거
- [x] ~~**GitHub Secrets 텔레그램**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` 등록~~ **완료**
- [x] ~~**crawl.yml GitHub UI 수정**~~ **완료** (workflow scope 추가 후 push)
- [ ] **네이버 블로그 미발행 글 확인 후 발행**
- [ ] **GitHub PAT 만료 전 갱신** 및 `git remote set-url github` 재적용
- [ ] **당근 커뮤니티 홍보 시작** (메모.md에 홍보 문구 20개 보관 중)

---

## 9. 주요 파일 한눈에 보기

```
dongnero/
├── index.html            메인 페이지
├── jobs.html             채용공고 목록
├── info.html             정보게시판
├── local.html            동네 일자리
├── install.html          홈화면 추가 안내
├── admin-dongnero.html   운영자 어드민 (비번: dongnero2024)
│
├── posts_data.js         정보글 원본 데이터 (운영자가 직접 편집)
├── posts/                정보글 정적 HTML (build_posts.py가 자동 생성)
├── jobs.json             크롤링 결과 (crawl_log, source_counts, category2 포함)
├── jobs_data.js          jobs.json의 JS 버전 (사이트·봇의 실제 기준)
├── excluded_data.js      필터링된 공고
├── whitelist_data.js     수동 화이트리스트
├── manual_excluded.js    수동 필터 목록
├── last_crawl.txt        로컬 크롤링 날짜 (GitHub Actions 스킵 기준)
├── sitemap.xml           검색엔진 사이트맵
│
├── crawler.py            크롤러 본체 (10개 출처, 이상감지, 분류, 텔레그램 요약)
├── classify_jobs.py      업종 자동 분류 (74개 카테고리, 95.1%)
├── build_posts.py        정보글 정적 HTML 빌더
├── notify.py             카카오 알림톡 발송 (현재 비활성화)
├── crawl_local.ps1       로컬 크롤링 (잠금·텔레그램·push 포함)
├── telegram_bot.py       텔레그램 원격 제어 봇 (명령어 8개 + 자동알림)
├── start_bot.ps1         봇 watchdog (자동재시작·중복방지·Named Mutex)
│
├── supabase/
│   └── functions/
│       └── notify-new-seeker/index.ts   구직카드 신규 즉시 알림 Edge Function
├── .env.local            텔레그램 토큰·chat_id (gitignore됨)
│
├── .github/workflows/
│   └── crawl.yml         매일 크롤링 자동화 (로컬 없을 때 Fallback)
│
├── CHANGELOG.md          변경 이력 (코드 수정 시 항상 업데이트)
├── GUIDE.md              이 파일 (운영 가이드)
└── 메모.md               수익화BM·AI전략·크롤링확장·홍보문구 (gitignore됨)
```
