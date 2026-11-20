// Premium Silk gallery clean-up (client, 19 Nov 2026). Run from homepage/: node _tools/add-border-zoom.cjs
// 1. Border close-ups cut from the saree's own folded photo (_tools/border-zoom.cjs → <slug>-border-zoom.jpg) become a gallery
//    slide, just before the blouse piece (or last when there is none). Crop = [x0, y0, width] as shares of the upright photo.
//    The old border-only photo stays hidden (gallery: false); nothing else moves, so the crops that point at images by index
//    keep working.
// Kajal: no longer here (20 Nov 2026): its photo 01 is shown whole as the border slide (add-lion-colours.cjs).
// Megh (SN-022, no Drive folder): cut the same way from its catalogue folded photo, catalogue/sn-022.jpg → megh-border-zoom.jpg,
//    crop x 520, y 420, 900×1350 of 1800×1800 (added by hand, 19 Nov 2026).
// 2. No print or border close-up from the AI photography in a Premium Silk gallery: the AI "detail" images are hidden
//    (gallery: false). The files stay, since other PDP sections crop from them.
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const ZOOM = {
  mehfil:  ['SN-045 – 01 (primary) – _SKS6622', [0.15, 0.46, 0.5]],
  phalsa:  ['SN-013 – Purple – 01 – _DSC4625', [0.30, 0.45, 0.5]],
  moonga:  ['SN-006 – 01 (primary) – _DSC4767', [0.22, 0.40, 0.45]],
  chameli: ['SN-032 – 01 (primary) – _DSC4546', [0.04, 0.28, 0.5]],
  kamal:   ['SN-005 – 01 (primary) – _DSC4528', [0.35, 0.10, 0.5]],
};

// Premium Semi-Silk (client, 19 Nov 2026): every saree already shows a real border slide except these three.
//   pudina, amavas: cut from the Drive original 01 (RANGE="Premium Semi-Silk" node _tools/border-zoom.cjs …). Pudina's old
//   "border" photo (SN-072 – 04) shows only the mint body, so it is hidden.
//   surmai: cut from its folded photo surmai-folded.jpg (the client's, 19 Nov), crop x 0, y 0.38, width 0.6.
const SEMI = {
  pudina: ['Premium Semi-Silk', 'SN-072 – 01 (primary) – _SKS6644', [0.64, 0.40, 0.36]],
  amavas: ['Premium Semi-Silk', 'SN-074 – 01 (primary) – _SKS6621', [0.10, 0.42, 0.5]],
};
for (const [slug, [range, from, crop]] of Object.entries(SEMI)) ZOOM[slug] = [from, crop, range];
ZOOM.surmai = ['surmai-folded.jpg (the client\'s folded photo, 19 Nov 2026)', [0, 0.38, 0.6], null];
const hidePudina = data.products.find((x) => x.slug === 'pudina').images.find((im) => im.src.endsWith('pudina-border.jpg'));
if (hidePudina) hidePudina.gallery = false;

for (const [slug, [from, crop, range = 'Premium Silk']] of Object.entries(ZOOM)) {
  const p = data.products.find((x) => x.slug === slug);
  const src = `/assets/images/${slug}-border-zoom.jpg`;
  p.images = p.images.filter((im) => im.src !== src);
  const img = {
    src, width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true,
    alt: `${p.name}: the border, up close`,
    source: range ? `Drive: 01 – Banarasi / ${range} / Original Product Photos – Pendrive / ${from} (cropped: ${crop.join(', ')})` : `${from} (cropped: ${crop.join(', ')})`,
  };
  const b = p.images.findIndex((im) => im.role === 'blouse');
  if (b === -1) p.images.push(img); else p.images.splice(b, 0, img);
  console.log('border close-up', slug);
}

for (const p of data.products.filter((x) => (x.categories || []).includes('banarasi-premium-silk'))) {
  for (const im of p.images) if (im.role === 'detail' && !im.actual && im.gallery !== false) { im.gallery = false; console.log('AI close-up hidden', p.slug, im.src); }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
