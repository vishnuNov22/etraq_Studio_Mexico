import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'America/Mexico_City',
    // A missing or malformed translation must never ship silently:
    // fail the production build (static generation) and dev rendering loudly;
    // at runtime in production, log it and fall back to the key.
    onError(error) {
      const strict =
        process.env.NEXT_PHASE === 'phase-production-build' ||
        process.env.NODE_ENV === 'development';
      if (strict) throw error;
      console.error(error);
    },
    getMessageFallback({ namespace, key }) {
      return [namespace, key].filter(Boolean).join('.');
    },
  };
});
