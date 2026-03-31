import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'D-day 계산기 - 남은 일수 계산 | 바로도구',
  description: '특정 날짜까지 남은 일수(D-day) 또는 지난 일수(D+day)를 바로 계산하세요.',
  keywords: ['D-day 계산기', '디데이 계산', '남은 일수', '날짜 계산기'],
  alternates: { canonical: 'https://barodogu.com/tools/dday-calculator' },
  openGraph: {
    title: 'D-day 계산기 - 남은 일수 계산 | 바로도구',
    description: '특정 날짜까지 남은 일수(D-day) 또는 지난 일수(D+day)를 바로 계산하세요.',
    url: 'https://barodogu.com/tools/dday-calculator',
    siteName: '바로도구', locale: 'ko_KR', type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
