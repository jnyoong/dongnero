"""
동네로 텔레그램 원격 제어 봇
- PC 백그라운드에서 실행
- 승인된 chat_id에서만 명령 수락
- Windows 레지스트리 Run 키로 PC 시작 시 자동 실행
"""

import os, json, re, time, subprocess, sys, requests, logging
from pathlib import Path
from datetime import datetime

# ── 경로 설정 ────────────────────────────────────────────────
BASE = Path(__file__).parent
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── .env.local 로드 ──────────────────────────────────────────
_env = BASE / ".env.local"
if _env.exists():
    for line in _env.read_text(encoding="utf-8").splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

logging.basicConfig(
    filename=str(BASE / "bot.log"),
    level=logging.WARNING,
    format="%(asctime)s %(levelname)s %(message)s",
    encoding="utf-8",
)

TOKEN   = os.environ.get("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

CRAWL_COOLDOWN = 1800  # 30분
_last_crawl_time = 0.0
_BOT_START = datetime.now()

SUPABASE_URL = "https://riomousxlyvwmembuhvc.supabase.co"
SUPABASE_KEY = "sb_publishable_EULGblJ83IkmxLh9VMXnxQ_lcMgnmAh"
ADMIN_PW     = "dongnero2024"

if not TOKEN or not CHAT_ID:
    print("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 없음 — .env.local 확인")
    sys.exit(1)

ALLOWED_CHAT = str(CHAT_ID)


# ── 데이터 로더 ──────────────────────────────────────────────
def _load_jobs() -> dict:
    """jobs_data.js(사이트 기준) 파싱, 실패 시 jobs.json 폴백"""
    js_file = BASE / "jobs_data.js"
    if js_file.exists():
        try:
            raw = js_file.read_text(encoding="utf-8")
            raw = re.sub(r"^/\*.*?\*/\s*", "", raw, flags=re.DOTALL)
            raw = re.sub(r"^var\s+JOBS_DATA\s*=\s*", "", raw.strip()).rstrip().rstrip(";")
            return json.loads(raw)
        except Exception:
            pass
    with open(BASE / "jobs.json", encoding="utf-8") as f:
        return json.load(f)


def _sb_get(path: str, params: dict = None) -> list:
    """Supabase REST GET"""
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/{path}",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
        params=params or {},
        timeout=10,
    )
    return r.json()


def _sb_rpc(fn: str, body: dict = None) -> object:
    """Supabase RPC POST"""
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/rpc/{fn}",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
        },
        json=body or {},
        timeout=10,
    )
    return r.json()


# ── 텔레그램 API ─────────────────────────────────────────────
def send(text: str, parse_mode="Markdown"):
    try:
        requests.post(
            f"https://api.telegram.org/bot{TOKEN}/sendMessage",
            json={"chat_id": CHAT_ID, "text": text, "parse_mode": parse_mode},
            timeout=10,
        )
    except Exception as e:
        print(f"send error: {e}")


def get_updates(offset=0):
    try:
        r = requests.get(
            f"https://api.telegram.org/bot{TOKEN}/getUpdates",
            params={"offset": offset, "timeout": 30},
            timeout=35,
        )
        return r.json().get("result", [])
    except Exception:
        return []


# ── 명령 처리 ────────────────────────────────────────────────
def cmd_status():
    """크롤링 현황 — 어드민 수준 상세"""
    try:
        data    = _load_jobs()
        updated = data.get("updated_at", "?")
        total   = data.get("total", 0)
        sc      = data.get("source_counts", {})
        cl      = data.get("crawl_log", {})
        prev    = data.get("prev_source_counts", {})
        dedup   = data.get("dedup_removed", {})

        src_sum    = sum(sc.values())
        cross_dedup = src_sum - total  # 출처간 중복 제거 수
        prev_total = sum(prev.values())
        diff  = total - prev_total
        sign  = "+" if diff >= 0 else ""
        pct   = f" ({sign}{diff/prev_total*100:.1f}%)" if prev_total else ""

        lines = [
            f"📊 *동네로 크롤링 현황*",
            f"🕐 {updated[:16]}",
            f"최종 *{total:,}건* {sign}{diff:,}{pct}",
            f"(출처합계 {src_sum:,} - 중복제거 {cross_dedup:,})",
            "",
            "*출처별:*",
        ]

        anomaly_srcs = []
        for src, cnt in sc.items():
            p   = prev.get(src, 0)
            d   = cnt - p
            dd  = dedup.get(src, 0)
            log = cl.get(src, {})

            # 상태 플래그
            if log.get("errors"):
                flag = "🚨"
                anomaly_srcs.append(src)
            elif log.get("timeout"):
                flag = "⏱"
                anomaly_srcs.append(src)
            elif log.get("early_stop"):
                flag = "⚠️"
                anomaly_srcs.append(src)
            elif log.get("is_anomaly"):
                flag = "📉"
                anomaly_srcs.append(src)
            else:
                flag = "✓"

            diff_str = f"({'+' if d >= 0 else ''}{d:,})" if p else "(첫수집)"
            dd_str   = f" │중복-{dd:,}" if dd else ""
            lines.append(f"{flag} {src}: *{cnt:,}* {diff_str}{dd_str}")

        lines.append("")
        if anomaly_srcs:
            lines.append(f"⚠️ 이상감지: {', '.join(anomaly_srcs)}")
        else:
            lines.append("✅ 전 출처 정상")

        send("\n".join(lines))
    except Exception as e:
        send(f"❌ 상태 조회 실패: {e}")


