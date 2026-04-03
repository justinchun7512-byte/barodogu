import type { Metadata } from 'next';
import { Tool, getCategoryInfo } from './tools';

const BASE_URL = 'https://barodogu.com';
const SITE_NAME = '바로도구';

function getOgImageUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, desc: description });
  return `${BASE_URL}/api/og?${params.toString()}`;
}

export function generateToolMetadata(tool: Tool): Metadata {
  const url = `${BASE_URL}/tools/${tool.id}`;
  const ogImage = getOgImageUrl(tool.name, tool.seo.description.slice(0, 80));
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seo.title,
      description: tool.seo.description,
      images: [ogImage],
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

export function generateBreadcrumbJsonLd(tool: Tool) {
  const categoryInfo = getCategoryInfo(tool.category);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '바로도구',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryInfo?.name || tool.category,
        item: `${BASE_URL}/#tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `${BASE_URL}/tools/${tool.id}`,
      },
    ],
  };
}
