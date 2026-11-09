-- 기타 퀴즈쇼: 문제마다 다른 사람 정답률 (2026-11-09 사용자 요청)
--   · 결과 화면 '문제 다시 보기'에 문제마다 "정답률 42% · 57명"을 보여 준다.
--   · 한 판 끝날 때 10문제의 [문제 표시, 맞힘 여부]를 보내면 문제마다 푼 수·맞힌 수를 1씩 더하고, 더한 뒤 숫자를 돌려준다.
--   · 문제 표시(qid)는 브라우저에서 "종류|문제" 글자를 16자리 해시로 바꾼 것이다(quiz.html의 qHash).
--     기타 상식은 문제 글, 악보·가수 퀴즈는 곡 이름이 바탕이라 문제 글을 고치면 그 문제는 0부터 다시 센다.
--   · 개인 정보는 없다. 표는 직접 읽고 쓰지 못하게 막고(RLS 켜고 정책 없음) 아래 함수로만 넣고 읽는다.
--   · play_stats.sql 처럼 장난으로 여러 번 보내는 것까지 막지는 않는다(가벼운 놀이용 숫자).

create table if not exists public.play_quiz_answers (
    mode text not null check (mode in ('tab', 'artist', 'trivia')),
    qid text not null check (qid ~ '^[0-9a-f]{16}$'),
    plays integer not null default 0 check (plays >= 0),
    correct integer not null default 0 check (correct between 0 and plays),
    updated_at timestamptz not null default now(),
    primary key (mode, qid)
);
alter table public.play_quiz_answers enable row level security;
revoke all on public.play_quiz_answers from anon, authenticated;

-- 한 판 저장 + 그 문제들의 정답률 돌려주기. p_items = [{"q": "16자리 해시", "ok": true}, ...]
create or replace function public.play_quiz_answers_save(p_mode text, p_items jsonb)
returns table (qid text, plays integer, correct integer)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
    if p_mode is null or p_mode not in ('tab', 'artist', 'trivia') then raise exception 'bad mode'; end if;
    if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 20 then
        raise exception 'bad items';
    end if;
    if exists (
        select 1 from jsonb_array_elements(p_items) x
        where jsonb_typeof(x) <> 'object' or coalesce(x->>'q', '') !~ '^[0-9a-f]{16}$' or jsonb_typeof(x->'ok') is distinct from 'boolean'
    ) then raise exception 'bad item'; end if;

    insert into public.play_quiz_answers as a (mode, qid, plays, correct)
    select p_mode, x->>'q', 1, max(case when (x->>'ok')::boolean then 1 else 0 end)
    from jsonb_array_elements(p_items) x
    group by x->>'q'
    on conflict (mode, qid) do update
        set plays = a.plays + 1, correct = a.correct + excluded.correct, updated_at = now();

    return query
        select a.qid, a.plays, a.correct
        from public.play_quiz_answers a
        where a.mode = p_mode and a.qid in (select x->>'q' from jsonb_array_elements(p_items) x);
end;
$$;

revoke all on function public.play_quiz_answers_save(text, jsonb) from public;
grant execute on function public.play_quiz_answers_save(text, jsonb) to anon, authenticated;
