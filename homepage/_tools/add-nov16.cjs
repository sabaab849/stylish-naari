// Adds the 25 sarees shot on November 16 (model photography/*, the files dated Nov 16) to products.json, after Alta.
// Safe to re-run. Run from homepage/: node _tools/add-nov16.cjs
// Afterwards run node _tools/dedupe-folded.cjs: it removes the folded catalogue PDPs these replace and merges Chaman into
// Moonga and Shabnam into Chameli (the same sarees). Then node _tools/set-borders-nov16.cjs (border photo sources).
// Gallery (galleryListed: true, in this order): the model photograph, then the original product photo (SN primary),
// a print close-up and a border close-up (see ORIG and _tools/originals-nov16.ps1). Model photos: JPEG q88, full size, assets/images/<slug>.jpg.
// Names and copy are proposals that state only what the photograph shows (status "draft"). Fabric and price are
// null (not supplied). Banaras ki Bunkari is set from the visible zari weave only and needs confirming; the
// embroidered sarees have no category.
// Frames (3:4 windows, as shares of the photo) are measured by eye on a 10% grid: t = a little above the head,
// b = just under the hem, cx = the middle of the model and saree. The 963 px-wide (2:3) photos have none: the model
// fills the whole height, so any 3:4 window would cut the head or the hem; they are shown whole.
// Crop points (x, y as shares of the photo): F face, P pallu, B body fabric, D border, M motif, H fall of the skirt.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }

