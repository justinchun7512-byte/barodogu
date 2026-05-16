-- seo_audits — SEO 추적 데이터 (GSC + 자체)
-- 작성: 2026-05-17 (W5 어드민 DB 전환 1단계)
-- 마이그레이션 시 docs/seo-baseline-20260419/tracking/*.json 을 INSERT 로 이전.
-- 어드민 /dashboard/seo 는 다음 세션에 라인 차트 + 카운트다운 UI 구현.

-- 1. 페이지별 GSC 스냅샷 (주간 기록)
create table if not exists public.seo_page_snapshots (
  id           bigserial   primary key,
  url          text        not null,                       -- /tools/bmi-calculator 등 path
  recorded_at  timestamptz not null default now(),
  range_start  date        not null,                       -- GSC 조회 기간
  range_end    date        not null,
  source       text        not null default 'gsc'
               check (source in ('gsc','naver','manual')),
  clicks       int         not null default 0,
  impressions  int         not null default 0,
  ctr          numeric(6,4) not null default 0,            -- 0.0500 = 5%
  position     numeric(6,2) not null default 0,            -- 평균 순위
  indexed      boolean,                                    -- GSC URL 검사 결과 (null = 미확인)
  notes        text
);

create index if not exists seo_page_snap_url_recorded_idx
  on public.seo_page_snapshots (url, recorded_at desc);
create index if not exists seo_page_snap_source_idx
  on public.seo_page_snapshots (source, recorded_at desc);

-- 2. 키워드 추이 (페이지 무관 전체 키워드 단위)
create table if not exists public.seo_keyword_snapshots (
  id           bigserial   primary key,
  keyword      text        not null,
  recorded_at  timestamptz not null default now(),
  range_start  date        not null,
  range_end    date        not null,
  source       text        not null default 'gsc'
               check (source in ('gsc','naver','manual')),
  clicks       int         not null default 0,
  impressions  int         not null default 0,
  position     numeric(6,2) not null default 0,
  notes        text
);

create index if not exists seo_kw_snap_keyword_recorded_idx
  on public.seo_keyword_snapshots (keyword, recorded_at desc);

-- 3. URL 색인 요청 추적 (요청·승인·거부 시각)
create table if not exists public.seo_index_requests (
  id           bigserial   primary key,
  url          text        not null,
  requested_at timestamptz not null default now(),
  resolved_at  timestamptz,
  status       text        not null default 'pending'
               check (status in ('pending','indexed','crawled','excluded','error')),
  reason       text,                                       -- 거부 사유 등
  source       text        not null default 'gsc'
);

create index if not exists seo_idx_req_url_status_idx
  on public.seo_index_requests (url, status, requested_at desc);

-- RLS — 모두 service_role + authenticated. anon 노출 X (어드민 전용).
alter table public.seo_page_snapshots enable row level security;
alter table public.seo_keyword_snapshots enable row level security;
alter table public.seo_index_requests enable row level security;

do $$
declare t text;
begin
  foreach t in array array['seo_page_snapshots','seo_keyword_snapshots','seo_index_requests'] loop
    execute format('drop policy if exists "authenticated read" on public.%I', t);
    execute format('create policy "authenticated read" on public.%I for select to authenticated using (true)', t);
    execute format('drop policy if exists "service all" on public.%I', t);
    execute format('create policy "service all" on public.%I for all to service_role using (true) with check (true)', t);
  end loop;
end $$;
