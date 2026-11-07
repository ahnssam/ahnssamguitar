-- 악보관리 '뭐부터 올리지?' 팝업용 판매 순위 (풀스코어 정산 내역에서 결제된 판매만 셈).
-- 운영 계정만 읽을 수 있다 — 사이트 손님에게는 보이지 않는다.
-- 누적 = 2021-04 ~ as_of, 최근 6개월 = six_from ~ as_of.
-- 곡별 숫자는 공개 저장소라 여기 넣지 않는다 — 풀스코어에서 새로 뽑아 아래 형식으로 넣는다.
-- 2026-11-04 적용 (190곡, as_of 2026-11-03, six_from 2026-05-04)
create table if not exists public.sheet_sales (
  fullscore_code text primary key,
  sold_total integer not null default 0,
  sold_6m integer not null default 0,
  six_from date not null,
  as_of date not null
);
alter table public.sheet_sales enable row level security;
drop policy if exists sheet_sales_admin on public.sheet_sales;
create policy sheet_sales_admin on public.sheet_sales for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

-- 숫자 넣기 (예시):
-- insert into public.sheet_sales (fullscore_code, sold_total, sold_6m, six_from, as_of)
-- select v.code, v.total, v.six, date '2026-05-04', date '2026-11-03' from (values
--   ('0000000000', 0, 0)   -- (풀스코어 코드, 누적, 6개월)
-- ) as v(code, total, six)
-- on conflict (fullscore_code) do update
--   set sold_total = excluded.sold_total, sold_6m = excluded.sold_6m, six_from = excluded.six_from, as_of = excluded.as_of;
