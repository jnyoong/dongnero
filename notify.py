"""
동네로 일자리 알림 발송기
- 오늘 신규 공고 감지 (jobs.json vs seen_jobs Supabase 테이블 비교)
- 활성 구독자(seeker_cards)와 지역/직종 매칭
- Solapi 카카오 알림톡 발송
- 하루 최대 1회, 신규 3건 미만이면 미발송
"""

import json, os, sys, hashlib, hmac, time, base64
from datetime import date, datetime, timezone
import requests

# ── 환경변수 ─────────────────────────────────────────────
SOLAPI_API_KEY    = os.environ["SOLAPI_API_KEY"]
SOLAPI_API_SECRET = os.environ["SOLAPI_API_SECRET"]
SUPABASE_URL      = os.environ["SUPABASE_URL"]
SUPABASE_KEY      = os.environ["SUPABASE_KEY"]   # service_role key
OPERATOR_PHONE    = os.environ.get("OPERATOR_PHONE", "")

# Solapi 알림톡 설정 — 템플릿 등록 후 채워주세요
KAKAO_PFID           = os.environ.get("KAKAO_PFID", "")          # KA01PF...
TEMPLATE_ID_WITH_JOB = os.environ.get("KAKAO_TMPL_WITH_JOB", "") # 직종 있는 템플릿
TEMPLATE_ID_NO_JOB   = os.environ.get("KAKAO_TMPL_NO_JOB", "")   # 직종 없는 템플릿
SENDER_NUMBER        = os.environ.get("SENDER_NUMBER", "")        # 발신 등록 번호

MIN_NEW_JOBS = 3   # 신규 공고 이 건수 미만이면 발송 안 함
TODAY = date.today().isoformat()

# ── 직종 키워드 매핑 ──────────────────────────────────────
JOB_KEYWORDS = {
    "요양·돌봄":  ["요양", "돌봄", "보호사", "케어", "방문요양", "재가", "요양원"],
    "경비·보안":  ["경비", "보안", "시설경비", "아파트경비", "방범"],
    "청소·미화":  ["청소", "미화", "환경미화", "청소부", "청소용역"],
    "조리·급식":  ["조리", "급식", "주방", "조리원", "주방보조", "쿠킹", "요리"],
    "복지·상담":  ["복지", "상담", "사회복지", "케어매니저", "복지관"],
    "사무·행정":  ["사무", "행정", "총무", "경리", "사무보조", "사무원", "서무"],
    "농업·생산":  ["농업", "생산", "제조", "농장", "작업", "공장", "포장"],
    "교육·지도":  ["교육", "강사", "지도", "튜터", "교사", "선생", "학원"],
    "판매·영업":  ["판매", "영업", "판촉", "매장", "점원", "판매원", "캐셔"],
    "시설·건설":  ["시설", "건설", "유지보수", "전기", "배관", "설비", "기술"],
    "의료·보건":  ["의료", "보건", "간호", "병원", "약", "간병", "의원"],
}


# ── Supabase 헬퍼 ─────────────────────────────────────────
def sb_headers():
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

def sb_get(path, params=None):
    r = requests.get(f"{SUPABASE_URL}/rest/v1/{path}", headers=sb_headers(), params=params)
    r.raise_for_status()
    return r.json()

def sb_post(path, body):
    r = requests.post(f"{SUPABASE_URL}/rest/v1/{path}", headers=sb_headers(), json=body)
    r.raise_for_status()

def sb_upsert(path, body):
    h = {**sb_headers(), "Prefer": "resolution=ignore-duplicates,return=minimal"}
    r = requests.post(f"{SUPABASE_URL}/rest/v1/{path}", headers=h, json=body)
    r.raise_for_status()


# ── 신규 공고 감지 ────────────────────────────────────────
def load_jobs():
    with open("jobs.json", encoding="utf-8") as f:
        data = json.load(f)
    jobs = data["jobs"] if isinstance(data, dict) else data
    return [j for j in jobs if j.get("apply_link")]

def get_seen_links():
    """Supabase seen_jobs 테이블에서 기존 링크 집합 반환"""
    rows = sb_get("seen_jobs", {"select": "apply_link"})
    return {r["apply_link"] for r in rows}

def save_new_jobs(new_jobs):
    """신규 공고를 seen_jobs에 저장"""
    if not new_jobs:
        return
    rows = [{
        "apply_link": j["apply_link"],
        "title":      (j.get("title") or "")[:200],
        "location":   j.get("location") or "",
        "source":     j.get("source") or "",
        "first_seen": TODAY,
    } for j in new_jobs]
    # 1000건씩 나눠서 INSERT
    for i in range(0, len(rows), 1000):
        sb_upsert("seen_jobs", rows[i:i+1000])


# ── 매칭 로직 ─────────────────────────────────────────────
def normalize_phone(phone):
    return phone.replace("-", "").replace(" ", "") if phone else ""

def match_location(job_location, sido, gu):
    """구독자 지역(sido, gu)이 공고 location 텍스트에 포함되면 매칭"""
    if not job_location:
        return False
    loc = job_location.replace("특별시", "").replace("광역시", "").replace("특별자치시", "")
    if sido and sido not in loc:
        return False
    if gu and gu not in loc:
        return False
    return True

def match_job_type(title, desired_job_str):
    """desired_job 쉼표 구분 목록 중 하나라도 제목에 키워드 포함되면 매칭"""
    if not desired_job_str:
        return True  # 직종 미지정이면 무조건 매칭
    title_lower = title.lower()
    for job_tag in desired_job_str.split(","):
        job_tag = job_tag.strip()
        keywords = JOB_KEYWORDS.get(job_tag, [job_tag])
        if any(kw in title_lower for kw in keywords):
            return True
    return False

