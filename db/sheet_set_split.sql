-- 반주 + 기타솔로를 나눠 사도 묶음 할인 (2026-11-16 사용자 요청, CLAUDE.md 3절 '반주 + 기타솔로 묶음')
--   · 같은 곡(sheets.song_key)의 기타솔로만 먼저 샀다가 반주를 사면(거꾸로도) 남은 파트를 '정가 − 500원'에 판다.
--     예: 솔로 1,500원을 이미 샀으면 반주 2,500원 → 2,000원 (함께 산 3,500원과 같아짐). 반주를 먼저 샀으면 솔로 1,000원.
--   · 짝 파트 = 결제 완료 주문(테스트 결제는 빼고 — 운영 계정만 시험용으로 셈)으로 산 것 중 다시 받기 기간(구매일 + 1년) 안.
--   · 이미 반주와 솔로를 둘 다 가졌으면 할인 없음(한 쌍에 500원 한 번). 한 주문에 반주·솔로가 다 있으면 예전처럼 그 주문에서 500원.
--   · 할인 뒤 값이 100원 아래가 되면 할인하지 않는다(토스 최소 금액).
--   · 회원만. 비회원(create_guest_sheet_order)은 그대로 정가.
--   · 반주 = 기타솔로가 아닌 같은 곡 악보(통기타·일렉기타 등) — 함께 살 때의 500원 규칙(sheet_order_quote)과 같다.
--   · 화면(tab-detail.html)은 my_sheet_set_owned() 로 '이미 산 쪽'을 받아 같은 값을 보여 준다.
--   · 음저협 정산(sheet_sales_report)은 주문 금액(손님이 낸 값)을 그대로 세므로 이 주문은 2,000원으로 잡힌다.

-- 이 사람이 이 곡에서 이미 가진 쪽: 'solo' | 'main' | null(없거나 둘 다)
create or replace function public.sheet_set_owned(p_uid uuid, p_song_key uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
    with own as (
        select coalesce(bool_or(s.style = 'solo'), false) as o_solo,
               coalesce(bool_or(s.style <> 'solo'), false) as o_main
        from public.sheet_purchases p
        join public.sheet_orders o on o.order_id = p.order_id and o.status = 'paid'
                                  and (not o.is_test or public.is_site_admin())
        join public.sheets s on s.id = p.sheet_id
        where p_uid is not null and p_song_key is not null
          and p.user_id = p_uid and s.song_key = p_song_key
          and public.sheet_download_open(p.created_at)
    )
    select case when o_solo and not o_main then 'solo' when o_main and not o_solo then 'main' end from own
$$;
revoke all on function public.sheet_set_owned(uuid, uuid) from public, anon, authenticated;

-- 이 주문(악보 목록)에 더 깎아 줄 금액: 500 또는 0
create or replace function public.sheet_set_credit(p_uid uuid, p_sheet_ids uuid[])
returns integer
language sql
stable
security definer
set search_path = ''
as $$
    with k as (
        select count(distinct s.song_key) as nk, bool_or(s.song_key is null) as nokey,
               min(s.song_key::text)::uuid as song_key,
               bool_or(s.style = 'solo') as has_solo, bool_or(s.style <> 'solo') as has_main, sum(s.price) as tot
        from public.sheets s where s.id = any (p_sheet_ids)
    )
    select case
        when p_uid is null or k.nk <> 1 or k.nokey or (k.has_solo and k.has_main) or k.tot - 500 < 100 then 0
        when k.has_main and public.sheet_set_owned(p_uid, k.song_key) = 'solo' then 500
        when k.has_solo and public.sheet_set_owned(p_uid, k.song_key) = 'main' then 500
        else 0 end
    from k
$$;
revoke all on function public.sheet_set_credit(uuid, uuid[]) from public, anon, authenticated;

-- 화면용: 로그인한 사람이 이 악보의 곡에서 이미 가진 쪽
create or replace function public.my_sheet_set_owned(p_sheet uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
    select public.sheet_set_owned(auth.uid(), (select s.song_key from public.sheets s where s.id = p_sheet))
$$;
revoke all on function public.my_sheet_set_owned(uuid) from public, anon;
grant execute on function public.my_sheet_set_owned(uuid) to authenticated;

-- 회원 주문: db/sheet_download_1y.sql 과 같고, 나눠 산 묶음 할인만 더함
create or replace function public.create_sheet_order(p_sheet_ids uuid[])
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  q record;
  v_amount integer;
  v_order_id text;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  select * into q from public.sheet_order_quote(p_sheet_ids);
  if exists (select 1 from public.sheet_purchases p
             where p.user_id = v_uid and p.sheet_id = any (q.o_ids) and public.sheet_download_open(p.created_at)) then
    raise exception 'already_purchased';
  end if;
  v_amount := q.o_amount - public.sheet_set_credit(v_uid, q.o_ids);
  v_order_id := public.new_sheet_order_id();
  insert into public.sheet_orders (order_id, user_id, sheet_id, sheet_ids, order_name, amount)
  values (v_order_id, v_uid, q.o_first, q.o_ids, q.o_name, v_amount);
  return json_build_object('order_id', v_order_id, 'amount', v_amount, 'order_name', q.o_name);
end;
$$;
revoke all on function public.create_sheet_order(uuid[]) from public, anon;
grant execute on function public.create_sheet_order(uuid[]) to authenticated;
