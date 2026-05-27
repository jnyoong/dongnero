"""
새 공공 소스 4개 구조 탐색 스크립트
실행: python probe_new_sources.py
결과: probe_results.json 저장
"""
import sys, json, time, re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import requests
from bs4 import BeautifulSoup
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
    "Accept-Language": "ko-KR,ko;q=0.9",
}

results = {}

# ─── 1. 나라일터 ───────────────────────────────────────────────────────────────
print("\n" + "="*60)
print("[1] 나라일터 (gojobs.go.kr) 구조 탐색")

try:
    # SSL 인증서 문제 → verify=False
    url = "https://gojobs.go.kr/apmList.do?menuNo=401&mngrMenuYn=N&selMenuNo=400&upperMenuNo="
    r = requests.get(url, headers=HEADERS, verify=False, timeout=20)
    print(f"  상태코드: {r.status_code}")
    soup = BeautifulSoup(r.text, "html.parser")

    # 페이지 타이틀
    print(f"  페이지 제목: {soup.title.text.strip() if soup.title else '없음'}")

    # 공고 목록 구조 탐색 (일반적인 테이블/리스트 셀렉터들)
    selectors = [
        "table tbody tr",
        "ul.board-list li",
        "div.list-wrap li",
        "div.brd-list tbody tr",
        ".board_list tbody tr",
        ".recrt_list li",
        "div.board-list-wrap .item",
    ]
    found_sel = None
    for sel in selectors:
        items = soup.select(sel)
        if items and len(items) > 2:
            print(f"  셀렉터 '{sel}' → {len(items)}개")
            found_sel = sel
            # 첫 번째 항목 구조 출력
            first = items[0]
            print(f"  첫 항목 텍스트: {first.get_text(' ', strip=True)[:200]}")
            # 링크 있는지
            links = first.find_all("a")
            for lnk in links[:3]:
                print(f"    링크: href={lnk.get('href','')[:80]} text={lnk.get_text(strip=True)[:40]}")
            break

    if not found_sel:
        print("  → 공고 목록 셀렉터를 찾지 못함. 페이지 구조:")
        # 주요 태그들 출력
        for tag in soup.find_all(["table", "ul", "div"], limit=20):
            cls = " ".join(tag.get("class", []))
            id_ = tag.get("id", "")
            if cls or id_:
                print(f"    <{tag.name} class='{cls}' id='{id_}'>")

        # POST 방식인지 확인 - form 태그 찾기
        forms = soup.find_all("form")
        for form in forms[:3]:
            print(f"  form: action={form.get('action','')} method={form.get('method','')}")

    # 페이지네이션 패턴
    paging = soup.select("div.paging a, div.pagination a, .page_num a")
    if paging:
        print(f"  페이지네이션 링크: {[a.get('href','')[:60] for a in paging[:5]]}")

    results["나라일터"] = {
        "status": r.status_code,
        "selector": found_sel,
        "html_preview": r.text[:3000],
    }

except Exception as e:
    print(f"  오류: {e}")
    results["나라일터"] = {"error": str(e)}

time.sleep(3)

# ─── 2. 나라일터 POST 방식 시도 ──────────────────────────────────────────────
print("\n[1b] 나라일터 POST 방식 시도")
try:
    post_url = "https://gojobs.go.kr/apmList.do"
    post_data = {
        "menuNo": "401",
        "mngrMenuYn": "N",
        "selMenuNo": "400",
        "upperMenuNo": "",
        "pageIndex": "1",
        "pageUnit": "10",
        "searchCondition": "",
        "searchKeyword": "",
        "emplymSttus": "2",  # 기간제
    }
    r2 = requests.post(post_url, data=post_data, headers=HEADERS, verify=False, timeout=20)
    print(f"  POST 상태코드: {r2.status_code}")
    soup2 = BeautifulSoup(r2.text, "html.parser")

    for sel in ["table tbody tr", "ul.board-list li", ".brd_list tr", "tbody tr"]:
        items = soup2.select(sel)
        if items and len(items) > 2:
            print(f"  POST 셀렉터 '{sel}' → {len(items)}개")
            first = items[0]
            print(f"  첫 항목: {first.get_text(' ', strip=True)[:200]}")
            break

    results["나라일터_POST"] = {"status": r2.status_code, "html_preview": r2.text[:2000]}

