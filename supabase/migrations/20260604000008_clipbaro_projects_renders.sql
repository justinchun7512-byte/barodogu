-- ClipBaro Migration 08: projects + renders (영상 생성 단위)

CREATE TABLE IF NOT EXISTS public.projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id),
  title            TEXT,
  category         TEXT NOT NULL,
  style            TEXT NOT NULL,
  character_preset TEXT,
  topic            TEXT NOT NULL,
  mode             TEXT NOT NULL CHECK (mode IN ('basic', 'byok')),
  custom_options   JSONB NOT NULL DEFAULT '{}',  -- 길이, 해상도 등
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_created
  ON public.projects (user_id, created_at DESC);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;

CREATE POLICY "projects_self_all" ON public.projects
  FOR ALL USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS public.renders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id),
  status           TEXT NOT NULL CHECK (status IN (
                      'queued', 'running', 'completed', 'failed', 'cancelled'
                   )),
  progress         INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  credit_cost      INTEGER NOT NULL DEFAULT 1 CHECK (credit_cost > 0),
  flyio_machine_id TEXT,
  idempotency_key  TEXT NOT NULL UNIQUE,    -- 중복 렌더링 차단
  output_url       TEXT,                   -- R2/Storage URL
  thumbnail_url    TEXT,
  duration_sec     INTEGER,
  error_code       TEXT,
  error_message    TEXT,
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ NOT NULL,   -- R2 30일 자동 삭제 기준
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_renders_user_status
  ON public.renders (user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_renders_expiring
  ON public.renders (expires_at)
  WHERE status = 'completed';

ALTER TABLE public.renders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renders FORCE ROW LEVEL SECURITY;

CREATE POLICY "renders_self_read" ON public.renders
  FOR SELECT USING (auth.uid() = user_id);
