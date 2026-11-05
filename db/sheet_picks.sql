-- 안쌤의 픽 (2026-11-06 사용자 요청)
--   · 메인 맨 위 왼쪽 칸 '안쌤의 픽': 사용자가 고른 곡만, 최대 5곡, 순위대로(1이 맨 위). 공개한 곡만 보인다.
--   · 악보관리 목록에서 별표 1~5로 순위를 매긴다. 한 순위에는 한 곡만 — 다른 곡에 같은 순위를 주면
--     악보관리가 먼저 그 곡의 순위를 비우고 새 곡에 넣는다 (아래 유일 색인이 겹치지 않게 막는다).

alter table public.sheets add column if not exists pick_rank smallint check (pick_rank between 1 and 5);
create unique index if not exists sheets_pick_rank_key on public.sheets (pick_rank) where pick_rank is not null;

-- 픽 순위만 바꾼 건 '새로 나온 악보' 순서가 안 바뀌게 수정 시각을 그대로 둔다
-- (db/sheet_versions.sql 의 조용한 칸에 pick_rank 를 더함)
create or replace function public.sheets_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  quiet constant text[] := array['price', 'difficulty', 'fullscore_orders', 'cover_path', 'song_key', 'version_key', 'bundle_pdf', 'pick_rank', 'updated_at'];
begin
  if (to_jsonb(new) - quiet) = (to_jsonb(old) - quiet)
     and (new.price, new.difficulty, new.fullscore_orders, new.cover_path, new.song_key, new.version_key, new.bundle_pdf, new.pick_rank)
         is distinct from (old.price, old.difficulty, old.fullscore_orders, old.cover_path, old.song_key, old.version_key, old.bundle_pdf, old.pick_rank) then
    new.updated_at := old.updated_at;
  else
    new.updated_at := now();
  end if;
  return new;
end $$;

-- 메인 목록 함수에 pick_rank 추가 (돌려주는 칸이 바뀌어서 지우고 다시 만든다)
drop function if exists public.sheet_catalog();
create function public.sheet_catalog()
returns table (
    id uuid, title text, artist text, style text, genre text, difficulty smallint, price integer,
    youtube_id text, fullscore_code text, fullscore_orders integer, on_sale boolean, updated_at timestamptz,
    song_key uuid, kind text, cover_path text, version_key uuid, pick_rank smallint
)
language sql
stable
security definer
set search_path = public
as $$
    select s.id, s.title, s.artist, s.style, s.genre, s.difficulty, s.price,
           s.youtube_id, s.fullscore_code, coalesce(s.fullscore_orders, 0), s.published, s.updated_at, s.song_key,
           s.kind, s.cover_path, s.version_key, s.pick_rank
    from public.sheets s
    order by s.published desc, s.fullscore_code desc nulls last;
$$;
revoke all on function public.sheet_catalog() from public;
grant execute on function public.sheet_catalog() to anon, authenticated;
