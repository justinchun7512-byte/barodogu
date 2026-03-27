import type { Metadata } from 'next';
import { Tool } from './tools';

const BASE_URL = 'https://barodogu.com';
const SITE_NAME = '바로도구';

export function generateToolMetadata(tool: Tool): Metadata {
  const url = `${BASE_URL}/tools/${tool.id}`;
  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary',
      title: tool.seo.title,
      description: tool.seo.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateJsonLd(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.seo.description,
    url: `${BASE_URL}/tools/${tool.id}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    provider: {
      '@type': 'Organization',
      name: '내일모코퍼레이션',
      url: BASE_URL,
    },
  };
}
