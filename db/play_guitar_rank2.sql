-- 기타 키우기 — 랭킹 탭(최고 무기 · 모은 돈)과 운영 계정 시험 처리 (2026-11-13 사용자)
--   1) "배틀 안에 있는 랭킹은 메뉴 맨 오른쪽 '랭킹'으로. 가지고 있는 제일 높은 무기 랭킹 하나, 지금까지 쌓은 돈 랭킹 하나"
--      · 최고 무기 = 지금 가진 기타(작업대·벽·창고) 중 가장 높은 단계. 앰프·멀티는 무기가 아니라 빼고(대표도 못 되니까),
--        같으면 그 단계에 먼저 닿은 사람이 위. 팔거나 부서지면 내려간다.
--      · 모은 돈 = 지금까지 번 골드 합계(시작 골드 + 판 돈 + 배틀 + 출석). 상점에서 써도 줄지 않는다.
--      · 둘 다 브라우저가 보내는 값을 믿는다(월드컵·퀴즈·대표 기타와 같은 결정). 이상해지면 그때 막는다.
--   2) "내 구글 계정으로 로그인하면 시험 계정으로 — 뭘 아무리 만들고 뭘 해도 랭킹에 반영되지 않게.
--       누가 000000 으로 배틀을 걸면 +10 스트랫이 주 무기로"
--      · 운영 계정(is_site_admin)으로 올리면 무엇을 보내든 서버가 '+10 스트랫 · 최고 무기 +10 스트랫 · 모은 돈 0'으로 적는다(숨김·0번은 그대로).
--      · 운영 계정이 건 배틀은 승패만 굴리고 아무 숫자도 남기지 않는다(상대 기록도 그대로). 화면도 운영 계정이면 브라우저 안에서만 겨룬다.
--      · 남이 0번에 건 배틀은 그 사람 기록에는 남는다(그 사람의 배틀이니까).
--   예전 함수(play_guitar_top·대표 기타 단계 순)는 캐시에 남은 예전 화면을 위해 그대로 둔다.

