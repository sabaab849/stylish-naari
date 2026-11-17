// Adds six Bandhani sarees (client, Nov 17 2026: "these sarees belong to the Bandhani category", model photography folder) after Anaar.
// Safe to re-run; then run node _tools/set-categories.cjs. Run from homepage/: node _tools/add-bandhani.cjs
// Photos: _tools/convert-bandhani.ps1 (one AI model photograph each → caption "Styled imagery for representation").
// Names and copy are proposals that state only what the photographs show; fabric and price have not been supplied.
// Gallery: model photo → border crop → print crop (crops.border and crops.swatch point at different spots; zoom capped at 2.4).
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name, h) => ({ name, ...tone(h) });
const EVIDENCE = { bandhani: 'Client, November 17 2026: named as Bandhani sarees' };

const S = [
  { slug: 'chunari', name: 'Chunari', nameMeaning: 'a tie-dyed veil', W: 1027, H: 1531,
    source: 'Magenta and Gold Sari Elegance 1.png', frame: { x: 0.04, y: 0.24, w: 0.84, h: 0.7513 }, pos: '45% 60%',
    descriptor: 'Red Bandhani with a painted ivory skirt',
    description: 'Chunari is deep red Bandhani dotted in white, falling into an ivory skirt painted with folk patterns in pink, blue and ochre, finished with a gold tissue border and a sheer ivory tissue pallu.',
    colourLine: 'Red, dotted by hand.', styling: 'Shown with an ivory brocade blouse, gold jhumkas and a low bun.',
    edits: ['festive', 'contrast'], colours: [['Red', '#B0153F'], ['Ivory gold', '#E6D7B0']],
    border: 'Gold tissue border, sheer tissue pallu', motif: 'Bandhani dots; painted folk patterns on the skirt',
    alt: 'Chunari — a red Bandhani saree with a painted ivory skirt and a sheer gold tissue pallu held out, against a warm beige wall',
    crops: { border: { img: 0, s: 2.4, ox: '40%', oy: '92%' }, swatch: { img: 0, s: 2.4, ox: '58%', oy: '42%' },
      pallu: { img: 0, s: 1.8, ox: '22%', oy: '50%' }, motif: { img: 0, s: 2.6, ox: '55%', oy: '72%' }, styling: { img: 0, s: 1.8, ox: '45%', oy: '30%', op: '45% 25%' } },
    closer: { heading: 'Red, dotted by hand.', items: [['Colour', 'Red and ivory gold'], ['Motif', 'Bandhani dots, painted skirt'], ['Border', 'Gold tissue']] } },
  { slug: 'sakhi', name: 'Sakhi', nameMeaning: 'a companion', W: 1024, H: 1536,
    source: 'Contemplative Magenta Sari Portrait 1.png', frame: { x: 0.04, y: 0.14, w: 0.95, h: 0.8444 }, pos: '55% 50%',
    descriptor: 'Magenta Bandhani with a Kalamkari pallu',
    description: 'Sakhi is magenta Bandhani dotted in gold, edged with gota lace, with a royal blue pallu painted in the Kalamkari style with dancing women among trees and flowers.',
    colourLine: 'Magenta, meeting royal blue.', styling: 'Shown with a magenta blouse, a silver necklace, silver jhumkas and silver bangles.',
    edits: ['jewel', 'contrast', 'festive'], colours: [['Magenta', '#B8186E'], ['Royal blue', '#2446A8']],
    border: 'Gota lace edge; blue and ivory painted pallu', motif: 'Bandhani dots; dancing women on the pallu',
    alt: 'Sakhi — a magenta Bandhani saree with a royal blue painted pallu, worn standing beside a white console against a blue wall',
    crops: { border: { img: 0, s: 2.4, ox: '72%', oy: '62%' }, swatch: { img: 0, s: 2.4, ox: '45%', oy: '50%' },
      pallu: { img: 0, s: 1.8, ox: '72%', oy: '78%' }, motif: { img: 0, s: 2.6, ox: '70%', oy: '75%' }, styling: { img: 0, s: 1.8, ox: '45%', oy: '25%', op: '45% 20%' } },
    closer: { heading: 'Magenta, meeting royal blue.', items: [['Colour', 'Magenta and royal blue'], ['Motif', 'Bandhani dots, painted dancers'], ['Border', 'Gota lace']] } },
  { slug: 'jamuni', name: 'Jamuni', nameMeaning: 'the purple of the jamun fruit', W: 1006, H: 1564,
    source: 'Elegant Magenta Saree Portrait (4) 1.png', frame: { x: 0, y: 0.11, w: 1, h: 0.8576 }, pos: '50% 45%',
    descriptor: 'Violet Bandhani with a white floral border',
    description: 'Jamuni is bright violet Bandhani dotted in white, framed by a white floral border and finished with a pallu of square panels, each centred on a flower medallion.',
    colourLine: 'Violet, lit with white.', styling: 'Shown with an ivory blouse, small studs and a low bun.',
    edits: ['jewel', 'bright'], colours: [['Violet', '#9B1FB5'], ['White', '#E9D6EE']],
    border: 'White floral border', motif: 'Bandhani dots; medallion panels on the pallu',
    alt: 'Jamuni — a violet Bandhani saree with a white floral border, the panelled pallu swept out beside a brass pot on a rug',
    crops: { border: { img: 0, s: 2.4, ox: '70%', oy: '70%' }, swatch: { img: 0, s: 2.4, ox: '45%', oy: '45%' },
      pallu: { img: 0, s: 1.8, ox: '70%', oy: '68%' }, motif: { img: 0, s: 2.6, ox: '68%', oy: '68%' }, styling: { img: 0, s: 1.8, ox: '40%', oy: '25%', op: '40% 20%' } },
    closer: { heading: 'Violet, lit with white.', items: [['Colour', 'Violet and white'], ['Motif', 'Bandhani dots, medallion pallu'], ['Border', 'White floral']] } },
  { slug: 'bindiya', name: 'Bindiya', nameMeaning: 'a small dot', W: 1015, H: 1550,
    source: 'Elegant Purple Saree Portrait (2) 1.png', frame: { x: 0, y: 0.12, w: 1, h: 0.8731 }, pos: '50% 45%',
    descriptor: 'Plum Bandhani with gold tissue checks',
    description: 'Bindiya is deep plum Bandhani dotted in gold, with a gold tissue border and a pallu of gold tissue bands and checks, each square holding a cluster of dots.',
    colourLine: 'Plum, checked in gold.', styling: 'Shown with a plum blouse and a gemstone choker.',
    edits: ['jewel', 'festive'], colours: [['Plum', '#4E1844'], ['Zari gold', '#C9A26A']],
    border: 'Gold tissue border', motif: 'Bandhani dots; gold tissue checks on the pallu',
    alt: 'Bindiya — a plum Bandhani saree with a gold tissue border and a checked pallu, worn against a wooden lattice screen',
    crops: { border: { img: 0, s: 2.4, ox: '60%', oy: '95%' }, swatch: { img: 0, s: 2.4, ox: '40%', oy: '40%' },
      pallu: { img: 0, s: 1.8, ox: '70%', oy: '72%' }, motif: { img: 0, s: 2.6, ox: '70%', oy: '72%' }, styling: { img: 0, s: 1.8, ox: '45%', oy: '25%', op: '45% 20%' } },
    closer: { heading: 'Plum, checked in gold.', items: [['Colour', 'Plum and gold'], ['Motif', 'Bandhani dots, tissue checks'], ['Border', 'Gold tissue']] } },
  { slug: 'gulabo', name: 'Gulabo', nameMeaning: 'rosy, like a rose', W: 1024, H: 1536,
    source: 'Heritage Steps in Magenta Saree 1.png', frame: { x: 0, y: 0.08, w: 1, h: 0.8889 }, pos: '50% 50%',
    descriptor: 'Rose pink Bandhani with a white jaal pallu',
    description: 'Gulabo is rose pink Bandhani dotted in white, with a white paisley border and a pallu filled with a jaal of flowering stems.',
    colourLine: 'Rose pink, traced in white.', styling: 'Shown with a backless rose blouse tied at the neck, gold studs and a low bun.',
    edits: ['soft', 'festive'], colours: [['Rose pink', '#B8457E'], ['White', '#F0E3E8']],
    border: 'White paisley border', motif: 'Bandhani dots; a floral jaal on the pallu',
    alt: 'Gulabo — a rose pink Bandhani saree with a white floral pallu streaming behind, on old stone steps below a sandstone wall',
    crops: { border: { img: 0, s: 2.4, ox: '70%', oy: '85%' }, swatch: { img: 0, s: 2.4, ox: '45%', oy: '45%' },
      pallu: { img: 0, s: 1.8, ox: '70%', oy: '82%' }, motif: { img: 0, s: 2.6, ox: '68%', oy: '82%' }, styling: { img: 0, s: 1.8, ox: '42%', oy: '25%', op: '42% 20%' } },
    closer: { heading: 'Rose pink, traced in white.', items: [['Colour', 'Rose pink and white'], ['Motif', 'Bandhani dots, floral jaal'], ['Border', 'White paisley']] } },
  { slug: 'lavanya', name: 'Lavanya', nameMeaning: 'grace', W: 1101, H: 1429,
    source: 'Lavender Paisley Saree Portrait 1.png', frame: { x: 0.0266, y: 0, w: 0.9734, h: 1 }, pos: '55% 45%',
    descriptor: 'Lavender Bandhani with meenakari paisleys',
    description: 'Lavanya is lavender Bandhani scattered with multicolour meenakari paisleys in a zari jaal, bordered in silver zari dotted with red and green, with a pallu of coloured leaf motifs.',
    colourLine: 'Lavender, scattered with colour.', styling: 'Shown with loose waves and bare feet.',
    edits: ['soft'], colours: [['Lavender', '#B9A0DC'], ['Silver zari', '#D8D2CF']],
    border: 'Silver zari border with red and green dots', motif: 'Bandhani dots; meenakari paisleys, leaf motifs on the pallu',
    alt: 'Lavanya — a lavender Bandhani saree with multicolour paisleys and a silver zari border, worn seated on a wooden bench',
    crops: { border: { img: 0, s: 2.4, ox: '55%', oy: '60%' }, swatch: { img: 0, s: 2.4, ox: '72%', oy: '40%' },
      pallu: { img: 0, s: 1.8, ox: '78%', oy: '78%' }, motif: { img: 0, s: 2.6, ox: '75%', oy: '78%' }, styling: { img: 0, s: 1.8, ox: '50%', oy: '20%', op: '50% 15%' } },
    closer: { heading: 'Lavender, scattered with colour.', items: [['Colour', 'Lavender and silver'], ['Motif', 'Bandhani dots, meenakari paisleys'], ['Border', 'Silver zari']] } },
];

