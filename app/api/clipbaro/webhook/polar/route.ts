import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { createServiceClient } from '@/lib/supabase/service';
import { NextRequest, NextResponse } from 'next/server';

const CREDITS_BY_PACK: Record<string, number> = {
  pack_10: 10,
  pack_30: 30,
  pack_100: 100,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  const secret = process.env.POLAR_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'POLAR_WEBHOOK_SECRET 미설정' }, { status: 500 });
  }

  let event;
  try {
    event = validateEvent(body, headers, secret);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: '서명 검증 실패' }, { status: 403 });
    }
    return NextResponse.json({ error: '웹훅 파싱 오류' }, { status: 400 });
  }

  const sb = createServiceClient();

  // 크레딧 팩 결제 완료 이벤트
  if (event.type === 'order.paid') {
    const order = event.data;
    const meta = (order.metadata ?? {}) as Record<string, string>;
    const userId = meta.userId;
    const packId = meta.packId;
    const credits = packId ? CREDITS_BY_PACK[packId] : undefined;

    if (!userId || !credits) {
      // userId/packId 없으면 다른 상품 → 무시
      return NextResponse.json({ ok: true });
    }

    const idempotencyKey = `polar_order_${order.id}`;

    // 중복 처리 방지 — 이미 처리된 건은 upsert로 무시
    const { error: payErr } = await sb.from('payments').upsert({
      user_id: userId,
      amount: order.netAmount,
      currency: order.currency,
      type: 'credit_pack',
      polar_checkout_id: order.checkoutId ?? null,
      polar_order_id: order.id,
      idempotency_key: idempotencyKey,
      status: 'completed',
      paid_at: new Date().toISOString(),
      webhook_verified: true,
      metadata: { packId, polarProductId: order.productId },
    }, { onConflict: 'idempotency_key' });

    if (payErr) {
      console.error('[polar-webhook] payments upsert error', payErr);
      return NextResponse.json({ error: '결제 기록 실패' }, { status: 500 });
    }

    // processed_at가 이미 있으면 크레딧 중복 지급 방지
    const { data: existing } = await sb
      .from('payments')
      .select('processed_at')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existing?.processed_at) {
      return NextResponse.json({ ok: true });
    }

    // 크레딧 지급
    const { error: creditErr } = await sb.rpc('grant_credits', {
      p_user_id: userId,
      p_amount: credits,
      p_type: 'pack',
      p_expires_days: 365,
      p_note: `크레딧 팩 ${packId} 구매 (Polar order ${order.id})`,
    });

    if (creditErr) {
      console.error('[polar-webhook] grant_credits error', creditErr);
      return NextResponse.json({ error: '크레딧 지급 실패' }, { status: 500 });
    }

    // processed_at 기록
    await sb
      .from('payments')
      .update({ processed_at: new Date().toISOString() })
      .eq('idempotency_key', idempotencyKey);
  }

  return NextResponse.json({ ok: true });
}
