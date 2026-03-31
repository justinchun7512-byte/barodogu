import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대출 이자 계산기 - 상환 방식별 비교',
  description: '대출 원금, 이자율, 기간을 입력하면 상환 방식별 이자와 월 상환금을 비교합니다.',
  keywords: ['대출 이자 계산기', '대출 이자', '원리금균등', '원금균등'],
  alternates: {
    canonical: 'https://barodogu.com/tools/loan-calculator',
  },
  openGraph: {
    title: '대출 이자 계산기 - 상환 방식별 비교',
    description: '대출 원금, 이자율, 기간을 입력하면 상환 방식별 이자와 월 상환금을 비교합니다.',
    url: 'https://barodogu.com/tools/loan-calculator',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
