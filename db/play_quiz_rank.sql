-- 기타 퀴즈쇼 랭킹 — '지금까지 맞힌 문제(곡) 수' 순위 (2026-11-11 사용자 요청)
--   · 한 판 점수가 아니라, 그 퀴즈에서 지금까지 맞힌 문제가 몇 개인지로 순위를 매긴다(악보 퀴즈 = 맞힌 곡 수).
--     "이 페이지의 곡을 다 맞히겠다"는 마음이 들게. 같은 문제는 한 번만 센다.
--   · 퀴즈 종류마다 따로: tab · artist · trivia1 · trivia2 · trivia3 (상식은 난이도마다).
--   · 로그인 없이 한다. 브라우저마다 만든 무작위 열쇠(p_key)의 sha256 으로 같은 사람을 알아본다(열쇠 자체는 저장 안 함).
--     닉네임은 올릴 때 적는다(비우면 '익명', 12자까지, 링크 금지). 이름·이메일·IP 는 저장하지 않는다.
--   · 문제 표시(qid)는 quiz.html 의 qHash("종류|문제") 16자리 — 문제별 정답률(play_quiz_answers.sql)과 같다.
--   · 운영 계정으로 로그인한 채 올리면 랭킹에 안 보인다(hidden, 2026-11-11 사용자 결정: "내 이름은 일단 랭킹에 띄우지 말고").
--   · 브라우저가 보내는 '맞힌 문제'를 서버가 다시 채점하지는 못한다(가벼운 놀이용 순위). 이상해지면 그때 막는 장치를 더한다.

create table if not exists public.play_quiz_players (
    id bigint generated always as identity primary key,
    key_hash text not null unique check (key_hash ~ '^[0-9a-f]{64}$'),
    nickname text not null default '익명' check (char_length(nickname) between 1 and 12),
    hidden boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table public.play_quiz_players enable row level security;
revoke all on public.play_quiz_players from anon, authenticated;

create table if not exists public.play_quiz_solved (
    player_id bigint not null references public.play_quiz_players (id) on delete cascade,
    mode text not null check (mode in ('tab', 'artist', 'trivia1', 'trivia2', 'trivia3')),
    qid text not null check (qid ~ '^[0-9a-f]{16}$'),
    solved_at timestamptz not null default now(),
    primary key (player_id, mode, qid)
);
create index if not exists play_quiz_solved_mode on public.play_quiz_solved (mode, player_id);
alter table public.play_quiz_solved enable row level security;
revoke all on public.play_quiz_solved from anon, authenticated;

-- 한 종류의 순위표 (숨긴 사람 빼고): 맞힌 수 많은 순, 같으면 그 수에 먼저 닿은 사람(마지막으로 맞힌 시각이 이른 사람)
create or replace function public.play_quiz_rank_board(p_mode text)
returns table (player_id bigint, nickname text, solved integer, pos integer)
language sql
stable
security definer
set search_path = ''
as $$
    with c as (
        select s.player_id, count(*)::integer as solved, max(s.solved_at) as last_at
        from public.play_quiz_solved s
        join public.play_quiz_players p on p.id = s.player_id and not p.hidden
        where s.mode = p_mode
        group by s.player_id
    )
    select c.player_id, p.nickname, c.solved, (row_number() over (order by c.solved desc, c.last_at asc, c.player_id))::integer
    from c join public.play_quiz_players p on p.id = c.player_id
$$;
revoke all on function public.play_quiz_rank_board(text) from public, anon, authenticated;

-- 올리기: 닉네임 + 이 브라우저가 지금까지 맞힌 문제들 → 내 순위
create or replace function public.play_quiz_rank_submit(p_key text, p_nick text, p_mode text, p_qids text[])
returns table (pos integer, solved integer, players integer, hidden boolean)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_hash text;
  v_nick text := btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g'));
  v_id bigint;
  v_hidden boolean;
begin
  if coalesce(p_key, '') !~ '^[A-Za-z0-9_-]{16,64}$' then raise exception 'bad_key'; end if;
  if p_mode is null or p_mode not in ('tab', 'artist', 'trivia1', 'trivia2', 'trivia3') then raise exception 'bad_mode'; end if;
  if v_nick = '' then v_nick := '익명'; end if;
  if char_length(v_nick) > 12 then raise exception 'long'; end if;
  if v_nick ~* '(https?:|www\.|\.(com|net|kr|co|io|me|ly)\b)' then raise exception 'link'; end if;
  if coalesce(array_length(p_qids, 1), 0) > 600 then raise exception 'too_many'; end if;
  if exists (select 1 from unnest(coalesce(p_qids, '{}')) q where q !~ '^[0-9a-f]{16}$') then raise exception 'bad_qid'; end if;
  v_hash := encode(sha256(convert_to(p_key, 'UTF8')), 'hex');

  insert into public.play_quiz_players as p (key_hash, nickname, hidden)
  values (v_hash, v_nick, public.is_site_admin())
  on conflict (key_hash) do update
    set nickname = excluded.nickname, hidden = p.hidden or excluded.hidden, updated_at = now()
  returning p.id, p.hidden into v_id, v_hidden;

  insert into public.play_quiz_solved (player_id, mode, qid)
  select v_id, p_mode, q from (select distinct q from unnest(coalesce(p_qids, '{}')) q) d
  on conflict do nothing;

  return query
    select b.pos, b.solved, (select count(*)::integer from public.play_quiz_rank_board(p_mode)), v_hidden
    from public.play_quiz_rank_board(p_mode) b where b.player_id = v_id
    union all
    select null::integer, (select count(*)::integer from public.play_quiz_solved s where s.player_id = v_id and s.mode = p_mode),
           (select count(*)::integer from public.play_quiz_rank_board(p_mode)), v_hidden
    where v_hidden
    limit 1;
end;
$$;
revoke all on function public.play_quiz_rank_submit(text, text, text, text[]) from public;
grant execute on function public.play_quiz_rank_submit(text, text, text, text[]) to anon, authenticated;

-- 순위표 보기: 1~10위 + (열쇠를 주면) 내 줄. 열쇠·해시는 돌려주지 않는다
create or replace function public.play_quiz_rank_top(p_mode text, p_key text default null)
returns table (pos integer, nickname text, solved integer, me boolean, players integer)
language sql
stable
security definer
set search_path = ''
as $$
    with b as (select * from public.play_quiz_rank_board(p_mode)),
    mine as (
        select p.id from public.play_quiz_players p
        where p_key is not null and p_key ~ '^[A-Za-z0-9_-]{16,64}$'
          and p.key_hash = encode(sha256(convert_to(p_key, 'UTF8')), 'hex')
    ),
    n as (select count(*)::integer as c from b)
    select b.pos, b.nickname, b.solved, b.player_id in (select id from mine), n.c
    from b, n
    where b.pos <= 10 or b.player_id in (select id from mine)
    order by b.pos
$$;
revoke all on function public.play_quiz_rank_top(text, text) from public;
grant execute on function public.play_quiz_rank_top(text, text) to anon, authenticated;
