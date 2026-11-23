// "The Art of the Saree" hero (client, 23 Nov 2026): replaces the AI-made Bandhani figure (Jamuni) in the interim clean
// plate with a real photograph, Saagar (assets/images/saagar-n2.jpg, real shoot, teal Banarasi with a coral pallu).
// Layers, back to front:
//   1. the clean plate with Jamuni's area repainted from its surroundings (normalised convolution + grain)
//   2. Saagar, scaled ×0.32 (640×960, head where Jamuni's was), cut out along a hand-traced outline (feathered 1.5 px),
//      lightly matched to the scene's light (≈ -12 % exposure, warmer, darker towards the floor; prints untouched)
//   3. the block-print figure (Mehrab) put back on top from the original artwork, so Saagar's pallu sweeps behind her
//      (this also hides where the photo's own frame cuts the pallu off)
// Polygons: Saagar in % of her photo; Jamuni and Mehrab in px of the 1672×941 artwork.
//   FFMPEG=<ffmpeg.exe> node _tools/art-hero-swap-bandhani.mjs   (from homepage/), then node _tools/art-hero-images.mjs
import { execFileSync } from 'node:child_process';
const FF = process.env.FFMPEG || 'ffmpeg';
const DIR = '../model photography/Art of the Saree hero (23 Nov 2026)/';
const PLATE = DIR + 'art-of-the-saree (clean plate, interim).png';
const OUT = DIR + 'art-of-the-saree (clean plate, Saagar, interim).png';
const W = 1672, H = 941;
const rgb = (f, vf = []) => new Float32Array(execFileSync(FF, ['-v', 'error', '-i', f, ...vf, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 }));
const art = rgb(PLATE);
const orig = art.slice(); // for putting Mehrab back

// rasterise a polygon (4×4 supersampled coverage) into a w×h alpha map
function poly(pts, w, h) {
  const a = new Float32Array(w * h), S = 4;
  let y0 = Infinity, y1 = -Infinity; for (const [, y] of pts) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  for (let y = Math.max(0, Math.floor(y0)); y < Math.min(h, Math.ceil(y1) + 1); y++) for (let sy = 0; sy < S; sy++) {
    const yy = y + (sy + 0.5) / S, xs = [];
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > yy) !== (yj > yy)) xs.push(xi + ((yy - yi) / (yj - yi)) * (xj - xi)); }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) for (let sx = 0; sx < w * S; sx++) { const xx = (sx + 0.5) / S; if (xx < xs[k] || xx >= xs[k + 1]) continue; a[y * w + Math.floor(xx)] += 1 / (S * S); }
  }
  return a;
}
function blur(a, w, h, r) { // separable box blur, radius r (two passes ≈ soft feather)
  for (let pass = 0; pass < 2; pass++) {
    const t = new Float32Array(w * h);
    for (let y = 0; y < h; y++) { let s = 0; for (let x = -r; x <= r; x++) s += a[y * w + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) { t[y * w + x] = s / (2 * r + 1); s += a[y * w + Math.min(w - 1, x + r + 1)] - a[y * w + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let s = 0; for (let y = -r; y <= r; y++) s += t[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) { a[y * w + x] = s / (2 * r + 1); s += t[Math.min(h - 1, y + r + 1) * w + x] - t[Math.max(0, y - r) * w + x]; } }
  }
  return a;
}
const off = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);

// ── 1. repaint Jamuni's area (traced in the 760×800 crop at 912,141, generous) ──
const JAMUNI = off([[205, 22], [252, 26], [284, 58], [290, 120], [280, 162], [305, 192], [385, 248], [405, 320], [425, 420], [460, 500], [510, 558], [570, 608], [640, 658], [700, 728], [718, 800],
  [112, 800], [102, 650], [97, 520], [92, 442], [110, 432], [20, 436], [16, 372], [78, 356], [82, 278], [86, 212], [102, 192], [146, 186], [160, 150], [146, 100], [162, 52]], 912, 141);
const mj = poly(JAMUNI, W, H); for (let i = 0; i < mj.length; i++) mj[i] = mj[i] > 0.02 ? 1 : 0;
{ const keep = new Float32Array(W * H); for (let i = 0; i < keep.length; i++) keep[i] = 1 - mj[i];
  const kb = blur(keep.slice(), W, H, 40);
  for (let c = 0; c < 3; c++) { const ch = new Float32Array(W * H); for (let i = 0; i < ch.length; i++) ch[i] = art[i * 3 + c] * keep[i];
    const cb = blur(ch, W, H, 40); for (let i = 0; i < ch.length; i++) if (mj[i]) art[i * 3 + c] = cb[i] / Math.max(kb[i], 1e-3); }
  let s = 11; for (let i = 0; i < mj.length; i++) if (mj[i]) { s = (s * 16807) % 2147483647; const g = (s / 2147483647 - 0.5) * 10; for (let c = 0; c < 3; c++) art[i * 3 + c] += g; } }

// ── 2. Saagar ──
const SW = 640, SH = 960, SX = 894, SY = 29;
const sg = rgb('assets/images/saagar-n2.jpg', ['-vf', `scale=${SW}:${SH}:flags=lanczos`]);
const SAAGAR = [[40, 14.2], [45, 15], [48.5, 18], [50, 22], [49.5, 26], [48, 30], [51, 32], [56, 34], [60, 37], [63, 42], [68, 48], [75, 52], [85, 54], [92, 55], [100, 55.5],
  [100, 100], [18, 100], [17.5, 80], [18, 66], [14, 60], [11, 55], [10.5, 50], [11, 44], [11.5, 38], [13, 34], [18, 32.5], [24, 31.5], [30, 29.5], [31.5, 26], [31, 21], [32.5, 17], [36, 15]]
  .map(([x, y]) => [(x / 100) * SW, (y / 100) * SH]);
const ms = blur(poly(SAAGAR, SW, SH), SW, SH, 1);
for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
  const X = SX + x, Y = SY + y; if (X < 0 || X >= W || Y < 0 || Y >= H) continue;
  const a = ms[y * SW + x]; if (a <= 0) continue;
  const floor = 1 - 0.22 * Math.max(0, (Y / H - 0.55) / 0.45); // the scene darkens towards the floor
  const i = (y * SW + x) * 3, o = (Y * W + X) * 3;
  const gr = [sg[i] * 0.9 * 1.02, sg[i + 1] * 0.88, sg[i + 2] * 0.88 * 0.94].map((v) => 255 * Math.pow(v / 255, 1.06) * floor);
  for (let c = 0; c < 3; c++) art[o + c] = art[o + c] * (1 - a) + gr[c] * a;
}

// ── 3. Mehrab back on top (her visible area in the original, traced in the same crop) ──
const MEHRAB = off([[330, -2], [762, -2], [762, 802], [708, 802], [692, 730], [632, 660], [562, 610], [502, 560], [452, 500], [424, 420], [426, 300], [426, 200], [428, 100], [432, 56], [382, 40], [346, 20]], 912, 141);
const mm = blur(poly(MEHRAB, W, H), W, H, 1);
for (let i = 0; i < mm.length; i++) if (mm[i] > 0) for (let c = 0; c < 3; c++) art[i * 3 + c] = art[i * 3 + c] * (1 - mm[i]) + orig[i * 3 + c] * mm[i];

const buf = Buffer.alloc(W * H * 3); for (let i = 0; i < buf.length; i++) buf[i] = Math.max(0, Math.min(255, Math.round(art[i])));
execFileSync(FF, ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-i', '-', OUT], { input: buf });
console.log('wrote', OUT);
