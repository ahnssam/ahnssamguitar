-- 메인 '인기 악보' 칸의 주별 · 월별 · 전체 탭: 사이트에서 실제로 팔린 수.
-- 손님(공개 키)도 부를 수 있지만 돌려주는 건 악보 id 와 판매 수뿐 — 누가 샀는지·주문번호·금액은 내보내지 않는다.
-- 2026-11-05 사용자 결정 · 같은 날 적용 (migration: sheet_popularity)
--   · 사이트 판매만 센다 (sheet_purchases 중 결제 완료, 테스트 결제 is_test 는 뺀다).
--     풀스코어 누적 주문수(sheets.fullscore_orders)는 날짜가 없어서 '전체' 탭에만 더한다 (index.html).
--   · 주별 = 지금부터 거꾸로 최근 7일, 월별 = 최근 30일.
--   · 판매 수 = 그 악보가 들어 있는 주문 수. 같은 곡의 기타솔로는 메인 목록에서 '반주 + 기타솔로' 한 줄이라
--     반주 쪽으로 합쳐 세고, 반주 + 솔로를 함께 산 주문은 한 번으로 센다 (index.html bundle() 과 같은 규칙).
--   · 2026-11-06: 반주 = 일렉기타, 일렉기타가 없으면 통기타 (너에게 난 나에게 넌 = 통기타 + 솔로).
--     같은 날 적용 (migration: sheet_popularity_acoustic_backing)
create or replace function public.sheet_popularity()
returns table (sheet_id uuid, sold_7d integer, sold_30d integer, sold_total integer)
language sql
stable
security definer
set search_path = ''
as $$
    with sold as (
        select coalesce(el.id, s.id) as sid, p.order_id, p.created_at
        from public.sheet_purchases p
        join public.sheet_orders o on o.order_id = p.order_id and o.status = 'paid' and not o.is_test
        join public.sheets s on s.id = p.sheet_id
        left join lateral (
            select e.id from public.sheets e
            where s.style = 'solo' and s.song_key is not null and e.song_key = s.song_key and e.style in ('electric', 'acoustic')
              and (e.published or not s.published)
            order by e.published desc, (e.style = 'electric') desc, e.id
            limit 1
        ) el on true
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
