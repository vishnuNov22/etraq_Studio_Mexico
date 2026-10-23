import { defineRouting } from 'next-intl/routing';

/**
 * Locale-aware routing.
 * Spanish (es-MX) is the default; English is the alternative.
 * Every public page has a translated pathname, e.g.
 *   /es/proyectos/buna  <->  /en/projects/buna
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  // We handle "remember the visitor's choice" ourselves (see src/middleware.ts):
  // Accept-Language is ignored so the default stays Spanish for the Mexican audience,
  // while the NEXT_LOCALE cookie (written on every localized request) is honoured.
  localeDetection: false,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  },
  pathnames: {
    '/': '/',
    '/projects': { es: '/proyectos', en: '/projects' },
    '/projects/[slug]': { es: '/proyectos/[slug]', en: '/projects/[slug]' },
    '/studio': { es: '/estudio', en: '/studio' },
    '/approach': { es: '/como-trabajamos', en: '/process' },
    '/contact': { es: '/contacto', en: '/contact' },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;
