"""
시니어(50대 이상) 취업정보 크롤러
출처: 고용24 / 알바몬 / 알바천국 / 시니어로 / 맘시터
저장: jobs.json + jobs_data.js

[고용24 오픈API 키 발급]
  https://www.work24.go.kr/cm/e/a/0110/selectOpenApiIntro.do
  발급 후 WORK24_AUTH_KEY 값을 교체하면 API 모드로 전환됩니다.
"""

import json
import time
import re
import sys
import random

# Windows CP949 환경에서 em dash 등 유니코드 문자 출력 오류 방지
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
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

# 경기도 잡아바 API 키 (경기데이터드림에서 발급: https://data.gg.go.kr/portal/myPage/actKeyPage.do)
JOBABA_API_KEY = "YOUR_JOBABA_KEY_HERE"

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
    '메가커피', '엔제리너스', '커피빈', '블루보틀', '더벤티', '카페베네',
    # 패스트푸드 프랜차이즈 (젊은층 위주)
    '롯데리아', '맥도날드', 'kfc', '버거킹', '서브웨이',
    '파파이스', '노브랜드버거', '맘스터치', '쉐이크쉑', '파이브가이즈',
    # 디저트 프랜차이즈
    '배스킨라빈스', '던킨', '크리스피크림',
    # 편의점 (시간제 위주, 젊은층 타겟)
    '이마트24', 'gs25', 'cu편의점', '세븐일레븐',
    # 게임회사 (20~30대 중심)
    '넥슨', '넷마블', '엔씨소프트', '크래프톤', '펄어비스', '스마일게이트',
    '컴투스', '게임빌', '카카오게임즈', '위메이드',
    # 젊은층 패션
    '무신사', '에이블리', '지그재그', '브랜디', '스파오', '탑텐',
    # 배달앱 (라이더 모집 중심)
    '쿠팡이츠', '배달의민족', '요기요',
    # 헬스·피트니스 프랜차이즈
    '애니타임피트니스', '스포애니', '더피트', '24시스포츠',
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
    '개발자',
    '백엔드 개발자', '프론트엔드 개발자', '풀스택 개발자',
    '프론트엔드', '백엔드', '풀스택',
    'ios 개발자', 'android 개발자', '앱 개발자', '웹 개발자',
    'devops 엔지니어', 'devops', 'sre 엔지니어',
    'ui/ux 디자이너', 'ux 디자이너', 'ui 디자이너',
    '데이터 사이언티스트', '머신러닝 엔지니어', '딥러닝 엔지니어', 'ai 엔지니어',
    '소프트웨어 엔지니어', '클라우드 엔지니어', 'qa 엔지니어', '테스트 엔지니어',
    '데이터 분석가', '데이터 엔지니어', '데이터 사이언스',
    '게임 개발', '모바일 개발', '앱 개발',
    '프로덕트 매니저', '프로덕트 디자이너', '게임 pd',
    '웹퍼블리셔', '서비스 기획자', 'it 기획자',
    'node.js', 'react', 'vue.js', 'spring', 'flutter', 'kotlin', 'typescript',
    'python 개발', 'java 개발', 'javascript',
    '인공지능 개발', 'llm', 'mlops', '클라우드 아키텍트',
    '블록체인', 'web3', 'nft',
    '병역특례',

    # 디지털 디자인 직군 (소프트웨어·미디어 중심, 시니어 채용 낮음)
    '그래픽 디자이너', '브랜드 디자이너',
    '모션 그래픽', '모션 디자이너',
    '영상 편집', '영상 제작자', '영상 pd',
    '3d 디자이너', '3d 모델러', '3d 아티스트',
    '게임 아티스트', '콘셉트 아티스트', '캐릭터 디자이너', '배경 아티스트',
    '웹툰 작가', '만화 작가',

    # 게임·e스포츠
    '게임 기획', '게임 디자인',
    'e스포츠', '이스포츠', '프로게이머', '게임 스트리머',

    # 크리에이터·SNS (젊은층 위주)
    '유튜브 크리에이터', '유튜브 운영', '유튜브 편집',
    '틱톡 크리에이터', '틱톡 운영',
    '숏폼', '릴스 제작',
    '인플루언서', '인터넷 방송', '스트리머',
    'sns 마케터', '콘텐츠 크리에이터',

    # 퍼포먼스·디지털 마케팅 (IT 회사 중심)
    '퍼포먼스 마케터', '퍼포먼스 마케팅',
    '그로스 마케터', '그로스 해킹',
    'seo 마케터', '앱 마케터',

    # 배달·라이더 (체력·안전 부담)
    '배달 라이더', '배달기사', '오토바이 라이더',
    '퀵서비스 라이더', '오토바이 배달',
    '새벽 배송 기사', '쿠팡 로켓배송',

    # 극한 체력직
    '이삿짐',

    # 피트니스 강사직 (자격증·체력 특화)
    '헬스 트레이너', '퍼스널 트레이너', 'pt 트레이너',
    '필라테스 강사', '요가 강사', '스피닝 강사',

    # 인턴·신입 공채 (청년 전용)
    '인턴십', '채용연계형 인턴',
    '대졸 신입 공채', '신입 공채',
    '대학생 전용', '고등학생 가능',
]

