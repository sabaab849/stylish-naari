/* "In detail" circles (PDP): the first three (fabric, border, motif) are cut from the saree's own photographs,
   never from the AI model photo or AI close-ups (client, 19 Nov 2026). The fourth, "As styled", stays the model shoot.
   Writes products.json → features: { fabric, border, motif } = { img, ox, oy, op, s } for render/pdp.mjs → renderFeatures.
   Each spec is [image index, focal x, focal y, zoom], focal point as a share of the photo; the circle is centred on it.
   Sarees with no real photograph yet (AI-only, or a real photoshoot) are not listed and keep their old circles.
   Run from homepage/:  node _tools/set-feature-crops.cjs */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SPECS = {
  kajal:   { fabric: [2, .5, .35, 1.8], border: [3, .55, .8, 1.8], motif: [1, .4, .2, 2.0] },
  panna:   { fabric: [2, .5, .5, 1.3], border: [3, .7, .93, 2.0], motif: [3, .2, .85, 2.4] },
  phalsa:  { fabric: [2, .5, .3, 1.3], border: [3, .5, .1, 2.0], motif: [2, .55, .72, 2.6] },
  moonga:  { fabric: [2, .35, .45, 1.5], border: [3, .5, .9, 2.0], motif: [2, .3, .6, 2.5] },
  chameli: { fabric: [2, .5, .75, 1.3], border: [3, .5, .88, 2.0], motif: [2, .4, .32, 2.6] },
  kasni:   { fabric: [2, .5, .6, 1.5], border: [3, .5, .82, 1.8], motif: [3, .7, .14, 2.4] },
  mehendi: { fabric: [3, .3, .25, 1.6], border: [2, .7, .2, 2.0], motif: [2, .3, .7, 2.8] },
  kamal:   { fabric: [3, .5, .85, 1.6], border: [2, .5, .2, 2.2], motif: [2, .5, .45, 2.6] },
  kairi:   { fabric: [2, .55, .15, 2.0], border: [2, .1, .55, 2.2], motif: [2, .4, .42, 2.6] }, // Nov 19 close-up (pink buti, zari border, meenakari)
  neel:    { fabric: [2, .55, .42, 2.0], border: [2, .93, .25, 2.4], motif: [2, .13, .11, 2.8] }, // Nov 19 close-up (pallu, border, lotus buti)
  bagh:    { fabric: [1, .7, .42, 2.4], border: [1, .3, .7, 2.2], motif: [1, .31, .4, 3.2] },
  rangoli: { fabric: [1, .5, .3, 1.8], border: [1, .55, .72, 2.2], motif: [1, .6, .14, 3.2] },
  saanjh:  { fabric: [1, .45, .4, 2.2], border: [1, .72, .78, 2.8], motif: [1, .45, .82, 3.0] },
  sindoor: { fabric: [1, .45, .15, 2.2], border: [1, .7, .78, 2.2], motif: [1, .35, .5, 3.2] },
  kahani:  { fabric: [1, .3, .35, 2.4], border: [1, .5, .95, 2.0], motif: [1, .52, .62, 2.8] },
  leela:   { fabric: [1, .35, .3, 2.2], border: [1, .9, .5, 2.4], motif: [1, .55, .65, 2.6] },
  megh:    { fabric: [1, .5, .25, 2.6], border: [1, .5, .75, 2.0], motif: [1, .4, .5, 2.6] },
  hariyali: { fabric: [3, .3, .4, 1.6] }, // green body with buti (product photo); border and motif keep their real-photo crops
};
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
function build(p, [n, fx, fy, s]) {
  const img = p.images[n];
  if (!img) throw new Error(`${p.slug}: no image ${n}`);
  const a = img.height / img.width; // square circle, object-fit: cover
  const wx = a >= 1 ? 1 : a, wy = a >= 1 ? 1 / a : 1; // share of the photo the square shows
  const axis = (f, w) => { // object-position %, focal point inside the shown square (0…1)
    const top = clamp(f - w / 2, 0, 1 - w);
    return [w >= 1 ? 50 : (top / (1 - w)) * 100, (f - top) / w];
  };
  const [px, bx] = axis(fx, wx), [py, by] = axis(fy, wy);
  const origin = (c) => Math.round(clamp((c - 0.5 / s) / (1 - 1 / s), 0, 1) * 100) + '%';
  return { img: n, s, ox: origin(bx), oy: origin(by), op: `${Math.round(px)}% ${Math.round(py)}%` };
}
let n = 0;
for (const [slug, spec] of Object.entries(SPECS)) {
  const p = data.products.find((x) => x.slug === slug);
  if (!p) { console.log('missing', slug); continue; }
  p.features = Object.fromEntries(Object.entries(spec).map(([k, v]) => [k, build(p, v)]));
  n++;
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`features set on ${n} sarees`);
