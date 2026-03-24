import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '실업급여 계산기 2026 - 바로도구',
  description: '나이, 근무기간, 월급을 입력하면 실업급여 수급액과 기간을 계산합니다.',
  keywords: ['실업급여 계산기', '실업급여 수급액', '실업급여 기간'],
  alternates: {
    canonical: 'https://barodogu.com/tools/unemployment-calculator',
  },
  openGraph: {
    title: '실업급여 계산기 2026 - 바로도구',
    description: '나이, 근무기간, 월급을 입력하면 실업급여 수급액과 기간을 계산합니다.',
    url: 'https://barodogu.com/tools/unemployment-calculator',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
