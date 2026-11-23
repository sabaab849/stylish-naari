// Full-length first photo (client, 20 Nov 2026): on these PDPs the first gallery photo is shown whole, never cut to the
// 3:4 window, so the model is seen head to hem. Removing images[0].frame makes render/pdp.mjs use the photo's own shape
// (2:3). Run after any script that sets frames (add-alta, add-nilofer, add-nov16b, set-frames-nov, set-genda-shoot,
// set-real-shoot). Safe to re-run. Run from homepage/: node _tools/full-length-first.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SLUGS = ['genda', 'elaichi', 'kesar', 'nilofer', 'alta', 'hiran', 'gulaabi']; // hiran's first photo is a close-up since 23 Nov 2026 (no frame either way)
for (const slug of SLUGS) {
  const p = data.products.find((x) => x.slug === slug);
  if (!p) { console.log('missing', slug); continue; }
  const im = p.images[0];
  const had = !!im.frame;
  delete im.frame;
  im.pos = '50% 50%';
  console.log(`${slug.padEnd(8)} ${im.src}  ${had ? 'frame removed' : 'already whole'}`);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
