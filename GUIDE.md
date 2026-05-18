# 동네로 운영 가이드

> 최종 업데이트: 2026-05-19 (v0.72)  
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
| **어드민** | `/admin-dongnero.html` | 공고 관리·필터·구직카드·정보글 확인 |

---

## 3. 기능별 흐름

### 3-1. 크롤링 — 핵심 기능 ⚡ (매일 자동, 서비스의 근간)

**로컬 PC가 PRIMARY, GitHub Actions는 FALLBACK.**

```
매일 07:00 — Windows 작업 스케줄러 (동네로_크롤링)
    ↓
crawl_local.ps1 실행
    │
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
    │       ├─ 대전일자리   (최대 710건)
    │       └─ 부산일자리   (data.go.kr API)
    │       ↓
    │       이상 감지 (타임아웃·조기종료·전일 60%↓) → 1회 자동 재시도
    │       업종 자동 분류 (category2, 74개 카테고리, 95%+ 커버)
    │       텔레그램 📊 크롤링 결과 요약 발송 (출처별 건수·증감·이상)
    │
    ├─ last_crawl.txt에 오늘 날짜 기록 (GitHub Actions 스킵 트리거)
    │
    ├─ git commit + push → GitHub Pages 자동 배포 (dongnero.kr 반영)
    │       └─ 텔레그램 ✅ "GitHub 배포 완료" 발송
    │
    └─ 실패 시 텔레그램 ❌ "크롤링 실패" 발송

같은 날 GitHub Actions (UTC 22:00 = KST 07:00) 실행 시
    → last_crawl.txt = 오늘 날짜 → 스킵 (로컬 우선)
    → 오늘 날짜 아님 (PC 꺼져있었음) → Actions가 직접 크롤링 실행
```

**텔레그램 봇:** @jnyoong_bot (chat_id: 8741560901)  
**자격증명:** `.env.local` (gitignore됨, 로컬에만 존재)  
**GitHub Secrets 미등록 시:** Actions 실행 중엔 텔레그램 미발송 (추후 등록 가능)

**크롤러 이상 감지 3종 (어드민 소스 모니터에서 확인):**
- 🚨 **타임아웃** — 페이지 요청 중 연결 오류, 1회 자동 재시도 후 기록
- ⚠️ **조기종료** — 에러 없이 예정 페이지보다 적게 수집
- 📉 **60%미만** — 전일 대비 40% 이상 감소

**크롤러 후처리 단계 (순서 중요):**
1. 대전 구 보완 — wantedAuthNo 역매핑으로 고용24 location에서 구 추출
2. _deduplicate() — wantedAuthNo → apply_link → title+company 3순위
3. 부적합 업체/키워드 필터
4. 만료 제거 — 잡아바 Sheet API만 해당
5. 업종 분류 — classify_jobs.py, 74개 category2 필드 추가 (95.1% 분류)

### 3-2. 정보글 발행

```
운영자가 posts_data.js에 글 객체 추가
  └─ python build_posts.py
       └─ /posts/{id}.html 자동 생성 (SEO: canonical, og, sitemap)
  └─ git add posts/ sitemap.xml posts_data.js && git push github main
  └─ 네이버 블로그(blog.naver.com/kyungmh95)에 도입부·마무리 각색 후 발행
```

**어드민 → "정보 글" 탭**에서 글 목록 확인 + "네이버 발행 준비" 버튼으로 제목/요약/HTML 복사 가능.

### 3-3. 카카오 알림톡

```
notify.py (매일 크롤링 후 자동 실행 — GitHub Actions)
  └─ Supabase notify_signups에서 alert_level>=2 구독자 조회
  └─ 오늘 신규 공고 중 구독자 희망지역·직종 매칭
  └─ Solapi API로 카카오 알림톡 발송
       ├─ 직종 있음 → KAKAO_TMPL_WITH_JOB 템플릿
       └─ 직종 없음 → KAKAO_TMPL_NO_JOB 템플릿
```

> ⚠️ **현재 상태**: 솔라피 검수 완료. GitHub Secrets에 `KAKAO_TMPL_WITH_JOB`, `KAKAO_TMPL_NO_JOB`, `KAKAO_PFID`, `SENDER_NUMBER`, `SOLAPI_API_KEY`, `SOLAPI_API_SECRET` 추가 필요.  
> crawl.yml의 notify 단계는 현재 `if: false`로 비활성화 상태 (테스트 후 활성화 예정).

### 3-4. 알림 신청 (사용자 흐름)

```
jobs.html 프로모 카드 "알림 받기" 클릭
  └─ Supabase notify_signups 테이블에 저장
       (phone, region, desired_job, alert_level, seeker_card_id)
  └─ 이후 notify.py가 매칭해서 알림 발송
```

---

## 4. 어드민 사용법 (admin-dongnero.html)

비밀번호: `dongnero2024`

