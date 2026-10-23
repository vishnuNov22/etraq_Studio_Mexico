import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/metadata';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { StatsBand } from '@/components/sections/StatsBand';
import { TeamSection } from '@/components/sections/TeamSection';
import { CtaBand } from '@/components/sections/CtaBand';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'studio', '/studio');
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Studio' });
  const bold = (chunks: React.ReactNode) => <strong className="font-normal text-ink [font-weight:500]">{chunks}</strong>;

  return (
    <>
      <section aria-labelledby="studio-title" className="container-x pb-12 pt-36 md:pb-20 md:pt-52">
        <Reveal onLoad>
          <p className="eyebrow mb-6 text-muted">{t('eyebrow')}</p>
        </Reveal>
        <SplitHeading as="h1" id="studio-title" onLoad text={t('title')} className="font-display display-xl" />
      </section>

      <section className="container-x grid gap-12 pb-24 md:grid-cols-12 md:gap-x-10 md:pb-40">
        <div className="order-2 flex flex-col justify-end gap-7 md:order-1 md:col-span-5">
          <Reveal>
            <p className="text-[1.0625rem] leading-[1.8] text-muted">{t('body1')}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[1.0625rem] leading-[1.8] text-muted">{t.rich('body2', { b: bold })}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-[1.0625rem] leading-[1.8] text-muted">{t.rich('body3', { b: bold })}</p>
          </Reveal>
          <Reveal delay={0.24} className="pt-2">
            <ArrowLink href="/projects">{t('projectsCta')}</ArrowLink>
          </Reveal>
        </div>
        <div className="order-1 md:order-2 md:col-span-6 md:col-start-7">
          <Photo asset="studioWalk" ratio="4 / 5" sizes="(min-width: 768px) 50vw, 94vw" position="50% 50%" parallax />
        </div>
      </section>

      <StatsBand />
      <TeamSection />
      <CtaBand />
    </>
  );
}
