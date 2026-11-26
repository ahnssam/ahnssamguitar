-- 악보 판매: 장바구니 · 주문 관리 · 마케팅 분석 (2026-11-26 사용자)
--   "판매가 되기 시작했으니 얼마나 팔렸는지 볼 수 있게 — 풀스코어처럼 주문 관리, 마케팅 분석(상세 보기·장바구니·주문 수), 정산 관리(일·주·월·연).
--    장바구니도 넣자." → 악보관리(admin/sheets.html)에 주문 관리·정산 관리·마케팅 분석 탭, 손님 쪽에 장바구니(cart.js).
--
-- 이 파일이 하는 일
--   1. sheet_orders.pay_detail      — 결제 방법 자세히(카카오페이 · 신한카드(체크) …). toss-confirm 이 결제 승인 때 채운다.
--   2. sheet_admin_buyers()         — 주문 관리에서 회원 구매자의 이메일·닉네임 (운영 계정만). profiles.email 은 공개 읽기에서 빠져 있어서.
--   3. sheet_stats_daily · sheet_track() · sheet_admin_traffic()
--                                   — 마케팅 분석: 하루·악보마다 상세 보기 수, 장바구니 담기 수. 개인 정보 없이 숫자만.
--                                     같은 브라우저의 같은 악보는 하루 한 번만 센다(브라우저가 거름). 운영 계정은 안 셈.
--   4. 장바구니 결제 — 여러 곡을 한 주문으로
--      sheet_order_quote()          — 예전: 같은 곡 악보 3개까지(반주 + 솔로). 이제: 아무 곡이나 10개까지.
--                                     반주 + 기타솔로 묶음 할인 500원은 곡마다. 주문 이름은 곡이 여럿이면 'OO TAB악보 외 N개'.
--      sheet_set_credit()           — 나눠 사도 묶음 할인(이미 산 짝)도 곡마다 더한다.
--      create_sheet_order() · create_guest_sheet_order()
--                                   — 한 번 결제에 1만원 넘으면 막는다('over_limit') — 토스 계약: 한 번 결제 1만원 이하.
--      sheet_cart_quote()           — 장바구니 화면: 담긴 악보마다 살 수 있는지(판매 안 함·이미 삼), 할인, 결제 금액.
--   금액은 지금처럼 늘 서버가 sheets.price 로 정한다. 같은 곡 반주 + 솔로만 사는 주문은 예전과 금액·이름이 똑같다.

-- ---------- 1. 결제 방법 자세히 ----------
alter table public.sheet_orders add column if not exists pay_detail text;

-- ---------- 2. 주문 관리 — 회원 구매자 이메일·닉네임 (운영 계정만) ----------
create or replace function public.sheet_admin_buyers(p_ids uuid[])
returns table (id uuid, email text, nickname text)
language sql stable security definer set search_path = ''
as $$
    select u.id, u.email::text, p.nickname
    from auth.users u
    left join public.profiles p on p.id = u.id
    where public.is_site_admin() and u.id = any (p_ids)
$$;
revoke all on function public.sheet_admin_buyers(uuid[]) from public, anon;
grant execute on function public.sheet_admin_buyers(uuid[]) to authenticated;

-- ---------- 3. 마케팅 분석 — 상세 보기 · 장바구니 담기 (하루·악보마다 숫자만) ----------
create table if not exists public.sheet_stats_daily (
    day date not null,                                   -- 한국 날짜
    sheet_id uuid not null references public.sheets (id) on delete cascade,
    views integer not null default 0,                    -- 상세 페이지를 연 브라우저 수(같은 브라우저는 하루 한 번)
    carts integer not null default 0,                    -- 장바구니에 담은 수
    primary key (day, sheet_id)
);
alter table public.sheet_stats_daily enable row level security;   -- 정책 없음 = 아래 함수로만 쓰고 읽는다

