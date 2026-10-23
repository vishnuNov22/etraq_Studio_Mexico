import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

// Any unknown path under a valid locale renders the localized 404 page.
export default async function CatchAllPage({ params }: { params: Promise<{ locale: Locale; rest: string[] }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
