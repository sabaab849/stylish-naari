// "In detail" circles, cut sharp (client, 20 Nov 2026: "don't let it be blurry or bad quality … scale them if needed").
// For every PDP circle (fabric, border, motif, as styled) this cuts the exact view the page shows into its own 720×720 JPEG,
// assets/images/detail/<slug>-<key>.jpg, and records it in products.json → detailCircles[key] = { src, from, px }:
//  - source: the sharpest copy on disk. The site photo, or its original (images[].source → Drive pendrive folder on G:, or
//    model photography/…) when that original is the same picture (checked by comparing thumbnails, in any of four turns).
//  - never fewer than MIN source pixels across the circle: where a crop zooms in deeper than the photo can hold, the view
//    widens around the same centre (zoomed out) instead of going soft. px = source pixels actually used.
//  - scaled to 720 with Lanczos; a light unsharp mask only when it had to be enlarged.
// render/pdp.mjs uses a cut only while `from` still matches the circle's crop (circleSig), so re-aiming a crop later falls
// back to the live crop until this is run again. Run from homepage/ after any crop or photo change:
//   FFMPEG=<ffmpeg.exe> FFPROBE=<ffprobe.exe> node _tools/make-detail-circles.mjs [slug …]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { featureItems, circleSig } from '../render/pdp.mjs';
import { FF, ROOT, bestSource, isOriginal } from './originals.mjs'; // sharpest copy on disk (shared with make-slide-cuts.mjs)

const FILE = path.join(ROOT, 'assets', 'data', 'products.json');
const OUTDIR = path.join(ROOT, 'assets', 'images', 'detail');
const MIN = 480, MIN_SMALL = 360, SIZE = 720;
fs.mkdirSync(OUTDIR, { recursive: true });
const pct = (v, d = 0.5) => (v == null || v === '' ? d : typeof v === 'number' ? v : parseFloat(v) / 100);

const only = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const results = {};
const report = [];
for (const p of data.products) {
  if (only.length && !only.includes(p.slug)) continue;
  for (const { key, crop } of featureItems(p)) {
    const img = p.images[crop.img ?? 0];
    if (!img) continue;
    const src = bestSource(img);
    const { W, H } = src;
    // the page's view: object-fit cover in a square, object-position op, then scale(s) about (ox, oy)
    const s = crop.s ?? 1;
    const [px, py] = (crop.op || '50% 50%').split(/\s+/).map((v) => pct(v));
    const m = Math.min(W, H);
    const offX = (1 - W / m) * px, offY = (1 - H / m) * py; // image offset in box units (box = 1)
    const ox = pct(crop.ox), oy = pct(crop.oy);
    const view = m / s; // the page's view, in source pixels
    const vx = (ox - ox / s - offX) * m, vy = (oy - oy / s - offY) * m;
    // Zoom out rather than go soft. The wider window still holds the whole original view, and leans towards the middle of
    // the photo (where the saree is), so a border at the saree's edge isn't framed by empty backdrop.
    // small photos (WhatsApp shots, ~700px) may zoom a little deeper, so their circles still read as close-ups
    const floor = Math.min(MIN, Math.max(MIN_SMALL, m * 0.45), m);
    const side = Math.round(Math.max(view, floor));
    const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
    // centred on the original view, nudged a quarter of the window towards the photo's middle (so the subject stays well
    // inside the circle, with saree rather than backdrop around it); the original view always stays inside
    const place = (v, len) => {
      const c = v + view / 2;
      const nudge = Math.sign(len / 2 - c) * Math.min(Math.abs(len / 2 - c), (side - view) / 4);
      return Math.round(clamp(clamp(c + nudge - side / 2, v + view - side, v), 0, len - side));
    };
    const x = place(vx, W), y = place(vy, H);
    const out = `${p.slug}-${key}.jpg`;
    const vf = [src.vf, `crop=${side}:${side}:${x}:${y}`, `scale=${SIZE}:${SIZE}:flags=lanczos`, side < SIZE ? 'unsharp=5:5:0.5' : ''].filter(Boolean).join(',');
    execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', src.file, '-vf', vf, '-q:v', '2', path.join(OUTDIR, out)]);
    (results[p.slug] ||= {})[key] = { src: `/assets/images/detail/${out}`, from: circleSig(p, crop), px: side };
    report.push(`${String(side).padStart(5)}  ${p.slug} ${key}${isOriginal(src.file) ? '  (original)' : ''}`);
  }
}
// write onto a fresh read, so edits made meanwhile by other tools are kept
const fresh = JSON.parse(fs.readFileSync(FILE, 'utf8'));
for (const p of fresh.products) if (results[p.slug]) p.detailCircles = results[p.slug];
fs.writeFileSync(FILE, JSON.stringify(fresh, null, 2) + '\n');
console.log(report.sort().join('\n'));
console.log(`${report.length} circles cut`);
