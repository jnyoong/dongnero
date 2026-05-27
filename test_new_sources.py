"""
신규 공공 소스 4개 테스트 크롤러
─ 나라일터 (gojobs.go.kr) — 공무직·임기제·기간제
─ 클린아이 잡플러스 (job.cleaneye.go.kr) — 지방공기업
─ 인천일자리포털 (incheon.go.kr/job)
─ 경기도 공공일자리 (data.gg.go.kr Sheet API)

⚠️  jobs.json / jobs_data.js 는 절대 수정하지 않음
    결과: test_new_sources_result.json 으로 저장
"""
import sys, json, time, re, random
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4"])
    import requests
    from bs4 import BeautifulSoup

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_DIR = Path(__file__).parent
TODAY = date.today().isoformat()

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
    "Accept-Language": "ko-KR,ko;q=0.9",
}

MAX_RETRIES = 3

# 기존 crawler.py와 동일한 필터
EXCLUDE_COMPANIES = {
    '올리브영', 'cgv', '메가박스', '롯데시네마', '씨네큐',
    '스타벅스', '이디야', '빽다방', '투썸플레이스', '공차', '컴포즈',
    '할리스', '파스쿠찌', '탐앤탐스', '폴바셋', '메가커피', '엔제리너스',
    '커피빈', '블루보틀', '더벤티', '카페베네', '롯데리아', '맥도날드',
    'kfc', '버거킹', '서브웨이', '파파이스', '노브랜드버거', '맘스터치',
    '쉐이크쉑', '파이브가이즈', '배스킨라빈스', '던킨', '크리스피크림',
    '이마트24', 'gs25', 'cu편의점', '세븐일레븐',
    '넥슨', '넷마블', '엔씨소프트', '크래프톤', '펄어비스',
    '무신사', '에이블리', '지그재그', '브랜디',
    '쿠팡이츠', '배달의민족', '요기요',
}

EXCLUDE_KEYWORDS = [
    '나이트클럽', '유흥주점', '단란주점', '룸살롱', '룸카페',
    '호스트바', '바텐더', 'pc방', '피씨방', '코인노래방',
    '개발자', '백엔드', '프론트엔드', '풀스택', '앱 개발자', '웹 개발자',
    'devops', 'ui/ux', '데이터 사이언티스트', '머신러닝', '딥러닝',
    'node.js', 'react', 'vue.js', 'spring', 'flutter', 'kotlin', 'typescript',
    '영상 편집', '영상 제작자', '3d 디자이너', '게임 기획', '게임 개발',
    '유튜브 크리에이터', '틱톡', '숏폼', '인플루언서',
    '배달 라이더', '배달기사', '오토바이 배달',
    '이삿짐', '헬스 트레이너', '퍼스널 트레이너', '필라테스 강사',
    '인턴십', '채용연계형 인턴', '대졸 신입 공채',
    '병역특례',
]

# 나라일터 전용 제외 키워드 (합격자 발표 등 채용공고 아닌 것)
NARAJILTER_EXCLUDE = [
    "합격자 발표", "합격자 공고", "합격자 명단", "합격자)",
    "최종합격", "최종 합격", "합격자 공지",
    "불합격", "면접일정 안내", "면접 일정",
    "2차 시험", "필기시험", "필기 시험", "체력검정",
    "취소 공고", "연기 공고", "시험 취소",
    "임용 공고", "임용예정",
]

# 경기도 공공일자리 전용 제외 키워드 (공무원 시험 공고 등)
GG_PUBLIC_EXCLUDE = [
    "공개경쟁임용시험", "경력경쟁임용시험", "지방공무원 공개", "지방공무원 경력",
    "임용시험 시행계획", "임용시험 공고", "합격자 발표", "합격자 공고",
    "면접시험", "필기시험", "체력검정",
]

