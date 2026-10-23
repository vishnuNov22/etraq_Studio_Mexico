'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getAsset, type AssetKey } from '@/data/assets';

interface PhotoProps {
  asset: AssetKey;
  sizes: string;
  /** CSS aspect-ratio, e.g. "4 / 5". Defaults to the photograph's own ratio. */
  ratio?: string;
  /** CSS object-position for the crop. */
  position?: string;
  priority?: boolean;
  /** Clip-path reveal when scrolled into view. */
  reveal?: boolean;
  className?: string;
  /** Hover zoom. */
  zoom?: boolean;
  /** Subtle scroll parallax inside the frame (image is slightly oversized). */
  parallax?: boolean;
}

/** Optimised, translated-alt photograph with optional masked reveal and in-frame parallax. */
export function Photo({
  asset,
  sizes,
  ratio,
  position = '50% 50%',
  priority = false,
  reveal = true,
  zoom = true,
  parallax = false,
  className = '',
}: PhotoProps) {
  const t = useTranslations('Images');
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const a = getAsset(asset);
  const aspectRatio = ratio ?? `${a.width} / ${a.height}`;

  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', reduce ? '-5%' : '5%']);

  const image = (
    <Image
      src={a.src}
      alt={t(asset)}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={a.blurDataURL}
      quality={88}
      className="object-cover"
      style={{ objectPosition: position }}
    />
  );

  const content = parallax ? (
    <motion.div className="absolute inset-0 scale-[1.12]" style={{ y }}>
      {image}
    </motion.div>
  ) : (
    image
  );

  const base = `relative block w-full overflow-hidden bg-limestone ${zoom ? 'photo-zoom' : ''} ${className}`;

  if (!reveal) {
    return (
      <div ref={frame} className={base} style={{ aspectRatio }}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      ref={frame}
      data-reveal
      className={base}
      style={{ aspectRatio }}
      initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}
