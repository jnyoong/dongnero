# 동네로 운영 가이드

> 최종 업데이트: 2026-05-15 (v0.59)  
> 운영자: kyungmh95 / kahn201130@gmail.com

---

## 1. 서비스 한 줄 요약

**동네로(dongnero.kr)** — 50대·60대 시니어·중장년 특화 취업정보 플랫폼.  
10개 출처에서 매일 크롤링한 공고 + 시니어 맞춤 정보글 + 카카오 알림톡 서비스.

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

### 3-1. 크롤링 (매일 자동)

```
GitHub Actions (crawl.yml, 매일 07시 KST)
  └─ python crawler.py
       ├─ 고용24 (1,000건)
       ├─ 알바천국 (300건)
       ├─ 시니어로 (최대 240건)
       ├─ 서울일자리포털 (최대 1,500건)
       ├─ 잡아바 / 어르신일자리 (경기, Sheet API)
       ├─ 맘시터 (최대 1,000건)
       ├─ 대전일자리 (최대 710건)
       └─ 부산일자리 (data.go.kr API)
  └─ jobs.json + jobs_data.js 갱신
  └─ python build_posts.py  → posts/ 정적 HTML 재생성
  └─ python notify.py       → 신규 공고 알림톡 발송
  └─ git push → GitHub Pages 자동 배포
```

로컬에서 수동 크롤링을 먼저 실행하면 Actions는 그날 스킵 (`last_crawl.txt` 날짜 체크).

**로컬 자동 크롤링 (Windows 작업 스케줄러):**
- 작업명: `동네로_크롤링` — 매일 07:00 KST 실행
- 스크립트: `crawl_local.ps1` (크롤링 → last_crawl.txt 기록 → git push)
- GitHub PAT가 remote URL에 포함되어 백그라운드 인증 가능
- 로컬 크롤링 성공 시 당일 GitHub Actions는 스킵됨 (중복 방지)

**크롤러 후처리 단계 (순서 중요):**
1. 대전 구 보완 — wantedAuthNo 역매핑으로 고용24 location에서 구 추출
2. _deduplicate() — wantedAuthNo → apply_link → title+company 3순위
   - apply_link 고유 공고는 title 중복 체크 제외 (맘시터 등)
   - SHARED_APPLY_LINKS (어르신일자리·부산일자리) — apply_link 중복 체크 제외
3. 부적합 업체/키워드 필터
4. 만료 제거 — 잡아바 Sheet API만 해당 (다른 출처는 소스에서 이미 처리)

### 3-2. 정보글 발행

```
운영자가 posts_data.js에 글 객체 추가
  └─ python build_posts.py
       └─ /posts/{id}.html 자동 생성 (SEO: canonical, og, sitemap)
  └─ git add posts/ sitemap.xml posts_data.js && git push github main
  └─ 네이버 블로그(blog.naver.com/kyungmh95)에 도입부·마무리 각색 후 발행
```

**어드민 → "정보 글" 탭**에서 글 목록 확인 + "네이버 발행 준비" 버튼으로 제목/요약/HTML 복사 가능.

**조회수**: info.html에서 글을 열면 Supabase `post_views` 테이블에 자동 카운트 (`incrementViewCount`). 어드민 "정보 글" 탭에서 실시간 확인 가능. 정적 페이지(`/posts/*.html`) 직접 접근도 동일하게 카운트됨.

### 3-3. 카카오 알림톡

```
notify.py (매일 크롤링 후 자동 실행)
  └─ Supabase notify_signups에서 alert_level>=2 구독자 조회
  └─ 오늘 신규 공고 중 구독자 희망지역·직종 매칭
  └─ Solapi API로 카카오 알림톡 발송
       ├─ 매칭 공고 있음 → KAKAO_TMPL_WITH_JOB 템플릿
       └─ 매칭 공고 없음 → KAKAO_TMPL_NO_JOB 템플릿
```

> ⚠️ **현재 상태**: 템플릿 심사 요청 중. 승인 후 GitHub Secrets에 `KAKAO_TMPL_WITH_JOB`, `KAKAO_TMPL_NO_JOB` 추가 필요.

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
| 공고 목록 | 전체 공고 확인, 수동 필터 처리 |
| 필터링 제외 | 자동 필터된 공고 확인, 화이트리스트 복원 |
| 기업공고 | 기업이 직접 등록한 공고 승인/반려 |
| 구직카드 | 알림 신청자 구직카드 조회 |
| **정보 글** | posts_data.js 기반 글 목록, 네이버 발행 준비 |

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

## 6. GitHub Actions 스케줄

| 워크플로우 | 파일 | 실행 시간 |
|------------|------|-----------|
| 크롤링·배포·알림 | `crawl.yml` | 매일 07:00 KST (UTC 22:00) |

---

## 7. 인프라 정보

| 항목 | 값 |
|------|----|
| 저장소 | github.com/jnyoong/dongnero (main 브랜치) |
| 배포 | GitHub Pages (push 즉시 자동 반영) |
| 도메인 | https://dongnero.kr |
| DB | Supabase (`riomousxlyvwmembuhvc`) |
| 알림 API | Solapi (카카오 알림톡) |
| Analytics | Google Analytics G-PYD0Q5NTPD |
| 네이버 블로그 | blog.naver.com/kyungmh95 |

**Supabase 테이블:**
- `notify_signups` — 알림 신청자
- `post_comments` — 정보글 댓글
- `seeker_cards` — 구직카드
- `seen_jobs` — 사용자 조회 이력
- `notify_sent_log` — 알림 발송 로그

---

## 8. 남은 할 일 (To-do)

- [ ] 카카오 알림톡 템플릿 승인 후 GitHub Secrets에 `KAKAO_TMPL_WITH_JOB`, `KAKAO_TMPL_NO_JOB` 추가
- [ ] 네이버 블로그 6편 발행 (어드민 → 정보 글 탭 → 네이버 발행 준비 활용)
- [ ] 네이버 서치어드바이저 RSS 등록 확인 (rss.blog.naver.com/kyungmh95.xml)
- [ ] GitHub PAT 만료 전 갱신 및 `git remote set-url github` 재적용 (보안상 주기적 교체 권장)
- [ ] Supabase `post_views` 테이블에 실제 조회수 누적 확인 (정보글 HTML 배포 완료)

---

## 9. 주요 파일 한눈에 보기

```
dongnero/
├── index.html          메인 페이지
├── jobs.html           채용공고 목록
├── info.html           정보게시판
├── local.html          동네 일자리
├── install.html        홈화면 추가 안내
├── admin-dongnero.html 운영자 어드민
│
├── posts_data.js       정보글 원본 데이터 (운영자가 직접 편집)
├── posts/              정보글 정적 HTML (build_posts.py가 자동 생성)
├── jobs.json           크롤링 결과 (Actions가 매일 갱신)
├── jobs_data.js        jobs.json의 JS 버전
├── excluded_data.js    필터링된 공고
├── sitemap.xml         검색엔진 사이트맵
│
├── crawler.py          크롤러 본체 (10개 출처)
├── build_posts.py      정보글 정적 HTML 빌더
├── notify.py           카카오 알림톡 발송
├── crawl_local.ps1     로컬 크롤링·push 스크립트 (Windows 작업 스케줄러 연동)
│
├── .github/workflows/
│   └── crawl.yml       매일 크롤링·빌드·알림 자동화 (07:00 KST)
│
├── CHANGELOG.md        변경 이력 (코드 수정 시 항상 업데이트)
└── GUIDE.md            이 파일 (운영 가이드)
```
