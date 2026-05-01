"""
시니어(50대 이상) 취업정보 크롤러
출처: 고용24 / 알바몬 / 알바천국 / 시니어로
저장: jobs.json + jobs_data.js

[고용24 오픈API 키 발급]
  https://www.work24.go.kr/cm/e/a/0110/selectOpenApiIntro.do
  발급 후 WORK24_AUTH_KEY 값을 교체하면 API 모드로 전환됩니다.
"""

import json
import time
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, date, timezone, timedelta

KST = timezone(timedelta(hours=9))
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("필요한 패키지를 설치합니다...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install",
                           "requests", "beautifulsoup4"])
    import requests
    from bs4 import BeautifulSoup

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# ── 설정 ──────────────────────────────────────────────────────────────────────

OUTPUT_FILE = Path(__file__).parent / "jobs.json"

WORK24_AUTH_KEY = "YOUR_AUTH_KEY_HERE"

# ── 시니어 부적합 필터 ────────────────────────────────────────────────────────

# 회사명에 포함 시 제외
EXCLUDE_COMPANIES = {
    # 뷰티·헬스
    '올리브영',
    # 영화관
    'cgv', '메가박스', '롯데시네마', '씨네큐',
    # 젊은층 카페 프랜차이즈
    '스타벅스', '이디야', '빽다방', '투썸플레이스', '공차', '컴포즈',
    '할리스', '파스쿠찌', '탐앤탐스', '폴바셋',
}

# 공고 제목·회사명에 포함 시 제외
EXCLUDE_KEYWORDS = [
    # 유흥·주점
    '나이트클럽', '유흥주점', '단란주점', '룸살롱', '룸카페',
    '호스트바', '바텐더', '호프집', '맥주집', '포장마차', '포차', '이자카야',
    # 오락시설
    'pc방', '피씨방', '코인노래방',
    # 명시적 연령 제한
    '10대', '20대 초반', '나이 제한',

    # IT 소프트웨어 개발직 (시니어 채용 가능성 낮음)
    '백엔드 개발자', '프론트엔드 개발자', '풀스택 개발자',
    'ios 개발자', 'android 개발자', '앱 개발자',
    'devops 엔지니어', 'ui/ux 디자이너', 'ux 디자이너',
    '데이터 사이언티스트', '머신러닝 엔지니어', '딥러닝 엔지니어', 'ai 엔지니어',
    '소프트웨어 엔지니어', '클라우드 엔지니어',

    # 크리에이터·SNS (젊은층 위주)
    '유튜브 크리에이터', '틱톡 크리에이터', '인플루언서',
    'sns 마케터', '콘텐츠 크리에이터',

    # 극한 체력직 (시니어 부적합)
    '이삿짐', '퀵서비스 라이더', '오토바이 배달',

    # 학생 대상
    '고등학생 가능', '대학생 전용',
]

REQUEST_DELAY   = 2.0
MAX_PAGES       = 50
ITEMS_PER_PAGE  = 20
MAX_RETRIES     = 3

BIRTH_YEAR_LIMIT = str(date.today().year - 50)

BASE_URL  = "https://www.work24.go.kr"
POST_URL  = BASE_URL + "/wk/a/b/1200/retriveDtlEmpSrchListInPost.do"
API_URL   = BASE_URL + "/cm/openApi/call/wk/callOpenApiSvcInfo210L01.do"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ko-KR,ko;q=0.9",
    "Referer": BASE_URL + "/wk/a/b/1200/retriveDtlEmpSrchList.do",
}


# ── 고용24 오픈API 모드 ────────────────────────────────────────────────────────

def _xml_text(elem: ET.Element, tag: str) -> str:
    node = elem.find(tag)
    return (node.text or "").strip() if node is not None else ""


