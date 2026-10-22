// Adds the six sarees from the third shoot (October 22) to products.json, assigns them to the client's
// regional categories, and gives those category tiles their first photographs. Safe to re-run.
// Names are proposals in the same convention as the others. Descriptions state only what the photograph
// shows; fabric is left null because none of the files names it. Colours are read from the photographs
// by eye (the fabrics are patterned, so a pixel sample is not meaningful) and nudged for text contrast.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name, h) => ({ name, ...tone(h) });

// gentle crops only: these photographs are about 1,100px wide, so zoom stays at 1.6 or below in the gallery
const crops = (c) => ({ silhouette: { img: 0 }, ...Object.fromEntries(Object.entries(c).map(([k, v]) => [k, { img: 0, s: v[0], ox: v[1], oy: v[2] }])) });

const P = (o) => ({
  slug: o.slug, name: o.name, nameMeaning: o.meaning, descriptor: o.descriptor, description: o.description, descriptionStatus: 'draft',
  colourLine: o.colourLine, colourLineStatus: 'draft', price: null, priceIsPlaceholder: false, isNew: true,
  edits: o.edits, categories: o.categories, colours: o.colours,
  attributes: { fabric: null, colourway: o.colours[0].name, border: o.border, motif: o.motif, length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [{ src: `/assets/images/${o.slug}.jpg`, width: o.w, height: o.h, alt: o.alt, ...(o.pos ? { pos: o.pos } : {}), source: o.file }],
  crops: o.crops, looks: [],
  backdrop: { img: 0, pos: o.backdropPos || '50% 50%', posMobile: o.backdropPos || '50% 50%' },
  closer: { heading: o.heading, headingStatus: 'draft', items: o.closer },
});

const add = [
  P({ slug: 'rangoli', name: 'Rangoli', meaning: 'floor patterns drawn for festivals', file: 'Heritage Saree Portrait in Warm Studio Light (1).png', w: 1122, h: 1402,
    descriptor: 'Multicolour ikat with red and gold border', description: 'Rangoli is a multicolour ikat in pink, teal and mustard, framed by a broad red and gold border.',
    colourLine: 'Pink, teal and mustard, held by a red and gold border.', edits: ['festive', 'bright'], categories: ['gujarat-ki-garima'],
    colours: [colour('Rani pink', '#B8336A'), colour('Teal', '#2F6B6B')], border: 'Broad red and gold border', motif: 'Ikat flowers and paisleys',
    alt: 'Rangoli — a multicolour ikat saree in pink, teal and mustard with a red and gold border, worn standing against a plaster wall',
    heading: 'Pink, in every colour.', closer: [['Colour', 'Pink, teal and mustard'], ['Motif', 'Ikat flowers and paisleys'], ['Border', 'Red and gold']],
    crops: crops({ fall: [1.4, '55%', '88%'], pallu: [1.5, '62%', '45%'], border: [1.6, '68%', '86%'], swatch: [1.8, '50%', '76%'], weave: [2, '47%', '62%'], colour: [1.3, '50%', '56%'] }) }),
  P({ slug: 'anaar', name: 'Anaar', meaning: 'pomegranate', file: 'Moody Maroon Saree Editorial Interior (2).png', w: 1024, h: 1536, pos: '50% 62%',
    descriptor: 'Maroon bandhani with gold border', description: 'Anaar is maroon bandhani, tied in fine dots, with a gold border and a floral pallu.',
    colourLine: 'Deep maroon, dotted in gold.', edits: ['jewel', 'festive'], categories: ['rajasthan-ki-rajshahi'],
    colours: [colour('Maroon', '#6E2530'), colour('Olive gold', '#8A7A4E')], border: 'Gold border', motif: 'Bandhani dots, floral pallu',
    alt: 'Anaar — a maroon bandhani saree with a gold border, the floral pallu swinging out as she turns, in a lamplit room',
    heading: 'Maroon, tied in gold.', closer: [['Colour', 'Maroon'], ['Motif', 'Bandhani dots'], ['Border', 'Gold']], backdropPos: '50% 60%',
    crops: crops({ fall: [1.4, '40%', '86%'], pallu: [1.6, '68%', '62%'], border: [1.6, '50%', '88%'], swatch: [1.8, '30%', '76%'], weave: [2, '35%', '60%'], colour: [1.3, '45%', '60%'] }) }),
  P({ slug: 'saanjh', name: 'Saanjh', meaning: 'dusk', file: 'Moody Portrait in a Patterned Indigo Saree (2).png', w: 1117, h: 1409,
    descriptor: 'Indigo ikat with elephants', description: 'Saanjh is indigo ikat patterned with elephants and flowers, edged in gold, with a tasselled pallu.',
    colourLine: 'Indigo, at the edge of night.', edits: ['jewel'], categories: ['gujarat-ki-garima'],
    colours: [colour('Indigo', '#2A3270')], border: 'Gold border, tasselled pallu', motif: 'Ikat elephants and flowers',
    alt: 'Saanjh — an indigo ikat saree patterned with elephants, with a gold border and tasselled pallu, worn standing before draped linen',
    heading: 'Indigo, at dusk.', closer: [['Colour', 'Indigo'], ['Motif', 'Ikat elephants and flowers'], ['Border', 'Gold, tasselled pallu']],
    crops: crops({ fall: [1.4, '50%', '86%'], pallu: [1.5, '70%', '55%'], border: [1.6, '72%', '68%'], swatch: [1.8, '45%', '72%'], weave: [2, '45%', '48%'], colour: [1.3, '50%', '55%'] }) }),
  P({ slug: 'sindoor', name: 'Sindoor', meaning: 'vermilion', file: 'Traditional Saree Portrait with Jasmine Adornment (1).png', w: 1122, h: 1402,
    descriptor: 'Red with ikat border', description: 'Sindoor is red with a deep ikat border of elephants, parrots and dancers, finished in gold.',
    colourLine: 'Vermilion, bordered with a story.', edits: ['festive', 'contrast'], categories: ['gujarat-ki-garima'],
    colours: [colour('Vermilion', '#9E2229')], border: 'Ikat border, finished in gold', motif: 'Elephants, parrots and dancers',
    alt: 'Sindoor — a red saree with an ikat border of elephants, parrots and dancers, worn standing against a painted green wall',
    heading: 'Red, bordered in stories.', closer: [['Colour', 'Vermilion'], ['Motif', 'Elephants, parrots, dancers'], ['Border', 'Ikat and gold']],
    crops: crops({ fall: [1.4, '55%', '88%'], pallu: [1.5, '73%', '70%'], border: [1.6, '50%', '92%'], swatch: [1.8, '72%', '78%'], weave: [2, '72%', '73%'], colour: [1.3, '55%', '60%'] }) }),
  P({ slug: 'kahani', name: 'Kahani', meaning: 'a story', file: 'Contemplative Woman in a Haveli Alcove (1).png', w: 1024, h: 1536, pos: '50% 55%',
    descriptor: 'Black Kalamkari with mustard border', description: 'Kahani is black Kalamkari painted with cattle and a flute player on the pallu, edged in mustard.',
    colourLine: 'Black, painted with a story.', edits: ['contrast'], categories: ['pedana-ki-kalamkari'],
    colours: [colour('Black', '#23201F'), colour('Mustard', '#C08A2E')], border: 'Mustard border', motif: 'Kalamkari: cattle, flute-player pallu',
    alt: 'Kahani — a black Kalamkari saree with a mustard border and a painted pallu, worn seated in a whitewashed alcove',
    heading: 'Black, told in pictures.', closer: [['Colour', 'Black and mustard'], ['Motif', 'Painted Kalamkari scenes'], ['Border', 'Mustard']], backdropPos: '50% 62%',
    crops: crops({ fall: [1.4, '75%', '86%'], pallu: [1.5, '75%', '76%'], border: [1.8, '72%', '86%'], swatch: [1.8, '52%', '64%'], weave: [2, '55%', '50%'], colour: [1.3, '60%', '60%'] }) }),
  P({ slug: 'leela', name: 'Leela', meaning: 'divine play', file: 'Editorial Saree Portrait in Blue Studio.png', w: 1024, h: 1536,
    descriptor: 'Kalamkari with mustard and red border', description: 'Leela is Kalamkari painted with figurative panels in blue, ochre and green, framed by a mustard and red border.',
    colourLine: 'Turmeric, opened like a scroll.', edits: ['bright'], categories: ['pedana-ki-kalamkari'],
    colours: [colour('Turmeric', '#D08F2C'), colour('Blue', '#3E6EA8')], border: 'Mustard and red border', motif: 'Kalamkari figurative panels',
    alt: 'Leela — a Kalamkari saree with painted figurative panels and a mustard and red border, the pallu held open against a blue backdrop',
    heading: 'Turmeric, opened wide.', closer: [['Colour', 'Turmeric and blue'], ['Motif', 'Painted figurative panels'], ['Border', 'Mustard and red']],
    crops: crops({ fall: [1.4, '55%', '86%'], pallu: [1.4, '35%', '55%'], border: [1.6, '25%', '64%'], swatch: [1.6, '40%', '55%'], weave: [2, '40%', '55%'], colour: [1.3, '50%', '55%'] }) }),
];

d.products = d.products.filter((p) => !add.some((a) => a.slug === p.slug)).concat(add);

// First photographs for three regional tiles (3:4), from the sarees now in those categories
const tile = { 'gujarat-ki-garima': ['rangoli', '50% 45%'], 'rajasthan-ki-rajshahi': ['anaar', '50% 40%'], 'pedana-ki-kalamkari': ['leela', '50% 45%'] };
for (const c of d.categories) if (tile[c.slug]) {
  const p = d.products.find((x) => x.slug === tile[c.slug][0]); const im = p.images[0];
  c.image = { src: im.src, width: im.width, height: im.height, alt: `${c.name}: ${p.name}`, pos: tile[c.slug][1] };
}
d._notes.thirdShoot = 'Sarees 13–18 (Rangoli, Anaar, Saanjh, Sindoor, Kahani, Leela) come from the third shoot. Names and copy are proposals; fabric is unknown; categories are assigned from the visible style (ikat → Gujarat, bandhani → Rajasthan, Kalamkari → Pedana) and should be confirmed with the client.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(add.map((p) => `${p.slug}: ${p.colours.map((c) => c.name + ' ' + c.hex).join(', ')} → ${p.categories}`).join('\n'));
console.log('tiles with photos:', d.categories.filter((c) => c.image).map((c) => c.slug).join(', '));
