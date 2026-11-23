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
  kajal:   { fabric: [3, .6, .2, 1.8], border: [3, .62, .62, 2.0], motif: [3, .45, .5, 2.2] }, // SN-002 colours: add-lion-colours.cjs
  elaichi: { fabric: [4, .3, .84, 2.4], border: [2, .3, .6, 2.0], motif: [6, .5, .87, 4.5] }, // real shoot, 20 Nov 2026; indices after set-elaichi-shoot.cjs (4 = pillar, 2 = close-up)
  genda:   { fabric: [3, .9, .55, 2.0], border: [3, .72, .42, 2.0], motif: [3, .61, .74, 2.6] }, // real shoot cuff close-up, 20 Nov 2026 (set-genda-shoot.cjs)
  kumkum:  { fabric: [7, .72, .42, 2.0], border: [7, .8, .75, 2.0], motif: [7, .62, .33, 2.4] }, // real shoot close-up, 20 Nov 2026 (set-kumkum-shoot.cjs)
  gulkand: { fabric: [5, .14, .72, 2.2], border: [5, .45, .76, 2.2], motif: [5, .45, .42, 2.4] }, // the 20 Nov close-up (images[5], gallery: false; cut from its 4000px original)
  kishmish: { fabric: [3, .5, .3, 1.8], border: [3, .4, .76, 2.0], motif: [3, .5, .55, 2.2] },
  gulmohar: { fabric: [3, .4, .3, 1.8], border: [3, .65, .75, 2.0], motif: [3, .3, .65, 2.2] },
  panna:   { fabric: [2, .5, .5, 1.3], border: [3, .7, .93, 2.0], motif: [3, .2, .85, 2.4] },
  phalsa:  { fabric: [2, .5, .3, 1.3], border: [3, .5, .1, 2.0], motif: [2, .55, .72, 2.6] },
  moonga:  { fabric: [2, .35, .45, 1.5], border: [3, .5, .9, 2.0], motif: [2, .3, .6, 2.5] },
  chameli: { fabric: [2, .5, .75, 1.3], border: [3, .5, .88, 2.0], motif: [2, .4, .32, 2.6] },
  kasni:   { fabric: [2, .5, .6, 1.5], border: [3, .5, .82, 1.8], motif: [3, .7, .14, 2.4] },
  basanti: { fabric: [2, .5, .5, 1.5], border: [3, .4, .88, 1.8], motif: [3, .62, .15, 2.4] }, // SN-029 colours: add-kasni-colours.cjs
  surkh:   { fabric: [2, .5, .5, 1.5], border: [4, .35, .85, 1.8], motif: [3, .6, .18, 2.4] },
  mehendi: { fabric: [3, .3, .25, 1.6], border: [2, .7, .2, 2.0], motif: [2, .3, .7, 2.8] },
  kamal:   { fabric: [3, .5, .85, 1.6], border: [2, .5, .2, 2.2], motif: [2, .5, .45, 2.6] },
  kairi:   { fabric: [2, .5, .5, 1.4], border: [1, .5, .5, 1.4], motif: [2, .5, .55, 2.0] }, // zooms from the model photo (client, 23 Nov 2026; folded photos removed)
  neel:    { fabric: [3, .5, .4, 1.4], border: [2, .5, .65, 1.4], motif: [3, .62, .3, 2.0] }, // zooms from the model photo; group photo is images[1] (23 Nov 2026)
  abeer:   { fabric: [2, .5, .3, 1.3], border: [3, .5, .5, 1.3], motif: [2, .4, .45, 2.0] }, // Neel colours (add-neel-colours.cjs)
  kopal:   { fabric: [2, .5, .3, 1.3], border: [3, .5, .5, 1.3], motif: [2, .45, .45, 2.0] },
  bhanwra: { fabric: [2, .5, .3, 1.3], border: [3, .5, .5, 1.3], motif: [2, .4, .4, 2.0] },
  bagh:    { fabric: [2, .5, .6, 1.4], border: [1, .5, .8, 1.4], motif: [2, .45, .45, 2.0] }, // zooms from the model photo (23 Nov 2026)
  sabza:   { fabric: [2, .5, .5, 1.3], border: [3, .5, .5, 1.3], motif: [2, .5, .3, 2.0] }, // Kairi colours (add-kairi-colours.cjs)
  mohini:  { fabric: [3, .5, .5, 1.3], border: [4, .5, .5, 1.3], motif: [3, .5, .55, 2.0] },
  mahavar: { fabric: [2, .5, .5, 1.3], border: [3, .5, .5, 1.3], motif: [2, .5, .5, 2.0] },
  tamra:   { fabric: [2, .5, .5, 1.3], border: [3, .5, .55, 1.3], motif: [2, .5, .5, 2.0] }, // Jamun colour (add-jamun-colours.cjs)
  mirchi:  { fabric: [2, .5, .5, 1.3], border: [3, .5, .55, 1.3], motif: [2, .3, .25, 2.0] },
  jamun:   { fabric: [2, .5, .4, 1.4], border: [1, .5, .55, 1.4], motif: [2, .4, .3, 2.0] }, // zooms from the model photo (23 Nov 2026)
  rangoli: { fabric: [1, .5, .3, 1.8], border: [1, .55, .72, 2.2], motif: [1, .6, .14, 3.2] },
  saanjh:  { fabric: [1, .45, .4, 2.2], border: [1, .72, .78, 2.8], motif: [1, .45, .82, 3.0] },
  sindoor: { fabric: [1, .45, .15, 2.2], border: [1, .7, .78, 2.2], motif: [1, .35, .5, 3.2] },
  kahani:  { fabric: [1, .3, .35, 2.4], border: [1, .5, .95, 2.0], motif: [1, .52, .62, 2.8] },
  leela:   { fabric: [1, .35, .3, 2.2], border: [1, .9, .5, 2.4], motif: [1, .55, .65, 2.6] },
  bansuri: { fabric: [1, .58, .45, 3.2], border: [1, .67, .3, 4.0], motif: [1, .45, .37, 2.6] },
  gajraj:  { fabric: [1, .3, .17, 2.2], border: [1, .42, .8, 5.0], motif: [1, .64, .55, 2.6] },
  darbar:  { fabric: [1, .52, .4, 3.0], border: [1, .62, .3, 5.0], motif: [1, .38, .22, 3.0] },
  veena:   { fabric: [1, .5, .25, 3.0], border: [1, .66, .4, 4.5], motif: [1, .63, .6, 3.0] },
  gulaabi: { fabric: [2, .65, .78, 1.8], border: [1, .58, .55, 1.8], motif: [2, .45, .72, 2.0] }, // real photos + border and booti zooms, 23 Nov 2026 (set-gulaabi-shoot.cjs)
  nilofer: { fabric: [1, .4, .7, 2.2], border: [2, .14, .4, 2.4], motif: [3, .5, .7, 1.6] }, // full length, seated, close-up, booti, 23 Nov 2026 (set-nilofer-shoot.cjs)
  alta: { fabric: [2, .72, .82, 1.6], border: [4, .47, .76, 2.2], motif: [4, .39, .6, 2.4] }, // 23 Nov 2026 shoot (set-alta-shoot.cjs): 2 = close-up, 4 = niche
  chandni: { fabric: [1, .6, .38, 2.2], border: [1, .35, .22, 2.6], motif: [1, .85, .2, 3.2] }, // gallery = the three real photos, 20 Nov 2026
  narangi: { fabric: [2, .55, .82, 2.2], border: [2, .9, .3, 2.2], motif: [3, .5, .7, 1.6] }, // full length, profile, close-up, booti, 23 Nov 2026 (set-narangi-shoot.cjs)
  hiran: { fabric: [2, .3, .85, 2.2], border: [2, .1, .62, 2.2], motif: [2, .46, .6, 2.3] }, // the client's close-up, 23 Nov 2026 (set-hiran-shoot.cjs)
  dariya:  { fabric: [4, .5, .55, 1.3], border: [3, .5, .5, 1.4], motif: [4, .31, .29, 1.8] }, // border + booti zooms (set-dariya-shoot.cjs), 23 Nov 2026
  saagar: { fabric: [2, .8, .55, 2.4], border: [2, .62, .84, 2.6], motif: [3, .8, .88, 3.0] }, // five real photos, 20 Nov 2026
  tota: { fabric: [2, .5, .62, 2.4], border: [2, .88, .8, 2.6], motif: [1, .62, .66, 3.0] }, // three real photos, 20 Nov 2026
  gagan: { fabric: [1, .6, .76, 2.4], border: [2, .66, .66, 2.4], motif: [2, .45, .84, 3.0] }, // three real photos, 20 Nov 2026
  parinda: { fabric: [3, .22, .62, 2.0], border: [3, .48, .6, 2.0], motif: [3, .36, .38, 2.1] }, // the client's close-up, 23 Nov 2026 (set-parinda-shoot.cjs)
  bulbul: { fabric: [1, .42, .62, 2.2], border: [1, .8, .72, 2.4], motif: [3, .5, .55, 1.0] }, // standing + seated + booti close-up, 23 Nov 2026
  kesar:   { fabric: [4, .72, .42, 2.5], border: [4, .7, .83, 3.0], motif: [4, .5, .55, 3.0] },
  baingani: { fabric: [3, .5, .5, 1.4], border: [2, .43, .28, 3.0], motif: [3, .55, .45, 2.0] }, // close-up = 2, booti zoom = 3 (set-baingani-shoot.cjs, 23 Nov 2026)
  pista:   { fabric: [1, .5, .62, 2.2], border: [3, .5, .22, 1.6], motif: [4, .5, .5, 1.8] }, // camera originals + border and booti zooms, 23 Nov 2026 (set-pista-shoot.cjs)
  gulnaar: { fabric: [0, .35, .72, 2.6], border: [0, .66, .64, 3.2], motif: [0, .15, .82, 3.0] },
  saawan:  { fabric: [0, .4, .9, 2.6], border: [0, .62, .455, 3.0], motif: [0, .4, .66, 3.0] },
  neelambari: { fabric: [4, .5, .5, 1.4], border: [3, .5, .55, 1.4], motif: [4, .45, .55, 1.8] }, // the client's zooms, 23 Nov 2026 (set-neelambari-shoot.cjs)
  megh:    { fabric: [1, .5, .25, 2.6], border: [1, .5, .75, 2.0], motif: [1, .4, .5, 2.6] },
  lavanya: { fabric: [1, .5, .42, 2.6], border: [1, .8, .45, 5.5], motif: [1, .62, .3, 3.6] }, // client's flat-lay, 20 Nov 2026
  bindiya: { fabric: [1, .5, .22, 2.6], border: [1, .5, .465, 3.4], motif: [1, .5, .7, 3.0] }, // client's flat-lay, 20 Nov 2026
  sakhi: { fabric: [1, .5, .2, 2.6], border: [1, .5, .875, 3.0], motif: [1, .6, .66, 2.4] }, // client's flat-lay, 20 Nov 2026
  chitra: { fabric: [1, .45, .22, 2.6], border: [1, .47, .8, 3.2], motif: [1, .55, .6, 2.4] }, // client's laid-out photo, 20 Nov 2026
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
