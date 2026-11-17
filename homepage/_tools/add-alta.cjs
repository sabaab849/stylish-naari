// Adds Alta (red with wavy zari stripes, meenakari booti and a medallion pallu, November 13) after Nilofer. Safe to re-run.
// Run from homepage/: node _tools/add-alta.cjs
// Name and copy are proposals that state only what the photographs show. Fabric and price are null (not supplied);
// the category is from the visible style and needs confirming. Photos: model photography/*.png (1024×1536, the largest
// supplied), converted to JPEG at quality 92 as assets/images/alta*.jpg.
// Folded photo: none found. The client's Drive and all 91 catalogue photos were checked for a red saree with wavy zari
// stripes, tiny meenakari booti and an oval-medallion pallu: SN-011 (dense zari booti), SN-016, SN-027, SN-028,
// SN-044–046, SN-050, SN-051 (diagonal stripes, navy border; also the Drive's "Regal Red Saree Portrait"), SN-055,
// SN-070, SN-077 and SN-087 all differ. Add one as images[] role "product" when the client identifies it.
// No borderDetail crop: it would add a zoomed copy of a portrait to the gallery. The border circle uses crops.border.
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
const alta = {
  slug: 'alta', name: 'Alta', nameMeaning: 'the red dye painted on hands and feet',
  descriptor: 'Red with zari stripes and meenakari booti',
  description: 'Alta is red woven with fine wavy zari stripes and tiny meenakari booti, with a pallu of large zari medallions and a border of flowering stems in zari and meenakari.',
  descriptionStatus: 'draft',
  colourLine: 'Red, striped in gold.', colourLineStatus: 'draft',
  styling: 'Shown with a violet brocade blouse, a gold collar with an orange stone pendant, gold hoop earrings, a gold cuff and a low braided bun.', stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: ['festive', 'bright'],
  categories: ['banarasi'],
  categoryEvidence: { 'banarasi': 'Visible style only (zari stripes and medallion pallu): confirm with the client' },
  colours: [colour('Red', '#D42F2A'), colour('Zari gold', '#C9A26A')],
  attributes: { fabric: null, colourway: 'Red', border: 'Flowering stems in zari and meenakari', motif: 'Wavy zari stripes, meenakari booti, medallion pallu', length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [
    { src: '/assets/images/alta.jpg', width: W, height: H, pos: '50% 50%',
      alt: 'Alta — a red saree with wavy zari stripes and a medallion pallu, worn with a violet brocade blouse against a terracotta wall',
      source: 'Elegant Portrait in Red Sari and Gold Jewelry.png', frame: { x: 0.005, y: 0.12, w: 0.99, h: 0.88 } },
    { src: '/assets/images/alta-back.jpg', width: W, height: H,
      alt: 'Alta from behind: the pallu over her arm, with large zari medallions and a border of meenakari flowering stems',
      source: 'Sari Elegance by the Ornate Wall.png', frame: { x: 0, y: 0.12, w: 0.99, h: 0.88 } },
    { src: '/assets/images/alta-detail.jpg', width: W, height: H, role: 'detail',
      alt: 'Alta up close: fine wavy zari stripes on red, scattered with tiny pink, green and white meenakari booti',
      source: 'Vivid Red Silk Sari and Gold Pendant.png' },
  ],
  // zoom 2 or less; crops with op are pinned to that part of the photo (the circles otherwise re-centre them)
  crops: {
    silhouette: { img: 0 },
    fall: { img: 0, s: 1.4, ox: '50%', oy: '90%' },
    pallu: { img: 1, s: 1.3, ox: '25%', oy: '65%' },
    border: { img: 1, s: 2, ox: '15%', oy: '90%', op: '0% 100%' },
    weave: { img: 2, s: 1.4, ox: '60%', oy: '55%' },
    motif: { img: 1, s: 2, ox: '15%', oy: '75%', op: '0% 60%' },
    colour: { img: 0, s: 1.3, ox: '50%', oy: '70%' },
    swatch: { img: 2, s: 1.6, ox: '70%', oy: '80%' },
    styling: { img: 0, s: 1.6, ox: '50%', oy: '25%', op: '50% 15%' },
  },
  looks: [],
  backdrop: { img: 1, pos: '30% 70%', posMobile: '25% 70%' },
  closer: { heading: 'Red, striped in gold.', headingStatus: 'draft', items: [['Colour', 'Red and zari gold'], ['Motif', 'Zari stripes, meenakari booti'], ['Border', 'Zari and meenakari stems']] },
};
for (const im of alta.images.filter((i) => i.frame)) { const r = (im.frame.w * im.width) / (im.frame.h * im.height); if (Math.abs(r - 0.75) > 0.005 || im.frame.x + im.frame.w > 1.0001 || im.frame.y + im.frame.h > 1.0001) throw new Error(`${im.src}: not a 3:4 window inside the photo`); }

d.products = d.products.filter((p) => p.slug !== alta.slug);
const at = d.products.findIndex((p) => p.slug === 'nilofer');
d.products.splice(at + 1, 0, alta);
d._notes.alta = 'Alta comes from the November 13 photographs in model photography (Elegant Portrait in Red Sari and Gold Jewelry, Vivid Red Silk Sari and Gold Pendant, Sari Elegance by the Ornate Wall). Name and copy are proposals; fabric and price have not been supplied; the Banaras category is from the visible style. No folded photo found in the client Drive (see _tools/add-alta.cjs).';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', alta.slug, 'at', at + 1, alta.colours);