def find_new_matching_jobs(new_jobs, subscriber):
    sido = (subscriber.get("location_sido") or "").strip()
    gu   = (subscriber.get("location_gu")   or "").strip()
    djob = subscriber.get("desired_job") or ""
    region_label = f"{sido} {gu}".strip() if gu else sido

    matched = [
        j for j in new_jobs
        if match_location(j.get("location", ""), sido, gu)
        and match_job_type(j.get("title", ""), djob)
    ]
    return matched, region_label


# ── 이미 오늘 발송했는지 확인 ─────────────────────────────
def already_sent_today(seeker_id):
    rows = sb_get("notify_sent_log", {
        "select": "id",
        "seeker_card_id": f"eq.{seeker_id}",
        "sent_date": f"eq.{TODAY}",
        "limit": "1",
    })
    return len(rows) > 0

def log_sent(seeker_id, count, region):
    sb_post("notify_sent_log", {
        "seeker_card_id": seeker_id,
        "sent_date": TODAY,
        "job_count": count,
        "region": region,
    })


# ── Solapi 알림톡 발송 ────────────────────────────────────
def _solapi_auth_header():
    dt = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    salt = base64.b64encode(os.urandom(16)).decode()
    sig  = hmac.new(
        SOLAPI_API_SECRET.encode(),
        f"{dt}{salt}".encode(),
        hashlib.sha256
    ).hexdigest()
    return f"HMAC-SHA256 apiKey={SOLAPI_API_KEY}, date={dt}, salt={salt}, signature={sig}"

def send_alimtalk(to_phone, template_id, variables: dict):
    """Solapi 알림톡 단건 발송"""
    payload = {
        "message": {
            "to": normalize_phone(to_phone),
            "from": normalize_phone(SENDER_NUMBER),
            "kakaoOptions": {
                "pfId": KAKAO_PFID,
                "templateId": template_id,
                "variables": variables,
            },
        }
    }
    r = requests.post(
        "https://api.solapi.com/messages/v4/send",
        json=payload,
        headers={
            "Authorization": _solapi_auth_header(),
            "Content-Type": "application/json",
        },
    )
    return r.status_code, r.text


# ── 메인 ─────────────────────────────────────────────────
def main():
    print(f"[notify] 시작 — {TODAY}")

    # 1. 오늘 jobs 로드 + 신규 감지
    all_jobs = load_jobs()
    print(f"[notify] 전체 공고: {len(all_jobs)}건")

    seen = get_seen_links()
    new_jobs = [j for j in all_jobs if j["apply_link"] not in seen]
    print(f"[notify] 신규 공고: {len(new_jobs)}건 (기존 {len(seen)}건 제외)")

    if not new_jobs:
        print("[notify] 신규 공고 없음 — 종료")
        return

    # 신규 공고 seen_jobs에 저장
    save_new_jobs(new_jobs)

    # 2. 활성 구독자 조회 (alert_level >= 2, 전화번호 있음)
    subscribers = sb_get("seeker_cards", {
        "select": "id,name,contact_phone,location_sido,location_gu,desired_job,alert_level",
        "alert_level": "gte.2",
        "contact_phone": "not.is.null",
    })
    print(f"[notify] 알림 대상 구독자: {len(subscribers)}명")

    sent_count = 0
    skip_count = 0

    for sub in subscribers:
        sub_id = sub["id"]

        # 오늘 이미 발송했으면 스킵
        if already_sent_today(sub_id):
            skip_count += 1
            continue

        matched, region_label = find_new_matching_jobs(new_jobs, sub)
        count = len(matched)

        if count < MIN_NEW_JOBS:
            continue  # 3건 미만 → 미발송

        name    = (sub.get("name") or "고객").strip()
        djob    = sub.get("desired_job") or ""
        phone   = sub.get("contact_phone")

        if djob and TEMPLATE_ID_WITH_JOB:
            tmpl_id = TEMPLATE_ID_WITH_JOB
            variables = {
                "#{name}":     name,
                "#{region}":   region_label or "전국",
                "#{job_type}": djob,
                "#{count}":    str(count),
            }
        elif TEMPLATE_ID_NO_JOB:
            tmpl_id = TEMPLATE_ID_NO_JOB
            variables = {
                "#{name}":   name,
                "#{region}": region_label or "전국",
                "#{count}":  str(count),
            }
        else:
            print(f"  [SKIP] 템플릿 ID 미설정 — {phone}")
            continue

        status, resp = send_alimtalk(phone, tmpl_id, variables)
        if status in (200, 201):
            log_sent(sub_id, count, region_label)
            sent_count += 1
            print(f"  [OK] {name} / {region_label} / {djob or '직종미지정'} / {count}건 → {phone}")
        else:
            print(f"  [ERR] {phone} → {status} {resp[:100]}")

        time.sleep(0.1)  # API 호출 간격

    print(f"\n[notify] 완료 — 발송 {sent_count}명 / 스킵(중복) {skip_count}명")

    # 운영자 요약 알림 (Solapi SMS 단문)
    if OPERATOR_PHONE and (sent_count > 0):
        msg = f"[동네로] 알림 발송 완료\n신규공고 {len(new_jobs)}건\n발송 {sent_count}명"
        requests.post(
            "https://api.solapi.com/messages/v4/send",
            json={"message": {"to": OPERATOR_PHONE, "from": normalize_phone(SENDER_NUMBER), "text": msg}},
            headers={"Authorization": _solapi_auth_header(), "Content-Type": "application/json"},
        )


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[notify] ERROR: {e}", file=sys.stderr)
        sys.exit(1)