def _normalize_date(raw: str) -> str:
    raw = raw.strip()
    if re.match(r'\d{4}-\d{2}-\d{2}', raw):
        return raw[:10]
    m = re.match(r'(\d{4})(\d{2})(\d{2})', raw)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = re.match(r'(\d{2,4})[./](\d{2})[./](\d{2})', raw)
    if m:
        y = ("20" + m.group(1)) if len(m.group(1)) == 2 else m.group(1)
        return f"{y}-{m.group(2)}-{m.group(3)}"
    if any(k in raw for k in ("상시", "채용시", "마감없음", "수시")):
        return "상시모집"
    return raw

def _is_excluded(job: dict) -> bool:
    title   = (job.get('title')   or '').lower()
    company = (job.get('company') or '').lower()
    combined = title + ' ' + company
    for exc in EXCLUDE_COMPANIES:
        if exc in company:
            return True
    for kw in EXCLUDE_KEYWORDS:
        if kw in combined:
            return True
    return False

def _sleep(sec=2.0, jitter=1.5):
    time.sleep(sec + random.uniform(0, jitter))


# ─── 1. 나라일터 (gojobs.go.kr) ───────────────────────────────────────────────
# 공무직·임기제·기간제 공고 수집
# POST /apmList.do, 10건/페이지, SSL verify=False

NARAJILTER_BASE = "https://gojobs.go.kr"
NARAJILTER_LIST = NARAJILTER_BASE + "/apmList.do"
NARAJILTER_VIEW = NARAJILTER_BASE + "/apmView.do"
NARAJILTER_PAGES = 30  # 최대 300건

