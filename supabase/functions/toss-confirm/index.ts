// 토스페이먼츠 결제 승인 — 결제창에서 돌아온 paymentKey·orderId·amount 를 받아 토스에 승인 요청하고,
// 성공하면 주문을 '결제 완료'로 바꾸고 구매 기록(sheet_purchases)을 남긴다.
// 비회원 주문(user_id 없음, guest_email 있음 — db/sheet_guest_orders.sql)은 로그인 없이 승인하고,
// sheet_purchases 대신 결제 완료된 주문 자체로 내려받는다(Edge Function guest-order).
// 비밀 키는 Supabase Edge Function Secrets 의 TOSS_SECRET_KEY (test_sk_… 면 테스트 결제).
// 배포: verify_jwt=false (새 API 키 방식이라 함수 안에서 직접 로그인 확인)
import { createClient } from 'npm:@supabase/supabase-js@2';

const ADMIN_EMAIL = 'steveq2568@gmail.com';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // 붙여 넣을 때 딸려 온 공백·따옴표·이름표('TOSS_SECRET_KEY=' 등)는 떼고 키 모양 부분만 쓴다
  const rawSecret = Deno.env.get('TOSS_SECRET_KEY') ?? '';
  const found = rawSecret.match(/(test|live)_g?sk_[A-Za-z0-9_]+/) ?? rawSecret.match(/(test|live)_[a-z]+_[A-Za-z0-9_]+/);
  const secret = found ? found[0] : rawSecret.trim().replace(/^['"]+|['"]+$/g, '');
  if (!secret) return json({ error: 'not_configured' }, 500);
  const isTest = secret.startsWith('test_');
  // 키 종류만 (값은 절대 내보내지 않음): test_sk 가 맞고, test_gsk(결제위젯)·test_ck(클라이언트)면 잘못 넣은 것
  const keyKind = (secret.match(/^(test|live)_[a-z]+_/)?.[0].slice(0, -1) ?? 'unknown') + (secret.includes('_docs_') ? '(docs)' : '');

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  // 로그인 확인 (비회원 주문은 로그인 없이 온다)
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: userData } = token ? await db.auth.getUser(token).catch(() => ({ data: { user: null } })) : { data: { user: null } };
  const user = userData?.user ?? null;
  const isAdmin = (user?.email ?? '').toLowerCase() === ADMIN_EMAIL;

  let body: { paymentKey?: unknown; orderId?: unknown; amount?: unknown; check?: unknown };
  try { body = await req.json(); } catch { return json({ error: 'bad_request' }, 400); }

  // 키 점검 (운영 계정만) — 결제 없이 토스가 이 시크릿 키를 받아 주는지만 본다
  if (body.check === true) {
    if (!isAdmin) return json({ error: 'admin_only' }, 403);
    const r = await fetch('https://api.tosspayments.com/v1/payments/orders/ahnssam-key-check', {
      headers: { Authorization: 'Basic ' + btoa(secret + ':') },
    });
    const p = await r.json().catch(() => ({}));
    return json({
      key_kind: keyKind,
      had_extra_chars: rawSecret !== secret,
      length: secret.length,   // test_sk_… 는 40자 남짓 — 훨씬 길면 다른 글을 붙여 넣은 것
      key_ok: r.status !== 401 && p.code !== 'UNAUTHORIZED_KEY',
      toss_code: p.code ?? null,
    });
  }

  const paymentKey = typeof body.paymentKey === 'string' ? body.paymentKey : '';
  const orderId = typeof body.orderId === 'string' ? body.orderId : '';
  const amount = Number(body.amount);
  if (!paymentKey || !orderId || !Number.isFinite(amount)) return json({ error: 'bad_request' }, 400);

  const { data: order } = await db.from('sheet_orders').select('*').eq('order_id', orderId).maybeSingle();
  if (!order) return json({ error: 'order_not_found' }, 404);
  const guest = !order.user_id;
  if (!guest) {
    if (!user) return json({ error: 'auth_required' }, 401);
    if (order.user_id !== user.id) return json({ error: 'order_not_found' }, 404);
  }
  // 실제 키(live_)가 아닐 때는 운영 계정만 — 다른 사람이 테스트 카드로 PDF 를 받아 가지 못하게.
  // 비회원 주문은 운영 계정 이메일로 만든 시험 주문만 (비회원 구매 흐름 점검용)
  if (isTest && !(guest ? order.guest_email === ADMIN_EMAIL : isAdmin)) return json({ error: 'test_mode_admin_only' }, 403);
  const done = () => json({ ok: true, sheet_id: order.sheet_id, guest });
  // 새로고침 등으로 다시 들어와도 이미 끝난 결제면 그대로 성공
  if (order.status === 'paid') return done();
  if (order.status !== 'pending') return json({ error: 'order_closed', message: order.fail_message }, 409);

  const fail = async (code: string, message: string) => {
    await db.from('sheet_orders').update({ status: 'failed', fail_code: code, fail_message: message })
      .eq('order_id', orderId).eq('status', 'pending');
  };
  if (amount !== order.amount) {
    await fail('AMOUNT_MISMATCH', '결제 금액이 주문 금액과 달라요.');
    return json({ error: 'amount_mismatch' }, 400);
  }

  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(secret + ':'), 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount: order.amount }),
  });
  const pay = await res.json().catch(() => ({}));

  if (!res.ok || pay.status !== 'DONE') {
    // 동시에 두 번 승인된 경우(새로고침 겹침) 먼저 끝난 쪽이 이미 기록했으면 성공으로 본다
    const { data: again } = await db.from('sheet_orders').select('status, sheet_id').eq('order_id', orderId).single();
    if (again?.status === 'paid') return done();
    await fail(pay.code ?? 'CONFIRM_FAILED', pay.message ?? '결제 승인에 실패했어요.');
    return json({ error: 'confirm_failed', code: pay.code, message: pay.message }, 400);
  }

  const { error: upErr } = await db.from('sheet_orders').update({
    status: 'paid',
    is_test: isTest,
    payment_key: paymentKey,
    method: pay.method ?? null,
    approved_at: pay.approvedAt ?? new Date().toISOString(),
    receipt_url: pay.receipt?.url ?? null,
  }).eq('order_id', orderId);
  // 한 주문에 악보 여러 개(반주 + 기타솔로 등)면 sheet_ids 전부, 예전 주문은 sheet_id 하나. 비회원은 주문 자체가 기록
  const ids: string[] = Array.isArray(order.sheet_ids) && order.sheet_ids.length ? order.sheet_ids : [order.sheet_id];
  const { error: purErr } = guest ? { error: null } : await db.from('sheet_purchases')
    .upsert(ids.map((id) => ({ user_id: order.user_id, sheet_id: id, order_id: orderId })), { onConflict: 'user_id,sheet_id', ignoreDuplicates: true });
  if (upErr || purErr) {
    // 돈은 빠졌는데 기록이 안 된 경우 — 로그를 남기고 사용자에게 문의 안내
    console.error('record failed', orderId, upErr?.message, purErr?.message);
    return json({ error: 'record_failed', order_id: orderId }, 500);
  }
  return done();
});
