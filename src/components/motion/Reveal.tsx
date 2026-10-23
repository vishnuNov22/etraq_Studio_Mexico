'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Animate on mount instead of when scrolled into view (above-the-fold content). */
  onLoad?: boolean;
}

/** Fade + rise. Content is fully visible with reduced motion or without JavaScript. */
export function Reveal({ children, className, delay = 0, y = 28, onLoad = false }: RevealProps) {
  const reduce = useReducedMotion();
  const transition = { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      data-reveal
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      {...(onLoad
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px 0px -12% 0px' } })}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
