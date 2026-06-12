import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { createServiceClient } from '@/lib/supabase/service';

// Paddle 이벤트 타입
type PaddleEvent = {
  event_type: string;
  data: {
    id: string;
    customer_id?: string;
    custom_data?: { user_id?: string };
    status?: string;
    items?: Array<{ price: { id: string }; quantity: number }>;
    subscription_id?: string;
  };
};

// 크레딧 팩 → 크레딧 수량 매핑 (Paddle Price ID 기준)
function creditsForPriceId(priceId: string): number {
  const map: Record<string, number> = {
    [process.env.PADDLE_PRICE_PACK10 ?? '__none__']: 10,
    [process.env.PADDLE_PRICE_PACK30 ?? '__none__']: 30,
    [process.env.PADDLE_PRICE_PACK100 ?? '__none__']: 100,
  };
  return map[priceId] ?? 0;
}

// Paddle HMAC 서명 검증
function verifySignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    // Paddle 서명 헤더: ts=...;h1=...
    const parts = Object.fromEntries(
      signatureHeader.split(';').map((p) => p.split('=') as [string, string]),
    );
    const ts = parts['ts'];
    const h1 = parts['h1'];
    if (!ts || !h1) return false;

    const payload = `${ts}:${rawBody}`;
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    const expectedBuf = Buffer.from(expected);
    const h1Buf = Buffer.from(h1);
    if (expectedBuf.length !== h1Buf.length) return false;
    return timingSafeEqual(expectedBuf, h1Buf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[paddle-webhook] PADDLE_WEBHOOK_SECRET 미설정');
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('paddle-signature') ?? '';

  if (!verifySignature(rawBody, signature, secret)) {
    console.warn('[paddle-webhook] 서명 검증 실패');
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  let event: PaddleEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const sb = createServiceClient();

  // ── 결제 완료: 크레딧 지급 ──
  if (event.event_type === 'transaction.completed') {
    const txId = event.data.id;
    const userId = event.data.custom_data?.user_id;

    if (!userId) {
      console.error('[paddle-webhook] custom_data.user_id 없음', txId);
      return NextResponse.json({ ok: false, reason: 'no user_id' });
    }

    // 멱등성: 이미 처리된 transaction은 스킵
    const { data: existing } = await sb
      .from('payments')
      .select('id')
      .eq('paddle_transaction_id', txId)
      .eq('status', 'completed')
      .single();

    if (existing) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // 크레딧 수량 계산
    const firstItem = event.data.items?.[0];
    const priceId = firstItem?.price?.id ?? '';
    const credits = creditsForPriceId(priceId);

    if (credits === 0) {
      console.error('[paddle-webhook] 알 수 없는 priceId:', priceId);
      return NextResponse.json({ ok: false, reason: 'unknown price' });
    }

    // payments 기록
    const { data: payment, error: pErr } = await sb
      .from('payments')
      .insert({
        user_id: userId,
        amount: credits * 300, // 크레딧당 KRW (개략치, 실제는 Paddle 응답값 사용)
        type: 'credit_pack',
        paddle_transaction_id: txId,
        idempotency_key: `paddle-${txId}`,
        status: 'completed',
        paid_at: new Date().toISOString(),
        webhook_verified: true,
        metadata: { price_id: priceId, credits },
      })
      .select('id')
      .single();

    if (pErr) {
      console.error('[paddle-webhook] payments insert 실패', pErr);
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    // credit_entries 지급 (1년 유효)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error: cErr } = await sb.from('credit_entries').insert({
      user_id: userId,
      amount: credits,
      remaining: credits,
      source: 'credit_pack_purchase',
      source_ref_id: payment!.id,
      expires_at: expiresAt.toISOString(),
    });

    if (cErr) {
      console.error('[paddle-webhook] credit_entries insert 실패', cErr);
      return NextResponse.json({ error: cErr.message }, { status: 500 });
    }

    // events 기록
    await sb.from('events').insert({
      user_id: userId,
      event_type: 'credit_purchased',
      payload: { credits, paddle_transaction_id: txId, price_id: priceId },
    });

    // processed_at 갱신
    await sb.from('payments').update({ processed_at: new Date().toISOString() }).eq('id', payment!.id);

    console.log(`[paddle-webhook] ${userId} → +${credits}크레딧 지급 완료`);
    return NextResponse.json({ ok: true, credits_granted: credits });
  }

  // 그 외 이벤트는 200으로 수신 확인만
  return NextResponse.json({ ok: true, event_type: event.event_type });
}
