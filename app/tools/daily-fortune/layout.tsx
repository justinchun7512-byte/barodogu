import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 오늘의 운세 - 무료 운세 보기 | 바로도구',
  description: '생년월일을 입력하면 AI가 오늘의 운세를 알려드립니다. 총운, 재운, 애정운, 건강운 확인.',
  keywords: ['오늘의 운세', 'AI 운세', '무료 운세', '오늘 운세'],
  alternates: { canonical: 'https://barodogu.com/tools/daily-fortune' },
  openGraph: {
    title: 'AI 오늘의 운세 - 무료 운세 보기 | 바로도구',
    description: '생년월일을 입력하면 AI가 오늘의 운세를 알려드립니다.',
    url: 'https://barodogu.com/tools/daily-fortune',
    siteName: '바로도구', locale: 'ko_KR', type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