def scrape_narajilter(page: int) -> list[dict]:
    sess = requests.Session()
    sess.headers.update({
        **HEADERS,
        "Referer": NARAJILTER_LIST + "?menuNo=401&mngrMenuYn=N&selMenuNo=400&upperMenuNo=",
    })
    try:
        resp = sess.post(
            NARAJILTER_LIST,
            data={
                "menuNo"         : "401",
                "mngrMenuYn"     : "N",
                "selMenuNo"      : "400",
                "upperMenuNo"    : "",
                "searchJobsecode": "020",   # 020 = 일반채용(공무직·임기제 등)
                "pageIndex"      : str(page),
                "prgl"           : "apmList",
                "empmnsn"        : "0",
            },
            verify=False,
            timeout=20,
        )
        resp.raise_for_status()
    except Exception as e:
        print(f"    [나라일터 오류] page={page}: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    rows = soup.select("table tbody tr")
    jobs = []
    for row in rows:
        tds = row.find_all("td")
        if len(tds) < 5:
            continue

        title_el = tds[1].find("a")
        if not title_el:
            continue

        title = title_el.get_text(strip=True)
        href  = title_el.get("href", "")

        # fn_apmView('020', '293508') 에서 empmnsn 추출
        m = re.search(r"fn_apmView\('[^']*',\s*'(\d+)'\)", href)
        empmnsn = m.group(1) if m else ""
        apply_link = f"{NARAJILTER_VIEW}?empmnsn={empmnsn}&menuNo=401" if empmnsn else NARAJILTER_LIST

        company  = tds[2].get_text(strip=True)
        reg_date = tds[3].get_text(strip=True)     # 접수시작일
        deadline = tds[4].get_text(strip=True)     # 접수마감일

        # 제목이 너무 짧은 테스트/오류 공고 제외
        if len(title) < 6:
            continue
        # 합격자 발표 등 채용공고 아닌 항목 제외
        if any(kw in title for kw in NARAJILTER_EXCLUDE):
            continue
        # 마감된 공고 제외
        norm_dl = _normalize_date(deadline)
        if re.match(r'\d{4}-\d{2}-\d{2}', norm_dl) and norm_dl < TODAY:
            continue

        # 지역: 기관명에서 시도 추출 시도 (예: "경기도 파주시", "부산광역시기장군...")
        location = _extract_location_from_name(company)

        jobs.append({
            "title"      : title,
            "company"    : company,
            "location"   : location,
            "deadline"   : norm_dl,
            "type"       : "공무직·임기제",
            "salary"     : "",
            "description": "",
            "apply_link" : apply_link,
            "source"     : "나라일터",
        })
    return jobs

_SIDO_KEYWORDS = [
    "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
    "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
]

def _extract_location_from_name(name: str) -> str:
    """기관명에서 시도 힌트 추출. 없으면 빈 문자열."""
    for sido in _SIDO_KEYWORDS:
        if sido in name:
            return sido
    return ""

def collect_narajilter() -> list[dict]:
    print("\n[나라일터] 공무직·임기제·기간제 수집 시작")
    sess_init = requests.Session()
    sess_init.headers.update(HEADERS)
    try:
        sess_init.get(
            NARAJILTER_LIST + "?menuNo=401&mngrMenuYn=N&selMenuNo=400&upperMenuNo=",
            verify=False, timeout=15
        )
    except Exception:
        pass

    all_jobs: list[dict] = []
    for page in range(1, NARAJILTER_PAGES + 1):
        print(f"  페이지 {page}/{NARAJILTER_PAGES} ...", end=" ", flush=True)
        jobs = scrape_narajilter(page)
        print(f"{len(jobs)}건")
        all_jobs.extend(jobs)
        if len(jobs) < 5:  # 조기 종료
            print("  → 공고 소진, 종료")
            break
        _sleep(2, 1)
    print(f"  → 나라일터 소계: {len(all_jobs)}건 (필터 전)")
    return all_jobs


# ─── 2. 클린아이 잡플러스 (job.cleaneye.go.kr) ────────────────────────────────
# 지방공기업 채용 — selectYpRecruitment.do JSON API
# 모집중(status=709001)만, 전체 한번에 수집

CLEANEYE_BASE  = "https://job.cleaneye.go.kr"
CLEANEYE_LIST  = CLEANEYE_BASE + "/user/selectYpRecruitment.do"
CLEANEYE_MAIN  = CLEANEYE_BASE + "/user/ypRecruitment.do"

# sidoCd 상위 지역 코드 (불완전하지만 entName에서 보완)
# 목록에서 sidoCd는 참고용으로만 사용
_SIDO_CODE_MAP = {
    "007001": "서울",
    "007002": "부산",
    "007003": "대구",
    "007004": "인천",
    "007005": "광주",
    "007006": "대전",
    "007007": "울산",
    "007008": "세종",
    "007009": "경기",
    "007010": "강원",
    "007011": "충북",
    "007012": "충남",
    "007013": "전북",
    "007014": "전남",
    "007015": "경남",
    "007016": "경북",
    "007017": "제주",
}

def collect_cleaneye() -> list[dict]:
    print("\n[클린아이 잡플러스] 지방공기업 모집중 공고 수집")
    sess = requests.Session()
    sess.headers.update({
        **HEADERS,
        "Referer"         : CLEANEYE_MAIN,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type"    : "application/x-www-form-urlencoded; charset=UTF-8",
    })
    # 쿠키 획득
    try:
        sess.get(CLEANEYE_MAIN, timeout=15)
        time.sleep(1)
    except Exception:
        pass

    all_items = []
    page = 1
    # 서버는 pageUnit 요청 무시, recordCountPerPage=10 고정 반환
    # total_pages = ceil(cnt / 10)

    while True:
        try:
            resp = sess.post(
                CLEANEYE_LIST,
                data={
                    "pageIndex": str(page),
                    "pageUnit" : "10",
                    "status"   : "709001",   # 모집중
                },
                timeout=20,
            )
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"    [클린아이 오류] page={page}: {e}")
            break

        items = data.get("list", [])
        total = data.get("cnt", 0)
        all_items.extend(items)
        # totalPageCount가 0으로 잘못 반환됨 → 직접 계산
        total_pages = (total + 9) // 10
        print(f"  페이지 {page}/{total_pages} ... {len(items)}건 (총 {total}건)")

        if page >= total_pages or not items:
            break
        page += 1
        _sleep(1.5, 1)

    jobs = []
    for item in all_items:
        title   = (item.get("entTitle") or "").strip()
        company = (item.get("entName")  or "").strip()
        if not title:
            continue

        # 마감일 확인
        pub_end = (item.get("pubEndDate") or "").strip()
        norm_dl = _normalize_date(pub_end) if pub_end else ""
        if re.match(r'\d{4}-\d{2}-\d{2}', norm_dl) and norm_dl < TODAY:
            continue  # 마감됨

        # 지역: localName 있으면 우선, 없으면 기관명 파싱 (sidoCd 매핑은 부정확해서 제외)
        local_name = (item.get("localName") or "").strip()
        if local_name:
            location = local_name
        else:
            location = _extract_location_from_name(company)

        # 고용형태 코드 → 텍스트 (불완전, 참고용)
        emp_gb = (item.get("employGb") or "").strip()
        emp_type_map = {
            "703001": "정규직",
            "703002": "무기계약직",
            "703003": "기간제",
            "703004": "시간제",
            "703005": "아르바이트",
        }
        emp_type = emp_type_map.get(emp_gb, "")

        # apply_link: 개별 상세 URL을 찾을 수 없으므로 기관명+공고명 unique ID를 URL에 포함
        ypEntId = item.get("ypEntId", "")
        entSeq  = item.get("entSeq", "")
        apply_link = f"{CLEANEYE_MAIN}#recruit_{ypEntId}_{entSeq}"

        jobs.append({
            "title"      : title,
            "company"    : company,
            "location"   : location,
            "deadline"   : norm_dl,
            "type"       : emp_type,
            "salary"     : "",
            "description": "",
            "apply_link" : apply_link,
            "source"     : "클린아이",
        })

    print(f"  → 클린아이 소계: {len(jobs)}건 (필터 전)")
    return jobs


