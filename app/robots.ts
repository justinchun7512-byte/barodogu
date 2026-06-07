import type { MetadataRoute } from 'next';

// 2026-04-14: 네이버 색인 1개만 잡히는 문제 대응.
// 2026-06-07: GEO(Generative Engine Optimization) 검색 봇 명시 추가.
//   - Claude-SearchBot (Anthropic): Claude AI 검색 인용
//   - OAI-SearchBot (OpenAI): ChatGPT 검색 인용
//   - PerplexityBot: Perplexity AI 검색 인용
//   학습 봇(ClaudeBot·GPTBot·Google-Extended)은 Cloudflare AI Crawl Control에서 차단 유지.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'Yeti', allow: '/' },              // 네이버
      { userAgent: 'Googlebot', allow: '/' },         // 구글 검색 + AI Overviews
      { userAgent: 'bingbot', allow: '/' },           // 빙 + Copilot
      { userAgent: 'Claude-SearchBot', allow: '/' },  // Anthropic Claude 검색 인용
      { userAgent: 'OAI-SearchBot', allow: '/' },     // OpenAI ChatGPT 검색 인용
      { userAgent: 'PerplexityBot', allow: '/' },     // Perplexity AI 검색 인용
      { userAgent: '*', allow: '/' },
    ],
    sitemap: [
      'https://barodogu.com/sitemap.xml',
      'https://barodogu.com/rss.xml',
    ],
  };
}
