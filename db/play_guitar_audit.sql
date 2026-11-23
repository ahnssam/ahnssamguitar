-- 기타 키우기 — 운영자용 기록 (2026-11-23 사용자: '유저가 어떤 과정으로 여기까지 왔는지, 중간에 어뷰징은 없었는지 알려면 유저마다 뭘 심어놔야')
--   ① 시간별 사진 play_guitar_snaps — 서버가 스스로 찍는다(게임은 그대로).
--        · 계정 저장(play_guitar_saves)이 올라올 때: 누른 수·결과별 수·모은 돈·가진 돈·최고 단계·도감 칸·장비 (로그인한 사람)
--        · 랭킹 줄(play_guitar_players)이 바뀔 때: 최고 무기·모은 돈·배틀 (로그인 안 한 사람도)
--        한 사람·한 종류마다 5분에 한 줄 — 5분 안에 또 올라오면 그 줄을 마지막 값으로 고친다(at0 = 그 칸 시작, at = 마지막).
--   ② 강화 일지 play_guitar_events — 게임이 행동마다 [번호, 시각, 종류, 가진 돈, 설명 안 되는 돈, …]을 모아 30초마다 보낸다(play_guitar_log).
--        종류: L 들어옴 · u 강화 · f 악기 찾기 · s 팔기 · b 사기 · w 배틀 · a 광고 골드 · d 출석 · v 넥뿌의 요정 · A/M/R 계정 기록 불러옴·합침·처음부터 · ? 기록 없이 돈이 바뀜
--   읽기: 운영 계정만 play_guitar_audit(파이트 넘버) — 게임 랭킹에서 사람을 누르면 '기록 보기'.
--   60일 지나면 지운다(일지를 받을 때 가끔). 이름·이메일·IP 는 안 남긴다(로그인했으면 계정 id 만).

-- ---------- ① 시간별 사진 ----------
create table if not exists public.play_guitar_snaps (
    id bigserial primary key,
    key_hash text not null,                 -- 랭킹 열쇠의 해시(play_guitar_players.key_hash 와 같음)
    src text not null check (src in ('save', 'rank')),
    slot smallint not null default 0,       -- 계정 저장 칸(0 = 계정 기록, 1·2·3 = 운영 계정 테스트)
    uid uuid,                               -- 로그인한 계정(계정 저장에서 온 사진만)
    at0 timestamptz not null default now(), -- 이 5분 칸이 시작된 때
    at timestamptz not null default now(),  -- 마지막으로 고친 때
    n integer not null default 1,           -- 이 칸 안에서 올라온 횟수
    d jsonb not null
);
create index if not exists play_guitar_snaps_key on public.play_guitar_snaps (key_hash, src, slot, at0 desc);
create index if not exists play_guitar_snaps_at on public.play_guitar_snaps (at);
alter table public.play_guitar_snaps enable row level security;   -- 정책 없음 = 아래 함수로만

create or replace function public.play_guitar_snap_put(p_key_hash text, p_src text, p_slot smallint, p_uid uuid, p_d jsonb)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_id bigint;
begin
    if p_key_hash is null or p_d is null then return; end if;
    select s.id into v_id from public.play_guitar_snaps s
     where s.key_hash = p_key_hash and s.src = p_src and s.slot = p_slot and s.at0 > now() - interval '5 minutes'
     order by s.at0 desc limit 1;
    if v_id is not null then
        update public.play_guitar_snaps set d = p_d, at = now(), n = n + 1, uid = coalesce(p_uid, uid) where id = v_id;
    else
        insert into public.play_guitar_snaps (key_hash, src, slot, uid, d) values (p_key_hash, p_src, p_slot, p_uid, p_d);
    end if;
end $$;
revoke all on function public.play_guitar_snap_put(text, text, smallint, uuid, jsonb) from public, anon, authenticated;

