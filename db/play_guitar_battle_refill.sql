-- 기타 키우기: 오늘 남은 배틀을 광고 보고 갱신 (2026-11-15 사용자: "오늘 남은 배틀도 광고 보면 갱신할 수 있게, 오른쪽에 광고 표시와 함께 갱신 단추")
--   화면(guitar.html 의 btRefill)이 보상형 광고를 끝까지 본 뒤 이 함수를 불러 오늘 센 배틀 수(bt_n)를 0으로 되돌린다 → 다시 5번.
--   서버는 광고를 봤는지 알 수 없어서, 대신 15분에 한 번만 받는다(화면 쿨타임 15분 — 시계 차이를 생각해 서버는 14분).
--   표 구조: play_guitar_players 에 칸 하나(bt_refill_at = 마지막으로 갱신한 때)를 더한다. play_guitar_battle 은 그대로(bt_n 으로 센다).
--   운영 계정(숨김 줄)은 원래 하루 횟수를 안 세니 상관없다.

alter table public.play_guitar_players add column if not exists bt_refill_at timestamptz;

create or replace function public.play_guitar_battle_refill(p_key text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_hash text := public.play_guitar_hash(p_key);
    v_day date := (now() at time zone 'Asia/Seoul')::date;
    v_me public.play_guitar_players%rowtype;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    select * into v_me from public.play_guitar_players p where p.key_hash = v_hash for update;
    if not found then raise exception 'no_player'; end if;
    if v_me.bt_refill_at is not null and v_me.bt_refill_at > now() - interval '14 minutes' then raise exception 'cooldown'; end if;
    update public.play_guitar_players p set bt_day = v_day, bt_n = 0, bt_refill_at = now() where p.id = v_me.id;
    return 5;   -- 오늘 남은 배틀
end;
$$;
revoke all on function public.play_guitar_battle_refill(text) from public;
grant execute on function public.play_guitar_battle_refill(text) to anon, authenticated;
