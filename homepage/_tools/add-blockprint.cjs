// Adds fifteen Block print sarees (client, Nov 17 2026: "these go in the Block print category", model photography folder),
// at the end of the collection. Safe to re-run; then run node _tools/set-captions.cjs and node _tools/set-categories.cjs.
// Run from homepage/: node _tools/add-blockprint.cjs
// Photos: _tools/convert-blockprint.ps1. Eleven are real photographs from a photoshoot (the WhatsApp "IMG-2026…" files):
// they are listed in set-captions.cjs (photoshoot: true, no "styled" caption). Rekha, Syahi, Raat and Mehrab are AI
// model images ("Styled imagery for representation").
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
const EVIDENCE = { 'block-prints': 'Client, November 17 2026: named as Block print sarees' };
// 3:4 window: full width, as tall as that allows, from y (default: centred)
const frame3x4 = (W, H, y) => { const h = Math.min(1, +(W / H * 4 / 3).toFixed(4)); const w = h < 1 ? 1 : +(H / W * 0.75).toFixed(4); return { x: +((1 - w) / 2).toFixed(4), y: y ?? +((1 - h) / 2).toFixed(4), w, h }; };

// [slug, name, meaning, W, H, source file, frame y (null = centred), descriptor, description, colourLine, styling, edits,
//  colours, border, motif, alt scene, crops.border [ox, oy], crops.swatch [ox, oy], closer heading]
const S = [
  ['rekha', 'Rekha', 'a line', 1083, 1453, 'Elegant Black and Gold Saree Portrait 1.png', 0,
    'Black block print with white stripes and an ochre border',
    'Rekha is black cotton block-printed with blocks of fine white stripes and small white flowers, edged in an ochre floral border that repeats in bands across the skirt.',
    'Black, ruled in white.', 'Shown with a black blouse, small gold studs and a low bun.', ['contrast'],
    [['Black', '#222020'], ['Ochre', '#C8841E']], 'Ochre floral block-printed border', 'Block print: white stripes, white floral buti',
    'worn standing against a grey studio wall', ['40%', '62%'], ['55%', '35%'], 'Black, ruled in white.'],
  ['syahi', 'Syahi', 'ink', 1024, 1536, 'Elegant Black Saree Studio Portrait 1.png', 0.06,
    'Black block print with red buti and a white zigzag border',
    'Syahi is black cotton block-printed with tall red and grey leaf buti, edged in a white zigzag border, with a pallu of small red buti and grey floral panels.',
    'Black, printed in red.', 'Shown with a black blouse, a silver chain and a silver bangle.', ['contrast'],
    [['Black', '#1C1A1A'], ['Red', '#B3263A']], 'White zigzag border', 'Block print: red leaf buti, grey floral pallu panels',
    'worn standing on a jute mat against a grey wall', ['35%', '97%'], ['45%', '30%'], 'Black, printed in red.'],
  ['chaand', 'Chaand', 'the moon', 736, 1040, 'IMG-20261105-WA0067 1.png', null,
    'Indigo block print with full moons and a gold border',
    'Chaand is indigo printed with large dark circles on a pale ground and bands of scrolling pattern, edged in a narrow gold zari border, with a striped pallu.',
    'Indigo, under full moons.', 'Shown with a black blouse, blue drop earrings and white bangles.', ['jewel'],
    [['Indigo', '#1E2F6B'], ['Pale blue', '#A9C2DD']], 'Gold zari border', 'Block print: large circles, scrolling bands',
    'worn standing in a room with an olive wall', ['50%', '97%'], ['35%', '50%'], 'Indigo, under full moons.'],
  ['champa', 'Champa', 'the champak flower', 875, 1280, 'IMG-20261105-WA0089 1.png', null,
    'Black and white block print with a yellow pallu',
    'Champa is black printed all over with small white diamonds, edged in gold zari, with a bright yellow pallu of flower medallions and panels of paisleys and flowering stems.',
    'Black, opening into yellow.', 'Shown with a black blouse, jhumkas and white bangles.', ['bright', 'contrast'],
    [['Black', '#1E1C1C'], ['Yellow', '#E6C21E']], 'Gold zari border', 'Block print: white diamonds; yellow medallion pallu',
    'worn standing in a room with an olive wall', ['60%', '80%'], ['40%', '60%'], 'Black, opening into yellow.'],
  ['jaali', 'Jaali', 'a lattice', 704, 1041, 'IMG-20261105-WA0091 1.png', null,
    'Indigo block print with a white grid and gold border',
    'Jaali is indigo printed with a fine white grid of dots, edged in gold zari, with gold zari stripes across the pallu.',
    'Indigo, in a fine lattice.', 'Shown with a black blouse, blue drop earrings and white bangles.', ['jewel'],
    [['Indigo', '#25477A'], ['Gold', '#B8954E']], 'Gold zari border', 'Block print: a white grid of dots',
    'worn standing in a room with an olive wall', ['55%', '95%'], ['35%', '50%'], 'Indigo, in a fine lattice.'],
  ['samandar', 'Samandar', 'the sea', 871, 1280, 'IMG-20261105-WA0105 1.png', null,
    'Teal block print with gold paisleys and a zari border',
    'Samandar is teal blue printed with dark paisleys outlined in gold, edged in gold zari, with a pallu of broad navy and gold bands.',
    'Teal, deep as the sea.', 'Shown with a teal blouse, silver jhumkas and a cuff.', ['jewel'],
    [['Teal', '#2C6F8E'], ['Navy', '#1D2B55']], 'Gold zari border', 'Block print: gold-outlined paisleys; banded pallu',
    'worn standing beside a white shelf and a cream curtain', ['55%', '80%'], ['35%', '50%'], 'Teal, deep as the sea.'],
  ['saras', 'Saras', 'the sarus crane', 903, 1280, 'IMG-20261116-WA0002 1.png', null,
    'Indigo block print with white cranes',
    'Saras is indigo printed with white cranes over a ground of tiny leaves, edged in white geometric bands and silver zari, with a tasselled pallu of banded patterns.',
    'Indigo, where the cranes walk.', 'Shown with a black blouse, silver hoop earrings and white flowers in the hair.', ['jewel'],
    [['Indigo', '#1B2A57'], ['White', '#EDEBE6']], 'White geometric band, silver zari edge', 'Block print: white cranes, leaf ground',
    'worn standing in a room with an olive wall', ['50%', '95%'], ['45%', '62%'], 'Indigo, where the cranes walk.'],
  ['shaam', 'Shaam', 'evening', 853, 1280, 'IMG-20261116-WA0006 1.png', null,
    'Navy block print with white dashes and red paisleys',
    'Shaam is navy printed with rows of white dashes and red paisleys, edged in silver zari, with a pallu of red and white diamond panels and a red flowering stem.',
    'Navy, at the turn of evening.', 'Shown with a black blouse, silver jhumkas and white flowers in the hair.', ['jewel'],
    [['Navy', '#1E2560'], ['Red', '#B5402E']], 'Silver zari border', 'Block print: white dashes, red paisleys; diamond panels on the pallu',
    'worn standing in a room with an olive wall', ['60%', '75%'], ['40%', '62%'], 'Navy, at the turn of evening.'],
  ['rangrez', 'Rangrez', 'a dyer', 881, 1280, 'IMG-20261116-WA0018 1.png', null,
    'Black with a maroon block-printed border and pallu',
    'Rangrez is plain black with a broad maroon border block-printed with flowers and vines, and a pallu of maroon and pink bands, chevrons and medallions, edged in silver zari.',
    'Black, framed in maroon.', 'Shown with a black blouse, silver jhumkas and white flowers in the hair.', ['contrast'],
    [['Black', '#1B1A1A'], ['Maroon', '#8E2232']], 'Maroon block-printed border, silver zari edge', 'Block print: florals, chevrons and medallions on the pallu',
    'worn standing in a room with an olive wall', ['45%', '92%'], ['60%', '55%'], 'Black, framed in maroon.'],
  ['jugnu', 'Jugnu', 'a firefly', 853, 1280, 'IMG-20261116-WA0034 1.png', null,
    'Indigo block print with white circles and stripes',
    'Jugnu is indigo printed with small blue dots and large white circles, edged in silver zari, with a pallu of white stripes.',
    'Indigo, lit with white.', 'Shown with a black blouse, silver jhumkas and a silver bangle.', ['jewel'],
    [['Indigo', '#1D3E6E'], ['White', '#E9E6DE']], 'Silver zari border', 'Block print: white circles, blue dots; striped pallu',
    'worn standing in a room with an olive wall', ['55%', '95%'], ['35%', '50%'], 'Indigo, lit with white.'],
  ['patti', 'Patti', 'a leaf', 688, 1032, 'IMG-20261116-WA0042 1.png', null,
    'Black block print with white leaves and stripes',
    'Patti is black printed with white leaf outlines and bands of fine white stripes, edged in silver zari, with a striped, tasselled pallu.',
    'Black, drawn in white.', 'Shown with a black blouse, silver earrings and silver bangles.', ['contrast'],
    [['Black', '#1C1B1B'], ['Silver', '#BDBAB4']], 'Silver zari border', 'Block print: white leaves, fine stripes',
    'worn standing in a room with an olive wall', ['45%', '97%'], ['40%', '50%'], 'Black, drawn in white.'],
  ['dhaara', 'Dhaara', 'a stream', 853, 1280, 'IMG-20261116-WA0066 1.png', null,
    'Indigo and white stripes with a silver border',
    'Dhaara is printed in uneven indigo and white stripes, with chevron bands on the pallu, edged in silver zari and finished with tassels.',
    'Indigo, running in stripes.', 'Shown with a black blouse, gold and blue chandbalis and white bangles.', ['jewel'],
    [['Indigo', '#21456F'], ['White', '#E2E2DC']], 'Silver zari border', 'Block print: indigo and white stripes, chevron bands',
    'worn standing in a room with an olive wall', ['55%', '95%'], ['35%', '50%'], 'Indigo, running in stripes.'],
  ['sarson', 'Sarson', 'mustard in flower', 884, 1280, 'IMG-20261116-WA0076 1.png', null,
    'Black with a mustard block-printed border and pallu',
    'Sarson is plain black with a broad mustard yellow border and pallu, block-printed with flower medallions and edged in gold zari.',
    'Black, edged in mustard.', 'Shown with a black blouse, silver jhumkas and white flowers in the hair.', ['bright', 'contrast'],
    [['Black', '#1A1919'], ['Mustard', '#E3A51C']], 'Mustard block-printed border, gold zari edge', 'Block print: flower medallions on the border and pallu',
    'worn standing in a room with an olive wall', ['40%', '95%'], ['62%', '60%'], 'Black, edged in mustard.'],
  ['raat', 'Raat', 'night', 1025, 1535, 'Indigo Saree in a Warm Studio 1.png', 0.1,
    'Indigo block print with red buti and a medallion pallu',
    'Raat is indigo block-printed with small red and blue flowers, bordered in red vines, with a pallu of interlocking medallion bands and tall cypress motifs.',
    'Indigo, printed with red.', 'Shown with an indigo blouse and small studs.', ['jewel'],
    [['Indigo', '#2A2F72'], ['Madder red', '#B84A3A']], 'Red vine border', 'Block print: red flowers; medallion bands and cypress motifs on the pallu',
    'held out from behind beside clay pots and a carved wooden bench', ['60%', '80%'], ['35%', '55%'], 'Indigo, printed with red.'],
  ['mehrab', 'Mehrab', 'an arch', 1024, 1536, 'Regal Blue Saree in an Ornate Palace 1.png', 0.11,
    'Blue block print with a white triangle border and arched pallu',
    'Mehrab is cobalt blue block-printed with red flowering sprigs, edged in a border of white triangles, with a pallu of red flowers set in rows of arches.',
    'Cobalt, under red arches.', 'Shown with a cobalt blouse, a gold choker, gold earrings and a bangle.', ['jewel', 'festive'],
    [['Cobalt', '#22549A'], ['Coral red', '#D2553F']], 'White triangle border', 'Block print: red sprigs; arches of flowers on the pallu',
    'worn standing beneath a painted palace arch', ['40%', '97%'], ['40%', '45%'], 'Cobalt, under red arches.'],
];

