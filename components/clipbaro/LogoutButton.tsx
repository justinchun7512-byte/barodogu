'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

interface LogoutButtonProps {
  className?: string;
  redirectTo?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  className,
  redirectTo = '/clipbaro/login',
  children = '로그아웃',
}: LogoutButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className={
        className ??
        'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'
      }
    >
      {busy ? '로그아웃 중...' : children}
    </button>
  );
}
