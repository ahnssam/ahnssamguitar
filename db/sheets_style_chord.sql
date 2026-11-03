-- 1) 악보 종류에 '코드악보'(chord)를 넣는다: 한 장짜리 코드 진행표(기타 반주 메이커로 만든 것), 기본 1,500원.
alter table public.sheets drop constraint sheets_style_check;
alter table public.sheets add constraint sheets_style_check
  check (style in ('acoustic', 'electric', 'fingerstyle', 'solo', 'chord', 'bass', 'other'));

-- 2) 기타솔로는 이제 종류로 보이니 제목에서 [기타솔로] 를 뺀다. 같은 곡 예전 판은 (연도 버전)으로 구분.
update public.sheets set title = regexp_replace(title, '\s*\[기타솔로\]', '')
  where fullscore_code in ('2501210040', '2501210032', '2501210031', '2404110064', '2402160029');
update public.sheets set title = regexp_replace(title, '\s*\[기타솔로\]', '') || ' (2023 버전)' where fullscore_code = '2307130024';
update public.sheets set title = regexp_replace(title, '\s*\[기타솔로\]', '') || ' (2024 버전)' where fullscore_code = '2402160007';
update public.sheets set title = 'Realize (인트로 + 솔로)' where fullscore_code = '2406170129';
update public.sheets set title = 'Pretender' where fullscore_code = '2311230032';
update public.sheets set title = 'Everything (인트로)' where fullscore_code = '2301100023';
