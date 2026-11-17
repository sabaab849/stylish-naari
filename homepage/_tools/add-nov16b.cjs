// Adds Neelambari, Gulaabi, Pista and Dariya (model photographs supplied 16 Nov 2026, saved in model photography/ as
// "<Name> N (...).png", 1024 px wide; converted by _tools/convert-nov16b.ps1). Safe to re-run. Run from homepage/:
//   powershell -File _tools/convert-nov16b.ps1 && node _tools/add-nov16b.cjs
// Gallery (galleryListed: true, in this order): the full-length model photo, the other model photo(s), then close-ups.
// No original (SN) product photos yet: the client hasn't said which SN numbers these are. Add them after the model
// photos as role "product" (original, print, border) like the November 16 sarees when known.
// Names and copy are proposals that state only what the photographs show (status "draft"). Fabric and price are null.
// Banaras ki Bunkari is set from the visible zari weave only and needs confirming.
// Frames: 3:4 windows (shares of the photo), full width on the 2:3 photos, full height on the 4:5 ones.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const r4 = (v) => +v.toFixed(4);
// A 3:4 window: full width (y = top edge) on tall photos, full height (x = left edge) on wider ones
const frameOf = (W, H, { x = 0, y = 0 }) => {
  const fullW = (W * 4) / 3 <= H;
  const w = fullW ? 1 : (H * 0.75) / W, h = fullW ? (W * 4) / 3 / H : 1;
  return { x: r4(Math.min(x, 1 - w)), y: r4(Math.min(y, 1 - h)), w: r4(w), h: r4(h) };
};
const img = (file, W, H, alt, source, opts = {}) => ({
  src: `/assets/images/${file}`, width: W, height: H, ...(opts.role ? { role: opts.role } : {}), alt, source,
  ...(opts.frame ? { frame: frameOf(W, H, opts.frame) } : {}),
});
const BANARAS = 'Visible style only (zari weave): confirm with the client';

