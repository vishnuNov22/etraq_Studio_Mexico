// Release gate for the bilingual experience. Run: npm run i18n:check
// Fails (exit 1) when es/en differ in keys, have empty values, mismatched ICU placeholders,
// or when source code references a translation key that does not exist.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const load = (l) => JSON.parse(readFileSync(path.join(root, 'messages', `${l}.json`), 'utf8'));
const es = load('es');
const en = load('en');

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
  );

const fes = new Map(flatten(es));
const fen = new Map(flatten(en));
const errors = [];

for (const k of fes.keys()) if (!fen.has(k)) errors.push(`missing in en.json: ${k}`);
for (const k of fen.keys()) if (!fes.has(k)) errors.push(`missing in es.json: ${k}`);

const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
for (const [k, v] of fes) {
  if (typeof v !== 'string' || !v.trim()) errors.push(`empty/non-string in es.json: ${k}`);
  const other = fen.get(k);
  if (other === undefined) continue;
  if (typeof other !== 'string' || !other.trim()) errors.push(`empty/non-string in en.json: ${k}`);
  if (placeholders(v) !== placeholders(other)) errors.push(`placeholder mismatch: ${k}`);
}

// Strings identical in both languages are suspicious (untranslated) unless allow-listed.
const allow = new Set([
  'Meta.siteName', 'Nav.studio', 'Language.es', 'Language.en', 'Common.projectCount',
  'Contact.instagram', 'Stats.area.value', 'Stats.states.value', 'Stats.projects.value', 'Stats.years.value',
  'Process.stages.s1.i3', 'Process.stages.s2.i2', 'Projects.items.vestidor.type', 'Studio.eyebrow',
  'Contact.whatsapp', 'Materials.terrazzo', 'Footer.rights', 'Errors.notFoundCode',
]);
const identical = [...fes].filter(([k, v]) => fen.get(k) === v && !allow.has(k));
for (const [k] of identical) errors.push(`identical text in es/en (untranslated?): ${k}`);

// Source scan: namespaces and static keys used via t('...').
const used = new Set();
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(f)) scan(readFileSync(p, 'utf8'), p);
  }
};
function scan(src, file) {
  const nsRe = /(?:useTranslations|getTranslations)\(\s*(?:\{[^}]*namespace:\s*)?['"]([\w.]+)['"]/g;
  const namespaces = [...src.matchAll(nsRe)].map((m) => m[1]);
  if (namespaces.length === 0) return;
  const keyRe = /\bt(?:\.rich|\.raw|\.has)?\(\s*['"]([\w.]+)['"]/g;
  for (const m of src.matchAll(keyRe)) {
    // A file with one namespace is checked precisely; with several, key must exist in at least one.
    const ok = namespaces.some((ns) => fes.has(`${ns}.${m[1]}`) || [...fes.keys()].some((k) => k.startsWith(`${ns}.${m[1]}.`)));
    used.add(m[1]);
    if (!ok) errors.push(`${path.relative(root, file)}: key "${m[1]}" not found in namespaces [${namespaces.join(', ')}]`);
  }
}
walk(path.join(root, 'src'));

if (errors.length) {
  console.error(`\ni18n check FAILED (${errors.length} problem${errors.length > 1 ? 's' : ''}):\n`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`i18n check passed: ${fes.size} keys in es.json and en.json, identical structure, ${used.size} static keys referenced in source.`);
