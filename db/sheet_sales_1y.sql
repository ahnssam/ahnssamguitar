-- 풀스코어 판매 기록에 '최근 1년'과 '마지막으로 팔린 날'을 더한다 (2026-11-08 사용자 요청)
--   1년 동안 한 장도 안 팔린 곡은 사이트에 굳이 안 올려도 될지 보려고.
--   숫자는 풀스코어 정산 상세(2021-04 ~ as_of)에서 결제된 판매만 센다.
--   풀스코어에 올렸지만 한 번도 안 팔린 곡도 0으로 한 줄씩 넣는다 — 그래야 '기록 없음'과 '0장'이 구분된다.
--   곡별 숫자는 공개 저장소라 여기 넣지 않는다 (db/sheet_sales.sql 과 같은 형식으로 따로 넣는다).
-- 2026-11-08 적용 (as_of 2026-11-07, 최근 1년 2025-11-08~, 최근 6개월 2026-05-08~).

alter table public.sheet_sales add column if not exists sold_1y integer not null default 0;   -- year_from ~ as_of 판매 수
alter table public.sheet_sales add column if not exists year_from date;                        -- 최근 1년의 첫날
alter table public.sheet_sales add column if not exists last_sold date;                        -- 마지막으로 팔린 날 (안 팔렸으면 비움)

-- 숫자 넣기 (예시):
-- insert into public.sheet_sales (fullscore_code, sold_total, sold_6m, sold_1y, last_sold, six_from, year_from, as_of)
-- select v.code, v.total, v.six, v.y1, v.last::date, date '2026-05-08', date '2025-11-08', date '2026-11-07' from (values
--   ('0000000000', 0, 0, 0, null)   -- (풀스코어 코드, 누적, 6개월, 1년, 마지막 판매일)
-- ) as v(code, total, six, y1, last)
-- on conflict (fullscore_code) do update
--   set sold_total = excluded.sold_total, sold_6m = excluded.sold_6m, sold_1y = excluded.sold_1y, last_sold = excluded.last_sold,
--       six_from = excluded.six_from, year_from = excluded.year_from, as_of = excluded.as_of;
