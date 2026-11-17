// Adds four sarees from the white-villa / garden shoot (sent November 16) to products.json, after Dariya. Safe to re-run.
// Run from homepage/: node _tools/add-nov16-garden.cjs
// Photos: the full-size files in model photography/ (identical to the ones pasted in chat), converted to JPEG q92,
// no edits, as assets/images/<slug>*.jpg. The same shoot's Dariya (aqua) and Pista (mint) were already added.
// Names and copy are proposals stating only what the photos show (draft). Fabric, price and SN number not supplied;
// Banaras ki Bunkari is from the visible zari weave and needs confirming.
// Frames: 3:4 windows as shares of the photo (on 1024×1536 w = 1.125 × h; on 1024×1280 w = 0.9375 × h), by eye.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name, h) => ({ name, ...tone(h) });

const W = 1024;
const img = (file, H, source, alt, extra = {}) => {
  if (extra.frame) { const { x, y, h } = extra.frame; const w = +((0.75 * h * H) / W).toFixed(4); if (x + w > 1.0001 || y + h > 1.0001) throw new Error(`${file}: frame outside photo`); extra = { ...extra, frame: { x, y, w, h } }; }
  return { src: `/assets/images/${file}.jpg`, width: W, height: H, alt, source, ...extra };
};
const BANARAS = { 'banarasi': 'Visible style only (zari weave): confirm with the client' };
const base = { descriptionStatus: 'draft', colourLineStatus: 'draft', stylingStatus: 'draft', price: null, priceIsPlaceholder: false, isNew: true, categories: ['banarasi'], categoryEvidence: BANARAS, looks: [] };
const attrs = (colourway, border, motif) => ({ fabric: null, colourway, border, motif, length: null, blousePiece: null, weave: null, origin: null, availability: null });
const crops = (P, D, B, F) => ({ // P = portrait index, D = detail index; B/F = body and face points on the portrait
  silhouette: { img: P }, fall: { img: P, s: 1.5, ox: '50%', oy: '90%' }, pallu: { img: P, s: 1.5, ox: B[0], oy: B[1] },
  border: { img: D, s: 1.4, ox: '70%', oy: '60%' }, weave: { img: D, s: 1.3, ox: '45%', oy: '60%' }, borderDetail: { img: D, s: 1.5, ox: '70%', oy: '60%' },
  motif: { img: D, s: 2, ox: '45%', oy: '65%' }, colour: { img: P, s: 1.3, ox: B[0], oy: B[1] }, swatch: { img: D, s: 1.8, ox: '40%', oy: '75%' },
  styling: { img: P, s: 1.8, ox: F[0], oy: F[1], op: `${F[0]} ${F[1]}` },
});

