import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '글자수 세기 - 공백 포함/제외, 바이트 계산',
  description: '글자수를 실시간으로 세어보세요. 공백 포함/제외, 바이트, 단어수를 한눈에 확인.',
  keywords: ['글자수 세기', '글자수 계산', '바이트 계산', '자소서 글자수'],
  alternates: {
    canonical: 'https://barodogu.com/tools/character-counter',
  },
  openGraph: {
    title: '글자수 세기 - 공백 포함/제외, 바이트 계산',
    description: '글자수를 실시간으로 세어보세요. 공백 포함/제외, 바이트, 단어수를 한눈에 확인.',
    url: 'https://barodogu.com/tools/character-counter',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
