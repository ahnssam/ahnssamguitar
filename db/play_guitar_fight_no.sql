-- 기타 키우기 — 파이트 넘버를 무작위 6자리로 (2026-11-13 사용자)
--   "내 계정 파이트 넘버는 000000으로. 사람들도 5명째라고 000005 이렇게 지어 주지 말고 임의의 난수를 부여해"
--   · 예전 파이트 넘버 = 랭킹 줄 번호(play_guitar_players.id, 1·2·3… 차례대로)라서 몇 번째로 왔는지 보였다.
--   · 이제 줄마다 fight_no 를 따로 둔다: 운영 계정(숨김 줄) = 0 → 화면에 '#000000',
--     나머지 = 100000 ~ 999999 중 아직 안 쓴 아무 수 (화면은 늘 6자리).
--   · 함수가 돌려주는 'id' 는 이제 이 파이트 넘버다(이름·모양은 그대로라 화면 코드는 6자리 표시와 0 처리만 바꿈).
--     안쪽 id(차례 번호)는 표 안에서만 쓴다.
--   · 운영 계정 줄이 여럿이면(브라우저마다 따로 올린 경우) 0번으로 찾을 때 가장 최근에 들어온 줄.
--   · 배틀 하루 횟수도 5번으로 같이 바꾼다(db/play_guitar_battle5.sql 내용 — 2026-11-13 사용자 결정, 이 파일이 그것을 대신한다).
--   · 오늘 이미 뿌린 예전 신청 링크(?vs=…, p=예전 번호)는 그 번호로 못 찾으면 링크에 적힌 단계로 연습 배틀이 된다.

alter table public.play_guitar_players add column if not exists fight_no integer;

-- 아직 안 쓴 100000~999999 중 하나
create or replace function public.play_guitar_new_no()
returns integer
language plpgsql
volatile
set search_path = ''
as $$
declare
    v integer;
begin
    loop
        v := 100000 + floor(random() * 900000)::integer;
        exit when not exists (select 1 from public.play_guitar_players p where p.fight_no = v);
    end loop;
    return v;
end;
$$;
revoke all on function public.play_guitar_new_no() from public, anon, authenticated;

-- 새 줄·숨김이 바뀐 줄: 숨김(운영 계정) = 0, 아니면 번호가 없을 때 무작위로
create or replace function public.play_guitar_no_trg()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.hidden then
        new.fight_no := 0;
    elsif new.fight_no is null or new.fight_no = 0 then
        new.fight_no := public.play_guitar_new_no();
    end if;
    return new;
end;
$$;
revoke all on function public.play_guitar_no_trg() from public, anon, authenticated;

drop trigger if exists play_guitar_no on public.play_guitar_players;
create trigger play_guitar_no
    before insert or update of hidden, fight_no on public.play_guitar_players
    for each row execute function public.play_guitar_no_trg();

-- 이미 있는 줄에 번호 주기(한 줄씩 — 같은 수가 겹치지 않게)
do $$
declare r record;
begin
    for r in select p.id, p.hidden from public.play_guitar_players p where p.fight_no is null order by p.id loop
        update public.play_guitar_players p
           set fight_no = case when r.hidden then 0 else public.play_guitar_new_no() end
         where p.id = r.id;
    end loop;
end;
$$;
alter table public.play_guitar_players alter column fight_no set not null;
create unique index if not exists play_guitar_players_fight_no on public.play_guitar_players (fight_no) where fight_no > 0;

-- 순위(숨긴 사람 빼고): 단계 높은 순 → 그 단계에 먼저 닿은 순. id = 파이트 넘버
create or replace function public.play_guitar_board()
returns table (id bigint, pos integer, nickname text, fam text, lv smallint, wins integer, losses integer, def_wins integer, def_losses integer)
language sql
stable
security definer
set search_path = ''
as $$
    select p.fight_no::bigint, (row_number() over (order by p.lv desc, p.lv_at, p.id))::integer, p.nickname, p.fam, p.lv, p.wins, p.losses, p.def_wins, p.def_losses
    from public.play_guitar_players p
    where not p.hidden
$$;
revoke all on function public.play_guitar_board() from public, anon, authenticated;

-- 대표 기타 올리기 — 돌려주는 id = 내 파이트 넘버(운영 계정 0)
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
    v_no integer;
    v_hidden boolean;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    if coalesce(p_fam, '') not in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass', 'amp', 'multi') then raise exception 'bad_fam'; end if;
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
    returning p.fight_no, p.hidden into v_no, v_hidden;

    return query
        select v_no::bigint,
               case when v_hidden then null else (select b.pos from public.play_guitar_board() b where b.id = v_no) end,
               (select count(*)::integer from public.play_guitar_players p where not p.hidden),
               v_hidden;
end;
$$;

-- 랭킹 표: 1~20위 + (열쇠를 주면) 내 줄. id = 파이트 넘버
create or replace function public.play_guitar_top(p_key text default null)
returns table (id bigint, pos integer, nickname text, fam text, lv smallint, wins integer, losses integer, me boolean, players integer)
language sql
stable
security definer
set search_path = ''
as $$
    with b as (select * from public.play_guitar_board()),
    mine as (select p.fight_no::bigint as id from public.play_guitar_players p where p.key_hash = public.play_guitar_hash(p_key) and not p.hidden),
    n as (select count(*)::integer as c from b)
    select b.id, b.pos, b.nickname, b.fam, b.lv, b.wins, b.losses, b.id in (select id from mine), n.c
    from b, n
    where b.pos <= 20 or b.id in (select id from mine)
    order by b.pos
$$;

-- 오늘의 상대: 내 단계에 가까운 20명. id = 파이트 넘버
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
    select p.fight_no::bigint, p.nickname, p.fam, p.lv, p.wins, p.losses
    from public.play_guitar_players p
    left join me on true
    where not p.hidden
      and p.id is distinct from me.id
      and p.updated_at > now() - interval '30 days'
    order by abs(p.lv - coalesce(me.lv, 0)) + case when p.lv < coalesce(me.lv, 0) then 0.5 else 0 end, random()
    limit 20
$$;

-- 파이트 넘버로 한 명 찾기(신청 링크·번호 붙여 넣기). 0 = 운영 계정(가장 최근에 들어온 줄)
create or replace function public.play_guitar_player(p_id bigint)
returns table (id bigint, nickname text, fam text, lv smallint, wins integer, losses integer, def_wins integer, def_losses integer)
language sql
stable
security definer
set search_path = ''
as $$
    select p.fight_no::bigint, p.nickname, p.fam, p.lv, p.wins, p.losses, p.def_wins, p.def_losses
    from public.play_guitar_players p where p.fight_no = p_id
    order by p.updated_at desc
    limit 1
$$;

-- 배틀: 서버가 승패를 굴리고 두 사람의 승패 숫자를 더한다. 상대는 파이트 넘버로, 하루 5번까지
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
    if v_n >= 5 then raise exception 'limit'; end if;
    select * into v_op from public.play_guitar_players p
     where p.fight_no = p_opp and p.id <> v_me.id
     order by p.updated_at desc limit 1
     for update;
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

    return query select v_win, v_p, v_me.lv, v_op.lv, v_op.nickname, 5 - (v_n + 1);
end;
$$;
