import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { getAllPosts } from '@/lib/blog-posts';
import { createAnonClient } from '@/lib/supabase/anon';

const BASE_URL = 'https://barodogu.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const toolPages = TOOLS.filter(t => !t.isExternal).map(tool => ({
    url: `${BASE_URL}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const blogPages = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...getAllPosts().map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  const infoPages = ['about', 'company', 'contact', 'privacy', 'terms'].map(page => ({
    url: `${BASE_URL}/${page}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.3,
  }));

  // 바로스킬 정적 페이지
  const skillsStatic: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/skills`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 바로스킬 동적 URL (Supabase 조회 — 실패해도 빌드 중단되지 않도록 try-catch)
  let skillCategoryPages: MetadataRoute.Sitemap = [];
  let skillDetailPages: MetadataRoute.Sitemap = [];
  try {
    // 빌드 타임 prerender 대응: cookies 없는 anon 클라이언트 사용
    const supabase = createAnonClient();
    const [{ data: categories }, { data: skills }] = await Promise.all([
      supabase.from('categories').select('slug'),
      supabase
        .from('skills')
        .select('slug, updated_at, category:categories!inner(slug)')
        .in('status', ['featured', 'curated']),
    ]);

    skillCategoryPages = (categories ?? []).map((c: any) => ({
      url: `${BASE_URL}/skills/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    skillDetailPages = (skills ?? [])
      .filter((s: any) => s.category && s.category.slug)
      .map((s: any) => ({
        url: `${BASE_URL}/skills/${s.category.slug}/${s.slug}`,
        lastModified: new Date(s.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (e) {
    console.warn('[sitemap] 바로스킬 동적 URL 조회 실패 (env·DB 미설정 가능):', e);
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolPages,
    ...blogPages,
    ...infoPages,
    ...skillsStatic,
    ...skillCategoryPages,
    ...skillDetailPages,
  ];
}
