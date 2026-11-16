-- 기타 키우기: 계열에 텔레 2세트(tele2)·레스폴 2세트(lespaul2)·통기타 2세트(acoustic2)·베이스 2세트(bass2)를 더한다
--   (2026-11-17 사용자: 텔레·레스폴 새 디자인 21장씩 → 같은 날 통기타·베이스 2세트도 넣어서 이 파일에 함께 더함, 아직 적용 전)
--   지금 서버는 strat·strat2·tele·lespaul·superstrat·acoustic·bass·amp·multi 만 받아서, 2세트 텔레·레스폴을 대표로 올리면 'bad_fam' 이 난다.
--   그동안 게임(guitar.html 의 syncMe)은 'bad_fam' 이 나면 'tele'·'lespaul' 로 다시 올린다 — 그래서 다른 사람 화면(오늘의 상대·랭킹)에는 1세트 그림으로 보인다.
--   이 파일을 적용하면 2세트 그대로 올라가서 다른 사람 화면에도 2세트 그림으로 보인다. 다른 것은 그대로(db/play_guitar_fam_strat2.sql 과 같은 함수에 두 이름만 더함).
alter table public.play_guitar_players drop constraint if exists play_guitar_players_fam_check;
alter table public.play_guitar_players add constraint play_guitar_players_fam_check
    check (fam in ('strat', 'strat2', 'tele', 'tele2', 'lespaul', 'lespaul2', 'superstrat', 'acoustic', 'acoustic2', 'bass', 'bass2', 'amp', 'multi'));
alter table public.play_guitar_players drop constraint if exists play_guitar_players_top_fam_check;
alter table public.play_guitar_players add constraint play_guitar_players_top_fam_check
    check (top_fam is null or top_fam in ('strat', 'strat2', 'tele', 'tele2', 'lespaul', 'lespaul2', 'superstrat', 'acoustic', 'acoustic2', 'bass', 'bass2'));

-- play_guitar_save — 계열 목록에 'tele2'·'lespaul2'·'acoustic2'·'bass2' 만 더함(나머지는 db/play_guitar_fam_strat2.sql 그대로)
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
    if coalesce(p_fam, '') not in ('strat', 'strat2', 'tele', 'tele2', 'lespaul', 'lespaul2', 'superstrat', 'acoustic', 'acoustic2', 'bass', 'bass2', 'amp', 'multi') then raise exception 'bad_fam'; end if;
    if p_lv is null or p_lv not between 0 and 20 then raise exception 'bad_lv'; end if;
    if p_top_fam is not null and p_top_fam not in ('strat', 'strat2', 'tele', 'tele2', 'lespaul', 'lespaul2', 'superstrat', 'acoustic', 'acoustic2', 'bass', 'bass2') then raise exception 'bad_fam'; end if;
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
            coalesce(p_top_fam, case when p_fam in ('strat', 'strat2', 'tele', 'tele2', 'lespaul', 'lespaul2', 'superstrat', 'acoustic', 'acoustic2', 'bass', 'bass2') then p_fam end),
            coalesce(p_top_lv, case when p_fam in ('strat', 'strat2', 'tele', 'tele2', 'lespaul', 'lespaul2', 'superstrat', 'acoustic', 'acoustic2', 'bass', 'bass2') then p_lv else 0 end),
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
