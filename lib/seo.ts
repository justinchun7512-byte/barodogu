import type { Metadata } from 'next';
import { Tool } from './tools';

const BASE_URL = 'https://barodogu.vercel.app';
const SITE_NAME = '바로도구';

export function generateToolMetadata(tool: Tool): Metadata {
  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `${BASE_URL}/tools/${tool.id}`,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seo.title,
      description: tool.seo.description,
    },
    alternates: {
      canonical: `${BASE_URL}/tools/${tool.id}`,
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
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    author: { '@type': 'Organization', name: '내일모코퍼레이션' },
  };
}
