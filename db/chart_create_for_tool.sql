-- 로컬 악보검색(학생관리 '악보' 탭) 코드악보에서 새 곡 만들기 · 홈페이지 공개 켜고 끄기 (2026-11-09)
--   로그인 없이 쓰는 토큰 함수들(charts_for_tool · save_chart_for_tool 등)과 같은 방식·같은 토큰이다.
--   앱 안에서는 구글 로그인이 막혀서(403) 로그인 대신 이 통로로 새 곡을 DB 에 넣는다.
--
-- ※ 이 저장소는 공개라 토큰을 여기 적지 않는다.
--   적용할 때 '<<TOOL_TOKEN>>' 두 곳을 실제 토큰(레슨 폴더 '악보검색_토큰.txt' 값)으로 바꿔서 실행한다.

-- 새 곡 추가 — 만든 곡은 홈페이지에 바로 안 보이게(is_public=false) 두고, 소유자는 운영 계정.
--   (운영 계정으로 홈페이지에 로그인하면 '나만 보이는' 곡으로 보인다. 완성되면 공개로 바꾼다.)
create or replace function public.create_chart_for_tool(token text, data jsonb)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare new_id uuid; owner uuid;
begin
  if token <> '<<TOOL_TOKEN>>' then
    return null;
  end if;
  if coalesce(btrim(data->>'name'), '') = '' then
    return null;
  end if;
  select u.id into owner from auth.users u where lower(u.email) = 'steveq2568@gmail.com' limit 1;
  insert into public.presets (name, artist, bpm, bars, rhythm, capo, difficulty,
                              bass_style, piano_style, chords_a, chords_b, sequencer_pattern,
                              is_public, user_id)
  values (btrim(data->>'name'),
          nullif(btrim(coalesce(data->>'artist', '')), ''),
          coalesce((data->>'bpm')::int, 90),
          coalesce((data->>'bars')::int, 4),
          coalesce(data->>'rhythm', '8beat'),
          nullif(data->>'capo', ''),
          (data->>'difficulty')::int,
          coalesce(data->>'bass_style', 'default'),
          coalesce(data->>'piano_style', 'quarter'),
          coalesce(data->'chords_a', '{}'::jsonb),
          coalesce(data->'chords_b', '{}'::jsonb),
          data->'sequencer_pattern',
          false,
          owner)
  returning id into new_id;
  return new_id;
end;
$function$;

-- 홈페이지 공개 켜고 끄기
create or replace function public.set_chart_public_for_tool(token text, chart_id uuid, is_public boolean)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if token <> '<<TOOL_TOKEN>>' then
    return false;
  end if;
  update public.presets p
     set is_public = set_chart_public_for_tool.is_public,
         updated_at = now()
   where p.id = set_chart_public_for_tool.chart_id;
  return found;
end;
$function$;
