import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/metadata';
import { Hero } from '@/components/sections/Hero';
import { Intro } from '@/components/sections/Intro';
import { Marquee } from '@/components/sections/Marquee';
import { ProjectShowcase } from '@/components/sections/ProjectShowcase';
import { ProjectIndex } from '@/components/sections/ProjectIndex';
import { StatsBand } from '@/components/sections/StatsBand';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { CtaBand } from '@/components/sections/CtaBand';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'home', '/');
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <StatsBand />
      <ProjectShowcase />
      <ProjectIndex />
      <ProcessSection tone link />
      <TeamSection />
      <CtaBand />
    </>
  );
}
