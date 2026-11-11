-- 기타 키우기 — 진짜 랭킹 · 배틀 상대 (2026-11-12 작성 · 같은 날 사용자 "적용해줘"로 적용함, 마이그레이션 play_guitar_rank)
--   · 사람당 한 줄만 둔다: 대표 기타(계열·단계), 닉네임, 승패 숫자. 골드·기타 목록·조각 같은 진행은 브라우저에만 둔다(CLAUDE.md 11절).
--   · 로그인 없이 한다. 브라우저 무작위 열쇠(PLAY.myKey() — 월드컵 댓글·퀴즈 랭킹과 같은 열쇠)의 sha256 으로 같은 사람을 알아본다.
--     열쇠 자체·이름·이메일·IP 는 저장하지 않는다. 닉네임은 비우면 '익명', 12자까지, 링크 금지.
--   · 배틀 결과는 서버가 정한다: 두 사람의 저장된 단계로 검키우기 공식(같으면 50%, 높은 쪽 1 − 0.5^(차이+1))을 굴린다.
--     이긴 보상(골드)은 브라우저가 준다(진행이 브라우저에 있으니까). 진 쪽도 잃는 것은 없다.
--   · 배틀은 한 사람이 하루(한국 날짜) 10번까지 — 서버도 센다. 같은 상대를 여러 번 고르는 건 막지 않는다(하루 10번이라 충분).
--   · 단계는 브라우저가 보내는 값을 믿는다(월드컵·퀴즈와 같은 결정). 순위가 이상해지면 그때 막는 장치를 더한다.
--   · 운영 계정으로 로그인한 채 올리면 랭킹·상대 목록에 안 보인다(hidden — 퀴즈 랭킹 2026-11-11 결정과 같게).
--   · 30일 넘게 안 들어온 사람은 '오늘의 상대'에서 빠진다(랭킹 표에는 남는다).
-- 예상 용량: 한 줄 약 200바이트 + 색인 → 1만 명이어도 약 3MB. 배틀은 숫자만 더하므로 줄이 늘지 않는다.
--
-- 오류 코드(err.code): bad_key · bad_fam · bad_lv · long · link · busy(새 사람이 1분에 60명 넘음) · no_player · no_opp · limit(오늘 10번 다 함)

create table if not exists public.play_guitar_players (
    id bigint generated always as identity primary key,
    key_hash text not null unique check (key_hash ~ '^[0-9a-f]{64}$'),
    nickname text not null default '익명' check (char_length(nickname) between 1 and 12),
    fam text not null default 'strat' check (fam in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'amp')),
    lv smallint not null default 0 check (lv between 0 and 20),
    lv_at timestamptz not null default now(),          -- 지금 단계에 닿은 때. 같은 단계면 먼저 닿은 사람이 위
    best smallint not null default 0 check (best between 0 and 20),
    wins integer not null default 0,                   -- 내가 건 배틀
    losses integer not null default 0,
    def_wins integer not null default 0,               -- 남이 내 기타에 걸어 온 배틀
    def_losses integer not null default 0,
    bt_day date,                                       -- 오늘(한국 날짜) 건 배틀 수
    bt_n smallint not null default 0,
    hidden boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()      -- 마지막으로 들어온 때(대표 기타 올림)
);
create index if not exists play_guitar_players_rank on public.play_guitar_players (lv desc, lv_at, id) where not hidden;
alter table public.play_guitar_players enable row level security;
revoke all on public.play_guitar_players from anon, authenticated;

create or replace function public.play_guitar_hash(p_key text)
returns text
language sql
immutable
set search_path = ''
as $$
    select case when coalesce(p_key, '') ~ '^[A-Za-z0-9_-]{16,64}$' then encode(sha256(convert_to(p_key, 'UTF8')), 'hex') end
$$;
revoke all on function public.play_guitar_hash(text) from public, anon, authenticated;

-- 순위(숨긴 사람 빼고): 단계 높은 순 → 그 단계에 먼저 닿은 순
create or replace function public.play_guitar_board()
returns table (id bigint, pos integer, nickname text, fam text, lv smallint, wins integer, losses integer, def_wins integer, def_losses integer)
language sql
stable
security definer
set search_path = ''
as $$
    select p.id, (row_number() over (order by p.lv desc, p.lv_at, p.id))::integer, p.nickname, p.fam, p.lv, p.wins, p.losses, p.def_wins, p.def_losses
    from public.play_guitar_players p
    where not p.hidden
$$;
revoke all on function public.play_guitar_board() from public, anon, authenticated;

