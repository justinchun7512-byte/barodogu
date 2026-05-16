-- blog_posts — 바로도구 블로그 글
-- 작성: 2026-05-17 (W5 어드민 DB 전환 1단계 - 스키마 설계)
-- 마이그레이션 시 barodogu/lib/blog-posts.ts BLOG_POSTS 배열을 INSERT 로 이전.
-- 어드민(/dashboard/posts) 의 file-based loader 는 다음 세션에 DB-fallback 으로 교체.

create table if not exists public.blog_posts (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        not null unique,
  title        text        not null,
  description  text        not null,
  category     text        not null,
  date         date        not null,                      -- 발행 날짜 (사람이 쓰는 형식)
  read_time    text,                                       -- "8분" 같은 표시용
  tool_link    text,                                       -- 본문에서 참조하는 도구 경로
  tool_name    text,
  body         jsonb       not null default '[]'::jsonb,   -- BlogSection[] (heading, body)
  body_text    text        generated always as (
    coalesce((select string_agg((s->>'body')::text, ' ' order by ord) from jsonb_array_elements(body) with ordinality as t(s, ord)), '')
  ) stored,                                                -- 자수 계산용 평문
  char_count   int         generated always as (
    char_length(coalesce((select string_agg((s->>'body')::text, ' ' order by ord) from jsonb_array_elements(body) with ordinality as t(s, ord)), ''))
  ) stored,
  status       text        not null default 'published'
               check (status in ('published','draft','scheduled','archived')),
  scheduled_at timestamptz,                                -- status='scheduled' 일 때 발행 예정 시각
  ai_tone_score int,                                       -- admin/src/lib/posts/audit.ts 점수
  cover_image  text,
  meta_keywords text[]     not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists blog_posts_status_date_idx
  on public.blog_posts (status, date desc);
create index if not exists blog_posts_category_idx
  on public.blog_posts (category, date desc);

alter table public.blog_posts enable row level security;

-- 공개 글은 anon SELECT 허용 (barodogu /blog 페이지 렌더)
drop policy if exists "anon read published" on public.blog_posts;
create policy "anon read published"
  on public.blog_posts for select
  to anon
  using (status = 'published');

-- 어드민(authenticated) 은 전체 SELECT/UPDATE. INSERT/DELETE 는 service_role 만.
drop policy if exists "authenticated read all" on public.blog_posts;
create policy "authenticated read all"
  on public.blog_posts for select to authenticated using (true);

drop policy if exists "authenticated update" on public.blog_posts;
create policy "authenticated update"
  on public.blog_posts for update to authenticated using (true) with check (true);

drop policy if exists "service all" on public.blog_posts;
create policy "service all"
  on public.blog_posts for all to service_role
  using (true) with check (true);
