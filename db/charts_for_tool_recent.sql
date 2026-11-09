-- 로컬 악보검색(학생관리 '악보' 탭) 코드악보 목록을 '최근에 고치거나 추가한 순'으로 보이려고 (2026-11-09)
--   charts_for_tool 이 날짜 두 개(created_at, updated_at)도 돌려주게 한다. 나머지는 그대로.
--   돌려주는 열이 바뀌어 create or replace 로는 안 돼서 지웠다가 다시 만든다(실행 권한도 원래대로 다시 준다).
--
-- ※ 이 저장소는 공개라 토큰을 여기 적지 않는다.
--   적용할 때 '<<TOOL_TOKEN>>' 을 실제 토큰(레슨 폴더 '악보검색_토큰.txt' 값)으로 바꿔서 실행한다.

begin;

drop function if exists public.charts_for_tool(text);

create function public.charts_for_tool(token text)
returns table(id uuid, name text, artist text, bpm integer, bars integer, capo text, difficulty integer,
              genre text, rhythm text, bass_style text, piano_style text, is_public boolean, sort_order integer,
              chords_a jsonb, chords_b jsonb, sequencer_pattern jsonb,
              created_at timestamptz, updated_at timestamptz)
language sql
security definer
set search_path to 'public'
as $function$
  select p.id, p.name, p.artist, p.bpm, p.bars, p.capo,
         p.difficulty, p.genre, p.rhythm, p.bass_style, p.piano_style,
         p.is_public, p.sort_order,
         p.chords_a, p.chords_b, p.sequencer_pattern,
         p.created_at, p.updated_at
  from public.presets p
  where token = '<<TOOL_TOKEN>>'
  order by lower(p.name);
$function$;

revoke all on function public.charts_for_tool(text) from public;
grant execute on function public.charts_for_tool(text) to anon, authenticated, service_role;

commit;
