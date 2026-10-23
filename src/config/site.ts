import type { Locale } from '@/i18n/routing';

/**
 * Central studio configuration. Only facts supplied by the studio's Instagram profile are filled in.
 * Anything unverified is `null` and is simply not rendered by the UI.
 */

const clean = (value: string | undefined) => {
  const v = value?.trim();
  return v ? v : null;
};

export const siteConfig = {
  name: 'etarq studio',
  wordmark: 'etarq',
  wordmarkSuffix: 'studio',

  /** Public site URL, used for canonical / hreflang / sitemap / Open Graph. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),

  /** Supplied in the Instagram bio: "CDMX • México". */
  city: 'CDMX',
  country: 'México',

  /** Approximate coordinates of Mexico City (city-level only; not the studio's address). */
  coordinates: '19.43° N · 99.13° W',

  /** Instagram username as shown in the profile header of the supplied screenshot. Confirm with the studio. */
  instagramHandle: clean(process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE) ?? 'etarq.studio',

  /** UNVERIFIED — not supplied. Keep empty until the studio confirms; the UI hides empty values. */
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  whatsappNumber: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),

  /** Optional form endpoint (POST, JSON). Empty = clearly-labelled front-end prototype. */
  contactEndpoint: clean(process.env.NEXT_PUBLIC_CONTACT_ENDPOINT),

  /** Show "draft copy" notes where wording / titles still need studio confirmation. */
  showDraftNotes: process.env.NEXT_PUBLIC_SHOW_DRAFT_NOTES !== 'false',

  /** Social sharing image (1200x630). */
  ogImage: '/images/og.jpg',
} as const;

export const instagramUrl = `https://www.instagram.com/${siteConfig.instagramHandle}/`;

export const whatsappUrl = siteConfig.whatsappNumber
  ? `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}`
  : null;

/** `<html lang>` and Open Graph locale values. Mexican Spanish is es-MX. */
export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; hreflang: string }> = {
  es: { htmlLang: 'es-MX', ogLocale: 'es_MX', hreflang: 'es-MX' },
  en: { htmlLang: 'en', ogLocale: 'en_US', hreflang: 'en' },
};
