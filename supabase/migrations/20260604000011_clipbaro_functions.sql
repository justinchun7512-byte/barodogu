-- ClipBaro Migration 11: 핵심 RPC 함수
-- is_admin → consume_credit → refund_credit → redeem_coupon → expire_credits 순서

-- ─────────────────────────────────────────────
-- 11-1. is_admin() 헬퍼
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND revoked_at IS NULL
  );
$$;


-- ─────────────────────────────────────────────
-- 11-2. get_credit_balance() — 현재 잔액 조회
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_credit_balance()
RETURNS INTEGER
LANGUAGE SQL STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(SUM(remaining), 0)::INTEGER
  FROM public.credit_entries
  WHERE user_id = auth.uid()
    AND remaining > 0
    AND expires_at > NOW();
$$;

GRANT EXECUTE ON FUNCTION public.get_credit_balance TO authenticated;


-- ─────────────────────────────────────────────
-- 11-3. consume_credit() — FIFO 크레딧 원자 차감
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.consume_credit(
  p_amount    INTEGER,
  p_reason    TEXT,
  p_render_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id   UUID := auth.uid();
  v_entry     RECORD;
  v_remaining INTEGER := p_amount;
  v_consumed  JSONB := '[]'::jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHENTICATED';
  END IF;
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'INVALID_AMOUNT';
  END IF;
  IF p_reason NOT IN ('render_start', 'admin_adjust_deduct') THEN
    RAISE EXCEPTION 'INVALID_REASON';
  END IF;

  -- 만료일 오름차순 FIFO
  FOR v_entry IN
    SELECT * FROM public.credit_entries
    WHERE user_id = v_user_id
      AND remaining > 0
      AND expires_at > NOW()
    ORDER BY expires_at ASC, granted_at ASC
    FOR UPDATE
  LOOP
    EXIT WHEN v_remaining = 0;

    IF v_entry.remaining >= v_remaining THEN
      UPDATE public.credit_entries
        SET remaining = remaining - v_remaining
        WHERE id = v_entry.id;
      INSERT INTO public.credit_usages (user_id, entry_id, render_id, amount, reason)
        VALUES (v_user_id, v_entry.id, p_render_id, v_remaining, p_reason);
      v_consumed := v_consumed || jsonb_build_object('entry_id', v_entry.id, 'used', v_remaining);
      v_remaining := 0;
    ELSE
      UPDATE public.credit_entries
        SET remaining = 0
        WHERE id = v_entry.id;
      INSERT INTO public.credit_usages (user_id, entry_id, render_id, amount, reason)
        VALUES (v_user_id, v_entry.id, p_render_id, v_entry.remaining, p_reason);
      v_consumed := v_consumed || jsonb_build_object('entry_id', v_entry.id, 'used', v_entry.remaining);
      v_remaining := v_remaining - v_entry.remaining;
    END IF;
  END LOOP;

  IF v_remaining > 0 THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS'
      USING DETAIL = jsonb_build_object('short', v_remaining)::text;
  END IF;

  RETURN jsonb_build_object('consumed', v_consumed);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_credit FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_credit TO authenticated;


-- ─────────────────────────────────────────────
-- 11-4. refund_credit() — 렌더 실패 시 크레딧 복구
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.refund_credit(
  p_render_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_usage   RECORD;
  v_count   INTEGER := 0;
BEGIN
  FOR v_usage IN
    SELECT * FROM public.credit_usages
    WHERE render_id = p_render_id
      AND reason = 'render_start'
      AND (user_id = v_user_id OR public.is_admin())
    FOR UPDATE
  LOOP
    UPDATE public.credit_entries
      SET remaining = LEAST(amount, remaining + v_usage.amount)
      WHERE id = v_usage.entry_id;

    INSERT INTO public.credit_usages (user_id, entry_id, render_id, amount, reason)
      VALUES (v_usage.user_id, v_usage.entry_id, p_render_id, -v_usage.amount, 'render_refund');

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object('refunded_render_id', p_render_id, 'entries_restored', v_count);
END;
$$;

GRANT EXECUTE ON FUNCTION public.refund_credit TO authenticated;


-- ─────────────────────────────────────────────
-- 11-5. redeem_coupon() — 쿠폰 코드 입력
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.redeem_coupon(
  p_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id  UUID := auth.uid();
  v_coupon   RECORD;
  v_entry_id UUID;
  v_expires  TIMESTAMPTZ;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHENTICATED';
  END IF;

  SELECT * INTO v_coupon FROM public.coupons
    WHERE code = p_code FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'COUPON_NOT_FOUND';
  END IF;
  IF v_coupon.redeemed_by IS NOT NULL THEN
    RAISE EXCEPTION 'COUPON_ALREADY_USED';
  END IF;
  IF v_coupon.expires_at < NOW() THEN
    RAISE EXCEPTION 'COUPON_EXPIRED';
  END IF;

  v_expires := NOW() + (v_coupon.valid_days || ' days')::INTERVAL;

  UPDATE public.coupons
    SET redeemed_by = v_user_id, redeemed_at = NOW()
    WHERE id = v_coupon.id;

  INSERT INTO public.credit_entries
    (user_id, amount, remaining, source, source_ref_id, expires_at)
  VALUES
    (v_user_id, v_coupon.credit_amount, v_coupon.credit_amount,
     'kmong_voucher', v_coupon.id, v_expires)
  RETURNING id INTO v_entry_id;

  INSERT INTO public.events (user_id, event_type, payload)
  VALUES (v_user_id, 'coupon_redeemed', jsonb_build_object(
    'coupon_id', v_coupon.id,
    'code', v_coupon.code,
    'credits', v_coupon.credit_amount,
    'expires_at', v_expires
  ));

  RETURN jsonb_build_object(
    'entry_id', v_entry_id,
    'credits', v_coupon.credit_amount,
    'expires_at', v_expires
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_coupon TO authenticated;


-- ─────────────────────────────────────────────
-- 11-6. expire_credits() — 만료 일괄 처리 (cron 호출용)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.expire_credits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH expired AS (
    UPDATE public.credit_entries
      SET remaining = 0
      WHERE expires_at <= NOW() AND remaining > 0
      RETURNING id, user_id, remaining AS expired_amount
  )
  INSERT INTO public.credit_usages (user_id, entry_id, amount, reason)
  SELECT user_id, id, expired_amount, 'expiry'
    FROM expired;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
-- cron 등록은 migration 12에서
