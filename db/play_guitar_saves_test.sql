-- 기타 키우기: 테스트 1·2·3 기록도 계정에 저장 (2026-11-20 사용자: '어느 기기에서든 보는 랭킹에 그 테스트 이름이 떠 있으니까 —
--   안 그러면 모바일에 1 2 3, 맥북에 1 2 3, 맥스튜에 1 2 3 하면 너무 복잡하잖아')
-- 예전(2026-11-17 ~ 11-20)엔 테스트 기록이 그 브라우저(localStorage play.gk.t1 …)에만 있어서, 다른 기기에서 테스트 1을 고르면 빈 기록부터 시작했다.
-- 이제 계정 저장 한 줄을 칸(slot)으로 나눈다: 0 = 지금까지의 계정 기록(누구나), 1·2·3 = 테스트 1·2·3(운영 계정만).
--   · 지금 있는 줄은 모두 0번 칸이 된다(그대로)
--   · 함수 이름은 그대로, p_slot 만 더했다(기본 0) — 예전 화면(캐시)이 부르는 play_guitar_load() · play_guitar_store(p_data) 도 그대로 된다
--   · 테스트 칸의 랭킹·배틀 줄은 따로다(저장 안의 랭킹 열쇠 rk) — 저장을 이어 받으면 다른 기기에서도 같은 랭킹 줄로 이어진다
-- 오류 코드(err.code): no_login · bad_data · too_big · bad_slot · not_admin

alter table public.play_guitar_saves add column if not exists slot smallint not null default 0;
alter table public.play_guitar_saves drop constraint if exists play_guitar_saves_slot_check;
alter table public.play_guitar_saves add constraint play_guitar_saves_slot_check check (slot between 0 and 3);
alter table public.play_guitar_saves drop constraint if exists play_guitar_saves_pkey;
alter table public.play_guitar_saves add constraint play_guitar_saves_pkey primary key (user_id, slot);

-- 내 저장 불러오기 (없으면 빈 결과). 테스트 칸은 운영 계정만
drop function if exists public.play_guitar_load();
create or replace function public.play_guitar_load(p_slot integer default 0)
returns table (data jsonb, rev integer, updated_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
    select s.data, s.rev, s.updated_at from public.play_guitar_saves s
    where s.user_id = auth.uid() and s.slot = coalesce(p_slot, 0) and (coalesce(p_slot, 0) = 0 or public.is_site_admin())
$$;
revoke all on function public.play_guitar_load(integer) from public, anon;
grant execute on function public.play_guitar_load(integer) to authenticated;

-- 내 저장 올리기(처음이면 만들기) → 새 rev
drop function if exists public.play_guitar_store(jsonb);
create or replace function public.play_guitar_store(p_data jsonb, p_slot integer default 0)
returns table (rev integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
    if auth.uid() is null then raise exception 'no_login'; end if;
    if p_slot is null or p_slot < 0 or p_slot > 3 then raise exception 'bad_slot'; end if;
    if p_slot <> 0 and not public.is_site_admin() then raise exception 'not_admin'; end if;
    if p_data is null or jsonb_typeof(p_data) <> 'object' then raise exception 'bad_data'; end if;
    if octet_length(p_data::text) > 65536 then raise exception 'too_big'; end if;
    return query
        insert into public.play_guitar_saves as s (user_id, slot, data) values (auth.uid(), p_slot, p_data)
        on conflict (user_id, slot) do update set data = excluded.data, rev = s.rev + 1, updated_at = now()
        returning s.rev, s.updated_at;
end;
$$;
revoke all on function public.play_guitar_store(jsonb, integer) from public, anon;
grant execute on function public.play_guitar_store(jsonb, integer) to authenticated;
