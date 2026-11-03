-- 메인 페이지 악보 목록: 205곡 전부(공개 전 곡 포함)를 보여 주기 위한 읽기 전용 목록.
-- sheets 표는 공개(published)된 곡만 누구나 읽을 수 있어서, 목록에 필요한 칸만 따로 내보낸다.
-- PDF·설명 등 다른 칸은 내보내지 않는다. on_sale = 사이트에서 바로 살 수 있는 곡(공개된 곡).
-- 2026-11-03 적용 (migration: sheet_catalog)
create or replace function public.sheet_catalog()
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
    updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
    select s.id, s.title, s.artist, s.style, s.genre, s.difficulty, s.price,
           s.youtube_id, s.fullscore_code, coalesce(s.fullscore_orders, 0), s.published, s.updated_at
    from public.sheets s
    order by s.published desc, s.fullscore_code desc nulls last;
$$;

revoke all on function public.sheet_catalog() from public;
grant execute on function public.sheet_catalog() to anon, authenticated;
