import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 면접 질문 생성기 - 채용공고 맞춤 면접 준비',
  description: '채용공고와 이력서를 입력하면 AI가 면접관 시점의 예상 질문을 자동으로 생성합니다. 빈도 등급, 면접관 의도, 답변 힌트까지 제공.',
  keywords: ['면접 질문', 'AI 면접 준비', '채용공고 분석', '면접 예상 질문', '면접관 의도'],
  alternates: {
    canonical: 'https://barodogu.com/tools/interview-questions',
  },
  openGraph: {
    title: 'AI 면접 질문 생성기 - 채용공고 맞춤 면접 준비',
    description: '채용공고와 이력서를 입력하면 AI가 면접관 시점의 예상 질문을 자동으로 생성합니다. 빈도 등급, 면접관 의도, 답변 힌트까지 제공.',
    url: 'https://barodogu.com/tools/interview-questions',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
