-- ClipBaro Migration 02: admin_users
-- coupons.issued_by FK가 여기를 참조하므로 profiles보다 먼저 생성

CREATE TABLE IF NOT EXISTS public.admin_users (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role               TEXT NOT NULL CHECK (role IN ('superadmin', 'operator', 'cs')),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  granted_by         UUID REFERENCES public.admin_users(id),
  granted_at         TIMESTAMPTZ DEFAULT NOW(),
  revoked_at         TIMESTAMPTZ
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_read" ON public.admin_users
  FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = auth.uid() AND a.role = 'superadmin' AND a.revoked_at IS NULL
    )
  );

-- 대표 계정을 superadmin으로 등록하는 헬퍼 함수
-- 사용: SELECT public.bootstrap_superadmin('justinchun7512@gmail.com');
CREATE OR REPLACE FUNCTION public.bootstrap_superadmin(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = p_email LIMIT 1;
  IF v_uid IS NULL THEN
    RETURN 'USER_NOT_FOUND: ' || p_email;
  END IF;
  INSERT INTO public.admin_users (id, role)
    VALUES (v_uid, 'superadmin')
    ON CONFLICT (id) DO UPDATE SET role = 'superadmin', revoked_at = NULL;
  RETURN 'OK: ' || p_email || ' → superadmin';
END;
$$;
