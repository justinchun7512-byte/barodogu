import type { Metadata } from 'next';
import { TOOLS } from '@/lib/tools';
import ToolsPageClient from './ToolsClient';

export const metadata: Metadata = {
  title: '전체 도구 모음 - 무료 온라인 유틸리티 | 바로도구',
  description: `바로도구의 ${TOOLS.length}개 무료 온라인 도구를 한눈에 확인하세요. 연봉 계산기, 퇴직금 계산기, BMI 계산기, HWP 변환기 등 회원가입 없이 바로 사용 가능합니다.`,
  keywords: ['무료 온라인 도구', '바로도구', '계산기 모음', '유틸리티', '무료 도구'],
  openGraph: {
    title: '전체 도구 모음 - 무료 온라인 유틸리티 | 바로도구',
    description: `${TOOLS.length}개 무료 온라인 도구를 한눈에. 회원가입 없이 브라우저에서 바로 사용하세요.`,
    url: 'https://barodogu.com/tools',
    siteName: '바로도구',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: 'https://barodogu.com/tools',
  },
};

const toolListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '바로도구 전체 도구 모음',
  description: `${TOOLS.length}개 무료 온라인 유틸리티 도구`,
  url: 'https://barodogu.com/tools',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: TOOLS.filter(t => !t.isExternal).map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.name,
      url: `https://barodogu.com/tools/${tool.id}`,
    })),
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://barodogu.com' },
    { '@type': 'ListItem', position: 2, name: '전체 도구' },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ToolsPageClient />
    </>
  );
}
