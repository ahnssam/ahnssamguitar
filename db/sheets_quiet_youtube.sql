-- 유튜브 영상(대표 youtube_id · 더 넣은 영상 youtube_more)만 바꾼 건 수정 시각(updated_at)을 그대로 둔다 (2026-11-11 사용자 요청).
-- 메인 '새로 나온 악보'·최신순이 사이트에 올린 순서(= updated_at)라서, 영상을 나중에 넣어도 그 곡이 맨 위로 올라가지 않게.
-- 지금 조용한 칸(가격·난이도·풀스코어 주문수·앨범 커버·묶기·합본·픽 — db/sheets_quiet_updates.sql 과 그 뒤에 더한 것)에 유튜브 두 칸을 더한다.
-- 그 밖의 칸(PDF·미리보기·제목·공개 등)이 같이 바뀌거나, 같은 값을 다시 저장하면 예전처럼 지금 시각으로 바뀐다.
create or replace function public.sheets_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  quiet constant text[] := array['price', 'difficulty', 'fullscore_orders', 'cover_path', 'song_key', 'version_key', 'bundle_pdf', 'pick_rank',
                                 'youtube_id', 'youtube_more', 'updated_at'];
begin
  if (to_jsonb(new) - quiet) = (to_jsonb(old) - quiet)
     and (new.price, new.difficulty, new.fullscore_orders, new.cover_path, new.song_key, new.version_key, new.bundle_pdf, new.pick_rank,
          new.youtube_id, new.youtube_more)
         is distinct from (old.price, old.difficulty, old.fullscore_orders, old.cover_path, old.song_key, old.version_key, old.bundle_pdf, old.pick_rank,
          old.youtube_id, old.youtube_more) then
    new.updated_at := old.updated_at;
  else
    new.updated_at := now();
  end if;
  return new;
end $$;
-- 트리거(sheets_touch_updated_at, before update)는 그대로 이 함수를 부른다.
