import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이름 궁합 테스트 - 무료 이름 궁합 | 바로도구',
  description: '두 사람의 이름으로 궁합 점수를 확인하세요. 재미로 보는 이름 궁합 테스트.',
  keywords: ['이름 궁합', '궁합 테스트', '이름 궁합 점수', '커플 궁합'],
  alternates: { canonical: 'https://barodogu.com/tools/name-compatibility' },
  openGraph: {
    title: '이름 궁합 테스트 - 무료 이름 궁합 | 바로도구',
    description: '두 사람의 이름으로 궁합 점수를 확인하세요.',
    url: 'https://barodogu.com/tools/name-compatibility',
    siteName: '바로도구', locale: 'ko_KR', type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
