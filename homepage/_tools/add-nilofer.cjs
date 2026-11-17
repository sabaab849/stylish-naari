// Adds Nilofer (lilac with zari trees in zigzag bands, November 13) after Kesar. Safe to re-run.
// Run from homepage/: node _tools/add-nilofer.cjs
// Name and copy are proposals that state only what the photographs show. Fabric and price are null (not supplied);
// the category is from the visible style and needs confirming. Photos: model photography/*.png (about 1024×1536, the
// largest supplied), converted to JPEG at quality 92 as assets/images/nilofer*.jpg.
// Folded photo: none found. The client's Drive (Banarasi → Folded Saree Images, and the Original Product Photos) was
// checked against every lavender/purple saree: SN-012 (small leaf booti, paisley border), SN-022 (blue-grey with
// coloured flowers), SN-030 and SN-038 (coloured meenakari), SN-001, SN-026, SN-040. None has these zari trees in
// zigzag bands. Add one as images[] role "product" when the client identifies it.
// Frames (3:4 windows, w = 0.75 × h × height / width): full length from just above the head to just under the hem;
// the other two lose only wall above the head (the saree runs to the bottom edge).
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name, h) => ({ name, ...tone(h) });


const nilofer = {
  slug: 'nilofer', name: 'Nilofer', nameMeaning: 'a water lily',
  descriptor: 'Lilac with zari trees',
  description: 'Nilofer is lilac woven all over in silver and gold zari, with flowering trees set in zigzag bands, edged in purple and finished with a broad zari border.',
  descriptionStatus: 'draft',
  colourLine: 'Lilac, lit with zari.', colourLineStatus: 'draft',
  styling: 'Shown with a red brocade blouse, a long braid with pink tasselled parandi, oxidised silver jhumkas, a silver temple necklace and silver cuffs.', stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: ['soft', 'festive'],
  categories: ['banarasi'],
  categoryEvidence: { 'banarasi': 'Visible style only (all-over zari weave and border): confirm with the client' },
  colours: [colour('Lilac', '#A97BB5'), colour('Purple', '#6E2A82')],
  attributes: { fabric: null, colourway: 'Lilac', border: 'Purple edge with a broad zari border', motif: 'Zari trees in zigzag bands', length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [
    { src: '/assets/images/nilofer.jpg', width: 1024, height: 1536, pos: '42% 58%',
      alt: 'Nilofer — a lilac saree woven with zari trees in zigzag bands, worn standing in a terracotta arch with a red brocade blouse',
      source: 'Traditional Indian Saree Portrait.png', frame: { x: 0.02, y: 0.17, w: 0.9225, h: 0.82 } },
    { src: '/assets/images/nilofer-standing.jpg', width: 1025, height: 1535,
      alt: 'Nilofer worn leaning against carved terracotta panels, the pallu over her shoulder and a pink tasselled parandi in her braid',
      source: 'Rose-Terracotta Saree Portrait.png', frame: { x: 0.005, y: 0.12, w: 0.9884, h: 0.88 } },
    { src: '/assets/images/nilofer-seated.jpg', width: 1024, height: 1536,
      alt: 'Nilofer worn seated in a heritage courtyard, the zari trees spread across her lap',
      source: 'Contemplative Woman in Heritage Courtyard.png', frame: { x: 0, y: 0.1111, w: 1, h: 0.8889 } },
  ],
  // zoom kept at 2 or less (most at 1.6) so every crop stays sharp on these 1024px photos
  crops: {
    silhouette: { img: 0, s: 1.15, ox: '30%', oy: '85%' },
    fall: { img: 0, s: 1.4, ox: '45%', oy: '90%' },
    pallu: { img: 0, s: 1.4, ox: '70%', oy: '62%' },
    border: { img: 0, s: 1.6, ox: '45%', oy: '96%' },
    weave: { img: 2, s: 1.8, ox: '30%', oy: '100%', op: '50% 100%' },
    borderDetail: { img: 0, s: 2, ox: '50%', oy: '100%' },
    motif: { img: 2, s: 2, ox: '25%', oy: '100%', op: '50% 100%' }, // op: pinned to the lap, not re-centred
    colour: { img: 2, s: 1.6, ox: '40%', oy: '100%', op: '50% 100%' },
    swatch: { img: 2, s: 1.6, ox: '75%', oy: '100%', op: '50% 100%' },
    styling: { img: 2, s: 1.4, ox: '60%', oy: '25%', op: '55% 15%' },
  },
  looks: [],
  backdrop: { img: 2, pos: '50% 76%', posMobile: '45% 76%' },
  closer: { heading: 'Lilac, lit with zari.', headingStatus: 'draft', items: [['Colour', 'Lilac and purple'], ['Motif', 'Zari trees in zigzag bands'], ['Border', 'Purple edge, broad zari']] },
};
for (const im of nilofer.images) { const r = (im.frame.w * im.width) / (im.frame.h * im.height); if (Math.abs(r - 0.75) > 0.005 || im.frame.x + im.frame.w > 1.0001 || im.frame.y + im.frame.h > 1.0001) throw new Error(`${im.src}: not a 3:4 window inside the photo`); }

d.products = d.products.filter((p) => p.slug !== nilofer.slug);
const at = d.products.findIndex((p) => p.slug === 'kesar');
d.products.splice(at + 1, 0, nilofer);
d._notes.nilofer = 'Nilofer comes from the November 13 photographs in model photography (Traditional Indian Saree Portrait, Rose-Terracotta Saree Portrait, Contemplative Woman in Heritage Courtyard). Name and copy are proposals; fabric and price have not been supplied; the Banaras category is from the visible style. No folded photo found in the client Drive (see _tools/add-nilofer.cjs).';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', nilofer.slug, 'at', at + 1, nilofer.colours);
