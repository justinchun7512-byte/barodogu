import { NextResponse } from 'next/server';

export const maxDuration = 10;

// 데스크톱 PyInstaller 버전이 2026-04-13 폐기되면서 라이선스 발급 시스템도 함께 중단됐다.
// 클립바로는 현재 무료 베타로 운영 중이며, 정식 결제 시스템은 추후 별도 안내한다.
// 외부에서 이 엔드포인트를 직접 호출하는 케이스(즐겨찾기·크몽 안내문 링크 등)에 대비해
// 410 Gone으로 명시 응답한다.

const GONE_BODY = {
  success: false,
  error:
    '라이선스 발급 시스템은 더 이상 제공되지 않습니다. 클립바로는 현재 무료 베타로 운영 중이며, 정식 결제는 추후 안내됩니다.',
} as const;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  return NextResponse.json(GONE_BODY, { status: 410, headers: corsHeaders() });
}

export async function POST() {
  return NextResponse.json(GONE_BODY, { status: 410, headers: corsHeaders() });
}
