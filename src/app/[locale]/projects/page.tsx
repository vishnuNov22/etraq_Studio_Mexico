import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/metadata';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { CtaBand } from '@/components/sections/CtaBand';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'projects', '/projects');
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Projects' });

  return (
    <>
      <section aria-labelledby="projects-title" className="container-x pb-20 pt-40 md:pb-32 md:pt-52">
        <Reveal onLoad>
          <p className="eyebrow mb-6 text-muted">{t('eyebrow')}</p>
        </Reveal>
        <SplitHeading as="h1" id="projects-title" onLoad text={t('title')} className="font-display display-xl" />
        <Reveal onLoad delay={0.5}>
          <p className="mt-8 max-w-md text-[1.0625rem] leading-[1.75] text-ink/85">{t('lead')}</p>
        </Reveal>
      </section>

      <ProjectsGrid />

      <CtaBand />
    </>
  );
}
