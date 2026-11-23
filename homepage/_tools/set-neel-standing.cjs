/* Neel PDP (client, 23 Nov 2026): the client's standing photo (navy lotus-buti silk, aqua zari pallu and border, holding her
   flower-braided plait; 1086×1448 chat copy kept in model photography/Neel shoot (sent in chat 23 Nov 2026)/) becomes slide 2,
   at its own size (3:4, the frame's shape, so it fills the frame with no scaling). The group photo, zooms follow unchanged.
   Run from homepage/: node _tools/set-neel-standing.cjs, then make-slide-cuts.mjs and make-detail-circles.mjs neel. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'neel');
const SRC = '/assets/images/neel-standing.jpg';
const old = p.images.filter((im) => im.src !== SRC).map((im) => im.src);
p.images = p.images.filter((im) => im.src !== SRC);
const before = p.images.map((im) => im.src);
p.images.splice(1, 0, {
  src: SRC, width: 1086, height: 1448, real: true,
  alt: 'Neel worn standing before a painted forest backdrop: navy silk with woven lotus buti, an aqua zari pallu and border, a flower-braided plait over the shoulder',
  source: 'model photography/Neel shoot (sent in chat 23 Nov 2026)/neel-standing.png',
});
p.galleryListed = true;
const idx = (n) => p.images.findIndex((im) => im.src === before[n]);
for (const g of [p.crops, p.features]) for (const c of Object.values(g || {})) if (c && c.img != null && before[c.img]) c.img = idx(c.img);
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'));