| 탭 | 용도 |
|----|------|
| 공고 목록 | 전체 공고 확인, 업종(category2) 필터, 수동 필터 처리 |
| 필터링 제외 | 자동 필터된 공고 확인, 화이트리스트 복원 |
| 구직카드 | 알림 신청자 구직카드 조회 |
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
| **로컬 PC (Primary)** | Windows 작업 스케줄러 `동네로_크롤링` | 매일 07:00 KST | crawl_local.ps1 → crawler.py → push |
| GitHub Actions (Fallback) | crawl.yml | 매일 07:00 KST (UTC 22:00) | 로컬 안 됐을 때만 실행 |

**우선순위 메커니즘:**
- 로컬 성공 → `last_crawl.txt` = 오늘 날짜로 기록 + push
- GitHub Actions → `last_crawl.txt` 확인 → 오늘 날짜면 스킵
- GitHub Actions notify 단계: 현재 비활성화 (`if: false`)

**로컬 크롤링 문제 발생 시 점검 순서:**
1. 텔레그램 메시지 확인 (07:00에 🚀 시작 메시지 왔는지)
2. `crawl_log.txt` 확인 (프로젝트 폴더)
3. 작업 스케줄러 확인: `schtasks /query /tn "동네로_크롤링" /fo LIST`
4. 수동 실행: 프로젝트 폴더에서 `.\crawl_local.ps1`

---

## 7. 인프라 정보

| 항목 | 값 |
|------|----|
| 저장소 | github.com/jnyoong/dongnero (main 브랜치) |
| 배포 | GitHub Pages (push 즉시 자동 반영) |
| 도메인 | https://dongnero.kr |
| DB | Supabase (`riomousxlyvwmembuhvc`) |
| 알림 API | Solapi (카카오 알림톡) — 검수 완료, Secrets 등록 필요 |
| 텔레그램 봇 | @jnyoong_bot (크롤링 시작·완료·이상 알림) |
| Analytics | Google Analytics G-PYD0Q5NTPD |
| 네이버 블로그 | blog.naver.com/kyungmh95 |

**Supabase 테이블:**
- `notify_signups` — 알림 신청자
- `post_comments` — 정보글 댓글
- `seeker_cards` — 구직카드
- `seen_jobs` — 신규 공고 추적 (notify.py용)
- `notify_sent_log` — 알림 발송 로그
- `job_clicks` — 공고 클릭 로그
- `visitor_logs` — 방문자 로그 (재방문 추적)
- `post_views` — 정보글 조회수

---

## 8. 남은 할 일 (To-do)

- [ ] 카카오 알림톡 GitHub Secrets 등록 (`KAKAO_TMPL_WITH_JOB`, `KAKAO_TMPL_NO_JOB`, `KAKAO_PFID`, `SENDER_NUMBER`, `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`) 후 crawl.yml notify 단계 `if: false` → `if: steps.check_local.outputs.skip == 'false'` 로 복구
- [ ] GitHub Secrets에 `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` 등록 (crawl.yml의 Actions 실행 시에도 텔레그램 받으려면)
- [ ] crawl.yml GitHub UI에서 수정 (PAT에 workflow scope 없어서 로컬 push 불가)
- [ ] 네이버 블로그 미발행 글 확인 후 발행
- [ ] GitHub PAT 만료 전 갱신 및 `git remote set-url github` 재적용
- [ ] 당근 커뮤니티 홍보 시작

---

## 9. 주요 파일 한눈에 보기

```
dongnero/
├── index.html            메인 페이지
├── jobs.html             채용공고 목록
├── info.html             정보게시판
├── local.html            동네 일자리
├── install.html          홈화면 추가 안내
├── admin-dongnero.html   운영자 어드민
│
├── posts_data.js         정보글 원본 데이터 (운영자가 직접 편집)
├── posts/                정보글 정적 HTML (build_posts.py가 자동 생성)
├── jobs.json             크롤링 결과 (crawl_log, category2 포함)
├── jobs_data.js          jobs.json의 JS 버전
├── excluded_data.js      필터링된 공고
├── last_crawl.txt        로컬 크롤링 날짜 (GitHub Actions 스킵 기준)
├── sitemap.xml           검색엔진 사이트맵
│
├── crawler.py            크롤러 본체 (10개 출처, 이상감지, 텔레그램 요약)
├── classify_jobs.py      업종 자동 분류 (74개 카테고리, 95.1%)
├── build_posts.py        정보글 정적 HTML 빌더
├── notify.py             카카오 알림톡 발송
├── crawl_local.ps1       로컬 크롤링 스크립트 (텔레그램 시작·완료·실패 알림)
├── setup_scheduler.ps1   Windows 작업 스케줄러 등록 (최초 1회)
├── .env.local            텔레그램 토큰 등 로컬 환경변수 (gitignore됨)
│
├── .github/workflows/
│   └── crawl.yml         매일 크롤링 자동화 (로컬 없을 때 Fallback)
│
├── CHANGELOG.md          변경 이력 (코드 수정 시 항상 업데이트)
└── GUIDE.md              이 파일 (운영 가이드)
```
