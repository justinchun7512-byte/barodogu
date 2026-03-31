import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HWP to PDF/Word 변환 - 한글 파일 변환',
  description: '한글(HWP) 파일을 PDF, Word(DOCX)로 무료 변환하세요. 브라우저에서 처리.',
  keywords: ['HWP 변환', 'HWP PDF 변환', 'HWP Word 변환', '한글 변환기'],
  alternates: {
    canonical: 'https://barodogu.com/tools/hwp-converter',
  },
  openGraph: {
    title: 'HWP to PDF/Word 변환 - 한글 파일 변환',
    description: '한글(HWP) 파일을 PDF, Word(DOCX)로 무료 변환하세요. 브라우저에서 처리.',
    url: 'https://barodogu.com/tools/hwp-converter',
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