-- 계정 저장이 올라올 때(2.5초마다 모아서) — 저장 내용에서 숫자만 뽑는다
create or replace function public.play_guitar_snap_save() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare d jsonb := new.data; st jsonb := coalesce(new.data->'st', '{}'); items jsonb; v_top int; v_hi jsonb; v_dex int;
begin
    begin
        items := coalesce(case when jsonb_typeof(d->'wall') = 'array' then d->'wall' end, '[]')
              || coalesce(case when jsonb_typeof(d->'floor') = 'array' then d->'floor' end, '[]')
              || coalesce(case when jsonb_typeof(d->'store') = 'array' then d->'store' end, '[]')
              || case when jsonb_typeof(d->'bench') = 'object' then jsonb_build_array(d->'bench') else '[]'::jsonb end;
        select max((g->>'lv')::int),
               coalesce(jsonb_agg(jsonb_build_array(g->>'f', (g->>'lv')::int, coalesce((g->>'hc')::int, 0)) order by (g->>'lv')::int desc)
                        filter (where (g->>'lv')::int >= 15), '[]')
          into v_top, v_hi
          from jsonb_array_elements(items) g where jsonb_typeof(g) = 'object' and (g->>'lv') ~ '^\d{1,2}$';
        select coalesce(sum(bit_count((v.value)::bigint::bit(64))), 0)::int into v_dex
          from jsonb_each_text(case when jsonb_typeof(d->'dex') = 'object' then d->'dex' else '{}' end) v where v.value ~ '^\d{1,10}$';
        perform public.play_guitar_snap_put(
            coalesce(public.play_guitar_hash(d->>'rk'), 'uid:' || new.user_id::text), 'save', coalesce(new.slot, 0)::smallint, new.user_id,
            jsonb_build_object(
                'tries', st->'tries', 'ok', st->'ok', 'keep', st->'keep', 'saved', st->'saved', 'boom', st->'boom', 'jack', st->'jack',
                'made', st->'made', 'earned', st->'earned', 'sold', st->'sold', 'found', st->'found', 'win', st->'win', 'lose', st->'lose',
                'revive', st->'revive', 'best', st->'best', 'gold', d->'gold', 'cases', d->'cases', 'top', v_top, 'hi', v_hi, 'dex', v_dex,
                'tuner', d->'tuner', 'hammer', d->'hammer', 'bskin', d->'bskin', 'skin', d->'skin', 'lseq', d->'lseq', 'rev', new.rev));
    exception when others then null;   -- 사진이 안 찍혀도 저장은 그대로
    end;
    return null;
end $$;
drop trigger if exists play_guitar_snap_save on public.play_guitar_saves;
create trigger play_guitar_snap_save after insert or update of data on public.play_guitar_saves
    for each row execute function public.play_guitar_snap_save();

-- 랭킹 줄이 바뀔 때(대표 기타 올리기·배틀) — 로그인 안 한 사람도 대략은 보인다
create or replace function public.play_guitar_snap_rank() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
    if new.hidden then return null; end if;
    begin
        perform public.play_guitar_snap_put(new.key_hash, 'rank', 0::smallint, null,
            jsonb_build_object('fam', new.fam, 'lv', new.lv, 'top_fam', new.top_fam, 'top_lv', new.top_lv, 'gold', new.gold,
                'wins', new.wins, 'losses', new.losses, 'def_wins', new.def_wins, 'def_losses', new.def_losses, 'bt_n', new.bt_n, 'nick', new.nickname));
    exception when others then null;
    end;
    return null;
end $$;
drop trigger if exists play_guitar_snap_rank on public.play_guitar_players;
create trigger play_guitar_snap_rank after insert or update on public.play_guitar_players
    for each row execute function public.play_guitar_snap_rank();

-- ---------- ② 강화 일지 ----------
create table if not exists public.play_guitar_events (
    id bigserial primary key,
    key_hash text not null,
    uid uuid,                               -- 로그인해서 보냈으면 그 계정
    slot smallint not null default 0,
    dev text,                               -- 브라우저 이름표(무작위 8자)
    at timestamptz not null default now(),  -- 서버가 받은 때
    t0 bigint,                              -- 첫 행동의 게임 시각(ms) — 행동마다 t0 에서 몇 ms
    s0 bigint, s1 bigint,                   -- 번호 처음·끝
    n integer not null,
    sum jsonb,                              -- 보낼 때의 합계 { tries, gold, made, lseq }
    ev jsonb not null
);
create index if not exists play_guitar_events_key on public.play_guitar_events (key_hash, id);
create index if not exists play_guitar_events_at on public.play_guitar_events (at);
alter table public.play_guitar_events enable row level security;

