// Adds the 25 Premium Semi-Silk sarees (AI model photographs supplied 16 Nov 2026) to products.json, after Gagan.
// Safe to re-run. Run from homepage/:
//   powershell -File _tools/convert-semi-silk.ps1 && node _tools/add-semi-silk.cjs && node _tools/dedupe-folded.cjs
// dedupe-folded then removes the folded catalogue PDP of each saree (or its colour from a multi-colour PDP) and moves
// the client's price, fabric, range and catalogue description onto the model PDP.
// Model photos: model photography/premium silk ai photography/ (= Drive 01 – Banarasi/Premium Semi-Silk/AI Model Photography).
// SN numbers matched by eye, model photo against the Drive "Original Product Photos – Pendrive" photos (colour, motif,
// border). Of the 25 sarees on the client's Semi-Silk list, SN-051, SN-058, SN-073 and SN-075 have no model photo in
// this set; the set instead covers SN-062 (green colour of Art silk kanchi border), SN-066 (emerald colour of Sona rupa
// jamdani), SN-068 (the purple brocade filed under Double-shade border, catalogue colour "royal-blue") and SN-083 (Semi
// Banarasi pashmina). Gallery (galleryListed): model photo, then the SN's own photo, a print close-up and a different
// view, whole photos turned upright where they were shot landscape (see convert-semi-silk.ps1).
// Names and copy are proposals that state only what the photographs show (status "draft").
// Frames (3:4 windows) by eye on a 10% grid: t = a little above the head, b = just under the hem, cx = the middle of the
// model and saree. Crop points (x, y as shares of the photo): F face, P pallu, B body fabric, D border, M motif, H fall.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const pc = (v) => `${Math.round(v * 100)}%`;
const r4 = (v) => +v.toFixed(4);
function frameOf({ t, b, cx }, w, H) {
  let h = b - t, fw = (h * H * 0.75) / w;
  if (fw > 1) { fw = 1; h = (w / 0.75) / H; }
  const x = Math.min(Math.max(cx - fw / 2, 0), 1 - fw), y = Math.min(t, 1 - h);
  const fr = { x: r4(x), y: r4(y), w: r4(fw), h: r4(h) };
  const ratio = (fr.w * w) / (fr.h * H);
  if (Math.abs(ratio - 0.75) > 0.005 || fr.x + fr.w > 1.0001 || fr.y + fr.h > 1.0001) throw new Error(`frame not 3:4 inside the photo (${w}×${H})`);
  return fr;
}
const imgSize = (file) => { // JPEG dimensions from the SOF marker
  const b = fs.readFileSync(file); let i = 2;
  while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; }
  throw new Error('no size: ' + file);
};
const BANARAS = 'Client catalogue: Banarasi – Premium Semi-Silk (Drive folder 01 – Banarasi)';
const DRIVE = 'Drive: 01 – Banarasi / Premium Semi-Silk / Original Product Photos – Pendrive';

