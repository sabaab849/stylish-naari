/* Baingani PDP (client, 23 Nov 2026): full length → pallu → border → booti zoom, then the reel.
   The client sent the same three shots as the 20 Nov photos (slightly re-cropped 1024px copies); the site keeps the 1600×2400
   copies of the 4000×6000 camera originals in model photography/Baingani shoot (20 Nov 2026)/, which are sharper.
     1 baingani-full     2 baingani-pallu (shoulder, pallu over the arm)     3 baingani-closeup (meenakari pallu and border)
     4 baingani-booti-zoom: silver buta on the purple body, cut from the close-up original at full resolution
       (ffmpeg -noautorotate, transpose=2, crop 1300×1950 at x2500 y900; no enlarging, no sharpening)
   Reel: baingani.MP4 0–5 s, slowed to 2/3 speed: FFMPEG=… SMOOTH=45 MAXSHIFT=40 _tools/enhance-reel-slow.sh baingani "…/baingani.MP4" 0 5 1.5
   Run from homepage/: node _tools/set-baingani-shoot.cjs, then set-feature-crops.cjs and make-detail-circles.mjs baingani. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'baingani');
const SHOOT = 'model photography/Baingani shoot (20 Nov 2026)';
const by = (n) => p.images.find((im) => im.src.endsWith('/' + n));
const old = p.images.map((im) => im.src);
const booti = by('baingani-booti-zoom.jpg') || {
  src: '/assets/images/baingani-booti-zoom.jpg', width: 1300, height: 1950, role: 'product', fit: 'cover', actual: true,
  alt: 'Baingani booti up close: small silver buta woven over the purple silk',
  source: `${SHOOT}/baingani-closeup.jpg (upright, cropped x2500 y900 1300×1950, full resolution)`,
};
p.images = [by('baingani-full.jpg'), by('baingani-pallu.jpg'), by('baingani-closeup.jpg'), booti];
const idx = (n) => p.images.findIndex((im) => im.src === old[n]);
for (const g of [p.crops, p.features]) for (const c of Object.values(g || {})) if (c && c.img != null && old[c.img]) c.img = idx(c.img);
p.video = {
  src: '/assets/video/baingani-reel.mp4', srcSmall: '/assets/video/baingani-reel-small.mp4', poster: '/assets/images/baingani-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/baingani/baingani.MP4 0–5 s, slowed to 2/3 speed; enhanced by _tools/enhance-reel-slow.sh (SMOOTH=45 MAXSHIFT=40, default grade), 23 Nov 2026; no sound'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'));
