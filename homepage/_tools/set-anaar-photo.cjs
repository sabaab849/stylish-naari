// Anaar: new main photo (client, 23 Nov 2026), the same lamplit green room, seen from the side with the floral pallu
// hanging straight down. Styled (AI) imagery, sent at 1091×1442 (already ~3:4): kept at its own size, never enlarged,
// saved as a top-quality JPEG (q 1) so it doesn't block up; the chat file is kept in model photography/Anaar (23 Nov 2026)/.
// The close-up slides (crops.border, crops.swatch) are re-aimed at the new photo and pre-cut sharp by make-slide-cuts.mjs.
// Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<folder with the chat images> node _tools/set-anaar-photo.cjs
// Then: make-detail-circles.mjs anaar, make-slide-cuts.mjs anaar, export-shopify.cjs.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const ROOT = path.join(__dirname, '..');
const DIR = 'model photography/Anaar (23 Nov 2026)';
const OUT = path.join(ROOT, 'assets', 'images', 'anaar-side.jpg');
if (FF && IN) {
  fs.mkdirSync(path.join(ROOT, '..', DIR), { recursive: true });
  fs.copyFileSync(path.join(IN, '34.png'), path.join(ROOT, '..', DIR, 'anaar-side.png'));
  execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', path.join(IN, '34.png'), '-q:v', '1', '-pix_fmt', 'yuvj444p', OUT]);
}
if (!fs.existsSync(OUT)) throw new Error('missing anaar-side.jpg: set FFMPEG and IN');
const file = path.join(ROOT, 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'anaar');
const W = 1091, H = 1442, w = +((H * 3) / 4 / W).toFixed(4);
p.images[0] = {
  src: '/assets/images/anaar-side.jpg', width: W, height: H, pos: '40% 50%',
  frame: { x: +((1 - w) / 2).toFixed(4), y: 0, w, h: 1 },
  alt: 'Anaar, a maroon bandhani saree with a wide gold border and a floral pallu, seen from the side in a lamplit green room',
  source: `${DIR}/anaar-side.png`,
};
Object.assign(p.crops, {
  silhouette: { img: 0 },
  fall: { img: 0, s: 1.4, ox: '35%', oy: '82%' },
  pallu: { img: 0, s: 1.5, ox: '60%', oy: '62%' },
  border: { img: 0, s: 1.5, ox: '30%', oy: '88%' },   // the gold hem border under the bandhani
  swatch: { img: 0, s: 1.5, ox: '48%', oy: '32%' },   // bandhani dots on the shoulder drape
  weave: { img: 0, s: 1.6, ox: '45%', oy: '40%' },
  colour: { img: 0, s: 1.3, ox: '40%', oy: '50%' },
  styling: { img: 0, s: 1.3, ox: '30%', oy: '15%', op: '50% 0%' },
});
delete p.detailCircles; delete p.slideCuts; // re-cut both
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('anaar →', p.images[0].src, JSON.stringify(p.images[0].frame));