// slug → [SN, slide 2, slide 3, slide 4] (NN in the Drive file names; same list as convert-semi-silk.ps1)
const S = [
  { slug: 'surmai', name: 'Surmai', meaning: 'the grey of kohl', file: 'Elegant Gold and Silver Saree Portrait 1.png', sn: ['057', '01', '02', '03'],
    descriptor: 'Grey with a gold zari pallu',
    description: 'Surmai is a soft grey woven with fine zari stripes, set against a broad gold pallu and border patterned with rosettes and a row of paisley medallions.',
    colourLine: 'Kohl grey, edged in gold.',
    styling: 'Shown with a gold brocade blouse, emerald drop earrings and a matching necklace, a maang tikka, pearl bangles and a low bun.',
    edits: ['soft', 'festive'], colours: [['Grey', '#9A979A'], ['Gold', '#D8C27A']],
    border: 'Broad gold zari border with rosettes', motif: 'Fine zari stripes; paisley medallions on the pallu', closer: ['Grey and gold', 'Paisley medallions', 'Broad gold zari'],
    alt: 'Surmai — a grey saree with a broad gold zari pallu, worn standing in front of an olive arch with dried grasses',
    fr: { t: 0.01, b: 0.97, cx: 0.5 }, pts: { F: [0.47, 0.08], P: [0.6, 0.5], B: [0.38, 0.55], D: [0.45, 0.93], M: [0.68, 0.8], H: [0.4, 0.9] } },
  { slug: 'zamurrad', name: 'Zamurrad', meaning: 'emerald', file: 'Elegant Green Saree Studio Portrait 1.png', sn: ['066', '01', '04', '05'],
    descriptor: 'Emerald with a gold lattice',
    description: 'Zamurrad is a deep emerald woven all over with a gold lattice and small florets, framed by a wide gold border with a magenta edge.',
    colourLine: 'Emerald, latticed in gold.',
    styling: 'Shown with a sleeveless emerald blouse trimmed in gold, a fine gold choker, stud earrings and a low bun with a pink rose.',
    edits: ['jewel', 'festive'], colours: [['Emerald', '#1F4A2A'], ['Gold', '#C9A85A'], ['Magenta', '#9A1F6A']],
    border: 'Wide gold border with a magenta edge', motif: 'Gold lattice with small florets', closer: ['Emerald and gold', 'Gold lattice', 'Wide gold, magenta edge'],
    alt: 'Zamurrad — an emerald saree with a gold lattice, worn standing beside brass urns of pink flowers',
    fr: { t: 0.05, b: 0.95, cx: 0.55 }, pts: { F: [0.47, 0.1], P: [0.62, 0.45], B: [0.5, 0.55], D: [0.55, 0.9], M: [0.6, 0.35], H: [0.5, 0.88] } },
  { slug: 'shahtoot', name: 'Shahtoot', meaning: 'the mulberry', file: 'Elegant Magenta Saree Portrait (2) 1.png', sn: ['076', '01', '03', '02'],
    descriptor: 'Mulberry with appliqué flowers',
    description: 'Shahtoot is a deep mulberry kora with large flowers and leaves laid on in a brighter magenta, finished with a broad silver-pink border and a tasselled pallu.',
    colourLine: 'Mulberry, in bloom.',
    styling: 'Shown with a matching puff-sleeved blouse, gold jhumka earrings and long loose waves.',
    edits: ['jewel'], colours: [['Mulberry', '#7A1450'], ['Magenta', '#B8247A'], ['Silver pink', '#E2C2CC']],
    border: 'Broad silver-pink border; tasselled pallu', motif: 'Large appliqué flowers and leaves', closer: ['Mulberry and silver', 'Appliqué flowers', 'Silver-pink, tasselled'],
    alt: 'Shahtoot — a mulberry saree with appliqué flowers and a tasselled pallu, worn leaning against an ochre wall',
    fr: { t: 0.02, b: 0.96, cx: 0.45 }, pts: { F: [0.43, 0.08], P: [0.48, 0.3], B: [0.5, 0.7], D: [0.5, 0.9], M: [0.5, 0.65], H: [0.48, 0.85] } },
  { slug: 'khubani', name: 'Khubani', meaning: 'the apricot', file: 'Elegant Peach Floral Saree Portrait 1.png', sn: ['053', '01', '02', '03'],
    descriptor: 'Peach with pastel jamdani flowers',
    description: 'Khubani is a light peach woven with pastel flowers in pink, lilac and sky blue, edged with a broad gold border and a fine red selvedge.',
    colourLine: 'Apricot, with a red edge.',
    styling: 'Shown with a sleeveless peach brocade blouse, a gold choker with a pendant, small gold earrings and a low bun.',
    edits: ['soft', 'festive'], colours: [['Peach', '#EDB6A0'], ['Gold', '#D7B678'], ['Red', '#C8282C']],
    border: 'Broad gold border with a red selvedge', motif: 'Pastel jamdani flowers', closer: ['Peach and gold', 'Pastel flowers', 'Gold, red edge'],
    alt: 'Khubani — a peach saree with pastel woven flowers and a red edge, worn standing beneath hanging marigolds',
    fr: { t: 0.22, b: 0.99, cx: 0.52 }, pts: { F: [0.5, 0.3], P: [0.6, 0.55], B: [0.5, 0.65], D: [0.55, 0.92], M: [0.5, 0.7], H: [0.5, 0.92] } },
  { slug: 'kachnar', name: 'Kachnar', meaning: 'the orchid tree in flower', file: 'Elegant Pink Saree Portrait 1.png', sn: ['071', '01', '03', '02'],
    descriptor: 'Pink with ivory leaves and a lime border',
    description: 'Kachnar is a soft pink patterned with large ivory leaves and a yellow flower, bordered in lime green woven with an ivory diamond lattice and a temple edge.',
    colourLine: 'Pink, leafed in lime.',
    styling: 'Shown with a sleeveless lime blouse, a stone-set choker and small earrings, with the hair in a low bun.',
    edits: ['bright', 'contrast'], colours: [['Pink', '#E58A96'], ['Lime', '#9BAA32'], ['Ivory', '#F2EADA']],
    border: 'Lime border with an ivory diamond lattice and temple edge', motif: 'Large ivory leaves and a yellow flower', closer: ['Pink and lime', 'Ivory leaves', 'Lime lattice, temple edge'],
    alt: 'Kachnar — a pink saree with ivory leaves and a lime green border, worn standing between banks of hydrangeas and orchids',
    fr: { t: 0.1, b: 0.96, cx: 0.5 }, pts: { F: [0.47, 0.15], P: [0.6, 0.5], B: [0.45, 0.6], D: [0.6, 0.9], M: [0.4, 0.45], H: [0.5, 0.88] } },
  { slug: 'jharokha', name: 'Jharokha', meaning: 'a latticed window', file: 'Elegant Red Saree Botanical Portrait 1.png', sn: ['050', '01', '04', '02'],
    descriptor: 'Red with a gold lattice and meenakari',
    description: 'Jharokha is a bright red woven with a gold trellis set with small flowers in blue, green and pink, and a pallu of gold paisleys in the same colours.',
    colourLine: 'Red, through a gold lattice.',
    styling: 'Shown from behind with a matching red brocade blouse, a maang tikka, gold earrings and red roses in a low bun.',
    edits: ['bright', 'festive'], colours: [['Red', '#C8201E'], ['Gold', '#D9A85A'], ['Blue', '#2B3E9A']],
    border: 'Gold zari border with coloured flowers', motif: 'Gold trellis with meenakari flowers; paisley pallu', closer: ['Red and gold', 'Gold trellis', 'Gold zari, coloured flowers'],
    alt: 'Jharokha — a red saree with a gold lattice, seen from behind with the pallu falling down her back, in front of a misty forest mural',
    fr: { t: 0.1, b: 0.97, cx: 0.4 }, pts: { F: [0.47, 0.18], P: [0.45, 0.45], B: [0.4, 0.35], D: [0.4, 0.93], M: [0.4, 0.75], H: [0.4, 0.88] } },
  { slug: 'gunja', name: 'Gunja', meaning: 'the red seed with a black eye', file: 'Elegant Red Saree Portrait (1) 1.png', sn: ['070', '01', '04', '03'],
    descriptor: 'Red with a black floral border',
    description: 'Gunja is a deep red scattered with small gold buti, framed by a broad black border of gold flowers on a winding vine, with a black pallu worked all over in gold.',
    colourLine: 'Red, bordered in black.',
    styling: 'Shown with a black brocade blouse, a gold choker and long temple necklace, gold earrings, stacked bangles and a low bun.',
    edits: ['contrast', 'festive'], colours: [['Red', '#C41E22'], ['Black', '#1A1414'], ['Gold', '#C9A45E']],
    border: 'Broad black border of gold flowers on a vine', motif: 'Small gold buti; black and gold pallu', closer: ['Red and black', 'Gold buti', 'Black, gold vine'],
    alt: 'Gunja — a red saree with a broad black and gold floral border, worn standing in front of a draped brown backdrop',
    fr: { t: 0.08, b: 0.97, cx: 0.5 }, pts: { F: [0.47, 0.12], P: [0.6, 0.45], B: [0.42, 0.55], D: [0.65, 0.7], M: [0.75, 0.8], H: [0.45, 0.9] } },
  { slug: 'gulbahar', name: 'Gulbahar', meaning: 'spring in flower', file: 'Elegant Red Saree in Arched Studio Setting 1.png', sn: ['055', '01', '03', '02'],
    descriptor: 'Red with multicolour flowers and a fringed pallu',
    description: 'Gulbahar is a bright red worked with scattered flowers in orange, blue and ivory, its border and pallu woven with paisleys in gold and colour, ending in a fringe.',
    colourLine: 'Red, in full spring.',
    styling: 'Shown with a short-sleeved red blouse patterned in the same flowers, small gold earrings, a pearl bracelet and loose waves.',
    edits: ['bright', 'festive'], colours: [['Red', '#C8221E'], ['Orange', '#E07A3A'], ['Gold', '#D3A864']],
    border: 'Paisley border in gold and colour; fringed pallu', motif: 'Scattered multicolour flowers', closer: ['Red and gold', 'Scattered flowers', 'Gold paisley, fringed'],
    alt: 'Gulbahar — a red saree with multicolour flowers, the fringed pallu lifting in the air, in an ochre room with arched niches',
    fr: { t: 0.12, b: 0.95, cx: 0.55 }, pts: { F: [0.42, 0.27], P: [0.72, 0.6], B: [0.45, 0.55], D: [0.5, 0.4], M: [0.65, 0.6], H: [0.42, 0.88] } },
  { slug: 'jaswand', name: 'Jaswand', meaning: 'the hibiscus', file: 'Elegant Saree Portrait by Lotus Bowl 1.png', sn: ['061', '01', '04', '03'],
    descriptor: 'Rani pink with a purple zari border',
    description: 'Jaswand is a vivid rani pink woven with large gold floral buti, framed by a broad purple border and pallu patterned in pink and gold diamonds.',
    colourLine: 'Hibiscus pink, bordered in purple.',
    styling: 'Shown with a purple brocade blouse, gold jhumka earrings, stacked gold bangles and rings, and a low bun.',
    edits: ['jewel', 'contrast', 'festive'], colours: [['Rani pink', '#D6205E'], ['Purple', '#6B2A9A'], ['Gold', '#D3A564']],
    border: 'Broad purple border with pink and gold diamonds', motif: 'Large gold floral buti', closer: ['Rani pink and purple', 'Gold floral buti', 'Purple, gold diamonds'],
    alt: 'Jaswand — a rani pink saree with a purple border, worn seated beside a brass bowl of lotus buds before a painted landscape',
    fr: { t: 0.27, b: 0.99, cx: 0.5 }, pts: { F: [0.47, 0.33], P: [0.7, 0.75], B: [0.4, 0.7], D: [0.6, 0.9], M: [0.6, 0.65], H: [0.4, 0.9] } },
  { slug: 'tulsi', name: 'Tulsi', meaning: 'holy basil', file: 'Emerald Saree Marigold Portrait 1.png', sn: ['054', '01', '05', '06'],
    descriptor: 'Bottle green with silver buti',
    description: 'Tulsi is a deep bottle green scattered with silver floral buti, finished with a broad silver border of rosettes and a temple edge, and a silver-worked pallu.',
    colourLine: 'Basil green, in silver.',
    styling: 'Shown with a green and silver brocade blouse, a gold choker with an emerald drop, jhumka earrings and a low bun.',
    edits: ['jewel', 'festive'], colours: [['Bottle green', '#16402A'], ['Silver', '#C9C9C2']],
    border: 'Broad silver border of rosettes with a temple edge', motif: 'Silver floral buti', closer: ['Bottle green and silver', 'Silver buti', 'Silver rosettes, temple edge'],
    alt: 'Tulsi — a bottle green saree with silver buti and border, worn standing beneath hanging marigolds beside clay pots',
    fr: { t: 0.08, b: 0.95, cx: 0.5 }, pts: { F: [0.48, 0.17], P: [0.58, 0.6], B: [0.45, 0.5], D: [0.55, 0.88], M: [0.45, 0.45], H: [0.5, 0.88] } },
  { slug: 'tesu', name: 'Tesu', meaning: 'the saffron flame of the forest', file: 'Golden Orange Saree Editorial Portrait 1.png', sn: ['078', '01', '03', '02'],
    descriptor: 'Marigold orange with red buti',
    description: 'Tesu is a warm marigold orange with a tone-on-tone floral weave, scattered with small red flowers inside pale rosettes.',
    colourLine: 'Saffron orange, flecked with red.',
    styling: 'Shown with a matching sleeveless blouse, a layered antique-gold bib necklace, a wide beaded cuff, a cocktail ring and long loose hair.',
    edits: ['bright'], colours: [['Marigold', '#F0A21E'], ['Red', '#D2412E']],
    border: 'Self-coloured border', motif: 'Red flowers in pale rosettes on a tone-on-tone floral weave', closer: ['Marigold and red', 'Red flowers in rosettes', 'Self-coloured'],
    alt: 'Tesu — a marigold orange saree with small red flowers, worn standing against a terracotta backdrop',
    fr: null, pos: '50% 40%', pts: { F: [0.5, 0.1], P: [0.62, 0.45], B: [0.45, 0.65], D: [0.6, 0.85], M: [0.6, 0.55], H: [0.5, 0.9] } },
  { slug: 'mitti', name: 'Mitti', meaning: 'earth', file: 'Golden Saree Portrait in an Ochre Interior 1.png', sn: ['056', '01', '04', '03'],
    descriptor: 'Earthy beige with coloured buti',
    description: 'Mitti is a soft earthen beige scattered with small buti in orange, green and silver, framed by a wide silver border of flowers on a vine.',
    colourLine: 'Earth, lit with colour.',
    styling: 'Shown with a matching beige blouse, long chandbali earrings, a gold bracelet and a loose braid.',
    edits: ['soft'], colours: [['Beige', '#BFAE96'], ['Silver', '#D9D4CA'], ['Orange', '#E08A2A']],
    border: 'Wide silver border of flowers on a vine', motif: 'Small orange, green and silver buti', closer: ['Beige and silver', 'Coloured buti', 'Silver floral vine'],
    alt: 'Mitti — an earthy beige saree with small coloured buti and a silver border, worn in an ochre room lit with brass lamps',
    fr: { t: 0.1, b: 0.95, cx: 0.55 }, pts: { F: [0.6, 0.17], P: [0.65, 0.6], B: [0.5, 0.55], D: [0.6, 0.88], M: [0.6, 0.5], H: [0.5, 0.88] } },
  { slug: 'kokum', name: 'Kokum', meaning: 'the deep red-purple fruit', file: 'Graceful Magenta Sari Profile 1.png', sn: ['080', '01', '04', '03'],
    descriptor: 'Magenta with hand-embroidered flowers',
    description: 'Kokum is a deep magenta kora with small hand-embroidered flower sprays and sequins, finished with a broad silver-pink zari border and pallu.',
    colourLine: 'Kokum, with a silver pallu.',
    styling: 'Shown in profile with a matching blouse, gold earrings, stacked gold bangles, gold heels and jasmine in a low bun.',
    edits: ['jewel', 'festive'], colours: [['Magenta', '#8C1A5A'], ['Silver pink', '#E5C7CF']],
    border: 'Broad silver-pink zari border', motif: 'Hand-embroidered flower sprays and sequins', closer: ['Magenta and silver pink', 'Embroidered flower sprays', 'Silver-pink zari'],
    alt: 'Kokum — a magenta saree with embroidered flowers, walking in profile with the silver-pink pallu streaming behind her',
    fr: { t: 0.12, b: 0.93, cx: 0.55 }, pts: { F: [0.2, 0.2], P: [0.75, 0.55], B: [0.35, 0.6], D: [0.4, 0.82], M: [0.35, 0.42], H: [0.35, 0.8] } },
  { slug: 'amavas', name: 'Amavas', meaning: 'the moonless night', file: 'Heritage Elegance in Embroidered Black Saree 1.png', sn: ['074', '01', '03', '04'],
    descriptor: 'Black with ivory paisleys and a floral border',
    description: 'Amavas is a black malmal set with large ivory paisleys and leaf motifs, bordered by a vine of ivory, red, yellow and turquoise flowers.',
    colourLine: 'Black, lit by flowers.',
    styling: 'Shown with a black blouse edged in the same floral border, gold jhumka earrings, black and gold bangles and long loose waves.',
    edits: ['contrast'], colours: [['Black', '#151212'], ['Ivory', '#E8DCC8'], ['Red', '#C0392B']],
    border: 'Vine border of ivory, red, yellow and turquoise flowers', motif: 'Large ivory paisleys and leaves', closer: ['Black and ivory', 'Ivory paisleys', 'Multicolour floral vine'],
    alt: 'Amavas — a black saree with ivory paisleys and a multicolour floral border, worn between carved sandstone pillars',
    fr: { t: 0.08, b: 0.96, cx: 0.5 }, pts: { F: [0.47, 0.15], P: [0.6, 0.5], B: [0.42, 0.55], D: [0.65, 0.6], M: [0.42, 0.7], H: [0.45, 0.9] } },
  { slug: 'shikara', name: 'Shikara', meaning: 'a boat on a Kashmir lake', file: 'Heritage Temple Saree Portrait 1.png', sn: ['083', '01', '02', '03'],
    descriptor: 'Royal blue with pink paisleys',
    description: 'Shikara is a royal blue woven densely with paisleys and flowers in pink, coral and green, leaving a plain blue band at the hem, with a matching paisley border.',
    colourLine: 'Royal blue, woven with paisleys.',
    styling: 'Shown with a royal blue blouse, a gold floral headband, a stone-set choker, a gold waist belt and red bangles.',
    edits: ['jewel', 'festive'], colours: [['Royal blue', '#2430B0'], ['Pink', '#D2508A'], ['Coral', '#E06A50']],
    border: 'Paisley border in pink and green', motif: 'Dense paisleys and flowers in pink, coral and green', closer: ['Royal blue and pink', 'Dense paisleys', 'Pink and green paisley'],
    alt: 'Shikara — a royal blue saree woven with pink paisleys, worn standing between carved temple pillars',
    fr: { t: 0.18, b: 0.97, cx: 0.5 }, pts: { F: [0.47, 0.27], P: [0.6, 0.55], B: [0.4, 0.5], D: [0.4, 0.93], M: [0.6, 0.65], H: [0.45, 0.9] } },
  { slug: 'saunf', name: 'Saunf', meaning: 'fennel', file: 'Model 01 in Olive Silk Elegance 1.png', sn: ['062', '02', '03', '04'],
    descriptor: 'Olive with gold buti and a paisley border',
    description: 'Saunf is a lustrous olive green scattered with gold floral buti, edged with a broad grey-gold border of paisleys and a fine purple selvedge.',
    colourLine: 'Fennel green, in gold.',
    styling: 'Shown with a sleeveless plum blouse, a pearl and gold choker, chandbali earrings, a gold bracelet and a red rose in a low bun.',
    edits: ['jewel', 'contrast', 'festive'], colours: [['Olive', '#7E8F2A'], ['Grey gold', '#A69A78'], ['Purple', '#7A1F6A']],
    border: 'Broad grey-gold paisley border with a purple selvedge', motif: 'Gold floral buti', closer: ['Olive and gold', 'Gold floral buti', 'Grey-gold paisley, purple edge'],
    alt: 'Saunf — an olive green saree with gold buti and a paisley border, worn standing before a carved settee and candelabra',
    fr: { t: 0.1, b: 0.98, cx: 0.5 }, pts: { F: [0.5, 0.2], P: [0.62, 0.6], B: [0.45, 0.55], D: [0.6, 0.9], M: [0.65, 0.88], H: [0.45, 0.9] } },
  { slug: 'neem', name: 'Neem', meaning: 'the neem tree', file: 'Modern Muse in Emerald Silk 1.png', sn: ['082', '01', '03', '04'],
    descriptor: 'Emerald with embroidered flowers and a silver border',
    description: 'Neem is a deep emerald with small hand-embroidered flower sprays in ivory, pink and gold, framed by a broad silver border and pallu woven with ogee medallions.',
    colourLine: 'Neem green, sprigged with flowers.',
    styling: 'Shown with an emerald blouse embroidered with gold leaves, a gold floral headband, a stone-set choker, a gold waist belt and red bangles.',
    edits: ['jewel', 'festive'], colours: [['Emerald', '#1D4A30'], ['Silver', '#C8C8C0'], ['Pink', '#D9A0A8']],
    border: 'Broad silver border with ogee medallions', motif: 'Hand-embroidered flower sprays', closer: ['Emerald and silver', 'Embroidered flower sprays', 'Silver ogee medallions'],
    alt: 'Neem — an emerald saree with embroidered flowers and a broad silver border, worn standing between carved temple pillars',
    fr: { t: 0.18, b: 0.97, cx: 0.5 }, pts: { F: [0.5, 0.27], P: [0.6, 0.6], B: [0.45, 0.6], D: [0.55, 0.9], M: [0.65, 0.68], H: [0.5, 0.92] } },
  { slug: 'sitara', name: 'Sitara', meaning: 'a star', file: 'Modern Muse in Navy Saree 1.png', sn: ['065', '01', '04', '05'],
    descriptor: 'Navy with a silver geometric jaal',
    description: 'Sitara is a deep navy woven all over with a silver geometric jaal of stars and lattices, edged with a silver floral border and a fine rani pink selvedge.',
    colourLine: 'Navy, full of stars.',
    styling: 'Shown with a navy blouse edged in silver, a stone-set choker, gold jhumka earrings, stacked bangles and long loose waves.',
    edits: ['jewel', 'contrast', 'festive'], colours: [['Navy', '#22234F'], ['Silver', '#C9CBD2'], ['Rani pink', '#C8186A']],
    border: 'Silver floral border with a rani pink selvedge', motif: 'Silver geometric jaal of stars and lattices', closer: ['Navy and silver', 'Geometric star jaal', 'Silver, pink edge'],
    alt: 'Sitara — a navy saree with a silver geometric jaal, worn standing between two hanging marigold garlands',
    fr: { t: 0.12, b: 0.93, cx: 0.48 }, pts: { F: [0.45, 0.18], P: [0.55, 0.55], B: [0.45, 0.4], D: [0.5, 0.9], M: [0.48, 0.45], H: [0.45, 0.88] } },
  { slug: 'gulaal', name: 'Gulaal', meaning: 'the coloured powder of Holi', file: 'Modern Muse in a Red Sari 1.png', sn: ['077', '01', '04', '03'],
    descriptor: 'Red stripes with a rose-pink pallu',
    description: 'Gulaal is a bright red woven with stripes of silver-gold motifs, finished with a rose-pink border and a pink pallu worked all over in zari.',
    colourLine: 'Red stripes, dusted pink.',
    styling: 'Shown with a matching striped blouse, an oxidised silver pendant and jhumka earrings, silver rings and a loose low bun.',
    edits: ['bright', 'contrast'], colours: [['Red', '#C81E26'], ['Rose pink', '#E89AAE'], ['Zari', '#D8C29A']],
    border: 'Rose-pink border; pink zari pallu', motif: 'Stripes of silver-gold motifs', closer: ['Red and rose pink', 'Zari stripes', 'Rose-pink'],
    alt: 'Gulaal — a red saree with zari stripes and a rose-pink pallu, worn standing before a plaster arch with clay pots',
    fr: { t: 0.18, b: 0.95, cx: 0.6 }, pts: { F: [0.55, 0.27], P: [0.68, 0.5], B: [0.6, 0.4], D: [0.7, 0.85], M: [0.65, 0.45], H: [0.55, 0.85] } },
  { slug: 'aparajita', name: 'Aparajita', meaning: 'the blue butterfly-pea flower', file: 'Royal Blue Sari in a Botanical Studio 1.png', sn: ['081', '01', '02', '03'],
    descriptor: 'Royal blue with a gold floral jungla',
    description: 'Aparajita is a royal blue scattered with gold rosettes centred in red, its pallu and border a dense jungle of gold flowers and leaves around red blossoms.',
    colourLine: 'Royal blue, overgrown in gold.',
    styling: 'Shown with a royal blue blouse, a gold choker and earrings, and the hair swept into a low bun.',
    edits: ['jewel', 'festive'], colours: [['Royal blue', '#2A28B0'], ['Gold', '#D4B06A'], ['Red', '#C0283A']],
    border: 'Gold floral border with red blossoms', motif: 'Gold rosettes; a gold floral jungla on the pallu', closer: ['Royal blue and gold', 'Gold floral jungla', 'Gold, red blossoms'],
    alt: 'Aparajita — a royal blue saree with a gold floral pallu swept wide across the frame, in front of a painted banana-leaf mural',
    fr: { t: 0.3, b: 1, cx: 0.55 }, pts: { F: [0.3, 0.38], P: [0.7, 0.65], B: [0.35, 0.75], D: [0.6, 0.95], M: [0.65, 0.6], H: [0.4, 0.85] } },
  { slug: 'banafsha', name: 'Banafsha', meaning: 'the violet', file: 'Royal Purple Silk Saree Portrait (1) 1.png', sn: ['068', '01', '03', '05'],
    descriptor: 'Violet brocade woven in copper',
    description: 'Banafsha is a violet brocade woven all over in copper zari with leaves, flowers and paisleys, with a geometric border and a fine violet edge.',
    colourLine: 'Violet, all in copper.',
    styling: 'Shown seated with a violet blouse, a gold choker, small earrings, a gold bracelet and pink roses in a braided bun.',
    edits: ['jewel', 'festive'], colours: [['Violet', '#5A35A8'], ['Copper zari', '#B88A6A']],
    border: 'Geometric copper zari border with a violet edge', motif: 'All-over copper brocade of leaves, flowers and paisleys', closer: ['Violet and copper', 'All-over brocade', 'Geometric copper'],
    alt: 'Banafsha — a violet brocade saree woven in copper, worn seated on a stone plinth beside brass vessels and hanging bells',
    fr: { t: 0.3, b: 0.92, cx: 0.65 }, pts: { F: [0.73, 0.38], P: [0.75, 0.7], B: [0.55, 0.55], D: [0.85, 0.85], M: [0.75, 0.65], H: [0.55, 0.55] } },
  { slug: 'kumud', name: 'Kumud', meaning: 'the water lily', file: 'Serene Lotus Pond Saree Portrait 1.png', sn: ['079', '01', '02', '03'],
    descriptor: 'Ivory with pink and yellow rangkat bands',
    description: 'Kumud is an ivory woven all over with fine zari flowers, washed with diagonal bands of rose pink and soft yellow, finished with a tasselled pallu.',
    colourLine: 'Ivory, blushing pink and gold.',
    styling: 'Shown seated with a rose-pink brocade blouse, a beaded gold choker, gold jhumka earrings, gold bangles and a loose low bun.',
    edits: ['soft'], colours: [['Ivory', '#EDE4D6'], ['Rose pink', '#C98AA0'], ['Yellow', '#E2B848']],
    border: 'Ivory zari border; tasselled pallu', motif: 'Fine zari flowers with diagonal rangkat bands of pink and yellow', closer: ['Ivory, pink and yellow', 'Rangkat bands', 'Ivory zari, tasselled'],
    alt: 'Kumud — an ivory saree washed with pink and yellow bands, worn seated on mossy stone steps beside a misty lotus pond',
    fr: { t: 0.22, b: 0.99, cx: 0.5 }, pts: { F: [0.5, 0.27], P: [0.75, 0.75], B: [0.45, 0.65], D: [0.55, 0.83], M: [0.65, 0.6], H: [0.45, 0.8] } },
  { slug: 'maina', name: 'Maina', meaning: 'the myna bird', file: 'Serene Magenta Saree Portrait 1.png', sn: ['052', '01', '04', '08'],
    descriptor: 'Magenta with birds among flowers',
    description: 'Maina is a deep magenta woven all over with flowers and birds in pink, lilac, sage and gold on curling vines, framed by a broad copper-gold border with a pallu of floral medallions.',
    colourLine: 'Magenta, full of birdsong.',
    styling: 'Shown seated with a matching blouse, gold jhumka earrings, a gold bangle and jasmine in a loose bun.',
    edits: ['jewel', 'festive'], colours: [['Magenta', '#9A1660'], ['Copper gold', '#D29A5A'], ['Lilac', '#B79ACB']],
    border: 'Broad copper-gold border with a leaf edge', motif: 'Birds and flowers on curling vines; floral medallions on the pallu', closer: ['Magenta and copper gold', 'Birds among flowers', 'Copper gold, leaf edge'],
    alt: 'Maina — a magenta saree woven with birds and flowers, worn seated with the pallu spread out before a deep red wall',
    fr: { t: 0.12, b: 0.98, cx: 0.5 }, pts: { F: [0.42, 0.18], P: [0.75, 0.7], B: [0.35, 0.65], D: [0.5, 0.9], M: [0.4, 0.55], H: [0.35, 0.85] } },
  { slug: 'pudina', name: 'Pudina', meaning: 'mint', file: 'Serene Sage-Green Saree Portrait 1.png', sn: ['072', '01', '03', '04'],
    descriptor: 'Mint with silver buti and a floral border',
    description: 'Pudina is a pale mint scattered with silver floral buti, with a lime green border of flowers in blue, orange and pink, and an ivory pallu woven with a fine lattice.',
    colourLine: 'Mint, edged in a garden.',
    styling: 'Shown seated with a lime blouse in the same floral border, drop earrings and jasmine in a low bun.',
    edits: ['soft'], colours: [['Mint', '#CFE0C8'], ['Lime', '#98A83A'], ['Silver', '#E2E2DA']],
    border: 'Lime border of blue, orange and pink flowers', motif: 'Silver floral buti; ivory lattice pallu', closer: ['Mint and lime', 'Silver buti', 'Lime floral'],
    alt: 'Pudina — a mint saree with silver buti and a lime floral border, worn seated between carved cream columns',
    fr: { t: 0.15, b: 0.94, cx: 0.5 }, pts: { F: [0.45, 0.2], P: [0.6, 0.6], B: [0.45, 0.6], D: [0.3, 0.85], M: [0.4, 0.6], H: [0.4, 0.8] } },
  { slug: 'laali', name: 'Laali', meaning: 'a blush of red', file: 'Timeless Coral Saree Elegance 1.png', sn: ['064', '01', '03', '04'],
    descriptor: 'Coral red with gold buti',
    description: 'Laali is a bright coral red scattered with gold rosette buti, framed by a fine gold border and a pallu woven in gold and pink diamonds.',
    colourLine: 'Coral red, in gold.',
    styling: 'Shown with a sleeveless red halter blouse, a pearl and gold choker, chandbali earrings, a maang tikka, a gold kaleera and red roses in a low bun.',
    edits: ['bright', 'festive'], colours: [['Coral red', '#E2403A'], ['Gold', '#D3A564'], ['Pink', '#D8507A']],
    border: 'Fine gold border; pallu of gold and pink diamonds', motif: 'Gold rosette buti', closer: ['Coral red and gold', 'Gold rosettes', 'Fine gold'],
    alt: 'Laali — a coral red saree with gold buti, worn standing before a carved settee and candelabra',
    fr: { t: 0.08, b: 0.97, cx: 0.55 }, pts: { F: [0.47, 0.14], P: [0.65, 0.5], B: [0.6, 0.6], D: [0.55, 0.93], M: [0.6, 0.55], H: [0.45, 0.9] } },
];

