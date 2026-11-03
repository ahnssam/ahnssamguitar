-- 악보 종류에 '기타솔로'(solo)를 다시 넣는다: 통기타·일렉기타·핑거스타일·기타솔로·베이스.
alter table public.sheets drop constraint sheets_style_check;
alter table public.sheets add constraint sheets_style_check
  check (style in ('acoustic', 'electric', 'fingerstyle', 'solo', 'bass', 'other'));

-- 기타솔로 악보 17곡을 일렉기타에서 기타솔로로.
-- 제목에 [기타솔로]·(Solo)가 붙은 곡 + 영상 제목이 '기타솔로 + TAB'인 1쪽 악보.
-- 노래 전체에 솔로까지 들어간 '(+기타솔로)' 두 곡(그대에게·질풍가도)은 일렉기타 그대로.
update public.sheets set style = 'solo' where fullscore_code in (
  '2501210040', -- Smoke on the Water [기타솔로]
  '2501210032', -- 너에게 난 나에게 넌 [기타솔로] (2025)
  '2501210031', -- Don't Look Back in Anger [기타솔로] (2025)
  '2406170129', -- Realize [인트로 + 기타솔로]
  '2404110064', -- 질풍가도 [기타솔로]
  '2402160029', -- Bohemian Rhapsody [기타솔로]
  '2402160007', -- Don't Look Back in Anger [기타솔로] (2024)
  '2311230032', -- Pretender (Solo)
  '2307130024', -- 너에게 난 나에게 넌 [기타솔로] (2023)
  '2301100023', -- Everything 인트로 기타솔로
  '2507220062', -- 너에게 닿기를 (영상: 기타솔로 + TAB)
  '2406250045', -- 그대에게 (영상: 그대에게 [기타솔로])
  '2311090014', -- 400km (영상: 기타솔로 + TAB)
  '2306280010', -- 나에게로 떠나는 여행 (2023, 영상: 기타솔로)
  '2301250022', -- 쪽빛제곱 (영상: 인트로 기타솔로 + TAB)
  '2301250020', -- 주마등 (영상: 기타솔로 + TAB)
  '2301200017'  -- 말해줘 Say it (영상: 기타솔로)
);
