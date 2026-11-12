// 비회원 주문 메일 (2026-11-12, db/sheet_guest_mail.sql) — toss-confirm(결제 직후)·guest-order(주문 내역 다시 보내기)가 같이 쓴다.
// Resend API 로 보낸다. 키는 Edge Function Secrets 의 RESEND_API_KEY (사용자가 Resend 에서 만들어 넣음, 저장소엔 안 적음).
// 키가 없으면 보내지 않고 false 만 돌려준다(결제·내려받기는 메일과 상관없이 된다).
// 다시 받기 기한(1년)은 db/sheet_download_1y.sql · guest-order 와 같은 규칙.

// deno-lint-ignore no-explicit-any
type Db = any;
export type MailOrder = {
  order_id: string;
  guest_email: string;
  amount: number;
  approved_at: string | null;
  created_at: string;
  is_test: boolean;
  receipt_url: string | null;
  sheet_id: string;
  sheet_ids: string[] | null;
};

export const DOWNLOAD_YEARS = 1;
export const SITE = 'https://ahnssamguitar.com';
const FROM = '안쌤의 기타나무숲 <noreply@ahnssamguitar.com>';
const REPLY_TO = 'ahnssamguitar@gmail.com';
const PART: Record<string, string> = { acoustic: '통기타', electric: '일렉기타', solo: '기타솔로', fingerstyle: '핑거스타일', bass: '베이스', chord: '코드악보' };

export const boughtAt = (o: { approved_at: string | null; created_at: string }) => new Date(o.approved_at ?? o.created_at);
export const untilOf = (o: { approved_at: string | null; created_at: string }) => {
  const d = boughtAt(o);
  d.setUTCFullYear(d.getUTCFullYear() + DOWNLOAD_YEARS);
  return d;
};
export const downloadOpen = (o: { approved_at: string | null; created_at: string }) => Date.now() < untilOf(o).getTime();

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const won = (n: number) => Number(n || 0).toLocaleString('ko-KR') + '원';
// 한국 시간 날짜 "2026.11.12"
const day = (d: Date) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}.${p.month}.${p.day}`;
};
const ids = (o: MailOrder) => (Array.isArray(o.sheet_ids) && o.sheet_ids.length ? o.sheet_ids : [o.sheet_id]);

const FONT = "-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic','맑은 고딕','Noto Sans KR',sans-serif";

type Sheet = { id: string; title: string; artist: string | null; style: string; song_key: string | null; bundle_pdf: boolean };

// 주문 하나를 표로 — 주문번호, 산 악보, 금액, 결제일, 다시 받기 기한
function orderBlock(o: MailOrder, sheets: Sheet[]) {
  const mine = ids(o).map((id) => sheets.find((s) => s.id === id)).filter(Boolean) as Sheet[];
  const twin = mine.length > 1;
  const solo = mine.some((s) => s.style === 'solo');
  const lines = mine.map((s) => {
    const part = twin && s.style === 'electric' && solo ? '일렉기타 (반주만)' : PART[s.style] || '악보';
    return `${esc(s.title)} <span style="color:#7a7a7a;">· ${esc(part)}${s.artist ? ' · ' + esc(s.artist) : ''}</span>`;
  });
  // 반주 + 기타솔로를 함께 샀고 반주에 합본이 있으면 덤 (db/sheet_bundle_full.sql)
  if (mine.some((s) => s.bundle_pdf && s.style !== 'solo' && s.song_key && mine.some((x) => x.style === 'solo' && x.song_key === s.song_key))) {
    lines.push('<span style="color:#3a8a5c;">+ 반주 + 기타솔로 합본 PDF (함께 사서 받는 덤)</span>');
  }
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 0;width:92px;vertical-align:top;font-size:13px;color:#7a7a7a;">${k}</td><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#151515;">${v}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5fbf7;border:1px solid #dcefe3;border-radius:12px;margin:0 0 14px;">
    <tr><td style="padding:16px 18px;font-family:${FONT};">
      <div style="font-size:12px;color:#7a7a7a;">주문번호${o.is_test ? ' <b style="color:#b26a00;">(테스트 결제)</b>' : ''}</div>
      <div style="font-size:19px;font-weight:700;letter-spacing:.5px;color:#2a6b4a;margin:2px 0 10px;font-family:Menlo,Consolas,monospace;">${esc(o.order_id)}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${row('악보', lines.join('<br>'))}
        ${row('결제 금액', won(o.amount))}
        ${row('결제일', day(boughtAt(o)))}
        ${row('다시 받기', `<b>${day(untilOf(o))}까지</b> <span style="color:#7a7a7a;">(구매일로부터 1년)</span>`)}
        ${o.receipt_url ? row('영수증', `<a href="${esc(o.receipt_url)}" style="color:#3a8a5c;">카드 영수증 보기</a>`) : ''}
      </table>
    </td></tr></table>`;
}

