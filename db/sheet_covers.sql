-- 악보 썸네일 새 디자인(앨범 커버 + 악보 미리보기 + 아래 곡선 색 면)에 쓸 앨범 커버
-- 2026-11-05 적용 (migration: sheet_covers)
--   · sheets.cover_path = 공개 저장소 sheet-covers 안의 파일 이름 (<악보 id>.webp, 정사각형 600px). 악보관리 편집창에서 올린다.
--   · 같은 곡으로 묶인 악보(song_key)는 하나만 올려도 메인 썸네일이 같이 쓴다.
--   · 메인 목록 함수에 kind(편곡 배지)와 cover_path 를 더한다 (돌려주는 칸이 바뀌어서 지우고 다시 만든다).

alter table public.sheets add column if not exists cover_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('sheet-covers', 'sheet-covers', true, 5242880, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "sheet covers admin" on storage.objects;
create policy "sheet covers admin" on storage.objects for all to authenticated
  using (bucket_id = 'sheet-covers' and public.is_site_admin())
  with check (bucket_id = 'sheet-covers' and public.is_site_admin());

drop function if exists public.sheet_catalog();
create function public.sheet_catalog()
returns table (
    id uuid,
    title text,
    artist text,
    style text,
    genre text,
    difficulty smallint,
    price integer,
    youtube_id text,
    fullscore_code text,
    fullscore_orders integer,
    on_sale boolean,
    updated_at timestamptz,
    song_key uuid,
    kind text,
    cover_path text
)
language sql
stable
security definer
set search_path = public
as $$
    select s.id, s.title, s.artist, s.style, s.genre, s.difficulty, s.price,
           s.youtube_id, s.fullscore_code, coalesce(s.fullscore_orders, 0), s.published, s.updated_at, s.song_key,
           s.kind, s.cover_path
    from public.sheets s
    order by s.published desc, s.fullscore_code desc nulls last;
$$;
revoke all on function public.sheet_catalog() from public;
grant execute on function public.sheet_catalog() to anon, authenticated;
