/* Saagar PDP (client, 23 Nov 2026): the client's four camera photos in order, full length to close-ups, then the reel
   (originals kept in model photography/Saagar shoot (sent in chat 23 Nov 2026)/saagar-1..4.png, 1024×1536, scaled to 2000×3000 with lanczos):
     1 full length at the navy arched door   2 looking down, pallu swinging over the arm   3 close-up, flower booti and border
     4 pallu border close-up, held in the hand   5 reel: sagar.MP4 8 s–12.7 s (starts after the face leaves the frame, ends before she turns her back) at half speed (enhance-reel-slow.sh, SMOOTH=40)
   No zoom slides: the client's photos 3 and 4 are already close-ups. Replaces saagar-1…5 (files stay).
   Then run set-feature-crops.cjs, make-detail-circles.mjs saagar, make-slide-cuts.mjs saagar, export-shopify.cjs. */
const fs = require('fs');
const KEEP = 'model photography/Saagar shoot (sent in chat 23 Nov 2026)';
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'saagar');
const photo = (n, alt, extra = {}) => ({ src: `/assets/images/saagar-n${n}.jpg`, width: 2000, height: 3000, real: true, alt, source: `${KEEP}/saagar-${n}.png`, ...extra });
p.images = [
  photo(1, 'Saagar, a sea-blue Banarasi silk with gold and silver zari flower booti and a coral and gold border and pallu, worn full length at a navy arched door'),
  photo(2, 'Saagar worn looking down, the coral-bordered pallu swinging over the arm, with a red brocade blouse', { fit: 'cover' }),
  photo(3, 'Saagar close up: the coral and gold floral border and zari flower booti on sea-blue silk', { fit: 'cover' }),
  photo(4, 'Saagar pallu border up close: a coral and gold floral vine border beside the zari flower booti', { fit: 'cover' }),
];
p.galleryListed = true;
p.crops = p.crops || {};
p.crops.styling = { img: 1, s: 1.3, ox: '50%', oy: '25%', op: '50% 15%' };
for (const c of Object.values(p.crops)) if (c && c.img != null && c.img > 3) c.img = 0;
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/saagar-reel.mp4')) p.video = {
  src: '/assets/video/saagar-reel.mp4', srcSmall: '/assets/video/saagar-reel-small.mp4', poster: '/assets/images/saagar-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/saagar/sagar.MP4 8 s–12.7 s (no face: starts after it leaves the frame; ends before she turns her back), slowed to half speed and heavily stabilised (SMOOTH=40); enhanced by _tools/enhance-reel-slow.sh, 23 Nov 2026; no sound'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video, 'booti:', p.attributes && p.attributes.booti);
