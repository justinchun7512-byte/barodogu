import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/lib/blog-posts';

// 2026-04-14 추가: 네이버 Yeti 등 크롤러가 새 포스트를 빠르게 발견하도록
// RSS 2.0 피드 제공. 네이버 서치어드바이저의 RSS 제출 기능과 연동 가능.

const SITE_URL = 'https://barodogu.com';
const SITE_TITLE = '바로도구 - 취업·직장인 무료 도구';
const SITE_DESC =
  '취준생과 직장인을 위한 무료 AI 도구 모음. 연봉 계산, 핵심역량 추출, 맞춤법 검사, 글자수 세기 등 실용 도구를 제공합니다.';

function escapeXml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toPubDate(isoDate: string): string {
  // "2026-03-25" → RFC 822: "Wed, 25 Mar 2026 00:00:00 +0900"
  try {
    const d = new Date(isoDate + 'T00:00:00+09:00');
    return d.toUTCString().replace('GMT', '+0000');
  } catch {
    return new Date().toUTCString();
  }
}

export async function GET() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = sorted
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = toPubDate(post.date);
      const desc = escapeXml(post.description);
      const title = escapeXml(post.title);
      const category = escapeXml(post.category);
      return [
        '    <item>',
        `      <title>${title}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${desc}</description>`,
        `      <category>${category}</category>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const lastBuild = sorted[0]
    ? toPubDate(sorted[0].date)
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