REQUEST_DELAY       = 3.0   # 페이지 간 기본 대기(초)
REQUEST_JITTER      = 2.0   # 랜덤 추가 대기 최대값
SOURCE_DELAY_MIN    = 5.0   # 출처 전환 최소 대기
SOURCE_DELAY_MAX    = 10.0  # 출처 전환 최대 대기
MAX_PAGES           = 50
ITEMS_PER_PAGE      = 20
MAX_RETRIES         = 3

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
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Cache-Control": "max-age=0",
    "Upgrade-Insecure-Requests": "1",
    "DNT": "1",
    "Referer": BASE_URL + "/wk/a/b/1200/retriveDtlEmpSrchList.do",
}

# 출처별 세션 (쿠키 유지·커넥션 재사용)
_sessions: dict[str, requests.Session] = {}

def _session(name: str) -> requests.Session:
    if name not in _sessions:
        s = requests.Session()
        s.headers.update(HEADERS)
        _sessions[name] = s
    return _sessions[name]

def _sleep_page():
    """페이지 간 자연스러운 대기"""
    time.sleep(REQUEST_DELAY + random.uniform(0, REQUEST_JITTER))

def _sleep_source():
    """출처 전환 시 충분한 대기"""
    time.sleep(random.uniform(SOURCE_DELAY_MIN, SOURCE_DELAY_MAX))


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
    sess = _session('work24')
    for attempt in range(MAX_RETRIES):
        try:
            resp = sess.post(POST_URL, data=post_data, timeout=30)
            resp.raise_for_status()
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait = 2 ** (attempt + 1) + random.uniform(0, 1.5)
                print(f"재시도 {attempt+1}/{MAX_RETRIES-1} ({wait:.1f}초 대기)...", end=" ", flush=True)
                time.sleep(wait)
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
    sess = _session('albamon')
    sess.headers.update({"Referer": ref if page > 1 else ALBAMON_BASE + "/"})
    for attempt in range(MAX_RETRIES):
        try:
            resp = sess.get(url, timeout=15)
            resp.raise_for_status()
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait = 2 ** (attempt + 1) + random.uniform(0, 1)
                time.sleep(wait)
            else:
                print(f"\n  [알바몬 오류] {e}")
                return []
    try:
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
    sess = _session('albacheon')
    sess.headers.update({"Referer": f"{ALBA_BASE}/Job/Professional/Senior"})
    for attempt in range(MAX_RETRIES):
        try:
            resp = sess.get(url, timeout=15)
            resp.raise_for_status()
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait = 2 ** (attempt + 1) + random.uniform(0, 1)
                time.sleep(wait)
            else:
                print(f"\n  [알바천국 오류] {e}")
                return []
    try:
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
    sess = _session('seniorro')
    sess.headers.update({"Referer": SENIORRO_BASE + "/noin/main.do"})
    for attempt in range(MAX_RETRIES):
        try:
            resp = sess.post(url, data=post_data, timeout=15, verify=False)
            resp.raise_for_status()
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait = 2 ** (attempt + 1) + random.uniform(0, 1)
                time.sleep(wait)
            else:
                print(f"\n  [시니어로 오류] {e}")
                return []
    try:
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


