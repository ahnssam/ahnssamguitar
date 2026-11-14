-- 놀이터 닉네임 금지어 — 서버에서도 막는다 (2026-11-15 사용자: "상스러운 닉네임이나 저질 이런 거로 하면 방지하고 싶은데" → "적용해줘")
--   브라우저(guitar.html 의 nickErr)에서 먼저 막고, 우회해서 보내도 서버가 '익명'으로 바꿔 저장한다.
--   kind 'bad'      = 욕설·성적인 말 → 누구든 '익명'
--   kind 'reserved' = 안쌤·운영자처럼 보이는 이름 → 운영 계정(is_site_admin)만 쓸 수 있고, 다른 사람은 '익명'
--   검사는 띄어쓰기·숫자·기호를 빼고 소문자로 바꾼 뒤 '들어 있나'로 본다('시 1 발' → '시발').
--   금지어를 더하려면: insert into public.play_bad_words (w, kind) values ('단어', 'bad') on conflict do nothing;
--   적용한 곳: 기타 키우기 랭킹(play_guitar_save), 퀴즈 랭킹(play_quiz_rank_submit — 같은 김에 링크 검사의 \b → \y 도 고침)

create table if not exists public.play_bad_words (
    w text primary key check (w = lower(w) and w <> ''),
    kind text not null default 'bad' check (kind in ('bad', 'reserved'))
);
alter table public.play_bad_words enable row level security;
revoke all on public.play_bad_words from anon, authenticated;

insert into public.play_bad_words (w, kind) values
    ('시발', 'bad'), ('씨발', 'bad'), ('씨빨', 'bad'), ('씨바', 'bad'), ('쓰발', 'bad'), ('쉬발', 'bad'), ('슈발', 'bad'), ('ㅅㅂ', 'bad'), ('ㅆㅂ', 'bad'),
    ('병신', 'bad'), ('븅신', 'bad'), ('빙신', 'bad'), ('ㅂㅅ', 'bad'), ('좆', 'bad'), ('존나', 'bad'), ('ㅈㄴ', 'bad'), ('지랄', 'bad'), ('ㅈㄹ', 'bad'),
    ('개새', 'bad'), ('개색', 'bad'), ('개세끼', 'bad'), ('개쉐', 'bad'), ('썅', 'bad'), ('염병', 'bad'), ('엠창', 'bad'), ('니미', 'bad'), ('느금', 'bad'),
    ('니애미', 'bad'), ('애미', 'bad'), ('애비', 'bad'), ('미친년', 'bad'), ('미친놈', 'bad'), ('또라이', 'bad'), ('호로', 'bad'),
    ('섹스', 'bad'), ('보지', 'bad'), ('자지', 'bad'), ('창녀', 'bad'), ('걸레', 'bad'), ('후장', 'bad'), ('강간', 'bad'), ('야동', 'bad'), ('자위', 'bad'), ('딸딸이', 'bad'),
    ('fuck', 'bad'), ('fuk', 'bad'), ('shit', 'bad'), ('bitch', 'bad'), ('sex', 'bad'), ('porn', 'bad'), ('dick', 'bad'), ('pussy', 'bad'), ('nigger', 'bad'), ('nigga', 'bad'),
    ('안쌤', 'reserved'), ('기타나무숲', 'reserved'), ('운영자', 'reserved'), ('운영진', 'reserved'), ('관리자', 'reserved'), ('admin', 'reserved')
on conflict (w) do nothing;

-- 닉네임 다듬기: 빈칸이면 '익명', 금지어가 들어 있으면 '익명', 아니면 그대로
create or replace function public.play_nick_clean(p_nick text)
returns text
language plpgsql stable security definer
set search_path = ''
as $$
declare
    v text := btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g'));
    flat text;
begin
    if v = '' then return '익명'; end if;
    flat := lower(regexp_replace(v, '[\s0-9_.,!?~*^·\-]+', '', 'g'));
    if exists (select 1 from public.play_bad_words b where b.kind = 'bad' and position(b.w in flat) > 0) then return '익명'; end if;
    if exists (select 1 from public.play_bad_words b where b.kind = 'reserved' and position(b.w in flat) > 0)
       and not public.is_site_admin() then return '익명'; end if;
    return v;
end;
$$;
revoke all on function public.play_nick_clean(text) from public, anon, authenticated;

-- 기타 키우기 랭킹 저장 — 닉네임만 play_nick_clean 을 거치게(나머지는 db/play_guitar_rank2.sql·play_guitar_fight_no.sql 그대로)
create or replace function public.play_guitar_save(p_key text, p_nick text, p_fam text, p_lv integer, p_best integer default null::integer, p_top_fam text default null::text, p_top_lv integer default null::integer, p_gold bigint default null::bigint)
 returns table(id bigint, pos integer, players integer, hidden boolean)
 language plpgsql
 security definer
 set search_path to ''
as $function$
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
    if char_length(v_nick) > 12 then raise exception 'long'; end if;
    if v_nick ~* '(https?:|www\.|\.(com|net|kr|co|io|me|ly)\y)' then raise exception 'link'; end if;
    v_nick := public.play_nick_clean(v_nick);   -- 2026-11-15 금지어면 '익명'

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
$function$;

-- 퀴즈 랭킹 올리기 — 닉네임 금지어 + 링크 검사 \b → \y (Postgres 에서 \b 는 단어 경계가 아니라서 'abc.com' 이 안 막혔음, 2026-11-12 발견)
create or replace function public.play_quiz_rank_submit(p_key text, p_nick text, p_mode text, p_qids text[])
 returns table(pos integer, solved integer, players integer, hidden boolean)
 language plpgsql
 security definer
 set search_path to ''
as $function$
#variable_conflict use_column
declare
  v_hash text;
  v_nick text := btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g'));
  v_id bigint;
  v_hidden boolean;
begin
  if coalesce(p_key, '') !~ '^[A-Za-z0-9_-]{16,64}$' then raise exception 'bad_key'; end if;
  if p_mode is null or p_mode not in ('tab', 'artist', 'trivia1', 'trivia2', 'trivia3') then raise exception 'bad_mode'; end if;
  if char_length(v_nick) > 12 then raise exception 'long'; end if;
  if v_nick ~* '(https?:|www\.|\.(com|net|kr|co|io|me|ly)\y)' then raise exception 'link'; end if;
  v_nick := public.play_nick_clean(v_nick);   -- 2026-11-15 금지어면 '익명'
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
$function$;
