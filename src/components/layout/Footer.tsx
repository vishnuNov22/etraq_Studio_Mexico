import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { instagramUrl, siteConfig, whatsappUrl } from '@/config/site';
import { NAV_ITEMS } from '@/config/nav';

export function Footer() {
  const t = useTranslations('Footer');
  const tn = useTranslations('Nav');
  const tc = useTranslations('Common');
  const th = useTranslations('Hero');
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark grain bg-charcoal text-ivory">
      <div className="container-x grid gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-6">
          <p className="font-display display-lg">
            {siteConfig.wordmark}
            <span className="ml-3 text-[0.4em] opacity-60">{siteConfig.wordmarkSuffix}</span>
          </p>
          <p className="eyebrow mt-6 opacity-70">
            {t('tagline')} · {th('location')} · {siteConfig.coordinates}
          </p>
        </div>

        <nav aria-label={tc('footerNavigation')} className="md:col-span-3">
          <h2 className="eyebrow mb-5 opacity-60">{t('navigationTitle')}</h2>
          <ul className="space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-line text-[1.0625rem]">
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow mb-5 opacity-60">{t('contactTitle')}</h2>
          <ul className="space-y-3 text-[1.0625rem]">
            {siteConfig.email ? (
              <li>
                <a href={`mailto:${siteConfig.email}`} className="link-line">
                  {siteConfig.email}
                </a>
              </li>
            ) : null}
            {whatsappUrl ? (
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                  WhatsApp<span className="sr-only"> ({tc('externalLink')})</span>
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5"
              >
                <span className="link-line">@{siteConfig.instagramHandle}</span>
                <ArrowUpRight aria-hidden size={16} strokeWidth={1.5} />
                <span className="sr-only">({tc('externalLink')})</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x rule flex flex-col gap-2 py-6 text-[0.8125rem] opacity-70 md:flex-row md:justify-between">
        <p>{t('rights', { year })}</p>
        <p>
          {t('photoCredit')} {t('concept')}
        </p>
      </div>
    </footer>
  );
}