# ── 서울시 일자리포털 스크래핑 ────────────────────────────────────────────────

SEOUL_JOBS_BASE = "https://job.seoul.go.kr"
SEOUL_JOBS_LIST = SEOUL_JOBS_BASE + "/hmpg/rmim/rcmg/rcmgListPgng.do"
SEOUL_JOBS_PAGE = SEOUL_JOBS_BASE + "/hmpg/rmim/rcmg/rcmgListPage.do"

def scrape_seoul_jobs(page: int) -> list[dict]:
    """서울시 일자리포털 구인공고 AJAX 스크래핑"""
    sess = _session('seoul_jobs')
    # 첫 페이지 방문 시 쿠키 획득
    if page == 1:
        try:
            sess.get(SEOUL_JOBS_PAGE, timeout=15)
            time.sleep(random.uniform(1.5, 2.5))
        except Exception:
            pass

    post_data = {
        "miv_pageNo"  : str(page),
        "miv_pageSize": "100",
        "total_cnt"   : "",
        "LISTOP"      : "",
        "sidx"        : "FRST_REG_DT",
        "sord"        : "DESC",
        "wantedAuthNo": "",
        "occupation"  : "",
        "region"      : "11000",
        "certLic"     : "",
        "major"       : "",
        "keyword"     : "",
        "coTp"        : "",
        "regDate"     : "",
    }
    sess.headers.update({
        "Referer"        : SEOUL_JOBS_PAGE,
        "Content-Type"   : "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
    })

    for attempt in range(MAX_RETRIES):
        try:
            resp = sess.post(SEOUL_JOBS_LIST, data=post_data, timeout=20)
            resp.raise_for_status()
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait = 2 ** (attempt + 1) + random.uniform(0, 1.5)
                print(f"재시도 {attempt+1}/{MAX_RETRIES-1} ({wait:.1f}초)...", end=" ", flush=True)
                time.sleep(wait)
            else:
                print(f"\n  [서울일자리포털 오류] {e}")
                return []
    try:
        resp.encoding = "utf-8"
        soup = BeautifulSoup(resp.text, "html.parser")

        jobs = []
        for row in soup.select("div.boardlist table tbody tr"):
            try:
                company_el = row.select_one("td.block")
                a_tag      = row.select_one("td.title_box div.title a")
                if not a_tag:
                    continue

                title   = a_tag.get_text(strip=True)
                company = company_el.get_text(strip=True) if company_el else ""

                href = a_tag.get("href", "")
                link = (SEOUL_JOBS_BASE + href) if href.startswith("/") else href

                lis      = row.select("td.title_box ul.list_box li")
                salary   = re.sub(r"^[가-힣\(\)\s]+:\s*", "", lis[0].get_text(strip=True)).strip() if len(lis) > 0 else ""
                location = re.sub(r"^[가-힣\s]+:\s*", "",  lis[1].get_text(strip=True)).strip() if len(lis) > 1 else ""

                hidden_tds = row.select("td.m_hidden")
                deadline   = hidden_tds[-1].get_text(strip=True) if hidden_tds else ""

                jobs.append({
                    "title"      : title,
                    "company"    : company,
                    "location"   : location,
                    "deadline"   : _normalize_date(deadline),
                    "type"       : "",
                    "salary"     : salary,
                    "description": "",
                    "apply_link" : link,
                    "source"     : "서울일자리포털",
                })
            except Exception:
                continue

        return jobs
    except Exception as e:
        print(f"\n  [서울일자리포털 파싱 오류] {e}")
        return []


# ── 경기도 잡아바 (경기데이터드림 Sheet API) ──────────────────────────────────
# 인증 불필요 — data.gg.go.kr 웹열람 Sheet API 사용
# 데이터: https://data.gg.go.kr/portal/data/service/selectServicePage.do?infId=BF99Q5LCFU0G5XMU9B8L31468278&infSeq=1
# ※ API 키 발급 후에는 _fetch_jobaba_api_key_mode()로 교체 예정 (JOBABA_API_KEY 입력 시 자동 전환)

