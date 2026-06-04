-- ClipBaro Migration 06: payments (Paddle 결제 원장)
-- Idempotency 필수, 카드번호 등 민감 정보는 절대 저장 안 함

CREATE TABLE IF NOT EXISTS public.payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id),
  subscription_id       UUID REFERENCES public.subscriptions(id),
  amount                INTEGER NOT NULL CHECK (amount >= 0),  -- KRW 원 단위
  currency              TEXT NOT NULL DEFAULT 'KRW',
  type                  TEXT NOT NULL CHECK (type IN (
                           'subscription_init',
                           'subscription_renew',
                           'credit_pack',
                           'refund'
                        )),
  -- Paddle 식별자
  paddle_transaction_id TEXT UNIQUE,
  paddle_order_id       TEXT UNIQUE,
  idempotency_key       TEXT NOT NULL UNIQUE,  -- 중복 결제 차단
  status                TEXT NOT NULL CHECK (status IN (
                           'pending', 'completed', 'failed', 'refunded'
                        )),
  paid_at               TIMESTAMPTZ,
  refunded_at           TIMESTAMPTZ,
  refund_amount         INTEGER,
  webhook_verified      BOOLEAN DEFAULT FALSE,   -- Paddle signature 검증 여부
  processed_at          TIMESTAMPTZ,             -- 크레딧 지급 완료 시각
  failure_reason        TEXT,
  metadata              JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_created
  ON public.payments (user_id, created_at DESC);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;

CREATE POLICY "payments_self_read" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);
