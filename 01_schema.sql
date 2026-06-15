-- ================================================================
-- 01_schema.sql  —  기타 레슨 관리 (안쌤의 기타나무숲)
-- 테이블 + RLS(보안) 정책
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 RUN.
-- 이 파일을 먼저 실행한 뒤 02_import_data.sql 을 실행하세요.
-- ================================================================
--
-- [보안 핵심]
--  이 사이트에는 이미 100명 넘는 일반 가입자(이어트레이닝 랭킹용)가 있습니다.
--  따라서 "로그인한 사람 누구나"가 아니라, 아래 OWNER_EMAIL 계정으로
--  로그인했을 때만 학생 데이터에 접근할 수 있도록 잠급니다.
--  비로그인(anon)은 RLS에 막혀 한 줄도 못 읽습니다.
--
--  계정 이메일을 바꾸려면 아래 4개 정책의 이메일 문자열만 바꾸면 됩니다.
--  (현재: steveq2568@gmail.com)
-- ================================================================

-- ---------------- 테이블 ----------------

create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  start_date  date,
  lesson_time text,                       -- 요일/시간 메모 (예: '주로 화요일 19:00')
  memo        text,
  active      boolean not null default true,   -- 휴원/퇴원 시 false
  created_at  timestamptz not null default now()
);

create table if not exists public.lessons (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  date        date not null,
  status      text not null default '출석'
                 check (status in ('출석','결석','보강','취소')),
  content     text,        -- 수업 내용
  homework    text,        -- 다음 과제
  memo        text,
  created_at  timestamptz not null default now(),
  unique (student_id, date)  -- 하루 한 학생 한 기록 (오늘 수업 화면에서 덮어쓰기용)
);

create table if not exists public.skill_records (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  date        date not null default current_date,
  category    text not null,   -- 크로매틱 / 메이저스케일 / X크로매틱 / 메이저4묶음 / 펜타토닉 / 코드 / 리듬 / 곡 / 기타
  score       integer,         -- 템포(BPM 등) 숫자 기록
  memo        text,
  created_at  timestamptz not null default now()
);

create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  date        date not null,
  amount      integer not null,   -- 단위: 만원 (예: 24 = 24만원)
  method      text,               -- 이체 / 카드 등
  memo        text,
  created_at  timestamptz not null default now()
);

-- ---------------- 인덱스 ----------------
create index if not exists idx_lessons_student        on public.lessons(student_id);
create index if not exists idx_lessons_date           on public.lessons(date);
create index if not exists idx_skill_student          on public.skill_records(student_id);
create index if not exists idx_skill_category         on public.skill_records(category);
create index if not exists idx_payments_student       on public.payments(student_id);

-- ---------------- RLS 켜기 ----------------
alter table public.students      enable row level security;
alter table public.lessons       enable row level security;
alter table public.skill_records enable row level security;
alter table public.payments      enable row level security;

-- ---------------- 정책: 지정 계정만 전체 권한 ----------------
-- (혹시 이전에 만든 동명 정책이 있으면 지우고 다시 생성)
drop policy if exists owner_all_students      on public.students;
drop policy if exists owner_all_lessons       on public.lessons;
drop policy if exists owner_all_skill_records on public.skill_records;
drop policy if exists owner_all_payments      on public.payments;

create policy owner_all_students on public.students
  for all to authenticated
  using      ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com');

create policy owner_all_lessons on public.lessons
  for all to authenticated
  using      ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com');

create policy owner_all_skill_records on public.skill_records
  for all to authenticated
  using      ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com');

create policy owner_all_payments on public.payments
  for all to authenticated
  using      ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'steveq2568@gmail.com');

-- anon(비로그인) 및 다른 가입자에게는 정책이 없으므로 자동 차단됩니다.
