import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '맞춤법 검사기 - 한국어 맞춤법 교정',
  description: '한국어 맞춤법을 바로 검사하세요. 자소서, 보고서 작성 시 필수 도구.',
  keywords: ['맞춤법 검사기', '맞춤법 검사', '한국어 교정'],
  alternates: {
    canonical: 'https://barodogu.com/tools/spell-checker',
  },
  openGraph: {
    title: '맞춤법 검사기 - 한국어 맞춤법 교정',
    description: '한국어 맞춤법을 바로 검사하세요. 자소서, 보고서 작성 시 필수 도구.',
    url: 'https://barodogu.com/tools/spell-checker',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
