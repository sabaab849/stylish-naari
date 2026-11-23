// Panna: new main photo (client, 23 Nov 2026), seated on candle-lit stairs seen from behind, the paisley pallu spread
// down the steps. Replaces images[0] (the AI studio portrait); the Drive slides after it are unchanged, so every crop
// index stays valid. Sent in chat at 1750×3109 (kept at that size, never enlarged); original kept in
// model photography/Panna (23 Nov 2026)/. 3:4 window at full width, from just above the head to the pallu hem.
// Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<folder with the chat images> node _tools/set-panna-stairs.cjs
// Then: set-styled-wide.cjs, make-detail-circles.mjs panna, make-slide-cuts.mjs panna, export-shopify.cjs.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const ROOT = path.join(__dirname, '..');
const DIR = 'model photography/Panna (23 Nov 2026)';
const OUT = path.join(ROOT, 'assets', 'images', 'panna-stairs.jpg');
if (FF && IN) {
  fs.mkdirSync(path.join(ROOT, '..', DIR), { recursive: true });
  fs.copyFileSync(path.join(IN, '30.png'), path.join(ROOT, '..', DIR, 'panna-stairs.png'));
  execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', path.join(IN, '30.png'), '-q:v', '2', OUT]);
}
if (!fs.existsSync(OUT)) throw new Error('missing panna-stairs.jpg: set FFMPEG and IN');
const file = path.join(ROOT, 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'panna');
const W = 1750, H = 3109, h = +((W * 4) / 3 / H).toFixed(4);
p.images[0] = {
  src: '/assets/images/panna-stairs.jpg', width: W, height: H, pos: '50% 60%',
  frame: { x: 0, y: 0.21, w: 1, h },
  alt: 'Panna, an emerald silk saree with a floral jaal, gold zari border and paisley pallu, worn seated on candle-lit stairs, seen from behind with the pallu spread down the steps',
  source: `${DIR}/panna-stairs.png`,
};
p.crops.fall = { img: 0, s: 1.5, ox: '50%', oy: '85%', op: '50% 85%' };
p.crops.pallu = { img: 0, s: 1.6, ox: '70%', oy: '75%', op: '50% 75%' };
p.crops.colour = { img: 0, s: 1.5, ox: '45%', oy: '60%', op: '50% 60%' };
delete p.detailCircles?.styled;
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('panna main photo →', p.images[0].src, JSON.stringify(p.images[0].frame));
