// SN-029 "Katan tanchoi skirt border" in three colours (client, 20 Nov 2026): Kasni (lilac, existing), Basanti (Drive
// "Gold", mustard) and Surkh (Drive "Red"). Each colour is its own named saree and page, linked by the colour row on the
// PDP (products.json → colourSiblings), like Kajal / Kishmish / Gulmohar. Photos: _tools/convert-kasni-colours.cjs.
// Gallery, as Kasni's: model → folded → print → pallu with the border → (Surkh: border close-up) → blouse piece
// (the plain striped body with the border, Drive photo 06 / 05).
// Basanti and Surkh copy Kasni's price, fabric, range, categories and catalogue row (same catalogue SN); Kasni's reel is
// lilac only, so it stays on Kasni. Names and copy are drafts. Safe to re-run.
// Then: node _tools/set-feature-crops.cjs (basanti, surkh listed there), node _tools/export-shopify.cjs.
// Run from homepage/: node _tools/add-kasni-colours.cjs
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const DRIVE = 'Drive: 01 – Banarasi / Premium Silk / Original Product Photos – Pendrive / SN-029 – ';
const SIBS = ['kasni', 'basanti', 'surkh'];
const sn = 'SN-029';
const IMG = path.join(__dirname, '..', 'assets', 'images');

const prod = (file, alt, source, role = 'product') => ({ src: `/assets/images/${file}`, width: 1600, height: 2400, role, fit: 'cover', actual: true, alt, source: DRIVE + source, sn });
// model photos: 1129×1393; 3:4 window at full height (w = 0.75 × 1393 / 1129), centred
const model = (file, alt, source) => ({ src: `/assets/images/${file}`, width: 1129, height: 1393, alt, pos: '50% 30%', frame: { x: 0.0373, y: 0, w: 0.9254, h: 1 }, source });

const SPEC = {
  basanti: {
    name: 'Basanti', nameMeaning: 'the yellow of spring', colour: { name: 'Mustard', hex: '#C9962B', text: '#1F1A16' },
    descriptor: 'Mustard brocade with pink border',
    description: 'Basanti is mustard katan silk brocade woven all over with silver zari florals, with a pink-striped border and pallu panels of multicolour meenakari flowers framed in green.',
    colourLine: 'Mustard, edged in pink.', border: 'Pink-striped border', edits: ['bright', 'festive'],
    closer: [['Colour', 'Mustard'], ['Weave', 'Brocade'], ['Border', 'Pink stripes']],
    images: [
      model('basanti.jpg', 'Basanti — a mustard brocade saree with a pink-striped border and meenakari pallu panels, worn seated on a stone block, the pallu falling to the floor', 'Client, 20 Nov 2026 (model photo, mustard)'),
      prod('basanti-folded.jpg', 'Basanti, the saree itself: mustard brocade, folded, with the meenakari pallu panels and pink-striped border', 'Gold – 01 (primary) – _DSC4669'),
      prod('basanti-print.jpg', 'Basanti up close: silver zari florals on mustard', 'Gold – 05 – _DSC4674'),
      prod('basanti-border.jpg', 'Basanti, the pallu: meenakari flower panels beside the pink-striped border', 'Gold – 03 – _DSC4672'),
      prod('basanti-blouse.jpg', 'Basanti: the blouse piece', 'Gold – 06 – _DSC4675', 'blouse'),
    ],
    border: [3, 40, 88], motif: [3, 62, 15], backdrop: 3,
  },
  surkh: {
    name: 'Surkh', nameMeaning: 'deep red', colour: { name: 'Red', hex: '#B3192B', text: '#F6F1EA' },
    descriptor: 'Red brocade with gold border',
    description: 'Surkh is red katan silk brocade woven all over with silver zari florals, with a gold-striped border and pallu panels of multicolour meenakari flowers on rani pink.',
    colourLine: 'Red, edged in gold.', border: 'Gold-striped border', edits: ['jewel', 'festive'],
    closer: [['Colour', 'Red'], ['Weave', 'Brocade'], ['Border', 'Gold stripes']],
    images: [
      model('surkh.jpg', 'Surkh — a red brocade saree with a gold-striped border and meenakari pallu panels, worn seated on a stone block, the pallu falling to the floor', 'Client, 20 Nov 2026 (model photo, red)'),
      prod('surkh-folded.jpg', 'Surkh, the saree itself: red brocade laid out, with the meenakari pallu panels and gold-striped border', 'Red – 01 – _DSC4676'),
      prod('surkh-print.jpg', 'Surkh up close: silver zari florals on red', 'Red – 04 – _DSC4679'),
      prod('surkh-pallu.jpg', 'Surkh, the pallu: meenakari flower panels on rani pink beside the gold-striped border', 'Red – 02 – _DSC4677'),
      prod('surkh-border.jpg', 'Surkh up close: the gold-striped border beside the meenakari panels', 'Red – 03 – _DSC4678'),
      prod('surkh-blouse.jpg', 'Surkh: the blouse piece', 'Red – 05 – _DSC4680', 'blouse'),
    ],
    border: [4, 35, 85], motif: [3, 60, 18], backdrop: 3,
  },
};

