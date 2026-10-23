import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { projects, type Project } from '@/data/projects';

interface ProjectFeatureProps {
  project: Project;
  /** Optional override of the layout defined in the project data. */
  layout?: Project['layout'];
}

/**
 * One project in the editorial portfolio. Four layouts (full, wide, portraitLeft, portraitRight)
 * create rhythm instead of a grid of identical cards. Titles sit beside the photograph — or over a
 * dark scrim in the full-width variant — so they always stay legible.
 */
export function ProjectFeature({ project, layout }: ProjectFeatureProps) {
  const t = useTranslations('Projects');
  const tc = useTranslations('Common');
  const index = projects.findIndex((p) => p.slug === project.slug) + 1;
  const count = tc('projectCount', {
    current: String(index).padStart(2, '0'),
    total: String(projects.length).padStart(2, '0'),
  });
  const title = t(`items.${project.slug}.title`);
  const type = t(`items.${project.slug}.type`);
  const summary = t(`items.${project.slug}.summary`);
  const href = { pathname: '/projects/[slug]', params: { slug: project.slug } } as const;
  const cover = project.images[0];
  const kind = layout ?? project.layout;

  const imageLink = (ratio: string, sizes: string) => (
    <Link href={href} tabIndex={-1} aria-hidden="true" data-cursor={tc('cursorView')} className="block">
      <Photo asset={cover} ratio={ratio} sizes={sizes} position={project.coverPosition} parallax />
    </Link>
  );

  if (kind === 'full') {
    return (
      <article className="container-x" aria-label={title}>
        <div className="relative">
          <Link href={href} tabIndex={-1} aria-hidden="true" data-cursor={tc('cursorView')} className="block">
            <Photo asset={cover} ratio="16 / 9" sizes="(min-width: 1536px) 1400px, 94vw" position={project.coverPosition} parallax />
          </Link>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal/80 to-transparent"
          />
          <div className="on-dark absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 text-ivory sm:p-8 md:flex-row md:items-end md:justify-between md:p-12">
            <div>
              <p className="eyebrow mb-3 opacity-85">
                {count} · {type}
              </p>
              <h3 className="font-display display-lg">{title}</h3>
            </div>
            <ArrowLink href={href} className="text-ivory md:pb-3">
              {tc('viewProject')}
              <span className="sr-only">: {title}</span>
            </ArrowLink>
          </div>
        </div>
      </article>
    );
  }

  const meta = (
    <Reveal className="flex flex-col gap-5" y={22}>
      <p className="eyebrow text-muted">
        {count} · {type}
      </p>
      <h3 className="font-display display-md">{title}</h3>
      <p className="max-w-md text-[1.0625rem] leading-[1.7] text-ink/85">{summary}</p>
      <ArrowLink href={href} className="mt-2 self-start">
        {tc('viewProject')}
        <span className="sr-only">: {title}</span>
      </ArrowLink>
    </Reveal>
  );

  if (kind === 'wide') {
    return (
      <article className="container-x grid items-end gap-8 md:grid-cols-12 md:gap-10" aria-label={title}>
        <div className="md:col-span-8">{imageLink('16 / 10', '(min-width: 768px) 66vw, 94vw')}</div>
        <div className="md:col-span-4 md:pb-2">{meta}</div>
      </article>
    );
  }

  const imageFirst = kind === 'portraitLeft';
  return (
    <article className="container-x grid items-center gap-8 md:grid-cols-12 md:gap-10" aria-label={title}>
      <div className={`md:col-span-5 ${imageFirst ? 'md:col-start-1' : 'md:order-2 md:col-start-8'}`}>
        {imageLink('4 / 5', '(min-width: 768px) 42vw, 94vw')}
      </div>
      <div
        className={`md:col-span-5 ${
          imageFirst ? 'md:col-start-7 md:order-2' : 'md:col-start-2 md:order-1'
        }`}
      >
        {meta}
      </div>
    </article>
  );
}
