-- ClipBaro Migration: Paddle → Polar 결제 제공자 교체
-- 배경: 2026-07-01 Polar 채택. 프로덕션 데이터 없으므로 컬럼 rename으로 처리.

-- payments 테이블
ALTER TABLE public.payments
  RENAME COLUMN paddle_transaction_id TO polar_checkout_id;

ALTER TABLE public.payments
  RENAME COLUMN paddle_order_id TO polar_order_id;

-- subscriptions 테이블
ALTER TABLE public.subscriptions
  RENAME COLUMN paddle_subscription_id TO polar_subscription_id;

-- 인덱스 재생성 (rename으로 인해 이름만 업데이트)
DROP INDEX IF EXISTS idx_payments_user_created;
CREATE INDEX IF NOT EXISTS idx_payments_user_created
  ON public.payments (user_id, created_at DESC);