const S = [
  { slug: 'neelambari', name: 'Neelambari', meaning: 'she who wears blue-violet, and an evening raga',
    descriptor: 'Purple with gold elephants and a black zari border',
    description: 'Neelambari is a lustrous purple woven with small gold elephants, edged by a wide black border of gold roundels between fine zari stripes, and finished with a black pallu of tall gold paisleys.',
    colourLine: 'Purple, edged in black and gold.',
    styling: 'Shown with a brocade blouse, oxidised silver jhumkas, a gold cuff and loose curls.',
    edits: ['jewel', 'contrast'], colours: [['Purple', '#7A6A9C'], ['Black', '#1C1A1E']],
    border: 'Black border with gold roundels and zari stripes', motif: 'Small gold elephants; tall gold paisleys on the pallu',
    closer: ['Purple, black and zari gold', 'Gold elephants and roundels', 'Black with gold roundels'],
    images: [
      img('neelambari.jpg', 1024, 1433, 'Neelambari — a purple saree with gold elephants and a black zari border, worn against a blue wall beside a white pillar', 'Neelambari 1 (full length).png', { frame: { y: 1 } }),
      img('neelambari-drape.jpg', 1024, 1536, 'Neelambari draped over the shoulder: gold elephants on purple, the black border of gold roundels and the paisley pallu', 'Neelambari 2 (drape).png', { frame: { y: 0.08 } }),
    ],
    crops: {
      silhouette: { img: 0 }, fall: { img: 0, s: 1.4, ox: '50%', oy: '92%' }, pallu: { img: 0, s: 1.5, ox: '62%', oy: '72%' },
      border: { img: 1, s: 1.6, ox: '45%', oy: '62%' }, weave: { img: 1, s: 1.6, ox: '45%', oy: '78%' },
      motif: { img: 1, s: 1.8, ox: '40%', oy: '82%' }, colour: { img: 0, s: 1.4, ox: '45%', oy: '60%' },
      swatch: { img: 1, s: 1.8, ox: '45%', oy: '80%' }, styling: { img: 0, s: 1.6, ox: '45%', oy: '30%', op: '45% 20%' },
    },
    backdrop: { img: 0, pos: '60% 70%' } },

  { slug: 'gulaabi', name: 'Gulaabi', meaning: 'rose pink',
    descriptor: 'Blush pink with multicolour flower butis',
    description: 'Gulaabi is a soft blush pink scattered with small woven flowers in turquoise, coral and marigold, framed by a pale zari border of flowering vines.',
    colourLine: 'Blush pink, in bloom.',
    styling: 'Shown with a mustard embroidered blouse, a painted-stone necklace and drop earrings, gold bangles and red roses in a low bun.',
    edits: ['soft'], colours: [['Blush pink', '#E7C4BE'], ['Turquoise', '#2FA3B5']],
    border: 'Pale zari border of vines with coral flowers', motif: 'Turquoise, coral and marigold flower butis',
    closer: ['Blush pink, turquoise and coral', 'Woven flower butis', 'Zari vines with coral flowers'],
    images: [
      img('gulaabi.jpg', 1024, 1536, 'Gulaabi — a blush pink saree with turquoise, coral and marigold flower butis, worn with a mustard blouse beside a stained-glass door', 'Gulaabi 1 (full length).png', { frame: { y: 0.04 } }),
      img('gulaabi-detail.jpg', 1024, 1536, 'Gulaabi up close: woven flower butis and the zari border across the shoulder', 'Gulaabi 2 (close-up).png', { role: 'detail' }),
      img('gulaabi-border.jpg', 1024, 1536, 'Gulaabi up close: the pale zari border of vines and coral flowers, and the flower butis', 'Gulaabi 3 (border).png', { role: 'detail' }),
    ],
    crops: {
      silhouette: { img: 0 }, fall: { img: 0, s: 1.4, ox: '50%', oy: '90%' }, pallu: { img: 0, s: 1.4, ox: '70%', oy: '62%' },
      border: { img: 2, s: 1.3, ox: '40%', oy: '55%' }, weave: { img: 2, s: 1.3, ox: '70%', oy: '30%' },
      motif: { img: 2, s: 1.6, ox: '70%', oy: '25%' }, colour: { img: 1, s: 1.3, ox: '50%', oy: '75%' },
      swatch: { img: 2, s: 1.6, ox: '80%', oy: '30%' }, styling: { img: 1, s: 1.4, ox: '40%', oy: '30%', op: '40% 25%' },
    },
    backdrop: { img: 0, pos: '65% 65%' } },

  { slug: 'pista', name: 'Pista', meaning: 'pistachio',
    descriptor: 'Pistachio with a gold and silver zari jaal',
    description: 'Pista is a pale pistachio woven all over with a gold zari trellis and small silver flowers, with a wide zari pallu and a tasselled end.',
    colourLine: 'Pistachio, laced in gold.',
    styling: 'Shown with a coral blouse, an oxidised silver necklace and earrings, and a silver cuff.',
    edits: ['soft', 'festive'], colours: [['Pistachio', '#D5DDB5'], ['Zari gold', '#C9B27A']],
    border: 'Wide zari border of floral vines', motif: 'Gold zari trellis with small silver flowers',
    closer: ['Pistachio, gold and silver', 'Zari trellis, silver flowers', 'Wide zari vines, tasselled end'],
    images: [
      img('pista.jpg', 1024, 1536, 'Pista — a pale pistachio saree with a gold zari trellis and a tasselled pallu, worn among palms beneath white arches', 'Pista 1 (full length).png', { frame: { y: 1 } }),
      img('pista-detail.jpg', 1024, 1536, 'Pista up close: the gold zari trellis with small silver flowers, and the zari border across the shoulder', 'Pista 2 (close-up).png', { role: 'detail' }),
    ],
    crops: {
      silhouette: { img: 0 }, fall: { img: 0, s: 1.4, ox: '50%', oy: '92%' }, pallu: { img: 0, s: 1.4, ox: '65%', oy: '62%' },
      border: { img: 1, s: 1.3, ox: '40%', oy: '25%' }, weave: { img: 1, s: 1.3, ox: '50%', oy: '55%' },
      motif: { img: 1, s: 1.6, ox: '60%', oy: '50%' }, colour: { img: 1, s: 1.3, ox: '50%', oy: '60%' },
      swatch: { img: 1, s: 1.6, ox: '55%', oy: '60%' }, styling: { img: 1, s: 1.3, ox: '25%', oy: '20%', op: '25% 15%' },
    },
    backdrop: { img: 0, pos: '60% 60%' } },

  { slug: 'dariya', name: 'Dariya', meaning: 'the river',
    descriptor: 'Aqua with a multicolour floral border',
    description: 'Dariya is a soft aqua with small silver butis, bordered by a trailing vine of flowers in indigo, coral, green and marigold.',
    colourLine: 'Aqua, edged with a garden.',
    styling: 'Shown with pearl drop earrings, stacked silver cuffs and long loose waves.',
    edits: ['soft'], colours: [['Aqua', '#A6D6D4'], ['Indigo', '#3B4F86']],
    border: 'Trailing vine of indigo, coral, green and marigold flowers', motif: 'Small silver zari butis',
    closer: ['Aqua, indigo and coral', 'Small silver butis', 'A trailing floral vine'],
    images: [
      img('dariya.jpg', 1024, 1279, 'Dariya — an aqua saree with a multicolour floral border, worn beside bamboo and a white pillar against a teal wall', 'Dariya 1 (bamboo).png', { frame: { x: 0.063 } }),
      img('dariya-smile.jpg', 1024, 1279, 'Dariya worn with the pallu over the shoulder: silver butis on aqua and the floral border', 'Dariya 2 (smiling).png', { frame: { x: 0.04 } }),
      img('dariya-detail.jpg', 1024, 1279, 'Dariya up close: the floral border in indigo, coral, green and marigold, and small silver butis on aqua', 'Dariya 3 (close-up).png', { role: 'detail' }),
    ],
    crops: {
      silhouette: { img: 0 }, fall: { img: 0, s: 1.4, ox: '55%', oy: '90%' }, pallu: { img: 0, s: 1.4, ox: '55%', oy: '70%' },
      border: { img: 2, s: 1.3, ox: '50%', oy: '30%' }, weave: { img: 2, s: 1.3, ox: '60%', oy: '60%' },
      motif: { img: 2, s: 1.6, ox: '30%', oy: '85%' }, colour: { img: 2, s: 1.3, ox: '65%', oy: '60%' },
      swatch: { img: 2, s: 1.6, ox: '60%', oy: '65%' }, styling: { img: 1, s: 1.4, ox: '50%', oy: '30%', op: '50% 25%' },
    },
    backdrop: { img: 0, pos: '55% 70%' } },
];

