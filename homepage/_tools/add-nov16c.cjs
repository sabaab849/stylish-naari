// Adds Kamdhenu, Gulnaar, Saawan and Gagan (model photographs supplied 16 Nov 2026, model photography/, identical to the
// ones pasted in chat) to products.json, after Baingani. Safe to re-run. Run from homepage/:
//   powershell -File _tools/convert-nov16c.ps1 && node _tools/add-nov16c.cjs
// Photos: full size (1024 px wide), JPEG q95, no edits, as assets/images/<slug>*.jpg.
// Names and copy are proposals stating only what the photos show (draft). Fabric, price and SN number not supplied.
// No category: none of the four shows a weave or craft that places it in a region; ask the client.
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
const attrs = (colourway, border, motif) => ({ fabric: null, colourway, border, motif, length: null, blousePiece: null, weave: null, origin: null, availability: null });
const crops = (P, D, B, F) => ({ // P = portrait index, D = detail index; B/F = body and face points on the portrait
  silhouette: { img: P }, fall: { img: P, s: 1.5, ox: '50%', oy: '90%' }, pallu: { img: P, s: 1.5, ox: B[0], oy: B[1] },
  border: { img: D, s: 1.4, ox: '70%', oy: '60%' }, weave: { img: D, s: 1.3, ox: '45%', oy: '60%' }, borderDetail: { img: D, s: 1.5, ox: '70%', oy: '60%' },
  motif: { img: D, s: 2, ox: '45%', oy: '65%' }, colour: { img: P, s: 1.3, ox: B[0], oy: B[1] }, swatch: { img: D, s: 1.8, ox: '40%', oy: '75%' },
  styling: { img: P, s: 1.8, ox: F[0], oy: F[1], op: `${F[0]} ${F[1]}` },
});
// Points on the detail photo for border, weave, motif and swatch ([ox, oy])
const at = (D, pts) => ({
  border: { img: D, s: 1.4, ox: pts.border[0], oy: pts.border[1] }, borderDetail: { img: D, s: 1.5, ox: pts.border[0], oy: pts.border[1] },
  weave: { img: D, s: 1.3, ox: pts.weave[0], oy: pts.weave[1] }, motif: { img: D, s: 2, ox: pts.motif[0], oy: pts.motif[1] },
  swatch: { img: D, s: 1.8, ox: pts.swatch[0], oy: pts.swatch[1] },
});
const base = { descriptionStatus: 'draft', colourLineStatus: 'draft', stylingStatus: 'draft', price: null, priceIsPlaceholder: false, isNew: true, categories: [], looks: [] };

