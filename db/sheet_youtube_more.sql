-- 악보 하나에 유튜브 영상을 여러 개 걸 수 있게 (2026-11-10 사용자 요청)
-- youtube_id 는 지금처럼 대표 영상(메인 목록·'유튜브 없음'·'악보영상 뭐찍지?'가 보는 것) 그대로 두고,
-- 더 거는 영상만 youtube_more 에 순서대로 넣는다. 상세 페이지는 대표 영상 → 더 건 영상 순으로 보여 준다.
-- 값은 유튜브 영상 ID(11자)만. 비우면 빈 배열.
alter table public.sheets
  add column if not exists youtube_more text[] not null default '{}';