create or replace function public.play_guitar_log(p_key text, p_batch jsonb)
returns text language plpgsql security definer set search_path = ''
as $$
declare h text := public.play_guitar_hash(p_key); v_ev jsonb; v_n int; v_slot int;
begin
    if h is null then return 'bad_key'; end if;
    if p_batch is null or jsonb_typeof(p_batch) <> 'object' then return 'bad'; end if;
    v_ev := p_batch->'ev';
    if v_ev is null or jsonb_typeof(v_ev) <> 'array' then return 'bad'; end if;
    v_n := jsonb_array_length(v_ev);
    if v_n = 0 then return 'ok'; end if;
    if v_n > 400 or octet_length(p_batch::text) > 64000 then return 'big'; end if;
    -- 한 열쇠: 10초에 3번까지 · 하루 3만 개까지 / 사이트 전체: 1분에 1,200번까지
    if (select count(*) from public.play_guitar_events e where e.key_hash = h and e.at > now() - interval '10 seconds') >= 3 then return 'slow'; end if;
    if (select count(*) from public.play_guitar_events e where e.at > now() - interval '1 minute') >= 1200 then return 'busy'; end if;
    if (select coalesce(sum(e.n), 0) from public.play_guitar_events e where e.key_hash = h and e.at > now() - interval '1 day') + v_n > 30000 then return 'full'; end if;
    v_slot := case when (p_batch->>'slot') in ('1', '2', '3') then (p_batch->>'slot')::int else 0 end;
    insert into public.play_guitar_events (key_hash, uid, slot, dev, t0, s0, s1, n, sum, ev)
    values (h, auth.uid(), v_slot, left(p_batch->>'dev', 16),
            case when jsonb_typeof(p_batch->'t0') = 'number' then (p_batch->>'t0')::numeric::bigint end,
            case when jsonb_typeof(v_ev->0->0) = 'number' then (v_ev->0->>0)::numeric::bigint end,
            case when jsonb_typeof(v_ev->(v_n - 1)->0) = 'number' then (v_ev->(v_n - 1)->>0)::numeric::bigint end,
            v_n, case when jsonb_typeof(p_batch->'sum') = 'object' then p_batch->'sum' end, v_ev);
    if random() < 0.02 then   -- 60일 지난 기록은 가끔 한꺼번에 지운다
        delete from public.play_guitar_events where at < now() - interval '60 days';
        delete from public.play_guitar_snaps where at < now() - interval '60 days';
    end if;
    return 'ok';
end $$;
revoke all on function public.play_guitar_log(text, jsonb) from public;
grant execute on function public.play_guitar_log(text, jsonb) to anon, authenticated;

-- ---------- 읽기 (운영 계정만) ----------
--   p_id = 파이트 넘버, p_days = 며칠 치(기본 7일, 최대 60일). 일지는 최근 2,500 묶음까지
create or replace function public.play_guitar_audit(p_id bigint, p_days integer default 7)
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
declare h text; v_days int := greatest(1, least(60, coalesce(p_days, 7)));
begin
    if not public.is_site_admin() then raise exception 'not_admin'; end if;
    select p.key_hash into h from public.play_guitar_players p where p.fight_no = p_id;
    if h is null then return null; end if;
    return jsonb_build_object(
        'player', (select jsonb_build_object('id', p.fight_no, 'nick', p.nickname, 'fam', p.fam, 'lv', p.lv, 'top_fam', p.top_fam, 'top_lv', p.top_lv, 'gold', p.gold,
                          'wins', p.wins, 'losses', p.losses, 'hidden', p.hidden, 'created', p.created_at, 'updated', p.updated_at)
                   from public.play_guitar_players p where p.key_hash = h),
        'acct', exists (select 1 from public.play_guitar_saves s where public.play_guitar_hash(s.data->>'rk') = h),
        'snaps', (select coalesce(jsonb_agg(jsonb_build_object('src', s.src, 'slot', s.slot, 'at0', s.at0, 'at', s.at, 'n', s.n, 'd', s.d) order by s.at0), '[]')
                  from public.play_guitar_snaps s where s.key_hash = h and s.at0 > now() - make_interval(days => v_days)),
        'batches', (select coalesce(jsonb_agg(jsonb_build_object('id', e.id, 'at', e.at, 'dev', e.dev, 'slot', e.slot, 'login', e.uid is not null,
                                                                 't0', e.t0, 's0', e.s0, 's1', e.s1, 'n', e.n, 'sum', e.sum, 'ev', e.ev) order by e.id), '[]')
                    from (select * from public.play_guitar_events e where e.key_hash = h and e.at > now() - make_interval(days => v_days) order by e.id desc limit 2500) e)
    );
end $$;
revoke all on function public.play_guitar_audit(bigint, integer) from public;
grant execute on function public.play_guitar_audit(bigint, integer) to authenticated;
