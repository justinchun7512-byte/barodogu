import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: '바로도구 - 무료 온라인 유틸리티 도구 모음',
    template: '%s | 바로도구',
  },
  description: '바로도구는 회원가입 없이 바로 쓰는 무료 온라인 도구입니다. 연봉 계산기, 글자수 세기, 퇴직금, 실업급여, AI 핵심역량 추출기 등 취업 준비에 필요한 모든 도구를 무료로 사용하세요.',
  keywords: ['바로도구', 'barodogu', '무료 온라인 도구', '연봉 계산기', '글자수 세기', '퇴직금 계산기', '실업급여 계산기', '연차 계산기', 'AI 핵심역량 추출기', '취업 도구'],
  metadataBase: new URL('https://barodogu.com'),
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    siteName: '바로도구',
    locale: 'ko_KR',
    type: 'website',
    images: [{
      url: 'https://barodogu.com/api/og?title=%EB%B0%94%EB%A1%9C%EB%8F%84%EA%B5%AC&desc=%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85%20%EC%97%86%EC%9D%B4%20%EB%B0%94%EB%A1%9C%20%EC%93%B0%EB%8A%94%20%EB%AC%B4%EB%A3%8C%20%EC%98%A8%EB%9D%BC%EC%9D%B8%20%EB%8F%84%EA%B5%AC',
      width: 1200,
      height: 630,
      alt: '바로도구 - 무료 온라인 유틸리티 도구 모음',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '바로도구 - 무료 온라인 유틸리티 도구 모음',
    description: '회원가입 없이 바로 쓰는 무료 온라인 도구. 연봉 계산기, 글자수 세기, AI 핵심역량 추출기 등.',
    images: ['https://barodogu.com/api/og?title=%EB%B0%94%EB%A1%9C%EB%8F%84%EA%B5%AC&desc=%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85%20%EC%97%86%EC%9D%B4%20%EB%B0%94%EB%A1%9C%20%EC%93%B0%EB%8A%94%20%EB%AC%B4%EB%A3%8C%20%EC%98%A8%EB%9D%BC%EC%9D%B8%20%EB%8F%84%EA%B5%AC'],
  },
  alternates: {
    canonical: 'https://barodogu.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1240276727421279" crossOrigin="anonymous" />
        {/* Naver Search Advisor */}
        <meta name="naver-site-verification" content="c8144fe96c44147e33dea97c54ee16800b34797b" />
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-09KG867F42" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-09KG867F42');
        `}} />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#FAFBFF] dark:bg-[#0F1117] text-[#1A1A2E] dark:text-[#E8E8F0] min-h-screen">
        <ThemeProvider>
          <Header />
          <div className="pt-16">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
