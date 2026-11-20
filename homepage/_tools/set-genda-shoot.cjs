// Genda: the real photoshoot replaces the AI photos (client, 20 Nov 2026). Gallery in the client's order:
// standing full length by the arches → three-quarter portrait with marigolds → hand, cuff and the zari border.
// Full-size originals (4000×6000) stay in model photography/Genda shoot (20 Nov 2026)/ (images[].source → sharp circles);
// the site copies are 1600×2400. The old AI files (genda.jpg, genda-detail.jpg) are no longer used.
// Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<folder with the chat images> node _tools/set-genda-shoot.cjs
// Then: node _tools/set-feature-crops.cjs, make-detail-circles.mjs genda, export-shopify.cjs.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const ROOT = path.join(__dirname, '..');
const SHOOT = 'model photography/Genda shoot (20 Nov 2026)';
const ORIG = path.join(ROOT, '..', SHOOT);
const file = path.join(ROOT, 'assets', 'data', 'products.json');

// Slides 1–2 replaced the same day with the client's retouched 1024×1536 versions (24.png arch pose, 25.png portrait):
// kept at their own size, never enlarged. Slide 3 stays the 4000×6000 camera file.
const PHOTOS = [ // [site file, chat image, scale]
  ['genda-shoot.jpg', '24.png', null],
  ['genda-portrait.jpg', '25.png', null],
  ['genda-cuff.jpg', '21.jpg', '1600:2400'],
];
if (FF && IN) {
  fs.mkdirSync(ORIG, { recursive: true });
  for (const [out, src, scale] of PHOTOS) {
    const orig = scale ? out : out.replace(/\.jpg$/, '.png');
    fs.copyFileSync(path.join(IN, src), path.join(ORIG, orig));
    if (!scale) for (const old of [out]) { const f = path.join(ORIG, old); if (fs.existsSync(f)) fs.renameSync(f, f.replace(/\.jpg$/, '-camera.jpg')); }
    execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', path.join(IN, src), '-vf', scale ? `scale=${scale}:flags=lanczos` : 'null', '-q:v', '2', path.join(ROOT, 'assets', 'images', out)]);
    console.log(out);
  }
}
for (const [out] of PHOTOS) if (!fs.existsSync(path.join(ROOT, 'assets', 'images', out))) throw new Error(`missing ${out}: set FFMPEG and IN`);

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'genda');
const src = (f) => `${SHOOT}/${f}`;
const frame = { x: 0, y: 0.1111, w: 1, h: 0.8889 }; // 3:4, full width, from the bottom (head room above)
p.images = [
  { src: '/assets/images/genda-shoot.jpg', width: 1024, height: 1536, real: true, pos: '50% 50%', frame,
    alt: 'Genda, a marigold orange saree with silver zari booti and a floral zari border crossed over a wine brocade blouse, worn standing in a terracotta arch',
    source: src('genda-shoot.png') },
  { src: '/assets/images/genda-portrait.jpg', width: 1024, height: 1536, real: true, frame,
    alt: 'Genda draped over the shoulder, marigolds in the hair, the zari border running across the wine brocade blouse',
    source: src('genda-portrait.png') },
  { src: '/assets/images/genda-cuff.jpg', width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true,
    alt: 'Genda up close: the silver zari border of flowers with pink centres, and booti on the orange body, beside a gold cuff',
    source: src('genda-cuff.jpg') },
];
p.galleryListed = true;
// close-ups now come from the cuff photo (image 2); styling from the portrait
for (const k of ['border', 'weave', 'borderDetail', 'motif', 'swatch']) if (p.crops[k]) p.crops[k].img = 2;
p.crops.border = { img: 2, s: 1.3, ox: '72%', oy: '42%' };
p.crops.borderDetail = { img: 2, s: 2, ox: '72%', oy: '42%' };
p.crops.motif = { img: 2, s: 2.4, ox: '61%', oy: '74%' };
p.crops.styling = { img: 1, s: 1.6, ox: '55%', oy: '30%', op: '50% 20%' };
delete p.detailCircles; // re-cut: make-detail-circles.mjs genda
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('genda:', p.images.map((i) => path.basename(i.src)).join(' → '));
