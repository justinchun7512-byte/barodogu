import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';

const BASE_URL = 'https://barodogu.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = TOOLS.filter(t => !t.isExternal).map(tool => ({
    url: `${BASE_URL}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...toolPages,
  ];
}
