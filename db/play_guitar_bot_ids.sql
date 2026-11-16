-- 기타 키우기: 운영 계정에게만 봇 파이트 넘버를 알려 준다
--   (2026-11-17 사용자: '관리자 계정으로 로그인하면 랭킹에 진짜 사람하고 봇을 구분하는 표시를 볼 수 있게')
--   봇 = db/play_guitar_bots.sql 로 넣은 줄(key_hash = sha256('bot:ahnssam:<번호>')). 나중에 봇을 더 넣어도 되게 1~500번까지 본다.
--   운영 계정(is_site_admin())이 아니면 아무것도 안 돌려준다 — 다른 사람은 누가 봇인지 알 수 없다.
--   공개 저장소에 봇 번호를 적지 않으려고 화면은 이 함수로만 받는다.
--   top = 최고 무기 랭킹에 들어가는 줄인지(top_fam 있음) — 화면이 '진짜 사람 n명 · 봇 n명'을 세는 데 쓴다.
create or replace function public.play_guitar_bot_ids()
returns table (id bigint, top boolean)
language sql
stable
security definer
set search_path = ''
as $$
    select p.fight_no::bigint, p.top_fam is not null
    from public.play_guitar_players p
    where public.is_site_admin() and not p.hidden
      and p.key_hash in (select encode(sha256(convert_to('bot:ahnssam:' || g, 'UTF8')), 'hex') from generate_series(1, 500) g)
$$;
revoke all on function public.play_guitar_bot_ids() from public;
grant execute on function public.play_guitar_bot_ids() to authenticated;
