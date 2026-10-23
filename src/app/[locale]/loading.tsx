'use client';

import { useTranslations } from 'next-intl';

/** Route-transition loading state: a quiet progress line (translated for assistive tech). */
export default function Loading() {
  const t = useTranslations('Loading');
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-0 top-[var(--header-h)] z-40 h-px overflow-hidden bg-line">
      <span className="loading-bar block h-full w-1/3 bg-rojo" />
      <span className="sr-only">{t('label')}</span>
    </div>
  );
}
