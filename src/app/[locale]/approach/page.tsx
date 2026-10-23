import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/metadata';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { CtaBand } from '@/components/sections/CtaBand';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'approach', '/approach');
}

/** "Cómo trabajamos" — the studio's four stages. The route theme (leather) carries the page. */
export default async function ProcessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="pt-16 md:pt-24">
        <ProcessSection heading="h1" />
      </div>
      <CtaBand />
    </>
  );
}
