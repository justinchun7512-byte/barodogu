import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MBTI 궁합 테스트 - 16가지 유형 궁합',
  description: '두 사람의 MBTI 유형으로 궁합을 확인하세요. 16가지 성격 유형별 궁합 분석.',
  keywords: ['MBTI 궁합', 'MBTI 궁합 테스트', 'MBTI 연애 궁합', 'MBTI 유형'],
  alternates: { canonical: 'https://barodogu.com/tools/mbti-compatibility' },
  openGraph: {
    title: 'MBTI 궁합 테스트 - 16가지 유형 궁합',
    description: '두 사람의 MBTI 유형으로 궁합을 확인하세요.',
    url: 'https://barodogu.com/tools/mbti-compatibility',
    siteName: '바로도구', locale: 'ko_KR', type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
