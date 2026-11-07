-- 기타 놀이터(play/) 기록: 이상형 월드컵 '우승 비율 순위'와 퀴즈쇼 '상위 몇 %'.
-- 2026-11-07 만듦 (아직 적용 전 — 사용자가 "적용해줘" 하면 적용)
--   · 로그인 없이 누구나 한 판 끝낼 때마다 결과 한 줄을 남긴다. 이름·이메일·IP 같은 개인 정보는 저장하지 않는다.
--   · 표는 직접 읽고 쓰지 못하게 막고(RLS 켜고 정책 없음), 아래 함수로만 넣고 집계해서 읽는다.
--   · 월드컵: 대결마다 [이긴 기타, 진 기타] 목록을 저장 → 기타별 우승 비율(우승 ÷ 나온 판)과 1:1 승률을 셈.
--   · 퀴즈: 종류·맞힌 수·점수 → 같은 종류에서 내 점수가 몇 등인지.
--   · 장난으로 같은 결과를 여러 번 보내는 것까지 막지는 않는다(가벼운 놀이용 순위).

create table if not exists public.play_wc_results (
    id bigint generated always as identity primary key,
    theme text not null check (theme ~ '^[a-z0-9_-]{1,24}$'),
    size smallint not null check (size in (8, 16, 32)),
    winner text not null check (winner ~ '^[a-z0-9_-]{1,32}$'),
    matches jsonb not null,            -- [["이긴 기타", "진 기타"], ...] 대결 순서대로, 마지막이 결승
    created_at timestamptz not null default now()
);
create index if not exists play_wc_results_theme on public.play_wc_results (theme);
alter table public.play_wc_results enable row level security;
revoke all on public.play_wc_results from anon, authenticated;

create table if not exists public.play_quiz_results (
    id bigint generated always as identity primary key,
    mode text not null check (mode ~ '^[a-z0-9_-]{1,24}$'),
    correct smallint not null check (correct between 0 and 50),
    total smallint not null check (total between 1 and 50 and correct <= total),
    score integer not null check (score between 0 and 10000),
    created_at timestamptz not null default now()
);
create index if not exists play_quiz_results_mode_score on public.play_quiz_results (mode, score);
alter table public.play_quiz_results enable row level security;
revoke all on public.play_quiz_results from anon, authenticated;

-- 월드컵 한 판 저장
create or replace function public.play_wc_save(p_theme text, p_size integer, p_matches jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    n integer;
begin
    if p_matches is null or jsonb_typeof(p_matches) <> 'array' then raise exception 'matches must be an array'; end if;
    n := jsonb_array_length(p_matches);
    if p_size not in (8, 16, 32) or n <> p_size - 1 then raise exception 'wrong number of matches'; end if;
    if exists (
        select 1 from jsonb_array_elements(p_matches) m
        where jsonb_typeof(m) <> 'array' or jsonb_array_length(m) <> 2
           or coalesce(m->>0, '') !~ '^[a-z0-9_-]{1,32}$' or coalesce(m->>1, '') !~ '^[a-z0-9_-]{1,32}$'
           or m->>0 = m->>1
    ) then raise exception 'bad match'; end if;
    insert into public.play_wc_results (theme, size, winner, matches)
    values (p_theme, p_size, p_matches->(n - 1)->>0, p_matches);
end;
$$;

-- 월드컵 순위: 기타마다 나온 판 수, 우승 수, 1:1 이긴 수, 1:1 대결 수 (+ 그 주제 전체 판 수)
create or replace function public.play_wc_stats(p_theme text)
returns table (item text, games integer, wins integer, match_wins integer, match_total integer, plays integer)
language sql
stable
security definer
set search_path = ''
as $$
    with r as (
        select id, winner, matches from public.play_wc_results where theme = p_theme
    ), m as (
        select r.id, x->>0 as w, x->>1 as l from r, jsonb_array_elements(r.matches) x
    ), side as (
        select id, w as item, 1 as won from m
        union all
        select id, l as item, 0 as won from m
    )
    select s.item,
           count(distinct s.id)::integer,
           (select count(*) from r where r.winner = s.item)::integer,
           sum(s.won)::integer,
           count(*)::integer,
           (select count(*) from r)::integer
    from side s
    group by s.item;
$$;

-- 퀴즈 한 판 저장 + 내 등수: 같은 종류에서 나보다 점수가 높은 판 수 + 1, 전체 판 수
create or replace function public.play_quiz_save(p_mode text, p_correct integer, p_total integer, p_score integer)
returns table (rank integer, plays integer)
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.play_quiz_results (mode, correct, total, score) values (p_mode, p_correct, p_total, p_score);
    return query
        select ((count(*) filter (where q.score > p_score)) + 1)::integer, count(*)::integer
        from public.play_quiz_results q where q.mode = p_mode;
end;
$$;

revoke all on function public.play_wc_save(text, integer, jsonb) from public;
revoke all on function public.play_wc_stats(text) from public;
revoke all on function public.play_quiz_save(text, integer, integer, integer) from public;
grant execute on function public.play_wc_save(text, integer, jsonb) to anon, authenticated;
grant execute on function public.play_wc_stats(text) to anon, authenticated;
grant execute on function public.play_quiz_save(text, integer, integer, integer) to anon, authenticated;
