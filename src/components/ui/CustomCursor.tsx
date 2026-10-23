'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * Desktop-only cursor companion. A small ring follows the pointer; over any element carrying
 * `data-cursor="Label"` it grows into a labelled disc. The native cursor is never hidden, nothing
 * renders on touch devices or with reduced motion, and the disc is purely decorative.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as Element | null)?.closest?.('[data-cursor]');
      setLabel(target?.getAttribute('data-cursor') ?? null);
    };
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ x: sx, y: sy }}>
      <div
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-[width,height,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          label
            ? 'h-20 w-20 border border-transparent bg-ivory text-charcoal shadow-lg'
            : 'h-7 w-7 border border-ivory bg-transparent mix-blend-difference'
        }`}
      >
        {label}
      </div>
    </motion.div>
  );
}
