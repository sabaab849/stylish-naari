// Kairi in three more colours (client, 23 Nov 2026): the same floral buta and paisley border, each its own named saree and page,
// linked by the colour chips (colourSiblings = ['kairi', 'sabza', 'mohini', 'mahavar'] on all four) and `unlisted` (never on the
// homepage, shop all, category, craft or edit pages, or "you may also like"; reached from Kairi's colour row and from search).
// Kairi's reel is removed (the client: it showed this design in another colour). Photos: folded shots only, camera originals
// (8064×6048) in model photography/Kairi colours (23 Nov 2026)/, turned upright, site copies 1650×2200; booti and border close-ups
// cut from the originals at 1320×1760. Names are proposals (Sabza = greenery, Mohini = enchantress, Mahavar = the red dye on the
// feet). Price copied from Kairi. Safe to re-run. Then: set-feature-crops.cjs, make-detail-circles.mjs, export-shopify.cjs.
// Run from homepage/: node _tools/add-kairi-colours.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SIBS = ['kairi', 'sabza', 'mohini', 'mahavar'];
const DIR = 'model photography/Kairi colours (23 Nov 2026)/';
const SPEC = {
  sabza: { name: 'Sabza', nameMeaning: 'greenery', colour: { name: 'Sage green', hex: '#8FA878', text: '#1F1A16' }, pallu: 'lilac',
    folded: ['sabza-folded', 'sabza-folded-2'] },
  mohini: { name: 'Mohini', nameMeaning: 'enchantress', colour: { name: 'Magenta', hex: '#B0207A', text: '#F6F1EA' }, pallu: 'rose pink',
    folded: ['mohini-folded', 'mohini-folded-2', 'mohini-folded-3'] },
  mahavar: { name: 'Mahavar', nameMeaning: 'the red dye painted on the feet', colour: { name: 'Crimson', hex: '#9A1B22', text: '#F6F1EA' }, pallu: 'rose pink',
    folded: ['mahavar-folded', 'mahavar-folded-2'] },
};
const kairi = data.products.find((p) => p.slug === 'kairi');
delete kairi.video;
kairi.colourSiblings = SIBS;
for (const slug of ['sabza', 'mohini', 'mahavar']) {
  const s = SPEC[slug];
  let p = data.products.find((x) => x.slug === slug);
  if (!p) { p = { slug }; data.products.splice(data.products.indexOf(kairi) + SIBS.indexOf(slug), 0, p); }
  const lc = s.colour.name.toLowerCase();
  const Pallu = s.pallu[0].toUpperCase() + s.pallu.slice(1);
  Object.assign(p, {
    name: s.name, nameMeaning: s.nameMeaning, descriptor: `${s.colour.name} with a ${s.pallu} pallu`,
    description: `${s.name} is ${lc} silk with silver floral buta and a paisley zari border, the same weave as Kairi, with a ${s.pallu} pallu.`,
    descriptionStatus: 'draft', colourLine: `${s.colour.name} silk with a ${s.pallu} pallu.`, colourLineStatus: 'draft',
    price: kairi.price, priceIsPlaceholder: kairi.priceIsPlaceholder, edits: [...kairi.edits], categories: [...kairi.categories],
    colours: [s.colour], colourSiblings: SIBS, unlisted: true, galleryListed: true,
    attributes: { ...kairi.attributes, colourway: `${s.colour.name} and ${s.pallu}`, border: 'Paisley zari border', motif: 'Floral buta', booti: 'Silver floral booti' },
    looks: [],
    closer: { heading: `${s.colour.name}, with ${s.pallu}.`, headingStatus: 'draft', items: [['Colour', s.colour.name], ['Motif', 'Floral buta'], ['Border', 'Paisley zari']] },
  });
  delete p.photoshoot; delete p.styling; delete p.video; delete p.detailCircles; delete p.features; delete p.slideCuts;
  const act = (src, w, h, alt) => ({ src: `/assets/images/${src}.jpg`, width: w, height: h, role: 'product', fit: 'cover', actual: true, alt: `${s.name}: ${alt}`, source: DIR + src + '-orig.jpg' });
  p.images = [
    ...s.folded.map((f, i) => act(f, 1650, 2200, i ? `folded, showing the ${s.pallu} pallu` : `the saree, folded, the paisley border along the hem`)),
    { ...act(`${slug}-booti`, 1320, 1760, `a silver floral buta on ${lc} silk`), source: DIR + s.folded[0] + '-orig.jpg (close-up)' },
    { ...act(`${slug}-border`, 1320, 1760, 'the paisley zari border up close'), source: DIR + s.folded[0] + '-orig.jpg (close-up)' },
  ];
  const b = s.folded.length;
  p.crops = { silhouette: { img: 0 }, border: { img: b + 1 }, borderDetail: { img: b + 1 }, swatch: { img: b }, weave: { img: b }, motif: { img: b, s: 1.4 }, colour: { img: 0 } };
  p.backdrop = { img: 0, pos: '50% 50%', posMobile: '50% 50%' };
  console.log(slug, p.images.length, 'photos');
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('kairi video', kairi.video ? 'kept' : 'removed');
