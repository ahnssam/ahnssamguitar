-- ※ 2026-11-13: 이 파일 대신 db/play_guitar_fight_no.sql 을 적용한다(배틀 5번 + 파이트 넘버로 상대 찾기가 같이 들어 있음). 이 파일을 따로 적용하면 상대를 예전 차례 번호로 찾게 되니 적용하지 않는다.
-- 기타 키우기 — 하루 배틀 5번 (2026-11-13 사용자: "하루 배틀 횟수는 5번으로 제한해", 예전 10번)
--   play_guitar_rank.sql 의 play_guitar_battle 에서 숫자만 바꾼다(10 → 5). 화면은 guitar.html 의 BT_DAY = 5.
--   오늘 이미 5번 넘게 한 사람은 내일까지 막힌다(limit).
--   횟수를 다시 바꾸면 여기 숫자 두 곳과 guitar.html 의 BT_DAY 를 같이 고친다.

-- 배틀: 서버가 승패를 굴리고 두 사람의 승패 숫자를 더한다. 하루 5번까지
create or replace function public.play_guitar_battle(p_key text, p_opp bigint)
returns table (win boolean, chance double precision, my_lv smallint, opp_lv smallint, opp_nick text, left_today integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_hash text := public.play_guitar_hash(p_key);
    v_day date := (now() at time zone 'Asia/Seoul')::date;
    v_me public.play_guitar_players%rowtype;
    v_op public.play_guitar_players%rowtype;
    v_n integer;
    v_p double precision;
    v_win boolean;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    select * into v_me from public.play_guitar_players p where p.key_hash = v_hash for update;
    if not found then raise exception 'no_player'; end if;
    v_n := case when v_me.bt_day = v_day then v_me.bt_n else 0 end;
    if v_n >= 5 then raise exception 'limit'; end if;
    select * into v_op from public.play_guitar_players p where p.id = p_opp and p.id <> v_me.id for update;
    if not found then raise exception 'no_opp'; end if;

    v_p := case when v_me.lv = v_op.lv then 0.5
                when v_me.lv > v_op.lv then 1 - power(0.5, v_me.lv - v_op.lv + 1)
                else power(0.5, v_op.lv - v_me.lv + 1) end;
    v_win := random() < v_p;

    update public.play_guitar_players p
       set wins = p.wins + v_win::integer, losses = p.losses + (not v_win)::integer, bt_day = v_day, bt_n = v_n + 1
     where p.id = v_me.id;
    update public.play_guitar_players p
       set def_losses = p.def_losses + v_win::integer, def_wins = p.def_wins + (not v_win)::integer
     where p.id = v_op.id;

    return query select v_win, v_p, v_me.lv, v_op.lv, v_op.nickname, 5 - (v_n + 1);
end;
$$;
revoke all on function public.play_guitar_battle(text, bigint) from public;
grant execute on function public.play_guitar_battle(text, bigint) to anon, authenticated;
