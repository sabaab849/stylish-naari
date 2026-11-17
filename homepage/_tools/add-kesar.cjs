// Adds Kesar (coral red with silver zari booti and a floral meenakari border, November 13) after Genda. Safe to re-run.
// Run from homepage/: node _tools/add-kesar.cjs
// Name and copy are proposals that state only what the photographs show. Fabric and price are null (not supplied);
// the category is from the visible style and needs confirming. Photos: model photography/*.png (1024×1536, the largest
// supplied), converted to JPEG at quality 92 as assets/images/kesar*.jpg.
// No frames: in the full-length photo the bun touches the top and the saree runs to the bottom edge, so a 3:4 crop
// would cut one of them. All three photos are shown whole, and the gallery takes their own 2:3 shape.
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
const kesar = {
  slug: 'kesar', name: 'Kesar', nameMeaning: 'saffron',
  descriptor: 'Coral red with silver zari booti',
  description: 'Kesar is coral red woven with silver zari booti, edged in a broad border of floral medallions in silver zari and soft meenakari colours.',
  descriptionStatus: 'draft',
  colourLine: 'Coral red, bordered in bloom.', colourLineStatus: 'draft',
  styling: 'Shown with a black and gold brocade blouse, gold chandbali earrings, gold pins in a low bun, a gold cuff and an antique gold waist chain.', stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: ['bright', 'festive'],
  categories: ['banarasi'],
  categoryEvidence: { 'banarasi': 'Visible style only (zari booti and meenakari border): confirm with the client' },
  colours: [colour('Coral red', '#D9502C'), colour('Silver zari', '#E6D6C4')],
  attributes: { fabric: null, colourway: 'Coral red', border: 'Floral medallion border in zari and meenakari', motif: 'Silver zari booti', length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [
    { src: '/assets/images/kesar.jpg', width: W, height: H, pos: '55% 55%',
      alt: 'Kesar — a coral red saree with silver zari booti, the pallu held wide in a terracotta arch to show its floral medallion border',
      source: 'Elegant Sari Portrait in Floral Arch.png' },
    { src: '/assets/images/kesar-back.jpg', width: W, height: H,
      alt: 'Kesar from behind: the pallu over her shoulder, its border of zari and meenakari flowers, against carved terracotta panels',
      source: 'Ornate Sari Against Terracotta Arches.png' },
    // role "border": a close-up photo of the border, shown whole in the gallery with no extra crop cut from it
    { src: '/assets/images/kesar-detail.jpg', width: W, height: H, role: 'border',
      alt: 'Kesar up close: floral medallions in silver zari with blue, orange and green meenakari, beside silver booti on coral red',
      source: 'Coral Saree with Brocade Elegance.png' },
  ],
  // zoom kept at 1.6 or less so every crop stays sharp on these 1024px photos
  crops: {
    silhouette: { img: 0 },
    fall: { img: 0, s: 1.4, ox: '50%', oy: '92%' },
    pallu: { img: 0, s: 1.3, ox: '75%', oy: '58%' },
    border: { img: 0, s: 1.6, ox: '70%', oy: '82%' },
    weave: { img: 2, s: 1.4, ox: '75%', oy: '80%' },
    borderDetail: { img: 2, s: 1.3, ox: '55%', oy: '50%' },
    motif: { img: 1, s: 1.6, ox: '30%', oy: '55%' },
    colour: { img: 0, s: 1.3, ox: '60%', oy: '62%' },
    swatch: { img: 0, s: 1.6, ox: '28%', oy: '74%' },
    styling: { img: 1, s: 1.4, ox: '50%', oy: '22%', op: '50% 10%' },
  },
  looks: [],
  backdrop: { img: 0, pos: '60% 62%', posMobile: '62% 62%' },
  closer: { heading: 'Coral, in bloom.', headingStatus: 'draft', items: [['Colour', 'Coral red and silver'], ['Motif', 'Silver zari booti'], ['Border', 'Zari and meenakari florals']] },
};

d.products = d.products.filter((p) => p.slug !== kesar.slug);
const at = d.products.findIndex((p) => p.slug === 'genda');
d.products.splice(at + 1, 0, kesar);
d._notes.kesar = 'Kesar comes from the November 13 photographs in model photography (Elegant Sari Portrait in Floral Arch, Ornate Sari Against Terracotta Arches, Coral Saree with Brocade Elegance). Name and copy are proposals; fabric and price have not been supplied; the Banaras category is from the visible style and needs confirming.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', kesar.slug, 'at', at + 1, kesar.colours);
