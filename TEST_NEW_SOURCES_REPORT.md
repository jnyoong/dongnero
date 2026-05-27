# 신규 공공 소스 크롤링 테스트 결과 보고서

> 테스트 일자: 2026-05-28  
> 테스트 파일: `test_new_sources.py`  
> 결과 파일: `test_new_sources_result.json`  
> ⚠️ `jobs.json` / `jobs_data.js` **미수정** — 승인 후 반영

---

## 수집 결과 요약

| 소스 | 수집건수 | 기존중복 | 순증 | 상태 |
|------|---------|---------|-----|------|
| 나라일터 (gojobs.go.kr) | 241건 | 0건 | **241건** | ✅ 정상 |
| 클린아이 잡플러스 (job.cleaneye.go.kr) | 318건 | 0건 | **318건** | ✅ 정상 |
| 인천일자리포털 (incheon.go.kr/job) | 5건 | 0건 | **5건** | ✅ 정상 (현재 진행중 공고 5건) |
| 경기도 공공일자리 (data.gg.go.kr) | 22건 | 0건 | **22건** | ✅ 정상 |
| **합계** | **586건** | 0건 | **586건** | |

---

## 소스별 상세

### 1. 나라일터 (241건) ✅
- **방식**: POST `https://gojobs.go.kr/apmList.do`, 10건/페이지, 30페이지
- **수집 공고 유형**: 공무직 근로자, 한시임기제, 기간제, 임기제공무원
- **샘플 공고**:
  - `관세국경인재개발원 공무직 근로자 채용` (마감 2026-06-04)
  - `[육군사관학교] 한시임기제 7호 군무원 채용` (마감 2026-06-19)
  - `국가보훈부 공무직 근로자(기록관리 전문인력) 채용` (마감 2026-06-09)
- **적용 필터**: 합격자 발표, 최종합격, 취소공고 등 제외
- **apply_link**: `https://gojobs.go.kr/apmView.do?empmnsn={ID}&menuNo=401` (개별 URL)
- **알려진 한계**: 중앙부처 공고는 location이 빈값 (중앙부처 특성상 불가피)

### 2. 클린아이 잡플러스 (318건) ✅
- **방식**: POST AJAX `/user/selectYpRecruitment.do`, status=709001(모집중), 32페이지×10건
- **수집 공고 유형**: 지방공기업(시설관리공단, 문화재단, 도시공사 등) 기간제·무기계약직
- **샘플 공고**:
  - `기장군도시관리공단 2026년 제4회 기간제근로자 공개채용` (부산, 마감 2026-06-04)
  - `가평군시설관리공단 칼봉산자연휴양림 기간제근로자 채용` (경기 가평군)
  - `관악문화재단 2026년 제2차 직원 채용` (서울)
- **apply_link**: `https://job.cleaneye.go.kr/user/ypRecruitment.do#recruit_{ypEntId}_{entSeq}` (anchor 방식)
  - 상세 URL 접근 불가 → 목록 페이지 URL + anchor로 unique key 역할
  - **승인 후 SHARED_APPLY_LINKS 처리 필요**

### 3. 인천일자리포털 (5건) ✅
- **방식**: GET `?srchStatus=ING&curPage=N` (진행중 공고만)
- **현황**: 오늘 기준 진행중 공고 5건 (이 중 상시모집 공고 3건 포함)
- **apply_link**: `https://www.incheon.go.kr/job/JOB010201/{ID}` (개별 URL)
- **참고**: 인천 공공일자리는 공고 수가 적음 → 일일 업데이트 시 변동 있음

### 4. 경기도 공공일자리 (22건) ✅
- **방식**: Sheet API `data.gg.go.kr`, 401건 수집 후 공무원시험 필터 적용 → 22건
- **수집 공고 유형**: 학교 시간강사, 계약제교원, 단시간 근로자 등
- **apply_link**: `https://job.gg.go.kr/pblcEmpmn/publicJobDetail.do?seq={ID}` (개별 URL)
- **참고**: 전체 401건 중 공무원 시험공고 제외 후 22건 — 학교 계약직 위주

---

## 승인 후 crawler.py 반영 사항

### 추가할 함수
1. `scrape_narajilter(page)` — 나라일터 POST 스크래핑
2. `collect_cleaneye()` — 클린아이 AJAX API
3. `scrape_incheon(page)` — 인천 GET 스크래핑
4. `collect_gg_public()` — 경기도 공공일자리 Sheet API

### run_crawler 수정
- 11~14단계 추가
- SHARED_APPLY_LINKS에 클린아이 base URL 추가
  - `https://job.cleaneye.go.kr/user/ypRecruitment.do` → SHARED_APPLY_LINKS
  - **단**, anchor(`#recruit_xxx`) 방식이므로 dedup 로직에서 base URL만 비교 안 함 → OK

### jobs.html 소스 색상 추가
```javascript
나라일터: #4F46E5   // 인디고
클린아이: #0891B2   // 시니어로와 구별되는 청록
인천일자리: #7C3AED  // 잡아바와 유사 계열 피하기
경기공공일자리: #D97706  // 주황 계열
```

### CHANGELOG
- v1.08로 업데이트 필요

---

## 교차검증 결과

- 기존 jobs.json (현재 운영 데이터)과 중복 0건 → 4개 소스 모두 완전히 새로운 공고
- 나라일터 공고는 work24.go.kr과 연동될 수 있으나, 직접 링크(gojobs.go.kr)이므로 URL 중복 없음
- 클린아이 apply_link는 anchor 방식이므로 dedup에서 unique 처리됨

---

*이 파일은 승인 후 삭제해도 됩니다.*