# ─── 3. 인천일자리포털 (incheon.go.kr/job) ────────────────────────────────────
# GET /job/JOB010201?curPage=N, 20건/페이지, 마감 제외

INCHEON_BASE = "https://www.incheon.go.kr"
INCHEON_LIST = INCHEON_BASE + "/job/JOB010201"
INCHEON_PAGES = 30   # 최대 600건 (마감 제외)

def scrape_incheon(page: int) -> list[dict]:
    """인천일자리포털 — srchStatus=ING 로 진행중 공고만 수집"""
    sess = requests.Session()
    sess.headers.update({**HEADERS, "Referer": INCHEON_LIST})
    try:
        resp = sess.get(
            f"{INCHEON_LIST}?srchStatus=ING&curPage={page}",
            timeout=20,
        )
        resp.raise_for_status()
    except Exception as e:
        print(f"    [인천 오류] page={page}: {e}")
        return []

    resp.encoding = "utf-8"
    soup = BeautifulSoup(resp.text, "html.parser")
    rows = soup.select("table tbody tr")
    jobs = []

    for row in rows:
        tds = row.find_all("td")
        if len(tds) < 7:
            continue

        # td 구조: 번호 | 채용공고명(링크) | 문의처 | 등록일 | 접수시작일 | 접수마감일 | 상태 | 조회수
        title_el = tds[1].find("a")
        if not title_el:
            continue

        title = title_el.get_text(strip=True)
        href  = title_el.get("href", "")
        apply_link = (INCHEON_BASE + href) if href.startswith("/") else href

        deadline = tds[5].get_text(strip=True)
        norm_dl  = _normalize_date(deadline)

        jobs.append({
            "title"      : title,
            "company"    : "",
            "location"   : "인천",
            "deadline"   : norm_dl,
            "type"       : "",
            "salary"     : "",
            "description": "",
            "apply_link" : apply_link,
            "source"     : "인천일자리",
        })
    return jobs

