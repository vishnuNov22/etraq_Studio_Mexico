/**
 * Page palettes. Colours themselves live as CSS variables in globals.css (single source of truth);
 * this file only decides WHICH palette each route uses, so the site feels like one journey:
 *
 *   home        ivory        — light, the photographs carry the colour
 *   projects    ivory
 *   project     ivory        — clean, neutral; the photographs carry the colour
 *   studio      stone        — soft warm grey
 *   process     leather      — deep, tactile, handcrafted
 *   contact     stone
 */
export type ThemeName = 'ivory' | 'ink' | 'leather' | 'cognac' | 'stone';

export const THEME_META_COLOR: Record<ThemeName, string> = {
  ivory: '#f4f1ec',
  ink: '#161615',
  leather: '#3a2414',
  cognac: '#e9dcc7',
  stone: '#e8e6e1',
};
