import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '칼로리 기초대사량(TDEE) 계산기',
  description: '기초대사량(BMR)과 하루 총 소비 칼로리(TDEE)를 계산하세요. 다이어트 목표 칼로리 설정에 필수.',
  keywords: ['기초대사량 계산기', 'TDEE 계산기', '칼로리 계산', '다이어트 칼로리'],
  alternates: { canonical: 'https://barodogu.com/tools/tdee-calculator' },
  openGraph: {
    title: '칼로리 기초대사량(TDEE) 계산기',
    description: '기초대사량(BMR)과 하루 총 소비 칼로리(TDEE)를 계산하세요.',
    url: 'https://barodogu.com/tools/tdee-calculator',
    siteName: '바로도구', locale: 'ko_KR', type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
