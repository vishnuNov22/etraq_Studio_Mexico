'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Photo } from '@/components/ui/Photo';
import { projects, projectCategories, type ProjectCategory } from '@/data/projects';

type Filter = 'all' | ProjectCategory;

const isFilter = (v: string | null): v is Filter =>
  v === 'all' || (projectCategories as readonly string[]).includes(v ?? '');

/**
 * Clean, filterable project grid: category tabs on top, then uniform image cards with the title and
 * type underneath. Photographs sit in black & white and turn to colour on hover. The active category is
 * mirrored in the URL (?category=hospitality) so a filtered view can be shared.
 */
export function ProjectsGrid() {
  const t = useTranslations('Projects');
  const tc = useTranslations('Common');
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('category');
      if (isFilter(q)) setFilter(q);
    } catch {
      /* no URL access: stay on "all" */
    }
  }, []);

  const choose = (next: Filter) => {
    setFilter(next);
    try {
      const url = new URL(window.location.href);
      if (next === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', next);
      window.history.replaceState(null, '', url);
    } catch {
      /* ignore */
    }
  };

  const visible = projects.filter((p) => filter === 'all' || p.category === filter);

  return (
    <section aria-label={t('galleryLabel')} className="container-x pb-24 md:pb-40">
      <div role="group" aria-label={t('filterLabel')} className="rule mb-10 flex flex-wrap gap-x-8 gap-y-3 pt-6 md:mb-16">
        {(['all', ...projectCategories] as Filter[]).map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => choose(c)}
              className={`eyebrow relative py-1.5 transition-opacity ${active ? '' : 'opacity-55 hover:opacity-100'}`}
            >
              {t(`categories.${c}`)}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500 ${
                  active ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-muted">{t('noResults')}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => {
              const title = t(`items.${project.slug}.title`);
              return (
                <motion.li
                  key={project.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                    data-cursor={tc('cursorView')}
                    className="group block"
                  >
                    <Photo
                      asset={project.images[0]}
                      ratio="4 / 5"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 94vw"
                      position={project.coverPosition}
                      reveal={false}
                      className="grayscale transition-[filter] duration-700 group-hover:grayscale-0 group-focus-visible:grayscale-0 [@media(hover:none)]:grayscale-0"
                    />
                    <div className="mt-5 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-[1.5rem] leading-tight md:text-[1.75rem]">{title}</h2>
                    </div>
                    <p className="eyebrow mt-2 text-muted">{t(`items.${project.slug}.type`)}</p>
                  </Link>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
