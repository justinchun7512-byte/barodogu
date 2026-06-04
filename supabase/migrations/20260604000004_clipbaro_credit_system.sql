-- ClipBaro Migration 04: credit_entries + credit_usages (FIFO 크레딧 시스템)

CREATE TABLE IF NOT EXISTS public.credit_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL CHECK (amount > 0),
  remaining     INTEGER NOT NULL CHECK (remaining >= 0),
  source        TEXT NOT NULL CHECK (source IN (
                  'signup_bonus',
                  'subscription_grant',
                  'credit_pack_purchase',
                  'kmong_voucher',
                  'promotion',
                  'admin_grant',
                  'refund_adjustment'
                )),
  source_ref_id UUID,             -- payments.id / subscriptions.id / coupons.id
  granted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL CHECK (expires_at > granted_at),
  metadata      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  CHECK (remaining <= amount)
);

CREATE INDEX IF NOT EXISTS idx_credit_entries_user_active
  ON public.credit_entries (user_id, expires_at)
  WHERE remaining > 0;

CREATE INDEX IF NOT EXISTS idx_credit_entries_expiring_soon
  ON public.credit_entries (expires_at)
  WHERE remaining > 0;

ALTER TABLE public.credit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_entries FORCE ROW LEVEL SECURITY;

CREATE POLICY "credit_entries_self_read" ON public.credit_entries
  FOR SELECT USING (auth.uid() = user_id);
-- INSERT/UPDATE/DELETE는 service_role 또는 RPC 전용


CREATE TABLE IF NOT EXISTS public.credit_usages (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES auth.users(id),
  entry_id  UUID NOT NULL REFERENCES public.credit_entries(id),
  render_id UUID,               -- renders.id (NULL 허용: 만료·관리자 조정)
  amount    INTEGER NOT NULL,   -- 음수 허용 (render_refund)
  reason    TEXT NOT NULL CHECK (reason IN (
              'render_start',
              'render_refund',
              'admin_adjust_deduct',
              'expiry'
            )),
  used_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_usages_user_used_at
  ON public.credit_usages (user_id, used_at DESC);

ALTER TABLE public.credit_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usages FORCE ROW LEVEL SECURITY;

CREATE POLICY "credit_usages_self_read" ON public.credit_usages
  FOR SELECT USING (auth.uid() = user_id);
