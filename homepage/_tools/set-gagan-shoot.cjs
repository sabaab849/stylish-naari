/* Gagan PDP (client, 23 Nov 2026), in the client's order (camera photos sent in chat, 1024×1536, kept in model photography/Gagan shoot (sent in chat 23 Nov 2026)/gagan-1..3.png, scaled to 2000×3000):
     1 full length seated in the open turquoise car (gagan-2)   2 full length leaning on the car door (gagan-3)   3 half length, face turned, embroidered pallu edge (gagan-1)
     4 border zoom: the embroidered scalloped hem, from gagan-2 (crop 420×560 at x290 y960)
     5 (removed 23 Nov 2026: the embroidery zoom was too small a source and pixelated; Gagan has no booti)
     5 reel: gagan.MP4 3 s–8.4 s (ends before the camera pushes in on her face) at half speed (enhance-reel-slow.sh, SMOOTH=40)
   Zooms: light nlmeans, spline to 1600×2400, no sharpening. Then run set-feature-crops.cjs, make-detail-circles.mjs gagan, make-slide-cuts.mjs gagan. */
const fs = require('fs');
const KEEP = 'model photography/Gagan shoot (sent in chat 23 Nov 2026)';
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'gagan');
const photo = (n, src, alt, extra = {}) => ({ src: `/assets/images/${n}.jpg`, width: 2000, height: 3000, real: true, alt, source: `${KEEP}/${src}`, ...extra });
const zoom = { width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true };
p.images = [
  photo('gagan-n2', 'gagan-2.png', 'Gagan, a sky-blue organza saree with ivory applique flowers and an embroidered scalloped border, worn seated in an open turquoise car'),
  photo('gagan-n3', 'gagan-3.png', 'Gagan worn leaning on a turquoise car door, the pallu edge embroidered with roses and the hem with applique flowers', { fit: 'cover' }),
  photo('gagan-n1', 'gagan-1.png', 'Gagan half length, face turned, the scalloped pallu edge embroidered with roses', { fit: 'cover' }),
  photo('gagan-border-zoom', 'gagan-2.png (cropped x290 y960 420×560, spline, light denoise)', 'Gagan hem up close: ivory applique flowers and a scalloped embroidered border on sky-blue organza', zoom),
];
p.galleryListed = true;
p.crops = p.crops || {};
p.crops.styling = { img: 2, s: 1.3, ox: '50%', oy: '25%', op: '50% 15%' };
for (const c of Object.values(p.crops)) if (c && c.img != null && c.img > 3) c.img = 0;
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/gagan-reel.mp4')) p.video = {
  src: '/assets/video/gagan-reel.mp4', srcSmall: '/assets/video/gagan-reel-small.mp4', poster: '/assets/images/gagan-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/gagan/gagan.MP4 3 s–8.4 s (ends before the push-in on her face), slowed to half speed and heavily stabilised (SMOOTH=40); enhanced by _tools/enhance-reel-slow.sh, 23 Nov 2026; no sound'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video);
