import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시급 월급 연봉 변환기 2026 - 바로도구',
  description: '시급, 월급, 연봉을 자유롭게 변환하세요. 2026년 최저시급 기준.',
  keywords: ['시급 월급 변환', '시급 계산기', '2026 최저시급'],
  alternates: {
    canonical: 'https://barodogu.com/tools/wage-converter',
  },
  openGraph: {
    title: '시급 월급 연봉 변환기 2026 - 바로도구',
    description: '시급, 월급, 연봉을 자유롭게 변환하세요. 2026년 최저시급 기준.',
    url: 'https://barodogu.com/tools/wage-converter',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
