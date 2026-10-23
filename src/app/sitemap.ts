import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { projectSlugs } from '@/data/projects';
import { localizedUrl } from '@/lib/metadata';
import { localeMeta } from '@/config/site';

type Entry = Parameters<typeof localizedUrl>[1];

const staticRoutes: Entry[] = ['/', '/projects', '/studio', '/approach', '/contact'];
const projectRoutes: Entry[] = projectSlugs.map((slug) => ({
  pathname: '/projects/[slug]',
  params: { slug },
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [...staticRoutes, ...projectRoutes].flatMap((href) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, href),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: href === '/' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [localeMeta[l].hreflang, localizedUrl(l, href)]),
          ['x-default', localizedUrl(routing.defaultLocale, href)],
        ]),
      },
    })),
  );
}
