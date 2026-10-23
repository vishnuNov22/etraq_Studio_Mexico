import type { Pathname } from '@/i18n/routing';

/** Primary navigation. Labels come from the `Nav` translation namespace. */
export const NAV_ITEMS = [
  { href: '/projects', key: 'projects' },
  { href: '/studio', key: 'studio' },
  { href: '/approach', key: 'approach' },
  { href: '/contact', key: 'contact' },
] as const satisfies ReadonlyArray<{
  href: Pathname;
  key: 'projects' | 'studio' | 'approach' | 'contact';
}>;