def collect_incheon() -> list[dict]:
    print("\n[인천일자리포털] 공공일자리 수집 시작 (srchStatus=ING, 진행중만)")
    all_jobs: list[dict] = []

    for page in range(1, INCHEON_PAGES + 1):
        print(f"  페이지 {page}/{INCHEON_PAGES} ...", end=" ", flush=True)
        jobs = scrape_incheon(page)
        print(f"{len(jobs)}건")
        all_jobs.extend(jobs)
        if len(jobs) < 5:
            print("  → 공고 소진, 종료")
            break
        _sleep(1.5, 1)

    print(f"  → 인천일자리 소계: {len(all_jobs)}건 (필터 전)")
    return all_jobs


# ─── 4. 경기도 공공일자리 (data.gg.go.kr Sheet API) ───────────────────────────
# 잡아바와 다른 데이터셋: 경기도 내 공공일자리 (VAFPYPI2D6NZ5H6KKAI629495055)

GG_PUBLIC_INF_ID  = "VAFPYPI2D6NZ5H6KKAI629495055"
GG_PUBLIC_INF_SEQ = "1"
GG_PUBLIC_SHEET   = "https://data.gg.go.kr/portal/data/sheet/searchSheetData.do"
GG_PUBLIC_LINK    = (
    "https://data.gg.go.kr/portal/data/service/selectServicePage.do"
    f"?infId={GG_PUBLIC_INF_ID}&infSeq={GG_PUBLIC_INF_SEQ}"
)
GG_PUBLIC_ROWS    = 1000

def collect_gg_public() -> list[dict]:
    print("\n[경기도 공공일자리] Sheet API 수집 시작")
    sess = requests.Session()
    sess.headers.update({
        **HEADERS,
        "Referer"     : GG_PUBLIC_LINK,
        "AJAX"        : "true",
        "Content-Type": "application/x-www-form-urlencoded",
    })

    all_items: list[dict] = []
    page = 1
    while True:
        try:
            resp = sess.post(
                GG_PUBLIC_SHEET,
                data={
                    "rows"  : str(GG_PUBLIC_ROWS),
                    "infId" : GG_PUBLIC_INF_ID,
                    "infSeq": GG_PUBLIC_INF_SEQ,
                    "page"  : str(page),
                },
                timeout=20,
            )
            resp.raise_for_status()
            result = resp.json()
        except Exception as e:
            print(f"    [경기도공공일자리 오류] page={page}: {e}")
            break

        items = result.get("data", [])
        total_pages = int(result.get("pages", 1))
        all_items.extend(items)
        print(f"  페이지 {page}/{total_pages} ... {len(items)}건")

        if page >= total_pages:
            break
        page += 1
        _sleep(2, 1)

    # 필드 구조 파악: 처음 항목의 키 출력
    if all_items:
        print(f"  필드 목록: {list(all_items[0].keys())[:15]}")
        print(f"  첫 항목 샘플:")
        for k, v in list(all_items[0].items())[:8]:
            print(f"    {k}: {str(v)[:60]}")

    jobs = []
    for item in all_items:
        # 필드명: PBLANC_TITLE, INST_NM, RECRUT_BEGIN_DE, RECRUT_END_DE, DETAIL_PAGE_URL
        title   = (item.get("PBLANC_TITLE") or "").strip()
        company = (item.get("INST_NM") or "").strip()
        end_dt  = (item.get("RECRUT_END_DE") or "").strip()
        link    = (item.get("DETAIL_PAGE_URL") or GG_PUBLIC_LINK).strip()

        if not title:
            continue

        # 공무원 시험 공고 제외 (시니어 구직과 무관)
        if any(kw in title for kw in GG_PUBLIC_EXCLUDE):
            continue

        # 마감 공고 제외
        norm_dl = _normalize_date(end_dt) if end_dt else ""
        if re.match(r'\d{4}-\d{2}-\d{2}', norm_dl) and norm_dl < TODAY:
            continue

        # 지역: 공고 제목에서 [시군명] 패턴 추출
        location = "경기"
        m_city = re.match(r'\[([^\]]+)\]', title)
        if m_city:
            city = m_city.group(1)
            # "경기도" 같은 광역 단위면 그냥 "경기", 아니면 시군명 사용
            location = city if city != "경기도" else "경기"

        jobs.append({
            "title"      : title,
            "company"    : company or "경기도",
            "location"   : location,
            "deadline"   : norm_dl,
            "type"       : "",
            "salary"     : "",
            "description": "",
            "apply_link" : link,
            "source"     : "경기공공일자리",
        })

    print(f"  → 경기공공일자리 소계: {len(jobs)}건 (마감 제외)")
    return jobs