create or replace function public.sheet_track(p_sheet uuid, p_kind text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
    v_day date := (now() at time zone 'Asia/Seoul')::date;
begin
    if p_sheet is null or p_kind not in ('view', 'cart') then return; end if;
    if public.is_site_admin() then return; end if;                       -- 운영 계정이 보는 건 안 센다
    if not exists (select 1 from public.sheets s where s.id = p_sheet and s.published) then return; end if;
    insert into public.sheet_stats_daily as d (day, sheet_id, views, carts)
    values (v_day, p_sheet, (p_kind = 'view')::integer, (p_kind = 'cart')::integer)
    on conflict (day, sheet_id) do update
        set views = d.views + excluded.views, carts = d.carts + excluded.carts
        where d.views + d.carts < 50000;                                  -- 장난으로 마구 보내도 하루 한 악보 5만에서 멈춤
end;
$$;
revoke all on function public.sheet_track(uuid, text) from public;
grant execute on function public.sheet_track(uuid, text) to anon, authenticated;

create or replace function public.sheet_admin_traffic(p_from date, p_to date)
returns table (day date, sheet_id uuid, views integer, carts integer)
language sql stable security definer set search_path = ''
as $$
    select d.day, d.sheet_id, d.views, d.carts
    from public.sheet_stats_daily d
    where public.is_site_admin() and d.day between p_from and p_to
$$;
revoke all on function public.sheet_admin_traffic(date, date) from public, anon;
grant execute on function public.sheet_admin_traffic(date, date) to authenticated;

-- ---------- 4. 장바구니 결제 ----------
-- 주문 금액·이름 (예전: 같은 곡 3개까지 → 이제 아무 곡이나 10개까지)
create or replace function public.sheet_order_quote(p_sheet_ids uuid[], OUT o_ids uuid[], OUT o_amount integer, OUT o_first uuid, OUT o_name text)
returns record
language plpgsql stable security definer set search_path = ''
as $$
declare
    c_set_discount constant integer := 500;
    c_max_items constant integer := 10;
    v_n integer;
    v_sets integer;
    v_songs integer;
    v_solo boolean;
    v_title text;
    v_parts text;
begin
    select array_agg(distinct x) into o_ids from unnest(p_sheet_ids) x where x is not null;
    v_n := coalesce(array_length(o_ids, 1), 0);
    if v_n = 0 then raise exception 'sheet_not_found'; end if;
    if v_n > c_max_items then raise exception 'too_many_items'; end if;

    if (select count(*) from public.sheets s where s.id = any (o_ids) and (s.published or public.is_site_admin())) <> v_n then
        raise exception 'sheet_not_found';
    end if;
    if (select count(*) from public.sheet_files f where f.sheet_id = any (o_ids)) <> v_n then raise exception 'sheet_no_pdf'; end if;
    if exists (select 1 from public.sheets s where s.id = any (o_ids) and s.price <= 0) then raise exception 'sheet_no_price'; end if;
    if not public.cover_sales_open() and not public.is_site_admin()
       and exists (select 1 from public.sheets s where s.id = any (o_ids) and s.kind is distinct from 'original') then
        raise exception 'cover_not_yet';
    end if;

    -- 반주 + 기타솔로 묶음 할인: 같은 곡(song_key)에서 둘 다 사면 곡마다 500원
    select count(*) into v_sets from (
        select s.song_key from public.sheets s
        where s.id = any (o_ids) and s.song_key is not null
        group by s.song_key having bool_or(s.style = 'solo') and bool_or(s.style <> 'solo')
    ) g;
    select sum(s.price), bool_or(s.style = 'solo'), count(distinct coalesce(s.song_key, s.id))
      into o_amount, v_solo, v_songs
    from public.sheets s where s.id = any (o_ids);
    o_amount := o_amount - c_set_discount * v_sets;

    if v_songs = 1 then
        -- 한 곡(예전과 같음): 'OO TAB악보 (일렉기타 + 기타솔로)'
        select s.id, s.title into o_first, v_title from public.sheets s where s.id = any (o_ids)
        order by (s.style = 'solo'), s.style limit 1;
        select string_agg(case s.style when 'acoustic' then '통기타' when 'electric' then '일렉기타' when 'solo' then '기타솔로'
                                       when 'fingerstyle' then '핑거스타일' when 'bass' then '베이스' when 'chord' then '코드악보' else '악보' end,
                          ' + ' order by (s.style = 'solo'), s.style)
          into v_parts from public.sheets s where s.id = any (o_ids);
        o_name := left(v_title, 60) || ' TAB악보' || case when v_n > 1 or v_solo then ' (' || v_parts || ')' else '' end;
    else
        -- 여러 곡(장바구니): 'OO TAB악보 외 N개' — 첫 곡은 값이 가장 비싼 악보
        select s.id, s.title into o_first, v_title from public.sheets s where s.id = any (o_ids)
        order by s.price desc, s.title limit 1;
        o_name := left(v_title, 50) || ' TAB악보 외 ' || (v_n - 1) || '개';
    end if;
end;
$$;

-- 나눠 사도 묶음 할인(이미 산 짝) — 곡마다 더한다. 한 곡 주문은 예전과 같은 값
create or replace function public.sheet_set_credit(p_uid uuid, p_sheet_ids uuid[])
returns integer
language sql stable security definer set search_path = ''
as $$
    with g as (
        select s.song_key, bool_or(s.style = 'solo') as has_solo, bool_or(s.style <> 'solo') as has_main, sum(s.price) as tot
        from public.sheets s
        where s.id = any (p_sheet_ids) and s.song_key is not null
        group by s.song_key
    )
    select coalesce(sum(case
        when p_uid is null or (g.has_solo and g.has_main) or g.tot - 500 < 100 then 0
        when g.has_main and public.sheet_set_owned(p_uid, g.song_key) = 'solo' then 500
        when g.has_solo and public.sheet_set_owned(p_uid, g.song_key) = 'main' then 500
        else 0 end), 0)::integer
    from g
$$;

-- 회원 주문 — 1만원 넘으면 막음
create or replace function public.create_sheet_order(p_sheet_ids uuid[])
returns json
language plpgsql security definer set search_path = ''
as $$
declare
    c_max_amount constant integer := 10000;   -- 토스 계약: 한 번 결제에 1만원 이하
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
    if v_amount > c_max_amount then raise exception 'over_limit'; end if;
    v_order_id := public.new_sheet_order_id();
    insert into public.sheet_orders (order_id, user_id, sheet_id, sheet_ids, order_name, amount)
    values (v_order_id, v_uid, q.o_first, q.o_ids, q.o_name, v_amount);
    return json_build_object('order_id', v_order_id, 'amount', v_amount, 'order_name', q.o_name);
end;
$$;

-- 비회원 주문 — 1만원 넘으면 막음 (나머지는 예전과 같음)
create or replace function public.create_guest_sheet_order(p_sheet_ids uuid[], p_email text)
returns json
language plpgsql security definer set search_path = ''
as $$
declare
    c_max_amount constant integer := 10000;
    v_email text := lower(trim(coalesce(p_email, '')));
    q record;
    v_order_id text;
    v_key text;
begin
    if length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'bad_email'; end if;
    if (select count(*) from public.sheet_orders o where o.guest_email = v_email and o.created_at > now() - interval '1 hour') >= 20
       or (select count(*) from public.sheet_orders o where o.guest_email is not null and o.created_at > now() - interval '1 minute') >= 60 then
        raise exception 'too_many';
    end if;
    select * into q from public.sheet_order_quote(p_sheet_ids);
    if q.o_amount > c_max_amount then raise exception 'over_limit'; end if;
    v_order_id := public.new_sheet_order_id();
    v_key := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
    insert into public.sheet_orders (order_id, user_id, guest_email, guest_key_hash, sheet_id, sheet_ids, order_name, amount)
    values (v_order_id, null, v_email, encode(sha256(convert_to(v_key, 'UTF8')), 'hex'), q.o_first, q.o_ids, q.o_name, q.o_amount);
    return json_build_object('order_id', v_order_id, 'amount', q.o_amount, 'order_name', q.o_name, 'guest_key', v_key);
end;
$$;

-- 장바구니 화면 — 담긴 악보마다 살 수 있는지 + 금액 (로그인했으면 이미 산 악보·이미 산 짝 할인까지)
--   st: 'ok' 살 수 있음 · 'owned' 이미 샀고 아직 받을 수 있음 · 'gone' 지금은 판매하지 않음
create or replace function public.sheet_cart_quote(p_sheet_ids uuid[])
returns json
language plpgsql stable security definer set search_path = ''
as $$
declare
    v_uid uuid := auth.uid();
    v_items json;
    v_ok uuid[];
    v_sum integer := 0;
    v_sets integer := 0;
    v_credit integer := 0;
begin
    with i as (
        select x as id, min(o)::integer as ord
        from unnest(coalesce(p_sheet_ids, '{}'::uuid[])) with ordinality as t(x, o)
        where x is not null group by x order by min(o) limit 30
    ), c as (
        select i.id, i.ord,
               case
                   when s.id is null or not (s.published or public.is_site_admin()) then 'gone'
                   when s.price <= 0 or not exists (select 1 from public.sheet_files f where f.sheet_id = s.id) then 'gone'
                   when not public.cover_sales_open() and not public.is_site_admin() and s.kind is distinct from 'original' then 'gone'
                   when v_uid is not null and exists (select 1 from public.sheet_purchases p
                                                      where p.user_id = v_uid and p.sheet_id = s.id and public.sheet_download_open(p.created_at)) then 'owned'
                   else 'ok' end as st
        from i left join public.sheets s on s.id = i.id
    )
    select coalesce(json_agg(json_build_object(
               'id', c.id, 'st', c.st, 'title', s.title, 'artist', s.artist, 'style', s.style, 'kind', s.kind,
               'price', s.price, 'song_key', s.song_key, 'pages', s.pages, 'preview_path', s.preview_path, 'updated_at', s.updated_at,
               'cover_path', coalesce(s.cover_path, (select x.cover_path from public.sheets x
                                                     where s.song_key is not null and x.song_key = s.song_key and x.cover_path is not null limit 1)))
               order by c.ord), '[]'::json),
           array_agg(c.id) filter (where c.st = 'ok')
      into v_items, v_ok
    from c left join public.sheets s on s.id = c.id and c.st <> 'gone';

    if v_ok is not null then
        select coalesce(sum(s.price), 0) into v_sum from public.sheets s where s.id = any (v_ok);
        select count(*) into v_sets from (
            select s.song_key from public.sheets s
            where s.id = any (v_ok) and s.song_key is not null
            group by s.song_key having bool_or(s.style = 'solo') and bool_or(s.style <> 'solo')
        ) g;
        v_credit := public.sheet_set_credit(v_uid, v_ok);
    end if;

    return json_build_object('items', v_items, 'sum', v_sum, 'set_off', 500 * v_sets, 'credit', v_credit,
                             'total', v_sum - 500 * v_sets - v_credit, 'max_total', 10000, 'max_items', 10, 'member', v_uid is not null);
end;
$$;
revoke all on function public.sheet_cart_quote(uuid[]) from public;
grant execute on function public.sheet_cart_quote(uuid[]) to anon, authenticated;
