// Adds four sarees from the red-damask / blue-jali shoot (sent November 16) to products.json, after Megh. Safe to re-run.
// Run from homepage/: node _tools/add-nov16-shoot.cjs
// Photos: the high-res versions pasted in chat (1024×1536), kept in "model photography/hi-res Nov 16/" and converted to
// JPEG q92 as assets/images/<slug>*.jpg. The small 200–245 px PNGs in model photography/ (e.g. "Regal Woman in a Bronze
// Silk Saree 1.png") were NOT used. Two of those ("Blue Palace Incense Portrait 1", "Cobalt Alcove in a Crimson Sari 1",
// both Hiran) have no high-res version yet, so Hiran has one photograph.
// Names and copy are proposals stating only what the photos show (draft). Fabric, price and SN number not supplied;
// Banaras ki Bunkari is from the visible zari weave and needs confirming.
// Frames: 3:4 windows (w = 1.125 × h on these photos), measured by eye on a 10% grid.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name, h) => ({ name, ...tone(h) });
const W = 1024, H = 1536;
const fr = (x, y, h) => { const w = +(1.125 * h).toFixed(4); if (x + w > 1.0001 || y + h > 1.0001) throw new Error(`frame outside photo ${x} ${y} ${h}`); return { x, y, w, h }; };
const img = (file, alt, extra = {}) => ({ src: `/assets/images/${file}.jpg`, width: W, height: H, alt, source: `model photography/hi-res Nov 16/${file}.png (pasted in chat, November 16)`, ...extra });
const BANARAS = { 'banarasi': 'Visible style only (zari weave): confirm with the client' };
const base = { descriptionStatus: 'draft', colourLineStatus: 'draft', stylingStatus: 'draft', price: null, priceIsPlaceholder: false, isNew: true, categories: ['banarasi'], categoryEvidence: BANARAS, looks: [] };
const attrs = (colourway, border, motif) => ({ fabric: null, colourway, border, motif, length: null, blousePiece: null, weave: null, origin: null, availability: null });

