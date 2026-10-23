import type { routing } from '@/i18n/routing';
import type messages from '../../messages/es.json';

// Type-safe translation keys: `t('hero.nope')` fails `npm run typecheck`.
// Spanish is the source of truth for structure; scripts/check-i18n.mjs enforces es/en parity.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
