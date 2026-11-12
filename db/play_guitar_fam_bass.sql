-- 기타 키우기: 계열에 베이스(bass)·멀티이펙터(multi)를 더한다 (2026-11-12 사용자: 통기타·베이스 적용)
-- play_guitar_rank.sql 은 strat·tele·lespaul·superstrat·acoustic·amp 만 받아서, 베이스 기타를 대표로 올리면 'bad_fam' 이 났다.
-- 표의 검사(check)와 play_guitar_save 의 검사를 같이 바꾼다. 다른 것은 그대로.
alter table public.play_guitar_players drop constraint if exists play_guitar_players_fam_check;
alter table public.play_guitar_players add constraint play_guitar_players_fam_check
    check (fam in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass', 'amp', 'multi'));

create or replace function public.play_guitar_save(p_key text, p_nick text, p_fam text, p_lv integer, p_best integer default null)
returns table (id bigint, pos integer, players integer, hidden boolean)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
    v_hash text := public.play_guitar_hash(p_key);
    v_nick text := btrim(regexp_replace(coalesce(p_nick, ''), '\s+', ' ', 'g'));
    v_id bigint;
    v_hidden boolean;
begin
    if v_hash is null then raise exception 'bad_key'; end if;
    if coalesce(p_fam, '') not in ('strat', 'tele', 'lespaul', 'superstrat', 'acoustic', 'bass', 'amp', 'multi') then raise exception 'bad_fam'; end if;
    if p_lv is null or p_lv not between 0 and 20 then raise exception 'bad_lv'; end if;
    if v_nick = '' then v_nick := '익명'; end if;
    if char_length(v_nick) > 12 then raise exception 'long'; end if;
    -- Postgres 정규식의 단어 경계는 \y (\b 는 백스페이스라 '.com' 이 안 걸린다)
    if v_nick ~* '(https?:|www\.|\.(com|net|kr|co|io|me|ly)\y)' then raise exception 'link'; end if;

    if not exists (select 1 from public.play_guitar_players p where p.key_hash = v_hash)
       and (select count(*) from public.play_guitar_players p where p.created_at > now() - interval '1 minute') >= 60 then
        raise exception 'busy';
    end if;

    insert into public.play_guitar_players as p (key_hash, nickname, fam, lv, best, hidden)
    values (v_hash, v_nick, p_fam, p_lv, greatest(p_lv, least(coalesce(p_best, 0), 20)), public.is_site_admin())
    on conflict (key_hash) do update
        set nickname = excluded.nickname,
            fam = excluded.fam,
            lv_at = case when p.lv <> excluded.lv or p.fam <> excluded.fam then now() else p.lv_at end,
            lv = excluded.lv,
            best = greatest(p.best, excluded.best),
            hidden = p.hidden or excluded.hidden,
            updated_at = now()
    returning p.id, p.hidden into v_id, v_hidden;

    return query
        select v_id,
               (select b.pos from public.play_guitar_board() b where b.id = v_id),
               (select count(*)::integer from public.play_guitar_players p where not p.hidden),
               v_hidden;
end;
$$;
revoke all on function public.play_guitar_save(text, text, text, integer, integer) from public;
grant execute on function public.play_guitar_save(text, text, text, integer, integer) to anon, authenticated;