JOBABA_SHEET_BASE  = "https://data.gg.go.kr"
JOBABA_SHEET_URL   = JOBABA_SHEET_BASE + "/portal/data/sheet/searchSheetData.do"
JOBABA_INF_ID      = "BF99Q5LCFU0G5XMU9B8L31468278"
JOBABA_INF_SEQ     = "1"
JOBABA_ROWS        = 1000   # 회당 최대 수집 건수

def _is_jobaba_key_set() -> bool:
    return JOBABA_API_KEY not in ("", "YOUR_JOBABA_KEY_HERE")

def scrape_jobaba_sheet() -> list[dict]:
    """경기도 잡아바 — 경기데이터드림 Sheet API (인증 불필요, 전체 일괄 수집)"""
    sess = _session('jobaba')
    sess.headers.update({
        "Referer": f"{JOBABA_SHEET_BASE}/portal/data/service/selectServicePage.do"
                   f"?infId={JOBABA_INF_ID}&infSeq={JOBABA_INF_SEQ}",
        "AJAX"   : "true",
        "Content-Type": "application/x-www-form-urlencoded",
    })

    all_items: list[dict] = []
    page = 1

    while True:
        try:
            resp = sess.post(
                JOBABA_SHEET_URL,
                data={
                    "rows"  : str(JOBABA_ROWS),
                    "infId" : JOBABA_INF_ID,
                    "infSeq": JOBABA_INF_SEQ,
                    "page"  : str(page),
                },
                timeout=20,
            )
            resp.raise_for_status()
            result = resp.json()
        except Exception as e:
            print(f"\n  [잡아바 Sheet 오류] page={page} {e}")
            break

        items = result.get("data", [])
        all_items.extend(items)
        total_pages = int(result.get("pages", 1))
        print(f"  페이지 {page}/{total_pages} ... {len(items)}건", flush=True)

        if page >= total_pages:
            break
        page += 1
        _sleep_page()

    jobs = []
    for item in all_items:
        title    = (item.get("PBANC_CONT") or "").strip()
        company  = (item.get("ENTRPRS_NM") or "").strip()
        if not title:
            continue
        location = (item.get("WORK_REGION_CONT") or "").strip() or "경기"
        salary   = (item.get("SALARY_COND")      or "").strip()
        emp_type_raw = (item.get("PBANC_FORM_DIV") or "").strip()
        # 잡아바 고용형태 원문("기간의 정함이 없는 근로계약..." 등)을 표준값으로 정규화
        if "시간제" in emp_type_raw or "단시간" in emp_type_raw:
            emp_type = "시간제"
        elif "정함이 없는" in emp_type_raw:
            emp_type = "정규직"
        elif "정함이 있는" in emp_type_raw or "계약" in emp_type_raw:
            emp_type = "계약직"
        else:
            emp_type = ""
        end_dt   = (item.get("RCPT_END_DE")       or "").strip()
        link     = (item.get("URL")               or "").strip()
        category = (item.get("RECRUT_FIELD_NM")   or "").strip()

        jobs.append({
            "title"      : title,
            "company"    : company,
            "location"   : location,
            "deadline"   : _normalize_date(end_dt),
            "type"       : emp_type,
            "salary"     : salary,
            "description": "",
            "apply_link" : link,
            "category"   : category,
            "source"     : "잡아바",
        })

    return jobs


