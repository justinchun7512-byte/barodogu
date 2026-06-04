-- ClipBaro Migration 13: pg_cron 스케줄 등록
-- Supabase Dashboard → SQL Editor에서 postgres 권한으로 실행해야 합니다.
-- (일반 anon/service_role로는 cron.schedule 실행 불가)

-- 매일 00:05 KST (15:05 UTC) 만료 크레딧 처리
SELECT cron.schedule(
  'clipbaro_credit_expiry',
  '5 15 * * *',
  'SELECT public.expire_credits()'
);

-- 이미 등록된 경우 중복 방지: 위 SELECT가 에러나면 아래로 대체
-- cron.unschedule('clipbaro_credit_expiry') 후 재실행
