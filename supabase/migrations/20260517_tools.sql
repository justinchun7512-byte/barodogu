-- tools — 바로도구 도구 카탈로그
-- 작성: 2026-05-17 (W5 어드민 DB 전환 1단계)
-- 마이그레이션 시 barodogu/lib/tools.ts TOOLS 배열을 INSERT 로 이전.

create table if not exists public.tools (
  id            text        primary key,                  -- 기존 string id 유지 (URL 호환)
  name          text        not null,
  description   text        not null,
  category      text        not null,                     -- employment/ai/image/finance/developer/fun/health
  icon          text        not null,
  tags          text[]      not null default '{}',
  is_new        boolean     not null default false,
  is_hot        boolean     not null default false,
  is_external   boolean     not null default false,
  external_url  text,
  seo           jsonb       not null default '{}'::jsonb,  -- {title, description, keywords[], h1?}
  status        text        not null default 'active'
                check (status in ('active','archived','draft')),
  sort_order    int         not null default 100,          -- 어드민에서 ↑↓ 정렬
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists tools_category_sort_idx
  on public.tools (category, sort_order, name);
create index if not exists tools_status_idx
  on public.tools (status) where status <> 'active';

alter table public.tools enable row level security;

drop policy if exists "anon read active" on public.tools;
create policy "anon read active"
  on public.tools for select
  to anon
  using (status = 'active');

drop policy if exists "authenticated read all" on public.tools;
create policy "authenticated read all"
  on public.tools for select to authenticated using (true);

drop policy if exists "authenticated update" on public.tools;
create policy "authenticated update"
  on public.tools for update to authenticated using (true) with check (true);

drop policy if exists "service all" on public.tools;
create policy "service all"
  on public.tools for all to service_role
  using (true) with check (true);

-- 카테고리 라벨 (별도 lookup)
create table if not exists public.tool_categories (
  id          text        primary key,                    -- employment 등
  name        text        not null,
  icon        text        not null,
  color       text,
  sort_order  int         not null default 100,
  created_at  timestamptz not null default now()
);

alter table public.tool_categories enable row level security;
drop policy if exists "anon read" on public.tool_categories;
create policy "anon read" on public.tool_categories for select to anon using (true);
drop policy if exists "service all" on public.tool_categories;
create policy "service all" on public.tool_categories for all to service_role
  using (true) with check (true);
