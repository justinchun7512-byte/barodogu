import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON 포맷터 / 뷰어 - JSON 정렬, 검증 | 바로도구',
  description: 'JSON을 보기 좋게 정렬하고 유효성을 검증하세요. 개발자 필수 도구.',
  keywords: ['JSON 포맷터', 'JSON 정렬', 'JSON 뷰어', 'JSON 검증'],
  alternates: {
    canonical: 'https://barodogu.com/tools/json-formatter',
  },
  openGraph: {
    title: 'JSON 포맷터 / 뷰어 - JSON 정렬, 검증 | 바로도구',
    description: 'JSON을 보기 좋게 정렬하고 유효성을 검증하세요. 개발자 필수 도구.',
    url: 'https://barodogu.com/tools/json-formatter',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
