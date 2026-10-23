// Converts originals in /assets-src to optimised WebP in /public/images and
// writes src/data/image-meta.json (dimensions + tiny blur placeholders).
// Run: node scripts/prepare-images.mjs   (requires `sharp`, installed with the project)
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const src = path.resolve('assets-src');
const out = path.resolve('public/images');
await mkdir(out, { recursive: true });

const meta = {};
for (const file of (await readdir(src)).filter((f) => /\.(png|jpe?g)$/i.test(f))) {
  const key = path.parse(file).name;
  const img = sharp(path.join(src, file));
  const { width, height } = await img.metadata();
  // The supplied images are small screenshots (~780px). Upscale 2x with Lanczos + gentle sharpening so
  // they stay crisp on retina screens. Replace assets-src/* with the studio's originals when available.
  const scale = width < 400 ? 3 : width < 1600 ? 2 : 1;
  const outW = width * scale;
  await img
    .clone()
    .resize({ width: outW, kernel: 'lanczos3' })
    .sharpen({ sigma: 0.9, m1: 0.8, m2: 1.6 })
    .webp({ quality: 90, effort: 5 })
    .toFile(path.join(out, `${key}.webp`));
  const blur = await img.clone().resize(14).jpeg({ quality: 55 }).toBuffer();
  meta[key] = { width: outW, height: Math.round(height * scale), blur: `data:image/jpeg;base64,${blur.toString('base64')}` };
  console.log(key, width, height);
}

// 1200x630 social-sharing image (landscape crop of the coffee-bar photograph)
await sharp(path.join(src, 'cafe.png'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 84 })
  .toFile(path.join(out, 'og.jpg'));

await writeFile(path.resolve('src/data/image-meta.json'), JSON.stringify(meta, null, 2));
