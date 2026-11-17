// Adds the real folded photo to each first-shoot Banarasi saree (client, Nov 17 2026) as gallery slide 2, straight after the
// model photo (images[].second: true; render/pdp.mjs), with the border and fabric close-ups after it as before.
// Images: _tools/originals-firstshoot.ps1 (Drive "Stylissh Naari" flat-lays, turned upright). Appended last so the crops'
// image indices don't move. Safe to re-run. Run from homepage/: node _tools/add-originals-firstshoot.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const ADD = {
  kairi: { drive: 'IMG_7947.JPG', alt: 'Kairi, folded: the saree itself, a chartreuse pallu with a gold zari border over the lilac body with silver buti' },
  bagh: { drive: 'IMG_7944.JPG', alt: 'Bagh, folded: the saree itself, magenta with silver flower buti and the orange zari pallu folded open' },
};
for (const [slug, a] of Object.entries(ADD)) {
  const p = d.products.find((x) => x.slug === slug);
  if (!p) { console.log('missing product', slug); continue; }
  const src = `/assets/images/${slug}-original.jpg`;
  p.images = p.images.filter((im) => im.src !== src);
  p.images.push({ src, width: 1800, height: 2400, role: 'product', fit: 'cover', second: true, alt: a.alt, source: `Drive "Stylissh Naari" ${a.drive}` });
  console.log('added', slug, src);
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