# ─── 기존 jobs.json과 dedup 비교 ─────────────────────────────────────────────

def _extract_wanted_no(url: str) -> str:
    m = re.search(r'wantedAuthNo=([A-Z0-9]+)', url or '')
    return m.group(1) if m else ''

def compare_with_existing(new_jobs: list[dict]) -> dict:
    """기존 jobs.json과 중복 비교 (수정 없음)"""
    existing_file = BASE_DIR / "jobs.json"
    if not existing_file.exists():
        return {"existing_total": 0, "new_unique": len(new_jobs), "duplicate": 0}

    try:
        existing = json.loads(existing_file.read_text(encoding="utf-8"))
        existing_jobs = existing.get("jobs", [])
    except Exception:
        return {"existing_total": 0, "new_unique": len(new_jobs), "duplicate": 0}

    # 기존 데이터의 링크·(제목+회사) 세트
    ex_links  = {j.get("apply_link", "") for j in existing_jobs if j.get("apply_link")}
    ex_wanted = {_extract_wanted_no(j.get("apply_link", "")) for j in existing_jobs if _extract_wanted_no(j.get("apply_link", ""))}
    ex_title_co = {
        (j.get("title", "").lower(), j.get("company", "").lower())
        for j in existing_jobs
        if j.get("title")
    }

    duplicate = 0
    unique_new = []
    for job in new_jobs:
        link   = job.get("apply_link", "")
        wanted = _extract_wanted_no(link)
        key    = (job.get("title", "").lower(), job.get("company", "").lower())

        if wanted and wanted in ex_wanted:
            duplicate += 1
        elif link and link in ex_links:
            duplicate += 1
        elif key in ex_title_co:
            duplicate += 1
        else:
            unique_new.append(job)

    return {
        "existing_total": len(existing_jobs),
        "new_collected" : len(new_jobs),
        "duplicate"     : duplicate,
        "new_unique"    : len(unique_new),
        "unique_jobs"   : unique_new,
    }


# ─── 메인 실행 ───────────────────────────────────────────────────────────────

