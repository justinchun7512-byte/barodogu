-- ─────────────────────────────────────────────────────────────────────────────
-- 클립바로 보안 패치: refund_credit() 워커 전용으로 잠금 + 중복 환불 방지
-- 2026-06-16 하네스 QA 결과 적용
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. refund_credit() 함수 재정의 (중복 환불 방지 추가)
CREATE OR REPLACE FUNCTION public.refund_credit(
  p_render_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id          UUID := auth.uid();
  v_usage            RECORD;
  v_count            INTEGER := 0;
  v_already_refunded BOOLEAN;
BEGIN
  -- 인증 확인 (service_role은 auth.uid() = NULL이므로 is_admin() 체크 병행)
  IF v_user_id IS NULL AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'UNAUTHENTICATED';
  END IF;

  -- 중복 환불 방지: 이미 render_refund 레코드가 존재하면 거부
  SELECT EXISTS (
    SELECT 1 FROM public.credit_usages
    WHERE render_id = p_render_id AND reason = 'render_refund'
  ) INTO v_already_refunded;

  IF v_already_refunded THEN
    RAISE EXCEPTION 'ALREADY_REFUNDED'
      USING DETAIL = 'render_id=' || p_render_id;
  END IF;

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

-- 2. 일반 유저/PUBLIC EXECUTE 권한 제거 (워커 전용 — service_role로만 호출)
REVOKE ALL ON FUNCTION public.refund_credit(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.refund_credit(UUID) FROM authenticated;

-- 3. bootstrap_superadmin() REVOKE (최초 1회 실행용 함수 잠금)
REVOKE ALL ON FUNCTION public.bootstrap_superadmin(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.bootstrap_superadmin(TEXT) FROM authenticated;

-- 4. expire_credits() REVOKE (cron 전용 함수 잠금)
REVOKE ALL ON FUNCTION public.expire_credits() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.expire_credits() FROM authenticated;
