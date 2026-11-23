// Shyama + four colours (client, 23 Nov 2026): a new Banarasi saree — black silk with silver floral buti and a rani pink zari border —
// and the same weave in four more colours, each its own named saree and page, linked by the colour chips
// (colourSiblings = SIBS on all five). Only Shyama is listed; the four colours are `unlisted` (never on the homepage, shop all, category,
// craft or edit pages, or "you may also like"; reached from Shyama's colour row and from search).
// Photos: model photography/Shyama colours (23 Nov 2026)/
//   Shyama: shyama-model.png (1087×1446 chat copy) → border zoom → print zoom, both cut from it (light nlmeans, spline, no sharpening).
//   Colours: two folded photos each (8064×6048 camera files, turned upright; site copies 1650×2200) → border close-up → print close-up,
//   cut from the originals at full resolution (1148–1388 source px across, scaled down to 1320×1760 with Lanczos, no sharpening):
//     kanha-border  kanha-folded   .215 .70 .22   kanha-print   kanha-folded   .54  .35 .22
//     mehroon-border mehroon-folded .215 .65 .22  mehroon-print mehroon-folded .485 .31 .19
//     phagun-border phagun-folded  .245 .63 .23   phagun-print  phagun-folded-2 .51 .30 .20
//     sumbul-border sumbul-folded  .255 .72 .20   sumbul-print  sumbul-folded-2 .40 .47 .21   (x, y, width as shares of the upright photo)
// Names are proposals (Shyama = the dusky one, Kanha = Krishna, Mehroon = maroon, Phagun = the month of Holi, Sumbul = hyacinth).
// Price is a placeholder copied from Neel. Safe to re-run. Then: set-feature-crops.cjs, make-detail-circles.mjs <slugs>,
// make-slide-cuts.mjs, export-shopify.cjs. Run from homepage/: node _tools/add-shyama-colours.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SIBS = ['shyama', 'kanha', 'mehroon', 'phagun', 'sumbul'];
const DIR = 'model photography/Shyama colours (23 Nov 2026)/';
const neel = data.products.find((p) => p.slug === 'neel');
const after = data.products.find((p) => p.slug === 'neembu') || neel;
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

// Shyama (listed)
const s = upsert('shyama', 0);
Object.assign(s, common, {
  name: 'Shyama', nameMeaning: 'the dusky one', descriptor: 'Black silk with a rani pink zari border',
  description: 'Shyama is black silk woven with silver floral buti, finished with a rani pink border and pallu edged in silver zari.',
  descriptionStatus: 'draft', colourLine: 'Black silk, edged in rani pink.', colourLineStatus: 'draft',
  styling: 'Shown with red roses and jasmine in the hair, an oxidised silver choker, long necklace and wide silver cuffs.', stylingStatus: 'draft',
  colours: [{ name: 'Black', hex: '#1A1819', text: ivory }, { name: 'Rani pink', hex: '#D6206F', text: ivory }],
  attributes: { fabric: 'Silk', colourway: 'Black and rani pink', border: 'Rani pink zari border', motif: 'Floral buti', length: null, blousePiece: null,
    weave: null, origin: null, availability: null, booti: 'Silver floral booti' },
  closer: { heading: 'Black, edged in rani pink.', headingStatus: 'draft', items: [['Colour', 'Black'], ['Motif', 'Floral buti'], ['Border', 'Rani pink zari']] },
  photoshoot: true,
});
delete s.unlisted; delete s.video; delete s.slideCuts; delete s.detailCircles;
const zoom = { role: 'product', fit: 'cover', actual: true };
s.images = [
  { src: '/assets/images/shyama.jpg', width: 1087, height: 1446, real: true,
    alt: 'Shyama worn seated before a deep red disc: black silk with silver floral buti and a rani pink zari border, roses in the hair',
    source: DIR + 'shyama-model.png' },
  { src: '/assets/images/shyama-border-zoom.jpg', width: 1320, height: 1760, ...zoom,
    alt: 'Shyama border up close: the rani pink border with silver zari beside the black body and its buti',
    source: DIR + 'shyama-model.png (cropped x700 y1000 290×387, light denoise, spline)' },
  { src: '/assets/images/shyama-print-zoom.jpg', width: 1320, height: 1760, ...zoom,
    alt: 'Shyama buti up close: silver floral buti woven over the black silk',
    source: DIR + 'shyama-model.png (cropped x520 y830 280×373, light denoise, spline)' },
];
s.crops = { silhouette: { img: 0 }, border: { img: 1 }, borderDetail: { img: 1 }, swatch: { img: 2 }, weave: { img: 2 }, motif: { img: 2, s: 1.4 },
  colour: { img: 0, s: 1.6, ox: '60%', oy: '70%' }, styling: { img: 0, s: 1.3, ox: '55%', oy: '35%', op: '50% 20%' } };
