'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { siteConfig, instagramUrl } from '@/config/site';
import { NAV_ITEMS } from '@/config/nav';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

/** Full-screen mobile navigation: focus-trapped, Escape-closable, scroll-locking. */
export function MobileMenu({ open, onClose, currentPath }: MobileMenuProps) {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const tf = useTranslations('Hero');
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={tc('menu')}
          className="on-dark fixed inset-0 z-[60] flex flex-col bg-charcoal text-ivory"
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-[var(--header-h)] items-center justify-between px-[var(--gutter)]">
            <Link href="/" onClick={onClose} aria-label={tc('homeLink')} className="font-display text-[1.75rem]">
              {siteConfig.wordmark}
              <span className="ml-1.5 text-[1.05rem] opacity-70">{siteConfig.wordmarkSuffix}</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label={tc('closeMenu')}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
            >
              <X size={26} strokeWidth={1.25} aria-hidden />
            </button>
          </div>

          <nav aria-label={tc('mainNavigation')} className="flex-1 overflow-y-auto px-[var(--gutter)] pt-8">
            <ul>
              {NAV_ITEMS.map((item, i) => {
                const active = currentPath.startsWith(item.href);
                return (
                  <motion.li
                    key={item.href}
                    className="rule"
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="font-display text-[clamp(2.5rem,12vw,4.25rem)]">{t(item.key)}</span>
                      <span aria-hidden className="eyebrow opacity-50">
                        0{i + 1}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-end justify-between gap-6 px-[var(--gutter)] pb-8 pt-6">
            <div className="space-y-1 text-[0.9375rem]">
              <p className="opacity-70">{tf('location')}</p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line"
              >
                Instagram <span className="sr-only">({tc('externalLink')})</span>
              </a>
            </div>
            <LanguageSwitcher onNavigate={onClose} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
