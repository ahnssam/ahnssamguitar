-- 예전 주문 함수(악보 1개짜리, db/sheet_orders.sql)도 새 검사를 거치게 (2026-11-12 사용자 요청)
--   · 사이트는 이제 create_sheet_order(uuid[]) 만 쓰지만, 예전 함수 create_sheet_order(uuid) 가 남아 있어서
--     로그인한 사람이 직접 부르면 '12월 1일 전엔 자작곡만'(cover_sales_open) 검사를 건너뛸 수 있었다
--     (토스 실결제가 열린 뒤 커버곡을 12월 1일 전에 살 수 있는 틈).
--   · 이제 예전 함수는 같은 악보 하나로 새 함수를 부를 뿐이다 → sheet_order_quote 의 모든 검사
--     (공개·PDF·가격·커버 판매 시작일)와 1년 다시 사기 규칙(db/sheet_download_1y.sql)을 그대로 거친다.

create or replace function public.create_sheet_order(p_sheet_id uuid)
returns json
language sql
security invoker
set search_path = ''
as $$
    select public.create_sheet_order(array[p_sheet_id])
$$;
revoke all on function public.create_sheet_order(uuid) from public, anon;
grant execute on function public.create_sheet_order(uuid) to authenticated;