except Exception as e:
    print(f"  오류: {e}")
    results["나라일터_POST"] = {"error": str(e)}

time.sleep(3)

# ─── 3. 클린아이 잡플러스 ─────────────────────────────────────────────────────
print("\n" + "="*60)
print("[2] 클린아이 잡플러스 (job.cleaneye.go.kr) 구조 탐색")

try:
    url = "https://job.cleaneye.go.kr/user/ypRecruitment.do"
    r = requests.get(url, headers=HEADERS, timeout=20)
    print(f"  상태코드: {r.status_code}")
    soup = BeautifulSoup(r.text, "html.parser")

    print(f"  페이지 제목: {soup.title.text.strip() if soup.title else '없음'}")

    # form 구조
    forms = soup.find_all("form")
    for form in forms[:5]:
        print(f"  form: action='{form.get('action','')}' method='{form.get('method','')}'")
        inputs = form.find_all("input", type=lambda t: t not in ("hidden",))
        for inp in inputs[:5]:
            print(f"    input: name={inp.get('name','')} type={inp.get('type','')} value={inp.get('value','')[:30]}")
        # hidden inputs
        hidden = form.find_all("input", type="hidden")
        print(f"    hidden inputs: {[(h.get('name',''), h.get('value','')[:20]) for h in hidden[:8]]}")

    # 테이블 구조
    selectors = ["table tbody tr", "div.list-wrap tr", "#list_table tbody tr", ".tbl_list tbody tr"]
    for sel in selectors:
        items = soup.select(sel)
        if items and len(items) > 1:
            print(f"  셀렉터 '{sel}' → {len(items)}개")
            first = items[0]
            print(f"  첫 항목: {first.get_text(' ', strip=True)[:200]}")
            links = first.find_all("a")
            for lnk in links[:3]:
                print(f"    링크: href={lnk.get('href','')[:80]}")
            break

    # JavaScript 내 AJAX 요청 찾기
    scripts = soup.find_all("script")
    for scr in scripts:
        txt = scr.string or ""
        if "ajax" in txt.lower() or "fetch" in txt.lower() or ".do" in txt:
            print(f"  JS 힌트: {txt[:300]}")
            break

    results["클린아이"] = {
        "status": r.status_code,
        "html_preview": r.text[:3000],
    }

except Exception as e:
    print(f"  오류: {e}")
    results["클린아이"] = {"error": str(e)}

time.sleep(3)

# 클린아이 POST 목록 요청 시도
print("[2b] 클린아이 목록 AJAX POST 시도")
for post_url in [
    "https://job.cleaneye.go.kr/user/ypRecruitmentList.do",
    "https://job.cleaneye.go.kr/user/ypRecruitmentAjax.do",
    "https://job.cleaneye.go.kr/user/getRecruitList.do",
]:
    try:
        r = requests.post(post_url, data={"pageIndex": "1", "pageUnit": "10"}, headers={**HEADERS, "X-Requested-With": "XMLHttpRequest"}, timeout=10)
        print(f"  {post_url.split('/')[-1]}: {r.status_code}")
        if r.status_code == 200 and len(r.text) > 100:
            print(f"  응답 미리보기: {r.text[:200]}")
        time.sleep(1)
    except Exception as e:
        print(f"  오류: {e}")

time.sleep(3)

# ─── 4. ALIO 공공기관 채용정보 ────────────────────────────────────────────────
print("\n" + "="*60)
print("[3] ALIO (opendata.alio.go.kr) 구조 탐색")

alio_endpoints = [
    "https://opendata.alio.go.kr/recruit/list?pageNo=1&pageSet=20",
    "https://opendata.alio.go.kr/recruit/list",
    "https://opendata.alio.go.kr/new/odaRecruitList/list.do",
    "https://job.alio.go.kr/pchome.do",
]

