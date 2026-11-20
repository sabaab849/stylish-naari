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
import { fileURLToPath } from 'node:url';
import { featureItems, circleSig } from '../render/pdp.mjs';

const FF = process.env.FFMPEG, FP = process.env.FFPROBE;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'assets', 'data', 'products.json');
const OUTDIR = path.join(ROOT, 'assets', 'images', 'detail');
const MIN = 480, MIN_SMALL = 360, SIZE = 720;
const DRIVE = 'G:/My Drive/Stylish Naari – Saree Photography/';
fs.mkdirSync(OUTDIR, { recursive: true });

// size as ffmpeg decodes it: camera JPEGs stored sideways with EXIF Orientation 5–8 come out turned upright, so swap
const dims = (f) => {
  const out = execFileSync(FP, ['-v', 'error', '-show_entries', 'frame=width,height:frame_tags=Orientation', '-read_intervals', '%+#1', '-of', 'default=nw=1', f]).toString();
  const get = (k) => Number((out.match(new RegExp(`${k}=\\s*(\\d+)`)) || [])[1]);
  const [w, h, o] = [get('width'), get('height'), get('TAG:Orientation') || 1];
  return o >= 5 && o <= 8 ? [h, w] : [w, h];
};
const thumb = (f, vf) => execFileSync(FF, ['-v', 'error', '-nostdin', '-i', f, '-vf', `${vf ? vf + ',' : ''}scale=24:36,format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1e7 });
const pct = (v, d = 0.5) => (v == null || v === '' ? d : typeof v === 'number' ? v : parseFloat(v) / 100);

// images[].source → a local original, if one exists
function original(img) {
  const s = (img.source || '').replace(/\s*\((cropped|whole|pasted|sent|the client)[^)]*\)\s*$/i, '').trim();
  const tries = [];
  const m = s.match(/^Drive: (?:(.+?) \/ )?Original Product Photos [–-] Pendrive \/ (SN-\d{3})(.*)$/);
  if (m) {
    // no range named: look in both Banarasi ranges; "SN-045 – 03" may be the start of a longer name ("… – _SKS6624")
    const ranges = m[1] ? [m[1].replace(/ \/ /g, '/')] : ['01 – Banarasi/Premium Silk', '01 – Banarasi/Premium Semi-Silk'];
    for (const r of ranges) {
      const base = `${DRIVE}${r}/Original Product Photos – Pendrive`;
      if (!fs.existsSync(base)) continue;
      for (const d of fs.readdirSync(base)) if (d.startsWith(m[2] + ' ')) {
        const dir = path.join(base, d);
        for (const f of fs.readdirSync(dir)) {
          const stem = f.replace(/\.jpe?g$/i, '');
          if (stem !== f && (stem === m[2] + m[3] || stem.startsWith(m[2] + m[3] + ' '))) tries.push(path.join(dir, f));
        }
      }
    }
  }
  if (/^model photography\//.test(s)) tries.push(path.join(ROOT, '..', s));
  if (/^[^/:]+\.(png|jpe?g)$/i.test(s)) tries.push(path.join(ROOT, '..', 'model photography', s));
  return tries.find((f) => fs.existsSync(f));
}

// is the original the same picture as the site photo, and in which turn?
const cache = new Map();
function bestSource(img) {
  const site = path.join(ROOT, img.src.replace(/^\//, ''));
  if (cache.has(site)) return cache.get(site);
  const [W, H] = dims(site);
  let best = { file: site, vf: '', W, H };
  const orig = original(img);
  if (orig) {
    const [ow, oh] = dims(orig);
    const a = thumb(site, '');
    for (const [vf, tw, th] of [['', ow, oh], ['transpose=1', oh, ow], ['transpose=2', oh, ow], ['hflip,vflip', ow, oh]]) {
      if (Math.abs(tw / th - W / H) > 0.012 || tw <= W) continue;
      const b = thumb(orig, vf);
      let diff = 0; for (let i = 0; i < a.length; i++) diff += Math.abs(a[i] - b[i]);
      if (diff / a.length < 14) { best = { file: orig, vf, W: tw, H: th }; break; }
    }
  }
  cache.set(site, best);
  return best;
}

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
    report.push(`${String(side).padStart(5)}  ${p.slug} ${key}${src.file.includes('My Drive') || src.file.includes('model photography') ? '  (original)' : ''}`);
  }
}
// write onto a fresh read, so edits made meanwhile by other tools are kept
const fresh = JSON.parse(fs.readFileSync(FILE, 'utf8'));
for (const p of fresh.products) if (results[p.slug]) p.detailCircles = results[p.slug];
fs.writeFileSync(FILE, JSON.stringify(fresh, null, 2) + '\n');
console.log(report.sort().join('\n'));
console.log(`${report.length} circles cut`);
