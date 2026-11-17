// Adds Parinda (maroon with zari parrots, November 12) to products.json, after Gulkand. Safe to re-run.
// Run from homepage/: node _tools/add-parinda.cjs
// Name and copy are proposals that state only what the photographs show. Fabric and price are null (not supplied);
// the category is from the visible style and needs confirming. Photos: the two pasted in chat, converted to JPEG
// (quality 88, full size) as assets/images/parinda*.jpg. Save the originals in model photography/ when you have them.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name, h) => ({ name, ...tone(h) });

const W = 1024, H = 1536; // all three photographs
const parinda = {
  slug: 'parinda', name: 'Parinda', nameMeaning: 'a bird',
  descriptor: 'Maroon with zari parrots',
  description: 'Parinda is maroon woven all over with zari parrots perched on flowering branches, finished with a broad zari border of floral buta.',
  descriptionStatus: 'draft',
  colourLine: 'Deep maroon, alive with birds.', colourLineStatus: 'draft',
  styling: 'Shown with an embroidered mustard blouse, long gold chandbali earrings, a bindi and gold cuffs.', stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: ['jewel', 'festive'],
  categories: ['banarasi'],
  categoryEvidence: { 'banarasi': 'Visible style only (zari-woven parrots and border): confirm with the client' },
  colours: [colour('Maroon', '#7A1C22'), colour('Zari gold', '#B8946A')],
  attributes: { fabric: null, colourway: 'Maroon', border: 'Broad zari border of floral buta', motif: 'Zari parrots on flowering branches', length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [
    { src: '/assets/images/parinda-standing.jpg', width: W, height: H, pos: '47% 55%',
      alt: 'Parinda — a maroon saree woven with zari parrots, worn standing beside a carved sandstone pillar, the pallu held out over her arm',
      source: 'pasted in chat, November 13 (no file in the project yet)', frame: { x: 0.036, y: 0.19, w: 0.838, h: 0.745 } },
    { src: '/assets/images/parinda.jpg', width: W, height: H, pos: '40% 55%',
      alt: 'Parinda — a maroon saree woven with zari parrots, the pallu over her shoulder, beside a carved sandstone pillar',
      source: 'pasted in chat, November 12 (no file in the project yet)', frame: { x: 0, y: 0.12, w: 0.95, h: 0.8444 } },
    { src: '/assets/images/parinda-seated.jpg', width: W, height: H,
      alt: 'Parinda worn seated on a sandstone balustrade against the sky, the zari border spread across her lap',
      source: 'pasted in chat, November 12 (no file in the project yet)', frame: { x: 0, y: 0.2, w: 0.9, h: 0.8 } },
  ],
  crops: {
    silhouette: { img: 0, s: 1.15, ox: '25%', oy: '80%' }, // see set-frames-nov.cjs
    fall: { img: 2, s: 1.4, ox: '30%', oy: '88%' },
    pallu: { img: 1, s: 1.3, ox: '30%', oy: '60%' },
    border: { img: 0, s: 2, ox: '52%', oy: '92%' },
    weave: { img: 1, s: 1.8, ox: '35%', oy: '64%' },
    borderDetail: { img: 2, s: 2.4, ox: '4%', oy: '94%' },
    motif: { img: 1, s: 3.2, ox: '40%', oy: '56%' },
    colour: { img: 1, s: 1.3, ox: '30%', oy: '70%' },
    swatch: { img: 1, s: 2, ox: '20%', oy: '80%' },
    styling: { img: 1, s: 1.6, ox: '62%', oy: '30%', op: '60% 20%' },
  },
  looks: [],
  backdrop: { img: 1, pos: '35% 62%', posMobile: '30% 62%' },
  closer: { heading: 'Maroon, in flight.', headingStatus: 'draft', items: [['Colour', 'Maroon and zari'], ['Motif', 'Zari parrots'], ['Border', 'Broad zari, floral buta']] },
};

d.products = d.products.filter((p) => p.slug !== parinda.slug);
const at = d.products.findIndex((p) => p.slug === 'gulkand');
d.products.splice(at + 1, 0, parinda);
d._notes.parinda = 'Parinda comes from two photographs pasted in chat on November 12 (not yet saved in model photography). Name and copy are proposals; fabric and price have not been supplied; the Banaras category is from the visible style and needs confirming.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', parinda.slug, 'at', at + 1, parinda.colours);
