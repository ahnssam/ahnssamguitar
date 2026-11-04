-- profiles.email 숨기기: 공개 키(anon)나 로그인 회원(authenticated)이 /rest/v1/profiles?select=email 로 회원 이메일을 읽지 못하게 한다.
-- 표 전체 SELECT 를 거두고, email 을 뺀 열만 다시 준다 (표 권한이 있으면 열 하나만 revoke 해도 안 막힌다).
-- 화면은 nickname·profile_image_url·is_deleted 만 읽는다 (auth.js, ranking, requests.html, rank_* 뷰).
-- email 은 handle_new_user·delete_my_account(security definer) 만 쓰고, 운영 계정 판별은 auth.jwt() 의 email 이라 영향 없다.
-- 주의: 이제 profiles?select=* 는 권한 오류가 난다. 필요한 열만 골라 읽을 것. profiles 에 새 열을 만들면 아래 grant 에 더해야 읽힌다.
-- 2026-11-05 적용

revoke select on public.profiles from anon, authenticated;
grant select (id, nickname, created_at, updated_at, profile_image_url, is_deleted, last_active_at)
  on public.profiles to anon, authenticated;
