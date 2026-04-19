import { NextRequest, NextResponse } from 'next/server';
import { mergeKoreanHolidays, HolidayBase } from '@/lib/holidays-ko';

export const revalidate = 86400;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export type Holiday = HolidayBase;

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 1분 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year') || String(new Date().getFullYear());
    const yearNum = parseInt(yearParam, 10);

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return NextResponse.json(
        { error: '2000~2100 사이의 연도만 조회 가능합니다.' },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${yearNum}/KR`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: '공휴일 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 502 }
      );
    }

    const data: Holiday[] = await res.json();
    const merged = mergeKoreanHolidays(yearNum, data);
    return NextResponse.json({ year: yearNum, country: 'KR', holidays: merged });
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
