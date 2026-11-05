-- 같은 곡 다른 편곡 묶음 (예: 인생의 회전목마 (2021 편곡) / (2025 편곡) / (쉬운 편곡))
-- 2026-11-05 사용자 결정
--   · 묶음은 두 가지:
--       파트 묶음  = sheets.song_key    — 반주만·기타솔로처럼 함께 사는 구성, 함께 사면 500원 할인 (db/sheet_bundles.sql)
--       편곡 묶음  = sheets.version_key — 따로 파는 다른 편곡, 할인 없음 (이 파일)
--     한 악보가 둘 다에 들어갈 수 있다 (예: 나중에 "Holiday (2026 편곡)" 반주가 그 편곡의 솔로와 파트 묶음 + 예전 판과 편곡 묶음).
--   · 지금까지는 제목 끝 "(… 편곡)"을 보고 짐작했는데, 악보관리에서 직접 고를 수 있게 칸으로 둔다.
--     메인은 편곡 묶음을 한 줄로, 상세 페이지는 편곡 고르기 버튼, 악보관리는 묶음을 탭 1·2·3으로 편집한다.

alter table public.sheets add column if not exists version_key uuid;

-- 카포 (2026-11-05 사용자 결정: 악보관리의 '설명' 칸 대신 카포만 고른다). 비우면 카포 없음, 1~12 프렛.
-- Claude 가 올릴 때는 원본 .gp 의 카포 값을 자동으로 넣는다 (sheet-upload 스킬 gpinfo.py)
alter table public.sheets add column if not exists capo smallint check (capo between 1 and 12);
create index if not exists sheets_version_key_idx on public.sheets (version_key) where version_key is not null;

-- 묶기만 바꾼 건(song_key·version_key·bundle_pdf) '새로 나온 악보' 순서가 안 바뀌게 수정 시각을 그대로 둔다
-- (db/sheets_quiet_updates.sql 의 조용한 칸에 셋을 더함)
create or replace function public.sheets_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  quiet constant text[] := array['price', 'difficulty', 'fullscore_orders', 'cover_path', 'song_key', 'version_key', 'bundle_pdf', 'updated_at'];
begin
  if (to_jsonb(new) - quiet) = (to_jsonb(old) - quiet)
     and (new.price, new.difficulty, new.fullscore_orders, new.cover_path, new.song_key, new.version_key, new.bundle_pdf)
         is distinct from (old.price, old.difficulty, old.fullscore_orders, old.cover_path, old.song_key, old.version_key, old.bundle_pdf) then
    new.updated_at := old.updated_at;
  else
    new.updated_at := now();
  end if;
  return new;
end $$;

-- 메인 목록 함수에 version_key 추가 (돌려주는 칸이 바뀌어서 지우고 다시 만든다)
drop function if exists public.sheet_catalog();
create function public.sheet_catalog()
returns table (
    id uuid, title text, artist text, style text, genre text, difficulty smallint, price integer,
    youtube_id text, fullscore_code text, fullscore_orders integer, on_sale boolean, updated_at timestamptz,
    song_key uuid, kind text, cover_path text, version_key uuid
)
language sql
stable
security definer
set search_path = public
as $$
    select s.id, s.title, s.artist, s.style, s.genre, s.difficulty, s.price,
           s.youtube_id, s.fullscore_code, coalesce(s.fullscore_orders, 0), s.published, s.updated_at, s.song_key,
           s.kind, s.cover_path, s.version_key
    from public.sheets s
    order by s.published desc, s.fullscore_code desc nulls last;
$$;
grant execute on function public.sheet_catalog() to anon, authenticated;

-- 지금 제목으로 묶여 있던 편곡들을 칸으로 옮긴다 (위 트리거 덕분에 수정 시각은 그대로)
with g as (
    select id,
           lower(regexp_replace(normalize(title, nfc), '\s*\([^()]*편곡\)\s*$', '')) || '|' || normalize(coalesce(artist, ''), nfc) || '|' || style as k,
           title ~ '\([^()]*편곡\)\s*$' as tagged
    from public.sheets
),
keys as (
    select k, gen_random_uuid() as vk from g group by k having count(*) > 1 and bool_or(tagged)
)
update public.sheets s set version_key = keys.vk
from g join keys on keys.k = g.k
where s.id = g.id and s.version_key is null;
