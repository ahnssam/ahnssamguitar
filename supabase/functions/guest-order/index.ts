// 비회원 주문 — 주문 보기 · PDF 내려받기 · 주문 내역 메일 다시 받기 (2026-11-11, db/sheet_guest_orders.sql)
// 로그인 없이 부른다(verify_jwt=false). ../_shared/guest-mail.ts 도 같이 올린다.
// 주문번호 + 다음 중 하나로 그 주문의 주인인지 확인한다:
//   key        주문을 만들 때 그 브라우저에 준 열쇠 (DB에는 sha256 만)
//   paymentKey 토스 결제창이 돌려준 결제 키 (결제한 사람만 안다 — 다른 브라우저로 돌아와도 받을 수 있게)
//   email      주문할 때 적은 이메일 (주문 조회)
// 결제 완료된 주문만. 내려받기는 1분짜리 서명 링크를 돌려준다.
// 다시 받기는 결제일로부터 1년까지 (2026-11-12, db/sheet_download_1y.sql 과 같은 규칙 — 기간은 _shared/guest-mail.ts 의 DOWNLOAD_YEARS).
//   { action: 'list', orderId, key|paymentKey|email }                → 주문과 악보 목록 (expires_at, expired)
//   { action: 'download', orderId, key|..., sheetId, full?, name? }  → { url } (기간이 지났으면 410 expired)
//   { action: 'resend', email }                                      → 그 이메일로 산, 아직 받을 수 있는 주문을 메일로 (db/sheet_guest_mail.sql)
//                                                                       주문이 있든 없든 늘 { ok: true } — 남의 이메일로 주문이 있는지 알아낼 수 없게
import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendGuestMail, downloadOpen, untilOf, type MailOrder } from '../_shared/guest-mail.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const sha256 = async (s: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))))
    .map((b) => b.toString(16).padStart(2, '0')).join('');
const str = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const RESEND_GAP_MS = 30 * 60 * 1000;   // 같은 이메일로 주문 내역 다시 보내기는 30분에 한 번

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'bad_request' }, 400); }
  const action = str(body.action, 20) || 'list';
  const orderId = str(body.orderId, 64);
  const key = str(body.key, 128);
  const paymentKey = str(body.paymentKey, 200);
  const email = str(body.email, 254).toLowerCase();

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  // ---------- 주문번호를 잊었을 때: 이메일로 주문 내역 보내기 ----------
  if (action === 'resend') {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'bad_email' }, 400);
    const { data: list } = await db.from('sheet_orders')
      .select('order_id, guest_email, amount, approved_at, created_at, is_test, receipt_url, sheet_id, sheet_ids, guest_mail_at')
      .eq('guest_email', email).is('user_id', null).eq('status', 'paid')
      .order('created_at', { ascending: false }).limit(30);
    const rows = list ?? [];
    const recent = rows.some((o) => o.guest_mail_at && Date.now() - Date.parse(o.guest_mail_at) < RESEND_GAP_MS);
    const live = rows.filter(downloadOpen).slice(0, 10) as MailOrder[];
    if (live.length && !recent) await sendGuestMail(db, live, 'lookup').catch((e) => console.error('resend mail', String(e)));
    return json({ ok: true });
  }

  if (!/^AS\d{12}-[0-9a-f]{12}$/.test(orderId) || !(key || paymentKey || email)) return json({ error: 'bad_request' }, 400);

  const { data: order } = await db.from('sheet_orders')
    .select('order_id, status, guest_email, guest_key_hash, payment_key, sheet_id, sheet_ids, amount, approved_at, created_at, is_test, receipt_url')
    .eq('order_id', orderId).is('user_id', null).maybeSingle();
  // 주문이 없거나 열쇠·이메일이 틀리면 똑같이 '못 찾음' (어느 쪽이 틀렸는지 알려 주지 않는다)
  const owner = !!order && (
    (key && order.guest_key_hash && (await sha256(key)) === order.guest_key_hash) ||
    (paymentKey && order.payment_key && paymentKey === order.payment_key) ||
    (email && order.guest_email === email)
  );
  if (!order || !owner) return json({ error: 'order_not_found' }, 404);
  if (order.status !== 'paid') return json({ error: 'not_paid', status: order.status }, 409);
  const open = downloadOpen(order);
  const expiresAt = untilOf(order).toISOString();

  const ids: string[] = Array.isArray(order.sheet_ids) && order.sheet_ids.length ? order.sheet_ids : [order.sheet_id];
  const { data: sheets } = await db.from('sheets')
    .select('id, title, artist, style, pages, preview_path, updated_at, song_key, bundle_pdf').in('id', ids);
  const rows = sheets ?? [];
  // 반주 + 기타솔로를 이 주문에서 함께 샀고 반주에 합본이 있으면 합본도 (db/sheet_bundle_full.sql 과 같은 규칙)
  const fullOf = (s: { id: string; song_key: string | null; bundle_pdf: boolean; style: string }) =>
    !!s.bundle_pdf && s.style !== 'solo' && !!s.song_key && rows.some((x) => x.id !== s.id && x.style === 'solo' && x.song_key === s.song_key);

  if (action === 'list') {
    return json({
      ok: true,
      order: {
        order_id: order.order_id, amount: order.amount, purchased_at: order.approved_at ?? order.created_at, is_test: order.is_test,
        receipt_url: order.receipt_url, expires_at: expiresAt, expired: !open,
      },
      items: rows.map((s) => ({
        sheet_id: s.id, title: s.title, artist: s.artist, style: s.style, pages: s.pages,
        preview_path: s.preview_path, updated_at: s.updated_at, bundle_pdf: fullOf(s),
      })),
    });
  }
  if (action === 'download') {
    const sheetId = str(body.sheetId, 40);
    const s = rows.find((x) => x.id === sheetId);
    const full = body.full === true;
    if (!s || (full && !fullOf(s))) return json({ error: 'order_not_found' }, 404);
    if (!open) return json({ error: 'expired', expires_at: expiresAt }, 410);
    // 파일 이름은 브라우저가 정해 보낸 것을 쓰되 위험한 글자는 뺀다
    const name = (str(body.name, 160).replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').trim() || 'sheet') .replace(/(\.pdf)?$/i, '.pdf');
    const { data, error } = await db.storage.from('sheet-pdfs').createSignedUrl(s.id + (full ? '-full' : '') + '.pdf', 60, { download: name });
    if (error || !data) return json({ error: 'file_missing' }, 500);
    return json({ ok: true, url: data.signedUrl });
  }
  return json({ error: 'bad_request' }, 400);
});
