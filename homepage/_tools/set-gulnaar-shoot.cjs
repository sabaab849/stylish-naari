/* Gulnaar PDP (client, 23 Nov 2026), in the client's order (camera photos sent in chat, 1024×1536, kept in model photography/Gulnaar shoot (sent in chat 23 Nov 2026)/gulnaar-1..3.png, scaled to 2000×3000):
     1 full length at the white arched window, looking down   2 from behind, pallu spread   3 close-up, embroidered rose pallu edge
     4 border zoom: the embroidered rose border, from gulnaar-3 (crop 330×440 at x70 y900, light nlmeans, spline to 1600×2400, no sharpening)
     5 reel: gulnaar.MP4 1 s–12 s (enhance-reel.sh, SMOOTH=20)
   Gulnaar has no booti (embroidered roses on a striped body), so there is no booti zoom and no booti row.
   Then run set-feature-crops.cjs, make-detail-circles.mjs gulnaar, make-slide-cuts.mjs gulnaar. */
const fs = require('fs');
const KEEP = 'model photography/Gulnaar shoot (sent in chat 23 Nov 2026)';
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'gulnaar');
const photo = (n, src, alt, extra = {}) => ({ src: `/assets/images/${n}.jpg`, width: 2000, height: 3000, real: true, alt, source: `${KEEP}/${src}`, ...extra });
p.images = [
  photo('gulnaar-n1', 'gulnaar-1.png', 'Gulnaar, a magenta striped silk with hand-embroidered roses along the border and pallu, worn full length at a white arched window'),
  photo('gulnaar-n2', 'gulnaar-2.png', 'Gulnaar seen from behind, the pallu spread out with its embroidered roses and gold stripes', { fit: 'cover' }),
  photo('gulnaar-n3', 'gulnaar-3.png', 'Gulnaar close up: embroidered roses and flowers along the pallu edge on magenta striped silk', { fit: 'cover' }),
  photo('gulnaar-border-zoom', 'gulnaar-3.png (cropped x70 y900 330×440, spline, light denoise)', 'Gulnaar border up close: embroidered roses and flowers on magenta silk beside the gold stripes', { width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true }),
];
p.galleryListed = true;
p.crops = p.crops || {};
p.crops.styling = { img: 2, s: 1.3, ox: '50%', oy: '30%', op: '50% 20%' };
for (const c of Object.values(p.crops)) if (c && c.img != null && c.img > 3) c.img = 0;
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/gulnaar-reel.mp4')) p.video = {
  src: '/assets/video/gulnaar-reel.mp4', srcSmall: '/assets/video/gulnaar-reel-small.mp4', poster: '/assets/images/gulnaar-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/gulnaar/gulnaar.MP4 1 s–12 s; enhanced by _tools/enhance-reel.sh (SMOOTH=20, highlight roll-off, saturation untouched), 23 Nov 2026; no sound'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video);
