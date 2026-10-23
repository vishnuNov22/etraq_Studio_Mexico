import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';

const KEYS = ['area', 'states', 'projects', 'years'] as const;

/** The studio's own figures (from the client's "Experiencia" slide) on the signature green. */
export function StatsBand() {
  const t = useTranslations('Stats');

  return (
    <section aria-labelledby="stats-title" className="tone-green grain py-20 md:py-28">
      <div className="container-x">
        <Reveal>
          <h2 id="stats-title" className="eyebrow mb-12 text-muted md:mb-16">
            {t('eyebrow')}
          </h2>
        </Reveal>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-10">
          {KEYS.map((k, i) => (
            <Reveal key={k} delay={i * 0.08} className="rule flex flex-col-reverse justify-end gap-3 pt-6">
              <dt className="max-w-[16ch] text-[0.9375rem] leading-snug text-muted md:text-[1.0625rem]">{t(`${k}.label`)}</dt>
              <dd className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-none text-accent">{t(`${k}.value`)}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
