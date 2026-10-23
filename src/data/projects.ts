import type { AssetKey } from './assets';
import type { ThemeName } from '@/config/themes';

/**
 * Project data layer. Text (titles, types, descriptions) lives in the translation files under
 * `Projects.items.<slug>`; this file holds structure only, so it is identical in every language.
 *
 * Images are the renders and photographs supplied by the studio. Only what is visible in them is
 * described. `location` and `year` stay `null` until the studio confirms them — the UI omits null
 * values rather than inventing them. All titles are descriptive WORKING TITLES (`titleVerified: false`)
 * until the studio supplies the real project names.
 *
 * `theme` picks the page palette (see src/config/themes.ts) from the project's own materials.
 */

export const projectSlugs = [
  'cafe',
  'desierto',
  'billar',
  'bano',
  'azotea',
  'cine',
  'oficina',
  'terraza',
  'sala',
  'cocina',
  'vestidor',
  'fachada',
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

export type MaterialKey =
  | 'timber' | 'stone' | 'steel' | 'concrete' | 'ceramic' | 'plaster' | 'plants'
  | 'translucent' | 'paint' | 'terrazzo' | 'canopy' | 'textile' | 'leather' | 'brass' | 'glass';

export type FeatureLayout = 'wide' | 'portraitLeft' | 'portraitRight' | 'full';

export interface Project {
  slug: ProjectSlug;
  /** First image is the cover. */
  images: AssetKey[];
  materials: MaterialKey[];
  titleVerified: boolean;
  /** Confirmed only — otherwise null and hidden. */
  location: string | null;
  year: number | null;
  /** Editorial layout used on the home page. */
  layout: FeatureLayout;
  /** Page palette for the project's detail page. */
  theme: ThemeName;
  /** CSS object-position for the cover crop. */
  coverPosition: string;
}

export const projects: Project[] = [
  {
    slug: 'cafe',
    images: ['cafe', 'basin'],
    materials: ['plaster', 'timber', 'steel', 'translucent', 'ceramic'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'full',
    theme: 'leather',
    coverPosition: '50% 55%',
  },
  {
    slug: 'desierto',
    images: ['desiertoWide', 'desiertoDoor', 'desiertoDrape'],
    materials: ['plaster', 'timber', 'steel', 'textile', 'plants'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'portraitRight',
    theme: 'cognac',
    coverPosition: '50% 50%',
  },
  {
    slug: 'billar',
    images: ['billar', 'billarLounge'],
    materials: ['paint', 'timber', 'leather', 'brass', 'plants'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'full',
    theme: 'green',
    coverPosition: '50% 55%',
  },
  {
    slug: 'bano',
    images: ['banoB', 'banoA'],
    materials: ['ceramic', 'timber', 'glass', 'stone', 'plants'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'wide',
    theme: 'green',
    coverPosition: '50% 50%',
  },
  {
    slug: 'azotea',
    images: ['azotea', 'recamara', 'estarA', 'estarB'],
    materials: ['timber', 'steel', 'plants', 'concrete', 'textile'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'portraitLeft',
    theme: 'sage',
    coverPosition: '50% 50%',
  },
  {
    slug: 'cine',
    images: ['cine'],
    materials: ['timber', 'plaster', 'steel', 'leather'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'wide',
    theme: 'leather',
    coverPosition: '50% 50%',
  },
  {
    slug: 'oficina',
    images: ['oficinaEscalera', 'oficinaAlta'],
    materials: ['steel', 'translucent', 'timber', 'plants', 'concrete'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'portraitRight',
    theme: 'sage',
    coverPosition: '50% 50%',
  },
  {
    slug: 'terraza',
    images: ['terraza'],
    materials: ['timber', 'steel', 'translucent', 'plants'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'portraitLeft',
    theme: 'green',
    coverPosition: '50% 55%',
  },
  {
    slug: 'sala',
    images: ['sala'],
    materials: ['timber', 'steel', 'textile', 'paint'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'wide',
    theme: 'ivory',
    coverPosition: '50% 55%',
  },
  {
    slug: 'cocina',
    images: ['cocina'],
    materials: ['timber', 'stone', 'plants'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'portraitRight',
    theme: 'sage',
    coverPosition: '50% 50%',
  },
  {
    slug: 'vestidor',
    images: ['vestidor'],
    materials: ['timber'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'portraitLeft',
    theme: 'cognac',
    coverPosition: '50% 50%',
  },
  {
    slug: 'fachada',
    images: ['fachada'],
    materials: ['timber', 'steel', 'paint'],
    titleVerified: false,
    location: null,
    year: null,
    layout: 'wide',
    theme: 'leather',
    coverPosition: '50% 60%',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: ProjectSlug) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    index: i,
    total: projects.length,
    next: projects[(i + 1) % projects.length],
  };
}

/** Projects featured on the home page, in editorial order. */
export const featuredSlugs: ProjectSlug[] = ['cafe', 'billar', 'desierto', 'bano', 'azotea'];
