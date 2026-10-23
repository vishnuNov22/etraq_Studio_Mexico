import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { Photo } from '@/components/ui/Photo';
import { ArrowLink } from '@/components/ui/ArrowLink';

/** Editorial studio introduction using the studio's own words about its name. */
export function Intro() {
  const t = useTranslations('Intro');

  return (
    <section id="studio-intro" aria-labelledby="intro-title" className="scroll-mt-20 py-24 md:py-40">
      <div className="container-x grid gap-y-14 md:grid-cols-12 md:gap-x-8">
        <Reveal className="md:col-span-3">
          <p className="eyebrow text-muted">{t('eyebrow')}</p>
        </Reveal>

        <div className="md:col-span-9 lg:col-span-8">
          <SplitHeading as="h2" id="intro-title" text={t('title')} className="font-display display-md" />
        </div>

        <div className="md:col-span-5 md:mt-16">
          <Photo asset="studioWalk" sizes="(min-width: 768px) 40vw, 100vw" ratio="4 / 5" position="50% 50%" parallax />
        </div>

        <div className="flex flex-col justify-end gap-8 md:col-span-4 md:col-start-7 md:pb-4">
          <Reveal delay={0.1}>
            <p className="text-[1.0625rem] leading-[1.75] text-ink/90">{t('body1')}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[1.0625rem] leading-[1.75] text-ink/90">{t('body2')}</p>
          </Reveal>
          <Reveal delay={0.3} className="flex flex-col items-start gap-5">
            <ArrowLink href="/studio">{t('cta')}</ArrowLink>
          </Reveal>
        </div>

        <div className="hidden md:col-span-3 md:col-start-10 md:-mt-40 md:block">
          <Photo asset="billarLounge" sizes="25vw" ratio="3 / 4" position="50% 50%" parallax />
        </div>
      </div>
    </section>
  );
}
