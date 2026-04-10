import { NextResponse } from 'next/server';

// ------------------------------------------------------------------ //
//  업데이트 배포 시 아래 version과 url을 변경하세요.
//
//  version : 새 버전 문자열 (예: "0.2.0")
//  url     : GitHub Releases zip 다운로드 직링크
//  changelog: 변경 내용 한 줄 요약
//  minVersion: 이 버전 미만은 강제 업데이트 (현재 버전과 동일하면 비강제)
// ------------------------------------------------------------------ //
const VERSION_INFO = {
  version: '0.1.0',
  url: 'https://github.com/justinchun7512-byte/naeilmo-corporation/releases/download/v0.1.0/clipbaro_src.zip',
  changelog: '첫 출시 버전',
  minVersion: '0.1.0',
} as const;

// CORS 헤더 (클립바로 로컬 앱에서 호출)
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  return NextResponse.json(VERSION_INFO, {
    status: 200,
    headers: corsHeaders(),
  });
}
