-- 바로스킬 사용자 제출 (skill_submissions)
-- 작성: 2026-05-16
-- 흐름: anon이 폼으로 INSERT → status='pending' → 어드민이 검토 후 approved/rejected
--      approved 시 어드민이 별도로 skills 테이블에 insert (자동 승격은 다음 단계)

-- 테이블
create table if not exists public.skill_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,

  -- 콘텐츠 (모두 사용자 입력)
  skill_name        text not null,
  category_slug     text not null
                    check (category_slug in ('sales','marketing','content','planning','korean')),
  description       text not null,
  compatible_with   text[] not null default '{}',
  example           text,
  source_url        text,
  license           text,

  -- 제출자 (선택)
  submitter_handle  text,
  submitter_contact text,

  -- 운영 메타
  status            text not null default 'pending'
                    check (status in ('pending','approved','rejected')),
  review_note       text,
  ip_hash           text,                       -- rate-limit·중복 감지용 SHA-256
  user_agent        text,

  -- 길이 가드 (DB-level)
  constraint skill_name_len      check (char_length(skill_name) between 2 and 80),
  constraint description_len     check (char_length(description) between 10 and 2000),
  constraint example_len         check (example is null or char_length(example) <= 4000),
  constraint source_url_len      check (source_url is null or char_length(source_url) <= 500),
  constraint submitter_len       check (submitter_handle is null or char_length(submitter_handle) <= 80)
);

-- 인덱스
create index if not exists skill_submissions_status_created_idx
  on public.skill_submissions (status, created_at desc);

create index if not exists skill_submissions_ip_created_idx
  on public.skill_submissions (ip_hash, created_at desc);

-- RLS
alter table public.skill_submissions enable row level security;

-- anon 은 INSERT 만, status='pending' 강제 (반드시 default 사용)
drop policy if exists "anon insert pending" on public.skill_submissions;
create policy "anon insert pending"
  on public.skill_submissions
  for insert
  to anon
  with check (status = 'pending');

-- service_role 은 모든 작업 (어드민 SSR 에서 사용)
drop policy if exists "service all" on public.skill_submissions;
create policy "service all"
  on public.skill_submissions
  for all
  to service_role
  using (true)
  with check (true);

-- 인증 사용자(어드민 매직 링크 로그인 후) read/update — 화이트리스트는 앱 레이어에서 한 번 더
drop policy if exists "authenticated read update" on public.skill_submissions;
create policy "authenticated read update"
  on public.skill_submissions
  for select
  to authenticated
  using (true);

drop policy if exists "authenticated update review" on public.skill_submissions;
create policy "authenticated update review"
  on public.skill_submissions
  for update
  to authenticated
  using (true)
  with check (status in ('pending','approved','rejected'));
