// Paints the wall behind "The Art of the Saree" (homepage hero slide 2), after the client's inspiration board
// (23 Nov 2026): a weathered fresco — deep teal plaster flaking to ochre and gold top left, a slate-blue bay with a
// painted arch behind the second figure, a tall curved gold panel in the centre right, maroon with an arch on the
// right, a pale strip at the far edge — all mottled, flecked and grained like old pigment on lime plaster.
// Dependency-free (procedural noise), writes a PPM and converts it with ffmpeg:
//   FFMPEG=<ffmpeg.exe> node _tools/paint-craft-wall.mjs   (from homepage/) → assets/images/craft-hero/wall.jpg
import { writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const W = 2400, H = 1350;
// ── value noise + fbm ──
const P = new Uint8Array(512); { const p = [...Array(256).keys()]; let s = 1234567;
  for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
const rnd = (x, y) => P[(P[x & 255] + y) & 255] / 255;
const sm = (t) => t * t * (3 - 2 * t);
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
  const a = rnd(xi, yi), b = rnd(xi + 1, yi), c = rnd(xi, yi + 1), d = rnd(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
function fbm(x, y, oct = 6) { let v = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { v += a * vnoise(x * f, y * f); n += a; a *= 0.5; f *= 2.03; } return v / n; }
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const step = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const TEAL = hex('#1E3A45'), TEAL_L = hex('#3E6470'), SLATE = hex('#24384A'), OCHRE = hex('#B8873A'), GOLD = hex('#C99A48'),
  GOLD_D = hex('#7A5424'), UMBER = hex('#3A2618'), MAROON = hex('#6B2226'), MAROON_D = hex('#45161A'), PALE = hex('#CDBF9E');

const buf = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y++) {
  const v = y / H;
  for (let x = 0; x < W; x++) {
    const u = x / W;
    // domain-warped noise fields
    const wx = fbm(u * 3 + 11, v * 3 + 7, 4) - 0.5, wy = fbm(u * 3 + 3, v * 3 + 19, 4) - 0.5;
    const big = fbm(u * 2.2 + wx * 1.2, v * 2.2 + wy * 1.2, 5);        // large blotches
    const mid = fbm(u * 9 + wx * 2, v * 9 + wy * 2, 5);                  // mottling
    const fine = fbm(u * 60, v * 60, 3);                                 // flecks
    const brush = fbm(u * 3.5 + wx, v * 26 + wy * 3, 4);                 // vertical brush strokes
    // ── base: teal plaster, lighter washes
    let c = mix(TEAL, TEAL_L, step(0.45, 0.8, big) * 0.7);
    // slate-blue bay behind the second figure, with a painted arch
    const bay = step(0.12, 0.2, u) * (1 - step(0.44, 0.52, u + (v - 0.5) * 0.04));
    c = mix(c, SLATE, bay * 0.75);
    const ax = (u - 0.32) / 0.13, ay = (v - 0.62) / 0.66;                // arch: semicircle top on a rectangle
    const archR = ay < 0 ? Math.hypot(ax, ay * 1.15) : Math.abs(ax);
    const archLine = Math.exp(-Math.pow((archR - 1) / 0.035, 2)) * (v < 1.02 ? 1 : 0);
    const archLine2 = Math.exp(-Math.pow((archR - 0.9) / 0.02, 2));
    // ochre/gold flaking top left (thresholded noise: paint lost to the gold ground)
    const tl = (1 - step(0.05, 0.3, u * 0.9 + v * 0.6));
    const flake = step(0.44, 0.58, big + (mid - 0.5) * 0.7) * tl * 0.9;
    c = mix(c, mix(OCHRE, GOLD, mid), flake);
    const pat = fbm(u * 18 + wx * 3 + 30, v * 18 + wy * 3 + 30, 5);
    const patina = step(0.6, 0.7, pat) * (0.18 + 0.32 * (1 - step(0.1, 0.4, u)) + 0.15 * (1 - step(0.2, 0.5, v)));
    c = mix(c, mix(GOLD_D, OCHRE, mid), clamp(patina) * (1 - bay * 0.55));
    // tall curved gold panel, centre right (left edge sweeps in an S, right edge leans)
    const le = 0.53 + 0.05 * Math.sin(v * 3.1 + 0.6) - 0.03 * v, re = 0.79 - 0.02 * Math.sin(v * 2.4);
    const panel = step(le - 0.012, le + 0.012, u + (mid - 0.5) * 0.02) * (1 - step(re - 0.01, re + 0.01, u + (mid - 0.5) * 0.02));
    let g = mix(GOLD, OCHRE, step(0.35, 0.75, big));
    g = mix(g, GOLD_D, step(0.55, 0.75, mid) * 0.6);
    g = mix(g, UMBER, step(0.7, 0.9, v + (big - 0.5) * 0.4) * 0.55);    // darker towards the floor
    g = mix(g, mix(TEAL_L, UMBER, mid), step(0.62, 0.78, big + (brush - 0.5) * 0.4) * 0.35);
    c = mix(c, g, panel);
    // maroon wall on the right, with an arch and a pale strip at the edge
    const mar = step(0.77, 0.8, u + (mid - 0.5) * 0.02);
    let m = mix(MAROON, MAROON_D, step(0.4, 0.8, big) * 0.8);
    const bx = (u - 0.89) / 0.085, by = (v - 0.42) / 0.5;
    const archB = by < 0 ? Math.hypot(bx, by * 1.2) : Math.abs(bx);
    m = mix(m, MAROON_D, (1 - step(0.92, 1.0, archB)) * 0.55);
    m = mix(m, mix(TEAL, TEAL_L, mid), step(0.7, 0.8, big + (mid - 0.5) * 0.5) * 0.3);   // teal showing through
    c = mix(c, m, mar);
    c = mix(c, mix(PALE, OCHRE, mid * 0.6), step(0.965, 0.975, u) * (1 - step(0.92, 1, v)));
    // arch lines painted over (light gold-teal), faded and broken by the flaking
    const brk = step(0.35, 0.55, mid);
    c = mix(c, hex('#8FA59A'), archLine * 0.42 * brk * (1 - panel));
    c = mix(c, hex('#B39A62'), archLine2 * 0.25 * brk * (1 - panel));
    // ── weathering: uneven pigment, dark stains, pale flecks and scratches
    let lum = 0.8 + 0.42 * (mid - 0.5) + 0.3 * (big - 0.5) + 0.2 * (brush - 0.5);
    c = c.map((ch) => ch * lum);
    const stain = step(0.55, 0.85, fbm(u * 4 + 40, v * 4 + 40, 5)) * 0.32;
    c = mix(c, UMBER, stain);
    const fleck = step(0.72, 0.78, fine) * 0.2;
    c = mix(c, mix(PALE, GOLD, 0.4), fleck * (0.4 + flake * 0.6));
    const speck = step(0.78, 0.82, fbm(u * 90 + 9, v * 90 + 9, 2)) * 0.25;
    const weave = (Math.sin(x * 1.9) * Math.sin(y * 1.7)) * 3; // faint canvas
    c = mix(c, UMBER, speck);
    // floor shadow and a soft vignette
    const vig = 1 - 0.55 * step(0.62, 1.0, v) - 0.25 * Math.pow(Math.abs(u - 0.5) * 2, 3);
    const grain = (rnd(x * 7 + y, y * 13 + x) - 0.5) * 16 + weave;
    const o = (y * W + x) * 3;
    for (let k = 0; k < 3; k++) buf[o + k] = clamp(c[k] * vig + grain, 0, 255);
  }
}
const ppm = 'assets/images/craft-hero/wall.ppm';
writeFileSync(ppm, Buffer.concat([Buffer.from(`P6\n${W} ${H}\n255\n`), buf]));
execFileSync(process.env.FFMPEG || 'ffmpeg', ['-v', 'error', '-y', '-i', ppm, '-q:v', '3', 'assets/images/craft-hero/wall.jpg']);
unlinkSync(ppm);
console.log('wrote assets/images/craft-hero/wall.jpg');
