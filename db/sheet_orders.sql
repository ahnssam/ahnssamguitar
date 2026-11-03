-- TAB악보 결제(토스페이먼츠) — 주문 · 구매 기록 · 구매자 PDF 내려받기 권한
-- 흐름: 구매하기 → create_sheet_order() 로 주문(대기) 만들기 → 토스 결제창 → 성공하면
--       Edge Function toss-confirm 이 토스에 결제 승인 요청 → 주문 '결제 완료' + sheet_purchases 에 기록
--       → 구매자는 sheet-pdfs/<악보id>.pdf 를 내려받을 수 있다.
-- 금액은 언제나 서버가 sheets.price 로 정한다 (브라우저가 보낸 금액은 믿지 않는다).

-- 주문 (결제 시도 한 번 = 한 줄)
create table public.sheet_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,             -- 토스에 넘기는 주문번호 (6~64자, 영문·숫자·-_)
  user_id uuid not null references auth.users (id) on delete cascade,
  sheet_id uuid not null references public.sheets (id) on delete restrict,
  order_name text not null,
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'canceled')),
  is_test boolean not null default false,    -- 테스트 키로 결제된 주문 (실제 돈 안 빠짐)
  payment_key text,
  method text,
  approved_at timestamptz,
  receipt_url text,
  fail_code text,
  fail_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sheet_orders_user_idx on public.sheet_orders (user_id, created_at desc);
create trigger sheet_orders_touch_updated_at before update on public.sheet_orders
  for each row execute function public.touch_updated_at();

alter table public.sheet_orders enable row level security;
-- 쓰기는 create_sheet_order()(security definer)와 Edge Function(service role)만
create policy sheet_orders_read on public.sheet_orders for select to authenticated
  using (user_id = auth.uid() or public.is_site_admin());

-- 구매 기록 (사람 × 악보 한 줄 — 이게 있으면 PDF 를 받을 수 있다)
create table public.sheet_purchases (
  user_id uuid not null references auth.users (id) on delete cascade,
  sheet_id uuid not null references public.sheets (id) on delete restrict,
  order_id text not null references public.sheet_orders (order_id),
  created_at timestamptz not null default now(),
  primary key (user_id, sheet_id)
);
alter table public.sheet_purchases enable row level security;
create policy sheet_purchases_read on public.sheet_purchases for select to authenticated
  using (user_id = auth.uid() or public.is_site_admin());

-- 구매자는 산 악보의 PDF 만 읽을 수 있다 (내려받기 링크를 스스로 만들 수 있게)
create policy "sheet pdfs buyer read" on storage.objects for select to authenticated
  using (
    bucket_id = 'sheet-pdfs'
    and exists (
      select 1 from public.sheet_purchases p
      where p.user_id = auth.uid() and p.sheet_id::text || '.pdf' = name
    )
  );

-- 주문 만들기 — 로그인 필수, 공개된 악보(운영 계정은 비공개도 테스트 가능), PDF 가 있어야 함, 이미 산 악보는 막음
create or replace function public.create_sheet_order(p_sheet_id uuid)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_sheet public.sheets%rowtype;
  v_order_id text;
  v_name text;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  select * into v_sheet from public.sheets where id = p_sheet_id;
  if not found or not (v_sheet.published or public.is_site_admin()) then raise exception 'sheet_not_found'; end if;
  if not exists (select 1 from public.sheet_files f where f.sheet_id = p_sheet_id) then raise exception 'sheet_no_pdf'; end if;
  if v_sheet.price <= 0 then raise exception 'sheet_no_price'; end if;
  if exists (select 1 from public.sheet_purchases p where p.user_id = v_uid and p.sheet_id = p_sheet_id) then
    raise exception 'already_purchased';
  end if;

  v_order_id := 'AS' || to_char(now() at time zone 'Asia/Seoul', 'YYMMDDHH24MISS') || '-'
                || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  v_name := left(v_sheet.title, 80) || ' TAB악보';

  insert into public.sheet_orders (order_id, user_id, sheet_id, order_name, amount)
  values (v_order_id, v_uid, p_sheet_id, v_name, v_sheet.price);

  return json_build_object('order_id', v_order_id, 'amount', v_sheet.price, 'order_name', v_name);
end;
$$;
revoke all on function public.create_sheet_order(uuid) from public, anon;
grant execute on function public.create_sheet_order(uuid) to authenticated;

-- 내가 산 악보 목록 (나중에 비공개로 돌린 악보도 산 사람에게는 보인다)
create or replace function public.my_sheet_purchases()
returns table (
  sheet_id uuid, title text, artist text, style text, pages smallint, preview_path text,
  updated_at timestamptz, amount integer, purchased_at timestamptz, is_test boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select s.id, s.title, s.artist, s.style, s.pages, s.preview_path, s.updated_at,
         o.amount, p.created_at, o.is_test
  from public.sheet_purchases p
  join public.sheets s on s.id = p.sheet_id
  join public.sheet_orders o on o.order_id = p.order_id
  where p.user_id = auth.uid()
  order by p.created_at desc
$$;
revoke all on function public.my_sheet_purchases() from public, anon;
grant execute on function public.my_sheet_purchases() to authenticated;
