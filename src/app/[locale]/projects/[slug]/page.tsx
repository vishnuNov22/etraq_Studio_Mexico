import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { getAdjacentProjects, getProject, projectSlugs } from '@/data/projects';
import { getAsset } from '@/data/assets';
import { localeMeta, siteConfig } from '@/config/site';
import { localizedAlternates, localizedUrl } from '@/lib/metadata';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { DraftNote } from '@/components/ui/DraftNote';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// Every locale × project is pre-rendered; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: 'Projects' });
  const tm = await getTranslations({ locale, namespace: 'Meta' });
  const tp = await getTranslations({ locale, namespace: 'Images' });
  const href = { pathname: '/projects/[slug]', params: { slug } } as const;
  const title = `${t(`items.${project.slug}.title`)} — ${tm('siteName')}`;
  const description = t(`items.${project.slug}.summary`);
  const cover = getAsset(project.images[0]);

  return {
    title,
    description,
    alternates: localizedAlternates(locale, href),
    openGraph: {
      type: 'article',
      siteName: tm('siteName'),
      title,
      description,
      url: localizedUrl(locale, href),
      locale: localeMeta[locale].ogLocale,
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [
        {
          url: `${siteConfig.url}${cover.src}`,
          width: cover.width,
          height: cover.height,
          alt: tp(project.images[0]),
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: 'Projects' });
  const tm = await getTranslations({ locale, namespace: 'Materials' });
  const tc = await getTranslations({ locale, namespace: 'Common' });

  const { index, total, next } = getAdjacentProjects(project.slug);
  const count = tc('projectCount', {
    current: String(index + 1).padStart(2, '0'),
    total: String(total).padStart(2, '0'),
  });
  const title = t(`items.${project.slug}.title`);
  const nextTitle = t(`items.${next.slug}.title`);
  const nextType = t(`items.${next.slug}.type`);

  return (
    <article>
      <header className="container-x pb-14 pt-36 md:pb-20 md:pt-48">
        <Reveal onLoad>
          <Link href="/projects" className="group mb-10 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
            <ArrowLeft
              aria-hidden
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:-translate-x-0.5"
            />
            <span className="link-line pb-0.5">{tc('backToProjects')}</span>
          </Link>
          <p className="eyebrow mb-6 text-muted">
            {count} · {t(`items.${project.slug}.type`)}
          </p>
        </Reveal>
        <SplitHeading as="h1" onLoad text={title} className="font-display display-xl" />
      </header>

      <div className="container-x grid gap-14 pb-24 md:grid-cols-12 md:gap-x-10 md:pb-40">
        <aside className="md:col-span-4 md:self-start md:sticky md:top-28">
          <Reveal className="space-y-9">
            <p className="text-[1.0625rem] leading-[1.8] text-ink/90">{t(`items.${project.slug}.description`)}</p>

            <dl className="rule grid grid-cols-[7rem_1fr] gap-x-4 gap-y-5 pt-7 text-[0.9375rem]">
              <dt className="eyebrow pt-1 text-muted">{t('typeLabel')}</dt>
              <dd>{t(`items.${project.slug}.type`)}</dd>

              {project.location ? (
                <>
                  <dt className="eyebrow pt-1 text-muted">{t('locationLabel')}</dt>
                  <dd>{project.location}</dd>
                </>
              ) : null}

              {project.year ? (
                <>
                  <dt className="eyebrow pt-1 text-muted">{t('yearLabel')}</dt>
                  <dd>{project.year}</dd>
                </>
              ) : null}

              <dt className="eyebrow pt-1 text-muted">{t('materialsLabel')}</dt>
              <dd>
                <ul className="space-y-1">
                  {project.materials.map((m) => (
                    <li key={m}>{tm(m)}</li>
                  ))}
                </ul>
              </dd>
            </dl>

            <div className="space-y-2">
              <DraftNote message={t('materialsNote')} />
              {!project.titleVerified ? <DraftNote message={t('draftTitleNote')} /> : null}
              {project.images.length < 2 ? <DraftNote message={t('moreImagesNote')} /> : null}
            </div>
          </Reveal>
        </aside>

        <div className="space-y-6 md:col-span-8 md:space-y-10" role="group" aria-label={t('galleryLabel')}>
          {project.images.map((asset, i) => (
            <Photo
              key={asset}
              asset={asset}
              sizes="(min-width: 768px) 64vw, 94vw"
              priority={i === 0}
              reveal={i > 0}
              position={i === 0 ? project.coverPosition : '50% 50%'}
            />
          ))}
        </div>
      </div>

      <section aria-label={tc('nextProject')} className={`tone-${next.theme}`}>
        <Link href={{ pathname: '/projects/[slug]', params: { slug: next.slug } }} className="group block">
          <div className="container-x grid items-center gap-8 py-20 md:grid-cols-12 md:py-32">
            <div className="md:col-span-7">
              <p className="eyebrow mb-5 opacity-70">{tc('nextProject')}</p>
              <p className="font-display display-lg">{nextTitle}</p>
              <p className="eyebrow mt-5 opacity-70">{nextType}</p>
            </div>
            <div className="md:col-span-5">
              <Photo
                asset={next.images[0]}
                ratio="4 / 3"
                sizes="(min-width: 768px) 40vw, 94vw"
                position={next.coverPosition}
                reveal={false}
              />
            </div>
          </div>
        </Link>
        <div className="container-x rule pb-10 pt-6">
          <ArrowLink href="/projects">
            {tc('allProjects')}
          </ArrowLink>
        </div>
      </section>
    </article>
  );
}