def cmd_subs():
    """구직카드 현황"""
    try:
        from datetime import timezone, timedelta
        KST = timezone(timedelta(hours=9))

        def _kst_date(ts: str) -> str:
            try:
                from datetime import datetime
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                return dt.astimezone(KST).strftime("%Y-%m-%d")
            except Exception:
                return ts[:10]

        rows = _sb_rpc("admin_get_seeker_cards", {"p_pw": ADMIN_PW})
        if not isinstance(rows, list):
            raise ValueError(f"응답 오류: {rows}")

        # 어드민과 동일 중복제거: 이름+전화(contact_phone) 기준
        seen, deduped = set(), []
        for x in rows:
            key = (x.get("name", ""), x.get("contact_phone", ""))
            if key not in seen:
                seen.add(key)
                deduped.append(x)

        total = len(deduped)
        lv1 = sum(1 for x in deduped if (x.get("alert_level") or 2) == 1)
        lv2 = sum(1 for x in deduped if (x.get("alert_level") or 2) == 2)
        lv3 = sum(1 for x in deduped if (x.get("alert_level") or 2) == 3)

        today_kst = datetime.now(KST).strftime("%Y-%m-%d")
        today_cnt = sum(1 for x in deduped if _kst_date(x.get("created_at", "")) == today_kst)

        send(
            f"👥 *구직카드 현황* (중복제외 기준)\n"
            f"전체: *{total}명*\n"
            f"오늘({today_kst[5:]}): *{today_cnt}명* 신규\n\n"
            f"👀 정보보기(lv1): {lv1}명\n"
            f"🔔 알림받기(lv2): {lv2}명\n"
            f"💼 적극구직(lv3): *{lv3}명* ← 알림톡 발송 대상"
        )
    except Exception as e:
        send(f"❌ 구직카드 조회 실패: {e}")


def cmd_today():
    """오늘 크롤링 완료 여부 — jobs_data.js 기준"""
    try:
        data    = _load_jobs()
        updated = data.get("updated_at", "")   # "2026-05-18 21:23:33 KST"
        updated_date = updated[:10]            # "2026-05-18"
        today   = datetime.now().strftime("%Y-%m-%d")

        if updated_date == today:
            icon = "✅"
            label = "오늘 크롤링 완료"
        else:
            icon = "⏳"
            label = "오늘 크롤링 미완료 (08:30 자동 예정)"

        send(
            f"{icon} *{label}*\n"
            f"마지막 크롤링: {updated[:16]}\n"
            f"수집 공고: {data.get('total',0):,}건"
        )
    except Exception as e:
        send(f"❌ {e}")


def cmd_clicks():
    """공고 클릭 통계 (오늘 KST + 어제)"""
    try:
        from datetime import timezone, timedelta
        KST = timezone(timedelta(hours=9))
        now_kst       = datetime.now(KST)
        today_str     = now_kst.strftime("%Y-%m-%d")
        # KST 오늘 00:00 → UTC 변환 (KST = UTC+9)
        today_utc_str = now_kst.replace(hour=0, minute=0, second=0, microsecond=0) \
                            .astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
        # 어제 KST 00:00 UTC
        yest_utc_str  = (now_kst.replace(hour=0, minute=0, second=0, microsecond=0)
                         - timedelta(days=1)).astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

        rows = _sb_get(
            "job_clicks",
            {"select": "source,clicked_at", "clicked_at": f"gte.{yest_utc_str}",
             "order": "clicked_at.desc", "limit": "5000"},
        )
        if not isinstance(rows, list):
            raise ValueError(str(rows))

        today_rows = [x for x in rows if x["clicked_at"] >= today_utc_str]
        yest_rows  = [x for x in rows if x["clicked_at"] < today_utc_str]

        def src_summary(lst):
            by_src: dict = {}
            for x in lst:
                s = x.get("source", "기타")
                by_src[s] = by_src.get(s, 0) + 1
            return sorted(by_src.items(), key=lambda x: -x[1])[:5]

        top_today = src_summary(today_rows)
        top_yest  = src_summary(yest_rows)

        lines = [f"📈 *공고 클릭 현황*"]
        lines.append(f"\n오늘({today_str}): *{len(today_rows)}회*")
        if top_today:
            lines += [f"  • {s}: {c}" for s, c in top_today]
        else:
            lines.append("  (아직 클릭 없음)")

        yest_str = (now_kst - timedelta(days=1)).strftime("%Y-%m-%d")
        lines.append(f"\n어제({yest_str}): *{len(yest_rows)}회*")
        if top_yest:
            lines += [f"  • {s}: {c}" for s, c in top_yest]

        send("\n".join(lines))
    except Exception as e:
        send(f"❌ 클릭 통계 실패: {e}")


