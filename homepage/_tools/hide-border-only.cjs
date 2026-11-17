// Takes border-only photos out of the PDP gallery (client, Nov 17 2026): a slide that shows the border beside plain
// body cloth, with none of the saree's print in it. The image stays in products.json with gallery: false, so crops
// that point at it by index (crops.*.img) keep working; render/pdp.mjs skips it when building the slides.
// Chosen by eye from every PDP's border slide; borders that sit beside the print (Kumud, Aasmaan, Airavat …) stay.
// Safe to re-run; run again after any add-*.cjs that rewrites these products. Run from homepage/: node _tools/hide-border-only.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const HIDE = {
  kajal: 'kajal-border.jpg', phalsa: 'phalsa-border.jpg', moonga: 'moonga-border.jpg', chameli: 'chameli-border.jpg',
  kamal: 'kamal-border.jpg', mehfil: 'mehfil-border.jpg', surmai: 'surmai-border.jpg', zamurrad: 'zamurrad-border.jpg',
  shahtoot: 'shahtoot-border.jpg', kachnar: 'kachnar-border.jpg', shikara: 'shikara-border.jpg', neem: 'neem-border.jpg',
  sitara: 'sitara-border.jpg', maina: 'maina-border.jpg',
  gulkand: 'gulkand-detail.jpg', elaichi: 'elaichi-detail.jpg', // model close-ups of the border and blouse only
};
for (const [slug, file] of Object.entries(HIDE)) {
  const p = d.products.find((x) => x.slug === slug);
  const im = p?.images.find((i) => i.src.endsWith('/' + file));
  if (!im) { console.log(`missing: ${slug} ${file}`); continue; }
  im.gallery = false; console.log(`hidden: ${slug} ${file}`);
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