const add = S.map((s) => ({
  slug: s.slug, name: s.name, nameMeaning: s.nameMeaning, descriptor: s.descriptor,
  description: s.description, descriptionStatus: 'draft',
  colourLine: s.colourLine, colourLineStatus: 'draft', styling: s.styling, stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: s.edits, categories: ['bandhani'], categoryEvidence: EVIDENCE,
  colours: s.colours.map(([n, h]) => colour(n, h)),
  attributes: { fabric: null, colourway: s.colours[0][0], border: s.border, motif: s.motif, length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [{ src: `/assets/images/${s.slug}.jpg`, width: s.W, height: s.H, pos: s.pos, alt: s.alt, source: `model photography/${s.source}`, frame: s.frame }],
  crops: { silhouette: { img: 0 }, colour: { img: 0, s: 1.4, ox: '50%', oy: '60%' }, ...s.crops },
  looks: [],
  backdrop: { img: 0, pos: s.pos, posMobile: s.pos },
  closer: { heading: s.closer.heading, headingStatus: 'draft', items: s.closer.items },
}));

const slugs = new Set(add.map((p) => p.slug));
d.products = d.products.filter((p) => !slugs.has(p.slug));
const at = d.products.findIndex((p) => p.slug === 'anaar');
d.products.splice(at + 1, 0, ...add);
d._notes.bandhani = 'Chunari, Sakhi, Jamuni, Bindiya, Gulabo and Lavanya: the six Bandhani model photographs of November 17 (model photography folder). Names and copy are proposals; fabric and price have not been supplied.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', [...slugs].join(', '), 'after anaar at', at + 1);
