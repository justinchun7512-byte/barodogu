-- ClipBaro Migration 10: events (전체 이벤트 로그)
-- 모든 사용자 행위를 비정형 JSONB로 기록. 감사 추적 + 충돌 감지 + 분석 용도.

CREATE TABLE IF NOT EXISTS public.events (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type  TEXT NOT NULL,   -- 'signup', 'login', 'render_start', 'payment', 'coupon_redeemed' 등
  payload     JSONB NOT NULL DEFAULT '{}',
  ip          INET,
  ua          TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_user_time
  ON public.events (user_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_type_time
  ON public.events (event_type, occurred_at DESC);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events FORCE ROW LEVEL SECURITY;

-- 사용자는 자신 이벤트만, 관리자는 전체 조회
CREATE POLICY "events_self_or_admin" ON public.events
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND revoked_at IS NULL
    )
  );
