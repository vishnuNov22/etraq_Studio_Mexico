'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getAsset } from '@/data/assets';
import { projects, type ProjectSlug } from '@/data/projects';

/**
 * Typographic project index. On desktop a photograph follows the cursor and swaps per project
 * (all previews are in the DOM, so switching is instant); on touch each row shows a thumbnail.
 */
export function ProjectIndex({ showHeading = true }: { showHeading?: boolean }) {
  const t = useTranslations('Index');
  const tp = useTranslations('Projects');
  const box = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<ProjectSlug | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 28, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 28, mass: 0.6 });

  return (
    <section aria-labelledby={showHeading ? 'index-title' : undefined} aria-label={showHeading ? undefined : tp('indexLabel')} className="py-24 md:py-40">
      <div className="container-x">
        {showHeading ? (
          <div className="mb-14 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-6 text-muted">{t('eyebrow')}</p>
              <h2 id="index-title" className="font-display display-lg">
                {t('title')}
              </h2>
            </div>
            <p className="hidden max-w-[16rem] text-[0.875rem] leading-relaxed text-muted md:block">{t('hint')}</p>
          </div>
        ) : null}

        <div
          ref={box}
          className="relative"
          onMouseMove={(e) => {
            const r = box.current?.getBoundingClientRect();
            if (!r) return;
            mx.set(e.clientX - r.left);
            my.set(e.clientY - r.top);
          }}
          onMouseLeave={() => setHover(null)}
        >
          <ul className="group/list border-b border-line">
            {projects.map((project, i) => {
              const a = getAsset(project.images[0]);
              return (
                <li
                  key={project.slug}
                  className="border-t border-line transition-opacity duration-500 group-hover/list:opacity-30 hover:opacity-100!"
                >
                  <Link
                    href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                    onMouseEnter={() => setHover(project.slug)}
                    onFocus={() => setHover(project.slug)}
                    onBlur={() => setHover(null)}
                    className="group flex items-center gap-5 py-6 md:grid md:grid-cols-12 md:gap-8 md:py-10"
                  >
                    <span className="eyebrow w-8 shrink-0 text-muted md:col-span-1 md:w-auto">0{i + 1}</span>
                    <span className="font-display display-md flex-1 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:col-span-6 md:group-hover:translate-x-3">
                      {tp(`items.${project.slug}.title`)}
                    </span>
                    <span className="eyebrow hidden text-muted md:col-span-4 md:block">
                      {tp(`items.${project.slug}.type`)}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={1.25}
                      className="hidden size-7 justify-self-end transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 md:col-span-1 md:block"
                    />
                    <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-limestone md:hidden">
                      <Image src={a.src} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: project.coverPosition }} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Cursor-following preview (desktop, hover-capable devices only) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
            style={{ x, y }}
            animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.9 }}
            transition={{ duration: 0.35 }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-limestone shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)]" style={{ width: 288, height: 360 }}>
              {projects.map((project) => {
                const a = getAsset(project.images[0]);
                return (
                  <Image
                    key={project.slug}
                    src={a.src}
                    alt=""
                    fill
                    sizes="288px"
                    quality={85}
                    className={`object-cover transition-opacity duration-500 ${hover === project.slug ? 'opacity-100' : 'opacity-0'}`}
                    style={{ objectPosition: project.coverPosition }}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
