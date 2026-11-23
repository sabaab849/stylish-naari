/* Pista PDP (client, 23 Nov 2026): the client's three camera originals (6000×4000, kept in model photography/Pista shoot (23 Nov 2026)/
   pista-a/b/c.jpg) in order, then two zooms cut from the close-up original, then the reel:
     1 leaning in the arcade, looking down (pista-a)   2 close-up, pallu and booti (pista-b)   3 standing by the pillar (pista-c)
     4 border zoom: the floral zari border at the shoulder, from pista-b (crop 1500×2000 at x2000 y1320, lanczos to 1320×1760)
     5 booti zoom: the zari booti and vine jaal, from pista-b (crop 1680×2240 at x1320 y3060)
     6 reel: pista.MP4 4.8 s–9 s (from the twirl) at half speed (enhance-reel-slow.sh, GRADE below)
   Web copies are 2000×3000 (photos) and 1320×1760 (zooms), cut from the originals, no sharpening. Replaces pista-full / -closeup / -pillar (files stay).
   Then run set-feature-crops.cjs, make-detail-circles.mjs pista, export-shopify.cjs. */
const fs = require('fs');
const KEEP = 'model photography/Pista shoot (23 Nov 2026)';
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'pista');
const img = (n, k, alt, extra = {}) => ({ src: `/assets/images/pista-n${n}.jpg`, width: 2000, height: 3000, real: true, alt, source: `${KEEP}/pista-${k}.jpg`, ...extra });
const zoom = { role: 'product', fit: 'cover', actual: true, width: 1320, height: 1760 };
p.images = [
  img(1, 'a', 'Pista, a pale pistachio-green Banarasi silk with silver and gold zari booti and a floral border, worn leaning in a white arcade among palms'),
  img(2, 'b', 'Pista close up: the floral zari border at the shoulder and the zari booti on pistachio silk', { fit: 'cover' }),
  img(3, 'c', 'Pista worn standing by a white pillar, the broad zari pallu falling to a tasselled edge', { fit: 'cover' }),
  { src: '/assets/images/pista-n4.jpg', ...zoom, alt: 'Pista border up close: a floral zari border in gold and silver on pistachio silk', source: `${KEEP}/pista-b.jpg (cropped x2000 y1320 1500×2000)` },
  { src: '/assets/images/pista-n5.jpg', ...zoom, alt: 'Pista booti up close: gold and silver zari booti within a vine jaal on pistachio silk', source: `${KEEP}/pista-b.jpg (cropped x1320 y3060 1680×2240)` },
];
p.galleryListed = true;
for (const c of Object.values(p.crops || {})) if (c && c.img != null && c.img > 2) c.img = 0;
p.crops = p.crops || {};
p.crops.styling = { img: 0, s: 1.3, ox: '50%', oy: '25%', op: '50% 15%' };
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/pista-reel.mp4')) p.video = {
  src: '/assets/video/pista-reel.mp4', srcSmall: '/assets/video/pista-reel-small.mp4', poster: '/assets/images/pista-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ["model photography/saree videos/saree model vids/pista/pista.MP4 4.8 s–9 s (from the twirl), slowed to half speed and stabilised; enhanced by _tools/enhance-reel-slow.sh, 23 Nov 2026; GRADE=\"lutyuv=y='if(gt(val\,190)\,190+(val-190)*0.6\,val)',eq=contrast=1.04:saturation=1.03,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0\"; no sound"],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video, 'booti:', p.attributes && p.attributes.booti);
