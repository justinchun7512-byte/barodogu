import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이미지 포맷 변환 - PNG JPG WebP AVIF 변환 | 바로도구',
  description: 'PNG, JPG, WebP, AVIF 이미지 포맷을 무료로 변환하세요. 파일이 서버로 전송되지 않아 안전합니다.',
  keywords: ['이미지 변환', 'PNG JPG 변환', 'WebP 변환', '이미지 포맷'],
  alternates: {
    canonical: 'https://barodogu.com/tools/image-converter',
  },
  openGraph: {
    title: '이미지 포맷 변환 - PNG JPG WebP AVIF 변환 | 바로도구',
    description: 'PNG, JPG, WebP, AVIF 이미지 포맷을 무료로 변환하세요. 파일이 서버로 전송되지 않아 안전합니다.',
    url: 'https://barodogu.com/tools/image-converter',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
