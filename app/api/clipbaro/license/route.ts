import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 10;

// 티어 유효성 검사
const VALID_TIERS = ['basic', 'starter', 'pro'] as const;
type Tier = (typeof VALID_TIERS)[number];

// 티어별 유효기간 (일)
const TIER_DAYS: Record<Tier, number> = {
  basic: 30,
  starter: 30,
  pro: 30,
};

// 티어별 크몽 패키지 이름
const TIER_LABEL: Record<Tier, string> = {
  basic: '기본 (STANDARD)',
  starter: '스타터 (DELUXE)',
  pro: '프로 (PREMIUM)',
};

function generateKey(orderNumber: string, tier: string): string {
  const salt =
    process.env.CLIPBARO_LICENSE_SECRET || 'clipbaro-default-salt-2026';
  const hash = createHash('sha256')
    .update(`${orderNumber}:${tier}:${salt}`)
    .digest('hex')
    .substring(0, 8)
    .toUpperCase();
  return `CB-${tier.toUpperCase()}-${hash}`;
}

function getExpiresAt(tier: Tier): string {
  const days = TIER_DAYS[tier];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function isValidEmail(email: string): boolean {
  return email.includes('@') && email.length >= 5;
}

// CORS 헤더
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, email, tier } = body as {
      orderNumber?: string;
      email?: string;
      tier?: string;
    };

    // 입력 검증
    if (!orderNumber || typeof orderNumber !== 'string' || orderNumber.trim() === '') {
      return NextResponse.json(
        { success: false, error: '주문번호를 입력해주세요.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 주소를 입력해주세요.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!tier || !VALID_TIERS.includes(tier as Tier)) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 구매 등급입니다. basic, starter, pro 중 하나를 선택하세요.',
        },
        { status: 400, headers: corsHeaders() }
      );
    }

    const validTier = tier as Tier;
    const cleanOrderNumber = orderNumber.trim();

    // 결정론적 키 생성 (같은 주문번호 + 티어 = 항상 같은 키)
    const key = generateKey(cleanOrderNumber, validTier);
    const expiresAt = getExpiresAt(validTier);

    return NextResponse.json(
      {
        success: true,
        key,
        tier: validTier,
        tierLabel: TIER_LABEL[validTier],
        expiresAt,
        issuedAt: new Date().toISOString(),
        orderNumber: cleanOrderNumber,
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