s.backdrop = { img: 0, pos: '55% 45%', posMobile: '55% 45%' };

// The four colours (unlisted)
const SPEC = {
  kanha: { name: 'Kanha', nameMeaning: 'Krishna, the peacock-feathered', colour: { name: 'Purple', hex: '#4B2C8F', text: ivory },
    second: { name: 'Lime', hex: '#D4E021', text: ink }, border: 'lime yellow' },
  mehroon: { name: 'Mehroon', nameMeaning: 'maroon', colour: { name: 'Maroon', hex: '#8A1E1E', text: ivory },
    second: { name: 'Pista green', hex: '#B5CDA8', text: ink }, border: 'pista green' },
  phagun: { name: 'Phagun', nameMeaning: 'the spring month of Holi', colour: { name: 'Magenta', hex: '#B8186E', text: ivory },
    second: { name: 'Orange', hex: '#E8641E', text: ink }, border: 'orange' },
  sumbul: { name: 'Sumbul', nameMeaning: 'hyacinth', colour: { name: 'Lilac', hex: '#B591C8', text: ink },
    second: { name: 'Lime', hex: '#D4E021', text: ink }, border: 'lime yellow' },
};
Object.entries(SPEC).forEach(([slug, v], i) => {
  const p = upsert(slug, i + 1);
  const lc = v.colour.name.toLowerCase();
  const B = v.border[0].toUpperCase() + v.border.slice(1);
  Object.assign(p, common, {
    name: v.name, nameMeaning: v.nameMeaning, descriptor: `${v.colour.name} with a ${v.border} zari border`,
    description: `${v.name} is ${lc} silk woven with silver floral buti, the same weave as Shyama, with a ${v.border} border and pallu edged in zari.`,
    descriptionStatus: 'draft', colourLine: `${v.colour.name} silk with a ${v.border} border and pallu.`, colourLineStatus: 'draft',
    colours: [v.colour, v.second], unlisted: true,
    attributes: { ...s.attributes, colourway: `${v.colour.name} and ${v.border}`, border: `${B} zari border` },
    closer: { heading: `${v.colour.name}, edged in ${v.border}.`, headingStatus: 'draft', items: [['Colour', v.colour.name], ['Motif', 'Floral buti'], ['Border', `${B} zari`]] },
  });
  delete p.photoshoot; delete p.styling; delete p.stylingStatus; delete p.video; delete p.slideCuts; delete p.detailCircles; delete p.features;
  const act = (name, w, h, alt, src) => ({ src: `/assets/images/${name}.jpg`, width: w, height: h, ...zoom, alt: `${v.name}: ${alt}`, source: DIR + src });
  p.images = [
    act(`${slug}-folded`, 1650, 2200, `folded, silver floral buti on ${lc} silk above the ${v.border} border`, `${slug}-folded-orig.jpg`),
    act(`${slug}-folded-2`, 1650, 2200, `folded open to the ${v.border} pallu`, `${slug}-folded-2-orig.jpg`),
    act(`${slug}-border`, 1320, 1760, `the ${v.border} border and its zari edging up close`, `${slug}-folded-orig.jpg (close-up, full resolution)`),
    act(`${slug}-print`, 1320, 1760, `a silver floral buti on ${lc} silk up close`, `${slug}-${slug === 'phagun' || slug === 'sumbul' ? 'folded-2' : 'folded'}-orig.jpg (close-up, full resolution)`),
  ];
  p.crops = { silhouette: { img: 0 }, border: { img: 2 }, borderDetail: { img: 2 }, swatch: { img: 3 }, weave: { img: 3 }, motif: { img: 3, s: 1.4 }, colour: { img: 0 },
    styling: { img: 1, s: 1.3, ox: '50%', oy: '40%', op: '50% 30%' } };
  p.backdrop = { img: 0, pos: '50% 50%', posMobile: '50% 50%' };
});
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
for (const slug of SIBS) { const p = data.products.find((x) => x.slug === slug); console.log(slug, p.unlisted ? 'unlisted' : 'listed', p.images.map((im) => im.src.split('/').pop()).join(' ')); }
