/* Elaichi PDP (client, 23 Nov 2026): gallery in the client's order only —
     1 standing at the gold door (elaichi-shoot.jpg, from the 4000×6000 original)
     2 side view by the sandstone pillar, rose to the face (elaichi-rose.jpg, 1122×1402 sent in chat: no full-size file yet)
     3 blouse and border close-up (elaichi-closeup.jpg, from the 4000×6000 original; the client's copy was a 4:5 crop of it)
     4 waist down by the pillar, peacock feather (elaichi-peacock.jpg, 1080×1350 sent in chat: no full-size file yet)
   then the reel (1 s–8 s of elaichi.MP4, enhanced with a stronger highlight roll-off for the sunlit background:
   _tools/enhance-reel.sh with GRADE, see CLAUDE.md). The pillar and door photos stay in images (gallery: false) because
   the "In detail" circles are cut from the pillar photo's full-size original. Crop / feature indices are remapped by file.
   Run from homepage/:  node _tools/set-elaichi-shoot.cjs   then set-feature-crops.cjs, make-detail-circles.mjs */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'elaichi');
const SHOOT = 'model photography/Elaichi shoot (20 Nov 2026)';
const by = (name) => p.images.find((im) => im.src.endsWith('/' + name));
const old = p.images.map((im) => im.src);
const shoot = by('elaichi-shoot.jpg'), closeup = by('elaichi-closeup.jpg'), pillar = by('elaichi-pillar.jpg'), door = by('elaichi-door.jpg');
const rose = by('elaichi-rose.jpg') || {
  src: '/assets/images/elaichi-rose.jpg', width: 1122, height: 1402, real: true,
  alt: 'Elaichi from the side beside a carved sandstone pillar, a red rose held to the face, the zari pallu falling over the shoulder',
  source: `${SHOOT}/sent in chat 23 Nov 2026/elaichi-rose.png`,
};
const peacock = by('elaichi-peacock.jpg') || {
  src: '/assets/images/elaichi-peacock.jpg', width: 1080, height: 1350, real: true,
  alt: 'Elaichi from the waist down beside a lotus pillar: silver booti on the green body, the zari pallu and the broad floral border',
  source: `${SHOOT}/sent in chat 23 Nov 2026/elaichi-peacock.jpg`,
};
delete rose.gallery; delete peacock.gallery;
p.images = [shoot, rose, closeup, peacock, { ...pillar, gallery: false }, { ...door, gallery: false }];
const idx = (n) => p.images.findIndex((im) => im.src === old[n]);
for (const group of [p.crops, p.features]) for (const c of Object.values(group || {})) if (c && c.img != null) c.img = idx(c.img);
p.video = {
  src: '/assets/video/elaichi-reel.mp4', srcSmall: '/assets/video/elaichi-reel-small.mp4', poster: '/assets/images/elaichi-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/elaichi/elaichi.MP4 (1 s to 8 s; enhanced by _tools/enhance-reel.sh with a stronger highlight roll-off for the bright background, 23 Nov 2026; no sound)'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}${im.gallery === false ? ' (hidden)' : ''}`).join('\n'));
console.log('crops.border →', p.crops.border.img, '| features', JSON.stringify(Object.fromEntries(Object.entries(p.features).map(([k, v]) => [k, v.img]))));
