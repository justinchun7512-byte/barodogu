import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '연봉 실수령액 계산기 2026 - 바로도구',
  description: '2026년 연봉 실수령액을 바로 계산하세요. 4대보험, 소득세 공제 후 월 실수령액을 확인할 수 있습니다.',
  keywords: ['연봉 실수령액', '연봉 계산기', '2026 연봉', '세후 월급'],
  alternates: {
    canonical: 'https://barodogu.com/tools/salary-calculator',
  },
  openGraph: {
    title: '연봉 실수령액 계산기 2026 - 바로도구',
    description: '2026년 연봉 실수령액을 바로 계산하세요. 4대보험, 소득세 공제 후 월 실수령액을 확인할 수 있습니다.',
    url: 'https://barodogu.com/tools/salary-calculator',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
