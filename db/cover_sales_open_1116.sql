-- 커버·편곡 악보 판매 시작일을 음저협 계약서의 서비스 시작일(2026-11-16)로 앞당김
--   2026-11-24 음저협 전송팀 담당자 회신: 협회 내부 결재로 체결까지 시간이 걸리는 동안 우선 판매해도 되고,
--   나중에 정산할 때 서비스 시작일(2026-11-16) 기준으로 자료를 내면 된다.
--   예전 값은 2026-12-01 (db/sheet_guest_orders.sql). 상세 페이지 tab-detail.html 의 COVER_OPEN 도 같은 날짜.
--   토스가 테스트 키인 동안은 체험 결제창이라 손님에게 달라지는 건 없다 — 라이브 키로 바꾸는 날부터 커버곡이 실제로 팔린다.
create or replace function public.cover_sales_open()
returns boolean
language sql
stable
set search_path = ''
as $$
    select now() >= timestamptz '2026-11-16 00:00:00+09'
$$;
grant execute on function public.cover_sales_open() to anon, authenticated;
