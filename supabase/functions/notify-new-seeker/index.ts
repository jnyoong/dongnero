// 신규 구직카드 등록 시 텔레그램 알림 발송
// Supabase Database Webhook → INSERT on seeker_cards → 이 함수 호출

const TELEGRAM_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const TELEGRAM_CHAT  = Deno.env.get("TELEGRAM_CHAT_ID")!;
const SB_URL         = Deno.env.get("SUPABASE_URL")!;
const SB_KEY         = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const LEVEL_LABEL: Record<number, string> = {
  1: "👀 정보보기",
  2: "🔔 알림받기",
  3: "💼 적극구직",
};

async function sendTelegram(text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text, parse_mode: "Markdown" }),
  });
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const rec = payload?.record;
    if (!rec) return new Response("no record", { status: 200 });

    const name  = rec.name  || "?";
    const phone = ((rec.contact_phone || rec.phone || "")).slice(-4);
    const lv    = rec.alert_level ?? 2;
    const lvLabel = LEVEL_LABEL[lv] ?? `lv${lv}`;

    // 중복 확인: 같은 이름+번호가 이미 있는지 체크
    let isDup = false;
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/seeker_cards?name=eq.${encodeURIComponent(name)}&contact_phone=eq.${encodeURIComponent(rec.contact_phone ?? rec.phone ?? "")}&id=neq.${rec.id}&select=id&limit=1`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      );
      const existing = await res.json();
      isDup = Array.isArray(existing) && existing.length > 0;
    } catch (_) { /* 중복 확인 실패는 무시 */ }

    const dupNote = isDup ? "\n⚠️ *중복 가능* (같은 이름·번호 기존 존재)" : "";
    const msg =
      `🔔 *신규 구직카드 등록!*\n` +
      `이름: ${name}\n` +
      `연락처: ****${phone}\n` +
      `단계: ${lvLabel}${dupNote}`;

    await sendTelegram(msg);
    return new Response("ok", { status: 200 });
  } catch (e) {
    // 오류여도 200 반환 (Supabase Webhook 재시도 방지)
    console.error("notify-new-seeker error:", e);
    return new Response("error", { status: 200 });
  }
});
