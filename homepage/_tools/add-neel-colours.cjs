// Neel in three more colours (client, 23 Nov 2026): the same lotus-buti weave, each its own named saree and page, linked by the
// colour chips (colourSiblings = ['neel', 'abeer', 'kopal', 'bhanwra'] on all four) and `unlisted` (never on the homepage, shop
// all, category, craft or edit pages, or "you may also like"; reached from Neel's colour row and from search).
// Galleries: each variant = its folded photo → the group photo (Neel's model seated with the three folded colours) → lotus booti
// close-up → pallu close-up. Neel = model photo → the same group photo → border zoom → print zoom; Neel's reel is removed (the client:
// it showed this design in another colour). Folded photos: 4284×5712 camera files in model photography/Neel colours (23 Nov 2026)/,
// site copies 1650×2200, close-ups cut from the originals at 1320×1760. Names are proposals (Abeer = festival colour powder,
// Kopal = a new leaf, Bhanwra = bumblebee). Price copied from Neel. Safe to re-run.
// Then: set-feature-crops.cjs, make-detail-circles.mjs neel abeer kopal bhanwra, export-shopify.cjs.
// Run from homepage/: node _tools/add-neel-colours.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SIBS = ['neel', 'abeer', 'kopal', 'bhanwra'];
const DIR = 'model photography/Neel colours (23 Nov 2026)/';
const GROUP = { src: '/assets/images/neel-colours-group.jpg', width: 1086, height: 1448, real: true,
  alt: 'Neel worn seated before a painted forest with lotuses, beside the three other colours of the lotus buti weave, folded',
  source: DIR + 'neel-colours-group.png' };
const SPEC = {
  abeer: { name: 'Abeer', nameMeaning: 'festival colour powder', colour: { name: 'Magenta', hex: '#A3175E', text: '#F6F1EA' }, pallu: 'orange', file: 'abeer' },
  kopal: { name: 'Kopal', nameMeaning: 'a new leaf', colour: { name: 'Pista green', hex: '#9DBB6E', text: '#1F1A16' }, pallu: 'rose pink', file: 'kopal' },
  bhanwra: { name: 'Bhanwra', nameMeaning: 'bumblebee', colour: { name: 'Violet', hex: '#4B2A9E', text: '#F6F1EA' }, pallu: 'lemon yellow', file: 'bhanwra' },
};
const neel = data.products.find((p) => p.slug === 'neel');
// Neel: drop the reel, put the group photo second (once), shift indices of everything after the model photo
delete neel.video;
if (!neel.images.some((i) => i.src === GROUP.src)) {
  neel.images.splice(1, 0, { ...GROUP });
  const shift = (c) => { if (c && (c.img ?? 0) >= 1) c.img = (c.img ?? 0) + 1; };
  Object.values(neel.crops || {}).forEach(shift); Object.values(neel.features || {}).forEach(shift);
  if (neel.backdrop) shift(neel.backdrop);
}
neel.colourSiblings = SIBS; neel.galleryListed = true;
for (const slug of ['abeer', 'kopal', 'bhanwra']) {
  const s = SPEC[slug];
  let p = data.products.find((x) => x.slug === slug);
  if (!p) { p = { slug }; data.products.splice(data.products.indexOf(neel) + SIBS.indexOf(slug), 0, p); }
  const lc = s.colour.name.toLowerCase();
  const Pallu = s.pallu[0].toUpperCase() + s.pallu.slice(1);
  Object.assign(p, {
    name: s.name, nameMeaning: s.nameMeaning, descriptor: `${s.colour.name} with a ${s.pallu} zari pallu`,
    description: `${s.name} is ${lc} silk woven with silver lotus buti, the same weave as Neel, finished with a ${s.pallu} zari border and pallu.`,
    descriptionStatus: 'draft', colourLine: `${s.colour.name} silk with a ${s.pallu} pallu.`, colourLineStatus: 'draft',
    price: neel.price, priceIsPlaceholder: neel.priceIsPlaceholder, edits: [...neel.edits], categories: [...neel.categories],
    colours: [s.colour], colourSiblings: SIBS, unlisted: true, galleryListed: true,
    attributes: { ...neel.attributes, colourway: s.colour.name, border: `${Pallu} zari border`, motif: 'Lotus buti', booti: 'Silver lotus booti' },
    looks: [],
    closer: { heading: `${s.colour.name}, edged in ${s.pallu}.`, headingStatus: 'draft', items: [['Colour', s.colour.name], ['Motif', 'Lotus buti'], ['Border', `${s.pallu} zari`]] },
  });
  delete p.photoshoot; delete p.styling; delete p.video; delete p.detailCircles; delete p.features; delete p.slideCuts;
  const act = (src, w, h, alt, orig) => ({ src: `/assets/images/${src}`, width: w, height: h, role: 'product', fit: 'cover', actual: true, alt: `${s.name}: ${alt}`, source: DIR + orig });
  p.images = [
    act(`${s.file}-folded.jpg`, 1650, 2200, `folded open to the ${s.pallu} zari pallu`, `${s.file}.jpg`),
    { ...GROUP },
    act(`${s.file}-booti.jpg`, 1320, 1760, `a silver lotus buti on ${lc} silk`, `${s.file}.jpg`),
    act(`${s.file}-pallu.jpg`, 1320, 1760, `the ${s.pallu} zari pallu up close`, `${s.file}.jpg`),
  ];
  p.crops = { silhouette: { img: 0 }, border: { img: 3 }, borderDetail: { img: 3 }, swatch: { img: 2 }, weave: { img: 2 }, motif: { img: 2, s: 1.4 }, colour: { img: 0 },
    styling: { img: 1, s: 1.3, ox: '55%', oy: '40%', op: '50% 30%' } };
  p.styling = 'Shown folded beside Neel, the same lotus buti weave in indigo, worn with silver jewellery.';
  p.backdrop = { img: 0, pos: '50% 50%', posMobile: '50% 50%' };
  console.log(slug, p.images.length, 'photos');
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('neel', neel.images.map((i) => i.src.split('/').pop()).join(' → '), '| video', neel.video ? 'kept' : 'removed');
