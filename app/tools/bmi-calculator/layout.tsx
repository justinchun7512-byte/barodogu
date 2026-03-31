import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI 계산기 - 체질량지수 비만도 측정 | 바로도구',
  description: '키와 몸무게를 입력하면 BMI 체질량지수와 비만도를 바로 확인하세요. 대한비만학회 아시아 기준 적용.',
  keywords: ['BMI 계산기', '체질량지수', '비만도 계산', 'BMI 측정'],
  alternates: {
    canonical: 'https://barodogu.com/tools/bmi-calculator',
  },
  openGraph: {
    title: 'BMI 계산기 - 체질량지수 비만도 측정 | 바로도구',
    description: '키와 몸무게를 입력하면 BMI 체질량지수와 비만도를 바로 확인하세요.',
    url: 'https://barodogu.com/tools/bmi-calculator',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
