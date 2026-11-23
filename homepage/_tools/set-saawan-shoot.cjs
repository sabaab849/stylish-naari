/* Saawan PDP (client, 23 Nov 2026): the client's three photos in order, then a border zoom, then the reel —
     1 seated full length against the white wall, pallu flying     saawan-seated.jpg  (44.png)
     2 standing, pallu blowing out in the wind (half length)       saawan-wind.jpg    (43.png)
     3 close-up: pallu over the shoulder, hand with the bird ring  saawan-closeup.jpg (42.png)
     4 border zoom: the teal band with fine gold stripes on the tissue pallu, from photo 1 (crop 340×510 at x560 y560)
     5 reel: sawan.MP4 from 3 s to the end, enhance-reel.sh (default grade, SMOOTH=30)
   No booti slide: the saree has broad stripes and plain dyed bands, no booti.
   Zoom: light nlmeans (s 1.5), spline scaling to 1024×1536, no sharpening. The photos are 1024×1536 chat copies
   (model photography/Saawan shoot (sent in chat 23 Nov 2026)/); full-size files would make the zoom crisper.
   Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<chat images> node _tools/set-saawan-shoot.cjs,
   then set-feature-crops.cjs, make-detail-circles.mjs saawan, export-shopify.cjs. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const KEEP = 'model photography/Saawan shoot (sent in chat 23 Nov 2026)';
const IMG = 'assets/images';
const PHOTOS = [['saawan-seated', '44.png'], ['saawan-wind', '43.png'], ['saawan-closeup', '42.png']];
const ZOOMS = [['saawan-border-zoom', 'saawan-seated', '340:510:560:560']];
if (FF && IN) {
  fs.mkdirSync(path.join('..', KEEP), { recursive: true });
  for (const [name, src] of PHOTOS) {
    fs.copyFileSync(path.join(IN, src), path.join('..', KEEP, `${name}.png`));
    execFileSync(FF, ['-v', 'error', '-y', '-i', path.join(IN, src), '-q:v', '1', '-pix_fmt', 'yuvj444p', `${IMG}/${name}.jpg`]);
  }
  for (const [name, from, crop] of ZOOMS)
    execFileSync(FF, ['-v', 'error', '-y', '-i', path.join('..', KEEP, `${from}.png`),
      '-vf', `crop=${crop},nlmeans=s=1.5:p=5:r=9,scale=1024:1536:flags=spline`, '-q:v', '1', '-pix_fmt', 'yuvj444p', `${IMG}/${name}.jpg`]);
}
for (const n of [...PHOTOS, ...ZOOMS].map((x) => x[0])) if (!fs.existsSync(`${IMG}/${n}.jpg`)) throw new Error(`missing ${n}.jpg: set FFMPEG and IN`);

const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'saawan');
const img = (name, alt, extra = {}) => ({ src: `/assets/images/${name}.jpg`, width: 1024, height: 1536, real: true, alt, source: `${KEEP}/${name}.png`, ...extra });
const full = { x: 0, y: 0.1111, w: 1, h: 0.8889 };
p.images = [
  img('saawan-seated', 'Saawan, a teal saree in broad mottled stripes of moss green and rust with a gold-tissue pallu edged in teal, worn seated against a white wall, the pallu flying out', { frame: { ...full } }),
  img('saawan-wind', 'Saawan worn standing on a white terrace beside a cobalt urn, the pallu blowing out in the wind', { frame: { ...full, y: 0.08 } }),
  img('saawan-closeup', 'Saawan up close: the striped pallu drawn over the shoulder with a black blouse and a silver bird ring', { frame: { ...full, y: 0.05 } }),
  img('saawan-border-zoom', 'Saawan border up close: a teal band with fine gold stripes along the gold-tissue pallu',
    { role: 'product', fit: 'cover', actual: true, source: `${KEEP}/saawan-seated.png (cropped x560 y560 340×510, spline 3×, light denoise)` }),
];
p.galleryListed = true;
for (const c of Object.values(p.crops || {})) if (c && c.img != null) c.img = 0;
p.crops.styling = { img: 2, s: 1.3, ox: '55%', oy: '25%', op: '50% 10%' };
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/saawan-reel.mp4')) p.video = {
  src: '/assets/video/saawan-reel.mp4', srcSmall: '/assets/video/saawan-reel-small.mp4', poster: '/assets/images/saawan-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/sawan/sawan.MP4 3 s – end; enhanced by _tools/enhance-reel.sh with SMOOTH=30 (default grade: highlight roll-off, contrast +4 %, saturation +3 %, no white-balance change), 23 Nov 2026; no sound'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video);
