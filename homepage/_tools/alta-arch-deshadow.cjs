/* Alta arch photo (client, 23 Nov 2026: "remove the shadow completely"): the shadow cast across the niche wall (the upper
   niche, the wall right of the model, the shade of her hand and head) is removed by rebuilding the plain plaster: every wall
   pixel becomes the sunlit wall's own colour for that height (measured on the lit wall left of the model, so the natural
   top-to-bottom fall-off stays) plus the photo's own fine plaster grain (detail under 3 px). Wall pixels only: the saree,
   blouse, hair, jewellery and skin are keyed out (colour + brightness, with tight hand-drawn shapes round the face, hand and
   arm), so the saree colour never changes. The niche's right-hand return (x > 905) and the arch soffit keep their shading.
   Reads raw rgb24 (from ffmpeg), writes raw rgb24 and a grey mask preview.
   Usage: node alta-arch-deshadow.cjs in.rgb out.rgb mask.gray */
const fs = require('fs');
const [IN, OUT, MASK] = process.argv.slice(2);
const W = 1122, H = 1402, N = W * H;
const src = fs.readFileSync(IN);
const ell = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const inNiche = (x, y) => {
  if (x < 176 || x > 905 || y > 1203) return false;
  if (y >= 212) return true;
  return ell(x, y, 553, 212, 360, 160);
};
const near = (x, y) =>                                   // tight shapes round the skin (wall here only if clearly shadowed plaster)
  ell(x, y, 572, 292, 56, 92) || ell(x, y, 605, 340, 24, 34) || ell(x, y, 598, 395, 58, 48) ||
  ell(x, y, 505, 318, 40, 52) || ell(x, y, 420, 400, 125, 70) || ell(x, y, 660, 1350, 60, 40);
const wall = new Uint8Array(N);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!inNiche(x, y)) continue;
  const i = y * W + x, r = src[i * 3], g = src[i * 3 + 1] || 1, b = src[i * 3 + 2];
  const rg = r / g, bg = b / g, L = 0.3 * r + 0.59 * g + 0.11 * b;
  let ok = rg > 1.4 && rg < 2.2 && bg > 0.68 && bg < 0.9 && L > 90;
  // away from the model every niche pixel is plaster (this also takes the shaded soffit and the shadow's soft edge)
  const model = near(x, y) || (x > 425 && y > 375) || (x > 510 && x < 705 && y > 190);
  if (!model) ok = true;
  else if (near(x, y)) ok = rg > 1.48 && rg < 1.95 && bg > 0.765 && bg < 0.845 && L > 90; // skin is bluer-free (b/g .73) or pinker (neck r/g 1.36, hand b/g .86)
  wall[i] = ok ? 1 : 0;
}
// clean the mask: drop isolated specks (open) and fill pinholes (close), radius 1
const morph = (a, keepIfAll) => { const o = new Uint8Array(N); for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  const i = y * W + x; let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += a[i + dy * W + dx];
  o[i] = keepIfAll ? (s === 9 ? 1 : 0) : (s > 0 ? 1 : 0); } return o; };
const m = morph(morph(morph(morph(wall, true), false), false), true);
function blur(vals, rad) {
  const I = new Float64Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) { let s = 0; for (let x = 0; x < W; x++) { s += vals[y * W + x]; I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + s; } }
  const o = new Float64Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const x0 = Math.max(0, x - rad), x1 = Math.min(W, x + rad + 1), y0 = Math.max(0, y - rad), y1 = Math.min(H, y + rad + 1);
    o[y * W + x] = I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0];
  }
  return o;
}
// lit-wall colour per row, from x 190–400 (sunlit), rows above 240 take row 240's colour; smoothed over ±40 rows
const T = [0, 1, 2].map(() => new Float64Array(H));
const prof = (c, y) => { let s = 0, n = 0; for (let x = 190; x < 400; x++) { const i = y * W + x; if (m[i]) { s += src[i * 3 + c]; n++; } } return n > 20 ? s / n : null; };
for (let c = 0; c < 3; c++) {
  const raw = new Float64Array(H); let last = null;
  for (let y = H - 1; y >= 0; y--) { const v = y >= 240 ? prof(c, y) : null; if (v != null) last = v; raw[y] = last; }
  for (let y = 0; y < 240; y++) raw[y] = raw[240];
  for (let y = 0; y < H; y++) { let s = 0, n = 0; for (let d = -40; d <= 40; d++) { const yy = y + d; if (yy >= 0 && yy < H && raw[yy] != null) { s += raw[yy]; n++; } } T[c][y] = s / n; }
}
// feather towards the arch curve so the rebuilt wall fades into the soffit's own shading (no hard, stepped edge)
const fe = new Float64Array(N);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  let f = 1;
  if (y < 212) { const q = ((x - 553) / 360) ** 2 + ((y - 212) / 160) ** 2; f = Math.max(0, Math.min(1, ((1 - Math.sqrt(q)) * 160) / 18)); }
  fe[y * W + x] = f;
}
const mf = Float64Array.from(m), mb = blur(mf, 3);
const soft = blur(mf, 2), sc = blur(new Float64Array(N).fill(1), 2);
const out = Buffer.from(src), mk = Buffer.alloc(N);
for (let c = 0; c < 3; c++) {
  const v = new Float64Array(N); for (let i = 0; i < N; i++) v[i] = mf[i] * src[i * 3 + c];
  const lb = blur(v, 3);
  for (let i = 0; i < N; i++) {
    const a = (m[i] ? 1 : (soft[i] / sc[i]) * 0.6) * fe[i]; if (!a) continue;
    const y = (i / W) | 0, grain = m[i] && mb[i] > 0 ? Math.max(-3, Math.min(3, src[i * 3 + c] - lb[i] / mb[i])) : 0; // grain only, never a shadow edge
    const wallPx = T[c][y] + grain;
    out[i * 3 + c] = Math.max(0, Math.min(255, Math.round(src[i * 3 + c] * (1 - a) + wallPx * a)));
    if (c === 0) mk[i] = Math.round(a * 255);
  }
}
fs.writeFileSync(OUT, out); fs.writeFileSync(MASK, mk);
console.log('lit wall top', [0, 1, 2].map((c) => Math.round(T[c][240])).join(' '), ' bottom', [0, 1, 2].map((c) => Math.round(T[c][1180])).join(' '));