const H = 1445; // every photo is 1445 px tall
const BANARAS = 'Visible style only (zari weave): confirm with the client';
const S = [
  { slug: 'kattha', name: 'Kattha', meaning: 'catechu, the deep brown of paan', file: 'Refined Brown Saree Editorial Portrait 1.png', w: 1086,
    descriptor: 'Brown with gold floral sprays',
    description: 'Kattha is a deep brown with a fine woven texture, finished with a narrow copper border and gold floral sprays along the pallu and hem.',
    colourLine: 'Deep brown, flowering in gold.',
    styling: 'Shown with a matching brown blouse, gold hoop earrings, a fine gold chain and gold block-heel sandals.',
    edits: ['contrast'], banaras: false, colours: [['Brown', '#4A2418'], ['Gold', '#B9A05E']],
    border: 'Narrow copper border', motif: 'Gold floral sprays on the pallu and hem', closer: ['Brown and gold', 'Gold floral sprays', 'Narrow copper'],
    alt: 'Kattha — a deep brown saree with gold floral sprays on the pallu, worn in profile with the pallu swept out behind her',
    fr: { t: 0.01, b: 1, cx: 0.5 }, pts: { F: [0.38, 0.15], P: [0.6, 0.5], B: [0.5, 0.45], D: [0.4, 0.95], M: [0.65, 0.8], H: [0.4, 0.92] } },
  { slug: 'sosan', name: 'Sosan', meaning: 'the iris', file: 'Regal Purple Saree Portrait 1.png', w: 1088,
    descriptor: 'Purple with orange peonies',
    description: 'Sosan is deep purple woven with large orange and lilac peonies on trailing stems, edged with a broad lilac zari border and a fine olive-green selvedge.',
    colourLine: 'Purple, in full bloom.',
    styling: 'Shown with a matching purple brocade blouse, small stud earrings, a low bun and gold juttis.',
    edits: ['jewel', 'festive'], banaras: true, colours: [['Purple', '#4B1F6B'], ['Orange', '#E07A3C'], ['Lilac zari', '#B9A6C9']],
    border: 'Broad lilac zari border with an olive edge', motif: 'Orange and lilac peonies on trailing stems', closer: ['Purple and orange', 'Peonies on trailing stems', 'Lilac zari, olive edge'],
    alt: 'Sosan — a deep purple saree woven with orange peonies, worn seated on a cane-backed chair',
    fr: { t: 0.25, b: 0.99, cx: 0.47 }, pts: { F: [0.62, 0.4], P: [0.55, 0.6], B: [0.4, 0.75], D: [0.55, 0.88], M: [0.55, 0.55], H: [0.4, 0.9] } },
  { slug: 'khus', name: 'Khus', meaning: 'vetiver, the cool green grass', file: 'Sage Silk Saree Portrait 1.png', w: 1085,
    descriptor: 'Sage tissue with rosette medallions',
    description: 'Khus is a sheer sage-green tissue scattered with small gold buta, its pallu set with rosette and diamond medallions in teal, pink and lilac, edged in gold and violet.',
    colourLine: 'Sage, cool as vetiver.',
    styling: 'Shown with a sage silk blouse, small gold earrings and a low bun.',
    edits: ['soft'], banaras: true, colours: [['Sage', '#B5C3A0'], ['Gold', '#C9B27A'], ['Violet', '#5B4C9A']],
    border: 'Gold border with a violet edge', motif: 'Gold buta; rosette and diamond medallions on the pallu', closer: ['Sage and gold', 'Rosette medallions', 'Gold, violet edge'],
    alt: 'Khus — a sheer sage tissue saree with pastel rosette medallions on the pallu, worn standing with hands clasped',
    fr: { t: 0.01, b: 1, cx: 0.5 }, pts: { F: [0.5, 0.12], P: [0.6, 0.5], B: [0.45, 0.55], D: [0.5, 0.92], M: [0.6, 0.48], H: [0.5, 0.9] } },
  { slug: 'haldi', name: 'Haldi', meaning: 'turmeric', file: 'Subtract.png', w: 964,
    descriptor: 'Mustard with a forest of birds and animals',
    description: 'Haldi is mustard woven with small zari birds, its pallu a landscape of trees, parrots, deer, elephants and a lion in silver and colour, above a broad gold zari border edged in rose.',
    colourLine: 'Mustard, alive with a forest.',
    styling: 'Shown with a magenta silk blouse, small stud earrings, a fine gold bracelet and a low bun.',
    edits: ['bright', 'festive'], banaras: true, colours: [['Mustard', '#C2A12A'], ['Zari gold', '#D4B25C'], ['Rose', '#C9727A']],
    border: 'Broad gold zari border with a rose edge', motif: 'Zari birds; trees, parrots, deer, elephants and a lion on the pallu', closer: ['Mustard and zari', 'A forest of animals', 'Broad zari, rose edge'],
    alt: 'Haldi — a mustard saree with a pallu of trees, elephants and a lion, worn in front of a painted forest mural',
    fr: null, pos: '50% 30%', pts: { F: [0.45, 0.08], P: [0.6, 0.7], B: [0.45, 0.4], D: [0.6, 0.88], M: [0.65, 0.68], H: [0.5, 0.9] } },
  { slug: 'rani', name: 'Rani', meaning: 'a queen, and the pink named for her', file: 'Vintage Floral Saree Portrait 1.png', w: 1088,
    descriptor: 'Rani pink with a floral pallu',
    description: 'Rani is rani pink silk with small gold coin buti, a temple-edged gold border and a pallu of red, orange, violet and green flowers on curling vines.',
    colourLine: 'Rani pink, crowned in gold.',
    styling: 'Shown with a matching sleeveless pink blouse, small gold earrings and loose shoulder-length hair.',
    edits: ['jewel', 'festive'], banaras: true, colours: [['Rani pink', '#C8165A'], ['Gold', '#C9A26A']],
    border: 'Gold border with a temple edge', motif: 'Gold coin buti; flowers on curling vines on the pallu', closer: ['Rani pink and gold', 'Flowers on curling vines', 'Gold, temple edge'],
    alt: 'Rani — a rani pink silk saree with a floral pallu, worn standing in front of a dark painted floral wall',
    fr: { t: 0.08, b: 1, cx: 0.52 }, pts: { F: [0.52, 0.17], P: [0.7, 0.58], B: [0.5, 0.5], D: [0.62, 0.75], M: [0.7, 0.62], H: [0.55, 0.92] } },
  { slug: 'sawari', name: 'Sawari', meaning: 'a royal procession', file: 'Elegant Blue Silk Saree Portrait 1.png', w: 1088,
    descriptor: 'Royal blue with elephants and camels',
    description: 'Sawari is royal blue silk woven with elephants and camels in gold and silver among small geometric florets, framed by a broad rose-gold zari border with a temple edge and a magenta selvedge.',
    colourLine: 'Royal blue, on parade.',
    styling: 'Shown with a magenta blouse, gold jhumka earrings and long loose waves.',
    edits: ['jewel', 'contrast', 'festive'], banaras: true, colours: [['Royal blue', '#2A2FA8'], ['Rose gold', '#C99B7E'], ['Magenta', '#C2187A']],
    border: 'Broad rose-gold zari border, temple edge, magenta selvedge', motif: 'Elephants, camels and geometric florets', closer: ['Royal blue and rose gold', 'Elephants and camels', 'Rose-gold zari, magenta edge'],
    alt: 'Sawari — a royal blue saree woven with gold elephants and camels, the pallu held open as she looks down at it',
    fr: { t: 0.09, b: 1, cx: 0.53 }, pts: { F: [0.58, 0.22], P: [0.62, 0.6], B: [0.62, 0.48], D: [0.36, 0.75], M: [0.66, 0.66], H: [0.55, 0.9] } },
  { slug: 'taal', name: 'Taal', meaning: 'a lake', file: 'Elegant Burgundy Saree Portrait 1.png', w: 1153,
    descriptor: 'Wine with a lotus-pond pallu',
    description: 'Taal is wine silk woven with red lotus buds, opening lotuses and lily pads in red, gold and grey, framed by a gold lattice border and a red edge.',
    colourLine: 'Wine, in a lotus pond.',
    styling: 'Shown with a matching sleeveless wine blouse, small stud earrings and a sleek low bun.',
    edits: ['jewel', 'festive'], banaras: true, colours: [['Wine', '#4A1630'], ['Lotus red', '#C2302A'], ['Gold', '#C9A26A']],
    border: 'Gold lattice border with a red edge', motif: 'Lotuses, buds and lily pads', closer: ['Wine and lotus red', 'Lotuses and lily pads', 'Gold lattice, red edge'],
    alt: 'Taal — a wine silk saree woven with red and gold lotuses, worn against a painted backdrop of lotus flowers',
    fr: { t: 0.05, b: 1, cx: 0.53 }, pts: { F: [0.48, 0.15], P: [0.62, 0.62], B: [0.62, 0.4], D: [0.48, 0.62], M: [0.62, 0.56], H: [0.55, 0.9] } },
  { slug: 'shabnam', name: 'Shabnam', meaning: 'dew', file: 'Elegant Floral Saree Portrait 1.png', w: 1156,
    descriptor: 'Ivory with pink floral embroidery',
    description: 'Shabnam is sheer ivory scattered with embroidered pink, rose and white flowers on fine green stems, finished with a scalloped border of white cutwork roses.',
    colourLine: 'Ivory, touched with pink.',
    styling: 'Shown with a rose-pink silk blouse, gold hoop earrings and long loose waves.',
    edits: ['soft'], banaras: false, colours: [['Ivory', '#F1ECE4'], ['Rose pink', '#D88BA0']],
    border: 'Scalloped white cutwork border', motif: 'Embroidered pink and white flowers on fine stems', closer: ['Ivory and rose pink', 'Embroidered flowers', 'Scalloped cutwork'],
    alt: 'Shabnam — a sheer ivory saree embroidered with pink flowers and a scalloped cutwork border, worn with a rose-pink blouse',
    fr: { t: 0, b: 1, cx: 0.5 }, pts: { F: [0.45, 0.12], P: [0.62, 0.45], B: [0.5, 0.55], D: [0.62, 0.88], M: [0.58, 0.38], H: [0.5, 0.88] } },
  { slug: 'mor', name: 'Mor', meaning: 'a peacock', file: 'Elegant Forest-Green Saree Portrait 1.png', w: 1088,
    descriptor: 'Emerald with a peacock-garden pallu',
    description: 'Mor is emerald silk with a fine woven leaf texture and gold leaf buti, edged in mustard, its pallu a garden of peacocks, deer, birds and bright flowers above a checked zari band.',
    colourLine: 'Emerald, where the peacocks walk.',
    styling: 'Shown with a matching emerald blouse, small gold earrings and short curled hair.',
    edits: ['jewel', 'contrast', 'festive'], banaras: true, colours: [['Emerald', '#1F4A2E'], ['Mustard', '#E0A526'], ['Ivory zari', '#E6D9B8']],
    border: 'Mustard edge with an ivory temple border', motif: 'Gold leaf buti; peacocks, deer and flowers on the pallu', closer: ['Emerald and mustard', 'Peacocks and flowers', 'Ivory temple, mustard edge'],
    alt: 'Mor — an emerald silk saree with a pallu of peacocks and flowers and a mustard edge, worn in profile against a terracotta wall',
    fr: { t: 0, b: 1, cx: 0.5 }, pts: { F: [0.47, 0.12], P: [0.72, 0.72], B: [0.55, 0.38], D: [0.75, 0.92], M: [0.72, 0.68], H: [0.45, 0.9] } },
  { slug: 'palash', name: 'Palash', meaning: 'the flame-of-the-forest flower', file: 'Elegant Indian Saree Portrait 1.png', w: 963,
    descriptor: 'Orange with a violet and green border',
    description: 'Palash is sheer orange with small flowering stems, framed by a wide border of ivory zari leaves and a band of violet, green and multicolour diamond squares, edged in gold.',
    colourLine: 'Orange, ablaze.',
    styling: 'Shown with a violet brocade blouse with zari cuffs, gold jhumka earrings, a gold bangle and a low bun.',
    edits: ['bright', 'contrast', 'festive'], banaras: true, colours: [['Orange', '#E0451E'], ['Violet', '#5B2A6B'], ['Green', '#2F7A3C']],
    border: 'Wide zari leaf border with violet and green bands, gold edge', motif: 'Flowering stems; diamond squares in the border', closer: ['Orange, violet and green', 'Diamond squares', 'Zari leaves, gold edge'],
    alt: 'Palash — a sheer orange saree with a wide violet, green and zari border, worn with a violet brocade blouse',
    fr: null, pos: '50% 30%', pts: { F: [0.5, 0.11], P: [0.62, 0.55], B: [0.45, 0.6], D: [0.6, 0.45], M: [0.62, 0.5], H: [0.5, 0.9] } },
  { slug: 'mehfil', name: 'Mehfil', meaning: 'an evening of music and poetry', file: 'Elegant Magenta Saree Portrait 1.png', w: 1132,
    descriptor: 'Magenta with a zari medallion border',
    description: 'Mehfil is magenta silk with a wide gold zari border of medallions and flowering vines, and an embroidered flower in lilac and gold on the drape.',
    colourLine: 'Magenta, ringed in gold.',
    styling: 'Shown with a matching sleeveless magenta blouse, a stack of gold bangles and long loose waves.',
    edits: ['jewel', 'festive'], banaras: true, colours: [['Magenta', '#C2185B'], ['Zari gold', '#D2AE7A']],
    border: 'Wide zari border of medallions and vines', motif: 'Zari medallions; an embroidered lilac flower', closer: ['Magenta and zari', 'Zari medallions', 'Wide zari, flowering vines'],
    alt: 'Mehfil — a magenta silk saree with a wide gold medallion border, worn against a wall painted with roses',
    fr: { t: 0.03, b: 1, cx: 0.5 }, pts: { F: [0.5, 0.17], P: [0.6, 0.55], B: [0.45, 0.6], D: [0.58, 0.7], M: [0.45, 0.48], H: [0.5, 0.9] } },
  { slug: 'mishri', name: 'Mishri', meaning: 'rock sugar', file: 'Elegant Peacock Motif Silk Saree 1.png', w: 963,
    descriptor: 'Peach tissue with a violet bird pallu',
    description: 'Mishri is a shimmering peach tissue with gold and silver buta, a violet zari lattice border and a violet pallu of flowering branches and parrots in red, green, blue and white.',
    colourLine: 'Peach, sugared with gold.',
    styling: 'Shown with a violet brocade blouse, small stud earrings and a low bun.',
    edits: ['soft', 'contrast', 'festive'], banaras: true, colours: [['Peach', '#D9A07E'], ['Violet', '#6A1E8C']],
    border: 'Violet zari lattice border', motif: 'Gold and silver buta; parrots on flowering branches on the pallu', closer: ['Peach and violet', 'Parrots on branches', 'Violet zari lattice'],
    alt: 'Mishri — a peach tissue saree with a violet pallu of parrots and flowering branches, worn standing in a pale studio',
    fr: null, pos: '50% 30%', pts: { F: [0.5, 0.12], P: [0.72, 0.55], B: [0.45, 0.55], D: [0.58, 0.8], M: [0.62, 0.52], H: [0.5, 0.9] } },
  { slug: 'ambi', name: 'Ambi', meaning: 'the paisley, a little mango', file: 'Elegant Purple and Gold Saree Portrait 1.png', w: 1156,
    descriptor: 'Orchid with gold paisleys',
    description: 'Ambi is orchid-purple silk scattered with gold floral buta, finished with a broad zari lattice border and a pallu of large paisleys in gold.',
    colourLine: 'Orchid, sprigged in gold.',
    styling: 'Shown with a plum blouse with zari cuffs, gold jhumka earrings, gold bangles and a low bun.',
    edits: ['jewel', 'festive'], banaras: true, colours: [['Orchid', '#A8418F'], ['Zari gold', '#C9A26A']],
    border: 'Broad zari lattice border', motif: 'Gold buta; large paisleys on the pallu', closer: ['Orchid and zari', 'Gold paisleys', 'Broad zari lattice'],
    alt: 'Ambi — an orchid-purple silk saree with gold buta and a paisley pallu, worn with a plum blouse',
    fr: { t: 0.02, b: 1, cx: 0.5 }, pts: { F: [0.45, 0.12], P: [0.62, 0.6], B: [0.4, 0.55], D: [0.5, 0.8], M: [0.7, 0.72], H: [0.5, 0.92] } },
  { slug: 'bahaar', name: 'Bahaar', meaning: 'spring', file: 'Elegant Purple Sari Studio Portrait 1.png', w: 1085,
    descriptor: 'Purple with a floral jaal',
    description: 'Bahaar is deep purple woven all over with a jaal of small flowers in pink, red, orange and gold, framed by a gold floral border edged in purple.',
    colourLine: 'Purple, in full spring.',
    styling: 'Shown with a matching purple blouse with zari cuffs, pink drop earrings, gold bangles and a low bun.',
    edits: ['jewel', 'festive'], banaras: true, colours: [['Purple', '#3E1F6E'], ['Pink', '#D63E8A'], ['Gold', '#C9A26A']],
    border: 'Gold floral border with a purple edge', motif: 'All-over jaal of small multicolour flowers', closer: ['Purple and pink', 'Floral jaal', 'Gold floral, purple edge'],
    alt: 'Bahaar — a deep purple saree woven all over with small pink, red and orange flowers, worn standing against a warm plaster wall',
    fr: { t: 0, b: 1, cx: 0.5 }, pts: { F: [0.48, 0.08], P: [0.63, 0.55], B: [0.45, 0.6], D: [0.58, 0.5], M: [0.45, 0.55], H: [0.5, 0.92] } },
  { slug: 'shagun', name: 'Shagun', meaning: 'an auspicious gift', file: 'Elegant Purple-Bordered Silk Saree Portrait 1.png', w: 963,
    descriptor: 'Rose-pink tissue with a magenta floral pallu',
    description: 'Shagun is rose-pink tissue with a soft gold shimmer and small gold and silver buta, a zari border of wavy lines and a magenta pallu of flowering vines in red, blue, gold and green.',
    colourLine: 'Rose pink, gilded.',
    styling: 'Shown with a magenta blouse and long loose waves.',
    edits: ['soft', 'contrast', 'festive'], banaras: true, colours: [['Rose pink', '#D98A86'], ['Magenta', '#A0208A']],
    border: 'Zari border of wavy lines, magenta edge', motif: 'Gold and silver buta; flowering vines on the pallu', closer: ['Rose pink and magenta', 'Flowering vines', 'Wavy zari, magenta edge'],
    alt: 'Shagun — a rose-pink tissue saree with a magenta floral pallu, worn in three-quarter profile with long loose hair',
    fr: null, pos: '50% 30%', pts: { F: [0.45, 0.12], P: [0.72, 0.6], B: [0.45, 0.55], D: [0.58, 0.6], M: [0.78, 0.58], H: [0.45, 0.9] } },
  { slug: 'mangal', name: 'Mangal', meaning: 'auspicious', file: 'Elegant Red Saree Portrait 1.png', w: 1156,
    descriptor: 'Red with gold floral buti',
    description: 'Mangal is red silk woven all over with gold floral buti, with a broad gold zari border and a pallu of zari bands.',
    colourLine: 'Red, for every celebration.',
    styling: 'Shown with a matching red brocade blouse, gold jhumka earrings, a gold bangle and a low bun.',
    edits: ['festive', 'bright'], banaras: true, colours: [['Red', '#B0182A'], ['Zari gold', '#D4AF6A']],
    border: 'Broad gold zari border', motif: 'All-over gold floral buti; zari bands on the pallu', closer: ['Red and zari gold', 'Gold floral buti', 'Broad zari'],
    alt: 'Mangal — a red silk saree with gold floral buti, the pallu swirled out beside a swing hung with jasmine',
    fr: { t: 0.1, b: 1, cx: 0.4 }, pts: { F: [0.55, 0.22], P: [0.2, 0.6], B: [0.55, 0.6], D: [0.1, 0.7], M: [0.55, 0.55], H: [0.55, 0.92] } },
  { slug: 'aasmaan', name: 'Aasmaan', meaning: 'the sky', file: 'Elegant Saree in a Painted Landscape 1.png', w: 1088,
    descriptor: 'Powder blue with an embroidered flower border',
    description: 'Aasmaan is powder blue woven with fine silver stripes, its border and pallu embroidered with a garden of pink, yellow, red and blue flowers on green vines.',
    colourLine: 'Powder blue, as an open sky.',
    styling: 'Shown with a matching powder-blue blouse, silver drop earrings, a small bindi and loose waves.',
    edits: ['soft'], banaras: false, colours: [['Powder blue', '#9DB1C9'], ['Silver', '#C9CDD3']],
    border: 'Embroidered border of multicolour flowers', motif: 'Fine silver stripes; embroidered flowers on vines', closer: ['Powder blue and silver', 'Embroidered flowers', 'Flowering vines'],
    alt: 'Aasmaan — a powder-blue striped saree with an embroidered flower border, the pallu swept up in an arc before a painted landscape',
    fr: { t: 0.15, b: 1, cx: 0.42 }, pts: { F: [0.58, 0.3], P: [0.3, 0.5], B: [0.45, 0.5], D: [0.2, 0.62], M: [0.25, 0.65], H: [0.55, 0.9] } },
  { slug: 'airavat', name: 'Airavat', meaning: 'the white elephant of the heavens', file: 'Elegant Saree Portrait with Elephant Motifs 1.png', w: 963,
    descriptor: 'Ivory with elephant buta',
    description: 'Airavat is ivory with a soft sheen, scattered with small woven rosettes in peach and silver, its pallu walked by elephants in peach and grey, finished with a fine silver border.',
    colourLine: 'Ivory, with elephants on the pallu.',
    styling: 'Shown with a dusty-rose silk blouse, gold hoop earrings and long loose waves.',
    edits: ['soft'], banaras: true, colours: [['Ivory', '#F0EBE1'], ['Peach', '#E2A98A'], ['Silver', '#BFC0C2']],
    border: 'Fine silver border', motif: 'Peach and silver rosettes; elephants on the pallu', closer: ['Ivory and peach', 'Elephants and rosettes', 'Fine silver'],
    alt: 'Airavat — an ivory saree with peach and grey elephants on the pallu, worn with a dusty-rose blouse, the pallu held out',
    fr: null, pos: '50% 30%', pts: { F: [0.45, 0.12], P: [0.65, 0.55], B: [0.45, 0.55], D: [0.6, 0.88], M: [0.7, 0.6], H: [0.5, 0.9] } },
  { slug: 'shringaar', name: 'Shringaar', meaning: 'adornment', file: 'Elegant Saree Portrait with Floral Draping 1.png', w: 1156,
    descriptor: 'Ivory with a red embroidered pallu',
    description: 'Shringaar is crinkled ivory with small gold buta and a red edge, and a red pallu embroidered with large flowers and leaves in orange, pink, teal and green above a band of gold checks.',
    colourLine: 'Ivory, finished in red.',
    styling: 'Shown with a red blouse, a fine gold chain, small gold earrings, red flowers in a low bun and gold block-heel sandals.',
    edits: ['contrast', 'festive'], banaras: false, colours: [['Ivory', '#F1EBDD'], ['Red', '#B3142C']],
    border: 'Red edge; a band of gold checks on the pallu', motif: 'Gold buta; embroidered flowers and leaves on the red pallu', closer: ['Ivory and red', 'Embroidered flowers', 'Red, gold checks'],
    alt: 'Shringaar — an ivory saree with a red pallu embroidered with large flowers, worn in profile with the pallu swept out behind her',
    fr: { t: 0, b: 1, cx: 0.5 }, pts: { F: [0.38, 0.1], P: [0.75, 0.6], B: [0.4, 0.4], D: [0.75, 0.82], M: [0.72, 0.6], H: [0.42, 0.92] } },
  { slug: 'firoza', name: 'Firoza', meaning: 'turquoise', file: 'Elegant Teal Silk Sari Portrait 1.png', w: 1134,
    descriptor: 'Teal tissue with a gold zari pallu',
    description: 'Firoza is teal tissue with a soft shimmer and gold leaf buta, a gold border of flowering scrolls and a pallu of gold ogee lattice.',
    colourLine: 'Teal, lit with gold.',
    styling: 'Shown with a matching sleeveless teal blouse, small stud earrings and a low bun.',
    edits: ['jewel', 'festive'], banaras: true, colours: [['Teal', '#1F5E5A'], ['Zari gold', '#D1C08E']],
    border: 'Gold border of flowering scrolls', motif: 'Gold leaf buta; ogee lattice on the pallu', closer: ['Teal and zari gold', 'Gold leaf buta', 'Flowering scrolls'],
    alt: 'Firoza — a teal tissue saree with gold leaf buta and a gold lattice pallu, worn standing with hands clasped',
    fr: { t: 0.02, b: 1, cx: 0.75 }, pts: { F: [0.78, 0.1], P: [0.85, 0.55], B: [0.72, 0.55], D: [0.78, 0.45], M: [0.72, 0.6], H: [0.75, 0.92] } },
  { slug: 'gulistan', name: 'Gulistan', meaning: 'a rose garden', file: 'Floral Embroidered Saree Portrait 1.png', w: 963,
    descriptor: 'Ivory with embroidered roses',
    description: 'Gulistan is ivory with a fine slub texture, embroidered all over with trailing rose sprays in pink, wine and sage, gathered into a dense floral border along the pallu.',
    colourLine: 'Ivory, in a rose garden.',
    styling: 'Shown with a matching embroidered blouse, a fine gold choker, small hoop earrings and long loose waves.',
    edits: ['soft'], banaras: false, colours: [['Ivory', '#EFE8DC'], ['Wine', '#8E2346'], ['Rose', '#E08A9A']],
    border: 'Dense embroidered rose border on the pallu', motif: 'Trailing rose sprays in pink, wine and sage', closer: ['Ivory, wine and rose', 'Trailing rose sprays', 'Embroidered roses'],
    alt: 'Gulistan — an ivory saree embroidered all over with pink and wine roses, worn standing facing the camera',
    fr: null, pos: '50% 30%', pts: { F: [0.5, 0.12], P: [0.65, 0.6], B: [0.4, 0.55], D: [0.62, 0.75], M: [0.65, 0.55], H: [0.45, 0.9] } },
  { slug: 'basant', name: 'Basant', meaning: 'the spring festival of yellow', file: 'Golden Brocade Saree Portrait 1.png', w: 963,
    descriptor: 'Mustard brocade with colour squares',
    description: 'Basant is mustard woven all over with gold zari flowers over soft blocks of pink, orange, green and teal, with a dense zari border and a fringed pallu.',
    colourLine: 'Mustard, the colour of spring.',
    styling: 'Shown with a bottle-green blouse, gold jhumka earrings, a gold bangle and a low bun.',
    edits: ['bright', 'festive'], banaras: true, colours: [['Mustard', '#D9A520'], ['Pink', '#D9457A'], ['Teal', '#2E8C7A']],
    border: 'Dense zari border; fringed pallu', motif: 'Zari flowers over blocks of pink, orange, green and teal', closer: ['Mustard and colour', 'Zari flowers, colour blocks', 'Dense zari'],
    alt: 'Basant — a mustard brocade saree with blocks of pink, orange and teal under gold zari flowers, worn with a bottle-green blouse',
    fr: null, pos: '50% 30%', pts: { F: [0.45, 0.1], P: [0.62, 0.55], B: [0.45, 0.6], D: [0.58, 0.55], M: [0.55, 0.35], H: [0.45, 0.9] } },
  { slug: 'chaman', name: 'Chaman', meaning: 'a garden', file: 'Graceful Silk Saree Portrait with Birds and Blooms 1.png', w: 1088,
    descriptor: 'Coral tissue with a tree of birds',
    description: 'Chaman is coral tissue with a gold shimmer and a wide gold zari border, its pallu a flowering tree full of parrots and songbirds in red, blue, green and ivory.',
    colourLine: 'Coral, full of birdsong.',
    styling: 'Shown with a matching coral tissue blouse and a sleek low bun.',
    edits: ['bright', 'festive'], banaras: true, colours: [['Coral', '#D9584A'], ['Zari gold', '#D7A86E']],
    border: 'Wide gold zari border', motif: 'A flowering tree of parrots and songbirds on the pallu', closer: ['Coral and zari gold', 'Parrots and songbirds', 'Wide zari'],
    alt: 'Chaman — a coral tissue saree with a pallu of birds in a flowering tree, worn against a blue painted backdrop',
    fr: { t: 0.06, b: 1, cx: 0.5 }, pts: { F: [0.5, 0.15], P: [0.45, 0.55], B: [0.58, 0.45], D: [0.62, 0.7], M: [0.45, 0.6], H: [0.55, 0.92] } },
  { slug: 'moti', name: 'Moti', meaning: 'a pearl', file: 'Ivory Embroidered Saree Portrait 1.png', w: 1107,
    descriptor: 'Ivory net with white floral embroidery',
    description: 'Moti is ivory net over fine stripes, embroidered all over with white flowers and leaves, finished with a scalloped embroidered border.',
    colourLine: 'Ivory, like a string of pearls.',
    styling: 'Shown with a matching embroidered blouse, a pearl choker, pearl drop earrings, a pearl bracelet and a white flower in her hair.',
    edits: ['soft', 'festive'], banaras: false, colours: [['Ivory', '#EDE5D8'], ['Champagne', '#D8CBB5']],
    border: 'Scalloped embroidered border', motif: 'White embroidered flowers and leaves over fine stripes', closer: ['Ivory and champagne', 'White embroidered flowers', 'Scalloped'],
    alt: 'Moti — an ivory net saree embroidered with white flowers and a scalloped border, worn seated with pearl jewellery',
    fr: { t: 0, b: 1, cx: 0.5 }, pts: { F: [0.5, 0.12], P: [0.7, 0.55], B: [0.45, 0.55], D: [0.45, 0.92], M: [0.55, 0.55], H: [0.45, 0.9] } },
  { slug: 'megh', name: 'Megh', meaning: 'a rain cloud', file: 'Lavender Saree Editorial Portrait 1.png', w: 963,
    descriptor: 'Lavender tissue with a floral pallu',
    description: 'Megh is lavender-blue tissue with a gold shimmer and gold buta, a zari border edged in red and pink, and a pallu of flowers and leaves in green, pink, yellow and white.',
    colourLine: 'Lavender, like a gathering cloud.',
    styling: 'Shown with a plum blouse and a low bun.',
    edits: ['soft', 'festive'], banaras: true, colours: [['Lavender', '#7F86C4'], ['Red', '#B5203A'], ['Zari gold', '#C9A26A']],
    border: 'Zari border edged in red and pink', motif: 'Gold buta; flowers and leaves on the pallu', closer: ['Lavender and red', 'Flowers and leaves', 'Zari, red edge'],
    alt: 'Megh — a lavender tissue saree with a pallu of green, pink and yellow flowers, worn with a plum blouse',
    fr: null, pos: '50% 30%', pts: { F: [0.45, 0.08], P: [0.72, 0.55], B: [0.4, 0.55], D: [0.55, 0.8], M: [0.72, 0.62], H: [0.45, 0.9] } },
];

