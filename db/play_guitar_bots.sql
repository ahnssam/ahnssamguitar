-- 기타 키우기 봇 40명 (2026-11-15 사용자: "지금은 어차피 사람 아무도 없으니까 봇을 좀 만들어서 넣어줘")
--   랭킹(최고 무기·모은 돈)과 배틀 '오늘의 상대'에 사람처럼 보인다. 표 구조는 그대로 — 줄(데이터)만 넣는다.
--   봇 표시: key_hash = sha256('bot:ahnssam:<번호>') — 표의 검사(64자리 hex)를 지키면서, ':' 가 들어가 있어
--         진짜 사람이 쓰는 열쇠(play_guitar_hash 는 영문·숫자·_·- 만 받음)로는 절대 같은 값이 안 나온다. 파이트 넘버는 트리거가 무작위 6자리로 준다.
--   봇인지 보는 법:  key_hash in (select encode(sha256(convert_to('bot:ahnssam:' || g, 'UTF8')), 'hex') from generate_series(1, 40) g)
--   단계는 +0~+16(1위는 사람이 차지할 수 있게 +17 위로는 안 넣음). 모은 돈은 그 단계 판매가에 맞춰 대충.
--   배틀하면 봇의 방어 승패(def_wins·def_losses)도 서버가 그대로 센다.
--   주의: 상대 목록은 30일 안에 들어온 사람만 보여서(play_guitar_opponents), 봇도 30일쯤 지나면 상대 목록에서 빠진다(랭킹엔 남음).
--         계속 두려면 updated_at 을 새로 바꾸면 된다:
--           update public.play_guitar_players set updated_at = now() where key_hash in (select encode(sha256(convert_to('bot:ahnssam:' || g, 'UTF8')), 'hex') from generate_series(1, 40) g);
--   봇을 모두 지우려면:
--           delete from public.play_guitar_players where key_hash in (select encode(sha256(convert_to('bot:ahnssam:' || g, 'UTF8')), 'hex') from generate_series(1, 40) g);

with sell(lv, v) as (
    select (ord - 1)::int, v from unnest(array[0, 30, 60, 132, 321, 852, 2450, 7550, 24600, 83700, 292000, 1030000, 3580000, 12200000, 39700000, 122000000, 352000000]::bigint[]) with ordinality as t(v, ord)
), b(k, nick, fam, lv) as (values
    (1, '새벽 기타', 'acoustic', 0), (2, '코드F 정복중', 'strat', 1), (3, '텔레덕후', 'tele', 1), (4, '줄갈이 장인', 'strat', 2), (5, '블루스맨', 'lespaul', 2),
    (6, '카포 없인 못살아', 'acoustic', 3), (7, '스트로크왕', 'acoustic', 3), (8, '베이스는 사랑', 'bass', 3), (9, '퍼즈페달', 'superstrat', 4), (10, '와우와우', 'strat', 4),
    (11, '솔로 연습중', 'lespaul', 4), (12, '드롭D', 'superstrat', 5), (13, '하이게인', 'superstrat', 5), (14, '리프 장인', 'lespaul', 5), (15, '셔플리듬', 'tele', 6),
    (16, '트레몰로', 'strat', 6), (17, '빈티지러버', 'tele', 6), (18, '앰프는 마샬', 'lespaul', 7), (19, '레스폴 꿈나무', 'lespaul', 7), (20, '넥다이브', 'bass', 7),
    (21, '연습만이 살길', 'strat', 8), (22, '자정의 기타', 'acoustic', 8), (23, '오늘도 합주', 'bass', 8), (24, '버스킹 소년', 'acoustic', 9), (25, '통기타 여행', 'acoustic', 9),
    (26, '핑거스타일러', 'acoustic', 9), (27, '어쿠스틱 감성', 'acoustic', 10), (28, '슬랩 연습중', 'bass', 10), (29, '하모닉스', 'strat', 10), (30, '칠현기타', 'superstrat', 11),
    (31, '브릿지 뮤트', 'tele', 11), (32, '얼터네이트', 'superstrat', 12), (33, '태핑요정', 'superstrat', 12), (34, '기타 치는 곰', 'lespaul', 13), (35, '펜타토닉', 'strat', 13),
    (36, '아르페지오', 'acoustic', 14), (37, '스윕피킹', 'superstrat', 14), (38, '크로매틱', 'tele', 15), (39, '디스토션', 'lespaul', 16), (40, '클린톤', 'strat', 16)
), r as (
    select b.*, least(16, b.lv + case when b.k % 3 = 0 then 1 else 0 end) as top_lv,
           (b.k % 9) + random() as days, random() as r1, random() as r2
    from b
)
insert into public.play_guitar_players
    (key_hash, nickname, fam, lv, lv_at, best, wins, losses, def_wins, def_losses, hidden, created_at, updated_at, top_fam, top_lv, top_at, gold, gold_at)
select encode(sha256(convert_to('bot:ahnssam:' || r.k, 'UTF8')), 'hex'), r.nick, r.fam, r.lv,
       now() - make_interval(secs => (r.days * 86400)::int), r.top_lv,
       (r.lv * 1.4 + r.r1 * 6)::int, (r.lv * 0.9 + r.r2 * 6)::int, (r.r2 * 4)::int, (r.r1 * 4)::int, false,
       now() - make_interval(days => 6 + r.k % 12), now() - make_interval(secs => (r.days * 86400)::int),
       r.fam, r.top_lv, now() - make_interval(secs => ((r.days + 0.5) * 86400)::int),
       (500 + s.v * (1.2 + r.r1 * 2.5) + 900 * (6 + r.k % 12))::bigint, now() - make_interval(secs => (r.days * 86400)::int)
from r join sell s on s.lv = r.top_lv
on conflict (key_hash) do nothing;