def _fetch_jobaba_api_key_mode() -> list[dict]:
    """경기도 잡아바 — 공식 API 키 모드 (키 발급 후 활성화)
    현재 openapi.gg.go.kr 엔드포인트 확인 중 — 키 입력 시 이 함수로 자동 전환됨."""
    params = {
        "KEY"   : JOBABA_API_KEY,
        "Type"  : "json",
        "pIndex": "1",
        "pSize" : "100",
    }
    try:
        resp = requests.get(
            "https://openapi.gg.go.kr/JOBABARecrtInfo",
            params=params, headers=HEADERS, timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        root = next(
            (v for v in data.values() if isinstance(v, list)),
            []
        )
        jobs = []
        for item in root:
            title = (item.get("PBANC_CONT") or item.get("recrtPlcNm") or "").strip()
            if not title:
                continue
            jobs.append({
                "title"      : title,
                "company"    : (item.get("ENTRPRS_NM") or item.get("cmpnyNm") or "").strip(),
                "location"   : (item.get("WORK_REGION_CONT") or item.get("workAddr") or "").strip(),
                "deadline"   : _normalize_date(item.get("RCPT_END_DE") or item.get("recrtEndDt") or ""),
                "type"       : (item.get("PBANC_FORM_DIV") or "").strip(),
                "salary"     : (item.get("SALARY_COND") or "").strip(),
                "description": "",
                "apply_link" : (item.get("URL") or item.get("recrtUrl") or "").strip(),
                "source"     : "잡아바",
            })
        return jobs
    except Exception as e:
        print(f"\n  [잡아바 API 키 모드 오류] {e} — Sheet 모드로 폴백")
        return scrape_jobaba_sheet()


# ── 맘시터 (mom-sitter.com) 베이비시터 구인공고 ───────────────────────────────
# 공개 API — 인증 불필요
# POST https://api.mom-sitter.com/public-web-api/v1/parents/search
# 링크: /search/parent (개별 /parent/{id}는 서버가 직접 접근 404 반환 — SPA 내부 라우팅 전용)

MOMSITTER_SITE   = "https://www.mom-sitter.com"
MOMSITTER_API    = "https://api.mom-sitter.com/public-web-api/v1/parents/search"
MOMSITTER_PAGES  = 100  # 최대 1000건 (페이지당 10건, 최신순)


def scrape_momsitter(page: int) -> list[dict]:
    """맘시터 — 부모님이 베이비시터를 구하는 공고 수집 (공개 JSON API)"""
    sess = _session('momsitter')
    sess.headers.update({
        "Referer"     : MOMSITTER_SITE + "/search/parent",
        "Content-Type": "application/json",
        "Accept"      : "application/json",
    })
    for attempt in range(MAX_RETRIES):
        try:
            resp = sess.post(MOMSITTER_API, json={"page": page}, timeout=20)
            resp.raise_for_status()
            break
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                wait = 2 ** (attempt + 1) + random.uniform(0, 1)
                time.sleep(wait)
            else:
                print(f"\n  [맘시터 오류] {e}")
                return []
    try:
        data    = resp.json()
        parents = data.get("parents", [])

        jobs = []
        for item in parents:
            user_id    = item.get("userId", "")
            title      = (item.get("profileTitle") or "").strip()
            location   = (item.get("careLocationSummary") or "").strip()
            salary     = (item.get("estimatedSummary") or "").strip()
            children   = (item.get("childrenSummary") or "").strip()
            sched_tp   = (item.get("careSchedule", {}).get("careScheduleType", {}).get("text") or "")
            sched_sum  = (item.get("careSchedule", {}).get("careScheduleSummary") or "").strip()

            if not title:
                continue

            emp_type = f"{sched_tp} 돌봄" if sched_tp else "돌봄"
            desc     = " · ".join(filter(None, [
                f"아이: {children}" if children else "",
                sched_sum,
            ]))

            jobs.append({
                "title"      : title,
                "company"    : "개인(부모님)",
                "location"   : location,
                "deadline"   : "",
                "type"       : emp_type,
                "salary"     : salary,
                "description": desc,
                "apply_link" : f"{MOMSITTER_SITE}/parent/{user_id}" if user_id else MOMSITTER_SITE + "/search/parent",
                "source"     : "맘시터",
            })
        return jobs
    except Exception as e:
        print(f"\n  [맘시터 파싱 오류] {e}")
        return []


# ── 경기도 어르신자립형일자리사업 (경기데이터드림 Sheet API) ────────────────────
# 데이터: https://data.gg.go.kr/portal/data/service/selectServicePage.do?infId=AXMYYE3KRB83S1MRYS0Z21195052&infSeq=1

ELDER_JOBS_INF_ID  = "AXMYYE3KRB83S1MRYS0Z21195052"
ELDER_JOBS_INF_SEQ = "1"
ELDER_JOBS_LINK    = (
    "https://data.gg.go.kr/portal/data/service/selectServicePage.do"
    f"?infId={ELDER_JOBS_INF_ID}&infSeq={ELDER_JOBS_INF_SEQ}"
)

def scrape_elder_jobs_sheet() -> list[dict]:
    """경기도 어르신자립형일자리사업 — Sheet API (인증 불필요)"""
    sess = _session('elder_jobs')
    sess.headers.update({
        "Referer"     : ELDER_JOBS_LINK,
        "AJAX"        : "true",
        "Content-Type": "application/x-www-form-urlencoded",
    })

    all_items: list[dict] = []
    page = 1

    while True:
        try:
            resp = sess.post(
                JOBABA_SHEET_BASE + "/portal/data/sheet/searchSheetData.do",
                data={
                    "rows"  : str(JOBABA_ROWS),
                    "infId" : ELDER_JOBS_INF_ID,
                    "infSeq": ELDER_JOBS_INF_SEQ,
                    "page"  : str(page),
                },
                timeout=20,
            )
            resp.raise_for_status()
            result = resp.json()
        except Exception as e:
            print(f"\n  [어르신일자리 Sheet 오류] page={page} {e}")
            break

        items = result.get("data", [])
        all_items.extend(items)
        total_pages = int(result.get("pages", 1))
        print(f"  페이지 {page}/{total_pages} ... {len(items)}건", flush=True)

        if page >= total_pages:
            break
        page += 1
        _sleep_page()

    jobs = []
    for item in all_items:
        # 모집중인 공고만 포함
        if (item.get("STATE_DIV_NM") or "").strip() != "모집중":
            continue

        inst   = (item.get("OPERT_INST_NM") or "").strip()   # 운영기관명
        sigun  = (item.get("SIGUN_NM")      or "").strip()   # 시군명
        job_tp = (item.get("JOB_TYPE_NM")   or "").strip()   # 일자리유형명
        wage   = (item.get("WAGE_INFO")     or "").strip()
        end_de = (item.get("END_DE")        or "").strip()
        cnt    = item.get("RECPSNUM_CNT", "")

        # 제목: "어르신자립형일자리 [경기 오산시]"
        title   = f"어르신자립형일자리 [{sigun}]" if sigun else "어르신자립형일자리"
        company = inst
        location = f"경기 {sigun}" if sigun else "경기도"
        desc = f"모집인원 {cnt}명" if cnt else ""
        if job_tp and job_tp.lower() != "all":
            desc = f"{job_tp} · {desc}".strip(" ·")

        jobs.append({
            "title"      : title,
            "company"    : company,
            "location"   : location,
            "deadline"   : _normalize_date(end_de),
            "type"       : "어르신일자리",
            "salary"     : wage,
            "description": desc,
            "apply_link" : ELDER_JOBS_LINK,
            "source"     : "어르신일자리",
        })

    return jobs


# ── 대전일자리정보망 (jobdaejeon.or.kr) ──────────────────────────────────────
# POST 방식, 71페이지 × 10건 = 약 710건
# 공고 본문은 work24.go.kr 연결 → _deduplicate에서 wantedAuthNo로 고용24 중복 제거

DAEJEON_BASE = "https://www.jobdaejeon.or.kr"
DAEJEON_LIST = DAEJEON_BASE + "/public/html/Business.do"
DAEJEON_PAGES = 72

def scrape_daejeon(page: int) -> list[dict]:
    sess = _session('daejeon')
    sess.headers.update({"Referer": DAEJEON_BASE + "/"})
    try:
        resp = sess.post(
            DAEJEON_LIST,
            data={
                "pg": "/gabin/busiGuide/worknet.jsp",
                "search": "Y", "id": "0",
                "page": str(page),
                "salTp": "", "minPay": "", "maxPay": "",
                "education": "", "career": "",
                "minCareerM": "", "maxCareerM": "",
                "pref": "", "keyword": "",
            },
            timeout=20,
        )
        resp.raise_for_status()
    except Exception as e:
        print(f"\n  [대전 오류] page={page} {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    jobs = []
    for tr in soup.select("table tr"):
        link_el = tr.select_one("a[href*=work24]")
        if not link_el:
            continue
        tds = tr.select("td")
        if len(tds) < 3:
            continue
        company  = tds[0].get_text(strip=True)
        title    = link_el.get_text(strip=True)
        link     = link_el["href"].strip()
        sub_text = tds[1].get_text(" ", strip=True)
        deadline_m = re.search(r"(\d{4}-\d{2}-\d{2})", tds[-1].get_text() if len(tds) > 2 else "")
        deadline = deadline_m.group(1) if deadline_m else ""
        location_m = re.search(r"근무지\s*[:\|]\s*([^\|]+)", sub_text)
        location = location_m.group(1).strip() if location_m else "대전"
        if not location or location == "대전":
            location = "대전광역시"
        if not title:
            continue
        jobs.append({
            "title"      : title,
            "company"    : company,
            "location"   : location,
            "deadline"   : _normalize_date(deadline),
            "type"       : "",
            "salary"     : "",
            "description": "",
            "apply_link" : link,
            "source"     : "대전일자리",
        })
    return jobs


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


def _extract_wanted_no(url: str) -> str:
    """work24.go.kr URL에서 wantedAuthNo 추출 — 출처 간 중복 감지용"""
    m = re.search(r'wantedAuthNo=([A-Z0-9]+)', url or '')
    return m.group(1) if m else ''

def _deduplicate(jobs: list[dict]) -> list[dict]:
    seen_links: set[str] = set()
    seen_wanted: set[str] = set()
    seen_title_co: set[tuple] = set()
    unique = []
    for job in jobs:
        title   = (job.get("title")   or "").strip().lower()
        company = (job.get("company") or "").strip().lower()
        link    = (job.get("apply_link") or "").strip()
        wanted  = _extract_wanted_no(link)

        # 1순위: wantedAuthNo 동일 (고용24 ↔ 대전/서울포털 중복)
        if wanted and wanted in seen_wanted:
            continue
        # 2순위: apply_link 완전 동일
        if link and link in seen_links:
            continue
        # 3순위: (제목+회사) 동일
        key = (title, company)
        if title and key in seen_title_co:
            continue

        if wanted: seen_wanted.add(wanted)
        if link:   seen_links.add(link)
        if title:  seen_title_co.add(key)
        if title:
            unique.append(job)
    return unique


def _is_api_key_set() -> bool:
    return WORK24_AUTH_KEY not in ("", "YOUR_AUTH_KEY_HERE")


# ── 메인 ──────────────────────────────────────────────────────────────────────

def _crawl_source(name: str, fn, pages: int, stop_if_less: int = 0) -> list[dict]:
    """페이지 반복 수집 + 자연스러운 대기를 묶어주는 헬퍼"""
    jobs_all: list[dict] = []
    for page in range(1, pages + 1):
        print(f"  페이지 {page}/{pages} ...", end=" ", flush=True)
        jobs = fn(page)
        print(f"{len(jobs)}건")
        jobs_all.extend(jobs)
        if not jobs or (stop_if_less and len(jobs) < stop_if_less):
            break
        if page < pages:
            _sleep_page()
    return jobs_all


def run_crawler():
    print("=" * 60)
    print("  시니어 취업정보 크롤러")
    print(f"  실행 시각: {datetime.now(KST).strftime('%Y-%m-%d %H:%M:%S KST')}")
    print(f"  대상 연령: 50세 이상 ({BIRTH_YEAR_LIMIT}년 이전 출생)")
    mode_jb = "API 키 모드" if _is_jobaba_key_set() else "Sheet 모드(키 발급 전)"
    print(f"  출처: 고용24 / 알바몬 / 알바천국 / 시니어로 / 서울일자리포털 / 잡아바({mode_jb}) / 어르신일자리(경기) / 맘시터 / 대전일자리")
    print("=" * 60)

    all_jobs: list[dict] = []
    source_counts: dict[str, int] = {}

    # ── 1단계: 고용24 ────────────────────────────────────────
    if _is_api_key_set():
        print("\n[1/8] 고용24 오픈API 모드")
        collect_fn = fetch_work24_api
    else:
        print("\n[1/8] 고용24 웹 스크래핑 모드")
        print(f"      birthToYY={BIRTH_YEAR_LIMIT} (50세 이상)")
        collect_fn = scrape_work24_web

    for page in range(1, MAX_PAGES + 1):
        print(f"  페이지 {page}/{MAX_PAGES} ...", end=" ", flush=True)
        jobs = collect_fn(page)
        print(f"{len(jobs)}건")
        all_jobs.extend(jobs)
        if len(jobs) < ITEMS_PER_PAGE:
            break
        _sleep_page()

    source_counts["고용24"] = sum(1 for j in all_jobs if j["source"] == "고용24")
    _sleep_source()

    # ── 2단계: 알바몬 ────────────────────────────────────────
    print("\n[2/8] 알바몬 스크래핑")
    before = len(all_jobs)
    all_jobs.extend(_crawl_source("알바몬", scrape_albamon, pages=4, stop_if_less=1))
    source_counts["알바몬"] = len(all_jobs) - before
    _sleep_source()

    # ── 3단계: 알바천국 ──────────────────────────────────────
    print("\n[3/8] 알바천국 스크래핑 (중장년 채용관)")
    before = len(all_jobs)
    all_jobs.extend(_crawl_source("알바천국", scrape_albacheon, pages=6, stop_if_less=10))
    source_counts["알바천국"] = len(all_jobs) - before
    _sleep_source()

    # ── 4단계: 시니어로 ──────────────────────────────────────
    print("\n[4/8] 시니어로(seniorro.or.kr) 스크래핑")
    before = len(all_jobs)
    all_jobs.extend(_crawl_source("시니어로", scrape_seniorro, pages=8, stop_if_less=30))
    source_counts["시니어로"] = len(all_jobs) - before
    _sleep_source()

    # ── 5단계: 서울시 일자리포털 ─────────────────────────────
    print("\n[5/8] 서울시 일자리포털(job.seoul.go.kr) 스크래핑")
    before = len(all_jobs)
    all_jobs.extend(_crawl_source("서울일자리포털", scrape_seoul_jobs, pages=15, stop_if_less=1))
    source_counts["서울일자리포털"] = len(all_jobs) - before

    # ── 6단계: 경기도 잡아바 ──────────────────────────────────
    _sleep_source()
    if _is_jobaba_key_set():
        print("\n[6/8] 경기도 잡아바 - API 키 모드")
        before = len(all_jobs)
        all_jobs.extend(_fetch_jobaba_api_key_mode())
        source_counts["잡아바"] = len(all_jobs) - before
    else:
        print("\n[6/8] 경기도 잡아바 - Sheet 모드 (키 발급 전 임시)")
        before = len(all_jobs)
        jobs_jb = scrape_jobaba_sheet()
        all_jobs.extend(jobs_jb)
        source_counts["잡아바"] = len(all_jobs) - before

    # ── 7단계: 경기도 어르신자립형일자리사업 ─────────────────
    _sleep_source()
    print("\n[7/8] 경기도 어르신자립형일자리사업 - Sheet 모드")
    before = len(all_jobs)
    all_jobs.extend(scrape_elder_jobs_sheet())
    source_counts["어르신일자리"] = len(all_jobs) - before

    # ── 8단계: 맘시터 베이비시터 구인공고 ────────────────────
    _sleep_source()
    print(f"\n[8/9] 맘시터(mom-sitter.com) 베이비시터 구인공고")
    before = len(all_jobs)
    all_jobs.extend(_crawl_source("맘시터", scrape_momsitter, pages=MOMSITTER_PAGES, stop_if_less=1))
    source_counts["맘시터"] = len(all_jobs) - before

    # ── 9단계: 대전일자리정보망 ───────────────────────────────
    _sleep_source()
    print(f"\n[9/9] 대전일자리정보망 (jobdaejeon.or.kr)")
    before = len(all_jobs)
    all_jobs.extend(_crawl_source("대전일자리", scrape_daejeon, pages=DAEJEON_PAGES, stop_if_less=1))
    source_counts["대전일자리"] = len(all_jobs) - before

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