const pc = (v) => `${Math.round(v * 100)}%`;
const r4 = (v) => +v.toFixed(4);
function frameOf({ t, b, cx }, w) {
  let h = b - t, fw = (h * H * 0.75) / w;
  if (fw > 1) { fw = 1; h = (w / 0.75) / H; }
  const x = Math.min(Math.max(cx - fw / 2, 0), 1 - fw), y = Math.min(t, 1 - h);
  const fr = { x: r4(x), y: r4(y), w: r4(fw), h: r4(h) };
  const ratio = (fr.w * w) / (fr.h * H);
  if (Math.abs(ratio - 0.75) > 0.005 || fr.x + fr.w > 1.0001 || fr.y + fr.h > 1.0001) throw new Error(`frame not 3:4 inside the photo (${w})`);
  return fr;
}
// Gallery slides 2–4: the original product photos from Drive "Original Product Photos - Pendrive", made by
// _tools/originals-nov16.ps1 (which lists the exact Drive files). sn = the saree's SN number; bg = the primary photo's
// own backdrop colour, so the letterbox around it is invisible; drive = file numbers used for print and border.
const ORIG = {
  kattha: ['014', '#24252A', '03', '02'], sosan: ['001', '#131418', '04', '05'], khus: ['036', '#141416', '03', '05'],
  haldi: ['035', '#131315', '03', '05'], rani: ['007', '#0F0E13', '03', '05'], sawari: ['003', '#101010', '04', '05'],
  taal: ['021', '#101012', '03', '05'], shabnam: ['032', '#0A0A0C', '03', '05'], mor: ['008', '#0F0F11', '03', '05'],
  palash: ['027', '#141416', '02', '03'], mehfil: ['045', '#19181D', '03', '02'], mishri: ['020', '#111113', '03', '05'],
  ambi: ['012', '#030408', '04', '05'], bahaar: ['026', '#16151A', '04', '05'], shagun: ['038', '#141318', '03', '05'],
  mangal: ['011', '#090A0E', '04', '05'], aasmaan: ['004', '#707C87', '02', '03'], airavat: ['033', '#0D0E10', '03', '05'],
  shringaar: ['028', '#17161B', '03', '05'], firoza: ['048', '#0F0D10', '04', '03'], gulistan: ['025', '#06070B', '03', '05'],
  basant: ['019', '#0E0E10', '04', '05'], chaman: ['006', '#111113', '03', '05'], moti: ['010', '#05060A', '02', '03'],
  megh: ['022', '#BFB5AC', null, null],
};
const imgSize = (file) => { // JPEG dimensions from the SOF marker
  const b = fs.readFileSync(file); let i = 2;
  while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; }
  throw new Error('no size: ' + file);
};
function originals(s) {
  const [sn, bg, pn, bn] = ORIG[s.slug];
  const one = (kind) => { const [width, height] = imgSize(`assets/images/${s.slug}-${kind}.jpg`); return { src: `/assets/images/${s.slug}-${kind}.jpg`, width, height }; };
  const src = (n) => (pn ? `Drive: Original Product Photos - Pendrive / SN-${sn} – ${n}` : `images/images/extra_photo_030.jpg (WhatsApp; SN-022 has no Drive folder)`);
  const what = s.descriptor.charAt(0).toLowerCase() + s.descriptor.slice(1);
  return [
    { ...one('original'), role: 'product', fit: 'contain', bg, alt: `${s.name}, folded: the saree itself, ${what}`, source: pn ? src('01 (primary)') : 'catalogue/sn-022.jpg', sn: `SN-${sn}` },
    { ...one('print'), role: 'product', fit: 'cover', alt: `${s.name} up close: ${s.motif.charAt(0).toLowerCase() + s.motif.slice(1)}`, source: src(pn), sn: `SN-${sn}` },
    ...(pn ? [{ ...one('border'), role: 'product', fit: 'contain', bg: '#F6F1EA', alt: `${s.name} up close: ${s.border.charAt(0).toLowerCase() + s.border.slice(1)}`, source: src(bn), sn: `SN-${sn}` }] : []), // whole Drive shot, uncut; Megh has none
  ];
}
const at = (pt, s, extra = {}) => ({ img: 0, s, ox: pc(pt[0]), oy: pc(pt[1]), ...extra });

