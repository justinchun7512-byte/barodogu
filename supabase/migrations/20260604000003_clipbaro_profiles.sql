-- ClipBaro Migration 03: profiles

CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT UNIQUE NOT NULL,
  display_name         TEXT,
  avatar_url           TEXT,
  locale               TEXT DEFAULT 'ko',

  -- BYOK 동의 기록 (법적 증거 — 3컬럼 분리)
  byok_enabled         BOOLEAN DEFAULT FALSE,
  byok_consent_version TEXT,
  byok_consent_at      TIMESTAMPTZ,
  byok_consent_ip      INET,
  byok_consent_ua      TEXT,

  -- 마케팅 동의
  marketing_opt_in     BOOLEAN DEFAULT FALSE,
  marketing_consent_at TIMESTAMPTZ,

  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

CREATE POLICY "profiles_self_select" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
             WITH CHECK (auth.uid() = id);

-- INSERT는 handle_new_user 트리거 전용 (service_role)