const S = [
  { ...base, slug: 'kamdhenu', name: 'Kamdhenu', nameMeaning: 'the wish-granting cow',
    descriptor: 'Dusty rose with an ivory scallop print and embroidered cows',
    description: 'Kamdhenu is a dusty rose with a fine check texture, printed all over with ivory scallops, with a band of cows embroidered in ivory and powder blue along the border and the pallu, and a tasselled end.',
    colourLine: 'Dusty rose, with cows at the hem.',
    styling: 'Shown with a strapless scalloped blouse in the same print and embroidered cows, a stone pendant necklace, wide gold cuffs and loose curls.',
    edits: ['soft'],
    colours: [colour('Dusty rose', '#C99790'), colour('Ivory', '#F1E9E1')],
    attributes: attrs('Dusty rose', 'Band of embroidered cows in ivory and powder blue', 'Ivory scallop print on a fine check; tasselled pallu'),
    images: [
      img('kamdhenu', 1536, 'Romantic Saree Portrait Under Floral Canopy 1.png', 'Kamdhenu — a dusty rose saree printed with ivory scallops and embroidered cows at the hem, worn beneath a white canopy strung with roses', { pos: '50% 55%', frame: { x: 0, y: 0.1, h: 0.8889 } }),
      img('kamdhenu-detail', 1536, 'Elegant Pink Sari Portrait 1.png', 'Kamdhenu up close: cows embroidered in ivory and powder blue above the scallop print, and the tasselled pallu over the shoulder', { role: 'detail' }),
    ],
    crops: { ...crops(0, 1, ['50%', '58%'], ['48%', '22%']), ...at(1, { border: ['50%', '50%'], weave: ['55%', '82%'], motif: ['42%', '50%'], swatch: ['45%', '85%'] }) },
    backdrop: { img: 0, pos: '50% 60%', posMobile: '50% 60%' },
    closer: { heading: 'Dusty rose, with cows at the hem.', headingStatus: 'draft', items: [['Colour', 'Dusty rose and ivory'], ['Motif', 'Ivory scallops on a fine check'], ['Border', 'Embroidered cows']] } },

  { ...base, slug: 'gulnaar', name: 'Gulnaar', nameMeaning: 'pomegranate blossom',
    descriptor: 'Magenta with zari stripes and an embroidered rose border',
    description: 'Gulnaar is a deep magenta woven with fine zari stripes, framed on every edge by a wide border of embroidered roses and blossoms in coral, peach and ivory on green leaves.',
    colourLine: 'Magenta, bordered in roses.',
    styling: 'Shown with a mustard blouse embroidered in ivory, gold earrings with pearl and sapphire drops, and long loose hair.',
    edits: ['jewel', 'festive'],
    colours: [colour('Magenta', '#8E2463'), colour('Coral', '#EE7D68')],
    attributes: attrs('Magenta', 'Wide border of embroidered roses in coral, peach and ivory', 'Fine zari stripes'),
    images: [
      img('gulnaar', 1280, 'Elegant Magenta Sari Portrait 1.png', 'Gulnaar — a magenta saree with fine zari stripes and a wide embroidered rose border, worn with a mustard blouse beside a white arched window', { pos: '50% 50%', frame: { x: 0.03, y: 0, h: 1 } }),
      img('gulnaar-back', 1279, 'Embroidered Magenta Sari Portrait 1.png', 'Gulnaar from behind, the pallu held out to show the zari stripes between two borders of embroidered roses', { pos: '45% 55%', frame: { x: 0.02, y: 0, h: 1 } }),
      img('gulnaar-detail', 1280, 'Embroidered Magenta Sari Portrait (1) 1.png', 'Gulnaar up close: roses and blossoms embroidered in coral, peach and ivory above the zari stripes', { role: 'detail' }),
    ],
    crops: { ...crops(0, 2, ['50%', '65%'], ['55%', '25%']), ...at(2, { border: ['60%', '55%'], weave: ['60%', '85%'], motif: ['60%', '55%'], swatch: ['55%', '88%'] }) },
    backdrop: { img: 1, pos: '45% 60%', posMobile: '45% 60%' },
    closer: { heading: 'Magenta, bordered in roses.', headingStatus: 'draft', items: [['Colour', 'Magenta and coral'], ['Motif', 'Fine zari stripes'], ['Border', 'Embroidered roses and blossoms']] } },

  { ...base, slug: 'saawan', name: 'Saawan', nameMeaning: 'the monsoon month',
    descriptor: 'Teal, moss green and rust in broad stripes',
    description: 'Saawan runs in broad stripes of teal, moss green and rust, softly mottled like a wall after rain, with a teal pallu finished in fine gold stripes.',
    colourLine: 'Teal and moss, after the rain.',
    styling: 'Shown with a sleeveless black blouse, oxidised silver earrings, a silver bird ring and a low ponytail.',
    edits: ['jewel', 'contrast'],
    colours: [colour('Teal', '#1F5E72'), colour('Moss green', '#8AA63F'), colour('Rust', '#8C4A2F')],
    attributes: attrs('Teal', 'Teal pallu with fine gold stripes', 'Broad mottled stripes of teal, moss green and rust'),
    images: [
      img('saawan', 1536, 'Mediterranean Sari in Motion 1.png', 'Saawan — a saree in broad stripes of teal, moss green and rust, the pallu flying out on a white terrace beside a cobalt urn', { pos: '40% 50%', frame: { x: 0, y: 0.08, h: 0.8889 } }),
      img('saawan-detail', 1536, 'Sari Elegance Beside a Blue Urn 1.png', 'Saawan up close: mottled teal, moss green and rust stripes drawn over the shoulder, with a black blouse', { role: 'detail' }),
    ],
    crops: { ...crops(0, 1, ['40%', '62%'], ['42%', '22%']), ...at(1, { border: ['25%', '70%'], weave: ['70%', '55%'], motif: ['28%', '62%'], swatch: ['30%', '85%'] }) },
    backdrop: { img: 0, pos: '40% 60%', posMobile: '40% 60%' },
    closer: { heading: 'Teal and moss, after the rain.', headingStatus: 'draft', items: [['Colour', 'Teal, moss green and rust'], ['Motif', 'Broad mottled stripes'], ['Border', 'Gold stripes on the pallu']] } },

  { ...base, slug: 'gagan', name: 'Gagan', nameMeaning: 'the sky',
    descriptor: 'Sheer sky blue with an embroidered scalloped border',
    description: 'Gagan is a sheer sky blue traced with large ivory flowers, edged with a scalloped border embroidered with roses and blossoms in pink, peach and ivory on green vines.',
    colourLine: 'Sky blue, edged in blossom.',
    styling: 'Shown with a navy mirror-work halter blouse, oxidised silver jhumkas, a wide silver cuff and a low braid.',
    edits: ['soft', 'bright'],
    colours: [colour('Sky blue', '#7CC3EA'), colour('Blush pink', '#E8A8BF')],
    attributes: attrs('Sky blue', 'Scalloped border embroidered with pink, peach and ivory flowers', 'Large ivory flowers on sheer sky blue'),
    images: [
      img('gagan', 1280, 'Sari Elegance in a Vintage Turquoise Car 1.png', 'Gagan — a sheer sky blue saree with large ivory flowers and an embroidered scalloped border, worn seated in a vintage turquoise car', { pos: '50% 50%', frame: { x: 0.03, y: 0, h: 1 } }),
      img('gagan-detail', 1280, 'Elegant Blue Embroidered Sari Portrait 1.png', 'Gagan up close: the scalloped border embroidered with pink and peach roses over the shoulder, with a navy mirror-work blouse', { role: 'detail' }),
    ],
    crops: { ...crops(0, 1, ['50%', '55%'], ['52%', '28%']), ...at(1, { border: ['72%', '70%'], weave: ['25%', '85%'], motif: ['55%', '70%'], swatch: ['22%', '88%'] }) },
    backdrop: { img: 0, pos: '50% 60%', posMobile: '50% 60%' },
    closer: { heading: 'Sky blue, edged in blossom.', headingStatus: 'draft', items: [['Colour', 'Sky blue and blush'], ['Motif', 'Large ivory flowers'], ['Border', 'Embroidered scallops']] } },
];

for (const p of S) for (const im of p.images) if (!fs.existsSync('.' + im.src)) throw new Error(`missing ${im.src}: run convert-nov16c.ps1 first`);
const slugs = new Set(S.map((p) => p.slug));
d.products = d.products.filter((p) => !slugs.has(p.slug));
const names = new Set(d.products.map((p) => p.name.toLowerCase()));
for (const p of S) if (names.has(p.name.toLowerCase())) throw new Error(`name already used: ${p.name}`);
let pos = d.products.findIndex((p) => p.slug === 'baingani');
if (pos < 0) pos = d.products.findIndex((p) => p.slug === 'dariya');
d.products.splice(pos + 1, 0, ...S);
d._notes.nov16c = 'Kamdhenu, Gulnaar, Saawan and Gagan come from model photographs supplied on 16 Nov 2026 (model photography/). Names and copy are proposals; fabric, price, SN number and category have not been supplied.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', S.map((p) => p.slug).join(', '), 'after', d.products[pos].slug, '— total', d.products.length);
