-- ClipBaro Migration 05: subscriptions (Paddle 정기결제)

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES auth.users(id),
  plan                 TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'unlimited')),
  status               TEXT NOT NULL CHECK (status IN (
                          'trialing', 'active', 'past_due', 'cancelled', 'expired'
                        )),
  -- Paddle subscription ID (구 토스 billing_key 대체)
  paddle_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end   TIMESTAMPTZ NOT NULL,
  first_month_discount BOOLEAN DEFAULT FALSE,
  cancelled_at         TIMESTAMPTZ,
  cancel_reason        TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자당 active 구독 최대 1개
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_active
  ON public.subscriptions (user_id)
  WHERE status IN ('trialing', 'active', 'past_due');

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions FORCE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_self_read" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