for ep in alio_endpoints:
    try:
        r = requests.get(ep, headers=HEADERS, timeout=15)
        content_type = r.headers.get("Content-Type", "")
        print(f"\n  {ep}")
        print(f"  상태: {r.status_code} | Content-Type: {content_type[:50]}")

        if "json" in content_type or r.text.strip().startswith("{"):
            try:
                data = r.json()
                print(f"  JSON 키: {list(data.keys())[:10]}")
                # 공고 목록 찾기
                for k, v in data.items():
                    if isinstance(v, list) and len(v) > 0:
                        print(f"  배열 키 '{k}': {len(v)}건, 첫 항목 키: {list(v[0].keys())[:10]}")
            except Exception:
                print(f"  JSON 파싱 실패: {r.text[:200]}")
        else:
            soup = BeautifulSoup(r.text, "html.parser")
            print(f"  페이지 제목: {soup.title.text.strip() if soup.title else '없음'}")
            # 공고 목록 구조
            for sel in ["table tbody tr", "ul.list li", ".board_list tr", ".recruit_list li"]:
                items = soup.select(sel)
                if items and len(items) > 1:
                    print(f"  셀렉터 '{sel}' → {len(items)}개")
                    print(f"  첫 항목: {items[0].get_text(' ', strip=True)[:150]}")
                    break

        results[f"ALIO_{ep.split('/')[-1][:30]}"] = {"status": r.status_code, "preview": r.text[:1500]}
        time.sleep(2)

    except Exception as e:
        print(f"  오류: {e}")
        results[f"ALIO_{ep.split('/')[-1][:30]}"] = {"error": str(e)}

time.sleep(3)

# ALIO API POST 시도
print("\n[3b] ALIO API endpoint 탐색")
for post_url in [
    "https://opendata.alio.go.kr/recruit/selectList.do",
    "https://opendata.alio.go.kr/recruit/recruList.do",
    "https://job.alio.go.kr/recruit/list.do",
]:
    try:
        r = requests.post(
            post_url,
            data={"pageNo": "1", "pageSize": "10"},
            headers={**HEADERS, "X-Requested-With": "XMLHttpRequest"},
            timeout=10,
        )
        print(f"  {post_url.split('/')[-1]}: {r.status_code} | {r.text[:200]}")
        time.sleep(1)
    except Exception as e:
        print(f"  {post_url.split('/')[-1]} 오류: {e}")

time.sleep(3)

# ─── 5. 인천일자리포털 ─────────────────────────────────────────────────────────
print("\n" + "="*60)
print("[4] 인천일자리포털 공공일자리 탐색")

incheon_urls = [
    "https://www.incheon.go.kr/job/JOB010201",
    "https://www.incheon.go.kr/job/JOB010201?curPage=1",
]

for url in incheon_urls:
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        print(f"\n  {url}")
        print(f"  상태코드: {r.status_code}")
        soup = BeautifulSoup(r.text, "html.parser")
        print(f"  페이지 제목: {soup.title.text.strip() if soup.title else '없음'}")

        # 공고 목록 탐색
        selectors = [
            "table tbody tr",
            ".board_list tbody tr",
            ".brd_list tbody tr",
            "div.board-list li",
            "ul.list-type li",
            "#job_list tr",
        ]
        found = False
        for sel in selectors:
            items = soup.select(sel)
            if items and len(items) > 1:
                print(f"  셀렉터 '{sel}' → {len(items)}개")
                first = items[0]
                txt = first.get_text(' ', strip=True)
                print(f"  첫 항목: {txt[:200]}")
                links = first.find_all("a")
                for lnk in links[:2]:
                    print(f"    링크: {lnk.get('href','')[:80]} | {lnk.get_text(strip=True)[:40]}")
                found = True
                break

        if not found:
            print("  → 셀렉터 미발견. 주요 div/table:")
            for tag in soup.find_all(["table", "div"], limit=15):
                cls = " ".join(tag.get("class", []))
                id_ = tag.get("id", "")
                if cls or id_:
                    print(f"    <{tag.name} class='{cls}' id='{id_}'>")

        # 페이지네이션
        paging_els = soup.select("div.paging a, ul.pagination a, .pager a")
        if paging_els:
            print(f"  페이지네이션: {[a.get('href','')[:50] for a in paging_els[:5]]}")

        results[f"인천_{url[-15:]}"] = {"status": r.status_code, "html_preview": r.text[:3000]}

        time.sleep(2)
    except Exception as e:
        print(f"  오류: {e}")
        results[f"인천_{url[-15:]}"] = {"error": str(e)}

# ─── 6. 결과 저장 ─────────────────────────────────────────────────────────────
with open("probe_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\n" + "="*60)
print("탐색 완료. probe_results.json 저장됨")
print("="*60)