const kasni = data.products.find((p) => p.slug === 'kasni');
if (!kasni) throw new Error('no kasni');
kasni.colourSiblings = SIBS;
for (const slug of SIBS.slice(1)) {
  const s = SPEC[slug];
  for (const im of s.images) if (!fs.existsSync(path.join(IMG, path.basename(im.src)))) throw new Error(`missing ${im.src}: run convert-kasni-colours.cjs`);
  let p = data.products.find((x) => x.slug === slug);
  if (p && !(p.colourSiblings || []).includes('kasni')) throw new Error(`slug ${slug} is already another saree`);
  if (data.products.some((x) => x.slug !== slug && x.name.toLowerCase() === s.name.toLowerCase())) throw new Error(`name already used: ${s.name}`);
  if (!p) {
    p = JSON.parse(JSON.stringify(kasni));
    p.slug = slug;
    data.products.splice(data.products.indexOf(kasni) + SIBS.indexOf(slug), 0, p);
  }
  delete p.video; delete p.aliases; delete p.features; // features: set-feature-crops.cjs
  const [bi, bx, by] = s.border, [mi, mx, my] = s.motif;
  Object.assign(p, {
    name: s.name, nameMeaning: s.nameMeaning, descriptor: s.descriptor,
    description: s.description, descriptionStatus: 'draft',
    colourLine: s.colourLine, colourLineStatus: 'draft',
    colours: [s.colour], edits: s.edits, isNew: true,
    images: s.images,
    crops: {
      silhouette: { img: 0 },
      fall: { img: 0, s: 1.9, ox: '30%', oy: '70%' },
      pallu: { img: 0, s: 1.7, ox: '65%', oy: '75%' },
      border: { img: bi, s: 1.4, ox: `${bx}%`, oy: `${by}%` },
      weave: { img: 2 },
      borderDetail: { img: bi, s: 1.8, ox: `${bx}%`, oy: `${by}%` },
      motif: { img: mi, s: 2.2, ox: `${mx}%`, oy: `${my}%` },
      colour: { img: 0, s: 1.5, ox: '60%', oy: '60%' },
      swatch: { img: 2, s: 2.2, ox: '40%', oy: '40%' },
      styling: { img: 0, s: 2.4, ox: '62%', oy: '12%', op: '50% 12%' },
    },
    backdrop: { img: s.backdrop, pos: '50% 50%', posMobile: '50% 50%' },
    closer: { heading: s.colourLine, headingStatus: 'draft', items: s.closer },
    colourSiblings: SIBS,
    galleryListed: true,
  });
  p.attributes = { ...kasni.attributes, colourway: s.colour.name, border: s.border, blousePiece: 'Included, unstitched (pictured)' };
  console.log(slug, p.images.length, 'photos');
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