function page(title: string, intro: string, body: string, button: { href: string; label: string }, after: string) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f5fbf7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5fbf7;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border:1px solid #e6ece8;border-radius:16px;">
    <tr><td align="center" style="padding:28px 24px 4px;">
      <a href="${SITE}" style="text-decoration:none;"><img src="${SITE}/images/email-logo.png" width="240" height="122" alt="안쌤의 기타나무숲" style="display:block;border:0;outline:none;width:240px;height:auto;"></a>
    </td></tr>
    <tr><td style="padding:12px 32px 0;font-family:${FONT};color:#151515;">
      <h1 style="margin:0 0 14px;font-size:20px;line-height:1.4;font-weight:700;color:#151515;">${esc(title)}</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#333333;">${intro}</p>
      ${body}
    </td></tr>
    <tr><td align="center" style="padding:8px 32px 22px;">
      <a href="${esc(button.href)}" style="display:inline-block;background:#2a6b4a;color:#ffffff;text-decoration:none;font-family:${FONT};font-weight:700;font-size:16px;line-height:1;padding:16px 34px;border-radius:10px;">${esc(button.label)}</a>
    </td></tr>
    <tr><td style="padding:0 32px 28px;font-family:${FONT};font-size:13px;line-height:1.7;color:#7a7a7a;">${after}</td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
    <tr><td style="padding:18px 12px 0;font-family:${FONT};font-size:11px;line-height:1.8;color:#9aa5a0;text-align:center;">
      이 메일은 안쌤의 기타나무숲(<a href="${SITE}" style="color:#9aa5a0;">ahnssamguitar.com</a>)에서 주문하신 분께 보내는 안내 메일이에요.<br>
      상호: 안쌤의기타나무숲 · 대표: 안규호 · 사업자등록번호: 453-22-00905 · 통신판매업 신고번호: 제2026-서울강남-06306호<br>
      고객센터: 0507-1334-9804 · 문의: <a href="mailto:${REPLY_TO}" style="color:#9aa5a0;">${REPLY_TO}</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

