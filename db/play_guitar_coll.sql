-- 기타 키우기: 랭킹에서 누르면 그 사람의 컬렉션(진열 벽)을 본다 (2026-11-16 사용자: '랭킹에 있는 사람들의 악기 컬렉션을 볼 수 있게? 누르면')
--   지금까지 서버에는 사람마다 대표 기타·최고 무기·모은 돈만 있었다. 진열 벽 요약(수백 바이트)을 한 칸 더 둔다.
--   coll = { s: 벽 스킨 id, w: [걸이 5칸 — [계열, 단계] 또는 null], o: 열린 걸이(비트, 가운데 = 4), f: [바닥 앰프·멀티 [계열, 단계] … 6개까지], r: 대표 기타 걸이 번호(없으면 -1) }
--   게임(guitar.html 의 syncColl)이 대표 기타를 올린 뒤, 컬렉션이 바뀌었을 때만 play_guitar_coll_save 로 올린다.
--   운영 계정(숨김 줄)·시험 브라우저는 안 올린다. 봇 40명은 아래에서 그럴듯한 컬렉션을 한 번 넣는다.
--   맨 아래: 봇 닉네임을 진짜 사람 닉네임처럼 바꾼다(같은 날 사용자 요청).
--   계열 이름은 영문 소문자·숫자 모양만 본다(앞으로 tele2 같은 새 계열이 생겨도 이 파일을 안 고쳐도 되게. 모르는 계열은 화면이 스트랫으로 그린다).

alter table public.play_guitar_players add column if not exists coll jsonb;
alter table public.play_guitar_players drop constraint if exists play_guitar_players_coll_size;
alter table public.play_guitar_players add constraint play_guitar_players_coll_size check (coll is null or octet_length(coll::text) <= 2048);

