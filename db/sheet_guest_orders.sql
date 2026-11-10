-- 비회원 구매 + 커버·편곡 판매 시작일 (2026-11-11 사용자 요청)
--
-- 비회원 구매
--   · 로그인 없이 이메일만 적고 산다. 주문(sheet_orders)에 user_id 대신 guest_email 과 guest_key_hash 를 남긴다.
--   · guest_key = 주문을 만들 때 브라우저에 한 번만 주는 긴 무작위 열쇠. DB에는 sha256 만 남긴다.
--   · 비회원은 sheet_purchases(회원 × 악보)에 안 들어간다. 결제 완료된 주문 자체가 내려받을 권리다.
--   · 내려받기·주문 조회는 Edge Function guest-order 가 한다 (주문번호 + [열쇠 | 결제 키 | 이메일] 확인 → 1분짜리 링크).
--   · 결제 승인은 toss-confirm 이 회원·비회원 주문을 다 받는다 (비회원 주문은 로그인 없이).
--
-- 커버·편곡 판매 시작일
--   · 음저협 이용허락 기간이 2026-12-01 부터라, 그 전에는 자작곡(kind = 'original')만 판다 (CLAUDE.md 6번).
--   · 운영 계정은 시험 결제를 위해 막지 않는다. 날짜가 바뀌면 cover_sales_open() 만 고친다.
--
-- 인기 악보(sheet_popularity)도 비회원 주문을 세도록 sheet_orders 에서 바로 센다.

-- ---------- 주문 표 ----------
alter table public.sheet_orders alter column user_id drop not null;
alter table public.sheet_orders add column if not exists guest_email text;
alter table public.sheet_orders add column if not exists guest_key_hash text;
alter table public.sheet_orders drop constraint if exists sheet_orders_owner;
alter table public.sheet_orders add constraint sheet_orders_owner
    check ((user_id is not null) <> (guest_email is not null));   -- 회원 주문이거나 비회원 주문이거나 둘 중 하나
create index if not exists sheet_orders_guest_email_idx on public.sheet_orders (guest_email, created_at desc) where guest_email is not null;

-- ---------- 커버·편곡 판매 시작 ----------
create or replace function public.cover_sales_open()
returns boolean
language sql
stable
set search_path = ''
as $$
    select now() >= timestamptz '2026-12-01 00:00:00+09'
$$;
grant execute on function public.cover_sales_open() to anon, authenticated;

-- ---------- 주문 견적 (회원·비회원 공통, 안에서만 부른다) ----------
-- 같은 곡의 악보 1~3개, 공개·PDF·가격 확인, 반주 + 기타솔로 함께 사면 500원 할인, 주문 이름
create or replace function public.sheet_order_quote(p_sheet_ids uuid[],
    out o_ids uuid[], out o_amount integer, out o_first uuid, out o_name text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  c_set_discount constant integer := 500;
  v_n integer;
  v_keys integer;
  v_nokey boolean;
  v_solo boolean;
  v_main boolean;
  v_title text;
  v_parts text;
begin
  select array_agg(distinct x) into o_ids from unnest(p_sheet_ids) x where x is not null;
  v_n := coalesce(array_length(o_ids, 1), 0);
  if v_n = 0 or v_n > 3 then raise exception 'sheet_not_found'; end if;

  if (select count(*) from public.sheets s where s.id = any (o_ids) and (s.published or public.is_site_admin())) <> v_n then
    raise exception 'sheet_not_found';
  end if;
  if (select count(*) from public.sheet_files f where f.sheet_id = any (o_ids)) <> v_n then raise exception 'sheet_no_pdf'; end if;
  if exists (select 1 from public.sheets s where s.id = any (o_ids) and s.price <= 0) then raise exception 'sheet_no_price'; end if;
  if v_n > 1 then
    select count(distinct s.song_key), bool_or(s.song_key is null) into v_keys, v_nokey from public.sheets s where s.id = any (o_ids);
    if v_keys <> 1 or v_nokey then raise exception 'not_same_song'; end if;
  end if;
  -- 음저협 이용허락 전에는 자작곡만
  if not public.cover_sales_open() and not public.is_site_admin()
     and exists (select 1 from public.sheets s where s.id = any (o_ids) and s.kind is distinct from 'original') then
    raise exception 'cover_not_yet';
  end if;

  select sum(s.price), bool_or(s.style = 'solo'), bool_or(s.style <> 'solo')
    into o_amount, v_solo, v_main
  from public.sheets s where s.id = any (o_ids);
  if v_solo and v_main then o_amount := o_amount - c_set_discount; end if;

  -- 대표 악보(반주 먼저)와 주문 이름: "그대에게 TAB악보 (일렉기타 + 기타솔로)", "그대에게 TAB악보 (기타솔로)"
  select s.id, s.title into o_first, v_title from public.sheets s where s.id = any (o_ids)
  order by (s.style = 'solo'), s.style limit 1;
  select string_agg(case s.style when 'acoustic' then '통기타' when 'electric' then '일렉기타' when 'solo' then '기타솔로'
                                 when 'fingerstyle' then '핑거스타일' when 'bass' then '베이스' when 'chord' then '코드악보' else '악보' end,
                    ' + ' order by (s.style = 'solo'), s.style)
    into v_parts from public.sheets s where s.id = any (o_ids);
  o_name := left(v_title, 60) || ' TAB악보' || case when v_n > 1 or v_solo then ' (' || v_parts || ')' else '' end;
end;
$$;
revoke all on function public.sheet_order_quote(uuid[]) from public, anon, authenticated;

create or replace function public.new_sheet_order_id()
returns text
language sql
volatile
set search_path = ''
as $$
    select 'AS' || to_char(now() at time zone 'Asia/Seoul', 'YYMMDDHH24MISS') || '-'
           || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)
