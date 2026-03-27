import { TOOLS } from '@/lib/tools';
import HomePage from './HomeClient';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '바로도구',
  url: 'https://barodogu.com',
  description: '회원가입 없이 바로 쓰는 무료 온라인 도구 모음. 연봉 계산기, 글자수 세기, 퇴직금, 실업급여, AI 핵심역량 추출기 등.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://barodogu.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const toolListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: TOOLS.filter(t => !t.isExternal).map((tool, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: tool.name,
    url: `https://barodogu.com/tools/${tool.id}`,
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolListJsonLd) }}
      />
      <HomePage />
    </>
  );
}
