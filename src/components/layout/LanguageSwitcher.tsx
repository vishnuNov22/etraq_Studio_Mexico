'use client';

import { Fragment } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { localeMeta } from '@/config/site';
import type { Locale } from '@/i18n/routing';

/** Display order requested for the control: EN | ES. */
const ORDER: Locale[] = ['en', 'es'];

/**
 * EN | ES toggle. Each option is a real, crawlable link to the *equivalent* page in the other
 * language (including the same project), so it works with the keyboard, without JavaScript, and
 * the middleware stores the choice in the NEXT_LOCALE cookie for later visits.
 */
export function LanguageSwitcher({ className = '', onNavigate }: { className?: string; onNavigate?: () => void }) {
  const t = useTranslations('Language');
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div role="group" aria-label={t('label')} className={`inline-flex items-center text-[0.8125rem] font-medium tracking-[0.14em] ${className}`}>
      {ORDER.map((target, i) => {
        const current = target === locale;
        return (
          <Fragment key={target}>
            {i > 0 ? (
              <span aria-hidden className="mx-2.5 h-3 w-px bg-current opacity-35" />
            ) : null}
            <Link
              // `pathname` and `params` always describe the current route, so the pair is valid at runtime.
              href={{ pathname, params } as never}
              locale={target}
              lang={localeMeta[target].htmlLang}
              hrefLang={localeMeta[target].hreflang}
              aria-label={target === 'es' ? t('switchToEs') : t('switchToEn')}
              aria-current={current ? 'true' : undefined}
              scroll={false}
              onClick={onNavigate}
              className={`relative px-1 py-2 transition-opacity duration-300 ${
                current ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {t(target)}
              <span
                aria-hidden
                className={`absolute inset-x-1 bottom-1 h-px bg-current transition-transform duration-500 ${
                  current ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
