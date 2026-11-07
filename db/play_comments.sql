-- 기타 놀이터: 이상형 월드컵 결과 화면의 '한마디 남기기' (2026-11-08 만듦 — 사용자가 "적용해줘" 하면 적용)
--   · 로그인 없이 누구나 쓴다(다른 이상형 월드컵 사이트처럼). 닉네임은 비우면 '익명'.
--   · 댓글마다 쓴 사람이 고른 우승(pick)이 같이 보인다: "익명 · 우승: 레스폴 · 11-08 21:30".
--   · 이름·이메일·IP 같은 개인 정보는 저장하지 않는다.
--     대신 브라우저마다 만든 무작위 열쇠의 md5(owner)만 남겨서, 쓴 브라우저에서 자기 댓글을 지울 수 있게 한다.
--   · 장난 막기: 200자까지, 링크(http·www) 금지, 같은 브라우저는 15초에 한 번, 같은 글 하루 한 번,
--     사이트 전체로 1분에 30개까지. 신고가 3번 쌓이면 저절로 숨긴다. 운영 계정(is_site_admin)은 바로 지운다.
--   · 표는 직접 읽고 쓰지 못하게 막고(RLS 켜고 정책 없음), 아래 함수로만 쓴다.

create table if not exists public.play_wc_comments (
    id bigint generated always as identity primary key,
    theme text not null check (theme ~ '^[a-z0-9_-]{1,24}$'),
    pick text not null check (pick ~ '^[a-z0-9_-]{1,32}$'),
    nick text not null check (char_length(nick) between 1 and 12),
    body text not null check (char_length(body) between 1 and 200),
    owner text not null check (owner ~ '^[0-9a-f]{32}$'),
    reports smallint not null default 0,
    hidden boolean not null default false,
    created_at timestamptz not null default now()
);
create index if not exists play_wc_comments_theme on public.play_wc_comments (theme, id desc) where not hidden;
create index if not exists play_wc_comments_owner on public.play_wc_comments (owner, created_at desc);
alter table public.play_wc_comments enable row level security;
revoke all on public.play_wc_comments from anon, authenticated;

create table if not exists public.play_wc_comment_reports (
    comment_id bigint not null references public.play_wc_comments (id) on delete cascade,
    reporter text not null check (reporter ~ '^[0-9a-f]{32}$'),
    primary key (comment_id, reporter)
);
alter table public.play_wc_comment_reports enable row level security;
revoke all on public.play_wc_comment_reports from anon, authenticated;

-- 쓰기 → 새 댓글 id. 오류는 짧은 코드로 돌려주고 화면이 한국어로 바꿔 보여 준다
--   bad(형식) · empty(빈 글) · link(링크) · fast(너무 빨리) · dup(같은 글) · busy(사이트 전체가 너무 많음)
create or replace function public.play_wc_comment_add(p_theme text, p_pick text, p_nick text, p_body text, p_key text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_owner text;
    v_nick text := left(btrim(regexp_replace(coalesce(p_nick, ''), '[[:cntrl:]]', '', 'g')), 12);
    v_body text := left(btrim(regexp_replace(coalesce(p_body, ''), '[[:cntrl:]]+', ' ', 'g')), 200);
    v_id bigint;
begin
    if coalesce(p_theme, '') !~ '^[a-z0-9_-]{1,24}$' or coalesce(p_pick, '') !~ '^[a-z0-9_-]{1,32}$'
       or coalesce(p_key, '') !~ '^[A-Za-z0-9_-]{16,64}$' then raise exception 'bad'; end if;
    if v_body = '' then raise exception 'empty'; end if;
    if v_body ~* '(https?://|www\.|\.(com|net|kr|io|me|ly)(/|\s|$))' then raise exception 'link'; end if;
    if v_nick = '' then v_nick := '익명'; end if;
    v_owner := md5(p_key);
    if exists (select 1 from public.play_wc_comments where owner = v_owner and created_at > now() - interval '15 seconds') then raise exception 'fast'; end if;
    if exists (select 1 from public.play_wc_comments where owner = v_owner and body = v_body and created_at > now() - interval '1 day') then raise exception 'dup'; end if;
    if (select count(*) from public.play_wc_comments where created_at > now() - interval '1 minute') >= 30 then raise exception 'busy'; end if;
    insert into public.play_wc_comments (theme, pick, nick, body, owner)
    values (p_theme, p_pick, v_nick, v_body, v_owner)
    returning id into v_id;
    return v_id;
end;
$$;

-- 읽기: 최신순 20개씩(p_before 보다 오래된 것). mine = 이 브라우저가 쓴 댓글, total = 이 주제의 보이는 댓글 수
create or replace function public.play_wc_comments(p_theme text, p_key text default null, p_before bigint default null, p_limit integer default 20)
returns table (id bigint, pick text, nick text, body text, created_at timestamptz, mine boolean, total integer)
language sql
stable
security definer
set search_path = ''
as $$
    select c.id, c.pick, c.nick, c.body, c.created_at,
           p_key is not null and c.owner = md5(p_key),
           (select count(*) from public.play_wc_comments t where t.theme = p_theme and not t.hidden)::integer
    from public.play_wc_comments c
    where c.theme = p_theme and not c.hidden and (p_before is null or c.id < p_before)
    order by c.id desc
    limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

-- 지우기: 쓴 브라우저(열쇠가 맞으면) 또는 운영 계정
create or replace function public.play_wc_comment_delete(p_id bigint, p_key text default null)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
    delete from public.play_wc_comments c
    where c.id = p_id and ((p_key is not null and c.owner = md5(p_key)) or public.is_site_admin());
    return found;
end;
$$;

-- 신고: 같은 브라우저는 한 댓글에 한 번. 3번 쌓이면 숨김
create or replace function public.play_wc_comment_report(p_id bigint, p_key text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
    if coalesce(p_key, '') !~ '^[A-Za-z0-9_-]{16,64}$' then raise exception 'bad'; end if;
    insert into public.play_wc_comment_reports (comment_id, reporter)
    select c.id, md5(p_key) from public.play_wc_comments c where c.id = p_id and c.owner <> md5(p_key)
    on conflict do nothing;
    if not found then return false; end if;
    update public.play_wc_comments c set reports = c.reports + 1, hidden = (c.reports + 1 >= 3) where c.id = p_id;
    return true;
end;
$$;

revoke all on function public.play_wc_comment_add(text, text, text, text, text) from public;
revoke all on function public.play_wc_comments(text, text, bigint, integer) from public;
revoke all on function public.play_wc_comment_delete(bigint, text) from public;
revoke all on function public.play_wc_comment_report(bigint, text) from public;
grant execute on function public.play_wc_comment_add(text, text, text, text, text) to anon, authenticated;
grant execute on function public.play_wc_comments(text, text, bigint, integer) to anon, authenticated;
grant execute on function public.play_wc_comment_delete(bigint, text) to anon, authenticated;
grant execute on function public.play_wc_comment_report(bigint, text) to anon, authenticated;