alter table public.play_guitar_players
    add column if not exists top_fam text check (top_fam is null or top_fam in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass')),
    add column if not exists top_lv smallint not null default 0 check (top_lv between 0 and 20),
    add column if not exists top_at timestamptz not null default now(),
    add column if not exists gold bigint not null default 0 check (gold >= 0),
    add column if not exists gold_at timestamptz not null default now();

-- 이미 있는 줄: 최고 무기는 대표 기타로 채워 둔다(다음에 들어오면 브라우저가 진짜 값을 보낸다)
update public.play_guitar_players p
   set top_fam = case when p.fam in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass') then p.fam end,
       top_lv = case when p.fam in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass') then p.lv else 0 end,
       top_at = p.lv_at
 where p.top_fam is null;
-- 운영 계정 줄(숨김)은 +10 스트랫으로
update public.play_guitar_players p
   set fam = 'strat', lv = 10, best = 10, top_fam = 'strat', top_lv = 10, gold = 0
 where p.hidden;

create index if not exists play_guitar_players_rank_top on public.play_guitar_players (top_lv desc, top_at, id) where not hidden and top_fam is not null;
create index if not exists play_guitar_players_rank_gold on public.play_guitar_players (gold desc, gold_at, id) where not hidden;

-- 대표 기타 올리기 + 최고 무기·모은 돈. 예전 화면(인자 5개)도 그대로 불러지게 새 인자는 기본값 null(= 그대로 둠)
drop function if exists public.play_guitar_save(text, text, text, integer, integer);
create or replace function public.play_guitar_save(p_key text, p_nick text, p_fam text, p_lv integer, p_best integer default null,
                                                   p_top_fam text default null, p_top_lv integer default null, p_gold bigint default null)
returns table (id bigint, pos integer, players integer, hidden boolean)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
    v_hash text := public.play_guitar_hash(p_key);
    v_nick text := btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g'));
    v_admin boolean := public.is_site_admin();
    v_no integer;
    v_hidden boolean;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    if coalesce(p_fam, '') not in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass', 'amp', 'multi') then raise exception 'bad_fam'; end if;
    if p_lv is null or p_lv not between 0 and 20 then raise exception 'bad_lv'; end if;
    if p_top_fam is not null and p_top_fam not in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass') then raise exception 'bad_fam'; end if;
    if p_top_lv is not null and p_top_lv not between 0 and 20 then raise exception 'bad_lv'; end if;
    if p_gold is not null and p_gold not between 0 and 1000000000000000 then raise exception 'bad_gold'; end if;
    if v_nick = '' then v_nick := '익명'; end if;
    if char_length(v_nick) > 12 then raise exception 'long'; end if;
    -- Postgres 정규식의 단어 경계는 \y (\b 는 백스페이스라 '.com' 이 안 걸린다)
    if v_nick ~* '(https?:|www\.|\.(com|net|kr|co|io|me|ly)\y)' then raise exception 'link'; end if;

    -- 운영 계정(시험): 무엇을 보내든 +10 스트랫 (2026-11-13 사용자)
    if v_admin then
        p_fam := 'strat'; p_lv := 10; p_best := 10; p_top_fam := 'strat'; p_top_lv := 10; p_gold := 0;
    end if;

    if not exists (select 1 from public.play_guitar_players p where p.key_hash = v_hash)
       and (select count(*) from public.play_guitar_players p where p.created_at > now() - interval '1 minute') >= 60 then
        raise exception 'busy';
    end if;

    insert into public.play_guitar_players as p (key_hash, nickname, fam, lv, best, hidden, top_fam, top_lv, gold)
    values (v_hash, v_nick, p_fam, p_lv, greatest(p_lv, least(coalesce(p_best, 0), 20)), v_admin,
            coalesce(p_top_fam, case when p_fam in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass') then p_fam end),
            coalesce(p_top_lv, case when p_fam in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass') then p_lv else 0 end),
            coalesce(p_gold, 0))
    on conflict (key_hash) do update
        set nickname = excluded.nickname,
            fam = excluded.fam,
            lv_at = case when p.lv <> excluded.lv or p.fam <> excluded.fam then now() else p.lv_at end,
            lv = excluded.lv,
            best = greatest(p.best, excluded.best),
            hidden = p.hidden or excluded.hidden,
            top_at = case when p_top_lv is not null and (p.top_lv <> p_top_lv or p.top_fam is distinct from p_top_fam) then now() else p.top_at end,
            top_fam = case when p_top_lv is not null then p_top_fam else p.top_fam end,
            top_lv = coalesce(p_top_lv, p.top_lv),
            gold_at = case when p_gold is not null and p.gold <> p_gold then now() else p.gold_at end,
            gold = coalesce(p_gold, p.gold),
            updated_at = now()
    returning p.fight_no, p.hidden into v_no, v_hidden;

    -- 숨김(운영 계정) 줄이 되었으면 다시 한 번 +10 스트랫으로(로그인 전에 이 열쇠로 올린 줄이었을 때)
    if v_hidden and not v_admin then
        update public.play_guitar_players p
           set fam = 'strat', lv = 10, best = 10, top_fam = 'strat', top_lv = 10, gold = 0
         where p.key_hash = v_hash;
    end if;

    return query
        select v_no::bigint,
               case when v_hidden then null else (
                   select r.pos from (
                       select q.fight_no, (row_number() over (order by q.top_lv desc, q.top_at, q.id))::integer as pos
                       from public.play_guitar_players q where not q.hidden and q.top_fam is not null
                   ) r where r.fight_no = v_no) end,
               (select count(*)::integer from public.play_guitar_players p where not p.hidden),
               v_hidden;
end;
$$;
revoke all on function public.play_guitar_save(text, text, text, integer, integer, text, integer, bigint) from public;
grant execute on function public.play_guitar_save(text, text, text, integer, integer, text, integer, bigint) to anon, authenticated;

-- 랭킹 탭: p_kind = 'top'(최고 무기) | 'gold'(모은 돈). 1~20위 + (열쇠를 주면) 내 줄. id = 파이트 넘버. 숨긴 줄(운영 계정)은 안 나온다
create or replace function public.play_guitar_rank(p_kind text, p_key text default null)
returns table (id bigint, pos integer, nickname text, fam text, lv smallint, gold bigint, me boolean, players integer)
language sql
stable
security definer
set search_path = ''
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
    mine as (select p.id as rid from public.play_guitar_players p where p.key_hash = public.play_guitar_hash(p_key) and not p.hidden),
    n as (select count(*)::integer as c from b)
    select b.id, b.pos, b.nickname, b.fam, b.lv, b.gold, b.rid in (select rid from mine), n.c
    from b, n
    where p_kind in ('top', 'gold') and (b.pos <= 20 or b.rid in (select rid from mine))
    order by b.pos
$$;
revoke all on function public.play_guitar_rank(text, text) from public;
grant execute on function public.play_guitar_rank(text, text) to anon, authenticated;

-- 배틀: 운영 계정(숨김 줄)이 건 배틀은 승패만 굴리고 아무 숫자도 남기지 않는다. 나머지는 db/play_guitar_fight_no.sql 그대로(하루 5번)
create or replace function public.play_guitar_battle(p_key text, p_opp bigint)
returns table (win boolean, chance double precision, my_lv smallint, opp_lv smallint, opp_nick text, left_today integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_hash text := public.play_guitar_hash(p_key);
    v_day date := (now() at time zone 'Asia/Seoul')::date;
    v_me public.play_guitar_players%rowtype;
    v_op public.play_guitar_players%rowtype;
    v_n integer;
    v_p double precision;
    v_win boolean;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    select * into v_me from public.play_guitar_players p where p.key_hash = v_hash for update;
    if not found then raise exception 'no_player'; end if;
    v_n := case when v_me.bt_day = v_day then v_me.bt_n else 0 end;
    if v_n >= 5 and not v_me.hidden then raise exception 'limit'; end if;
    select * into v_op from public.play_guitar_players p
     where p.fight_no = p_opp and p.id <> v_me.id
     order by p.updated_at desc limit 1
     for update;
    if not found then raise exception 'no_opp'; end if;

    v_p := case when v_me.lv = v_op.lv then 0.5
                when v_me.lv > v_op.lv then 1 - power(0.5, v_me.lv - v_op.lv + 1)
                else power(0.5, v_op.lv - v_me.lv + 1) end;
    v_win := random() < v_p;

    if v_me.hidden then   -- 운영 계정(시험): 기록 안 남김
        return query select v_win, v_p, v_me.lv, v_op.lv, v_op.nickname, 5;
        return;
    end if;

    update public.play_guitar_players p
       set wins = p.wins + v_win::integer, losses = p.losses + (not v_win)::integer, bt_day = v_day, bt_n = v_n + 1
     where p.id = v_me.id;
    update public.play_guitar_players p
       set def_losses = p.def_losses + v_win::integer, def_wins = p.def_wins + (not v_win)::integer
     where p.id = v_op.id;

    return query select v_win, v_p, v_me.lv, v_op.lv, v_op.nickname, 5 - (v_n + 1);
end;
$$;
revoke all on function public.play_guitar_battle(text, bigint) from public;
grant execute on function public.play_guitar_battle(text, bigint) to anon, authenticated;

notify pgrst, 'reload schema';

-- (적용할 때 한 번만 따로 한 일 — 이 파일에는 계정 정보를 적지 않는다)
--   운영 계정이 계정에 저장해 둔 랭킹 열쇠(play_guitar_saves.data.rk)로 숨김 +10 스트랫 줄을 미리 만들어,
--   운영 계정이 아직 게임에 안 들어와도 000000 으로 찾으면 +10 스트랫이 나오게 했다.
