import { Polar } from '@polar-sh/sdk';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const PACK_PRODUCTS: Record<string, string | undefined> = {
  pack_10: process.env.POLAR_PRODUCT_PACK10,
  pack_30: process.env.POLAR_PRODUCT_PACK30,
  pack_100: process.env.POLAR_PRODUCT_PACK100,
};

export async function POST(req: NextRequest) {
  if (process.env.PAYMENT_ENABLED !== 'true') {
    return NextResponse.json({ error: '베타 기간 중 결제가 비활성화되어 있습니다.' }, { status: 403 });
  }

  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { packId } = await req.json() as { packId: string };
  const productId = PACK_PRODUCTS[packId];
  if (!productId) {
    return NextResponse.json({ error: '잘못된 상품입니다.' }, { status: 400 });
  }

  const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: (process.env.POLAR_ENV === 'production' ? 'production' : 'sandbox') as 'production' | 'sandbox',
  });

  const origin = req.headers.get('origin') || 'https://barodogu.com';

  const checkout = await polar.checkouts.create({
    products: [productId],
    customerEmail: user.email!,
    successUrl: `${origin}/clipbaro/credits?success=1`,
    metadata: {
      userId: user.id,
      packId,
    },
  });

  return NextResponse.json({ checkoutUrl: checkout.url });
}
