'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SplitHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
  delay?: number;
  /** Run on mount (hero) instead of on scroll. */
  onLoad?: boolean;
}

/**
 * Word-by-word masked reveal. Words stay real text nodes separated by spaces, so screen readers,
 * hyphenation and line balancing behave exactly like a normal heading.
 */
export function SplitHeading({ text, as: Tag = 'h2', className, id, delay = 0, onLoad = false }: SplitHeadingProps) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  const trigger = onLoad
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -10% 0px' } };

  return (
    <Tag id={id} className={className}>
      <motion.span
        data-reveal-group
        style={{ display: 'inline' }}
        initial={reduce ? 'show' : 'hidden'}
        {...trigger}
        transition={{ staggerChildren: 0.055, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: '108%' }, show: { y: '0%' } }}
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
