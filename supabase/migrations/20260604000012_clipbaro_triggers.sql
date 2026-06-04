-- ClipBaro Migration 12: 트리거 + updated_at

-- ─────────────────────────────────────────────
-- 12-1. updated_at 자동 갱신 함수
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- profiles, subscriptions에 트리거 적용
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'profiles_updated_at'
  ) THEN
    CREATE TRIGGER profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER subscriptions_updated_at
      BEFORE UPDATE ON public.subscriptions
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END;
$$;


-- ─────────────────────────────────────────────
-- 12-2. 회원가입 시 profile + 무료 5크레딧 자동 지급
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- 1) profile 자동 생성
  INSERT INTO public.profiles (id, email, display_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;

  -- 2) 가입 보너스 5크레딧 (30일 유효)
  INSERT INTO public.credit_entries (user_id, amount, remaining, source, expires_at)
    VALUES (NEW.id, 5, 5, 'signup_bonus', NOW() + INTERVAL '30 days');

  -- 3) signup 이벤트 기록
  INSERT INTO public.events (user_id, event_type, payload)
    VALUES (
      NEW.id,
      'signup',
      jsonb_build_object('provider', NEW.raw_app_meta_data->>'provider')
    );

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;
