-- 반주 + 기타솔로를 함께 산 사람에게 주는 "합본" PDF (반주 안에 솔로까지 들어간 악보)
-- 2026-11-05 사용자 결정 (첫 곡: Greenday - Holiday)
--   · 반주만 2,500원, 기타솔로만 1,000원, 함께 사면 3,000원(500원 할인). 함께 산 사람은 반주·솔로 PDF에 합본 PDF를 덤으로 받는다.
--   · 합본 파일은 반주 악보 행에 붙는다: 저장소 sheet-pdfs/<반주 id>-full.pdf, 표시는 sheets.bundle_pdf = true.
--   · 받을 수 있는 사람: 그 반주 악보와, 같은 song_key 의 기타솔로 악보를 둘 다 산 사람 (따로따로 샀어도 된다).

alter table public.sheets add column if not exists bundle_pdf boolean not null default false;

-- 합본을 받을 수 있는지 (반주 id 로)
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
          and exists (select 1 from public.sheet_purchases p where p.user_id = auth.uid() and p.sheet_id = a.id)
          and exists (select 1 from public.sheet_purchases p where p.user_id = auth.uid() and p.sheet_id = s.id)
    )
$$;
-- 저장소 정책 안에서 불리므로 누구나 부를 수 있게 둔다 (로그인 안 한 사람은 늘 false)

-- 저장소: <반주 id>-full.pdf 는 둘 다 산 사람만 읽는다
drop policy if exists "sheet pdfs bundle read" on storage.objects;
create policy "sheet pdfs bundle read" on storage.objects for select
using (
    bucket_id = 'sheet-pdfs'
    and name ~ '^[0-9a-f-]{36}-full\.pdf$'
    and public.owns_sheet_bundle(substr(name, 1, 36)::uuid)
);

-- 구매한 악보 목록에 bundle_pdf(합본을 받을 수 있음) 추가 — 돌려주는 칸이 바뀌어서 지우고 다시 만든다
drop function if exists public.my_sheet_purchases();
create function public.my_sheet_purchases()
returns table (sheet_id uuid, title text, artist text, style text, pages smallint, preview_path text,
               updated_at timestamptz, amount integer, purchased_at timestamptz, is_test boolean, bundle_pdf boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select s.id, s.title, s.artist, s.style, s.pages, s.preview_path, s.updated_at,
         o.amount, p.created_at, o.is_test, public.owns_sheet_bundle(s.id)
  from public.sheet_purchases p
  join public.sheets s on s.id = p.sheet_id
  join public.sheet_orders o on o.order_id = p.order_id
  where p.user_id = auth.uid()
  order by p.created_at desc
$$;
revoke execute on function public.my_sheet_purchases() from public, anon;
grant execute on function public.my_sheet_purchases() to authenticated;

-- Holiday 반주 행에 합본 표시 (파일은 2026-11-05에 올려 둠). 새로 나온 악보 순서가 안 바뀌게 수정 시각은 그대로.
begin;
set local session_replication_role = replica;
update public.sheets set bundle_pdf = true where id = '7f56c66e-531f-415f-8d07-bea17f3d6228';
commit;