const add = S.map(([slug, name, nameMeaning, W, H, source, fy, descriptor, description, colourLine, styling, edits, cols, border, motif, scene, b, sw, heading]) => ({
  slug, name, nameMeaning, descriptor,
  description, descriptionStatus: 'draft',
  colourLine, colourLineStatus: 'draft', styling, stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits, categories: ['block-prints'], categoryEvidence: EVIDENCE,
  colours: cols.map(([n, h]) => colour(n, h)),
  attributes: { fabric: null, colourway: cols[0][0], border, motif, length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [{ src: `/assets/images/${slug}.jpg`, width: W, height: H, pos: '50% 45%',
    alt: `${name} — ${descriptor.charAt(0).toLowerCase() + descriptor.slice(1)} saree, ${scene}`,
    source: `model photography/${source}`, frame: frame3x4(W, H, fy) }],
  crops: {
    silhouette: { img: 0 }, colour: { img: 0, s: 1.4, ox: '50%', oy: '60%' },
    border: { img: 0, s: 2.4, ox: b[0], oy: b[1] }, swatch: { img: 0, s: 2.4, ox: sw[0], oy: sw[1] },
    pallu: { img: 0, s: 1.8, ox: '62%', oy: '70%' }, motif: { img: 0, s: 2.4, ox: sw[0], oy: sw[1] },
    styling: { img: 0, s: 1.8, ox: '50%', oy: '15%', op: '50% 10%' },
  },
  looks: [],
  backdrop: { img: 0, pos: '50% 45%', posMobile: '50% 45%' },
  closer: { heading, headingStatus: 'draft', items: [['Colour', cols.map((c) => c[0]).join(' and ')], ['Motif', motif.replace(/^Block print: /, '')], ['Border', border]] },
}));

const slugs = new Set(add.map((p) => p.slug));
d.products = d.products.filter((p) => !slugs.has(p.slug));
d.products.push(...add);
d._notes.blockPrints = 'Rekha … Mehrab: the fifteen Block print photographs of November 17 (model photography folder; eleven are real photoshoot photos). Names and copy are proposals; fabric and price have not been supplied.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', add.length, [...slugs].join(', '));
