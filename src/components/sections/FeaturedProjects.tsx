import { useTranslations } from 'next-intl';
import { ProjectFeature } from '@/components/projects/ProjectFeature';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { featuredSlugs, getProject, type Project } from '@/data/projects';

export function FeaturedProjects() {
  const t = useTranslations('Projects');
  const tc = useTranslations('Common');
  const featured = featuredSlugs
    .map((slug) => getProject(slug))
    .filter((p): p is Project => Boolean(p));

  return (
    <section aria-labelledby="featured-title" className="pb-24 md:pb-40">
      <div className="container-x mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <p className="eyebrow mb-6 text-muted">{t('featuredEyebrow')}</p>
          </Reveal>
          <SplitHeading as="h2" id="featured-title" text={t('featuredTitle')} className="font-display display-lg" />
        </div>
        <Reveal delay={0.15}>
          <ArrowLink href="/projects">{tc('allProjects')}</ArrowLink>
        </Reveal>
      </div>

      <div className="flex flex-col gap-24 md:gap-40">
        {featured.map((project) => (
          <ProjectFeature key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
