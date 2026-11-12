-- 음저협 정산 자료 — 곡(악보)별·월별 다운로드 수와 매출 (2026-11-12, CLAUDE.md 6번 '정산 자료')
--   · 악보관리 '음저협 정산' 단추가 부르고 엑셀로 받는다. 운영 계정이 아니면 빈 결과.
--   · 다운로드 수 = 결제 완료된 주문에 든 악보 수 (판매 1건 = 1다운로드. 같은 사람이 1년 안에 다시 받는 것은 세지 않는다).
--   · 매출 = 손님이 낸 결제 금액(부가세 포함). 반주 + 기타솔로처럼 한 주문에 악보가 여러 개면
--     주문 금액을 정가 비율로 나눈다(묶음 500원 할인도 비율대로). 원 단위 끝수는 그 주문의 첫 악보에.
--   · 달은 결제 승인 시각(한국 시간)으로 나눈다. 테스트 결제는 빼고(p_include_test 로 넣어 볼 수 있음), 취소된 주문도 빠진다.
--   · 개인정보(구매자·이메일)는 돌려주지 않는다.

create or replace function public.sheet_sales_report(p_from date, p_to date, p_include_test boolean default false)
returns table (month text, sheet_id uuid, title text, title_original text, artist text, kind text, style text,
               composer text, lyricist text, komca_code text, price integer, downloads integer, revenue integer)
language sql
stable
security definer
set search_path = ''
as $$
    with o as (
        select o.order_id, o.amount, coalesce(o.approved_at, o.created_at) as at,
               case when o.sheet_ids is not null and cardinality(o.sheet_ids) > 0 then o.sheet_ids else array[o.sheet_id] end as ids
        from public.sheet_orders o
        where public.is_site_admin()
          and o.status = 'paid' and (p_include_test or not o.is_test)
          and coalesce(o.approved_at, o.created_at) >= (p_from::timestamp at time zone 'Asia/Seoul')
          and coalesce(o.approved_at, o.created_at) <  ((p_to + 1)::timestamp at time zone 'Asia/Seoul')
    ),
    it as (
        select o.order_id, o.amount, o.at, x.id as sid, x.ord, s.price as p,
               sum(s.price) over (partition by o.order_id) as tot
        from o
        cross join lateral unnest(o.ids) with ordinality as x(id, ord)
        join public.sheets s on s.id = x.id
    ),
    sh as (
        select it.*, floor(it.amount::numeric * it.p / nullif(it.tot, 0))::integer as share from it
    ),
    fx as (
        select sh.sid, sh.at,
               sh.share + case when sh.ord = 1 then sh.amount - sum(sh.share) over (partition by sh.order_id) else 0 end as rev
        from sh
    )
    select to_char(fx.at at time zone 'Asia/Seoul', 'YYYY-MM'), s.id, s.title, s.title_original, s.artist, s.kind, s.style,
           s.composer, s.lyricist, s.komca_code, s.price, count(*)::integer, sum(fx.rev)::integer
    from fx
    join public.sheets s on s.id = fx.sid
    group by 1, s.id
    order by 1, s.title
$$;
revoke all on function public.sheet_sales_report(date, date, boolean) from public, anon;
grant execute on function public.sheet_sales_report(date, date, boolean) to authenticated;
