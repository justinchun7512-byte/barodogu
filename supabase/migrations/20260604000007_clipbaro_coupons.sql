-- ClipBaro Migration 07: coupons (크몽 쿠폰 등 외부 유통 코드)
-- admin_users가 먼저 생성돼 있어야 함

CREATE TABLE IF NOT EXISTS public.coupons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  type          TEXT NOT NULL CHECK (type IN (
                   'kmong_trial',
                   'kmong_standard',
                   'kmong_premium',
                   'partner',
                   'promotion',
                   'compensation'
                )),
  credit_amount INTEGER NOT NULL CHECK (credit_amount > 0),
  valid_days    INTEGER NOT NULL CHECK (valid_days > 0),  -- 사용 시 크레딧 유효기간(일)
  issued_by     UUID REFERENCES public.admin_users(id),
  redeemed_by   UUID REFERENCES auth.users(id),
  redeemed_at   TIMESTAMPTZ,
  issued_at     TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,            -- 쿠폰 자체 만료
  metadata      JSONB NOT NULL DEFAULT '{}',
  CHECK (redeemed_at IS NULL OR redeemed_by IS NOT NULL)
);

-- 미사용 쿠폰 코드 조회용 (쿠폰 입력 폼 빠른 검색)
CREATE INDEX IF NOT EXISTS idx_coupons_code_unused
  ON public.coupons (code)
  WHERE redeemed_by IS NULL;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons FORCE ROW LEVEL SECURITY;

-- 사용자는 자신이 사용한 쿠폰만 조회 가능
CREATE POLICY "coupons_self_redeemed" ON public.coupons
  FOR SELECT USING (auth.uid() = redeemed_by);
-- INSERT/UPDATE는 service_role 또는 admin (redeem_coupon RPC 경유)
