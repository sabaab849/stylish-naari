// Gallery close-up slides, cut sharp (client, 23 Nov 2026: "make sure the 3rd and 4th image isn't pixelated, maintain high
// quality in all product images"). The PDP gallery shows some slides as CSS crops of a photo (the border and fabric close-ups:
// crops.border / swatch / borderDetail, zoomed up to 2.4×), which can leave only ~300–500 source pixels across a 660px frame.
// This cuts each such slide into its own file, assets/images/slides/<slug>-<key>.jpg, at the gallery frame's shape and
// OUT_W pixels wide, and records it in products.json → slideCuts[key] = { src, w, h, from, px }:
//  - source: the sharpest copy on disk (./originals.mjs: the Drive / model photography original when it is the same picture)
//  - never fewer than FLOOR source pixels across the frame: where a crop zooms in deeper than the photo can hold, the view
//    widens around the same spot (zoomed out) instead of going soft. px = source pixels actually used.
//  - scaled with Lanczos; a light unsharp mask only when it had to be enlarged.
// render/pdp.mjs → renderGallery uses a cut only while `from` matches the slide's crop and frame (slideSig).
// Run from homepage/ after any crop, photo or first-photo change:
//   FFMPEG=<ffmpeg.exe> FFPROBE=<ffprobe.exe> node _tools/make-slide-cuts.mjs [slug …]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { galleryViews, slideSig } from '../render/pdp.mjs';
import { FF, ROOT, bestSource, isOriginal } from './originals.mjs';

const FILE = path.join(ROOT, 'assets', 'data', 'products.json');
const OUTDIR = path.join(ROOT, 'assets', 'images', 'slides');
const OUT_W = 1320; // the gallery photo is at most 660 CSS px wide: sharp on 2× screens
fs.mkdirSync(OUTDIR, { recursive: true });
const pct = (v, d = 0.5) => (v == null || v === '' ? d : typeof v === 'number' ? v : parseFloat(v) / 100);
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

const only = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const results = {};
const report = [];
for (const p of data.products) {
  if (p.redirect || (only.length && !only.includes(p.slug))) continue;
  const { views, rw, rh } = galleryViews(p);
  const r = rw / rh; // frame width / height
  for (const v of views) {
    if (!v.cropKey) continue;
    const src = bestSource(v.img);
    const { W, H } = src;
    // The page: object-fit cover in a 1 × 1/r box at object-position op, then scale(s) about (ox, oy) of the box.
    const s = v.crop.s ?? 1;
    const [px, py] = (v.crop.op || '50% 50%').split(/\s+/).map((x) => pct(x));
    const k = Math.max(1 / W, 1 / r / H); // box units per source pixel
    const offX = (1 - W * k) * px, offY = (1 / r - H * k) * py;
    const ox = pct(v.crop.ox), oy = pct(v.crop.oy) / r;
    const viewW = 1 / s / k; // the page's view, in source pixels (its height is viewW / r)
    const vx = (ox - ox / s - offX) / k, vy = (oy - oy / s - offY) / k;
    // floor: 600 px across (the frame is at most 660 CSS px wide, so at most ~1.1× enlarged on ordinary screens); a photo too small
    // for that keeps at least a 1.25× close-up (80% of its width) rather than turning into the whole photo again
    const full = Math.min(W, H * r);
    const floor = Math.min(600, full * 0.8);
    const w = Math.round(Math.max(viewW, floor)), h = Math.round(w / r);
    // centred on the page's view, kept inside the photo
    const x = Math.round(clamp(vx + viewW / 2 - w / 2, 0, W - w));
    const y = Math.round(clamp(vy + viewW / r / 2 - h / 2, 0, H - h));
    const outH = Math.round(OUT_W / r);
    const out = `${p.slug}-${v.cropKey}.jpg`;
    const vf = [src.vf, `crop=${w}:${h}:${x}:${y}`, `scale=${OUT_W}:${outH}:flags=lanczos`, w < OUT_W ? 'unsharp=5:5:0.4' : ''].filter(Boolean).join(',');
    execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', src.file, '-vf', vf, '-q:v', '2', path.join(OUTDIR, out)]);
    (results[p.slug] ||= {})[v.cropKey] = { src: `/assets/images/slides/${out}`, w: OUT_W, h: outH, from: slideSig(v, rw, rh), px: w };
    report.push(`${String(w).padStart(5)}  ${p.slug} ${v.cropKey} (was ${Math.round(viewW)})${isOriginal(src.file) ? '  (original)' : ''}`);
  }
}
// write onto a fresh read, so edits made meanwhile by other tools are kept
const fresh = JSON.parse(fs.readFileSync(FILE, 'utf8'));
for (const p of fresh.products) if (!p.redirect && (!only.length || only.includes(p.slug))) {
  if (results[p.slug]) p.slideCuts = results[p.slug]; else delete p.slideCuts;
}
fs.writeFileSync(FILE, JSON.stringify(fresh, null, 2) + '\n');
console.log(report.sort().join('\n'));
console.log(`${report.length} slides cut`);