const S = [
  { ...base, slug: 'tota', name: 'Tota', nameMeaning: 'a parrot',
    descriptor: 'Parrot green with zari buta',
    description: 'Tota is a lustrous parrot-green silk scattered with gold and silver zari flower buta, edged with a zari border of lotus vines, and a pallu woven with zari birds touched with pink.',
    colourLine: 'Parrot green, catching the light.',
    styling: 'Shown with a sleeveless wine and gold paisley brocade blouse tied at the back, gold jhumkas and a wide gold cuff.',
    edits: ['bright', 'contrast', 'festive'],
    colours: [colour('Parrot green', '#5FA52E'), colour('Zari gold', '#C9B27A')],
    attributes: attrs('Parrot green', 'Zari border of lotus vines with a leaf edge', 'Gold and silver zari flower buta; zari birds on the pallu'),
    images: [
      img('tota', 1280, 'Elegant Green Saree Portrait 1.png', 'Tota — a parrot-green silk saree with zari buta and a bird pallu, worn against a white wall beside a navy shutter', { pos: '50% 50%', frame: { x: 0.03, y: 0, h: 1 } }),
      img('tota-window', 1280, 'Elegant Green Sari Portrait 1.png', 'Tota worn by a navy shutter, the zari lotus border across her shoulder and the pallu swept out', { pos: '55% 40%', frame: { x: 0.06, y: 0, h: 1 } }),
      img('tota-detail', 1280, 'South Asian Woman in Green Sari and Gold Embroidery 1.png', 'Tota from behind: the zari lotus-vine border and buta on parrot green, with a wine brocade blouse tied at the back', { role: 'detail' }),
    ],
    crops: { ...crops(0, 2, ['55%', '45%'], ['50%', '18%']), border: { img: 2, s: 1.4, ox: '55%', oy: '58%' }, borderDetail: { img: 2, s: 1.5, ox: '55%', oy: '58%' }, motif: { img: 2, s: 2, ox: '55%', oy: '85%' }, swatch: { img: 2, s: 1.8, ox: '55%', oy: '85%' } },
    backdrop: { img: 0, pos: '55% 55%', posMobile: '55% 55%' },
    closer: { heading: 'Parrot green, catching the light.', headingStatus: 'draft', items: [['Colour', 'Parrot green and zari'], ['Motif', 'Zari buta, birds on the pallu'], ['Border', 'Zari lotus vines']] } },
  { ...base, slug: 'saagar', name: 'Saagar', nameMeaning: 'the sea',
    descriptor: 'Teal with a coral zari border',
    description: 'Saagar is teal silk with a fine diagonal check texture and large zari flowers, framed by a wide coral border of zari flowering vines with a temple edge.',
    colourLine: 'Teal, edged in coral.',
    styling: 'Shown with a coral brocade blouse, mint-stone and pearl drop earrings, a silver cuff and a sleek low bun.',
    edits: ['jewel', 'contrast', 'festive'],
    colours: [colour('Teal', '#3E8FA0'), colour('Coral', '#E8705F'), colour('Zari gold', '#D7C49A')],
    attributes: attrs('Teal', 'Wide coral zari border of flowering vines, temple edge', 'Large zari flowers on a diagonal check texture'),
    images: [
      img('saagar', 1536, 'Teal Sari with Coral Filigree Border 1.png', 'Saagar — a teal silk saree with zari flowers and a wide coral border, worn with a coral blouse against a navy door', { pos: '45% 45%', frame: { x: 0, y: 0.04, h: 0.8889 } }),
      img('saagar-detail', 1536, 'Elegant Teal Saree Portrait 1.png', 'Saagar up close: large zari flowers on teal check, between the coral zari borders', { role: 'detail' }),
    ],
    crops: { ...crops(0, 1, ['55%', '55%'], ['42%', '15%']), border: { img: 1, s: 1.4, ox: '25%', oy: '75%' }, borderDetail: { img: 1, s: 1.5, ox: '45%', oy: '10%' }, motif: { img: 1, s: 2, ox: '75%', oy: '50%' }, swatch: { img: 1, s: 1.8, ox: '60%', oy: '40%' } },
    backdrop: { img: 0, pos: '50% 55%', posMobile: '50% 55%' },
    closer: { heading: 'Teal, edged in coral.', headingStatus: 'draft', items: [['Colour', 'Teal and coral'], ['Motif', 'Zari flowers on check'], ['Border', 'Coral zari vines, temple edge']] } },
  { ...base, slug: 'nilam', name: 'Nilam', nameMeaning: 'sapphire',
    descriptor: 'Sapphire with meenakari rose buta',
    description: 'Nilam is sapphire-blue silk scattered with silver zari buta and roses in pink, mustard and green, with a silver zari border of lotus vines and a pallu of silver zari peonies.',
    colourLine: 'Sapphire, strewn with roses.',
    styling: 'Shown with a mustard silk blouse tied at the back, square gold earrings, stacked gold bangles and long loose waves.',
    edits: ['jewel', 'contrast', 'festive'],
    colours: [colour('Sapphire', '#1F4E8C'), colour('Silver zari', '#C9CDD3'), colour('Rose pink', '#D23C6E')],
    attributes: attrs('Sapphire', 'Silver zari border of lotus vines', 'Silver zari buta and meenakari roses; peony pallu'),
    images: [
      img('nilam', 1536, 'Serene Garden Portrait in Blue Sari 1.png', 'Nilam — a sapphire silk saree with meenakari rose buta and a silver peony pallu, worn with a mustard blouse in a garden', { pos: '55% 50%', frame: { x: 0.01, y: 0.13, h: 0.87 } }),
      img('nilam-back', 1536, 'Cobalt Saree in Soft Daylight 1.png', 'Nilam from behind, the pallu held out to show the silver lotus border and rose buta', { pos: '35% 55%', frame: { x: 0, y: 0.15, h: 0.85 } }),
      img('nilam-detail', 1536, 'Elegant Blue Sari Garden Portrait 1.png', 'Nilam up close: pink and silver rose buta on sapphire, beside the silver zari lotus border', { role: 'detail' }),
    ],
    crops: { ...crops(0, 2, ['60%', '60%'], ['48%', '28%']), border: { img: 2, s: 1.4, ox: '75%', oy: '55%' }, borderDetail: { img: 2, s: 1.5, ox: '75%', oy: '60%' }, motif: { img: 2, s: 2, ox: '50%', oy: '75%' }, swatch: { img: 2, s: 1.8, ox: '45%', oy: '80%' } },
    backdrop: { img: 1, pos: '35% 60%', posMobile: '35% 60%' },
    closer: { heading: 'Sapphire, strewn with roses.', headingStatus: 'draft', items: [['Colour', 'Sapphire and silver'], ['Motif', 'Meenakari rose buta'], ['Border', 'Silver zari lotus vines']] } },
  { ...base, slug: 'baingani', name: 'Baingani', nameMeaning: 'the purple of an aubergine',
    descriptor: 'Purple with silver buta and a meenakari pallu',
    description: 'Baingani is deep purple silk scattered with small silver flower buta, finished with a silver zari temple border, a broad silver lattice band and a pallu of geometric meenakari in blue, pink and yellow.',
    colourLine: 'Purple, silvered at the edges.',
    styling: 'Shown with a bottle-green and gold brocade blouse, a gold collar necklace with stone drops, stacked gold cuffs and loose waves.',
    edits: ['jewel', 'festive'],
    colours: [colour('Purple', '#5A2A86'), colour('Silver zari', '#C9C3CF')],
    attributes: attrs('Purple', 'Silver zari temple border; broad silver lattice band', 'Silver flower buta; geometric meenakari pallu'),
    images: [
      img('baingani', 1536, 'Elegant Purple Sari in a Garden Gazebo 1.png', 'Baingani — a purple silk saree with silver buta and a broad silver lattice border, worn in a garden gazebo', { pos: '45% 55%', frame: { x: 0.01, y: 0.13, h: 0.86 } }),
      img('baingani-portrait', 1536, 'Elegant Purple Saree Garden Portrait 1.png', 'Baingani worn with a green brocade blouse, the meenakari pallu gathered in her hands', { pos: '50% 40%', frame: { x: 0, y: 0.03, h: 0.8889 } }),
      img('baingani-detail', 1536, 'Purple Sari and Silver Border 1.png', 'Baingani from behind: silver flower buta on purple and the silver zari temple border', { role: 'detail' }),
    ],
    crops: { ...crops(0, 2, ['45%', '60%'], ['55%', '20%']), border: { img: 2, s: 1.4, ox: '52%', oy: '50%' }, borderDetail: { img: 2, s: 1.5, ox: '52%', oy: '50%' }, motif: { img: 2, s: 2, ox: '25%', oy: '45%' }, swatch: { img: 2, s: 1.8, ox: '25%', oy: '60%' } },
    backdrop: { img: 0, pos: '45% 60%', posMobile: '45% 60%' },
    closer: { heading: 'Purple, silvered at the edges.', headingStatus: 'draft', items: [['Colour', 'Purple and silver'], ['Motif', 'Silver buta, meenakari pallu'], ['Border', 'Silver zari temple, lattice band']] } },
];

const slugs = new Set(S.map((p) => p.slug));
d.products = d.products.filter((p) => !slugs.has(p.slug));
const names = new Set(d.products.map((p) => p.name.toLowerCase()));
for (const p of S) if (names.has(p.name.toLowerCase())) throw new Error(`name already used: ${p.name}`);
let at = d.products.findIndex((p) => p.slug === 'dariya');
if (at < 0) at = d.products.findIndex((p) => p.slug === 'narangi');
d.products.splice(at + 1, 0, ...S);
d._notes.nov16garden = 'Tota, Saagar, Nilam and Baingani come from the white-villa / garden shoot photos in model photography/ (sent November 16). Names and copy are proposals; fabric, price and SN number have not been supplied; Banaras ki Bunkari is from the visible weave and needs confirming.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', S.map((p) => p.slug).join(', '), 'after', d.products[at].slug, '— total', d.products.length);
