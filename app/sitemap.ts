import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { getAllPosts } from '@/lib/blog-posts';

const BASE_URL = 'https://barodogu.com';

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
