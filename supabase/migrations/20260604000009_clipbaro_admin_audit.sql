-- ClipBaro Migration 09: admin_audit_log (관리자 행위 추적)

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id             BIGSERIAL PRIMARY KEY,
  admin_id       UUID NOT NULL REFERENCES public.admin_users(id),
  action         TEXT NOT NULL,  -- 'issue_coupon', 'refund', 'adjust_credit', 'revoke_admin' 등
  target_user_id UUID REFERENCES auth.users(id),
  target_table   TEXT,
  target_id      TEXT,
  before_value   JSONB,
  after_value    JSONB,
  ip             INET,
  ua             TEXT,
  occurred_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_admin
  ON public.admin_audit_log (admin_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_target_user
  ON public.admin_audit_log (target_user_id, occurred_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log FORCE ROW LEVEL SECURITY;

-- 관리자만 조회 가능
CREATE POLICY "admin_audit_admin_only" ON public.admin_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND revoked_at IS NULL
    )
  );
