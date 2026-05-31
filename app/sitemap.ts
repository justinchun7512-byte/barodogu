import type { MetadataRoute } from 'next';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { TOOLS } from '@/lib/tools';
import { getAllPosts } from '@/lib/blog-posts';

const BASE_URL = 'https://barodogu.com';

// 2026-05-31: Google sitemap.xml lastmod 정확도 개선. 빌드마다 동일 시각이 아니라
// 각 URL의 실제 마지막 수정 시점을 사용한다. Google 공식 문서가 "lastmod must reflect
// actual content change" 권장. 빌드 시각 일률 사용은 신호 약화.
// 안전: git log 실패 시 FALLBACK_DATE 사용 → 기존 동작과 회귀 없음.

const FALLBACK_DATE = new Date('2026-04-12T00:00:00Z'); // barodogu launch baseline

function resolveGitRoot(): { cwd: string; prefix: string } | null {
  // sitemap.ts runs during `next build`, cwd is barodogu/. The .git lives in
  // the monorepo root one level up. Verify before invoking git.
  const candidates = [
    { cwd: process.cwd(), prefix: '' },
    { cwd: join(process.cwd(), '..'), prefix: 'barodogu/' },
  ];
  for (const c of candidates) {
    if (existsSync(join(c.cwd, '.git'))) return c;
  }
  return null;
}

const GIT_ROOT = resolveGitRoot();

function gitLastMod(barodoguRelPath: string): Date {
  if (!GIT_ROOT) return FALLBACK_DATE;
  try {
    const path = `${GIT_ROOT.prefix}${barodoguRelPath}`;
    const iso = execSync(`git log -1 --format=%aI -- "${path}"`, {
      cwd: GIT_ROOT.cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return iso ? new Date(iso) : FALLBACK_DATE;
  } catch {
    return FALLBACK_DATE;
  }
}

function maxDate(dates: Date[]): Date {
  return dates.reduce((m, d) => (d > m ? d : m), FALLBACK_DATE);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = TOOLS.filter(t => !t.isExternal).map(tool => ({
    url: `${BASE_URL}/tools/${tool.id}`,
    lastModified: gitLastMod(`app/tools/${tool.id}`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const blogPostEntries = getAllPosts().map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const latestToolDate = maxDate(toolPages.map(p => p.lastModified));
  const latestBlogDate = maxDate(blogPostEntries.map(p => p.lastModified));
  const latestContentDate =
    latestBlogDate > latestToolDate ? latestBlogDate : latestToolDate;

  const blogPages = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestBlogDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...blogPostEntries,
  ];

  // Info pages rarely change — pin to barodogu launch baseline. Update only
  // when the actual page content changes (then bump explicitly).
  const infoPages = ['about', 'company', 'contact', 'privacy', 'terms'].map(page => ({
    url: `${BASE_URL}/${page}`,
    lastModified: gitLastMod(`app/${page}/page.tsx`),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: latestContentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: latestToolDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolPages,
    ...blogPages,
    ...infoPages,
  ];
}
