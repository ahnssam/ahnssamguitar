-- 산 악보 다시 받기 기한: 구매일로부터 1년 (2026-11-11 사용자 결정 — 토스는 서비스 제공기간 12개월까지만 받음, CLAUDE.md 6번)
--   · 회원: 저장소 정책이 산 지 1년 안의 PDF 만 읽게 한다. 합본(<반주 id>-full.pdf)은 반주·솔로 둘 다 1년 안일 때만.
--   · 비회원: Edge Function guest-order 가 결제 시각 + 1년이 지나면 내려받기를 막는다(같은 규칙을 함수 안에 따로 적음).
--   · 1년이 지난 악보는 다시 살 수 있다(create_sheet_order 의 '이미 산 악보'는 1년 안만 막음).
--     다시 사면 toss-confirm 이 구매 기록(sheet_purchases)의 주문번호·구매 시각을 새것으로 바꿔서 그날부터 다시 1년.
--   · 구매한 악보 목록(my_sheet_purchases)에 expires_at(이때까지 받을 수 있음)을 더한다.
--   · 기간을 바꾸려면 sheet_download_open() 과 supabase/functions/guest-order 의 DOWNLOAD_YEARS 를 같이 고친다.
--   · 운영 계정은 "sheet pdfs admin" 정책으로 언제나 읽는다(이 파일과 상관없음).

create or replace function public.sheet_download_open(p_bought timestamptz)
returns boolean
language sql
stable
set search_path = ''
as $$
    select p_bought is not null and now() < p_bought + interval '1 year'
$$;
grant execute on function public.sheet_download_open(timestamptz) to anon, authenticated;

-- ---------- 저장소: 산 지 1년 안의 PDF 만 ----------
drop policy if exists "sheet pdfs buyer read" on storage.objects;
create policy "sheet pdfs buyer read" on storage.objects for select to authenticated
  using (
    bucket_id = 'sheet-pdfs'
    and exists (
      select 1 from public.sheet_purchases p
      where p.user_id = auth.uid() and p.sheet_id::text || '.pdf' = name
        and public.sheet_download_open(p.created_at)
    )
  );

-- 합본: 반주·솔로를 둘 다 샀고, 둘 다 1년 안 (db/sheet_bundle_full.sql 에 기한만 더함)
create or replace function public.owns_sheet_bundle(p_sheet uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.sheets a
        join public.sheets s on s.song_key = a.song_key and s.style = 'solo' and s.id <> a.id
        where a.id = p_sheet and a.bundle_pdf and a.song_key is not null
          and exists (select 1 from public.sheet_purchases p where p.user_id = auth.uid() and p.sheet_id = a.id and public.sheet_download_open(p.created_at))
          and exists (select 1 from public.sheet_purchases p where p.user_id = auth.uid() and p.sheet_id = s.id and public.sheet_download_open(p.created_at))
    )
$$;

-- ---------- 회원 주문: 1년이 지난 악보는 다시 살 수 있게 (db/sheet_guest_orders.sql 에서 '이미 산 악보' 조건만 바꿈) ----------
create or replace function public.create_sheet_order(p_sheet_ids uuid[])
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  q record;
  v_order_id text;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  select * into q from public.sheet_order_quote(p_sheet_ids);
  if exists (select 1 from public.sheet_purchases p
             where p.user_id = v_uid and p.sheet_id = any (q.o_ids) and public.sheet_download_open(p.created_at)) then
    raise exception 'already_purchased';
  end if;
  v_order_id := public.new_sheet_order_id();
  insert into public.sheet_orders (order_id, user_id, sheet_id, sheet_ids, order_name, amount)
  values (v_order_id, v_uid, q.o_first, q.o_ids, q.o_name, q.o_amount);
  return json_build_object('order_id', v_order_id, 'amount', q.o_amount, 'order_name', q.o_name);
end;
$$;
revoke all on function public.create_sheet_order(uuid[]) from public, anon;
grant execute on function public.create_sheet_order(uuid[]) to authenticated;

-- ---------- 구매한 악보 목록: expires_at 더함 (돌려주는 칸이 바뀌어서 지우고 다시 만든다) ----------
drop function if exists public.my_sheet_purchases();
create function public.my_sheet_purchases()
returns table (sheet_id uuid, title text, artist text, style text, pages smallint, preview_path text,
               updated_at timestamptz, amount integer, purchased_at timestamptz, is_test boolean, bundle_pdf boolean,
               expires_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select s.id, s.title, s.artist, s.style, s.pages, s.preview_path, s.updated_at,
         o.amount, p.created_at, o.is_test, public.owns_sheet_bundle(s.id),
         p.created_at + interval '1 year'
  from public.sheet_purchases p
  join public.sheets s on s.id = p.sheet_id
  join public.sheet_orders o on o.order_id = p.order_id
  where p.user_id = auth.uid()
  order by p.created_at desc
$$;
revoke execute on function public.my_sheet_purchases() from public, anon;
grant execute on function public.my_sheet_purchases() to authenticated;
