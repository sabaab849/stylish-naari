/* Gallery slides 3–4 (border and print close-ups) cut from the saree's original photo, never from the AI model
   photo (client, 20 Nov 2026: "the 3rd and 4th image should strictly be detail images of the print and border taken
   from the folded original saree image only"). For sarees whose original is a single photo: it becomes slide 2
   (images[].second) and crops.border / crops.swatch point at it. Focal points were chosen by eye on each original.
   Spec: [original file, border fx, fy, print fx, fy] as shares of the photo; zoom 2.4 (the gallery's cap).
   The gallery frame is 3:4 and the photo covers it centred, so a taller photo loses equal bands top and bottom.
   Run from homepage/:  node _tools/detail-slides-from-original.cjs   (then make-detail-circles.mjs if circles change) */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const S = 2.4;
const SPECS = {
  // kairi, neel, bagh removed 23 Nov 2026 (folded photos are not these sarees)
  _kairi:   ['kairi-original.jpg', .45, .6, .4, .47],
  _neel:    ['neel-original.jpg', .45, .56, .45, .45],
  _bagh:    ['bagh-original.jpg', .45, .53, .4, .4],
  rangoli: ['rangoli-product.jpg', .5, .8, .4, .2],
  saanjh:  ['saanjh-product.jpg', .6, .85, .3, .3],
  sindoor: ['sindoor-product.jpg', .5, .78, .45, .45],
  kahani:  ['kahani-product.jpg', .55, .75, .45, .55],
  leela:   ['leela-product.jpg', .18, .55, .55, .5],
  veena:   ['veena-original.jpg', .25, .5, .55, .55],
  darbar:  ['darbar-original.jpg', .5, .8, .5, .25],
  gajraj:  ['gajraj-original.jpg', .82, .2, .55, .6],
  bansuri: ['bansuri-original.jpg', .5, .85, .45, .3],
};
const clamp = (v) => Math.min(Math.max(v, 0), 1);
const origin = (f) => Math.round(clamp((f - 0.5 / S) / (1 - 1 / S)) * 100) + '%';
for (const [slug, [src, bx, by, px, py]] of Object.entries(SPECS)) {
  if (slug.startsWith('_')) continue; // retired entries
  const p = data.products.find((x) => x.slug === slug);
  const n = p.images.findIndex((im) => im.src.endsWith('/' + src));
  if (n < 0) throw new Error(`${slug}: ${src} not found`);
  const im = p.images[n];
  im.second = true;
  im.actual = true;
  // focal y inside the 3:4 window the photo shows (taller photos are cropped equally top and bottom)
  const vis = Math.min(1, (im.width * 4 / 3) / im.height), top = (1 - vis) / 2;
  const fy = (y) => clamp((y - top) / vis);
  p.crops.border = { img: n, s: S, ox: origin(bx), oy: origin(fy(by)) };
  p.crops.swatch = { img: n, s: S, ox: origin(px), oy: origin(fy(py)) };
  console.log(slug.padEnd(8), 'border', p.crops.border.ox, p.crops.border.oy, '| print', p.crops.swatch.ox, p.crops.swatch.oy);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
