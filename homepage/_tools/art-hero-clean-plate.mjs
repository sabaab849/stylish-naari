// "The Art of the Saree" hero (client, 23 Nov 2026): lifts the painted words off the client's artwork so they can be live
// HTML text (SEO, accessibility). Interim only — replace with the client's own text-free export when it arrives.
// Inside each word box, pixels noticeably brighter than their neighbourhood (the ivory lettering) are masked, the mask is
// grown 2 px, and the hole is filled by normalised convolution from the unmasked pixels around it (wide radius), plus a
// little grain so the fill matches the paint. Sarees are outside every box except where noted.
//   FFMPEG=<ffmpeg.exe> node _tools/art-hero-clean-plate.mjs   (from homepage/)
import { execFileSync } from 'node:child_process';
const FF = process.env.FFMPEG || 'ffmpeg';
const SRC = '../model photography/Art of the Saree hero (23 Nov 2026)/art-of-the-saree (no arrows).png';
const OUT = '../model photography/Art of the Saree hero (23 Nov 2026)/art-of-the-saree (clean plate, interim).png';
const W = 1672, H = 941;
const raw = execFileSync(FF, ['-v', 'error', '-i', SRC, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });
const px = new Float32Array(raw);
const lum = (i) => 0.299 * px[i * 3] + 0.587 * px[i * 3 + 1] + 0.114 * px[i * 3 + 2];
// boxes: [x0, y0, x1, y1, how much brighter than the local mean counts as lettering]
const BOXES = [
  [594, 604, 1074, 724, 22],   // THE ART / OF THE SAREE
  [636, 726, 1024, 766, 20],   // Five traditions…
  [636, 772, 1016, 832, 18],   // Painted, printed…
  [776, 830, 894, 848, 14],    // the short rule
  [134, 258, 252, 292, 30],    // Kalamkari
  [524, 106, 618, 140, 30],    // Banarasi
  [922, 246, 1024, 282, 30],   // Bandhani
  [1494, 116, 1612, 150, 30],  // Block Print
];
const box = (a, x0, y0, x1, y1, r) => { // mean over a (2r+1)² window via an integral image, limited to the region
  const w = x1 - x0, h = y1 - y0, I = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) I[(y + 1) * (w + 1) + x + 1] = a[y * w + x] + I[y * (w + 1) + x + 1] + I[(y + 1) * (w + 1) + x] - I[y * (w + 1) + x];
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const xa = Math.max(0, x - r), xb = Math.min(w, x + r + 1), ya = Math.max(0, y - r), yb = Math.min(h, y + r + 1);
    out[y * w + x] = I[yb * (w + 1) + xb] - I[ya * (w + 1) + xb] - I[yb * (w + 1) + xa] + I[ya * (w + 1) + xa];
  }
  return out;
};
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
for (const [bx0, by0, bx1, by1, th] of BOXES) {
  const P = 34; // work area around the box, to borrow surroundings
  const x0 = Math.max(0, bx0 - P), y0 = Math.max(0, by0 - P), x1 = Math.min(W, bx1 + P), y1 = Math.min(H, by1 + P), w = x1 - x0, h = y1 - y0;
  const L = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) L[y * w + x] = lum((y0 + y) * W + x0 + x);
  const ones = new Float32Array(w * h).fill(1);
  const mean = box(L, 0, 0, w, h, 9), cnt = box(ones, 0, 0, w, h, 9);
  let m = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const X = x0 + x, Y = y0 + y; if (X < bx0 || X >= bx1 || Y < by0 || Y >= by1) continue;
    const o = (Y * W + X) * 3, r = px[o], g = px[o + 1], b = px[o + 2];
    if (r - g > 40 && b - g > 25) continue; // never touch the magenta Bandhani saree
    const i = y * w + x; if (L[i] - mean[i] / cnt[i] > th || (L[i] > 175 && L[i] - mean[i] / cnt[i] > th * 0.5)) m[i] = 1;
  }
  for (let k = 0; k < 4; k++) { const n = m.slice(); for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; const o = ((y0 + y) * W + x0 + x) * 3; if ((m[i - 1] | m[i + 1] | m[i - w] | m[i + w]) && !(px[o] - px[o + 1] > 40 && px[o + 2] - px[o + 1] > 25)) n[i] = 1; } m = n; }
  const keep = new Float32Array(w * h); for (let i = 0; i < w * h; i++) keep[i] = 1 - m[i];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = ((y0 + y) * W + x0 + x) * 3; if (px[o] - px[o + 1] > 40 && px[o + 2] - px[o + 1] > 25) keep[y * w + x] = 0; } // and never borrow its colour for the fill
  const kb = box(keep, 0, 0, w, h, 20);
  for (let c = 0; c < 3; c++) {
    const ch = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) ch[y * w + x] = px[((y0 + y) * W + x0 + x) * 3 + c] * keep[y * w + x];
    const cb = box(ch, 0, 0, w, h, 20);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (!m[i]) continue;
      px[((y0 + y) * W + x0 + x) * 3 + c] = cb[i] / Math.max(kb[i], 1e-3); }
  }
  for (let i = 0; i < w * h; i++) if (m[i]) { const g = (rnd() - 0.5) * 9; const o = ((y0 + Math.floor(i / w)) * W + x0 + (i % w)) * 3; for (let c = 0; c < 3; c++) px[o + c] += g; }
}
const buf = Buffer.alloc(W * H * 3); for (let i = 0; i < buf.length; i++) buf[i] = Math.max(0, Math.min(255, Math.round(px[i])));
execFileSync(FF, ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-i', '-', OUT], { input: buf });
console.log('wrote', OUT);
