'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';
import { getProject } from '@/data/projects';
import { THEME_META_COLOR, type ThemeName } from '@/config/themes';

/** Route → palette. Projects take the palette of their own materials. */
export function themeFor(pathname: string, slug?: string): ThemeName {
  if (pathname.startsWith('/projects/')) {
    const s = slug ?? pathname.split('/')[2];
    return getProject(s ?? '')?.theme ?? 'ivory';
  }
  if (pathname.startsWith('/studio')) return 'sage';
  if (pathname.startsWith('/approach')) return 'leather';
  if (pathname.startsWith('/contact')) return 'green';
  return 'ivory';
}

/**
 * Carries the active page palette as `data-theme`. Colours are registered CSS custom properties
 * (see globals.css), so when the route changes every background, text colour, border and accent
 * cross-fades together instead of snapping. Also keeps the browser UI colour (`theme-color`) in sync.
 */
export function ThemeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ slug?: string }>();
  const theme = themeFor(pathname, params?.slug);

  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = THEME_META_COLOR[theme];
  }, [theme]);

  return (
    <div className="theme-shell" data-theme={theme}>
      {children}
    </div>
  );
}
