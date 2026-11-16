-- 기타 키우기: 배틀 갱신은 하루 3번까지 (2026-11-16 사용자: '배틀 갱신은 하루에 총 3번까지만 해줘')
--   예전(db/play_guitar_battle_refill.sql, 2026-11-15)은 14분에 한 번이면 몇 번이든 됐다. 화면(guitar.html 의 btRefill)이 하루 3번에서 막고,
--   서버도 같은 날(한국 시간) 세 번 넘게 부르면 'refill_limit' 로 거절한다. 쿨타임 14분은 그대로.
--   표 구조: play_guitar_players 에 칸 둘(bt_refill_day = 센 날, bt_refill_n = 그날 갱신한 횟수)을 더한다.
--   서버가 거절하면 화면은 그날 진짜 상대와도 브라우저 안에서 겨룬다(예전과 같음, 화면도 3번에서 막으니 그럴 일은 거의 없음).

alter table public.play_guitar_players
    add column if not exists bt_refill_day date,
    add column if not exists bt_refill_n smallint not null default 0;

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
    v_n integer;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    select * into v_me from public.play_guitar_players p where p.key_hash = v_hash for update;
    if not found then raise exception 'no_player'; end if;
    if v_me.bt_refill_at is not null and v_me.bt_refill_at > now() - interval '14 minutes' then raise exception 'cooldown'; end if;
    v_n := case when v_me.bt_refill_day = v_day then v_me.bt_refill_n else 0 end;
    if v_n >= 3 then raise exception 'refill_limit'; end if;
    update public.play_guitar_players p
       set bt_day = v_day, bt_n = 0, bt_refill_at = now(), bt_refill_day = v_day, bt_refill_n = v_n + 1
     where p.id = v_me.id;
    return 5;   -- 오늘 남은 배틀
end;
$$;
revoke all on function public.play_guitar_battle_refill(text) from public;
grant execute on function public.play_guitar_battle_refill(text) to anon, authenticated;
