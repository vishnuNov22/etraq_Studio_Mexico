import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/metadata';
import { instagramUrl, siteConfig, whatsappUrl } from '@/config/site';
import { ContactForm } from '@/components/contact/ContactForm';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'contact', '/contact');
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Contact' });
  const tc = await getTranslations({ locale, namespace: 'Common' });

  return (
    <section aria-labelledby="contact-title" className="container-x grid gap-16 pb-28 pt-40 md:grid-cols-12 md:gap-x-12 md:pb-44 md:pt-52">
      <div className="md:col-span-6">
        <Reveal onLoad>
          <p className="eyebrow mb-6 text-muted">{t('eyebrow')}</p>
        </Reveal>
        <SplitHeading as="h1" id="contact-title" onLoad text={t('title')} className="font-display display-lg" />
        <Reveal onLoad delay={0.5}>
          <p className="mt-8 max-w-md text-[1.0625rem] leading-[1.75] text-ink/85">{t('lead')}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <h2 className="eyebrow mb-6 text-muted">{t('detailsTitle')}</h2>
          <dl className="rule grid grid-cols-[8rem_1fr] gap-x-4 gap-y-6 pt-7 text-[1.0625rem]">
            <dt className="eyebrow pt-1.5 text-muted">{t('instagram')}</dt>
            <dd>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5"
              >
                <span className="link-line">@{siteConfig.instagramHandle}</span>
                <ArrowUpRight aria-hidden size={18} strokeWidth={1.5} />
                <span className="sr-only">
                  ({t('instagramCta')}, {tc('externalLink')})
                </span>
              </a>
              <p className="mt-1 text-[0.9375rem] text-muted">{t('instagramCta')}</p>
            </dd>

            {/* Email / WhatsApp appear only once the studio confirms them (see src/config/site.ts). */}
            {siteConfig.email ? (
              <>
                <dt className="eyebrow pt-1.5 text-muted">{t('email')}</dt>
                <dd>
                  <a href={`mailto:${siteConfig.email}`} className="link-line">
                    {siteConfig.email}
                  </a>
                </dd>
              </>
            ) : null}
            {whatsappUrl ? (
              <>
                <dt className="eyebrow pt-1.5 text-muted">{t('whatsapp')}</dt>
                <dd>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                    {siteConfig.whatsappNumber}
                    <span className="sr-only"> ({tc('externalLink')})</span>
                  </a>
                </dd>
              </>
            ) : null}

            <dt className="eyebrow pt-1.5 text-muted">{t('location')}</dt>
            <dd>{t('locationValue')}</dd>
          </dl>
        </Reveal>
      </div>

      <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
        <Reveal delay={0.2}>
          <h2 className="font-display display-sm mb-3">{t('formTitle')}</h2>
          {!siteConfig.contactEndpoint ? (
            <p className="mb-10 text-[0.9375rem] leading-relaxed text-muted">{t('formIntro')}</p>
          ) : (
            <div className="mb-10" />
          )}
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
