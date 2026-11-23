// SN-002 "Katan alfi lion motif" in three colours (client, 20 Nov 2026): Kajal (black), Kishmish (purple), Gulmohar (pink).
// Each colour is its own named saree with its own page; the three are linked by a colour row on the PDP
// (products.json → colourSiblings, render/pdp.mjs → renderColourSiblings). Photos: _tools/convert-lion-colours.cjs.
// Gallery for all three: model photo → folded → pallu → lions beside the border → blouse piece (the butti cloth with the
// border, Drive photo 04/05; the client's model photos show the butti blouse). Kajal's old photo 03 "blouse" was the
// plain body with lions, and its border close-up is now covered by photo 01 in full, so both are dropped.
// Kishmish and Gulmohar copy Kajal's price, fabric, range, edits and catalogue row (same catalogue SN). Safe to re-run.
// Then: node _tools/set-feature-crops.cjs (kishmish, gulmohar listed there).  Run from homepage/: node _tools/add-lion-colours.cjs
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const DRIVE = 'Drive: 01 – Banarasi / Premium Silk / Original Product Photos – Pendrive / SN-002 – ';
const SIBS = ['kajal', 'kishmish', 'gulmohar'];

const SPEC = {
  kajal: {
    name: 'Kajal', nameMeaning: 'kohl', colour: { name: 'Black', hex: '#1C1616', text: '#F6F1EA' }, drive: 'Black',
    model: ['kajal-model.jpg', 'Client, 20 Nov 2026 (model photo, black, seated)'],
    folded: ['kajal-folded.jpg', 'Client, 20 Nov 2026 (folded photo, black; not in Drive)'],
    files: ['kajal-pallu.jpg', '02 – _DSC4618', 'kajal-original.jpg', '01 – _DSC4617', 'kajal-blouse.jpg', '04 – _DSC4620'],
    colourLine: 'Black silk, lit with gold and silver.', closer: 'Black, in gold and silver.',
  },
  kishmish: {
    name: 'Kishmish', nameMeaning: 'raisin', colour: { name: 'Plum', hex: '#4A2343', text: '#F6F1EA' }, drive: 'Purple',
    model: ['kishmish-seated.jpg', 'Client, 20 Nov 2026 (model photo, purple, seated)'],
    folded: ['kishmish-folded.jpg', `${DRIVE}Purple – 01 – _DSC4621`],
    files: ['kishmish-pallu.jpg', '02 – _DSC4622', 'kishmish-border.jpg', '03 – _DSC4623', 'kishmish-blouse.jpg', '04 – _DSC4624'],
    colourLine: 'Deep plum silk, lit with gold and silver.', closer: 'Plum, in gold and silver.',
  },
  gulmohar: {
    name: 'Gulmohar', nameMeaning: 'the flame tree in bloom', colour: { name: 'Rani pink', hex: '#A8174A', text: '#F6F1EA' }, drive: 'Pink',
    model: ['gulmohar-seated.jpg', 'Client, 20 Nov 2026 (model photo, pink, seated)'],
    folded: ['gulmohar-folded.jpg', `${DRIVE}Pink – 01 (primary) – _DSC4611`],
    files: ['gulmohar-pallu.jpg', '02 – _DSC4612', 'gulmohar-border.jpg', '03 – _DSC4613', 'gulmohar-blouse.jpg', '05 – _DSC4615'],
    colourLine: 'Rani pink silk, lit with gold and silver.', closer: 'Rani pink, in gold and silver.',
  },
};
// focal points on the border photo (slide 4) for the crops used further down the PDP
const BORDER = { kajal: [62, 62, 45, 50], kishmish: [40, 76, 50, 55], gulmohar: [65, 75, 30, 65] };

const kajal = data.products.find((p) => p.slug === 'kajal');
for (const slug of SIBS) {
  const s = SPEC[slug];
  let p = data.products.find((x) => x.slug === slug);
  if (!p) {
    p = JSON.parse(JSON.stringify(kajal));
    p.slug = slug;
    delete p.video; delete p.aliases;
    data.products.splice(data.products.indexOf(kajal) + SIBS.indexOf(slug), 0, p);
  }
  const lc = s.colour.name.toLowerCase();
  Object.assign(p, {
    name: s.name, nameMeaning: s.nameMeaning,
    descriptor: `${s.colour.name} silk with lion motifs`,
    description: `${s.name} is ${lc} katan silk with woven lions and a floral border in gold and silver, a buti blouse piece and a gold zari pallu.`,
    descriptionStatus: 'draft',
    colourLine: s.colourLine, colourLineStatus: 'draft',
    colours: [s.colour],
    colourSiblings: SIBS, unlisted: true,
  });
  p.attributes = { ...p.attributes, colourway: s.colour.name, motif: 'Lion motifs', border: 'Floral border in gold and silver', blousePiece: 'Included, unstitched (pictured)' };
  const sn = 'SN-002';
  const [pallu, palluSrc, border, borderSrc, blouse, blouseSrc] = s.files;
  p.images = [
    { src: `/assets/images/${s.model[0]}`, width: 1024, height: 1536,
      alt: `${s.name}, a ${lc} silk saree with a gold and silver floral border and woven lions on the pallu, worn seated on a red rug beside white flowers`,
      pos: '50% 70%', frame: { x: 0, y: 0.1111, w: 1, h: 0.8889 }, source: s.model[1] },
    { src: `/assets/images/${s.folded[0]}`, width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true,
      alt: `${s.name}, the saree itself: ${lc} silk, folded`, source: s.folded[1], sn },
    { src: `/assets/images/${pallu}`, width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true,
      alt: `${s.name}: the gold zari pallu`, source: `${DRIVE}${s.drive} – ${palluSrc}`, sn },
    { src: `/assets/images/${border}`, width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true,
      alt: `${s.name} up close: woven lions beside the floral border`, source: `${DRIVE}${s.drive} – ${borderSrc}`, sn },
    { src: `/assets/images/${blouse}`, width: 1600, height: 2400, role: 'blouse', fit: 'cover', actual: true,
      alt: `${s.name}: the blouse piece`, source: `${DRIVE}${s.drive} – ${blouseSrc}`, sn },
  ];
  const [bx, by, mx, my] = BORDER[slug];
  p.crops = {
    silhouette: { img: 0 },
    fall: { img: 0, s: 1.8, ox: '75%', oy: '85%' },
    pallu: { img: 0, s: 1.9, ox: '78%', oy: '62%' },
    border: { img: 3, s: 1.4, ox: `${bx}%`, oy: `${by}%` },
    weave: { img: 4 },
    borderDetail: { img: 3, s: 1.8, ox: `${bx}%`, oy: `${by}%` },
    motif: { img: 3, s: 2.4, ox: `${mx}%`, oy: `${my}%` },
    colour: { img: 0, s: 1.6, ox: '40%', oy: '45%' },
    swatch: { img: 4, s: 2.2, ox: '40%', oy: '40%' },
    styling: { img: 0, s: 1.9, ox: '44%', oy: '33%', op: '50% 30%' },
  };
  p.backdrop = { img: 3, pos: '50% 50%', posMobile: '50% 50%' };
  p.closer = { heading: s.closer, headingStatus: 'draft', items: [['Colour', s.colour.name], ['Motif', 'Lions'], ['Border', 'Gold and silver florals']] };
  console.log(slug, p.images.length, 'photos');
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
