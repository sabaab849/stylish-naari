/* Dariya PDP (client, 23 Nov 2026): the client's three photos in order, then two zooms, then the reel —
     1 smiling to camera under the blue scalloped arches     dariya-arcade.jpg
     2 full length by the palms and the blue wall, face up   dariya-palms.jpg
     3 laughing, pallu over the arm, vine border in front    dariya-laugh.jpg
     4 border zoom: the multicolour flowering-vine border, from photo 3 (crop 440×660 at x190 y876)
     5 booti zoom: small silver zari booti on the aqua body, from photo 3 (crop 340×510 at x500 y840)
     6 reel: dariya.MP4 0–6 s, slowed to 0.8× (enhance-reel-slow.sh, GRADE below)
   Zooms: light nlmeans (s 1.5) to clear JPEG blocking, spline scaling to 1024×1536, no sharpening, so they read smooth.
   The three photos are 1024×1536 chat copies (model photography/Dariya shoot (sent in chat 23 Nov 2026)/); full-size files
   would make the zooms crisper. They replace dariya-1 / -2 / -3 (files stay on disk).
   Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<chat images> node _tools/set-dariya-shoot.cjs,
   then set-feature-crops.cjs, make-detail-circles.mjs dariya, export-shopify.cjs. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const KEEP = 'model photography/Dariya shoot (sent in chat 23 Nov 2026)';
const IMG = 'assets/images';
const PHOTOS = [['dariya-arcade', '35.png'], ['dariya-palms', '36.png'], ['dariya-laugh', '37.png']];
const ZOOMS = [['dariya-border-zoom', 'dariya-laugh', '440:660:190:876'], ['dariya-booti-zoom', 'dariya-laugh', '340:510:500:840']];
if (FF && IN) {
  fs.mkdirSync(path.join('..', KEEP), { recursive: true });
  for (const [name, src] of PHOTOS) {
    fs.copyFileSync(path.join(IN, src), path.join('..', KEEP, `${name}.png`));
    execFileSync(FF, ['-v', 'error', '-y', '-i', path.join(IN, src), '-q:v', '1', `${IMG}/${name}.jpg`]);
  }
  for (const [name, from, crop] of ZOOMS)
    execFileSync(FF, ['-v', 'error', '-y', '-i', path.join('..', KEEP, `${from}.png`),
      '-vf', `crop=${crop},nlmeans=s=1.5:p=5:r=9,scale=1024:1536:flags=spline`, '-q:v', '1', `${IMG}/${name}.jpg`]);
}
for (const n of [...PHOTOS, ...ZOOMS].map((x) => x[0])) if (!fs.existsSync(`${IMG}/${n}.jpg`)) throw new Error(`missing ${n}.jpg: set FFMPEG and IN`);

const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'dariya');
const img = (name, alt, extra = {}) => ({ src: `/assets/images/${name}.jpg`, width: 1024, height: 1536, real: true, alt, source: `${KEEP}/${name}.png`, ...extra });
const zoom = { role: 'product', fit: 'cover', actual: true };
p.images = [
  img('dariya-arcade', 'Dariya, an aqua saree with silver zari booti and a flowering-vine border in indigo, coral, green and marigold, worn smiling under blue scalloped arches', { frame: { x: 0, y: 0.1111, w: 1, h: 0.8889 } }),
  img('dariya-palms', 'Dariya worn full length beside palms and a blue wall, face turned up to the light, the vine-bordered pallu falling to the floor', { frame: { x: 0, y: 0.1111, w: 1, h: 0.8889 } }),
  img('dariya-laugh', 'Dariya laughing, the pallu over the arm with the flowering-vine border in front', { frame: { x: 0, y: 0, w: 1, h: 0.8889 } }),
  img('dariya-border-zoom', 'Dariya border up close: a flowering vine of indigo leaves with coral, green and marigold flowers',
    { ...zoom, source: `${KEEP}/dariya-laugh.png (cropped x190 y876 440×660, spline 2.3×, light denoise)` }),
  img('dariya-booti-zoom', 'Dariya booti up close: small silver zari flowers on the aqua body',
    { ...zoom, source: `${KEEP}/dariya-laugh.png (cropped x500 y840 340×510, spline 3×, light denoise)` }),
];
p.galleryListed = true;
for (const c of Object.values(p.crops || {})) if (c && c.img != null && c.img > 2) c.img = 0;
p.crops.styling = { img: 0, s: 1.3, ox: '50%', oy: '35%', op: '50% 20%' };
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/dariya-reel.mp4')) p.video = {
  src: '/assets/video/dariya-reel.mp4', srcSmall: '/assets/video/dariya-reel-small.mp4', poster: '/assets/images/dariya-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ["model photography/saree videos/saree model vids/dariya/dariya.MP4 0–6 s, slowed to 0.8× and stabilised; enhanced by _tools/enhance-reel-slow.sh with GRADE=\"lutyuv=y='if(gt(val\\,150)\\,150+(val-150)*0.55\\,val)',eq=contrast=1.05:saturation=1.04,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0\" (highlight roll-off for the overexposed sunlit arcade, no white-balance change), 23 Nov 2026; no sound"],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video);
