// Kajal, Kishmish, Gulmohar: use the widened model photos from _tools/pad-lion-models.ps1 so there is room above the
// model's head on the homepage card and the PDP (client, 20 Nov 2026). The 3:4 window takes the full width from the top
// edge (head ~8% down; the hem border and lions stay in), and cards show the top of the photo (pos 50% 0%).
// Safe to re-run. Run from homepage/: node _tools/set-lion-space.cjs
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const W = 1132, H = 1608;
// Superseded (20 Nov 2026): all three now use seated model photos with head room (kajal-model, kishmish-seated,
// gulmohar-seated), so nothing is padded any more.
const MODEL = {};
for (const [slug, base] of Object.entries(MODEL)) {
  const p = data.products.find((x) => x.slug === slug);
  if (!p) throw new Error(`no product ${slug}`);
  const im = p.images.find((i) => i.src === `/assets/images/${base}.jpg` || i.src === `/assets/images/${base}-space.jpg`);
  if (!im) throw new Error(`${slug}: model photo not found`);
  if (!fs.existsSync(path.join(__dirname, '..', 'assets', 'images', `${base}-space.jpg`))) throw new Error(`run pad-lion-models.ps1 first`);
  Object.assign(im, {
    src: `/assets/images/${base}-space.jpg`, width: W, height: H, pos: '50% 0%',
    frame: { x: 0, y: 0, w: 1, h: +((W * 4) / 3 / H).toFixed(4) },
  });
  if (!/widened/.test(im.source)) im.source += '; widened with its own backdrop for head room (pad-lion-models.ps1)';
  console.log(slug, im.src, JSON.stringify(im.frame));
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
