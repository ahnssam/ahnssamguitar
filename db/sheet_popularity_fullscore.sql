-- 메인 '인기 악보' 주별·월별에 풀스코어 판매도 넣기 (2026-11-11 사용자 요청: "판매 기록이 없어서 전체순"으로 두지 말고 풀스코어 자료로 채우기)
--
-- 풀스코어 판매(sheet_sales)는 곡별 숫자를 운영 계정만 읽는 표라, 여기서는 숫자를 내보내지 않고 '순위'만 내보낸다.
--   fs_7d_rank  : 풀스코어 자료 마지막 날(as_of)까지 7일 안에 팔린 곡(last_sold) 중, 최근 6개월 판매가 많은 순 1·2·3…
--   fs_30d_rank : 30일 안에 팔린 곡 중 같은 순서
--   sheet_sales 에는 일별 숫자가 없어서 '그 기간에 팔렸는지'(마지막 판매일)만 알고, 순서는 최근 6개월 판매로 정한다.
--   풀스코어 판매를 다시 읽어 sheet_sales 를 새로 채우면(as_of 가 바뀌면) 주별·월별도 따라 바뀐다.
-- 사이트 판매(sold_7d·sold_30d·sold_total)는 예전과 같다 (db/sheet_guest_orders.sql — 회원·비회원 주문 모두).
-- 같은 곡 기타솔로는 반주 줄로 합친다(사이트 판매와 같은 규칙). index.html 은 사이트 판매 → 풀스코어 순위 → 전체 인기순으로 채운다.
-- 돌려주는 칸이 바뀌어서 지우고 다시 만든다.

drop function if exists public.sheet_popularity();
create function public.sheet_popularity()
returns table (sheet_id uuid, sold_7d integer, sold_30d integer, sold_total integer, fs_7d_rank integer, fs_30d_rank integer)
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
    ),
    site as (
        select sid,
               (count(distinct order_id) filter (where created_at >= now() - interval '7 days'))::integer as w,
               (count(distinct order_id) filter (where created_at >= now() - interval '30 days'))::integer as m,
               count(distinct order_id)::integer as t
        from sold
        group by sid
    ),
    fs as (
        select coalesce(el.id, s.id) as sid, ss.fullscore_code, ss.sold_6m, ss.sold_total, ss.last_sold, ss.as_of
        from public.sheet_sales ss
        join public.sheets s on s.fullscore_code = ss.fullscore_code
        left join lateral (
            select e.id from public.sheets e
            where s.style = 'solo' and s.song_key is not null and e.song_key = s.song_key and e.style in ('electric', 'acoustic')
              and (e.published or not s.published)
            order by e.published desc, (e.style = 'electric') desc, e.id
            limit 1
        ) el on true
        where ss.last_sold is not null
    ),
    fsg as (
        -- 같은 풀스코어 곡이 악보 두 줄에 붙어 있어도 한 번만 세게 코드별로 먼저 하나씩
        select sid, max(last_sold) as last_sold, max(as_of) as as_of, sum(sold_6m) as s6, sum(sold_total) as st
        from (select distinct sid, fullscore_code, sold_6m, sold_total, last_sold, as_of from fs) d
        group by sid
    ),
    w as (select sid, row_number() over (order by s6 desc, st desc, sid)::integer as r from fsg where last_sold > as_of - 7),
    m as (select sid, row_number() over (order by s6 desc, st desc, sid)::integer as r from fsg where last_sold > as_of - 30),
    ids as (select sid from site union select sid from w union select sid from m)
    select ids.sid,
           coalesce(site.w, 0), coalesce(site.m, 0), coalesce(site.t, 0),
           w.r, m.r
    from ids
    left join site on site.sid = ids.sid
    left join w on w.sid = ids.sid
    left join m on m.sid = ids.sid;
$$;
revoke all on function public.sheet_popularity() from public;
grant execute on function public.sheet_popularity() to anon, authenticated;
