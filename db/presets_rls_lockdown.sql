-- 반주 도구 코드악보 프리셋(public.presets) 쓰기 막기 (2026-11-09 적용함)
--   적용 뒤 확인: anon 은 읽기 31곡만, 고치기·넣기는 permission denied / 다른 로그인 사용자는 남의 곡 0줄,
--   공개로 넣기는 RLS 오류 / 운영 계정은 고치기·넣기 됨. (시험한 변경은 모두 되돌림)
--
-- 왜: 지금은 정책 presets_insert / presets_update / presets_delete 가 모두 `true` 이고,
--     anon(로그인 안 한 사람)에게도 INSERT·UPDATE·DELETE·TRUNCATE 권한이 있다.
--     사이트 소스에 있는 공개 키만 있으면 누구나 공개 곡을 고치거나 지우고, 아무 곡이나 넣을 수 있다.
--     로그인한 일반 사용자도 남의 곡을 고치거나 지울 수 있다.
--
-- 바꾼 뒤:
--   읽기   — 그대로. 공개 곡(is_public)은 누구나, 비공개 곡은 그 주인만 (presets_select 는 안 건드린다).
--   추가   — 운영 계정은 아무 곡이나. 다른 로그인 사용자는 '내 것 + 나만 보기(is_public=false)'로만.
--   고치기 — 운영 계정은 모든 곡. 다른 로그인 사용자는 자기 곡만, 그리고 '나만 보기'로만.
--   지우기 — 운영 계정은 모든 곡. 다른 로그인 사용자는 자기 곡만.
--   로그인 안 한 사람(anon)은 읽기만 — 정책도 권한(grant)도 둘 다 막는다.
--   ※ '모두에게 공개'로 만드는 건 운영 계정만 된다. 아무 구글 계정이나 로그인해서
--     모든 방문자 목록에 곡을 띄우지 못하게. (지금 운영 계정 아닌 사람이 가진 곡은 0곡)
--
-- 그대로 되는 것 (tools.html, 운영 계정 로그인 상태)
--   - 공용저장: 덮어쓰기(update) · 새 곡 추가(insert, is_public=true, user_id=운영 계정)
--   - 목록의 연필 → 곡 정보 수정 폼(update, 소유자 없는 공용 곡을 '나만 보기'로 바꾸면 user_id=운영 계정)
--   - 수정 폼의 삭제(delete)
--   - 일반 사용자의 '내 프리셋' 10칸은 다른 표(user_presets)라 상관없다.
--   - 로컬 악보검색 툴의 토큰 함수(charts_for_tool · chart_detail_for_tool · save_chart_for_tool,
--     새로 만드는 create_chart_for_tool · set_chart_public_for_tool)는 security definer(postgres 소유)라
--     RLS·권한과 상관없이 그대로 된다.
--
-- 프리셋 빌더(presets-builder.html)
--   - 예전에는 로그인 없이 공개 키(anon)로 저장·삭제했다(4자리 비번은 화면에서만 확인).
--   - 이 SQL 전에 빌더를 운영 계정 로그인으로 저장·삭제하게 고쳤다(같은 날). 목록은 예전처럼 공개 곡만.
--
-- 지금 데이터 (2026-11-09): 433곡 = 운영 계정 411곡(공개 9 · 비공개 402) + 소유자 없음 22곡(모두 공개).

begin;

-- 1) 표 권한: anon 은 읽기(SELECT)만 남긴다.
--    TRUNCATE 는 RLS 를 거치지 않고 표를 통째로 비우므로 로그인 사용자에게서도 뺀다.
revoke insert, update, delete, truncate on public.presets from anon;
revoke truncate on public.presets from authenticated;

-- 2) 쓰기 정책을 운영 계정 / 자기 곡으로 좁힌다. (운영 계정 판별은 다른 표와 같은 public.is_site_admin())
drop policy if exists presets_insert on public.presets;
drop policy if exists presets_update on public.presets;
drop policy if exists presets_delete on public.presets;

create policy presets_insert on public.presets
  for insert to authenticated
  with check (
    (select public.is_site_admin())
    or (user_id = (select auth.uid()) and is_public = false)
  );

create policy presets_update on public.presets
  for update to authenticated
  using (
    (select public.is_site_admin())
    or user_id = (select auth.uid())
  )
  with check (
    (select public.is_site_admin())
    or (user_id = (select auth.uid()) and is_public = false)
  );

create policy presets_delete on public.presets
  for delete to authenticated
  using (
    (select public.is_site_admin())
    or user_id = (select auth.uid())
  );

commit;

-- ─── 적용 뒤 확인 ───────────────────────────────────────────────
-- select policyname, cmd, roles, qual, with_check from pg_policies
--  where schemaname = 'public' and tablename = 'presets' order by 1;
-- select grantee, string_agg(privilege_type, ',' order by privilege_type)
--   from information_schema.role_table_grants
--  where table_schema = 'public' and table_name = 'presets' and grantee in ('anon', 'authenticated')
--  group by grantee;
--   → anon: REFERENCES,SELECT,TRIGGER / authenticated: DELETE,INSERT,REFERENCES,SELECT,TRIGGER,UPDATE

-- ─── 되돌리기 (문제가 생겼을 때만, 예전처럼 다 열림) ─────────────────
-- begin;
-- grant insert, update, delete, truncate on public.presets to anon;
-- grant truncate on public.presets to authenticated;
-- drop policy if exists presets_insert on public.presets;
-- drop policy if exists presets_update on public.presets;
-- drop policy if exists presets_delete on public.presets;
-- create policy presets_insert on public.presets for insert with check (true);
-- create policy presets_update on public.presets for update using (true) with check (true);
-- create policy presets_delete on public.presets for delete using (true);
-- commit;