$$;
revoke all on function public.new_sheet_order_id() from public, anon, authenticated;

-- ---------- 회원 주문 (예전과 같고 견적만 함께 쓴다) ----------
create or replace function public.create_sheet_order(p_sheet_ids uuid[])
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  q record;
  v_order_id text;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  select * into q from public.sheet_order_quote(p_sheet_ids);
  if exists (select 1 from public.sheet_purchases p where p.user_id = v_uid and p.sheet_id = any (q.o_ids)) then
    raise exception 'already_purchased';
  end if;
  v_order_id := public.new_sheet_order_id();
  insert into public.sheet_orders (order_id, user_id, sheet_id, sheet_ids, order_name, amount)
  values (v_order_id, v_uid, q.o_first, q.o_ids, q.o_name, q.o_amount);
  return json_build_object('order_id', v_order_id, 'amount', q.o_amount, 'order_name', q.o_name);
end;
$$;
revoke all on function public.create_sheet_order(uuid[]) from public, anon;
grant execute on function public.create_sheet_order(uuid[]) to authenticated;

-- ---------- 비회원 주문 ----------
-- 돌려주는 guest_key 는 이때 한 번뿐 (브라우저가 기억해 두고 내려받을 때 쓴다)
create or replace function public.create_guest_sheet_order(p_sheet_ids uuid[], p_email text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  q record;
  v_order_id text;
  v_key text;
begin
  if length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'bad_email'; end if;
  -- 장난으로 주문을 마구 만드는 것만 막는다 (같은 이메일 1시간 20건, 전체 1분 60건)
  if (select count(*) from public.sheet_orders o where o.guest_email = v_email and o.created_at > now() - interval '1 hour') >= 20
     or (select count(*) from public.sheet_orders o where o.guest_email is not null and o.created_at > now() - interval '1 minute') >= 60 then
    raise exception 'too_many';
  end if;
  select * into q from public.sheet_order_quote(p_sheet_ids);
  v_order_id := public.new_sheet_order_id();
  v_key := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  insert into public.sheet_orders (order_id, user_id, guest_email, guest_key_hash, sheet_id, sheet_ids, order_name, amount)
  values (v_order_id, null, v_email, encode(sha256(convert_to(v_key, 'UTF8')), 'hex'), q.o_first, q.o_ids, q.o_name, q.o_amount);
  return json_build_object('order_id', v_order_id, 'amount', q.o_amount, 'order_name', q.o_name, 'guest_key', v_key);
end;
$$;
revoke all on function public.create_guest_sheet_order(uuid[], text) from public;
grant execute on function public.create_guest_sheet_order(uuid[], text) to anon, authenticated;

-- ---------- 인기 악보: 회원·비회원 주문 모두 (sheet_orders 에서 바로) ----------
create or replace function public.sheet_popularity()
returns table (sheet_id uuid, sold_7d integer, sold_30d integer, sold_total integer)
language sql
stable
security definer
set search_path = ''
as $$
    with sold as (
        select coalesce(el.id, s.id) as sid, o.order_id, coalesce(o.approved_at, o.created_at) as created_at
        from public.sheet_orders o
        cross join lateral unnest(case when o.sheet_ids is not null and cardinality(o.sheet_ids) > 0 then o.sheet_ids else array[o.sheet_id] end) x(id)
        join public.sheets s on s.id = x.id
        left join lateral (
            select e.id from public.sheets e
            where s.style = 'solo' and s.song_key is not null and e.song_key = s.song_key and e.style in ('electric', 'acoustic')
              and (e.published or not s.published)
            order by e.published desc, (e.style = 'electric') desc, e.id
            limit 1
        ) el on true
        where o.status = 'paid' and not o.is_test
    )
    select sid,
           (count(distinct order_id) filter (where created_at >= now() - interval '7 days'))::integer,
           (count(distinct order_id) filter (where created_at >= now() - interval '30 days'))::integer,
           count(distinct order_id)::integer
    from sold
    group by sid;
$$;
revoke all on function public.sheet_popularity() from public;
grant execute on function public.sheet_popularity() to anon, authenticated;
