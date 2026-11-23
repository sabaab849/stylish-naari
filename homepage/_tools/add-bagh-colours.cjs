// Bagh in three more colours (client, 23 Nov 2026): the same tree-of-life jaal, each its own named saree and page, linked by the colour
// chips (colourSiblings = ['bagh','angoor','kajri','neembu'] on all four) and `unlisted` (never on the homepage, shop all, category, craft
// or edit pages, or "you may also like"; reached from Bagh's colour row and from search). Gallery of each variant = its folded photo (the
// client's 8064×6048 camera file in model photography/Bagh colours (23 Nov 2026)/, turned upright, 1650×2200) → print close-up → border
// close-up (both cut from the original at 1320×1760, no sharpening) → the shared reel (bagh-colours-reel.mp4: "bagh variaitons.MOV",
// enhance-reel.sh). Bagh keeps its photos and gets the same reel last. Names are proposals (Angoor = grape, Kajri = monsoon-dark,
// Neembu = lime). Price copied from Bagh. Safe to re-run. Then: set-feature-crops.cjs, make-detail-circles.mjs bagh angoor kajri neembu,
// make-slide-cuts.mjs, export-shopify.cjs. Run from homepage/: node _tools/add-bagh-colours.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const SIBS = ['bagh', 'angoor', 'kajri', 'neembu'];
const DIR = 'model photography/Bagh colours (23 Nov 2026)/';
const SPEC = {
  angoor: { name: 'Angoor', nameMeaning: 'grape', colour: { name: 'Purple', hex: '#4E1F6E', text: '#F6F1EA' }, pallu: 'rose pink' },
  kajri: { name: 'Kajri', nameMeaning: 'dark monsoon clouds', colour: { name: 'Black', hex: '#1B1A1E', text: '#F6F1EA' }, pallu: 'red' },
  neembu: { name: 'Neembu', nameMeaning: 'lime', colour: { name: 'Lime', hex: '#C3D12B', text: '#1F1A16' }, pallu: 'bottle green' },
};
const bagh = data.products.find((p) => p.slug === 'bagh');
const video = { src: '/assets/video/bagh-colours-reel.mp4', srcSmall: '/assets/video/bagh-colours-reel-small.mp4', poster: '/assets/images/bagh-colours-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ['model photography/bagh variaitons.MOV (all of it, 4.8 s); enhanced by _tools/enhance-reel.sh (SMOOTH=15, highlight roll-off), 23 Nov 2026; no sound'] };
if (fs.existsSync('assets/video/bagh-colours-reel.mp4')) bagh.video = { ...video };
bagh.colourSiblings = SIBS;
for (const slug of ['angoor', 'kajri', 'neembu']) {
  const s = SPEC[slug];
  let p = data.products.find((x) => x.slug === slug);
  if (!p) { p = { slug }; data.products.splice(data.products.indexOf(bagh) + SIBS.indexOf(slug), 0, p); }
  const lc = s.colour.name.toLowerCase();
  const Pallu = s.pallu[0].toUpperCase() + s.pallu.slice(1);
  Object.assign(p, {
    name: s.name, nameMeaning: s.nameMeaning, descriptor: `${s.colour.name} with a ${s.pallu} zari pallu`,
    description: `${s.name} is ${lc} silk woven with a silver and gold tree-of-life jaal, the same weave as Bagh, finished with a ${s.pallu} zari border and pallu.`,
    descriptionStatus: 'draft', colourLine: `${s.colour.name} silk with a ${s.pallu} pallu.`, colourLineStatus: 'draft',
    price: bagh.price, priceIsPlaceholder: bagh.priceIsPlaceholder, edits: [...bagh.edits], categories: [...bagh.categories],
    colours: [s.colour], colourSiblings: SIBS, unlisted: true, galleryListed: true,
    attributes: { ...bagh.attributes, colourway: s.colour.name, border: `${Pallu} zari border`, motif: 'Tree-of-life jaal', booti: 'Silver floral booti' },
    looks: [],
    closer: { heading: `${s.colour.name}, edged in ${s.pallu}.`, headingStatus: 'draft', items: [['Colour', s.colour.name], ['Motif', 'Tree-of-life jaal'], ['Border', `${s.pallu} zari`]] },
  });
  delete p.photoshoot; delete p.styling; delete p.detailCircles; delete p.features; delete p.slideCuts; delete p.video;
  const act = (suffix, w, h, alt, extra = {}) => ({ src: `/assets/images/${slug}-${suffix}.jpg`, width: w, height: h, role: 'product', fit: 'cover', actual: true, alt: `${s.name}: ${alt}`, source: `${DIR}${slug}.jpg`, ...extra });
  p.images = [
    act('folded', 1650, 2200, `folded open to the ${s.pallu} zari pallu`),
    act('print', 1320, 1760, `the silver and gold tree-of-life jaal on ${lc} silk`),
    act('border', 1320, 1760, `the ${s.pallu} zari border up close`),
  ];
  p.crops = { silhouette: { img: 0 }, border: { img: 2 }, borderDetail: { img: 2 }, swatch: { img: 1 }, weave: { img: 1 }, motif: { img: 1, s: 1.4 }, colour: { img: 0 },
    styling: { img: 0, s: 1.3, ox: '50%', oy: '40%', op: '50% 30%' } };
  p.backdrop = { img: 0, pos: '50% 50%', posMobile: '50% 50%' };
  if (fs.existsSync('assets/video/bagh-colours-reel.mp4')) p.video = { ...video };
  console.log(slug, p.images.length, 'photos', p.video ? '+ reel' : '(no reel yet)');
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
