-- 악보요청 글에 '희망 버전 아티스트' 칸 (선택): 원곡이 아닌 다른 가수의 커버·리메이크·라이브 버전을 원할 때.
-- 예) 곡명 너의 의미 · 아티스트(원곡) 산울림 · 희망 버전 아이유
-- 이 칸을 고쳐도 다른 칸처럼 '(고침)' 표시가 붙게 글 보호 트리거도 함께 바꾼다.
alter table public.sheet_requests
  add column if not exists wish_artist text not null default '' check (char_length(wish_artist) <= 100);

create or replace function public.sheet_requests_guard()
returns trigger language plpgsql set search_path = '' as $$
declare
  is_guest boolean := current_user in ('anon', 'authenticated');
  is_admin boolean := public.is_site_admin();
begin
  if tg_op = 'INSERT' then
    if is_guest then
      new.by_admin := is_admin;
      new.view_count := 0;
      new.created_at := now();
      if not is_admin then
        new.status := 'requested';
        new.is_notice := false;
      end if;
    end if;
    new.updated_at := null;
  else
    if is_guest then
      new.id := old.id;
      new.user_id := old.user_id;
      new.by_admin := old.by_admin;
      new.view_count := old.view_count;
      new.created_at := old.created_at;
      if not is_admin and (new.status is distinct from old.status or new.is_notice is distinct from old.is_notice) then
        raise exception '글 상태와 공지는 운영자만 바꿀 수 있어요' using errcode = '42501';
      end if;
    end if;
    if (new.title, new.artist, new.wish_artist, new.kind, new.body, new.youtube_url)
       is distinct from (old.title, old.artist, old.wish_artist, old.kind, old.body, old.youtube_url) then
      new.updated_at := now();
    else
      new.updated_at := old.updated_at;
    end if;
  end if;
  return new;
end $$;