def fetch_work24_api(page: int) -> list[dict]:
    params = {
        "authKey"   : WORK24_AUTH_KEY,
        "callTp"    : "L",
        "returnType": "XML",
        "startPage" : page,
        "display"   : ITEMS_PER_PAGE,
        "birthToYY" : BIRTH_YEAR_LIMIT,
        "sortByF"   : "DATE",
    }
    try:
        resp = requests.get(API_URL, params=params, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)

        err = _xml_text(root, ".//errorCode") or _xml_text(root, ".//returnCode")
        if err and err not in ("", "0000", "00"):
            print(f"\n  [API 오류 {err}] {_xml_text(root, './/errorMsg')}")
            return []

        jobs = []
        for item in root.findall(".//wanted") + root.findall(".//WantedInfo"):
            auth_no = _xml_text(item, "wantedAuthNo")
            jobs.append({
                "title"      : _xml_text(item, "jobNm") or _xml_text(item, "recrtTtl"),
                "company"    : _xml_text(item, "cmpnyNm") or _xml_text(item, "busiNm"),
                "location"   : _xml_text(item, "workPlcNm") or _xml_text(item, "workArea"),
                "deadline"   : _normalize_date(_xml_text(item, "rcptDdlnDt") or _xml_text(item, "closDate")),
                "type"       : _xml_text(item, "emplymShpNm") or _xml_text(item, "workTp"),
                "salary"     : (_xml_text(item, "salTpNm") + " " + _xml_text(item, "sal")).strip(),
                "description": _xml_text(item, "wantedAuthNm"),
                "apply_link" : f"{BASE_URL}/wk/a/b/1500/empDetailAuthView.do?wantedAuthNo={auth_no}&infoTypeCd=VALID" if auth_no else "",
                "source"     : "고용24",
            })
        return jobs
    except Exception as e:
        print(f"\n  [API 오류] {e}")
        return []


# ── 고용24 웹 스크래핑 모드 ───────────────────────────────────────────────────

def _parse_deadline(text: str) -> str:
    m = re.search(r"마감일\s*:\s*(\S+)", text)
    return _normalize_date(m.group(1)) if m else ""


