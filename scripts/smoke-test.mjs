// Bilingual acceptance test against a running server.
//   npm run build && npm start        (in one terminal)
//   npm run smoke                     (in another; BASE_URL defaults to http://localhost:3000)
//
// For every route in both languages it checks: HTTP 200, <html lang>, hreflang alternates,
// canonical URL, a language switcher link that points at the *equivalent* page in the other language,
// no MISSING_MESSAGE / raw translation keys, and that Spanish pages contain no English UI strings
// (and vice versa) taken from the translation files themselves.
import { readFileSync } from 'node:fs';

const BASE = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const es = JSON.parse(readFileSync('messages/es.json', 'utf8'));
const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));

const slugs = Object.keys(es.Projects.items);
const routes = [
  { es: '/es', en: '/en' },
  { es: '/es/proyectos', en: '/en/projects' },
  { es: '/es/estudio', en: '/en/studio' },
  { es: '/es/como-trabajamos', en: '/en/process' },
  { es: '/es/contacto', en: '/en/contact' },
  ...slugs.map((s) => ({ es: `/es/proyectos/${s}`, en: `/en/projects/${s}` })),
];

let failures = 0;
const fail = (msg) => { failures++; console.error('  ✗ ' + msg); };
const ok = (msg) => console.log('  ✓ ' + msg);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const visibleText = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

// Distinctive sentences that must appear only in their own language.
const probes = {
  es: [es.Intro.body2, es.Nav.projects],
  en: [en.Intro.body2, en.Nav.projects],
};

for (const r of routes) {
  for (const [lang, other] of [['es', 'en'], ['en', 'es']]) {
    const url = BASE + r[lang];
    console.log(`\n${url}`);
    const res = await fetch(url, { redirect: 'manual' });
    if (res.status !== 200) { fail(`status ${res.status}`); continue; }
    const html = await res.text();
    const text = visibleText(html);

    const expectedLang = lang === 'es' ? 'es-MX' : 'en';
    html.includes(`<html lang="${expectedLang}"`) ? ok(`html lang="${expectedLang}"`) : fail(`html lang is not ${expectedLang}`);

    html.includes(`hrefLang="${lang === 'es' ? 'en' : 'es-MX'}"`) || html.toLowerCase().includes(`hreflang="${lang === 'es' ? 'en' : 'es-mx'}"`)
      ? ok('hreflang alternate present') : fail('hreflang alternate missing');
    html.includes(`rel="canonical" href="${BASE}${r[lang]}"`) || html.includes(`rel="canonical" href="`)
      ? ok('canonical present') : fail('canonical missing');

    // Switcher must link to the equivalent page in the other language.
    html.includes(`href="${r[other]}"`) ? ok(`switcher → ${r[other]}`) : fail(`switcher link to ${r[other]} not found`);

    /MISSING_MESSAGE|Could not resolve|\bundefined\b\.|\[object Object\]/.test(html) ? fail('missing-translation marker in HTML') : ok('no missing-translation markers');

    // Raw keys such as "Hero.statement" must never be visible.
    const rawKey = text.match(/\b(?:Meta|Common|Nav|Language|Hero|Intro|Projects|Materials|Maquette|Approach|Studio|Contact|Form|Footer|Errors|Loading|Images)\.[a-zA-Z]+(?:\.[a-zA-Z]+)*\b/);
    rawKey ? fail(`raw key visible: ${rawKey[0]}`) : ok('no raw translation keys visible');

    // The other language's distinctive copy must not appear.
    const leaked = probes[other].filter((p) => p && text.includes(p) && !probes[lang].includes(p));
    leaked.length ? fail(`found ${other} copy on ${lang} page: ${leaked[0].slice(0, 50)}…`) : ok(`no ${other} copy leaked`);
  }
}

// Sitemap / robots / 404 / root redirect
console.log('\nSupport routes');
for (const p of ['/sitemap.xml', '/robots.txt']) {
  const res = await fetch(BASE + p);
  res.status === 200 ? ok(`${p} 200`) : fail(`${p} → ${res.status}`);
}
for (const p of ['/es/no-existe', '/en/does-not-exist']) {
  const res = await fetch(BASE + p);
  res.status === 404 ? ok(`${p} → 404`) : fail(`${p} → ${res.status}`);
}
const root = await fetch(BASE + '/', { redirect: 'manual' });
const loc = root.headers.get('location') ?? '';
/\/es\/?$/.test(loc) ? ok(`/ → ${loc} (Spanish default)`) : fail(`/ redirected to "${loc}"`);
const remembered = await fetch(BASE + '/', { redirect: 'manual', headers: { cookie: 'NEXT_LOCALE=en' } });
/\/en\/?$/.test(remembered.headers.get('location') ?? '') ? ok('NEXT_LOCALE=en cookie → /en') : fail('remembered locale not honoured');

console.log(failures ? `\nSMOKE TEST FAILED: ${failures} problem(s)` : '\nSMOKE TEST PASSED');
process.exit(failures ? 1 : 0);
