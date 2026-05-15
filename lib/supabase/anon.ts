// 쿠키 컨텍스트가 없는 곳(generateStaticParams·sitemap 등 빌드 타임)에서 사용하는
// 무세션 Supabase 클라이언트. anon 키만 사용하며 RLS public 데이터만 접근 가능.

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
