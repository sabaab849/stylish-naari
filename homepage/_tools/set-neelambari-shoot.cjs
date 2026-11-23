/* Neelambari PDP (client, 23 Nov 2026): the client's three photos in order, then two zooms —
     1 looking back over the shoulder by the white pillar  neelambari-turn.jpg
     2 full length, hand to the brow, by the framed print  neelambari-wall.jpg
     3 smiling over the shoulder, pallu in front           neelambari-smile.jpg
     4 border zoom: the black zari border of medallions and the pallu paisleys, from photo 1 (crop 480×720 at x470 y800)
     5 booti zoom: gold elephants on the purple pleats, from photo 1 (crop 340×510 at x420 y1026)
   Zooms: light nlmeans (s 1.5) to clear JPEG blocking, spline scaling to 1024×1536, no sharpening, so they read smooth.
   The three photos are 1024×1536 chat copies (model photography/Neelambari shoot (sent in chat 23 Nov 2026)/); full-size files
   would make the zooms crisper. They replace neelambari-1 / -2 / -3 (files stay on disk).
   Run from homepage/: node _tools/set-neelambari-shoot.cjs, then set-feature-crops.cjs and make-detail-circles.mjs neelambari. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'neelambari');
const KEEP = 'model photography/Neelambari shoot (sent in chat 23 Nov 2026)';
const img = (name, alt, extra = {}) => ({ src: `/assets/images/${name}.jpg`, width: 1024, height: 1536, real: true, alt, source: `${KEEP}/${name}.png`, ...extra });
const zoom = { role: 'product', fit: 'cover', actual: true };
p.images = [
  img('neelambari-turn', 'Neelambari looking back over the shoulder beside a white carved pillar: purple silk with gold elephants and a black zari border'),
  img('neelambari-wall', 'Neelambari worn full length against a teal wall, one hand raised to the brow, the black pallu of gold paisleys falling to the floor'),
  img('neelambari-smile', 'Neelambari smiling over the shoulder, the purple pallu with gold elephants held in front'),
  img('neelambari-border-zoom', 'Neelambari border up close: gold medallions on the black zari border beside the paisleys of the pallu',
    { ...zoom, source: `${KEEP}/neelambari-turn.png (cropped x470 y800 480×720, spline 2.1×, light denoise)` }),
  img('neelambari-booti-zoom', 'Neelambari booti up close: small gold elephants woven over the purple pleats',
    { ...zoom, source: `${KEEP}/neelambari-turn.png (cropped x420 y1026 340×510, spline 3×, light denoise)` }),
];
p.galleryListed = true;
for (const c of Object.values(p.crops || {})) if (c && c.img != null) c.img = 0;
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'));
