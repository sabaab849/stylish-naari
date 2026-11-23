// Suhaag + two colours (client, 23 Nov 2026): a new Banarasi saree — red silk with small silver floral buti and a bottle green border of
// zari floral jaal — and the same weave in two more colours (the client said four; two were sent: purple with a lime pallu, navy with a
// maroon pallu). Each is its own named saree and page, linked by the colour chips (colourSiblings = SIBS on all). Only Suhaag is listed;
// the colours are `unlisted` (never on the homepage, shop all, category, craft or edit pages, or "you may also like").
// Photos: model photography/Suhaag colours (23 Nov 2026)/
//   Suhaag: suhaag-model.png (1086×1448 chat copy) → border zoom → print zoom, both cut from it (light nlmeans, spline, no sharpening).
//   Colours: own folded photo (4284×5712 camera file, upright, site copy 1650×2200) → the group photo of both colours → border close-up →
//   print close-up. Close-ups are cut from the originals at their own pixel size (no resampling at all):
//     nisha-border    nisha-folded    .52 .15 .30   nisha-print    nisha-folded    .46 .38  .24
//     ratanjot-border ratanjot-folded .18 .62 .30   ratanjot-print ratanjot-folded .29 .485 .26   (x, y, width as shares; ratanjot turned 90° clockwise)
// Names are proposals (Suhaag = marital bliss, Ratanjot = the root that dyes purple, Nisha = night). Price is a placeholder copied from Neel.
// Safe to re-run; add a colour by adding it to SPEC and SIBS. Then: set-feature-crops.cjs, make-detail-circles.mjs <slugs>, export-shopify.cjs.
// Run from homepage/: node _tools/add-suhaag-colours.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SIBS = ['suhaag', 'ratanjot', 'nisha'];
const DIR = 'model photography/Suhaag colours (23 Nov 2026)/';
const neel = data.products.find((p) => p.slug === 'neel');
const after = data.products.find((p) => p.slug === 'sumbul') || neel;
const ivory = '#F6F1EA', ink = '#1F1A16';
const upsert = (slug, i) => {
  let p = data.products.find((x) => x.slug === slug);
  if (!p) { p = { slug }; data.products.splice(data.products.indexOf(after) + 1 + i, 0, p); }
  return p;
};
const common = {
  price: neel.price, priceIsPlaceholder: true, edits: [...(neel.edits || [])], categories: ['banarasi'],
  categoryEvidence: { banarasi: 'Client, 23 Nov 2026: "this comes under Banarasi"' },
  colourSiblings: SIBS, galleryListed: true, looks: [],
};
const zoom = { role: 'product', fit: 'cover', actual: true };

const s = upsert('suhaag', 0);
Object.assign(s, common, {
  name: 'Suhaag', nameMeaning: 'marital bliss', descriptor: 'Red silk with a bottle green zari border',
  description: 'Suhaag is red silk scattered with small silver floral buti, edged in a bottle green border woven with a zari floral jaal.',
  descriptionStatus: 'draft', colourLine: 'Red silk, edged in bottle green and gold.', colourLineStatus: 'draft',
  styling: 'Shown with a red rose in the braid, a maang tikka, chandbali earrings, stacked gold cuffs and a mirror-work kamarbandh.', stylingStatus: 'draft',
  colours: [{ name: 'Red', hex: '#D9261C', text: ivory }, { name: 'Bottle green', hex: '#1F3B2E', text: ivory }],
  attributes: { fabric: 'Silk', colourway: 'Red and bottle green', border: 'Bottle green zari floral border', motif: 'Floral buti', length: null, blousePiece: null,
    weave: null, origin: null, availability: null, booti: 'Silver floral booti' },
  closer: { heading: 'Red, edged in bottle green.', headingStatus: 'draft', items: [['Colour', 'Red'], ['Motif', 'Floral buti'], ['Border', 'Bottle green zari']] },
  photoshoot: true,
});
delete s.unlisted; delete s.video; delete s.slideCuts; delete s.detailCircles;
s.images = [
  { src: '/assets/images/suhaag.jpg', width: 1086, height: 1448, real: true,
    alt: 'Suhaag worn seated before a deep red disc: red silk with silver floral buti and a bottle green zari border, chin resting on her hands',
    source: DIR + 'suhaag-model.png' },
  { src: '/assets/images/suhaag-border-zoom.jpg', width: 1320, height: 1760, ...zoom,
    alt: 'Suhaag border up close: the bottle green border of gold floral jaal beside the red silk',
    source: DIR + 'suhaag-model.png (cropped x410 y1048 300×400, light denoise, spline)' },
  { src: '/assets/images/suhaag-print-zoom.jpg', width: 1320, height: 1760, ...zoom,
    alt: 'Suhaag buti up close: small silver floral buti on the red silk',
    source: DIR + 'suhaag-model.png (cropped x680 y1020 320×427, light denoise, spline)' },
];
s.crops = { silhouette: { img: 0 }, border: { img: 1 }, borderDetail: { img: 1 }, swatch: { img: 2 }, weave: { img: 2 }, motif: { img: 2, s: 1.4 },
  colour: { img: 0, s: 1.6, ox: '65%', oy: '80%' }, styling: { img: 0, s: 1.3, ox: '55%', oy: '35%', op: '50% 20%' } };
