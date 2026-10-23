import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale, type Pathname } from '@/i18n/routing';
import { localeMeta, siteConfig } from '@/config/site';

type Href = Pathname | { pathname: '/projects/[slug]'; params: { slug: string } };

/** Absolute, locale-prefixed, translated URL for a route (e.g. https://…/es/proyectos/buna). */
export function localizedUrl(locale: Locale, href: Href) {
  // `getPathname` resolves translated segments; the union type needs a cast for dynamic routes.
  const path = getPathname({ locale, href: href as never });
  return `${siteConfig.url}${path === '/' ? '' : path}`;
}

/** canonical + hreflang (es-MX, en, x-default → Spanish) for a route. */
export function localizedAlternates(locale: Locale, href: Href): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[localeMeta[l].hreflang] = localizedUrl(l, href);
  languages['x-default'] = localizedUrl(routing.defaultLocale, href);
  return { canonical: localizedUrl(locale, href), languages };
}

type PageKey = 'home' | 'projects' | 'studio' | 'approach' | 'contact';

/** Locale-specific <title>, description, canonical, hreflang and Open Graph for a static page. */
export async function pageMetadata(locale: Locale, page: PageKey, href: Href): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  return {
    title,
    description,
    alternates: localizedAlternates(locale, href),
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title,
      description,
      url: localizedUrl(locale, href),
      locale: localeMeta[locale].ogLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