const S = [
  { ...base, slug: 'hiran', name: 'Hiran', nameMeaning: 'a deer',
    descriptor: 'Vermilion with zari deer medallions',
    description: 'Hiran is vermilion silk woven with small zari deer and large tree-of-life medallions circled by leaping deer, with a pallu of fine zari lattice.',
    colourLine: 'Vermilion, where the deer run.',
    styling: 'Shown with an embroidered mustard blouse, long gold and pearl chandbali earrings, stacked gold cuffs and red roses in a low bun.',
    edits: ['bright', 'festive'],
    colours: [colour('Vermilion', '#D2401E'), colour('Zari gold', '#C9A26A')],
    attributes: attrs('Vermilion', 'Zari lattice pallu', 'Zari deer and tree-of-life medallions'),
    images: [img('hiran', 'Hiran — a vermilion silk saree with zari deer medallions, worn with a mustard blouse beside a carved jali window in a blue room', { pos: '50% 40%', frame: fr(0.02, 0.14, 0.86) })],
    crops: { silhouette: { img: 0 }, fall: { img: 0, s: 1.5, ox: '50%', oy: '92%' }, pallu: { img: 0, s: 1.6, ox: '62%', oy: '60%' },
      border: { img: 0, s: 2.2, ox: '30%', oy: '75%' }, weave: { img: 0, s: 2.4, ox: '60%', oy: '62%' }, borderDetail: { img: 0, s: 2.4, ox: '30%', oy: '75%' },
      motif: { img: 0, s: 2.8, ox: '58%', oy: '60%' }, colour: { img: 0, s: 1.4, ox: '55%', oy: '70%' }, swatch: { img: 0, s: 2.4, ox: '45%', oy: '82%' },
      styling: { img: 0, s: 1.8, ox: '45%', oy: '35%', op: '45% 25%' } },
    backdrop: { img: 0, pos: '55% 60%', posMobile: '55% 60%' },
    closer: { heading: 'Vermilion, where the deer run.', headingStatus: 'draft', items: [['Colour', 'Vermilion and zari'], ['Motif', 'Zari deer, tree-of-life medallions'], ['Border', 'Zari lattice pallu']] } },
  { ...base, slug: 'kumkum', name: 'Kumkum', nameMeaning: 'the red powder worn in the parting',
    descriptor: 'Rust with meenakari floral buta',
    description: 'Kumkum is a soft rust georgette woven all over with zari flower sprays and buta in coral, navy and olive, finished with a deep zari border of trailing flowers.',
    colourLine: 'Rust, scattered with flowers.',
    styling: 'Shown with a green and gold brocade blouse, long gold chandbali earrings, a stack of gold bangles and pink lotus buds.',
    edits: ['jewel', 'festive'],
    colours: [colour('Rust', '#8E2418'), colour('Coral', '#E0604A'), colour('Navy', '#2A2F6B')],
    attributes: attrs('Rust', 'Deep zari border of trailing flowers', 'Zari flower sprays; coral, navy and olive buta'),
    images: [
      img('kumkum', 'Kumkum — a rust saree with coral, navy and olive flower buta, worn holding lotus buds beside a velvet curtain', { pos: '50% 60%', frame: fr(0.12, 0.26, 0.74) }),
      img('kumkum-standing', 'Kumkum worn standing against red damask, the pallu falling over her arm to show the deep zari border', { pos: '50% 50%', frame: fr(0, 0.04, 0.8889) }),
      img('kumkum-detail', 'Kumkum up close: zari flower sprays and coral, navy and olive buta on rust, beside the zari border', { role: 'detail' }),
    ],
    crops: { silhouette: { img: 1 }, fall: { img: 1, s: 1.5, ox: '50%', oy: '90%' }, pallu: { img: 1, s: 1.5, ox: '55%', oy: '55%' },
      border: { img: 2, s: 1.4, ox: '75%', oy: '70%' }, weave: { img: 2, s: 1.3, ox: '60%', oy: '30%' }, borderDetail: { img: 2, s: 1.5, ox: '78%', oy: '72%' },
      motif: { img: 2, s: 2, ox: '65%', oy: '30%' }, colour: { img: 1, s: 1.3, ox: '55%', oy: '55%' }, swatch: { img: 2, s: 1.8, ox: '60%', oy: '25%' },
      styling: { img: 0, s: 1.8, ox: '32%', oy: '50%', op: '32% 42%' } },
    backdrop: { img: 1, pos: '55% 55%', posMobile: '55% 55%' },
    closer: { heading: 'Rust, scattered with flowers.', headingStatus: 'draft', items: [['Colour', 'Rust, coral and navy'], ['Motif', 'Meenakari flower buta'], ['Border', 'Deep zari, trailing flowers']] } },
  { ...base, slug: 'chandni', name: 'Chandni', nameMeaning: 'moonlight',
    descriptor: 'Silver-lilac tissue with a gold border',
    description: 'Chandni is a silver-lilac tissue with a woven zigzag texture that catches the light, framed by a broad gold zari border and a gold pallu, edged in mauve.',
    colourLine: 'Silver-lilac, lit by the moon.',
    styling: 'Shown with a sleeveless brocade blouse, long gold jhumka earrings with a pearl-edged pendant, a gold cuff and red and marigold flowers in her hair.',
    edits: ['festive', 'contrast'],
    colours: [colour('Silver lilac', '#B6A4B8'), colour('Gold', '#C9963F')],
    attributes: attrs('Silver lilac', 'Broad gold zari border, mauve edge', 'Woven zigzag texture; gold zari pallu'),
    images: [
      img('chandni', 'Chandni — a silver-lilac tissue saree with a broad gold border, worn smiling between red velvet curtains', { pos: '55% 60%', frame: fr(0.12, 0.22, 0.77) }),
      img('chandni-posed', 'Chandni worn full length, the gold pallu held out over her arm against red damask', { pos: '52% 60%', frame: fr(0.09, 0.22, 0.77) }),
      img('chandni-pose', 'Chandni worn with a hand raised to the curtain, the silver-lilac drape and gold border across her shoulder', { pos: '45% 55%', frame: fr(0.05, 0.24, 0.76) }),
      img('chandni-detail', 'Chandni up close: the zigzag texture of the silver-lilac tissue and the gold zari pallu, edged in mauve', { role: 'detail' }),
    ],
    crops: { silhouette: { img: 0 }, fall: { img: 0, s: 1.5, ox: '50%', oy: '90%' }, pallu: { img: 1, s: 1.5, ox: '62%', oy: '62%' },
      border: { img: 3, s: 1.3, ox: '70%', oy: '70%' }, weave: { img: 3, s: 1.3, ox: '55%', oy: '25%' }, borderDetail: { img: 3, s: 1.5, ox: '72%', oy: '72%' },
      motif: { img: 3, s: 2, ox: '60%', oy: '25%' }, colour: { img: 0, s: 1.3, ox: '50%', oy: '60%' }, swatch: { img: 3, s: 1.8, ox: '55%', oy: '20%' },
      styling: { img: 2, s: 1.8, ox: '42%', oy: '40%', op: '42% 30%' } },
    backdrop: { img: 1, pos: '52% 60%', posMobile: '52% 60%' },
    closer: { heading: 'Silver-lilac, lit by the moon.', headingStatus: 'draft', items: [['Colour', 'Silver lilac and gold'], ['Motif', 'Woven zigzag texture'], ['Border', 'Broad gold zari, mauve edge']] } },
  { ...base, slug: 'narangi', name: 'Narangi', nameMeaning: 'orange, the colour and the fruit',
    descriptor: 'Orange brocade with red meenakari flowers',
    description: 'Narangi is orange silk brocade woven in gold with bands of paisley and trellis, set with small red and green meenakari flowers, and a gold pallu of scrolling paisleys.',
    colourLine: 'Orange, warmed with gold.',
    styling: 'Shown with a red brocade blouse, long gold earrings with turquoise drops, stacked gold cuffs, a bindi and red roses in her hair.',
    edits: ['bright', 'festive'],
    colours: [colour('Orange', '#E07A2E'), colour('Zari gold', '#C9A26A'), colour('Red', '#B5202A')],
    attributes: attrs('Orange', 'Gold zari paisley pallu', 'Paisley and trellis bands; red and green meenakari flowers'),
    images: [
      img('narangi', 'Narangi — an orange brocade saree with red meenakari flowers, worn with a red brocade blouse between red velvet curtains', { pos: '54% 55%', frame: fr(0.03, 0.12, 0.86) }),
      img('narangi-profile', 'Narangi worn in profile against red damask, the gold pallu over her shoulder', { pos: '50% 50%', frame: fr(0.005, 0.12, 0.88) }),
      img('narangi-detail', 'Narangi up close: gold paisley and trellis bands with red and green meenakari flowers on orange', { role: 'detail' }),
    ],
    crops: { silhouette: { img: 0 }, fall: { img: 0, s: 1.5, ox: '50%', oy: '90%' }, pallu: { img: 1, s: 1.5, ox: '70%', oy: '60%' },
      border: { img: 2, s: 1.4, ox: '65%', oy: '55%' }, weave: { img: 2, s: 1.3, ox: '40%', oy: '80%' }, borderDetail: { img: 2, s: 1.5, ox: '65%', oy: '50%' },
      motif: { img: 2, s: 2, ox: '45%', oy: '85%' }, colour: { img: 0, s: 1.3, ox: '50%', oy: '65%' }, swatch: { img: 2, s: 1.8, ox: '35%', oy: '80%' },
      styling: { img: 1, s: 1.8, ox: '55%', oy: '30%', op: '55% 22%' } },
    backdrop: { img: 0, pos: '54% 60%', posMobile: '54% 60%' },
    closer: { heading: 'Orange, warmed with gold.', headingStatus: 'draft', items: [['Colour', 'Orange, gold and red'], ['Motif', 'Paisley, trellis, meenakari flowers'], ['Border', 'Gold zari paisley pallu']] } },
];

const slugs = new Set(S.map((p) => p.slug));
d.products = d.products.filter((p) => !slugs.has(p.slug));
const names = new Set(d.products.map((p) => p.name.toLowerCase()));
for (const p of S) if (names.has(p.name.toLowerCase())) throw new Error(`name already used: ${p.name}`);
const at = d.products.findIndex((p) => p.slug === 'megh');
d.products.splice(at + 1, 0, ...S);
d._notes.nov16shoot = 'Hiran, Kumkum, Chandni and Narangi come from the high-res shoot photos pasted in chat on November 16 (kept in model photography/hi-res Nov 16). Names and copy are proposals; fabric, price and SN number have not been supplied; Banaras ki Bunkari is from the visible weave and needs confirming.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', S.map((p) => p.slug).join(', '), 'after megh — total', d.products.length);
