-- 기타 키우기 — 랭킹 탭에서 '내 주변 순위' (2026-11-23 사용자)
--   "랭킹 눌렀을 때 너무 바로 1, 2, 3등이 보여지는 거 자체가 박탈감 — 다른 모바일 게임도 바로 1, 2, 3등이 보여지진 않았다"
--   → 랭킹 탭은 내 순위 + 내 위아래 몇 명이 먼저, 1·2·3위와 TOP 20 은 '전체 순위 보기'를 눌러야 보인다.
--   이 함수는 그 '내 위아래' 줄을 준다. 순서 매기는 법은 play_guitar_rank 와 똑같다(같은 단계·같은 돈이면 먼저 닿은 사람이 위).
--   p_n = 위·아래로 몇 명(1~10, 기본 3). 맨 위·맨 아래 근처면 반대쪽에서 더 채워 2·p_n+1 줄이 되게 한다.
--   내 줄이 없으면(대표 기타가 없음·숨김·시험 브라우저) 아무것도 안 준다. 화면은 이 함수가 없으면(적용 전) play_guitar_rank 의 TOP 20 안에서만 주변을 보여 준다.

create or replace function public.play_guitar_rank_near(p_kind text, p_key text default null, p_n integer default 3)
returns table (id bigint, pos integer, nickname text, fam text, lv smallint, gold bigint, me boolean, players integer)
language sql stable security definer set search_path = ''
as $$
    with b as (
        select p.id as rid, p.fight_no::bigint as id, p.nickname, p.top_fam as fam, p.top_lv as lv, p.gold,
               (row_number() over (order by
                    case when p_kind = 'gold' then p.gold else p.top_lv end desc,
                    case when p_kind = 'gold' then p.gold_at else p.top_at end,
                    p.id))::integer as pos
        from public.play_guitar_players p
        where not p.hidden and (p_kind = 'gold' or p.top_fam is not null)
    ),
    n as (select count(*)::integer as c from b),
    k as (select greatest(1, least(10, coalesce(p_n, 3))) as v),
    mine as (
        select b.rid, b.pos from b
        where b.rid = (select p.id from public.play_guitar_players p where p.key_hash = public.play_guitar_hash(p_key) and not p.hidden)
    ),
    w as (   -- 보여 줄 칸: 내 위아래 k명, 끝에 붙으면 반대쪽으로 더
        select greatest(1, least(m.pos - k.v, n.c - 2 * k.v)) as lo
        from mine m, k, n
    )
    select b.id, b.pos, b.nickname, b.fam, b.lv, b.gold, b.rid = (select rid from mine), n.c
    from b, n, w, k
    where p_kind in ('top', 'gold') and b.pos between w.lo and w.lo + 2 * k.v
    order by b.pos
$$;
revoke all on function public.play_guitar_rank_near(text, text, integer) from public;
grant execute on function public.play_guitar_rank_near(text, text, integer) to anon, authenticated;
