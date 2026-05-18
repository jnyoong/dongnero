const TELEGRAM_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT  = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
const SB_URL         = Deno.env.get("SUPABASE_URL") ?? "";
const SB_KEY         = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const LEVEL_LABEL: Record<number, string> = {
  1: "👀 정보보기",
  2: "🔔 알림받기",
  3: "💼 적극구직",
};

// HTML 특수문자 이스케이프 (Telegram HTML 모드용)
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendTelegram(text: string): Promise<void> {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) {
    throw new Error(`secrets missing: TOKEN=${!!TELEGRAM_TOKEN} CHAT=${!!TELEGRAM_CHAT}`);
  }
  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT,
        text,
        parse_mode: "HTML",   // Markdown 대신 HTML — 특수문자 영향 없음
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API ${res.status}: ${body}`);
  }
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const rec = payload?.record;
    if (!rec) return new Response("no record", { status: 200 });

    const name     = esc(rec.name || "?");
    const rawPhone = rec.contact_phone ?? rec.phone ?? "";
    const phone    = rawPhone.slice(-4);
    const lv       = rec.alert_level ?? 2;
    const lvLabel  = LEVEL_LABEL[lv] ?? `lv${lv}`;

    // 중복 확인
    let isDup = false;
    if (SB_URL && SB_KEY && rec.id) {
      try {
        const res = await fetch(
          `${SB_URL}/rest/v1/seeker_cards?name=eq.${encodeURIComponent(rec.name ?? "")}&contact_phone=eq.${encodeURIComponent(rawPhone)}&id=neq.${rec.id}&select=id&limit=1`,
          { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
        );
        const existing = await res.json();
        isDup = Array.isArray(existing) && existing.length > 0;
      } catch (_) { /* 무시 */ }
    }

    const dupNote = isDup ? "\n⚠️ <b>중복 가능</b> (같은 이름·번호 기존 존재)" : "";
    const msg =
      `🔔 <b>신규 구직카드 등록!</b>\n` +
      `이름: ${name}\n` +
      `연락처: ****${phone}\n` +
      `단계: ${lvLabel}${dupNote}`;

    await sendTelegram(msg);
    return new Response("ok", { status: 200 });

  } catch (e) {
    console.error("[notify-new-seeker] ERROR:", String(e));
    return new Response(`error: ${String(e)}`, { status: 200 });
  }
});
