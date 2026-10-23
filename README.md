# etarq studio — website concept (EN / ES)

Bilingual (Mexican Spanish default, English alternative) architecture-studio website built with
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, next-intl, Framer Motion and
React Three Fiber. Built from the studio's Instagram photographs (`@etarq.studio`, CDMX).

> **Status:** all source is written, but `npm install`, `tsc`, `next build` and the browser tests could
> **not** be run in the sandbox this was authored in (the npm registry was unreachable). Run the
> verification steps below before presenting it. What *was* run: the translation parity script and a
> syntax-only pass over every `.ts/.tsx` file.

## Run it

```bash
npm install
cp .env.example .env.local     # optional; defaults work locally
npm run dev                    # http://localhost:3000  → redirects to /es
```

## Verify (release gate)

```bash
npm run i18n:check             # es/en key parity, empty values, placeholders, untranslated text, keys used in code
npm run typecheck              # translation keys are type-checked against messages/es.json
npm run lint
npm run build                  # fails on any missing translation (see src/i18n/request.ts onError)
npm start                      # then, in another terminal:
npm run smoke                  # every route × both languages: 200, lang attr, hreflang, canonical,
                               # equivalent-page switcher link, no raw keys, no cross-language copy, 404s,
                               # sitemap/robots, cookie-remembered language
```

Then click through `/es` and `/en` by hand once: switch language on every page (including a project
page) and on mobile width; check the menu, form validation messages, and the 3D section.

## Language switching

* Routes: `/es`, `/es/proyectos`, `/es/proyectos/[slug]`, `/es/estudio`, `/es/enfoque`, `/es/contacto`
  ↔ `/en`, `/en/projects`, `/en/projects/[slug]`, `/en/studio`, `/en/approach`, `/en/contact`
  (`src/i18n/routing.ts`).
* The `EN | ES` control (`components/layout/LanguageSwitcher.tsx`) renders real links to the
  equivalent page — the same project stays selected.
* The choice is stored in the `NEXT_LOCALE` cookie (1 year). Visiting `/` goes to the remembered
  language, otherwise Spanish (`src/middleware.ts`). Browser `Accept-Language` is deliberately ignored.
* All copy lives in `messages/es.json` and `messages/en.json` (project text under `Projects.items.<slug>`,
  image alt text under `Images`). No machine-translation at runtime.
* `<html lang>` is `es-MX` / `en`; titles, descriptions, Open Graph, canonical and `hreflang`
  (`es-MX`, `en`, `x-default`) are generated per locale (`src/lib/metadata.ts`, `sitemap.ts`).

## Content you must confirm with the studio

Nothing below is invented; unknowns are hidden or flagged:

| Item | Where | Current state |
|---|---|---|
| Instagram handle | `.env` `NEXT_PUBLIC_INSTAGRAM_HANDLE` | `etarq.studio` (read from the screenshot header; confirm) |
| Email / WhatsApp | `.env` | empty → not shown anywhere |
| Project names | `src/data/projects.ts` `titleVerified` | `Buna` and `Yale` read from signage/highlights; the other five are descriptive **working titles** |
| Locations / years | `src/data/projects.ts` | `null` → hidden |
| Materials | `Projects.items…` / data | identified from photos only |
| Studio / approach copy | `messages/*.json` | draft wording based on the bio "Matter, space and everyday life" |
| Team | — | omitted (none supplied) |
| `cocina` project | — | the supplied image is a **render**; labelled "Visualization" |

Draft notes appear beside unverified copy; remove them with `NEXT_PUBLIC_SHOW_DRAFT_NOTES=false`.

## Contact form

Front-end prototype: validates (translated messages) and then says plainly that nothing was sent.
Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to a URL that accepts a JSON POST
(`{ name, email, projectType, message }`) and it will submit for real and show a success message.

## Advanced UI layer (v2)

* **Hero triptych** – three project photographs, each at or below native resolution (crisp), staggered
  clip-path reveals, per-panel parallax, hover-to-expand, stretched links into the projects, oversized
  serif wordmark, grain and blueprint hairlines. Phones show the centre photograph only.
* **Marquee** of Matter · Space · Light · Everyday life (pauses on hover, static with reduced motion).
* **Pinned horizontal showcase** of all projects (desktop); native swipe scroll-snap on touch.
* **Typographic project index** with a cursor-following photograph preview (thumbnails on touch).
* **Custom cursor** with a "View / Ver" label over projects (desktop, fine pointers only).
* In-frame image parallax, scroll-progress hairline in the header, film grain on dark sections.
* Photos are upscaled 2x (Lanczos + light sharpening) by `npm run images`; real originals from the
  studio will still look noticeably better.

## 3D feature

`components/three/*` — an abstract study (stepped stone volumes, timber-and-steel pergola, planters).
Loaded lazily (separate chunk, only near the viewport), paused off-screen, static photo fallback when
WebGL is unavailable / errors / context is lost, no auto-rotation with reduced motion, cheaper
rendering on small screens. It is labelled as *not* a model of a built project.

## Structure

```
messages/            en.json, es.json
public/images/       optimised WebP + og.jpg (generated by scripts/prepare-images.mjs from assets-src/)
scripts/             check-i18n.mjs, smoke-test.mjs, prepare-images.mjs
src/
  middleware.ts      locale routing + remembered language
  i18n/              routing (translated pathnames), navigation, request config
  config/            site.ts (studio facts), nav.ts
  data/              projects.ts (structure), assets.ts, image-meta.json
  lib/metadata.ts    canonical / hreflang / Open Graph
  app/[locale]/      layout, home, projects, projects/[slug], studio, approach, contact, 404, error, loading
  app/sitemap.ts, robots.ts, icon.svg
  components/        layout, sections, projects, motion, three, contact, ui
```

## Deploy (Vercel)

1. Push to GitHub, import the repo in Vercel (framework: Next.js; no build overrides).
2. Set `NEXT_PUBLIC_SITE_URL` to the production URL (used for canonical / hreflang / sitemap / OG),
   plus any confirmed contact variables.
3. Deploy. All pages are statically generated for both locales.

## Notes

* Source photographs are low-resolution Instagram exports (≈1080 px wide). Ask the studio for
  originals before launch, then drop them in `assets-src/` and run `npm run images`.
* GSAP was intentionally not added: Framer Motion covers every effect used, and extra scroll
  choreography would not improve the result.
* Fonts: Söhne Extraleicht (client typeface, licence files pending) with DM Sans (Fontsource) as the temporary fallback.


---

## Client-material redesign (Oct 2026)

* Content now comes from the client's slides: studio text, figures (+3,000 m², 3 states, +30 projects, +4 years),
  the four-stage process ("Cómo trabajamos"), the six-person team and 12 projects (renders/photos cropped into `assets-src/`).
* Palette sampled from the client's renders — see the header of `src/app/globals.css`. Page palettes per route live in
  `src/config/themes.ts`; project pages use the `theme` field in `src/data/projects.ts`.
* Typeface: Söhne Extraleicht — **licensed files still required**, see `public/fonts/README.md`.
* Project titles are descriptive working titles until the studio supplies real names, locations and years.
* Process route is `/es/como-trabajamos` · `/en/process` (internal key remains `/approach`).
* `npm run images` regenerates WebP + blur metadata from `assets-src/` (needs `sharp` installed for your OS).
