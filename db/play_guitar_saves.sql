-- 기타 키우기: 로그인하면 진행(골드·기타·벽·도감·장비)을 계정에 저장한다 (2026-11-12 사용자 요청:
--   "로그인 안 하고 하다가 악기가 잘 떴으면, 로그인해서 계속해도 끊기지 않게")
-- 로그인 안 하면 지금처럼 브라우저(localStorage play.gk)에만. 로그인하면
--   · 계정에 저장된 게 없으면 → 이 브라우저 진행을 그대로 올린다
--   · 있는데 이 브라우저가 비어 있으면 → 계정 것을 불러온다
--   · 둘 다 있으면 → 화면에서 어느 쪽을 쓸지 묻는다
--   · 그다음부터는 바뀔 때마다 계정에도 저장(늦게 저장한 쪽이 이김). 다른 기기에서 로그인하면 거기서 이어서.
-- 진행 값은 브라우저가 보낸 대로 믿는다(월드컵·퀴즈·랭킹과 같은 결정). 한 줄 64KB까지.
-- 오류 코드(err.code): no_login · bad_data · too_big

create table if not exists public.play_guitar_saves (
    user_id uuid primary key references auth.users (id) on delete cascade,
    data jsonb not null,
    rev integer not null default 1,                 -- 저장할 때마다 1씩. 다른 기기가 그사이 저장했는지 알아본다
    updated_at timestamptz not null default now()
);
alter table public.play_guitar_saves enable row level security;
revoke all on public.play_guitar_saves from anon, authenticated;

-- 내 저장 불러오기 (없으면 빈 결과)
create or replace function public.play_guitar_load()
returns table (data jsonb, rev integer, updated_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
    select s.data, s.rev, s.updated_at from public.play_guitar_saves s where s.user_id = auth.uid()
$$;
revoke all on function public.play_guitar_load() from public, anon;
grant execute on function public.play_guitar_load() to authenticated;

-- 내 저장 올리기(처음이면 만들기) → 새 rev
create or replace function public.play_guitar_store(p_data jsonb)
returns table (rev integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
    if auth.uid() is null then raise exception 'no_login'; end if;
    if p_data is null or jsonb_typeof(p_data) <> 'object' then raise exception 'bad_data'; end if;
    if octet_length(p_data::text) > 65536 then raise exception 'too_big'; end if;
    return query
        insert into public.play_guitar_saves as s (user_id, data) values (auth.uid(), p_data)
        on conflict (user_id) do update set data = excluded.data, rev = s.rev + 1, updated_at = now()
        returning s.rev, s.updated_at;
end;
$$;
revoke all on function public.play_guitar_store(jsonb) from public, anon;
grant execute on function public.play_guitar_store(jsonb) to authenticated;
