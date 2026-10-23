'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { ArrowLink } from '@/components/ui/ArrowLink';
import type { AssetKey } from '@/data/assets';

/**
 * The studio's four stages ("Cómo trabajamos"), in the client's own order and wording.
 * Photographs are illustrative project images, not documentation of each stage:
 * site context → render → joinery detail → finished, lived-in space.
 */
const STAGES: { key: 's1' | 's2' | 's3' | 's4'; count: number; asset: AssetKey; position: string }[] = [
  { key: 's1', count: 4, asset: 'fachada', position: '50% 40%' },
  { key: 's2', count: 5, asset: 'cafe', position: '62% 50%' },
  { key: 's3', count: 3, asset: 'vestidor', position: '50% 50%' },
  { key: 's4', count: 2, asset: 'azotea', position: '30% 50%' },
];

interface Props {
  /** `h1` on the dedicated page, `h2` on the home page. */
  heading?: 'h1' | 'h2';
  /** Wrap in the leather tone (home). On the process page the route theme is already leather. */
  tone?: boolean;
  /** Show the link to the dedicated page (home only). */
  link?: boolean;
}

function Stage({ i, k, count, asset, position }: { i: number; k: string; count: number; asset: AssetKey; position: string }) {
  // Keys are built from stage ids; they are verified by `npm run i18n:check` (typed lookups can't express them).
  const t = useTranslations('Process') as unknown as (key: string) => string;
  const reduce = useReducedMotion();
  return (
    <li className="flex flex-col">
      {/* connecting line: draws itself as the stage enters the viewport */}
      <div aria-hidden className="relative mb-8 h-3">
        <span className="absolute left-0 right-0 top-1/2 h-px bg-line sm:-right-8" />
        <motion.span
          data-reveal
          className="absolute left-0 right-0 top-1/2 h-px origin-left bg-accent sm:-right-8"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-accent bg-surface" />
      </div>

      <p aria-hidden className="font-display mb-4 text-[clamp(3rem,6vw,5rem)] leading-none text-accent">
        {i + 1}.
      </p>
      <h3 className="font-display display-sm mb-6 max-w-[12ch] lg:min-h-[2.4em]">{t(`stages.${k}.title`)}</h3>

      <div className="mb-8 max-w-sm lg:max-w-none">
        <Photo asset={asset} ratio="4 / 5" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 90vw" position={position} />
      </div>

      <ul className="space-y-3 text-[0.9375rem] leading-snug text-muted">
        {Array.from({ length: count }, (_, n) => (
          <li key={n} className="flex gap-3">
            <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full border border-accent" />
            <span>{t(`stages.${k}.i${n + 1}`)}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function ProcessSection({ heading = 'h2', tone = false, link = false }: Props) {
  const t = useTranslations('Process');

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className={`${tone ? 'tone-leather grain' : ''} scroll-mt-20 py-24 md:py-36`}
    >
      <div className="container-x">
        <Reveal onLoad={heading === 'h1'}>
          <p className="eyebrow mb-6 text-muted">{t('eyebrow')}</p>
        </Reveal>
        <SplitHeading as={heading} id="process-title" onLoad={heading === 'h1'} text={t('title')} className="font-display display-lg max-w-4xl" />
        <Reveal onLoad={heading === 'h1'} delay={0.3}>
          <p className="mt-8 max-w-lg text-[1.0625rem] leading-[1.75] text-muted">{t('lead')}</p>
        </Reveal>

        <ol className="mt-16 grid gap-x-8 gap-y-20 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {STAGES.map((s, i) => (
            <Stage key={s.key} i={i} k={s.key} count={s.count} asset={s.asset} position={s.position} />
          ))}
        </ol>

        <p className="mt-10 max-w-xl text-[0.8125rem] leading-relaxed text-muted opacity-80">{t('imageNote')}</p>

        {link ? (
          <div className="mt-12">
            <ArrowLink href="/approach">{t('cta')}</ArrowLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