const built = S.map((s) => ({
  slug: s.slug, name: s.name, nameMeaning: s.meaning,
  descriptor: s.descriptor,
  description: s.description, descriptionStatus: 'draft',
  colourLine: s.colourLine, colourLineStatus: 'draft',
  styling: s.styling, stylingStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: s.edits,
  categories: ['banarasi'],
  categoryEvidence: { 'banarasi': BANARAS },
  colours: s.colours.map(([name, h]) => ({ name, ...tone(h) })),
  attributes: { fabric: null, colourway: s.colours[0][0], border: s.border, motif: s.motif, length: null, blousePiece: null, weave: null, origin: null, availability: null },
  galleryListed: true,
  images: s.images,
  crops: s.crops,
  looks: [],
  backdrop: { ...s.backdrop, posMobile: s.backdrop.pos },
  closer: { heading: s.colourLine, headingStatus: 'draft', items: [['Colour', s.closer[0]], ['Motif', s.closer[1]], ['Border', s.closer[2]]] },
}));

for (const p of built) for (const im of p.images.filter((i) => i.frame)) {
  const r = (im.frame.w * im.width) / (im.frame.h * im.height);
  if (Math.abs(r - 0.75) > 0.005 || im.frame.x + im.frame.w > 1.0001 || im.frame.y + im.frame.h > 1.0001) throw new Error(`${im.src}: not a 3:4 window inside the photo`);
  if (!fs.existsSync('.' + im.src)) throw new Error(`missing ${im.src}`);
}
const slugs = new Set(built.map((p) => p.slug));
d.products = d.products.filter((p) => !slugs.has(p.slug));
const names = new Set(d.products.map((p) => p.name.toLowerCase()));
for (const p of built) if (names.has(p.name.toLowerCase())) throw new Error(`name already used: ${p.name}`);
const after = ['narangi', 'megh'].map((s) => d.products.findIndex((p) => p.slug === s)).find((i) => i >= 0);
d.products.splice(after + 1, 0, ...built);
d._notes.nov16b = 'Neelambari, Gulaabi, Pista and Dariya come from model photographs supplied on 16 Nov 2026 (model photography/<Name> N (...).png). Names and copy are proposals; fabric and price have not been supplied; Banaras ki Bunkari is from the visible weave and needs confirming. No original SN product photos yet (SN numbers not known).';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', built.map((p) => p.slug).join(', '), 'after', d.products[after].slug);
