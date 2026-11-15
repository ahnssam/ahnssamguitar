-- 기타 펑펑 랭킹 (2026-11-15 사용자: "첫 시작 화면에서 1분 최고 오른쪽에 랭킹 보여주게")
--   사람당 한 줄: 1분 판 최고 개수(best). 같은 사람은 브라우저 무작위 열쇠(PLAY.myKey(), 월드컵 댓글·퀴즈 랭킹과 같은 열쇠)의 해시로 알아본다.
--   닉네임 = 사이트에 로그인한 닉네임(profiles.nickname), 로그인 안 했으면 '익명'. 금지어는 play_nick_clean 이 '익명'으로.
--   운영 계정으로 로그인한 채 올리면 숨김(랭킹에 안 보임) — 다른 놀이터 랭킹과 같다.
--   개수는 브라우저 값을 믿는다(월드컵·퀴즈와 같은 결정). 1분에 말이 안 되는 수(20,000개 넘게)만 막는다.

create table if not exists public.play_boom_scores (
    id bigint generated always as identity primary key,
    key_hash text not null unique check (key_hash ~ '^[0-9a-f]{64}$'),
    nickname text not null default '익명',
    best integer not null default 0 check (best between 0 and 20000),
    best_at timestamptz not null default now(),
    hidden boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table public.play_boom_scores enable row level security;
revoke all on public.play_boom_scores from anon, authenticated;
create index if not exists play_boom_scores_rank on public.play_boom_scores (best desc, best_at, id) where not hidden;

-- 1분 판 기록 올리기 → 내 순위
create or replace function public.play_boom_submit(p_key text, p_nick text, p_n integer)
returns table (pos integer, best integer, players integer, hidden boolean)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
    v_hash text;
    v_nick text := left(btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g')), 12);
    v_id bigint;
    v_best integer;
    v_hidden boolean;
begin
    if coalesce(p_key, '') !~ '^[A-Za-z0-9_-]{16,64}$' then raise exception 'bad_key'; end if;
    if p_n is null or p_n not between 0 and 20000 then raise exception 'bad_n'; end if;
    if v_nick ~* '(https?:|www\.|\.(com|net|kr|co|io|me|ly)\y)' then v_nick := ''; end if;
    v_nick := public.play_nick_clean(v_nick);
    v_hash := encode(sha256(convert_to(p_key, 'UTF8')), 'hex');

    if not exists (select 1 from public.play_boom_scores s where s.key_hash = v_hash)
       and (select count(*) from public.play_boom_scores s where s.created_at > now() - interval '1 minute') >= 60 then
        raise exception 'busy';
    end if;

    insert into public.play_boom_scores as s (key_hash, nickname, best, hidden)
    values (v_hash, v_nick, p_n, public.is_site_admin())
    on conflict (key_hash) do update
        set nickname = excluded.nickname,
            best_at = case when excluded.best > s.best then now() else s.best_at end,
            best = greatest(s.best, excluded.best),
            hidden = s.hidden or excluded.hidden,
            updated_at = now()
    returning s.id, s.best, s.hidden into v_id, v_best, v_hidden;

    return query
        select case when v_hidden or v_best = 0 then null else (
                   select r.pos from (
                       select q.id, (row_number() over (order by q.best desc, q.best_at, q.id))::integer as pos
                       from public.play_boom_scores q where not q.hidden and q.best > 0
                   ) r where r.id = v_id) end,
               v_best,
               (select count(*)::integer from public.play_boom_scores q where not q.hidden and q.best > 0),
               v_hidden;
end;
$$;
revoke all on function public.play_boom_submit(text, text, integer) from public;
grant execute on function public.play_boom_submit(text, text, integer) to anon, authenticated;

-- 랭킹: 1~10위 + 내 줄
create or replace function public.play_boom_rank(p_key text default null)
returns table (pos integer, nickname text, best integer, me boolean, players integer)
language sql
stable
security definer
set search_path = ''
as $$
    with b as (
        select q.key_hash, q.nickname, q.best, (row_number() over (order by q.best desc, q.best_at, q.id))::integer as pos
        from public.play_boom_scores q where not q.hidden and q.best > 0
    ), mine as (
        select encode(sha256(convert_to(p_key, 'UTF8')), 'hex') as h where coalesce(p_key, '') ~ '^[A-Za-z0-9_-]{16,64}$'
    )
    select b.pos, b.nickname, b.best, coalesce(b.key_hash = (select h from mine), false), (select count(*)::integer from b)
    from b
    where b.pos <= 10 or b.key_hash = (select h from mine)
    order by b.pos;
$$;
revoke all on function public.play_boom_rank(text) from public;
grant execute on function public.play_boom_rank(text) to anon, authenticated;
