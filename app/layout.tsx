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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
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
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
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
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
