/**
 * Page palettes. Colours themselves live as CSS variables in globals.css (single source of truth);
 * this file only decides WHICH palette each route uses, so the site feels like one journey:
 *
 *   home        ivory        — light, the photographs carry the colour
 *   projects    ivory
 *   project     per project  — taken from that project's own materials (green, leather, cognac, sage)
 *   studio      sage         — soft green, human and open
 *   process     leather      — deep, tactile, handcrafted
 *   contact     green        — the client's signature green
 */
export type ThemeName = 'ivory' | 'green' | 'leather' | 'cognac' | 'sage';

export const THEME_META_COLOR: Record<ThemeName, string> = {
  ivory: '#f4f1ec',
  green: '#2f442f',
  leather: '#3a2414',
  cognac: '#e9dcc7',
  sage: '#dfe6da',
};
