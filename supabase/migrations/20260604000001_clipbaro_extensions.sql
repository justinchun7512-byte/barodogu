-- ClipBaro Migration 01: Extensions
-- pgcrypto, uuid-ossp는 Supabase에 기본 활성화돼 있으나 명시적으로 보장
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";   -- 크레딧 만료 cron 용
