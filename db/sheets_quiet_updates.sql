-- 가격·난이도·풀스코어 주문수·앨범 커버만 바꾼 건 수정 시각(updated_at)을 그대로 둔다.
-- 메인 '새로 나온 악보'가 updated_at 순서라, 악보관리에서 가격·난이도를 고치거나 커버만 바꿔도 맨 앞으로 올라가던 것을 막는다.
-- (커버는 올릴 때마다 새 파일 이름이라 주소가 바뀌어 새 그림이 바로 보인다 — admin/sheets.html freshPath)
-- 그 밖의 칸(PDF·미리보기·제목·공개 등)이 바뀌거나, 같은 값을 다시 저장하면(같은 이름으로 다시 올린 미리보기 등)
-- 예전처럼 지금 시각으로 바뀐다 — 그림 주소의 ?v= 가 바뀌어야 새 그림이 보인다.
create or replace function public.sheets_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  quiet constant text[] := array['price', 'difficulty', 'fullscore_orders', 'cover_path', 'updated_at'];
begin
  if (to_jsonb(new) - quiet) = (to_jsonb(old) - quiet)
     and (new.price, new.difficulty, new.fullscore_orders, new.cover_path)
         is distinct from (old.price, old.difficulty, old.fullscore_orders, old.cover_path) then
    new.updated_at := old.updated_at;
  else
    new.updated_at := now();
  end if;
  return new;
end $$;

drop trigger if exists sheets_touch_updated_at on public.sheets;
create trigger sheets_touch_updated_at before update on public.sheets
  for each row execute function public.sheets_touch_updated_at();
