// Adds Gulkand (rose pink with a wine border, November 12 shoot) to products.json, after Hariyali. Safe to re-run.
// Run from homepage/: node _tools/add-gulkand.cjs
// Like the third-shoot sarees, the name and copy are proposals and state only what the photographs show. Fabric and
// price are null because neither has been supplied. The category is assigned from the visible style (zari-woven
// border and pallu) and should be confirmed with the client.
// Photos: model photography/*.png, converted to JPEG (quality 88, full size) as assets/images/gulkand*.jpg.
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
const gulkand = {
  slug: 'gulkand', name: 'Gulkand', nameMeaning: 'rose petals preserved in sugar',
  descriptor: 'Rose pink with wine and silver border',
  description: 'Gulkand is rose pink scattered with small floral buti, bordered in wine woven with silver dots and zari stripes, and finished with a broad zari pallu.',
  descriptionStatus: 'draft',
  colourLine: 'Rose pink, held in wine.', colourLineStatus: 'draft',
  styling: 'Shown with red roses in the hair, gold jhumkas, a gold brocade blouse and stacked gold bangles.', stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: ['contrast', 'festive'],
  categories: ['banarasi'],
  categoryEvidence: { 'banarasi': 'Visible style only (zari-woven border and pallu): confirm with the client' },
  colours: [colour('Rose pink', '#C9647E'), colour('Wine', '#5E1A3A')],
  attributes: { fabric: null, colourway: 'Rose pink', border: 'Wine border with silver dots and zari stripes', motif: 'Small floral buti, broad zari pallu', length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [
    { src: '/assets/images/gulkand.jpg', width: W, height: H, pos: '50% 55%',
      alt: 'Gulkand — a rose pink saree with a wine and silver border, worn standing in a carved sandstone colonnade',
      source: 'Elegant Woman in a Terracotta Palace Corridor.png', frame: { x: 0.03, y: 0.155, w: 0.94, h: 0.8356 } },
    { src: '/assets/images/gulkand-back.jpg', width: W, height: H,
      alt: 'Gulkand from behind: the zari pallu held out wide, its wine edge and floral buti against a terracotta wall',
      source: 'Saree Elegance Beneath a Carved Arch.png', frame: { x: 0, y: 0.07, w: 0.95, h: 0.8444 } },
    // role "border": a close-up photo of the border, so the gallery shows it whole and cuts no second crop from it
    { src: '/assets/images/gulkand-detail.jpg', width: W, height: H, role: 'border',
      alt: 'Gulkand up close: the wine border woven with silver dots and a silver zari stripe, over a gold brocade blouse',
      source: 'Regal Magenta Saree Portrait.png' },
  ],
  crops: {
    silhouette: { img: 0, s: 1.1, ox: '50%', oy: '100%' }, // see set-frames-nov.cjs
    fall: { img: 0, s: 1.4, ox: '50%', oy: '88%' },
    pallu: { img: 1, s: 1.3, ox: '50%', oy: '72%' },
    border: { img: 0, s: 1.8, ox: '50%', oy: '96%' },
    weave: { img: 2, s: 1.5, ox: '40%', oy: '60%' },
    borderDetail: { img: 2, s: 1.4, ox: '78%', oy: '42%' },
    motif: { img: 1, s: 2.2, ox: '50%', oy: '34%' },
    colour: { img: 0, s: 1.3, ox: '50%', oy: '62%' },
    swatch: { img: 0, s: 2.2, ox: '48%', oy: '74%' },
    styling: { img: 2, s: 1.3, ox: '70%', oy: '0%', op: '50% 0%' },
  },
  looks: [],
  backdrop: { img: 1, pos: '50% 62%', posMobile: '50% 62%' },
  closer: { heading: 'Rose, edged in wine.', headingStatus: 'draft', items: [['Colour', 'Rose pink and wine'], ['Motif', 'Floral buti, zari pallu'], ['Border', 'Wine and silver zari']] },
};

d.products = d.products.filter((p) => p.slug !== gulkand.slug);
const at = d.products.findIndex((p) => p.slug === 'hariyali');
d.products.splice(at + 1, 0, gulkand);
d._notes.gulkand = 'Gulkand comes from the November 12 photographs (model photography: the three PNGs). Name and copy are proposals; fabric and price have not been supplied; the Banaras category is from the visible style and needs confirming.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', gulkand.slug, 'at', at + 1, gulkand.colours);