def cmd_uptime():
    """봇 가동시간"""
    elapsed = datetime.now() - _BOT_START
    total_m = int(elapsed.total_seconds()) // 60
    d, rem  = divmod(total_m, 1440)
    h, m    = divmod(rem, 60)
    parts   = []
    if d: parts.append(f"{d}일")
    if h: parts.append(f"{h}시간")
    parts.append(f"{m}분")
    send(
        f"🤖 *봇 가동 현황*\n"
        f"시작: {_BOT_START:%Y-%m-%d %H:%M}\n"
        f"경과: {' '.join(parts)}"
    )


def cmd_log():
    """최근 크롤 로그"""
    log_file = BASE / "crawl_log.txt"
    if not log_file.exists():
        send("📋 로그 파일 없음 (다음 크롤링 후 생성)")
        return
    lines  = log_file.read_text(encoding="utf-8", errors="replace").strip().splitlines()
    recent = lines[-20:] if len(lines) > 20 else lines
    send("📋 *최근 크롤 로그*\n```\n" + "\n".join(recent) + "\n```")


def cmd_error():
    """봇 Python 에러 로그 (bot.log) — 봇 프로세스 예외만 기록됨
    크롤링 에러는 /log 로 확인"""
    log_file = BASE / "bot.log"
    if not log_file.exists():
        send("✅ 봇 에러 없음 (bot.log 없음)")
        return
    lines  = log_file.read_text(encoding="utf-8", errors="replace").strip().splitlines()
    recent = [l for l in lines if l.strip()][-10:]
    if not recent:
        send("✅ 봇 에러 기록 없음")
    else:
        send("🔴 *봇 Python 에러* (bot.log)\n크롤링 에러는 /log 확인\n```\n" + "\n".join(recent) + "\n```")


def cmd_crawl():
    """크롤링 즉시 실행 (30분 쿨다운)"""
    global _last_crawl_time
    elapsed = time.time() - _last_crawl_time
    if elapsed < CRAWL_COOLDOWN:
        remaining = int((CRAWL_COOLDOWN - elapsed) / 60)
        send(f"⏳ {remaining}분 후 실행 가능 (30분 쿨다운)")
        return
    _last_crawl_time = time.time()
    send("🚀 크롤링 시작... (15~25분 소요)\n완료 후 결과 알려드립니다")
    ps1 = BASE / "crawl_local.ps1"
    try:
        subprocess.Popen(
            ["powershell.exe", "-WindowStyle", "Hidden",
             "-ExecutionPolicy", "Bypass", "-File", str(ps1)],
            cwd=str(BASE),
        )
    except Exception as e:
        send(f"❌ 크롤링 실행 실패: {e}")


def cmd_help():
    send(
        "🤖 *동네로 봇 명령어*\n\n"
        "*현황*\n"
        "/status — 크롤링 상세 현황 (어드민 수준)\n"
        "/today  — 오늘 크롤링 완료 여부\n"
        "/subs   — 구직카드 가입자 현황\n"
        "/clicks — 오늘 공고 클릭 통계\n\n"
        "*로그*\n"
        "/log    — 최근 크롤 로그\n"
        "/error  — 최근 봇 에러\n"
        "/uptime — 봇 가동시간\n\n"
        "*운영*\n"
        "/crawl  — 크롤링 즉시 실행\n"
        "/help   — 명령어 목록"
    )


COMMANDS = {
    "/status":  cmd_status,
    "/today":   cmd_today,
    "/subs":    cmd_subs,
    "/clicks":  cmd_clicks,
    "/log":     cmd_log,
    "/error":   cmd_error,
    "/uptime":  cmd_uptime,
    "/crawl":   cmd_crawl,
    "/help":    cmd_help,
    "/start":   cmd_help,
}



# ── 메인 루프 ────────────────────────────────────────────────
def main():
    print(f"[{datetime.now():%H:%M:%S}] 동네로 봇 시작")
    send("🟢 *동네로 봇 시작됨*\n/help 로 명령어 확인")
    offset  = 0
    backoff = 1
    while True:
        try:
            updates = get_updates(offset)
            backoff = 1
            for upd in updates:
                offset  = upd["update_id"] + 1
                msg     = upd.get("message", {})
                chat_id = str(msg.get("chat", {}).get("id", ""))
                text    = msg.get("text", "").strip()

                if chat_id != ALLOWED_CHAT:
                    continue

                cmd = text.split()[0].lower() if text else ""
                print(f"[{datetime.now():%H:%M:%S}] 명령: {text}")

                fn = COMMANDS.get(cmd)
                if fn:
                    fn()
                elif text:
                    send("모르는 명령어예요. /help 로 확인해주세요.")

            time.sleep(1)

        except Exception as e:
            logging.error(f"main loop error: {e}", exc_info=True)
            print(f"[{datetime.now():%H:%M:%S}] 루프 오류: {e} — {backoff}초 후 재시도")
            time.sleep(backoff)
            backoff = min(backoff * 2, 60)


if __name__ == "__main__":
    main()
