'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getAsset, type AssetKey } from '@/data/assets';
import type { ProjectSlug } from '@/data/projects';
import { siteConfig } from '@/config/site';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Panel {
  asset: AssetKey;
  slug: ProjectSlug;
  position: string;
  /** Parallax travel in % of the frame. */
  speed: number;
  /** Only the centre panel is shown on phones. */
  mobile: boolean;
  priority?: boolean;
}

/**
 * Three full-height photographs (each ≤ 1/3 of the viewport) instead of one stretched image:
 * every panel is shown at or below its native resolution, so the photography stays crisp.
 */
const PANELS: Panel[] = [
  { asset: 'desiertoWide', slug: 'desierto', position: '38% 50%', speed: 6, mobile: false },
  { asset: 'billarLounge', slug: 'billar', position: '50% 50%', speed: 10, mobile: true, priority: true },
  { asset: 'cafe', slug: 'cafe', position: '68% 50%', speed: 4, mobile: false },
];

function HeroPanel({
  panel,
  index,
  progress,
  filter,
  active,
  reduce,
  onActivate,
}: {
  panel: Panel;
  index: number;
  progress: MotionValue<number>;
  /** CSS filter string driven by scroll: black & white at the top, full colour once scrolled. */
  filter: MotionValue<string> | string;
  active: number | null;
  reduce: boolean;
  onActivate: () => void;
}) {
  const ti = useTranslations('Images');
  const tp = useTranslations('Projects');
  const tc = useTranslations('Common');
  const asset = getAsset(panel.asset);
  const y = useTransform(progress, [0, 1], ['0%', reduce ? '0%' : `${panel.speed}%`]);
  const title = tp(`items.${panel.slug}.title`);

  return (
    <li
      className={`relative min-w-0 flex-1 overflow-hidden transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        panel.mobile ? '' : 'hidden md:block'
      }`}
      style={{ flexGrow: active === null ? 1 : active === index ? 1.7 : 0.75 }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <motion.div
        data-reveal
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: 'inset(0% 0 0 0)' }}
        transition={{ duration: 1.5, delay: 0.15 + index * 0.16, ease: EASE }}
      >
        <motion.div className="absolute inset-x-0 -top-[6%] h-[112%]" style={{ y, filter }}>
          <Image
            src={asset.src}
            alt={ti(panel.asset)}
            fill
            priority={panel.priority}
            sizes="(min-width: 768px) 40vw, 100vw"
            quality={90}
            placeholder="blur"
            blurDataURL={asset.blurDataURL}
            className="object-cover"
            style={{ objectPosition: panel.position }}
          />
        </motion.div>
      </motion.div>

      {/* top scrim keeps the caption legible over bright photographs */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/60 to-transparent" />

      {/* stretched link: the whole panel opens the project; the caption sits at the top */}
      <Link
        href={{ pathname: '/projects/[slug]', params: { slug: panel.slug } }}
        data-cursor={tc('cursorView')}
        className="absolute inset-0 z-10 block"
      >
        <span className="absolute left-4 top-[6.25rem] flex items-center gap-3 eyebrow text-ivory md:left-5">
          <span aria-hidden className="opacity-70">0{index + 1}</span>
          <span aria-hidden className="h-px w-6 bg-ivory/60" />
          {title}
        </span>
      </Link>
    </li>
  );
}

/**
 * Cinematic opening: a triptych of project photographs that expand on hover, with staggered clip-path
 * reveals and the studio wordmark in oversized light type. The photographs start in black & white and
 * turn to colour as the visitor scrolls (client feedback, Oct 2026).
 */
export function Hero() {
  const t = useTranslations('Hero');
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // The hero is pinned (sticky) inside a taller wrapper: while the visitor scrolls through the extra
  // height, the photographs turn from black & white to full colour.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const gray = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollFilter = useTransform(gray, (v) => `grayscale(${v.toFixed(3)})`);
  const filter = reduce ? 'grayscale(0)' : scrollFilter;

  return (
    <section ref={ref} className={`relative ${reduce ? '' : 'h-[185svh]'}`}>
    <div className="on-dark grain sticky top-0 flex h-[100svh] min-h-[680px] flex-col justify-end overflow-hidden bg-charcoal text-ivory">
      <ul
        aria-label={t('panelsLabel')}
        className="absolute inset-0 flex gap-1.5 md:gap-2"
        onMouseLeave={() => setActive(null)}
      >
        {PANELS.map((panel, i) => (
          <HeroPanel key={panel.slug} panel={panel} index={i} progress={scrollYProgress} filter={filter} active={active} reduce={reduce} onActivate={() => setActive(i)} />
        ))}
      </ul>

      {/* bottom scrim: guarantees contrast for the type without a card over the photographs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/10 to-transparent" />
      <div aria-hidden className="hairline-grid pointer-events-none absolute inset-0 hidden md:block" />

      <div className="container-x pointer-events-none relative z-10 pb-9 md:pb-12">
        <motion.p
          data-reveal
          className="eyebrow mb-4 flex items-center gap-4 opacity-90 md:mb-6"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: EASE }}
        >
          <span>{t('discipline')}</span>
          <span aria-hidden className="h-px w-10 bg-ivory/50" />
          <span>{t('location')}</span>
          <span aria-hidden className="ml-auto hidden opacity-70 md:inline">{siteConfig.coordinates}</span>
        </motion.p>

        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
          <h1 className="font-display leading-[0.82] tracking-[-0.035em] text-[clamp(5.5rem,20vw,18.5rem)]">
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span
                data-reveal
                className="inline-block"
                initial={reduce ? false : { y: '108%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.5, delay: 0.7, ease: EASE }}
              >
                {siteConfig.wordmark}
                <span className="ml-[0.08em] align-baseline text-[0.2em] tracking-normal opacity-80">
                  {siteConfig.wordmarkSuffix}
                </span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            data-reveal
            className="max-w-xs font-display text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.12] md:pb-6 md:text-right"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.3, ease: EASE }}
          >
            {t('statement')}
          </motion.p>
        </div>

        <motion.a
          data-reveal
          href="#studio-intro"
          className="pointer-events-auto mt-8 inline-flex items-center gap-4 eyebrow opacity-80 transition-opacity hover:opacity-100"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-ivory/30">
            <span className="scroll-cue absolute inset-0 block bg-ivory" />
          </span>
          {t('scroll')}
        </motion.a>
      </div>
    </div>
    </section>
  );
}
