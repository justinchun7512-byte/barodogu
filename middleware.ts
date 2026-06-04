import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/clipbaro/dashboard', '/clipbaro/render'];

export async function middleware(request: NextRequest) {
  const { pathname, host } = new URL(request.url);

  // www → non-www 301
  if (host.startsWith('www.')) {
    const newUrl = new URL(request.url);
    newUrl.host = host.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }

  // /clipbaro/dashboard, /clipbaro/render — 로그인 필요
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (needsAuth) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Supabase 미설정 시 통과 (로컬 셸 개발용)
    if (!supabaseUrl || !supabaseKey) return NextResponse.next();

    const res = NextResponse.next();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL('/clipbaro/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
