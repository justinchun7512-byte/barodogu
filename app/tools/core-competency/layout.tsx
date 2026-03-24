import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 핵심역량 추출기 - 채용공고 맞춤 역량 생성 | 바로도구',
  description: '채용공고와 이력서를 입력하면 AI가 지원 공고에 딱 맞는 핵심역량을 자동으로 만들어줍니다.',
  keywords: ['핵심역량', 'AI 이력서', '채용공고 분석', '경력기술서'],
  alternates: {
    canonical: 'https://barodogu.com/tools/core-competency',
  },
  openGraph: {
    title: 'AI 핵심역량 추출기 - 채용공고 맞춤 역량 생성 | 바로도구',
    description: '채용공고와 이력서를 입력하면 AI가 지원 공고에 딱 맞는 핵심역량을 자동으로 만들어줍니다.',
    url: 'https://barodogu.com/tools/core-competency',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
