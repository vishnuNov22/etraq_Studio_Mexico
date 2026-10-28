import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
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
  const ti = await getTranslations({ locale, namespace: 'Images' });
  const cover = getAsset(project.images[0]);
  const type = t(`items.${project.slug}.type`);

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
      {/* First slide: one full-bleed image, the title and three lines of facts — nothing else. */}
      <section aria-label={title} className="on-dark relative h-[100svh] min-h-[560px] overflow-hidden bg-charcoal text-ivory">
        <Image
          src={cover.src}
          alt={ti(project.images[0])}
          fill
          priority
          sizes="100vw"
          quality={90}
          placeholder="blur"
          blurDataURL={cover.blurDataURL}
          className="object-cover"
          style={{ objectPosition: project.coverPosition }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-charcoal/40" />

        <div className="container-x absolute inset-x-0 bottom-0 pb-9 md:pb-12">
          <Reveal onLoad>
            <p className="eyebrow mb-4 opacity-85">{count}</p>
          </Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <SplitHeading as="h1" onLoad text={title} className="font-display display-lg max-w-[18ch]" />
            <Reveal onLoad delay={0.4}>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[0.9375rem] md:min-w-[17rem]">
                <dt className="eyebrow opacity-70">{t('typeLabel')}</dt>
                <dd>{type}</dd>
                {project.location ? (
                  <>
                    <dt className="eyebrow opacity-70">{t('locationLabel')}</dt>
                    <dd>{project.location}</dd>
                  </>
                ) : null}
                {project.year ? (
                  <>
                    <dt className="eyebrow opacity-70">{t('yearLabel')}</dt>
                    <dd>{project.year}</dd>
                  </>
                ) : null}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 py-20 md:grid-cols-12 md:gap-x-10 md:py-32">
        <Reveal className="md:col-span-6">
          <Link href="/projects" className="group mb-10 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
            <ArrowLeft
              aria-hidden
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:-translate-x-0.5"
            />
            <span className="link-line pb-0.5">{tc('backToProjects')}</span>
          </Link>
          <p className="text-[1.125rem] leading-[1.8] text-ink/90">{t(`items.${project.slug}.description`)}</p>
        </Reveal>

        <Reveal className="space-y-6 md:col-span-4 md:col-start-9" delay={0.1}>
          <div className="rule pt-6">
            <p className="eyebrow mb-3 text-muted">{t('materialsLabel')}</p>
            <ul className="space-y-1 text-[0.9375rem]">
              {project.materials.map((m) => (
                <li key={m}>{tm(m)}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <DraftNote message={t('materialsNote')} />
            {!project.titleVerified ? <DraftNote message={t('draftTitleNote')} /> : null}
            {project.images.length < 2 ? <DraftNote message={t('moreImagesNote')} /> : null}
          </div>
        </Reveal>
      </div>

      {project.images.length > 1 ? (
        <div className="container-x space-y-6 pb-24 md:space-y-10 md:pb-40" role="group" aria-label={t('galleryLabel')}>
          {project.images.slice(1).map((asset) => (
            <Photo key={asset} asset={asset} sizes="(min-width: 1536px) 1400px, 94vw" />
          ))}
        </div>
      ) : (
        <div className="pb-8 md:pb-16" />
      )}

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
