// Jamun in two more colours (client, 23 Nov 2026): the same buta weave as Jamun, each its own named saree and page, linked by
// the colour chips on the PDP (products.json → colourSiblings = ['jamun', 'tamra', 'mirchi'] on all three). The variants are
// `unlisted`: they do not appear on the homepage, shop-all, category, craft or edit pages, or under "you may also like"
// (render/collection.mjs, categories.mjs, craft.mjs, pdp.mjs); they are reached from Jamun's colour row and from search.
// Photos (only folded shots exist): model photography/Jamun colours (23 Nov 2026)/ — 8064×6048 camera files, turned upright
// so the border runs along the bottom, 1650×2200; booti and border close-ups cut from the originals at 1320×1760.
// Name ideas are proposals (Tamra = copper, Mirchi = chilli: red with a green pallu). Price copied from Jamun. Safe to re-run.
// Then: node _tools/set-feature-crops.cjs, make-detail-circles.mjs tamra mirchi, export-shopify.cjs.
// Run from homepage/: node _tools/add-jamun-colours.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SIBS = ['jamun', 'tamra', 'mirchi'];
const DIR = 'model photography/Jamun colours (23 Nov 2026)/';
const SPEC = {
  tamra: {
    name: 'Tamra', nameMeaning: 'copper', colour: { name: 'Copper orange', hex: '#B8461C', text: '#F6F1EA' },
    pallu: 'rani pink', descriptor: 'Copper orange with a rani pink zari pallu',
    files: [['tamra-folded-2.jpg', 'tamra-2.jpg', 'folded, the rani pink zari border along the hem'],
      ['tamra-folded.jpg', 'tamra-1.jpg', 'folded open to the rani pink zari pallu']],
    closeups: [['tamra-booti.jpg', 'tamra-2.jpg', 'silver zari buta on copper orange silk'],
      ['tamra-border.jpg', 'tamra-2.jpg', 'the rani pink border woven with zari florals']],
  },
  mirchi: {
    name: 'Mirchi', nameMeaning: 'chilli', colour: { name: 'Chilli red', hex: '#9E1F1C', text: '#F6F1EA' },
    pallu: 'bottle green', descriptor: 'Chilli red with a bottle green zari pallu',
    files: [['mirchi-folded.jpg', 'mirchi-1.jpg', 'folded, the bottle green zari border along the hem'],
      ['mirchi-folded-2.jpg', 'mirchi-2.jpg', 'folded open to the bottle green zari pallu']],
    closeups: [['mirchi-booti.jpg', 'mirchi-1.jpg', 'silver zari buta on chilli red silk'],
      ['mirchi-border.jpg', 'mirchi-1.jpg', 'the bottle green border woven with zari florals']],
  },
};
const jamun = data.products.find((p) => p.slug === 'jamun');
jamun.colourSiblings = SIBS;
for (const slug of ['tamra', 'mirchi']) {
  const s = SPEC[slug];
  let p = data.products.find((x) => x.slug === slug);
  if (!p) { p = { slug }; data.products.splice(data.products.indexOf(jamun) + SIBS.indexOf(slug), 0, p); }
  const lc = s.colour.name.toLowerCase();
  Object.assign(p, {
    name: s.name, nameMeaning: s.nameMeaning, descriptor: s.descriptor,
    description: `${s.name} is ${lc} silk scattered with silver zari buta, the same weave as Jamun, finished with a ${s.pallu} zari border and pallu.`,
    descriptionStatus: 'draft',
    colourLine: `${s.colour.name} silk with a ${s.pallu} pallu.`, colourLineStatus: 'draft',
    price: jamun.price, priceIsPlaceholder: jamun.priceIsPlaceholder,
    edits: [...jamun.edits], categories: [...jamun.categories],
    colours: [s.colour], colourSiblings: SIBS, unlisted: true, galleryListed: true,
    attributes: { ...jamun.attributes, colourway: s.colour.name, border: `${s.pallu[0].toUpperCase() + s.pallu.slice(1)} zari border`,
      motif: 'Silver zari buta', booti: 'Silver zari booti' },
    looks: [],
    closer: { heading: `${s.colour.name}, edged in ${s.pallu}.`, headingStatus: 'draft', items: [['Colour', s.colour.name], ['Motif', 'Silver buta'], ['Border', `${s.pallu} zari`]] },
  });
  delete p.photoshoot; delete p.styling; delete p.video; delete p.detailCircles; delete p.features;
  const actual = (src, orig, alt) => ({ src: `/assets/images/${src}`, width: src.includes('folded') ? 1650 : 1320, height: src.includes('folded') ? 2200 : 1760,
    role: 'product', fit: 'cover', actual: true, alt: `${s.name}: ${alt}`, source: DIR + orig });
  p.images = [...s.files, ...s.closeups].map(([src, orig, alt]) => actual(src, orig, alt));
  p.crops = { silhouette: { img: 0 }, border: { img: 3 }, borderDetail: { img: 3 }, swatch: { img: 2 }, weave: { img: 2 }, motif: { img: 2, s: 1.4 }, colour: { img: 0 } };
  p.backdrop = { img: 0, pos: '50% 50%', posMobile: '50% 50%' };
  console.log(slug, p.images.length, 'photos');
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
