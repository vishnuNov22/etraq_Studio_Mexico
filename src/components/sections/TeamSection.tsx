import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { getAsset, type AssetKey } from '@/data/assets';

/** Names and roles as supplied by the studio ("Equipo" slide). */
const TEAM = [
  { key: 'erick', name: 'Erick Téllez' },
  { key: 'pilar', name: 'Pilar Colado' },
  { key: 'rodrigo', name: 'Rodrigo Malo' },
  { key: 'abril', name: 'Abril Esparza' },
  { key: 'alexia', name: 'Alexia Argüelles' },
  { key: 'fernando', name: 'Fernando Dragonné' },
] as const;

/** Roster in an editorial list: portrait, name, role — one row per person, readable on any width. */
export function TeamSection({ tone = true }: { tone?: boolean }) {
  const t = useTranslations('Team');
  const ti = useTranslations('Images');

  return (
    <section aria-labelledby="team-title" className={`${tone ? 'tone-cognac' : ''} py-24 md:py-36`}>
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-6 text-muted">{t('eyebrow')}</p>
          </Reveal>
          <SplitHeading as="h2" id="team-title" text={t('title')} className="font-display display-lg" />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-sm text-[1.0625rem] leading-[1.75] text-muted">{t('lead')}</p>
          </Reveal>
        </div>

        <ul className="lg:col-span-6 lg:col-start-7">
          {TEAM.map((m, i) => {
            const key = `team_${m.key}` as AssetKey;
            const a = getAsset(key);
            return (
              <li key={m.key} className="rule">
                <Reveal delay={i * 0.05} className="group flex items-center gap-5 py-5 md:gap-7 md:py-6">
                  <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-accent/60 ring-offset-2 ring-offset-transparent md:h-20 md:w-20">
                    <Image
                      src={a.src}
                      alt={ti(key)}
                      width={160}
                      height={160}
                      sizes="80px"
                      placeholder="blur"
                      blurDataURL={a.blurDataURL}
                      className="h-full w-full object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="font-display display-sm block">{m.name}</span>
                    <span className="eyebrow mt-1.5 block text-muted">{t(`roles.${m.key}`)}</span>
                  </span>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