// kind: 'paid' = 결제 직후 주문 한 건 / 'lookup' = 그 이메일의 (아직 받을 수 있는) 주문 모아 보내기
export async function sendGuestMail(db: Db, orders: MailOrder[], kind: 'paid' | 'lookup'): Promise<boolean> {
  const key = (Deno.env.get('RESEND_API_KEY') ?? '').match(/re_[A-Za-z0-9_]+/)?.[0];
  if (!key) { console.warn('guest mail: RESEND_API_KEY 없음 — 메일을 보내지 않음'); return false; }
  if (!orders.length) return false;
  const to = orders[0].guest_email;
  const all = [...new Set(orders.flatMap(ids))];
  const { data } = await db.from('sheets').select('id, title, artist, style, song_key, bundle_pdf').in('id', all);
  const sheets: Sheet[] = data ?? [];

  const blocks = orders.map((o) => orderBlock(o, sheets)).join('');
  const first = orders[0];
  const test = orders.every((o) => o.is_test);
  const howAgain = `다른 기기나 브라우저에서 받을 때는 사이트의 <b>구매한 악보</b> 페이지 → <b>비회원 주문 조회</b>에 주문번호와 이 메일 주소(${esc(to)})를 적어 주세요.`;
  const notes = `<br><br>PDF는 개인 연습·학습용이에요. 다른 사람에게 나눠 주거나 올리지 말아 주세요.<br>내려받기에 문제가 있으면 이 메일에 답장하거나 <a href="mailto:${REPLY_TO}" style="color:#3a8a5c;">${REPLY_TO}</a> 으로 알려 주세요.`;

  let subject: string, html: string, text: string;
  if (kind === 'paid') {
    subject = `[안쌤의 기타나무숲] 주문이 완료됐어요 (주문번호 ${first.order_id})${test ? ' · 테스트 결제' : ''}`;
    html = page('주문이 완료됐어요',
      '안쌤의 기타나무숲에서 악보를 구매해 주셔서 고맙습니다.<br>아래 버튼을 누르면 PDF를 받을 수 있어요. 이 메일은 지워지지 않게 보관해 주세요.',
      blocks,
      { href: `${SITE}/purchases.html#guest=${encodeURIComponent(first.order_id)}`, label: 'PDF 받으러 가기' },
      howAgain + notes);
  } else {
    subject = `[안쌤의 기타나무숲] 비회원 주문 내역 (${orders.length}건)${test ? ' · 테스트 결제' : ''}`;
    html = page('비회원 주문 내역이에요',
      `요청하신 대로 이 메일 주소로 구매한 악보 중 <b>아직 다시 받을 수 있는 주문</b>을 모아 보내 드려요.`,
      blocks,
      { href: `${SITE}/purchases.html#guest=${encodeURIComponent(first.order_id)}`, label: '구매한 악보 페이지로' },
      howAgain + '<br><br>요청한 적이 없다면 이 메일은 무시하셔도 돼요.' + notes);
  }
  text = [
    kind === 'paid' ? '주문이 완료됐어요. 안쌤의 기타나무숲에서 악보를 구매해 주셔서 고맙습니다.' : '비회원 주문 내역이에요.',
    '',
    ...orders.map((o) => {
      const names = ids(o).map((id) => sheets.find((s) => s.id === id)).filter(Boolean)
        .map((s) => `${s!.title} (${PART[s!.style] || '악보'})`).join(', ');
      return `주문번호 ${o.order_id}${o.is_test ? ' (테스트 결제)' : ''}\n악보: ${names}\n결제 금액: ${won(o.amount)} · 결제일: ${day(boughtAt(o))}\n다시 받기: ${day(untilOf(o))}까지 (구매일로부터 1년)\n`;
    }),
    `PDF 받기: ${SITE}/purchases.html#guest=${first.order_id}`,
    `다른 기기에서는 '구매한 악보' 페이지의 '비회원 주문 조회'에 주문번호와 이 메일 주소(${to})를 적어 주세요.`,
    '',
    `문의: ${REPLY_TO} · 고객센터 0507-1334-9804`,
    '안쌤의기타나무숲 · 대표 안규호 · 사업자등록번호 453-22-00905',
  ].join('\n');

  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  // 결제 메일은 주문마다 한 번만 (승인 요청이 겹쳐도 Resend 가 같은 키는 한 번만 보냄)
  if (kind === 'paid') headers['Idempotency-Key'] = `paid-${first.order_id}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject, html, text }),
    signal: AbortSignal.timeout(8000),
  }).catch((e) => { console.error('guest mail: fetch', String(e)); return null; });
  if (!res || !res.ok) {
    console.error('guest mail: send failed', res?.status, res ? await res.text().catch(() => '') : '');
    return false;
  }
  await db.from('sheet_orders').update({ guest_mail_at: new Date().toISOString() }).in('order_id', orders.map((o) => o.order_id));
  return true;
}
