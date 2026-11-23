/* Nilam PDP (client, 23 Nov 2026): the client's new photo (standing by the blue car, nilam-car.jpg, 1024×1536 chat copy kept in
   model photography/Nilam shoot (sent in chat 23 Nov 2026)/) becomes slide 1, shown whole (no frame); the previous slides follow in
   their old order (nilam.jpg, nilam-detail.jpg), galleryListed so nothing is reordered; then the reel.
   Reel: nilam.MP4 8–15 s at 0.8× speed, firm smoothing with the zoom fixed at 7 %:
     FFMPEG=… SMOOTH=60 MAXSHIFT=45 STABZOOM="optzoom=0:zoom=7:crop=keep" _tools/enhance-reel-slow.sh nilam "…/nilam.MP4" 8 7 1.25
   Run from homepage/: node _tools/set-nilam-shoot.cjs, then set-feature-crops.cjs and make-detail-circles.mjs nilam. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'nilam');
const old = p.images.map((im) => im.src);
p.images = p.images.filter((im) => !im.src.endsWith('/nilam-car.jpg'));
p.images.unshift({
  src: '/assets/images/nilam-car.jpg', width: 1024, height: 1536, real: true,
  alt: 'Nilam worn standing beside a pale blue vintage car: sapphire silk with a meenakari pallu of roses and leaves, a silver zari border',
  source: 'model photography/Nilam shoot (sent in chat 23 Nov 2026)/nilam-car.png',
});
p.galleryListed = true;
const idx = (n) => p.images.findIndex((im) => im.src === old[n]);
for (const g of [p.crops, p.features]) for (const c of Object.values(g || {})) if (c && c.img != null && old[c.img]) c.img = idx(c.img);
p.video = {
  src: '/assets/video/nilam-reel.mp4', srcSmall: '/assets/video/nilam-reel-small.mp4', poster: '/assets/images/nilam-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/nilam/nilam.MP4 8–15 s at 0.8×; enhanced by _tools/enhance-reel-slow.sh (SMOOTH=60 MAXSHIFT=45, zoom fixed at 7 %, default grade), 23 Nov 2026; no sound'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'));