s.backdrop = { img: 0, pos: '55% 40%', posMobile: '55% 40%' };

const SPEC = {
  ratanjot: { name: 'Ratanjot', nameMeaning: 'the root that dyes purple', colour: { name: 'Purple', hex: '#7A1FA0', text: ivory },
    second: { name: 'Lime green', hex: '#A9B52A', text: ink }, pallu: 'lime green', print: [1112, 1482], border: [1284, 1712] },
  nisha: { name: 'Nisha', nameMeaning: 'night', colour: { name: 'Navy', hex: '#1E2340', text: ivory },
    second: { name: 'Maroon', hex: '#8E1F24', text: ivory }, pallu: 'maroon', print: [1028, 1370], border: [1284, 1712] },
};
Object.entries(SPEC).forEach(([slug, v], i) => {
  const p = upsert(slug, i + 1);
  const lc = v.colour.name.toLowerCase();
  const P = v.pallu[0].toUpperCase() + v.pallu.slice(1);
  Object.assign(p, common, {
    name: v.name, nameMeaning: v.nameMeaning, descriptor: `${v.colour.name} with a ${v.pallu} zari pallu`,
    description: `${v.name} is ${lc} silk with small floral buti and zari medallions, the same weave as Suhaag, with a ${v.pallu} border and pallu woven with a zari floral jaal.`,
    descriptionStatus: 'draft', colourLine: `${v.colour.name} silk with a ${v.pallu} pallu.`, colourLineStatus: 'draft',
    colours: [v.colour, v.second], unlisted: true,
    attributes: { ...s.attributes, colourway: `${v.colour.name} and ${v.pallu}`, border: `${P} zari floral border`, motif: 'Floral buti and zari medallions', booti: 'Floral booti in silver and coloured silk' },
    closer: { heading: `${v.colour.name}, with ${v.pallu}.`, headingStatus: 'draft', items: [['Colour', v.colour.name], ['Motif', 'Floral buti'], ['Border', `${P} zari`]] },
  });
  delete p.photoshoot; delete p.styling; delete p.stylingStatus; delete p.video; delete p.slideCuts; delete p.detailCircles; delete p.features;
  const act = (name, [w, h], alt, src) => ({ src: `/assets/images/${name}.jpg`, width: w, height: h, ...zoom, alt: `${v.name}: ${alt}`, source: DIR + src });
  p.images = [
    act(`${slug}-folded`, [1650, 2200], `folded open to the ${v.pallu} pallu of zari floral jaal`, `${slug}-folded-orig.jpg`),
    { ...act('suhaag-colours-group', [1650, 2200], 'beside its sister colour, both folded', 'suhaag-colours-group-orig.jpg'), alt: 'Navy with a maroon pallu and purple with a lime green pallu, folded side by side' },
    act(`${slug}-border`, v.border, `the ${v.pallu} border and pallu of zari floral jaal up close`, `${slug}-folded-orig.jpg (close-up, full resolution)`),
    act(`${slug}-print`, v.print, `a zari medallion and floral buti on ${lc} silk up close`, `${slug}-folded-orig.jpg (close-up, full resolution)`),
  ];
  p.crops = { silhouette: { img: 0 }, border: { img: 2 }, borderDetail: { img: 2 }, swatch: { img: 3 }, weave: { img: 3 }, motif: { img: 3, s: 1.4 }, colour: { img: 0 },
    styling: { img: 0, s: 1.3, ox: '50%', oy: '40%', op: '50% 30%' } };
  p.backdrop = { img: 0, pos: '50% 50%', posMobile: '50% 50%' };
});
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
for (const slug of SIBS) { const p = data.products.find((x) => x.slug === slug); console.log(slug, p.unlisted ? 'unlisted' : 'listed', p.images.map((im) => im.src.split('/').pop()).join(' ')); }