def main():
    print("=" * 65)
    print("  신규 공공 소스 테스트 크롤러")
    print(f"  실행일: {TODAY}")
    print("  ⚠️  jobs.json 수정 없음 — 결과만 test_new_sources_result.json 저장")
    print("=" * 65)

    all_results = {}
    grand_total_raw = 0

    # ─ 1. 나라일터
    nara_raw = collect_narajilter()
    nara_filtered = [j for j in nara_raw if not _is_excluded(j)]
    nara_cmp  = compare_with_existing(nara_filtered)
    all_results["나라일터"] = {
        "raw"          : len(nara_raw),
        "after_filter" : len(nara_filtered),
        "duplicate_with_existing": nara_cmp["duplicate"],
        "new_unique"   : nara_cmp["new_unique"],
        "sample"       : nara_filtered[:5],
        "jobs"         : nara_filtered,
    }
    print(f"  나라일터 → raw {len(nara_raw)}건 / 필터후 {len(nara_filtered)}건 / 기존중복 {nara_cmp['duplicate']}건 / 순증 {nara_cmp['new_unique']}건")
    grand_total_raw += len(nara_filtered)
    time.sleep(random.uniform(5, 8))

    # ─ 2. 클린아이
    clean_raw = collect_cleaneye()
    clean_filtered = [j for j in clean_raw if not _is_excluded(j)]
    clean_cmp = compare_with_existing(clean_filtered)
    all_results["클린아이"] = {
        "raw"          : len(clean_raw),
        "after_filter" : len(clean_filtered),
        "duplicate_with_existing": clean_cmp["duplicate"],
        "new_unique"   : clean_cmp["new_unique"],
        "sample"       : clean_filtered[:5],
        "jobs"         : clean_filtered,
    }
    print(f"  클린아이 → raw {len(clean_raw)}건 / 필터후 {len(clean_filtered)}건 / 기존중복 {clean_cmp['duplicate']}건 / 순증 {clean_cmp['new_unique']}건")
    grand_total_raw += len(clean_filtered)
    time.sleep(random.uniform(5, 8))

    # ─ 3. 인천일자리
    incheon_raw = collect_incheon()
    incheon_filtered = [j for j in incheon_raw if not _is_excluded(j)]
    incheon_cmp = compare_with_existing(incheon_filtered)
    all_results["인천일자리"] = {
        "raw"          : len(incheon_raw),
        "after_filter" : len(incheon_filtered),
        "duplicate_with_existing": incheon_cmp["duplicate"],
        "new_unique"   : incheon_cmp["new_unique"],
        "sample"       : incheon_filtered[:5],
        "jobs"         : incheon_filtered,
    }
    print(f"  인천일자리 → raw {len(incheon_raw)}건 / 필터후 {len(incheon_filtered)}건 / 기존중복 {incheon_cmp['duplicate']}건 / 순증 {incheon_cmp['new_unique']}건")
    grand_total_raw += len(incheon_filtered)
    time.sleep(random.uniform(5, 8))

    # ─ 4. 경기도 공공일자리
    gg_raw = collect_gg_public()
    gg_filtered = [j for j in gg_raw if not _is_excluded(j)]
    gg_cmp = compare_with_existing(gg_filtered)
    all_results["경기공공일자리"] = {
        "raw"          : len(gg_raw),
        "after_filter" : len(gg_filtered),
        "duplicate_with_existing": gg_cmp["duplicate"],
        "new_unique"   : gg_cmp["new_unique"],
        "sample"       : gg_filtered[:5],
        "jobs"         : gg_filtered,
    }
    print(f"  경기공공일자리 → raw {len(gg_raw)}건 / 필터후 {len(gg_filtered)}건 / 기존중복 {gg_cmp['duplicate']}건 / 순증 {gg_cmp['new_unique']}건")
    grand_total_raw += len(gg_filtered)

    # ─ 합산 요약
    total_new_unique = sum(v["new_unique"] for v in all_results.values())
    print()
    print("=" * 65)
    print(f"  수집 완료 요약")
    print(f"  {'소스':<15} {'원시':>6} {'필터후':>7} {'기존중복':>8} {'순증':>6}")
    print(f"  {'-'*45}")
    for src, v in all_results.items():
        print(f"  {src:<15} {v['raw']:>6} {v['after_filter']:>7} {v['duplicate_with_existing']:>8} {v['new_unique']:>6}")
    print(f"  {'-'*45}")
    print(f"  {'합계':<15} {grand_total_raw:>6} {'':>7} {'':>8} {total_new_unique:>6}")
    print("=" * 65)

    # ─ 저장
    output = {
        "test_date"    : TODAY,
        "summary"      : {
            src: {k: v for k, v in data.items() if k != "jobs"}
            for src, data in all_results.items()
        },
        "total_new_unique": total_new_unique,
        "results"      : all_results,
    }
    out_file = BASE_DIR / "test_new_sources_result.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\n  결과 저장: {out_file}")
    print("  ✅ jobs.json 미수정 확인 — 승인 후 crawler.py에 통합 가능")


if __name__ == "__main__":
    main()