-- 내 컬렉션 올리기 — 받은 값을 그대로 넣지 않고, 칸마다 검사해서 새로 만든다. 내 줄이 없거나 숨김 줄이면 아무것도 안 함(false)
create or replace function public.play_guitar_coll_save(p_key text, p_coll jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_hash text := public.play_guitar_hash(p_key);
    v_w jsonb := '[]'::jsonb;
    v_f jsonb := '[]'::jsonb;
    v_sk text;
    v_o integer;
    v_r integer;
    e jsonb;
    i integer;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    if p_coll is null or jsonb_typeof(p_coll) <> 'object' then raise exception 'bad_coll'; end if;
    v_sk := p_coll ->> 's';
    if v_sk is null or v_sk !~ '^[a-z0-9_]{1,20}$' then v_sk := 'wood'; end if;
    for i in 0..4 loop   -- 걸이 5칸 (기타만)
        e := case when jsonb_typeof(p_coll -> 'w') = 'array' then p_coll -> 'w' -> i end;
        if e is not null and jsonb_typeof(e) = 'array' and coalesce(e ->> 0, '') ~ '^[a-z][a-z0-9]{1,15}$' and e ->> 0 not in ('amp', 'multi')
           and coalesce(e ->> 1, '') ~ '^[0-9]{1,2}$' and (e ->> 1)::integer <= 20 then
            v_w := v_w || jsonb_build_array(jsonb_build_array(e ->> 0, (e ->> 1)::integer));
        else
            v_w := v_w || jsonb_build_array(null::jsonb);
        end if;
    end loop;
    for e in select x.value from jsonb_array_elements(case when jsonb_typeof(p_coll -> 'f') = 'array' then p_coll -> 'f' else '[]'::jsonb end) x limit 6 loop   -- 바닥 (앰프·멀티)
        if jsonb_typeof(e) = 'array' and e ->> 0 in ('amp', 'multi') and coalesce(e ->> 1, '') ~ '^[0-9]{1,2}$' and (e ->> 1)::integer <= 20 then
            v_f := v_f || jsonb_build_array(jsonb_build_array(e ->> 0, (e ->> 1)::integer));
        end if;
    end loop;
    v_o := case when coalesce(p_coll ->> 'o', '') ~ '^[0-9]{1,2}$' then (p_coll ->> 'o')::integer & 31 else 4 end;
    v_r := case when coalesce(p_coll ->> 'r', '') ~ '^-?[0-9]$' then (p_coll ->> 'r')::integer else -1 end;
    if v_r not between -1 and 4 then v_r := -1; end if;

    update public.play_guitar_players p
       set coll = jsonb_build_object('s', v_sk, 'w', v_w, 'o', v_o, 'f', v_f, 'r', v_r)
     where p.key_hash = v_hash and not p.hidden;
    return found;
end;
$$;
revoke all on function public.play_guitar_coll_save(text, jsonb) from public;
grant execute on function public.play_guitar_coll_save(text, jsonb) to anon, authenticated;

-- 파이트 넘버로 그 사람 컬렉션 보기 (로그인 없이 누구나). 숨김 줄(운영 계정)은 컬렉션을 안 보여 준다
create or replace function public.play_guitar_coll(p_id bigint)
returns table (id bigint, nickname text, top_fam text, top_lv smallint, gold bigint, coll jsonb)
language sql
stable
security definer
set search_path = ''
as $$
    select p.fight_no::bigint, p.nickname, p.top_fam, p.top_lv, p.gold, case when p.hidden then null else p.coll end
    from public.play_guitar_players p where p.fight_no = p_id
    order by p.updated_at desc
    limit 1
$$;
revoke all on function public.play_guitar_coll(bigint) from public;
grant execute on function public.play_guitar_coll(bigint) to anon, authenticated;

-- 봇 40명(db/play_guitar_bots.sql)의 컬렉션 — 가운데 걸이에 최고 무기, 단계가 높을수록 걸이·바닥 장비가 많고 벽 스킨도 좋게.
--   setseed 로 늘 같은 결과. 봇 컬렉션을 지우려면:
--     update public.play_guitar_players set coll = null where key_hash in (select encode(sha256(convert_to('bot:ahnssam:' || g, 'UTF8')), 'hex') from generate_series(1, 40) g);
do $$
declare
    b record;
    fams text[] := array['strat', 'strat2', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass'];
    skins text[] := array['wood', 'wood', 'brick', 'cabin', 'rehearsal', 'hanok', 'vintage', 'showroom', 'neon', 'stage', 'space'];
    hang integer[] := array[2, 1, 3, 0, 4];   -- 가운데부터 바깥으로 연다(게임과 같음)
    v_w jsonb; v_f jsonb; v_o integer; n integer; i integer; h integer; m integer;
begin
    perform setseed(0.4216);
    for b in
        select g as k, p.top_fam, p.top_lv
        from generate_series(1, 40) g
        join public.play_guitar_players p on p.key_hash = encode(sha256(convert_to('bot:ahnssam:' || g, 'UTF8')), 'hex')
        where p.top_fam is not null
        order by g
    loop
        n := case when b.top_lv < 3 then 1 when b.top_lv < 6 then 2 + b.k % 2 when b.top_lv < 10 then 3 + b.k % 2 else 5 end;
        v_w := '[null, null, null, null, null]'::jsonb; v_o := 0;
        for i in 1..n loop
            h := hang[i];
            v_o := v_o | (1 << h);
            if i = 1 then
                v_w := jsonb_set(v_w, array[h::text], jsonb_build_array(b.top_fam, b.top_lv));
            elsif random() < 0.85 then
                v_w := jsonb_set(v_w, array[h::text], jsonb_build_array(fams[1 + floor(random() * 7)::integer], greatest(0, b.top_lv - 1 - floor(random() * 5)::integer)));
            end if;
        end loop;
        v_f := '[]'::jsonb;
        if b.top_lv >= 4 then
            m := floor(random() * (1 + least(3, b.top_lv / 4)))::integer;   -- 앰프 0~3대
            for i in 1..m loop v_f := v_f || jsonb_build_array(jsonb_build_array('amp', greatest(0, b.top_lv - 2 - floor(random() * 6)::integer))); end loop;
            m := floor(random() * (1 + least(3, b.top_lv / 5)))::integer;   -- 멀티 0~2대
            for i in 1..m loop v_f := v_f || jsonb_build_array(jsonb_build_array('multi', greatest(0, b.top_lv - 2 - floor(random() * 6)::integer))); end loop;
        end if;
        update public.play_guitar_players p
           set coll = jsonb_build_object('s', skins[1 + floor(random() * least(11, 2 + b.top_lv * 0.7))::integer], 'w', v_w, 'o', v_o, 'f', v_f, 'r', 2)
         where p.key_hash = encode(sha256(convert_to('bot:ahnssam:' || b.k, 'UTF8')), 'hex');
    end loop;
end $$;

-- 봇 닉네임을 진짜 사람 닉네임처럼 (2026-11-16 사용자: '너무 사람 같지 않은데? 진짜 사람 닉네임처럼, 실명 같아 보이는 것도 몇 개')
--   번호(1~40)는 db/play_guitar_bots.sql 과 같다 — 단계·모은 돈은 그대로, 이름만 바꾼다. 실명처럼 보이는 것 7개(흔한 이름)
update public.play_guitar_players p
   set nickname = v.nick
  from (values
    (1, '퇴근하고기타'), (2, 'jiwoo92'), (3, '김도윤'), (4, '새벽세시'), (5, '블루스아재'), (6, 'hyun_guitar'), (7, '이서연'), (8, '홍대버스커'),
    (9, '딩가딩가'), (10, 'tjdwns0412'), (11, '박준혁'), (12, '통기타소년'), (13, '별헤는밤'), (14, 'yuna.kim'), (15, '최예린'), (16, '일렉초보아재'),
    (17, '겨울비'), (18, 'hoon_lespaul'), (19, '주말엔합주'), (20, '베이스치는곰'), (21, '오늘도연습'), (22, 'seoyeon__'), (23, '강민재'), (24, '망원동기타'),
    (25, 'kimchi_rock'), (26, '코드막힘'), (27, 'dohyun99'), (28, '펜더덕후'), (29, '손가락아파요'), (30, '슬랩장인'), (31, 'jaehyuk_gt'), (32, '고양이집사'),
    (33, '기타는장비빨'), (34, 'riffmaster7'), (35, '서울촌놈'), (36, '윤서아'), (37, 'minseok_'), (38, '망고빙수'), (39, '음악하는개발자'), (40, '임하준')
  ) as v(k, nick)
 where p.key_hash = encode(sha256(convert_to('bot:ahnssam:' || v.k, 'UTF8')), 'hex');