const one = (slug, kind) => { const src = `/assets/images/${slug}${kind ? '-' + kind : ''}.jpg`; const [width, height] = imgSize(`assets/images/${slug}${kind ? '-' + kind : ''}.jpg`); return { src, width, height }; };
const low = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const at = (pt, s, extra = {}) => ({ img: 0, s, ox: pc(pt[0]), oy: pc(pt[1]), ...extra });

const built = S.map((s) => {
  const { F, P, B, H: fall } = s.pts; const [sn, n1, n2, n3] = s.sn;
  const model = one(s.slug);
  const shot = (kind, nn, alt) => ({ ...one(s.slug, kind), role: 'product', fit: 'cover', alt, source: `${DRIVE} / SN-${sn} – ${nn}`, sn: `SN-${sn}` });
  return {
    slug: s.slug, name: s.name, nameMeaning: s.meaning,
    descriptor: s.descriptor,
    description: s.description, descriptionStatus: 'draft',
    colourLine: s.colourLine, colourLineStatus: 'draft',
    styling: s.styling, stylingStatus: 'draft',
    price: null, priceIsPlaceholder: false, isNew: true,
    edits: s.edits,
    categories: ['banarasi'], categoryEvidence: { 'banarasi': BANARAS },
    colours: s.colours.map(([name, h]) => ({ name, ...tone(h) })),
    attributes: { fabric: null, colourway: s.colours[0][0], border: s.border, motif: s.motif, length: null, blousePiece: null, weave: null, origin: null, availability: null },
    galleryListed: true,
    images: [
      { ...model, ...(s.pos ? { pos: s.pos } : { pos: `${pc(s.fr.cx)} 50%` }), alt: s.alt, source: `model photography/premium silk ai photography/${s.file}`,
        ...(s.fr ? { frame: frameOf(s.fr, model.width, model.height) } : {}) },
      shot('original', n1, `${s.name}, the saree itself: ${low(s.descriptor)}`),
      shot('print', n2, `${s.name} up close: ${low(s.motif)}`),
      shot('border', n3, `${s.name}, another view: ${low(s.border)}`),
    ],
    crops: {
      silhouette: { img: 0 },
      fall: at(fall, 1.5),
      pallu: at(P, 1.5),
      border: { img: 3, s: 1.1, ox: '50%', oy: '50%' },
      weave: { img: 2, s: 1.3, ox: '50%', oy: '50%' },
      borderDetail: { img: 3, s: 1.3, ox: '50%', oy: '50%' },
      motif: { img: 2, s: 1.6, ox: '50%', oy: '50%' },
      colour: at(B, 1.4),
      swatch: { img: 2, s: 2, ox: '30%', oy: '70%' },
      styling: { img: 0, s: 1.8, ox: pc(F[0]), oy: pc(Math.min(F[1] + 0.12, 1)), op: `${pc(F[0])} ${pc(F[1])}` },
    },
    looks: [],
    backdrop: { img: 0, pos: `${pc(P[0])} ${pc(P[1])}`, posMobile: `${pc(P[0])} ${pc(P[1])}` },
    closer: { heading: s.colourLine, headingStatus: 'draft', items: [['Colour', s.closer[0]], ['Motif', s.closer[1]], ['Border', s.closer[2]]] },
  };
});

const slugs = new Set(built.map((p) => p.slug));
d.products = d.products.filter((p) => !slugs.has(p.slug));
const names = new Set(d.products.map((p) => p.name.toLowerCase()));
const taken = new Set(d.products.flatMap((p) => [p.slug, ...(p.aliases || []).map((a) => a.slug)]));
for (const p of built) {
  if (names.has(p.name.toLowerCase())) throw new Error(`name already used: ${p.name}`);
  if (taken.has(p.slug)) throw new Error(`slug already used (or an alias): ${p.slug}`);
}
const pos = d.products.findIndex((p) => p.slug === 'gagan');
if (pos < 0) throw new Error('gagan not found');
d.products.splice(pos + 1, 0, ...built);
d._notes.semiSilk = 'The 25 Premium Semi-Silk sarees (Surmai to Laali) come from the AI model photographs in model photography/premium silk ai photography/. Names and copy are proposals. SN matched by eye against the Drive pendrive photos; price, fabric and catalogue description come from the catalogue entry via _tools/dedupe-folded.cjs. Gallery: model photo, then the SN photo, a print close-up and another view from Drive (whole photos, landscape ones turned upright).';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', built.length, 'after gagan at', pos + 1, '— total', d.products.length);
