/* Hiran PDP (client, 23 Nov 2026; asked for as "Narangi", but the photos and the video folder are Hiran's): gallery in the
   client's order (reordered 23 Nov 2026) — 1 full length at the jaali window (hiran-window), 2 incense pot by the window
   (hiran-incense), 3 close-up, smiling (hiran-closeup) — then the reel. The three photos are 1024×1536 chat copies, kept in
   model photography/Hiran shoot (sent in chat 23 Nov 2026)/; they replace hiran-main / -2 / -3 / -4 (files stay on disk).
   Reel: hiran.MP4 3 s–11 s, enhanced by _tools/enhance-reel.sh with SMOOTH=30 (firmer stabilisation) and a GRADE that rolls
   off the clipped red chroma (Cr above 180 compressed to 50 %), so the vermilion silk and alta hands stop flaring red:
     SMOOTH=30 GRADE="lutyuv=y='if(gt(val\,200)\,200+(val-200)*35/55\,val)':v='if(gt(val\,180)\,180+(val-180)*0.5\,val)',eq=contrast=1.04,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0" \
       _tools/enhance-reel.sh hiran ".../hiran/hiran.MP4" 3 8
   Run from homepage/: node _tools/set-hiran-shoot.cjs, then set-feature-crops.cjs and make-detail-circles.mjs hiran. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'hiran');
const KEEP = 'model photography/Hiran shoot (sent in chat 23 Nov 2026)';
const img = (name, alt) => ({ src: `/assets/images/${name}.jpg`, width: 1024, height: 1536, real: true, alt, source: `${KEEP}/${name}.png` });
p.images = [
  img('hiran-window', 'Hiran worn full length beside a jaali window: zari deer and medallions over the vermilion body, the woven pallu over one arm'),
  img('hiran-incense', 'Hiran in a blue room, holding a brass incense pot to the window, red roses in the hair'),
  img('hiran-closeup', 'Hiran up close: vermilion silk woven with zari deer and a tree-of-life medallion, the pallu over a mustard blouse, stacked gold cuffs'),
];
for (const c of Object.values(p.crops || {})) if (c && c.img != null) c.img = 2;
p.video = {
  src: '/assets/video/hiran-reel.mp4', srcSmall: '/assets/video/hiran-reel-small.mp4', poster: '/assets/images/hiran-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/hiran/hiran.MP4 (3 s to 11 s; enhanced by _tools/enhance-reel.sh, firmer stabilisation and red flare rolled off, 23 Nov 2026; no sound)'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'));
