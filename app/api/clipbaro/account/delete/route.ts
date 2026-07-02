import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

// 탈퇴 시 삭제 순서:
// 1. credit_usages   — CASCADE 없음
// 2. subscriptions   — CASCADE 없음
// 3. payments        — CASCADE 없음
// 4. projects        — CASCADE 없음 (renders는 project_id ON DELETE CASCADE로 자동 삭제)
// 5. auth.users 삭제 — profiles(CASCADE), credit_entries(CASCADE), events(SET NULL) 자동 처리
export async function POST(req: NextRequest) {
  // 현재 로그인한 유저 확인
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  // 확인 문구 서버 재검증 (실수·위조 방지)
  let body: { confirm?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
  }
  if (body.confirm !== '탈퇴합니다') {
    return NextResponse.json({ error: '확인 문구가 일치하지 않습니다.' }, { status: 400 });
  }

  const sb = createServiceClient();
  const uid = user.id;

  // credit_usages
  const { error: e1 } = await sb.from('credit_usages').delete().eq('user_id', uid);
  if (e1) return NextResponse.json({ error: 'credit_usages 삭제 실패: ' + e1.message }, { status: 500 });

  // subscriptions
  const { error: e2 } = await sb.from('subscriptions').delete().eq('user_id', uid);
  if (e2) return NextResponse.json({ error: 'subscriptions 삭제 실패: ' + e2.message }, { status: 500 });

  // payments
  const { error: e3 } = await sb.from('payments').delete().eq('user_id', uid);
  if (e3) return NextResponse.json({ error: 'payments 삭제 실패: ' + e3.message }, { status: 500 });

  // projects (renders는 project_id ON DELETE CASCADE로 자동 삭제됨)
  const { error: e4 } = await sb.from('projects').delete().eq('user_id', uid);
  if (e4) return NextResponse.json({ error: 'projects 삭제 실패: ' + e4.message }, { status: 500 });

  // auth 유저 삭제 → profiles(CASCADE), credit_entries(CASCADE), events(SET NULL) 자동 처리
  const { error: e5 } = await sb.auth.admin.deleteUser(uid);
  if (e5) return NextResponse.json({ error: '계정 삭제 실패: ' + e5.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
