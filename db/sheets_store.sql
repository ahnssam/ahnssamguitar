-- 판매용 악보(관리자 등록) — Supabase 프로젝트 ahnssam-guitar 에 적용
-- 악보 정보는 공개된 것만 누구나 읽고, 쓰기·PDF 위치는 운영 계정만.

-- 사이트 운영 계정 판별 (기존 표들의 정책과 같은 기준)
create or replace function public.is_site_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'steveq2568@gmail.com'
$$;

-- 판매용 악보
create table public.sheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_original text,
  artist text,
  kind text not null default 'cover' check (kind in ('cover', 'arrangement', 'original')),
  style text check (style in ('fingerstyle', 'solo', 'acoustic', 'electric', 'other')),
  genre text,
  difficulty smallint check (difficulty between 1 and 5),
  price integer not null default 0 check (price >= 0),
  pages smallint,
  youtube_id text,
  description text,
  lyricist text,
  composer text,
  album text,
  label text,
  release_date text,
  komca_code text,
  preview_path text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sheets_listing_idx on public.sheets (published, sort_order desc, created_at desc);
create trigger sheets_touch_updated_at before update on public.sheets
  for each row execute function public.touch_updated_at();

alter table public.sheets enable row level security;
create policy sheets_read on public.sheets for select to anon, authenticated
  using (published or public.is_site_admin());
create policy sheets_admin_insert on public.sheets for insert to authenticated
  with check (public.is_site_admin());
create policy sheets_admin_update on public.sheets for update to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());
create policy sheets_admin_delete on public.sheets for delete to authenticated
  using (public.is_site_admin());

-- PDF 위치는 별도 표에 두고 관리자만 본다 (구매자에게는 결제 확인 후 서버가 링크를 만들어 준다)
create table public.sheet_files (
  sheet_id uuid primary key references public.sheets (id) on delete cascade,
  pdf_path text not null,
  file_name text,
  file_size bigint,
  updated_at timestamptz not null default now()
);
create trigger sheet_files_touch_updated_at before update on public.sheet_files
  for each row execute function public.touch_updated_at();

alter table public.sheet_files enable row level security;
create policy sheet_files_admin on public.sheet_files for all to authenticated
  using (public.is_site_admin()) with check (public.is_site_admin());

-- 파일 저장소: 미리보기(공개), PDF(비공개)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('sheet-previews', 'sheet-previews', true, 5242880, array['image/webp', 'image/png', 'image/jpeg']),
  ('sheet-pdfs', 'sheet-pdfs', false, 52428800, array['application/pdf']);

create policy "sheet previews admin" on storage.objects for all to authenticated
  using (bucket_id = 'sheet-previews' and public.is_site_admin())
  with check (bucket_id = 'sheet-previews' and public.is_site_admin());
create policy "sheet pdfs admin" on storage.objects for all to authenticated
  using (bucket_id = 'sheet-pdfs' and public.is_site_admin())
  with check (bucket_id = 'sheet-pdfs' and public.is_site_admin());
