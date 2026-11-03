-- 악보 종류를 통기타·일렉기타·핑거스타일·베이스 4가지로 정리하고,
-- 풀스코어에서 옮겨 온 악보를 다시 찾을 수 있게 풀스코어 상품 코드를 남긴다.
update public.sheets set style = 'electric' where style = 'solo';

alter table public.sheets drop constraint sheets_style_check;
alter table public.sheets add constraint sheets_style_check
  check (style in ('acoustic', 'electric', 'fingerstyle', 'bass', 'other'));

alter table public.sheets add column if not exists fullscore_code text unique;
