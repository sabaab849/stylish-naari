// Kumkum: the camera photos from the shoot replace the earlier 1024×1536 copies (client, 20 Nov 2026). Gallery: full
// length between the velvet curtains first (client), then the photos in the order sent: portrait with lotus buds →
// close-up of the buta and zari border (real close-up, "Actual product photograph") → standing against the damask.
// Full-size originals (4000×6000) in model photography/Kumkum shoot (20 Nov 2026)/ (images[].source → sharp circles);
// site copies 1600×2400. The old kumkum.jpg / kumkum-standing.jpg / kumkum-detail.jpg are no longer used.
// Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<folder with the chat images> node _tools/set-kumkum-shoot.cjs
// Then: node _tools/set-feature-crops.cjs, make-detail-circles.mjs kumkum, export-shopify.cjs.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const ROOT = path.join(__dirname, '..');
const SHOOT = 'model photography/Kumkum shoot (20 Nov 2026)';
const ORIG = path.join(ROOT, '..', SHOOT);
const file = path.join(ROOT, 'assets', 'data', 'products.json');

const PHOTOS = [ // [site file, chat image]
  ['kumkum-full.jpg', '29.jpg'],
  ['kumkum-lotus.jpg', '26.jpg'],
  ['kumkum-closeup.jpg', '27.jpg'],
  ['kumkum-damask.jpg', '28.jpg'],
];
if (FF && IN) {
  fs.mkdirSync(ORIG, { recursive: true });
  for (const [out, src] of PHOTOS) {
    fs.copyFileSync(path.join(IN, src), path.join(ORIG, out));
    execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', path.join(IN, src), '-vf', 'scale=1600:2400:flags=lanczos', '-q:v', '2', path.join(ROOT, 'assets', 'images', out)]);
    console.log(out);
  }
}
for (const [out] of PHOTOS) if (!fs.existsSync(path.join(ROOT, 'assets', 'images', out))) throw new Error(`missing ${out}: set FFMPEG and IN`);

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'kumkum');
const W = 1600, H = 2400, fh = 0.8889; // 3:4 window at full width
const model = (f, y, alt, extra = {}) => ({ src: `/assets/images/${f}`, width: W, height: H, real: true, frame: { x: 0, y, w: 1, h: fh }, alt, source: `${SHOOT}/${f}`, ...extra });
p.images = [
  model('kumkum-full.jpg', 0.1111, 'Kumkum, a rust saree woven with zari flower sprays and coral, navy and olive buta, worn full length between red velvet curtains, holding pink lotus buds, the deep zari border at the hem', { pos: '50% 55%' }),
  model('kumkum-lotus.jpg', 0.1111, 'Kumkum worn with a green and gold brocade blouse, lotus buds held up to the face, the zari border across the shoulder'),
  { src: '/assets/images/kumkum-closeup.jpg', width: W, height: H, role: 'product', fit: 'cover', actual: true,
    alt: 'Kumkum up close: zari flower sprays and coral, navy and olive buta on rust, beside the deep zari border', source: `${SHOOT}/kumkum-closeup.jpg` },
  model('kumkum-damask.jpg', 0.05, 'Kumkum worn standing against gold damask, the pallu gathered over the arm'),
];
p.galleryListed = true;
p.crops = {
  silhouette: { img: 0 },
  fall: { img: 0, s: 1.5, ox: '55%', oy: '80%' },
  pallu: { img: 0, s: 1.5, ox: '55%', oy: '55%' },
  border: { img: 2, s: 1.4, ox: '80%', oy: '75%' },
  weave: { img: 2, s: 1.3, ox: '55%', oy: '50%' },
  borderDetail: { img: 2, s: 1.8, ox: '80%', oy: '75%' },
  motif: { img: 2, s: 2.2, ox: '62%', oy: '33%' },
  colour: { img: 0, s: 1.3, ox: '55%', oy: '55%' },
  swatch: { img: 2, s: 1.8, ox: '55%', oy: '45%' },
  styling: { img: 1, s: 1.8, ox: '45%', oy: '50%', op: '50% 45%' },
};
delete p.detailCircles; // re-cut: make-detail-circles.mjs kumkum
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('kumkum:', p.images.map((i) => path.basename(i.src)).join(' → '));
