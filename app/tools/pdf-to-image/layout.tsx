import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to JPG/PNG 변환 - PDF 이미지 변환',
  description: 'PDF 파일을 JPG, PNG 이미지로 무료 변환하세요. 서버 전송 없이 브라우저에서 안전하게 처리.',
  keywords: ['PDF JPG 변환', 'PDF PNG 변환', 'PDF 이미지 변환', 'PDF to JPG'],
  alternates: {
    canonical: 'https://barodogu.com/tools/pdf-to-image',
  },
  openGraph: {
    title: 'PDF to JPG/PNG 변환 - PDF 이미지 변환',
    description: 'PDF 파일을 JPG, PNG 이미지로 무료 변환하세요. 서버 전송 없이 브라우저에서 안전하게 처리.',
    url: 'https://barodogu.com/tools/pdf-to-image',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
