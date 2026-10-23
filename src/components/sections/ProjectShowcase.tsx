'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Photo } from '@/components/ui/Photo';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { projects } from '@/data/projects';

/**
 * Pinned horizontal walk-through of the work.
 * Desktop: the section is pinned while vertical scroll drives a horizontal track (never hijacked —
 * it is ordinary scroll position, and the page continues normally afterwards).
 * Touch / small screens: a native swipeable scroll-snap row.
 */
export function ProjectShowcase() {
  const t = useTranslations('Showcase');
  const tp = useTranslations('Projects');
  const tc = useTranslations('Common');

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const max = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform([scrollYProgress, max], (latest: number[]) => -latest[0] * latest[1]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const measure = () => {
      const el = track.current;
      if (!el) return;
      if (mq.matches) {
        const distance = Math.max(0, el.scrollWidth - window.innerWidth);
        max.set(distance);
        setHeight(distance + window.innerHeight);
      } else {
        max.set(0);
        setHeight(undefined);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [max]);

  return (
    <section
      ref={section}
      aria-labelledby="showcase-title"
      className="relative py-20 md:py-0"
      style={height ? { height } : undefined}
    >
      <div className="md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden">
        <motion.div
          ref={track}
          role="list"
          aria-label={t('trackLabel')}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none] md:w-max md:snap-none md:gap-10 md:overflow-visible md:pb-0 md:pt-8 [&::-webkit-scrollbar]:hidden"
          style={{ x }}
        >
          {/* Intro card */}
          <div role="listitem" className="flex w-[82vw] shrink-0 snap-start flex-col justify-between gap-10 md:w-[26vw] md:min-w-[22rem] md:pr-6">
            <div>
              <p className="eyebrow mb-6 text-muted">{tp('eyebrow')}</p>
              <h2 id="showcase-title" className="font-display display-lg">
                {t('title')}
              </h2>
              <p className="mt-6 max-w-xs text-[1.0625rem] leading-[1.7] text-ink/85">{tp('lead')}</p>
            </div>
            <div className="flex flex-col items-start gap-6">
              <ArrowLink href="/projects">{tc('allProjects')}</ArrowLink>
              <p aria-hidden className="eyebrow flex items-center gap-3 text-muted">
                {t('hint')}
                <ArrowRight size={16} strokeWidth={1.25} />
              </p>
            </div>
          </div>

          {projects.map((project, i) => {
            const title = tp(`items.${project.slug}.title`);
            const type = tp(`items.${project.slug}.type`);
            return (
              <article
                key={project.slug}
                role="listitem"
                className={`w-[78vw] shrink-0 snap-start sm:w-[52vw] md:w-[27vw] lg:w-[24vw] ${i % 2 ? 'md:mt-16' : ''}`}
              >
                <Link
                  href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                  data-cursor={tc('cursorView')}
                  className="group block"
                >
                  <Photo
                    asset={project.images[0]}
                    ratio="4 / 5"
                    sizes="(min-width: 1024px) 24vw, (min-width: 768px) 27vw, 78vw"
                    position={project.coverPosition}
                    reveal={false}
                  />
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-display display-sm">{title}</h3>
                    <span aria-hidden className="eyebrow shrink-0 text-muted">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="eyebrow mt-2 text-muted">{type}</p>
                </Link>
              </article>
            );
          })}
        </motion.div>

        <div aria-hidden className="container-x mt-10 hidden md:block">
          <div className="h-px bg-line">
            <motion.div className="h-px origin-left bg-ink" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}
