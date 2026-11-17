import type { MetadataRoute } from 'next';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import { resolveSiteUrl } from '@/lib/seo-metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveSiteUrl();
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sources`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Path-based canonical scenario landing pages (/scenarios/[id]) as recommended in Module 02
  const scenarioRoutes: MetadataRoute.Sitemap = ATTACK_SCENARIOS.map(
    (scenario) => ({
      url: `${baseUrl}/scenarios/${encodeURIComponent(scenario.id)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...scenarioRoutes];
}
