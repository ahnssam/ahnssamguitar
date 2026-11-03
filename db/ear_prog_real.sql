-- 이어 트레이닝 > 코드 진행 '실전' 난이도(real) 를 랭킹에 받기 위한 변경.
-- 가요·팝에서 많이 쓰는 8마디 진행을 맞히는 단계. 계수 3.25 (8단계 3.0 < 실전 < 지옥 3.5).
-- Supabase SQL Editor 에서 그대로 실행하면 된다. 기존 모드·난이도 동작은 바뀌지 않는다.

alter table public.sessions drop constraint sessions_difficulty_check;
alter table public.sessions add constraint sessions_difficulty_check
  check (difficulty = any (array['easy','medium','hard','hell','lv1','lv2','lv3','lv4','lv5','lv6','lv7','lv8','real']));

CREATE OR REPLACE FUNCTION public.submit_ear_session(p_mode text, p_difficulty text, p_started_at timestamp with time zone, p_ended_at timestamp with time zone, p_answers jsonb)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
    v_user_id uuid := auth.uid();
    v_total int;
    v_correct int := 0;
    v_valid_correct int := 0;
    v_rejected_fast int := 0;
    v_coef numeric;
    v_score int;
    v_duration int;
    v_recent_count int;
    v_new_id uuid;
    v_answer jsonb;
    v_correct_flag boolean;
    v_response_ms int;
    i int;
begin
    if v_user_id is null then
        raise exception 'auth_required';
    end if;
    if p_mode not in ('ear_single', 'ear_compare', 'ear_chord', 'ear_prog') then
        raise exception 'invalid_mode';
    end if;
    -- 코드 진행은 단계(lv1~lv8) + 실전(real) + 지옥(hell), 나머지 모드는 기존 난이도만
    if p_mode = 'ear_prog' then
        if p_difficulty not in ('lv1','lv2','lv3','lv4','lv5','lv6','lv7','lv8','real','hell') then
            raise exception 'invalid_difficulty';
        end if;
    elsif p_difficulty not in ('easy', 'medium', 'hard', 'hell') then
        raise exception 'invalid_difficulty';
    end if;
    if jsonb_typeof(p_answers) <> 'array' then
        raise exception 'invalid_answers';
    end if;
    v_total := jsonb_array_length(p_answers);
    if v_total <> 10 then
        raise exception 'session_must_be_10';
    end if;

    -- Rate limit: <5 sessions per minute
    select count(*) into v_recent_count
    from public.sessions
    where user_id = v_user_id
      and created_at > now() - interval '1 minute';
    if v_recent_count >= 5 then
        raise exception 'rate_limited';
    end if;

    -- Walk the answer array
    for i in 0 .. v_total - 1 loop
        v_answer := p_answers -> i;
        v_correct_flag := coalesce((v_answer ->> 'correct')::boolean, false);
        v_response_ms := coalesce((v_answer ->> 'response_ms')::int, 0);
        if v_correct_flag then
            v_correct := v_correct + 1;
            if v_response_ms >= 300 then
                v_valid_correct := v_valid_correct + 1;
            else
                v_rejected_fast := v_rejected_fast + 1;
            end if;
        end if;
    end loop;

    if p_mode = 'ear_prog' and p_difficulty = 'hell' then
        v_coef := 3.5;
    else
        v_coef := case p_difficulty
            when 'easy'   then 1.0
            when 'medium' then 1.5
            when 'hard'   then 2.0
            when 'hell'   then 3.0
            when 'lv1'    then 1.0
            when 'lv2'    then 1.25
            when 'lv3'    then 1.5
            when 'lv4'    then 1.75
            when 'lv5'    then 2.0
            when 'lv6'    then 2.25
            when 'lv7'    then 2.5
            when 'lv8'    then 3.0
            when 'real'   then 3.25
        end;
    end if;

    v_score := floor(v_valid_correct * 10 * v_coef);
    v_duration := greatest(0, extract(epoch from (p_ended_at - p_started_at))::int);

    insert into public.sessions (
        user_id, mode, difficulty, score, correct_count, total_count, duration_seconds, started_at
    ) values (
        v_user_id, p_mode, p_difficulty, v_score, v_correct, v_total, v_duration, p_started_at
    )
    returning id into v_new_id;

    update public.profiles set last_active_at = now() where id = v_user_id;

    return json_build_object(
        'session_id', v_new_id,
        'score', v_score,
        'correct_count', v_correct,
        'total_count', v_total,
        'rejected_fast', v_rejected_fast
    );
end;
$function$;

CREATE OR REPLACE FUNCTION public.submit_ear_streak(p_streak integer, p_mode text DEFAULT 'all'::text, p_difficulty text DEFAULT 'all'::text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_uid uuid := auth.uid();
  v_key text := public.ear_period_key(now());
  v_best int;
  v_mode text := coalesce(p_mode,'all');
  v_diff text := coalesce(p_difficulty,'all');
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  if p_streak is null or p_streak < 0 then return 0; end if;
  if p_streak > 100000 then p_streak := 100000; end if;
  if v_mode not in ('all','ear_single','ear_compare','ear_chord','ear_prog') then v_mode := 'all'; end if;
  if v_diff not in ('all','easy','medium','hard','hell','lv1','lv2','lv3','lv4','lv5','lv6','lv7','lv8','real') then v_diff := 'all'; end if;

  insert into public.ear_streaks(user_id,period_key,mode,difficulty,best_streak,updated_at)
  values (v_uid,v_key,v_mode,v_diff,p_streak,now())
  on conflict (user_id,period_key,mode,difficulty)
  do update set best_streak=greatest(ear_streaks.best_streak,excluded.best_streak), updated_at=now()
  returning best_streak into v_best;

  if v_diff <> 'all' then
    insert into public.ear_streaks(user_id,period_key,mode,difficulty,best_streak,updated_at)
    values (v_uid,v_key,v_mode,'all',p_streak,now())
    on conflict (user_id,period_key,mode,difficulty)
    do update set best_streak=greatest(ear_streaks.best_streak,excluded.best_streak), updated_at=now();
  end if;

  if v_mode <> 'all' then
    insert into public.ear_streaks(user_id,period_key,mode,difficulty,best_streak,updated_at)
    values (v_uid,v_key,'all','all',p_streak,now())
    on conflict (user_id,period_key,mode,difficulty)
    do update set best_streak=greatest(ear_streaks.best_streak,excluded.best_streak), updated_at=now();
  end if;

  return v_best;
end; $function$;
