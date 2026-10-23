'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NAV_ITEMS } from '@/config/nav';
import { MobileMenu } from './MobileMenu';

/**
 * Fixed header. Over the cinematic hero (home, not yet scrolled) it is transparent with light text;
 * everywhere else it takes the page palette (ivory, green, leather, cognac, sage), cross-fading between routes
 * so labels, borders and the progress line always keep strong contrast.
 */
export function Header() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => setOpen(false), []);
  const overHero = pathname === '/' && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-500 ${
          overHero
            ? 'on-dark border-b border-transparent text-ivory'
            : 'border-b border-line bg-surface/95 text-ink backdrop-blur-md'
        }`}
      >
        {/* Soft scrim keeps nav legible over bright parts of the hero photograph. */}
        {overHero ? (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-charcoal/55 to-transparent" />
        ) : null}

        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" aria-label={tc('homeLink')} className="font-display text-[1.6rem] leading-none tracking-[-0.04em]">
            {siteConfig.wordmark}
            <span className="ml-1.5 text-[0.85rem] tracking-normal opacity-70">{siteConfig.wordmarkSuffix}</span>
          </Link>

          <div className="flex items-center gap-8 lg:gap-12">
            <nav aria-label={tc('mainNavigation')} className="hidden md:block">
              <ul className="flex items-center gap-7 lg:gap-10">
                {NAV_ITEMS.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className="eyebrow relative py-2 transition-opacity hover:opacity-70"
                      >
                        {t(item.key)}
                        <span
                          aria-hidden
                          className={`absolute inset-x-0 bottom-0.5 h-px bg-current transition-transform duration-500 ${
                            active ? 'scale-x-100' : 'scale-x-0'
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <LanguageSwitcher />

            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={tc('openMenu')}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden"
            >
              <Menu size={26} strokeWidth={1.25} aria-hidden />
            </button>
          </div>
        </div>
        <motion.div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
      </header>

      <MobileMenu open={open} onClose={close} currentPath={pathname} />
    </>
  );
}
