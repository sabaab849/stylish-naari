// Adds five Kalamkari sarees (client, Nov 17 2026: "these are Kalamkari sarees", model photography folder) after Leela.
// Safe to re-run; then run node _tools/set-categories.cjs. Run from homepage/: node _tools/add-kalamkari.cjs
// Photos: _tools/convert-kalamkari.ps1 (one AI model photograph each → caption "Styled imagery for representation").
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
const EVIDENCE = { kalamkari: 'Client, November 17 2026: named as Kalamkari sarees' };

const S = [
  { slug: 'veena', name: 'Veena', nameMeaning: 'the stringed instrument of Saraswati', W: 1024, H: 1536,
    source: 'Flowing Folk-Art Saree Portrait.png', frame: { x: 0, y: 0.02, w: 1, h: 0.8889 }, pos: '50% 40%',
    descriptor: 'Violet Kalamkari with a green zari border',
    description: 'Veena is violet Kalamkari scattered with small flowers and vines, with a pallu of painted cattle and a goddess on a swan, edged in a broad green zari border and finished with tassels.',
    colourLine: 'Violet, edged in parrot green.', styling: 'Shown with gold jhumkas, a gold choker and gold heels.',
    edits: ['bright', 'contrast'], colours: [['Violet', '#6E5AA8'], ['Parrot green', '#2E8B3A']],
    border: 'Green zari border, tasselled pallu', motif: 'Kalamkari: flowers and vines, cattle and a goddess on the pallu',
    alt: 'Veena — a violet Kalamkari saree with a green zari border, the painted pallu swept out wide in a pale studio',
    crops: { border: { img: 0, s: 2.4, ox: '25%', oy: '100%' }, swatch: { img: 0, s: 2.4, ox: '40%', oy: '22%' },
      pallu: { img: 0, s: 1.8, ox: '65%', oy: '62%' }, motif: { img: 0, s: 2.6, ox: '62%', oy: '60%' }, styling: { img: 0, s: 1.8, ox: '45%', oy: '10%', op: '50% 0%' } },
    closer: { heading: 'Violet, sung in colour.', items: [['Colour', 'Violet and green'], ['Motif', 'Painted flowers, a goddess on the pallu'], ['Border', 'Green zari']] } },
  { slug: 'darbar', name: 'Darbar', nameMeaning: 'a royal court', W: 1055, H: 1491,
    source: 'Contemplative Woman in a Bespoke Sari.png', frame: { x: 0, y: 0.0566, w: 1, h: 0.9434 }, pos: '50% 60%',
    descriptor: 'Black Kalamkari with a magenta zari border',
    description: 'Darbar is black Kalamkari painted with rows of elephants, horses and lions in pink, green, orange and yellow, with a green pallu of birds and blossoms, edged in magenta zari.',
    colourLine: 'Black, crowded with colour.', styling: 'Shown with a black blouse, small studs and a single gold bangle.',
    edits: ['jewel', 'contrast', 'festive'], colours: [['Black', '#1E1B1A'], ['Magenta', '#A8336B']],
    border: 'Magenta zari border', motif: 'Kalamkari: elephants, horses and lions; birds on a green pallu',
    alt: 'Darbar — a black Kalamkari saree with painted animals and a magenta border, worn seated in a room hung with a painted tapestry',
    crops: { border: { img: 0, s: 2.4, ox: '5%', oy: '98%' }, swatch: { img: 0, s: 2.4, ox: '55%', oy: '42%' },
      pallu: { img: 0, s: 1.8, ox: '80%', oy: '80%' }, motif: { img: 0, s: 2.6, ox: '80%', oy: '78%' }, styling: { img: 0, s: 1.8, ox: '40%', oy: '30%', op: '40% 20%' } },
    closer: { heading: 'A court of painted animals.', items: [['Colour', 'Black and magenta'], ['Motif', 'Painted animals, birds on the pallu'], ['Border', 'Magenta zari']] } },
  { slug: 'chitra', name: 'Chitra', nameMeaning: 'a picture', W: 1025, H: 1534,
    source: 'Elegant Kalamkari Saree Portrait.png', frame: { x: 0, y: 0.07, w: 1, h: 0.8911 }, pos: '50% 40%',
    descriptor: 'Black floral Kalamkari with a deer pallu',
    description: 'Chitra is black Kalamkari covered in flowering vines, with an ivory pallu of deer beneath a tree, edged in a red and orange zari border and finished with tassels.',
    colourLine: 'Black, in full bloom.', styling: 'Shown with a gold chain and loose waves.',
    edits: ['contrast'], colours: [['Black', '#1F1C24'], ['Vermilion', '#C8521E']],
    border: 'Red and orange zari border, tasselled pallu', motif: 'Kalamkari: flowering vines, deer on the pallu',
    alt: 'Chitra — a black floral Kalamkari saree with a red and orange border and a deer pallu, worn from behind against an olive backdrop',
    crops: { border: { img: 0, s: 2.4, ox: '66%', oy: '45%' }, swatch: { img: 0, s: 2.4, ox: '45%', oy: '30%' },
      pallu: { img: 0, s: 1.8, ox: '55%', oy: '78%' }, motif: { img: 0, s: 2.4, ox: '55%', oy: '76%' }, styling: { img: 0, s: 1.8, ox: '50%', oy: '8%', op: '50% 0%' } },
    closer: { heading: 'Black, in full bloom.', items: [['Colour', 'Black and vermilion'], ['Motif', 'Flowering vines, deer on the pallu'], ['Border', 'Red and orange zari']] } },
  { slug: 'gajraj', name: 'Gajraj', nameMeaning: 'the king of elephants', W: 1079, H: 1457,
    source: 'Seated in a Vivid Elephant-Print Sari.png', frame: { x: 0, y: 0.18, w: 0.83, h: 0.8196 }, pos: '40% 70%',
    descriptor: 'Black Kalamkari with an elephant pallu',
    description: 'Gajraj is black Kalamkari printed with a jaal of leaves and flowers, with a magenta pallu of painted elephants, edged in a broad saffron zari border with tassels.',
    colourLine: 'Black, carried by elephants.', styling: 'Shown with a wine blouse, gold jhumkas, rings and nude heels.',
    edits: ['festive', 'contrast'], colours: [['Black', '#231C22'], ['Saffron', '#E07A1F']],
    border: 'Saffron zari border, tasselled pallu', motif: 'Kalamkari: leaf jaal, elephants on the pallu',
    alt: 'Gajraj — a black Kalamkari saree with a saffron border and a magenta elephant pallu, worn seated against a red and blush backdrop',
    crops: { border: { img: 0, s: 2.4, ox: '75%', oy: '92%' }, swatch: { img: 0, s: 2.4, ox: '40%', oy: '88%' },
      pallu: { img: 0, s: 1.8, ox: '20%', oy: '85%' }, motif: { img: 0, s: 2.6, ox: '25%', oy: '82%' }, styling: { img: 0, s: 1.8, ox: '65%', oy: '45%', op: '60% 40%' } },
    closer: { heading: 'Black, carried by elephants.', items: [['Colour', 'Black and saffron'], ['Motif', 'Leaf jaal, painted elephants'], ['Border', 'Saffron zari']] } },
  { slug: 'bansuri', name: 'Bansuri', nameMeaning: 'a flute', W: 1094, H: 1437,
    source: 'Mustard Kalamkari Saree Portrait.png', frame: { x: 0.0074, y: 0, w: 0.9852, h: 1 }, pos: '50% 40%',
    descriptor: 'Mustard Kalamkari with a Krishna pallu',
    description: 'Bansuri is mustard yellow painted with processions of elephants and figures, with a pallu that opens into an arch around Krishna playing the flute, edged in a teal zari border.',
    colourLine: 'Mustard, with a flute playing.', styling: 'Shown with a backless ivory blouse, small studs and a low bun.',
    edits: ['bright', 'festive'], colours: [['Mustard', '#D9A520'], ['Teal', '#2F7D7A']],
    border: 'Teal zari border', motif: 'Kalamkari: elephants and figures, Krishna on the pallu',
    alt: 'Bansuri — a mustard Kalamkari saree with a teal border and a painted Krishna pallu, worn from behind in a softly lit room',
    crops: { border: { img: 0, s: 2.4, ox: '66%', oy: '45%' }, swatch: { img: 0, s: 2.4, ox: '55%', oy: '85%' },
      pallu: { img: 0, s: 1.6, ox: '55%', oy: '85%' }, motif: { img: 0, s: 2.6, ox: '50%', oy: '35%' }, styling: { img: 0, s: 1.8, ox: '55%', oy: '10%', op: '50% 0%' } },
    closer: { heading: 'Mustard, with a flute playing.', items: [['Colour', 'Mustard and teal'], ['Motif', 'Painted processions, Krishna on the pallu'], ['Border', 'Teal zari']] } },
];

const add = S.map((s) => ({
  slug: s.slug, name: s.name, nameMeaning: s.nameMeaning, descriptor: s.descriptor,
  description: s.description, descriptionStatus: 'draft',
  colourLine: s.colourLine, colourLineStatus: 'draft', styling: s.styling, stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: s.edits, categories: ['kalamkari'], categoryEvidence: EVIDENCE,
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
const at = d.products.findIndex((p) => p.slug === 'leela');
d.products.splice(at + 1, 0, ...add);
d._notes.kalamkari = 'Veena, Darbar, Chitra, Gajraj and Bansuri: the five Kalamkari model photographs of November 17 (model photography folder). Names and copy are proposals; fabric and price have not been supplied.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', [...slugs].join(', '), 'after leela at', at + 1);
