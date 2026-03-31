import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나와 기업의 궁합 - AI 기업 궁합 분석',
  description: '내 성향과 기업명을 입력하면 AI가 조직문화 궁합을 분석합니다.',
  keywords: ['기업 궁합', '회사 궁합', '조직문화', '취업 궁합'],
  alternates: { canonical: 'https://barodogu.com/tools/company-compatibility' },
  openGraph: {
    title: '나와 기업의 궁합 - AI 기업 궁합 분석',
    description: '내 성향과 기업명을 입력하면 AI가 조직문화 궁합을 분석합니다.',
    url: 'https://barodogu.com/tools/company-compatibility',
    siteName: '바로도구', locale: 'ko_KR', type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
