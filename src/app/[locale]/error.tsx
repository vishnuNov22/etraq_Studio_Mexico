'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Errors');
  const tc = useTranslations('Common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center gap-8 pb-24 pt-40">
      <h1 className="font-display display-lg">{t('title')}</h1>
      <p className="max-w-md text-[1.0625rem] leading-[1.75] text-ink/85">{t('body')}</p>
      <div className="flex flex-wrap items-center gap-8">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center bg-charcoal px-9 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-rojo"
        >
          {t('retry')}
        </button>
        <Link href="/" className="link-line">
          {tc('goHome')}
        </Link>
      </div>
    </section>
  );
}
