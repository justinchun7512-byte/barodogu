import type { MetadataRoute } from 'next';

// 2026-04-14: 네이버 색인 1개만 잡히는 문제 대응.
// Yeti(네이버), Googlebot 명시 + 네이버용 별도 sitemap도 같이 노출.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Yeti', allow: '/' },       // 네이버
      { userAgent: 'Googlebot', allow: '/' },  // 구글
      { userAgent: 'bingbot', allow: '/' },    // 빙
      { userAgent: '*', allow: '/' },
    ],
    sitemap: [
      'https://barodogu.com/sitemap.xml',
      'https://barodogu.com/rss.xml',
    ],
  };
}
