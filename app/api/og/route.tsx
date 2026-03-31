import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') || '바로도구';
  const description = searchParams.get('desc') || '회원가입 없이 바로 쓰는 무료 온라인 도구';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '24px',
            padding: '60px 80px',
            maxWidth: '90%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#764ba2',
              marginBottom: '16px',
              letterSpacing: '-0.5px',
            }}
          >
            바로도구
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#1a1a2e',
              textAlign: 'center',
              lineHeight: 1.3,
              maxWidth: '800px',
              letterSpacing: '-1px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#6b7280',
              marginTop: '20px',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          barodogu.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