-- 대표 기타 올리기(처음이면 만들기): 배틀 탭을 열 때, 대표 기타·단계·닉네임이 바뀔 때 부른다 → 내 순위
create or replace function public.play_guitar_save(p_key text, p_nick text, p_fam text, p_lv integer, p_best integer default null)
returns table (id bigint, pos integer, players integer, hidden boolean)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
    v_hash text := public.play_guitar_hash(p_key);
    v_nick text := btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g'));
    v_id bigint;
    v_hidden boolean;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    if coalesce(p_fam, '') not in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'amp') then raise exception 'bad_fam'; end if;
    if p_lv is null or p_lv not between 0 and 20 then raise exception 'bad_lv'; end if;
    if v_nick = '' then v_nick := '익명'; end if;
    if char_length(v_nick) > 12 then raise exception 'long'; end if;
    -- Postgres 정규식의 단어 경계는 \y (\b 는 백스페이스라 '.com' 이 안 걸린다)
    if v_nick ~* '(https?:|www\.|\.(com|net|kr|co|io|me|ly)\y)' then raise exception 'link'; end if;

    if not exists (select 1 from public.play_guitar_players p where p.key_hash = v_hash)
       and (select count(*) from public.play_guitar_players p where p.created_at > now() - interval '1 minute') >= 60 then
        raise exception 'busy';
    end if;

    insert into public.play_guitar_players as p (key_hash, nickname, fam, lv, best, hidden)
    values (v_hash, v_nick, p_fam, p_lv, greatest(p_lv, least(coalesce(p_best, 0), 20)), public.is_site_admin())
    on conflict (key_hash) do update
        set nickname = excluded.nickname,
            fam = excluded.fam,
            lv_at = case when p.lv <> excluded.lv or p.fam <> excluded.fam then now() else p.lv_at end,
            lv = excluded.lv,
            best = greatest(p.best, excluded.best),
            hidden = p.hidden or excluded.hidden,
            updated_at = now()
    returning p.id, p.hidden into v_id, v_hidden;

    return query
        select v_id,
               (select b.pos from public.play_guitar_board() b where b.id = v_id),
               (select count(*)::integer from public.play_guitar_players p where not p.hidden),
               v_hidden;
end;
$$;
revoke all on function public.play_guitar_save(text, text, text, integer, integer) from public;
grant execute on function public.play_guitar_save(text, text, text, integer, integer) to anon, authenticated;

-- 랭킹 표: 1~20위 + (열쇠를 주면) 내 줄. 열쇠·해시는 돌려주지 않는다
create or replace function public.play_guitar_top(p_key text default null)
returns table (id bigint, pos integer, nickname text, fam text, lv smallint, wins integer, losses integer, me boolean, players integer)
language sql
stable
security definer
set search_path = ''
as $$
    with b as (select * from public.play_guitar_board()),
    mine as (select p.id from public.play_guitar_players p where p.key_hash = public.play_guitar_hash(p_key)),
    n as (select count(*)::integer as c from b)
    select b.id, b.pos, b.nickname, b.fam, b.lv, b.wins, b.losses, b.id in (select id from mine), n.c
    from b, n
    where b.pos <= 20 or b.id in (select id from mine)
    order by b.pos
$$;
revoke all on function public.play_guitar_top(text) from public;
grant execute on function public.play_guitar_top(text) to anon, authenticated;

-- 오늘의 상대: 내 단계에 가까운 20명(같으면 나보다 높은 쪽 먼저, 같은 거리는 무작위). 나·숨긴 사람·30일 넘게 안 온 사람은 뺀다
create or replace function public.play_guitar_opponents(p_key text)
returns table (id bigint, nickname text, fam text, lv smallint, wins integer, losses integer)
language sql
volatile
security definer
set search_path = ''
as $$
    with me as (
        select p.id, p.lv from public.play_guitar_players p where p.key_hash = public.play_guitar_hash(p_key)
    )
    select p.id, p.nickname, p.fam, p.lv, p.wins, p.losses
    from public.play_guitar_players p
    left join me on true
    where not p.hidden
      and p.id is distinct from me.id
      and p.updated_at > now() - interval '30 days'
    order by abs(p.lv - coalesce(me.lv, 0)) + case when p.lv < coalesce(me.lv, 0) then 0.5 else 0 end, random()
    limit 20
$$;
revoke all on function public.play_guitar_opponents(text) from public;
grant execute on function public.play_guitar_opponents(text) to anon, authenticated;

-- 배틀 신청 링크(?vs=번호)로 온 상대 한 명. 숨긴 사람도 링크로는 붙을 수 있다(운영 계정이 링크를 보낸 경우)
create or replace function public.play_guitar_player(p_id bigint)
returns table (id bigint, nickname text, fam text, lv smallint, wins integer, losses integer, def_wins integer, def_losses integer)
language sql
stable
security definer
set search_path = ''
as $$
    select p.id, p.nickname, p.fam, p.lv, p.wins, p.losses, p.def_wins, p.def_losses
    from public.play_guitar_players p where p.id = p_id
$$;
revoke all on function public.play_guitar_player(bigint) from public;
grant execute on function public.play_guitar_player(bigint) to anon, authenticated;

-- 배틀: 서버가 승패를 굴리고 두 사람의 승패 숫자를 더한다. 하루 10번까지
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
    if v_n >= 10 then raise exception 'limit'; end if;
    select * into v_op from public.play_guitar_players p where p.id = p_opp and p.id <> v_me.id for update;
    if not found then raise exception 'no_opp'; end if;

    v_p := case when v_me.lv = v_op.lv then 0.5
                when v_me.lv > v_op.lv then 1 - power(0.5, v_me.lv - v_op.lv + 1)
                else power(0.5, v_op.lv - v_me.lv + 1) end;
    v_win := random() < v_p;

    update public.play_guitar_players p
       set wins = p.wins + v_win::integer, losses = p.losses + (not v_win)::integer, bt_day = v_day, bt_n = v_n + 1
     where p.id = v_me.id;
    update public.play_guitar_players p
       set def_losses = p.def_losses + v_win::integer, def_wins = p.def_wins + (not v_win)::integer
     where p.id = v_op.id;

    return query select v_win, v_p, v_me.lv, v_op.lv, v_op.nickname, 10 - (v_n + 1);
end;
$$;
revoke all on function public.play_guitar_battle(text, bigint) from public;
grant execute on function public.play_guitar_battle(text, bigint) to anon, authenticated;
