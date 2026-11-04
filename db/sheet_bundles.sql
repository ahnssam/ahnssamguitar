-- 같은 곡의 여러 악보(통기타 반주 · 일렉기타 반주 · 기타솔로)를 한 곡으로 묶고, 함께 사면 할인
-- 2026-11-04 사용자 결정
--   · 같은 곡 = sheets.song_key 가 같은 줄들 (악보관리에서 묶는다). 상세 페이지는 하나로, 사는 구성만 고른다.
--   · 반주(통기타·일렉) 2,500원, 기타솔로 1,500원, 반주 + 기타솔로를 함께 사면 500원 깎아 3,500원.
--   · 일렉기타 목록에는 "일렉기타 + 기타솔로" 3,500원으로, 통기타 목록에는 통기타 악보 2,500원으로 보인다.
-- 주문 한 번에 악보 여러 개: sheet_orders.sheet_ids (예전 주문은 비어 있고 sheet_id 하나)

alter table public.sheets add column if not exists song_key uuid;
create index if not exists sheets_song_key_idx on public.sheets (song_key) where song_key is not null;

alter table public.sheet_orders add column if not exists sheet_ids uuid[];

-- 메인 목록 함수에 song_key 추가 (돌려주는 칸이 바뀌어서 지우고 다시 만든다)
drop function if exists public.sheet_catalog();
create function public.sheet_catalog()
returns table (
    id uuid,
    title text,
    artist text,
    style text,
    genre text,
    difficulty smallint,
    price integer,
    youtube_id text,
    fullscore_code text,
    fullscore_orders integer,
    on_sale boolean,
    updated_at timestamptz,
    song_key uuid
)
language sql
stable
security definer
set search_path = public
as $$
    select s.id, s.title, s.artist, s.style, s.genre, s.difficulty, s.price,
           s.youtube_id, s.fullscore_code, coalesce(s.fullscore_orders, 0), s.published, s.updated_at, s.song_key
    from public.sheets s
    order by s.published desc, s.fullscore_code desc nulls last;
$$;
revoke all on function public.sheet_catalog() from public;
grant execute on function public.sheet_catalog() to anon, authenticated;

-- 주문 만들기 (악보 여러 개) — 같은 곡의 악보만, 금액은 언제나 서버가 정한다:
-- 가격 합 − (기타솔로와 반주를 함께 사면 500원)
create or replace function public.create_sheet_order(p_sheet_ids uuid[])
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_set_discount constant integer := 500;
  v_uid uuid := auth.uid();
  v_ids uuid[];
  v_n integer;
  v_keys integer;
  v_nokey boolean;
  v_amount integer;
  v_solo boolean;
  v_main boolean;
  v_first uuid;
  v_title text;
  v_parts text;
  v_order_id text;
  v_name text;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  select array_agg(distinct x) into v_ids from unnest(p_sheet_ids) x where x is not null;
  v_n := coalesce(array_length(v_ids, 1), 0);
  if v_n = 0 or v_n > 3 then raise exception 'sheet_not_found'; end if;

  if (select count(*) from public.sheets s where s.id = any (v_ids) and (s.published or public.is_site_admin())) <> v_n then
    raise exception 'sheet_not_found';
  end if;
  if (select count(*) from public.sheet_files f where f.sheet_id = any (v_ids)) <> v_n then raise exception 'sheet_no_pdf'; end if;
  if exists (select 1 from public.sheets s where s.id = any (v_ids) and s.price <= 0) then raise exception 'sheet_no_price'; end if;
  if v_n > 1 then
    select count(distinct s.song_key), bool_or(s.song_key is null) into v_keys, v_nokey from public.sheets s where s.id = any (v_ids);
    if v_keys <> 1 or v_nokey then raise exception 'not_same_song'; end if;
  end if;
  if exists (select 1 from public.sheet_purchases p where p.user_id = v_uid and p.sheet_id = any (v_ids)) then
    raise exception 'already_purchased';
  end if;

  select sum(s.price), bool_or(s.style = 'solo'), bool_or(s.style <> 'solo')
    into v_amount, v_solo, v_main
  from public.sheets s where s.id = any (v_ids);
  if v_solo and v_main then v_amount := v_amount - c_set_discount; end if;

  -- 대표 악보(반주 먼저)와 주문 이름: "그대에게 TAB악보 (일렉기타 + 기타솔로)", "그대에게 TAB악보 (기타솔로)"
  select s.id, s.title into v_first, v_title from public.sheets s where s.id = any (v_ids)
  order by (s.style = 'solo'), s.style limit 1;
  select string_agg(case s.style when 'acoustic' then '통기타' when 'electric' then '일렉기타' when 'solo' then '기타솔로'
                                 when 'fingerstyle' then '핑거스타일' when 'bass' then '베이스' when 'chord' then '코드악보' else '악보' end,
                    ' + ' order by (s.style = 'solo'), s.style)
    into v_parts from public.sheets s where s.id = any (v_ids);

  v_order_id := 'AS' || to_char(now() at time zone 'Asia/Seoul', 'YYMMDDHH24MISS') || '-'
                || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  v_name := left(v_title, 60) || ' TAB악보' || case when v_n > 1 or v_solo then ' (' || v_parts || ')' else '' end;   -- 솔로만 살 때도 (기타솔로)

  insert into public.sheet_orders (order_id, user_id, sheet_id, sheet_ids, order_name, amount)
  values (v_order_id, v_uid, v_first, v_ids, v_name, v_amount);

  return json_build_object('order_id', v_order_id, 'amount', v_amount, 'order_name', v_name);
end;
$$;
revoke all on function public.create_sheet_order(uuid[]) from public, anon;
grant execute on function public.create_sheet_order(uuid[]) to authenticated;