def scrape_work24_web(page: int) -> list[dict]:
    post_data = {
        "currentPageNo"  : str(page),
        "pageIndex"      : str(page),
        "resultCnt"      : str(ITEMS_PER_PAGE),
        "sortField"      : "DATE",
        "sortOrderBy"    : "DESC",
        "siteClcd"       : "all",
        "empTpGbcd"      : "1",
        "birthToYY"      : BIRTH_YEAR_LIMIT,
        "benefitSrchAndOr": "O",
        "codeDepth1Info" : "11000",
        "codeDepth2Info" : "11000",
        "keywordWantedTitle": "N",
        "keywordBusiNm"  : "N",
        "keywordJobCont" : "N",
        "keywordStaAreaNm": "N",
    }
    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.post(POST_URL, data=post_data, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                print(f"재시도 {attempt+1}/{MAX_RETRIES-1}...", end=" ", flush=True)
                time.sleep(3)
            else:
                print(f"\n  [고용24 스크래핑 오류] {e}")
                return []
    try:
        resp.encoding = "utf-8"
        soup = BeautifulSoup(resp.text, "html.parser")

        jobs = []
        rows = soup.select("table#contentArea tbody tr")

        for row in rows:
            company_el = row.select_one("a.cp_name")
            title_el   = row.select_one("a.t3_sb")
            if not title_el:
                continue

            href = title_el.get("href", "")
            link = (BASE_URL + href) if href.startswith("/") else href

            info = {li.get("class", [""])[0]: li.get_text(" ", strip=True)
                    for li in row.select("ul.emp_info_dtl li")}

            tds = row.select("td")
            deadline_raw = tds[2].get_text(" ", strip=True) if len(tds) > 2 else ""
            salary_raw = re.sub(r"\s+", " ", info.get("dollar", "")).strip()

            jobs.append({
                "title"      : title_el.get_text(strip=True),
                "company"    : company_el.get_text(strip=True) if company_el else "",
                "location"   : info.get("site", ""),
                "deadline"   : _parse_deadline(deadline_raw),
                "type"       : "",
                "salary"     : salary_raw,
                "description": info.get("member", ""),
                "apply_link" : link,
                "source"     : "고용24",
            })
        return jobs

    except Exception as e:
        print(f"\n  [고용24 스크래핑 오류] {e}")
        return []


# ── 알바몬 스크래핑 ───────────────────────────────────────────────────────────

ALBAMON_BASE = "https://www.albamon.com"

def scrape_albamon(page: int) -> list[dict]:
    """알바몬 시니어 키워드 검색 — __NEXT_DATA__ 파싱"""
    url = f"{ALBAMON_BASE}/jobs/part?keyword=%EC%8B%9C%EB%8B%88%EC%96%B4&page={page}"
    ref = f"{ALBAMON_BASE}/jobs/part?keyword=%EC%8B%9C%EB%8B%88%EC%96%B4&page={page - 1}"
    headers = {**HEADERS, "Referer": ref if page > 1 else ALBAMON_BASE + "/"}
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        nd = soup.find("script", id="__NEXT_DATA__")
        if not nd:
            return []

        data = json.loads(nd.string or "{}")
        qdata = (
            data.get("props", {}).get("pageProps", {})
                .get("dehydratedState", {}).get("queries", [{}])[0]
                .get("state", {}).get("data", {})
        )
        collection = qdata.get("base", {}).get("normal", {}).get("collection", [])

        jobs = []
        for item in collection:
            recruit_no = item.get("recruitNo", "")
            pay_type   = item.get("payType", {})
            pay_label  = pay_type.get("description", "") if isinstance(pay_type, dict) else ""
            pay_amount = item.get("pay", "")
            salary     = f"{pay_label} {pay_amount}".strip() if pay_amount else ""

            jobs.append({
                "title"      : item.get("recruitTitle", ""),
                "company"    : item.get("companyName", ""),
                "location"   : item.get("workplaceArea", "") or item.get("workplaceAddress", ""),
                "deadline"   : _normalize_date(item.get("closingDate", "") or ""),
                "type"       : "시간제",
                "salary"     : salary,
                "description": "",
                "apply_link" : f"{ALBAMON_BASE}/jobs/detail/{recruit_no}" if recruit_no else "",
                "source"     : "알바몬",
            })
        return jobs
    except Exception as e:
        print(f"\n  [알바몬 오류] {e}")
        return []


# ── 알바천국 스크래핑 ─────────────────────────────────────────────────────────

ALBA_BASE = "https://www.alba.co.kr"

def scrape_albacheon(page: int) -> list[dict]:
    """알바천국 중장년 채용관 스크래핑 — /Job/Professional/Senior"""
    url = f"{ALBA_BASE}/Job/Professional/Senior?page={page}&hidSortCnt=50"
    headers = {**HEADERS, "Referer": f"{ALBA_BASE}/Job/Professional/Senior"}
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding or "utf-8"
        soup = BeautifulSoup(resp.text, "html.parser")

        jobs = []
        for row in soup.select("tbody.observe-job tr[data-imid]"):
            if "summaryView" in " ".join(row.get("class", [])):
                continue

            title_el   = row.select_one("td.title span.title")
            company_el = row.select_one("td.title span.company")
            loc_el     = row.select_one("td.local")
            pay_icon   = row.select_one("td.pay .payIcon")
            pay_num    = row.select_one("td.pay .number")
            link_el    = row.select_one("td.title a.info")

            if not title_el:
                continue

            href = link_el.get("href", "") if link_el else ""
            link = (ALBA_BASE + href) if href.startswith("/") else href

            pay_type   = pay_icon.get_text(strip=True) if pay_icon else ""
            pay_amount = pay_num.get_text(strip=True).replace(",", "") if pay_num else ""
            salary = f"{pay_type} {pay_amount}".strip() if pay_amount else ""

            # 회사명에서 광고 em 태그 텍스트 제거
            company_raw = company_el.get_text(strip=True) if company_el else ""
            for em in (company_el.select("em") if company_el else []):
                company_raw = company_raw.replace(em.get_text(strip=True), "").strip()

            jobs.append({
                "title"      : title_el.get_text(strip=True),
                "company"    : company_raw,
                "location"   : loc_el.get_text(strip=True) if loc_el else "",
                "deadline"   : "",
                "type"       : "시간제",
                "salary"     : salary,
                "description": "",
                "apply_link" : link,
                "source"     : "알바천국",
            })
        return jobs
    except Exception as e:
        print(f"\n  [알바천국 오류] {e}")
        return []


# ── 시니어로 스크래핑 (seniorro.or.kr) ───────────────────────────────────────

SENIORRO_BASE = "https://www.seniorro.or.kr"

def scrape_seniorro(page: int) -> list[dict]:
    """
    시니어로(seniorro.or.kr) 구인공고 스크래핑.
    POST /noin/searchWork.do — pageIndex, pageUnit 파라미터.
    SSL 인증서 오류 사이트이므로 verify=False 사용.
    """
    url = SENIORRO_BASE + "/noin/searchWork.do"
    post_data = {
        "pageIndex": str(page),
        "pageUnit" : "30",
        "align"    : "",
    }
    headers = {**HEADERS, "Referer": SENIORRO_BASE + "/noin/main.do"}
    try:
        resp = requests.post(url, data=post_data, headers=headers,
                             timeout=15, verify=False)
        resp.raise_for_status()
        resp.encoding = "utf-8"
        soup = BeautifulSoup(resp.text, "html.parser")

        jobs = []
        for li in soup.select("ul.board-list-item li"):
            title_el      = li.select_one("div.info-tit > strong")
            link_el       = li.select_one("div.info > a[href]")
            region_spans  = li.select("div.info-stit span.region")
            proc_el       = li.select_one("div.info-proc")
            emp_spans     = li.select("div.info-stit span:not(.region)")

            if not title_el:
                continue

            # 회사명: "사업체명 : (주)xxx |" → 이름만 추출
            company = ""
            if region_spans:
                raw = region_spans[0].get_text(strip=True)
                m = re.search(r"사업체명\s*:\s*(.+?)(?:\s*\||\s*$)", raw)
                if m:
                    company = m.group(1).strip()

            # 지역: "지역 : 경기 양주시" → 지역만 추출
            location = ""
            if len(region_spans) > 1:
                raw = region_spans[1].get_text(strip=True)
                m = re.search(r"지역\s*:\s*(.+)", raw)
                if m:
                    location = m.group(1).strip()

            # 고용형태: "| 시간제일자리" → 텍스트만
            emp_type = ""
            for sp in emp_spans:
                t = re.sub(r"^\s*\|\s*", "", sp.get_text(strip=True)).strip()
                if t and ("일자리" in t or "근무" in t or "정규" in t or "계약" in t):
                    emp_type = t
                    break

            # 마감일: "20260421 ~ 20260620" → 종료일(YYYY-MM-DD)
            deadline = ""
            if proc_el:
                dates = re.findall(r"\d{8}", proc_el.get_text())
                if len(dates) >= 2:
                    deadline = _normalize_date(dates[1])
                elif len(dates) == 1:
                    deadline = _normalize_date(dates[0])

            # 링크: work.go.kr 또는 사이트 내부 링크
            href = link_el.get("href", "") if link_el else ""
            link = href if href.startswith("http") else (
                SENIORRO_BASE + href if href.startswith("/") else href)

            jobs.append({
                "title"      : title_el.get_text(strip=True),
                "company"    : company,
                "location"   : location,
                "deadline"   : deadline,
                "type"       : emp_type,
                "salary"     : "",
                "description": "",
                "apply_link" : link,
                "source"     : "시니어로",
            })
        return jobs
    except Exception as e:
        print(f"\n  [시니어로 오류] {e}")
        return []


# ── 유틸 ──────────────────────────────────────────────────────────────────────

def _normalize_date(raw: str) -> str:
    raw = raw.strip()
    if re.match(r"\d{4}-\d{2}-\d{2}", raw):
        return raw[:10]
    m = re.match(r"(\d{4})(\d{2})(\d{2})", raw)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = re.match(r"(\d{2,4})[./](\d{2})[./](\d{2})", raw)
    if m:
        y = ("20" + m.group(1)) if len(m.group(1)) == 2 else m.group(1)
        return f"{y}-{m.group(2)}-{m.group(3)}"
    if any(k in raw for k in ("상시", "채용시", "마감없음", "수시")):
        return "상시모집"
    return raw


def _exclude_reason(job: dict) -> str:
    title   = (job.get('title')   or '').lower()
    company = (job.get('company') or '').lower()
    combined = title + ' ' + company
    for exc in EXCLUDE_COMPANIES:
        if exc in company:
            return f'업체명: {exc}'
    for kw in EXCLUDE_KEYWORDS:
        if kw in combined:
            return f'키워드: {kw}'
    return ''


def _is_excluded(job: dict) -> bool:
    return bool(_exclude_reason(job))


def _deduplicate(jobs: list[dict]) -> list[dict]:
    seen: set[tuple] = set()
    unique = []
    for job in jobs:
        key = (job["title"].strip().lower(), job["company"].strip().lower())
        if key not in seen and job["title"]:
            seen.add(key)
            unique.append(job)
    return unique


def _is_api_key_set() -> bool:
    return WORK24_AUTH_KEY not in ("", "YOUR_AUTH_KEY_HERE")


# ── 메인 ──────────────────────────────────────────────────────────────────────

def run_crawler():
    print("=" * 60)
    print("  시니어 취업정보 크롤러")
    print(f"  실행 시각: {datetime.now(KST).strftime('%Y-%m-%d %H:%M:%S KST')}")
    print(f"  대상 연령: 50세 이상 ({BIRTH_YEAR_LIMIT}년 이전 출생)")
    print("  출처: 고용24 / 알바몬 / 알바천국 / 시니어로")
    print("=" * 60)

    all_jobs: list[dict] = []
    source_counts: dict[str, int] = {}

    # ── 1단계: 고용24 ────────────────────────────────────────
    if _is_api_key_set():
        print("\n[1/4] 고용24 오픈API 모드")
        collect_fn = fetch_work24_api
    else:
        print("\n[1/4] 고용24 웹 스크래핑 모드")
        print(f"      birthToYY={BIRTH_YEAR_LIMIT} (50세 이상)")
        collect_fn = scrape_work24_web

    for page in range(1, MAX_PAGES + 1):
        print(f"  페이지 {page}/{MAX_PAGES} ...", end=" ", flush=True)
        jobs = collect_fn(page)
        print(f"{len(jobs)}건")
        all_jobs.extend(jobs)
        if len(jobs) < ITEMS_PER_PAGE:
            break
        time.sleep(REQUEST_DELAY)

    source_counts["고용24"] = sum(1 for j in all_jobs if j["source"] == "고용24")

    # ── 2단계: 알바몬 ────────────────────────────────────────
    print("\n[2/4] 알바몬 스크래핑")
    before = len(all_jobs)
    for page in range(1, 4):
        print(f"  페이지 {page}/3 ...", end=" ", flush=True)
        jobs = scrape_albamon(page)
        print(f"{len(jobs)}건")
        all_jobs.extend(jobs)
        if not jobs:
            break
        time.sleep(REQUEST_DELAY)
    source_counts["알바몬"] = len(all_jobs) - before

    # ── 3단계: 알바천국 ──────────────────────────────────────
    print("\n[3/4] 알바천국 스크래핑 (중장년 채용관)")
    before = len(all_jobs)
    for page in range(1, 5):
        print(f"  페이지 {page}/4 ...", end=" ", flush=True)
        jobs = scrape_albacheon(page)
        print(f"{len(jobs)}건")
        all_jobs.extend(jobs)
        if not jobs or len(jobs) < 10:
            break
        time.sleep(REQUEST_DELAY)
    source_counts["알바천국"] = len(all_jobs) - before

    # ── 4단계: 시니어로 ──────────────────────────────────────
    print("\n[4/4] 시니어로(seniorro.or.kr) 스크래핑")
    before = len(all_jobs)
    for page in range(1, 7):
        print(f"  페이지 {page}/6 ...", end=" ", flush=True)
        jobs = scrape_seniorro(page)
        print(f"{len(jobs)}건")
        all_jobs.extend(jobs)
        if not jobs or len(jobs) < 30:
            break
        time.sleep(REQUEST_DELAY)
    source_counts["시니어로"] = len(all_jobs) - before

    # ── 후처리 ────────────────────────────────────────────────
    all_jobs = _deduplicate(all_jobs)

    excluded_jobs = []
    filtered_jobs = []
    for j in all_jobs:
        reason = _exclude_reason(j)
        if reason:
            j['_exclude_reason'] = reason
            excluded_jobs.append(j)
        else:
            filtered_jobs.append(j)
    all_jobs = filtered_jobs
    print(f"\n  부적합 업체 필터링: {len(excluded_jobs)}건 제외")

    today_str = date.today().isoformat()
    filtered, expired = [], 0
    for job in all_jobs:
        dl = job.get("deadline", "")
        if re.match(r"\d{4}-\d{2}-\d{2}", dl) and dl < today_str:
            expired += 1
            continue
        filtered.append(job)

    def _sort_key(j: dict) -> str:
        dl = j.get("deadline", "")
        return dl if re.match(r"\d{4}-\d{2}-\d{2}", dl) else "9999-12-31"

    filtered.sort(key=_sort_key)

    # ── 저장 ──────────────────────────────────────────────────
    updated_at = datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S KST")
    output = {
        "updated_at"   : updated_at,
        "total"        : len(filtered),
        "source_counts": source_counts,
        "jobs"         : filtered,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    js_file = OUTPUT_FILE.parent / "jobs_data.js"
    js_content = (
        f"/* 자동 생성 — crawler.py / {updated_at} */\n"
        f"var JOBS_DATA = {json.dumps(output, ensure_ascii=False, indent=2)};\n"
    )
    with open(js_file, "w", encoding="utf-8") as f:
        f.write(js_content)

    excluded_js = OUTPUT_FILE.parent / "excluded_data.js"
    excluded_payload = {
        'updated_at': updated_at,
        'total': len(excluded_jobs),
        'jobs': excluded_jobs,
        'filter_config': {
            'companies': sorted(EXCLUDE_COMPANIES),
            'keywords': EXCLUDE_KEYWORDS,
        }
    }
    excluded_content = (
        f"/* 자동 생성 — 필터링 제외 목록 / {updated_at} */\n"
        f"var EXCLUDED_DATA = {json.dumps(excluded_payload, ensure_ascii=False, indent=2)};\n"
    )
    with open(excluded_js, "w", encoding="utf-8") as f:
        f.write(excluded_content)

    print("\n" + "=" * 60)
    print(f"  수집 완료: {len(filtered)}건  (만료 제외: {expired}건)")
    print("  출처별 수집 현황:")
    for src, cnt in source_counts.items():
        print(f"    {src}: {cnt}건")
    print(f"  저장: {OUTPUT_FILE}")
    print("=" * 60)

    _notify_windows(
        title="시니어 취업정보 업데이트 완료",
        body=(
            f"새 공고 {len(filtered)}건 수집\n"
            f"만료 {expired}건 삭제 | {updated_at}"
        ),
    )


# ── Windows 알림 ──────────────────────────────────────────────────────────────

def _notify_windows(title: str, body: str) -> None:
    import subprocess
    ps_script = r"""
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.UI.Notifications.ToastNotificationManager,
         Windows.UI.Notifications, ContentType=WindowsRuntime]
$null = [Windows.Data.Xml.Dom.XmlDocument,
         Windows.Data.Xml.Dom, ContentType=WindowsRuntime]

$xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent(
    [Windows.UI.Notifications.ToastTemplateType]::ToastText02)

$nodes = $xml.GetElementsByTagName("text")
$nodes.Item(0).AppendChild($xml.CreateTextNode("{TITLE}")) | Out-Null
$nodes.Item(1).AppendChild($xml.CreateTextNode("{BODY}"))  | Out-Null

$toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier(
    "시니어 취업정보").Show($toast)
""".replace("{TITLE}", title.replace('"', "")).replace(
        "{BODY}", body.replace('"', "").replace("\n", " / ")
    )
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-NonInteractive",
             "-ExecutionPolicy", "Bypass", "-Command", ps_script],
            timeout=10, capture_output=True,
        )
    except Exception:
        pass


if __name__ == "__main__":
    run_crawler()
