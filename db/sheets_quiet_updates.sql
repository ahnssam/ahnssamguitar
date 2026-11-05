-- 가격·난이도(와 풀스코어 주문수)만 바꾼 건 수정 시각(updated_at)을 그대로 둔다.
-- 메인 '새로 나온 악보'가 updated_at 순서라, 악보관리 목록에서 가격·난이도만 고쳐도 맨 앞으로 올라가던 것을 막는다.
-- 그 밖의 칸(PDF·미리보기·커버·제목·공개 등)이 바뀌면 예전처럼 지금 시각으로 바뀐다.
create or replace function public.sheets_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  quiet constant text[] := array['price', 'difficulty', 'fullscore_orders', 'updated_at'];
begin
  if (to_jsonb(new) - quiet) = (to_jsonb(old) - quiet) then
    new.updated_at := old.updated_at;
  else
    new.updated_at := now();
  end if;
  return new;
end $$;

drop trigger if exists sheets_touch_updated_at on public.sheets;
create trigger sheets_touch_updated_at before update on public.sheets
  for each row execute function public.sheets_touch_updated_at();
