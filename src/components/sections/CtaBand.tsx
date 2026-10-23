import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { ArrowLink } from '@/components/ui/ArrowLink';

/** Closing call to action used at the end of the main pages. */
export function CtaBand() {
  const t = useTranslations('Studio');

  return (
    <section aria-labelledby="cta-title" className="on-dark grain bg-moss text-ivory">
      <div className="container-x grid gap-10 py-24 md:grid-cols-12 md:py-36">
        <div className="md:col-span-8">
          <SplitHeading as="h2" id="cta-title" text={t('ctaTitle')} className="font-display display-lg" />
        </div>
        <Reveal className="flex flex-col justify-end gap-8 md:col-span-4" delay={0.15}>
          <p className="max-w-sm text-[1.0625rem] leading-[1.7]">{t('ctaBody')}</p>
          <ArrowLink href="/contact" className="self-start">
            {t('ctaButton')}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
