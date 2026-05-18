"""
동네로 텔레그램 원격 제어 봇
- PC 백그라운드에서 실행
- 승인된 chat_id에서만 명령 수락
- Windows 작업 스케줄러로 PC 시작 시 자동 실행
"""

import os, json, time, subprocess, sys, requests, logging
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
SUPABASE_URL = "https://riomousxlyvwmembuhvc.supabase.co"
SUPABASE_KEY = "sb_publishable_EULGblJ83IkmxLh9VMXnxQ_lcMgnmAh"

if not TOKEN or not CHAT_ID:
    print("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 없음 — .env.local 확인")
    sys.exit(1)

ALLOWED_CHAT = str(CHAT_ID)


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
    """마지막 크롤링 상태"""
    try:
        with open(BASE / "jobs.json", encoding="utf-8") as f:
            data = json.load(f)
        updated = data.get("updated_at", "알 수 없음")
        total   = data.get("total", 0)
        sc      = data.get("source_counts", {})
        cl      = data.get("crawl_log", {})
        prev    = data.get("prev_source_counts", {})

        prev_total = sum(prev.values())
        diff = total - prev_total
        sign = "+" if diff >= 0 else ""

        lines = [
            f"📊 *동네로 현황*",
            f"🕐 {updated}",
            f"총 공고: *{total:,}건* ({sign}{diff}건)",
            "",
            "*출처별:*",
        ]
        for src, cnt in sc.items():
            p = prev.get(src, 0)
            log = cl.get(src, {})
            icon = "🚨" if log.get("errors") else ("⚠️" if log.get("early_stop") else "•")
            d = f" ({'+' if cnt-p>=0 else ''}{cnt-p})" if p else ""
            lines.append(f"{icon} {src}: {cnt:,}건{d}")

        anomalies = [s for s, l in cl.items() if l.get("errors") or l.get("early_stop") or l.get("is_anomaly")]
        if anomalies:
            lines.append(f"\n⚠️ 이상: {', '.join(anomalies)}")
        else:
            lines.append("\n✅ 이상 없음")

        send("\n".join(lines))
    except Exception as e:
        send(f"❌ 상태 조회 실패: {e}")


def cmd_log():
    """최근 크롤 로그"""
    log_file = BASE / "crawl_log.txt"
    if not log_file.exists():
        send("📋 로그 파일 없음 (다음 크롤링 후 생성됩니다)")
        return
    lines = log_file.read_text(encoding="utf-8", errors="replace").strip().splitlines()
    recent = lines[-20:] if len(lines) > 20 else lines
    send("📋 *최근 크롤 로그*\n```\n" + "\n".join(recent) + "\n```")


def cmd_subs():
    """알림 신청자 현황"""
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/seeker_cards",
            headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
            params={"select": "alert_level", "limit": "1000"},
            timeout=10,
        )
        rows = r.json()
        if not isinstance(rows, list):
            raise ValueError(f"Supabase 오류: {rows}")
        total = len(rows)
        lv0 = sum(1 for x in rows if x.get("alert_level", 0) == 0)
        lv1 = sum(1 for x in rows if x.get("alert_level", 0) == 1)
        lv2 = sum(1 for x in rows if (x.get("alert_level", 0) or 0) >= 2)
        send(
            f"👥 *구직카드 현황*\n"
            f"전체: {total}명\n"
            f"• 정보보기(lv0): {lv0}명\n"
            f"• 알림받기(lv1): {lv1}명\n"
            f"• 적극구직(lv2+): {lv2}명 ← 알림톡 발송 대상"
        )
    except Exception as e:
        send(f"❌ 구독자 조회 실패: {e}")


def cmd_jobs():
    """현재 총 공고 건수"""
    try:
        with open(BASE / "jobs.json", encoding="utf-8") as f:
            data = json.load(f)
        total   = data.get("total", 0)
        updated = data.get("updated_at", "-")
        sc      = data.get("source_counts", {})
        top3    = sorted(sc.items(), key=lambda x: -x[1])[:3]
        top_str = " / ".join(f"{s}:{c:,}" for s, c in top3)
        send(f"💼 *공고 현황*\n총 {total:,}건 ({updated[:10]})\nTop3: {top_str}")
    except Exception as e:
        send(f"❌ 조회 실패: {e}")


def cmd_crawl():
    """크롤링 즉시 실행 (30분 쿨다운)"""
    global _last_crawl_time
    elapsed = time.time() - _last_crawl_time
    if elapsed < CRAWL_COOLDOWN:
        remaining = int((CRAWL_COOLDOWN - elapsed) / 60)
        send(f"⏳ 마지막 크롤링에서 {remaining}분 더 기다려야 해요.\n(연속 실행 방지 — 30분 쿨다운)")
        return
    _last_crawl_time = time.time()
    send("🚀 크롤링 시작합니다... (15~25분 소요)\n완료되면 결과 알려드릴게요")
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
        "/status — 마지막 크롤링 상태·이상 감지\n"
        "/jobs   — 현재 총 공고 건수\n"
        "/subs   — 구직카드 구독자 현황\n"
        "/log    — 최근 크롤 로그\n"
        "/crawl  — 크롤링 즉시 실행\n"
        "/help   — 명령어 목록"
    )


COMMANDS = {
    "/status": cmd_status,
    "/jobs":   cmd_jobs,
    "/subs":   cmd_subs,
    "/log":    cmd_log,
    "/crawl":  cmd_crawl,
    "/help":   cmd_help,
    "/start":  cmd_help,
}


# ── 메인 루프 ────────────────────────────────────────────────
def main():
    print(f"[{datetime.now():%H:%M:%S}] 동네로 봇 시작")
    send("🟢 *동네로 봇 시작됨*\n/help 로 명령어 확인")
    offset = 0
    backoff = 1
    while True:
        try:
            updates = get_updates(offset)
            backoff = 1  # 성공 시 백오프 초기화
            for upd in updates:
                offset = upd["update_id"] + 1
                msg = upd.get("message", {})
                chat_id = str(msg.get("chat", {}).get("id", ""))
                text = msg.get("text", "").strip()

                if chat_id != ALLOWED_CHAT:
                    continue  # 승인된 사용자만

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
            backoff = min(backoff * 2, 60)  # 최대 60초까지 지수 백오프


if __name__ == "__main__":
    main()
