import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '연차 계산기 - 입사일 기준 연차 일수',
  description: '입사일을 입력하면 근로기준법에 따른 연차 일수를 바로 확인할 수 있습니다.',
  keywords: ['연차 계산기', '연차 일수', '연차 발생', '근로기준법 연차'],
  alternates: {
    canonical: 'https://barodogu.com/tools/annual-leave',
  },
  openGraph: {
    title: '연차 계산기 - 입사일 기준 연차 일수',
    description: '입사일을 입력하면 근로기준법에 따른 연차 일수를 바로 확인할 수 있습니다.',
    url: 'https://barodogu.com/tools/annual-leave',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
