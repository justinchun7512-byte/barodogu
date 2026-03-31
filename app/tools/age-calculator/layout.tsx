import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나이 계산기 - 만나이/한국나이/띠 | 바로도구',
  description: '생년월일을 입력하면 만 나이, 한국 나이, 띠를 한번에 확인하세요. 2023년 만나이 통일법 반영.',
  keywords: ['나이 계산기', '만나이 계산', '한국 나이', '띠 계산'],
  alternates: { canonical: 'https://barodogu.com/tools/age-calculator' },
  openGraph: {
    title: '나이 계산기 - 만나이/한국나이/띠 | 바로도구',
    description: '생년월일을 입력하면 만 나이, 한국 나이, 띠를 한번에 확인하세요.',
    url: 'https://barodogu.com/tools/age-calculator',
    siteName: '바로도구', locale: 'ko_KR', type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