const built = S.map((s) => {
  const { F, P, B, D, M, H: fall } = s.pts;
  return {
    slug: s.slug, name: s.name, nameMeaning: s.meaning,
    descriptor: s.descriptor,
    description: s.description, descriptionStatus: 'draft',
    colourLine: s.colourLine, colourLineStatus: 'draft',
    styling: s.styling, stylingStatus: 'draft',
    price: null, priceIsPlaceholder: false, isNew: true,
    edits: s.edits,
    categories: s.banaras ? ['banarasi'] : [],
    ...(s.banaras ? { categoryEvidence: { 'banarasi': BANARAS } } : {}),
    colours: s.colours.map(([name, h]) => ({ name, ...tone(h) })),
    attributes: { fabric: null, colourway: s.colours[0][0], border: s.border, motif: s.motif, length: null, blousePiece: null, weave: null, origin: null, availability: null },
    galleryListed: true,
    images: [{
      src: `/assets/images/${s.slug}.jpg`, width: s.w, height: H,
      ...(s.pos ? { pos: s.pos } : s.fr ? { pos: `${pc(s.fr.cx)} 50%` } : {}),
      alt: s.alt, source: s.file,
      ...(s.fr ? { frame: frameOf(s.fr, s.w) } : {}),
    }, ...originals(s)],
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
for (const p of built) if (names.has(p.name.toLowerCase())) throw new Error(`name already used: ${p.name}`);
const pos = d.products.findIndex((p) => p.slug === 'alta');
d.products.splice(pos + 1, 0, ...built);
d._notes.nov16 = 'The 25 sarees from the November 16 shoot (Kattha to Megh) come from one photograph each in model photography/. Names and copy are proposals; fabric and price have not been supplied; Banaras ki Bunkari is from the visible weave and needs confirming. Gallery: model photo, then the original SN primary, print and border photos from Drive (Original Product Photos - Pendrive), in that order (galleryListed). SN numbers are on each image (sn).';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', built.length, 'after alta at', pos + 1, '— total', d.products.length);
