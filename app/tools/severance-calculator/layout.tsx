import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '퇴직금 계산기 2026 - 바로도구',
  description: '입사일과 퇴사일, 평균 월급을 입력하면 예상 퇴직금을 바로 계산합니다.',
  keywords: ['퇴직금 계산기', '퇴직금 계산', '퇴직금 얼마'],
  alternates: {
    canonical: 'https://barodogu.com/tools/severance-calculator',
  },
  openGraph: {
    title: '퇴직금 계산기 2026 - 바로도구',
    description: '입사일과 퇴사일, 평균 월급을 입력하면 예상 퇴직금을 바로 계산합니다.',
    url: 'https://barodogu.com/tools/severance-calculator',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
