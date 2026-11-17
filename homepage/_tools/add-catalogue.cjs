// Adds the 91 sarees from "Stylish Nari Saree Catalog.xlsx" to products.json. Safe to re-run: it replaces
// only the products it added before (source: "catalogue"), never the 19 editorial sarees.
//
// Run from homepage/:  node _tools/add-catalogue.cjs
//
// Where each value comes from
//   catalogue  description, price, range (Premium / Semi-premium), fabric: _tools/catalogue/catalogue-source.json,
//              extracted from the spreadsheet. Descriptions are the seller's words with spelling fixed (FIXES
//              below); the untouched text is kept in descriptionSource.
//   photo      colours and how many sarees a photo shows, read by eye from the photograph (ROWS below). Hex
//              values are a shared swatch per colour name (PALETTE), nudged for text contrast like the others.
//   name       built from catalogue words plus the photographed colour. The catalogue has no names, so these
//              are working titles (nameStatus: "catalogue"), not the Hindi naming convention of the editorial
//              sarees. Rename before launch if wanted.
//   images     assets/images/catalogue/sn-NNN.jpg, one per catalogue row (NNN = row number); see
//              catalogue-source.json rows[].output for how each was made.
//   category   "banarasi" only where the row's own description says Banarasi.
// Anything the catalogue doesn't say (SKU, border, length, blouse piece, care, crops) stays null and is hidden.
const fs = require('fs');
const path = require('path');
const F = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(F, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalogue/catalogue-source.json'), 'utf8'));

// ─── colour swatches (by eye) and the contrast nudge used for the editorial sarees ───
const PALETTE = {
  Purple: '#5B2A86', 'Royal blue': '#2740A8', Blue: '#1F5E9E', 'Sky blue': '#8EC5E6', Indigo: '#2A3270', Navy: '#1F2547',
  Teal: '#226656', Emerald: '#12382D', Green: '#4E8A2E', Olive: '#8E8960', Sage: '#A3AE8A',
  Yellow: '#E2B22A', Mustard: '#C99A1E', Gold: '#D9BC72', Orange: '#E8792A', Peach: '#E9A584', Coral: '#D5603B',
  Red: '#B3202A', Rust: '#9C3B2A', Maroon: '#6E2530', Wine: '#4A0E1C', Plum: '#4B2040', Magenta: '#A3176F',
  'Rani pink': '#B8336A', Pink: '#E59AB0', Mauve: '#B07C8A', Lavender: '#B48CC6',
  Ivory: '#E3CDB4', White: '#EFEDE8', Grey: '#8F8C88', Brown: '#5A3A28', Black: '#1C1616',
};
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).substr(i, 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const con = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
function tone(h) { let c = hex(h); for (let i = 0; i < 14; i++) { const a = con(c, INK), b = con(c, IVORY); if (Math.max(a, b) >= 4.5) return { hex: toHex(c), text: b >= a ? '#F6F1EA' : '#1F1A16' }; c = b >= a ? mix(c, [0, 0, 0], 0.06) : mix(c, [255, 255, 255], 0.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name) => { if (!PALETTE[name]) throw new Error('No swatch for ' + name); return { name, ...tone(PALETTE[name]) }; };

// ─── spelling fixes applied to the seller's descriptions ───
const FIXES = [
  [/scallope broder/gi, 'scalloped border'], [/\bbroder\b/gi, 'border'], [/moticolor/gi, 'multicolour'], [/multicolor/gi, 'multicolour'],
  [/contraat/gi, 'contrast'], [/desginer/gi, 'designer'], [/meenakri/gi, 'meenakari'], [/\bVicose\b/g, 'Viscose'],
  [/jungla patter\b/gi, 'jungla pattern'], [/handembroidery/gi, 'hand embroidery'], [/\bpaur cutwork/gi, 'pauri cutwork'],
  [/\bbanarasi\b/g, 'Banarasi'], [/\bpaithani\b/g, 'Paithani'], [/\s+,/g, ','], [/\s{2,}/g, ' '],
];
const clean = (t) => {
  let s = t.replace(/\s*\n+\s*/g, '. ').replace(/\.\s*\./g, '.').trim();
  for (const [a, b] of FIXES) s = s.replace(a, b);
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return /[.!?]$/.test(s) ? s : s + '.';
};

// ─── per row: [row, name, fabric (from the description), colours seen in the photo, sarees in the photo, note] ───
// "n" > 1 means the photograph shows several sarees (often the same design in different colours); which one
// is being sold isn't stated, so those rows list every colour seen and are flagged for review.
const ROWS = [
  [1, 'Purple kora meenakari jamdani', 'Kora silk', ['Purple', 'Olive'], 1],
  [2, 'Katan alfi lion motif saree', 'Katan silk', ['Purple', 'Black', 'Rani pink'], 3],
  [3, 'Royal blue katan animal patola', 'Katan silk', ['Royal blue', 'Pink'], 1],
  [4, 'Grey kora zari stripe embroidery', 'Kora silk', ['Grey'], 1],
  [5, 'Pink kora scalloped embroidery', 'Kora silk', ['Pink'], 1],
  [6, 'Coral katan tanchoi shikargah paithani', 'Katan silk', ['Coral', 'Orange'], 1],
  [7, 'Rani pink katan paithani', 'Katan silk', ['Rani pink'], 1],
  [8, 'Emerald kora peacock paithani', 'Kora silk', ['Emerald', 'Mustard'], 1],
  [9, 'Blue kora meenakari kadhwa', 'Kora silk', ['Blue', 'Emerald'], 1],
  [10, 'Ivory kora scalloped embroidery', 'Kora silk', ['Ivory'], 1],
  [11, 'Red katan zari booti', 'Katan silk', ['Red'], 1],
  [12, 'Lavender katan zari booti skirt border', 'Katan silk', ['Lavender'], 1],
  [13, 'Katan zari shikargah saree', 'Katan silk', ['Rani pink', 'Purple'], 2],
  [14, 'Brown kora alfi booti', 'Kora silk', ['Brown'], 1],
  [15, 'Purple kora alfi booti', 'Kora silk', ['Purple'], 1],
  [16, 'Mauve katan zari booti', 'Katan silk', ['Mauve'], 1],
  [17, 'Maroon katan zari jungla', 'Katan silk', ['Maroon'], 1],
  [18, 'Olive kora tilfi meenakari jamdani', 'Kora silk', ['Olive', 'Purple'], 1],
  [19, 'Yellow katan cutwork rangkat', 'Katan silk', ['Yellow'], 1],
  [20, 'Peach tissue peacock and parrot border', 'Tissue', ['Peach', 'Purple'], 1],
  [21, 'Wine kora Pichwai saree', 'Kora silk', ['Wine'], 1, 'The catalogue describes "pink" kora with mother-and-baby cow motifs; the photo shows a deep wine saree with lotus florals and no cows visible. Check the photo and description belong together.'],
  [22, 'Lavender tissue chauthera kadhwa', 'Tissue', ['Lavender'], 1],
  [23, 'Katan meenakari jaal saree', 'Katan silk', ['Blue', 'Emerald'], 2],
  [24, 'Pink katan tanchoi skirt border', 'Katan silk', ['Pink'], 1],
  [25, 'Ivory kora meenakari jungla embroidery', 'Kora silk', ['Ivory'], 1, 'Same description and price as row 32, and a very similar ivory saree: confirm these are two different sarees.'],
  [26, 'Purple katan pauri rangkat', 'Katan silk', ['Purple'], 1],
  [27, 'Orange kora kadhwa rangkat border', 'Kora silk', ['Orange'], 1],
  [28, 'Ivory kora pachmeena skirt border', 'Kora silk', ['Ivory', 'Red'], 1],
  [29, 'Katan tanchoi skirt border saree', 'Katan silk', ['Mustard', 'Rani pink', 'Lavender'], 3],
  [30, 'Lavender katan tanchoi skirt border', 'Katan silk', ['Lavender'], 1],
  [31, 'Purple katan bird paithani', 'Katan silk', ['Purple'], 1],
  [32, 'Ivory kora meenakari jungla embroidery', 'Kora silk', ['Ivory'], 1, 'Same description and price as row 25, and a very similar ivory saree: confirm these are two different sarees.'],
  [33, 'White katan dyeable kadhwa', 'Katan silk', ['White'], 1],
  [34, 'Olive cotton ektara jamdani', 'Cotton', ['Olive', 'Pink'], 1, 'Listed as Premium (Silk Mark certified), but described as cotton: Silk Mark applies to silk only.'],
  [35, 'Mustard katan animal paithani', 'Katan silk', ['Mustard'], 1],
  [36, 'Sage tissue chauthera border', 'Tissue', ['Sage', 'Purple'], 1],
  [37, 'Peach tissue kadhwa contrast border', 'Tissue', ['Peach', 'Red'], 1],
  [38, 'Mauve tissue tilfi meenakari', 'Tissue', ['Mauve', 'Purple'], 1],
  [39, 'Blue katan village paithani', 'Katan silk', ['Blue'], 1],
  [40, 'Lavender ektara katan digital print', 'Katan silk', ['Lavender'], 1],
  [41, 'Peach katan floral digital print', 'Katan silk', ['Peach'], 1],
  [42, 'Lavender chiniya silk', 'Chiniya silk', ['Lavender'], 1],
  [43, 'Sky blue chiniya silk', 'Chiniya silk', ['Sky blue'], 1],
  [44, 'Kora kadhua weave saree', 'Kora silk', ['Purple', 'Mustard'], 2],
  [45, 'Rani pink kora kadhua weave', 'Kora silk', ['Rani pink'], 1],
  [46, 'Pink kora kadhua weave', 'Kora silk', ['Pink'], 1],
  [47, 'Pink tissue kadhua weave', 'Tissue', ['Pink'], 1],
  [48, 'Teal tissue kadhua weave', 'Tissue', ['Teal', 'Ivory'], 1],
  [49, 'Ivory kora kadhua weave', 'Kora silk', ['Ivory', 'Sky blue'], 1],
  [50, 'Red semi georgette jaal Banarasi', 'Semi georgette', ['Red'], 1],
  [51, 'Red semi katan alfi border', 'Semi katan silk', ['Red', 'Navy'], 1, 'Cropped close-up: the navy band may be the border or a second saree underneath.'],
  [52, 'Wine semi katan bird paithani', 'Semi katan silk', ['Wine'], 1],
  [53, 'Peach art silk kora jamdani', 'Art silk', ['Peach', 'Maroon'], 1],
  [54, 'Emerald semi mashru Banarasi', 'Semi mashru silk', ['Emerald'], 1],
  [55, 'Red art silk Banarasi', 'Art silk', ['Red'], 1],
  [56, 'Grey semi katan Banarasi', 'Semi katan silk', ['Grey'], 1],
  [57, 'Grey art kora silk Banarasi', 'Art silk', ['Grey', 'Gold'], 1],
  [58, 'Plum semi silk tanchoi meenakari', 'Semi silk', ['Plum'], 1],
  [59, 'Indigo semi silk tanchoi meenakari', 'Semi silk', ['Indigo'], 1],
  [60, 'Pink semi silk tanchoi meenakari', 'Semi silk', ['Pink'], 1],
  [61, 'Rani pink art silk kanchi border', 'Art silk', ['Rani pink', 'Mauve'], 1],
  [62, 'Green art silk kanchi border', 'Art silk', ['Green'], 1],
  [63, 'Sky blue semi mashru Banarasi', 'Semi mashru silk', ['Sky blue'], 1],
  [64, 'Coral semi silk double-shade border', 'Semi silk', ['Coral', 'Olive'], 1],
  [65, 'Indigo semi silk sona rupa jamdani', 'Semi silk', ['Indigo'], 1],
  [66, 'Emerald semi silk sona rupa jamdani', 'Semi silk', ['Emerald'], 1],
  [67, 'Magenta semi silk double-shade border', 'Semi silk', ['Magenta'], 1],
  [68, 'Royal blue semi silk double-shade border', 'Semi silk', ['Royal blue'], 1],
  [69, 'Rust semi silk double-shade border', 'Semi silk', ['Rust', 'Olive'], 1],
  [70, 'Red and black semi georgette Banarasi', 'Semi georgette', ['Red', 'Black'], 1],
  [71, 'Viscose chiniya semi Banarasi', 'Viscose chiniya silk', ['Pink', 'Olive', 'Orange', 'Purple'], 4],
  [72, 'Semi Banarasi mango silk', 'Mango silk', ['Lavender', 'Orange', 'Purple', 'Green'], 4, 'Catalogue says "green mango silk": unclear whether green is the colour or part of the fabric name, and the photo shows several colours.'],
  [73, 'Semi Banarasi katan silk', 'Semi katan silk', ['Mauve', 'Red', 'Royal blue', 'Black'], 5],
  [74, 'Black malmal cotton Banarasi', 'Malmal cotton', ['Black', 'Ivory'], 1],
  [75, 'Semi katan tilfi boota saree', 'Semi katan silk', ['Black', 'Mustard', 'Rani pink'], 3],
  [76, 'Magenta semi kora appliqué', 'Semi kora silk', ['Magenta', 'Pink'], 1],
  [77, 'Pink semi crepe silk', 'Semi crepe silk', ['Pink', 'Red'], 1],
  [78, 'Orange semi katan tilfi boota', 'Semi katan silk', ['Orange'], 1],
  [79, 'Ivory semi rangkat mashru', 'Semi mashru silk', ['Ivory'], 1, 'Catalogue says "mushroo"; read as mashru. Confirm.'],
  [80, 'Magenta kora hand-embroidered boota', 'Kora silk', ['Magenta', 'Pink'], 1],
  [81, 'Royal blue semi katan Banarasi', 'Semi katan silk', ['Royal blue'], 1],
  [82, 'Semi silk hand-embroidered boota saree', 'Semi silk', ['Grey', 'Emerald'], 2],
  [83, 'Semi Banarasi pashmina', 'Semi pashmina', ['Red', 'Purple', 'Royal blue', 'Black'], 4],
  [84, 'Semi Banarasi silk saree', 'Semi silk', ['Orange', 'Black', 'Emerald', 'Lavender'], 4],
  [85, 'Gold semi silk hand-embroidered boota', 'Semi silk', ['Gold'], 1],
  [86, 'Rani pink semi silk hand-embroidered boota', 'Semi silk', ['Rani pink'], 1],
  [87, 'Semi georgette Banarasi', 'Semi georgette', ['Red', 'Rani pink'], 2],
  [88, 'Semi Banarasi patola weave', 'Semi silk', ['Purple', 'Red', 'Orange'], 3],
  [89, 'Semi silk kinkhwab saree', 'Semi silk', ['Pink', 'Orange'], 2],
  [90, 'Rani pink semi Banarasi silk', 'Semi silk', ['Rani pink'], 1],
  [91, 'Semi tissue silk lace saree', 'Semi tissue silk', ['Teal', 'Sage'], 2, 'Teal and pale green: two sarees, or one saree\'s body and pallu.'],
];
if (ROWS.length !== source.rows.length) throw new Error('ROWS and catalogue rows differ');

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pad = (n) => String(n).padStart(3, '0');
const list = (a) => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
const taken = new Set(data.products.filter((p) => p.source !== 'catalogue').map((p) => p.slug));

const added = ROWS.map(([row, name, fabric, colourNames, n, note]) => {
  const r = source.rows.find((x) => x.row === row);
  if (!r) throw new Error('No catalogue row ' + row);
  let slug = slugify(name);
  if (taken.has(slug)) slug += '-' + row;
  taken.add(slug);
  const out = r.output;
  const premium = /^premium/i.test(r.range);
  const banarasi = /banaras/i.test(r.description);
  const multi = n > 1;
  const colours = colourNames.map(colour);
  const lower = colourNames.map((c) => c.toLowerCase());
  const review = [];
  if (multi) review.push(`The photo shows ${n} sarees (${list(lower)}). Which one is for sale, or are these colour options?`);
  if (note) review.push(note);
  if (!banarasi) review.push('Not placed in Banaras ki Bunkari: the description does not say Banarasi. Assign a category if it is.');
  if (row >= 71) review.push('Photo cut from a phone screenshot (717px wide): ask for the original camera file (its name, e.g. _SKS6651.JPG, shows in the screenshot).');
  if ((row >= 44 && row <= 49) || row >= 71) review.push('The photo has a "Stylish Naari" name written on it (spelt "Stylissh" in most): text inside images breaks the brand rules.');
  return {
    slug,
    source: 'catalogue',
    catalogueRow: row,
    sku: null,
    name,
    nameStatus: 'catalogue',
    nameMeaning: null,
    descriptor: multi ? `${fabric}, ${n} colours shown` : `${colourNames[0]} ${fabric.toLowerCase()}`,
    description: clean(r.description),
    descriptionStatus: 'catalogue',
    descriptionSource: r.whatsapp,
    colourLine: null,
    styling: null,
    price: r.price,
    priceIsPlaceholder: false,
    isNew: false,
    edits: [],
    categories: banarasi ? ['banarasi'] : [],
    ...(banarasi ? { categoryEvidence: 'The catalogue description says Banarasi.' } : {}),
    colours,
    coloursSource: 'photo',
    attributes: {
      fabric,
      range: premium ? 'Premium' : 'Semi-premium',
      silkMark: premium ? 'catalogue: Premium (Silk Mark certified) — not verified' : null,
      colourway: multi ? null : colourNames[0],
      border: null, motif: null, length: null, blousePiece: null, weave: null,
      origin: banarasi ? 'Banaras' : null,
      availability: null,
    },
    images: [{
      src: `/assets/images/catalogue/sn-${pad(row)}.jpg`,
      width: out.w || null, height: out.h || null,
      alt: multi ? `${n} sarees of this design laid out together, in ${list(lower)}` : `${name} saree, folded and laid flat`,
      source: r.highRes ? `images/${r.highRes.file} (full-size copy of ${r.imageFile})` : `images/${r.imageFile}`,
    }],
    looks: [],
    review,
  };
});

// image sizes for the files that were copied unchanged
const dim = (file) => { const b = fs.readFileSync(file); let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + b.readUInt16BE(i + 2); } };
for (const p of added) {
  const img = p.images[0];
  const file = path.join('assets', img.src.replace('/assets/', ''));
  if (!fs.existsSync(file)) throw new Error('Missing image ' + file);
  [img.width, img.height] = dim(file);
  if (Math.max(img.width, img.height) < 1000 && !p.review.some((x) => /screenshot/.test(x))) p.review.push(`Low-resolution photo (${img.width}×${img.height}): ask for a larger original.`);
  // The Saree Swatch's fabric square: a gentle zoom into the middle of the saree's own photo, only where the
  // photo shows one saree and is large enough to stay sharp. Otherwise the square stays the plain colour.
  p.crops = p.attributes.colourway && Math.min(img.width, img.height) >= 1000 ? { swatch: { img: 0, s: 1.8, ox: '50%', oy: '50%' } } : {};
}

// ─── Same print, different colours → one product with colour variants ───
// GROUPS: catalogue rows that are one print in several colours (same description, and the photos show the same
// design). "confirmed" = the print is plainly the same in the photos; "probable" = same description and price and a
// similar layout, but the photos are too small or angled to be sure. Each row becomes one colour, with its own photo
// and price. Rows whose single photo shows several colours (n > 1 above) also become colour variants, sharing that
// photo until each colour's own photo arrives.
const GROUPS = [
  { rows: [11, 16], name: 'Katan zari booti', confidence: 'confirmed' },
  { rows: [29, 30], name: 'Katan tanchoi skirt border', confidence: 'confirmed', note: 'Row 30\'s lavender saree appears to be the lavender one in row 29\'s group photo, so it is one colour here, with row 30\'s photo.' },
  { rows: [54, 63], name: 'Semi mashru Banarasi', confidence: 'confirmed' },
  { rows: [58, 59, 60], name: 'Semi silk tanchoi meenakari', confidence: 'confirmed' },
  { rows: [61, 62], name: 'Art silk kanchi border', confidence: 'confirmed' },
  { rows: [64, 67, 68, 69], name: 'Semi silk double-shade border', confidence: 'confirmed' },
  { rows: [82, 85, 86], name: 'Semi silk hand-embroidered boota', confidence: 'confirmed' },
  { rows: [14, 15], name: 'Kora alfi booti', confidence: 'probable', note: 'The bootas sit along the border on the brown one and across the body on the purple one.' },
  { rows: [42, 43], name: 'Chiniya silk', confidence: 'probable', note: 'The bootas look larger on the lavender one than on the sky blue one.' },
  { rows: [44, 45], name: 'Kora kadhua weave', confidence: 'probable' },
  { rows: [65, 66], name: 'Semi silk sona rupa jamdani', confidence: 'probable', note: 'The indigo one shows a larger jaal than the emerald one.' },
];
const ASSORTED = [71, 72, 73, 75, 83, 84, 88]; // group photos that look like a mix of designs, not one print
const byRow = Object.fromEntries(added.map((p) => [p.catalogueRow, p]));
const colourKey = (name) => slugify(name);
const multiNote = /^The photo shows \d+ sarees/;

function withVariants(members, name, extraReview) {
  const base = members[0];
  const images = [], variants = [], review = [...extraReview], aliases = [];
  for (const m of members) {
    const shown = byRow[m.catalogueRow].review.find((r) => multiNote.test(r));
    const colourNames = m.attributes.colourway ? [m.attributes.colourway] : m.colours.map((c) => c.name); // a group photo gives every colour it shows
    images.push(m.images[0]);
    const imageIndex = images.length - 1;
    for (const cName of colourNames) {
      const existing = variants.find((v) => v.key === colourKey(cName));
      const own = colourNames.length === 1;
      if (existing) { if (own && existing.imageShared) Object.assign(existing, { imageIndex, imageShared: false, catalogueRow: m.catalogueRow, price: m.price }); continue; }
      variants.push({ key: colourKey(cName), name: cName, colour: colour(cName), price: m.price, catalogueRow: m.catalogueRow, imageIndex, imageShared: !own });
    }
    aliases.push({ slug: m.slug, colour: colourNames.length === 1 ? colourKey(colourNames[0]) : null });
    for (const r of m.review) if (!multiNote.test(r) && !review.includes(r)) review.push(r);
    if (shown && !review.some((r) => r.startsWith(`Row ${m.catalogueRow}`))) review.push(`Row ${m.catalogueRow}'s photo shows several colours together; each is a colour option here.`);
  }
  // a photo no variant uses any more (e.g. a group photo whose colours all have their own photos) is dropped
  const used = [...new Set(variants.map((v) => v.imageIndex))].sort((a, b) => a - b);
  const keep = used.map((i) => images[i]);
  for (const v of variants) v.imageIndex = used.indexOf(v.imageIndex);
  const shared = variants.filter((v) => v.imageShared).map((v) => v.name.toLowerCase());
  if (shared.length) review.push(`No photo of its own yet for: ${list(shared)} (shown in a group photo). Add one per colour when they arrive: variants[].imageIndex.`);
  const prices = variants.map((v) => v.price);
  const slug = slugify(name);
  return {
    ...base,
    slug: taken.has(slug) && slug !== base.slug ? slug + '-' + base.catalogueRow : slug,
    name,
    catalogueRows: members.map((m) => m.catalogueRow),
    aliases: aliases.filter((a) => a.slug !== (taken.has(slug) && slug !== base.slug ? slug + '-' + base.catalogueRow : slug)), // old links that now open this page (at that colour)
    descriptor: `${base.attributes.fabric}, ${variants.length} colours`,
    price: Math.min(...prices),
    priceMax: Math.max(...prices),
    colours: variants.map((v) => v.colour),
    attributes: { ...base.attributes, colourway: null },
    images: keep.map((img, i) => ({ ...img, alt: `${name} in ${list(variants.filter((v) => v.imageIndex === i).map((v) => v.name.toLowerCase()))}` })),
    variants,
    crops: {}, // the gallery shows one photo per colour, so no extra close-up views
    review,
  };
}

const grouped = new Set();
const merged = [];
for (const g of GROUPS) {
  const members = g.rows.map((r) => byRow[r]);
  if (members.some((m) => !m)) throw new Error('Group row missing: ' + g.rows);
  const gist = (t) => t.toLowerCase().replace(/[^a-z]/g, '').replace(/saree$/, '').replace(/kadua|kadwa|kadhwa/g, 'kadhua');
  if (new Set(members.map((m) => gist(m.description))).size > 1) throw new Error('Group descriptions differ: ' + g.rows);
  g.rows.forEach((r) => grouped.add(r));
  const note = `One print in ${g.rows.length > 1 ? 'several' : 'one'} colours: catalogue rows ${g.rows.join(', ')} (${g.confidence}).${g.note ? ' ' + g.note : ''}${g.confidence === 'probable' ? ' Split them if they are different designs.' : ''}`;
  merged.push({ at: g.rows[0], product: withVariants(members, g.name, [note]) });
}
for (const p of added) {
  if (grouped.has(p.catalogueRow) || p.attributes.colourway) continue; // single-colour rows stay as they are
  const note = ASSORTED.includes(p.catalogueRow)
    ? 'The photo looks like an assortment of different designs; each colour seen is listed as an option. Confirm what is being sold.'
    : 'The photo shows one print in several colours; each is a colour option.';
  const name = p.name;
  merged.push({ at: p.catalogueRow, product: withVariants([p], name, [note]) });
  grouped.add(p.catalogueRow);
}
const result = [];
for (const p of added) {
  const m = merged.find((x) => x.at === p.catalogueRow);
  if (m) result.push(m.product);
  else if (!grouped.has(p.catalogueRow)) result.push(p);
}
added.length = 0; added.push(...result);

data.products = data.products.filter((p) => p.source !== 'catalogue').concat(added);
data._notes.catalogue = 'Sarees with source: "catalogue" come from "Stylish Nari Saree Catalog.xlsx" (91 rows) via _tools/add-catalogue.cjs. Description, price, range and fabric are the catalogue\'s; colours (coloursSource: "photo") are read from the photograph; names are working titles built from catalogue words (nameStatus: "catalogue"). attributes.silkMark records the catalogue\'s claim but is not shown. review[] lists what needs confirming for each saree; _tools/catalogue/review.md collects them.';
fs.writeFileSync(F, JSON.stringify(data, null, 2) + '\n');

// review sheet
const lines = ['# Catalogue sarees: what needs review', '', `Generated by _tools/add-catalogue.cjs. ${added.length} sarees added; ${added.filter((p) => p.review.length).length} have at least one point to confirm.`, '', '| Row | Product | Price | Points to confirm |', '|---|---|---|---|'];
for (const p of added) if (p.review.length) lines.push(`| ${p.catalogueRow} | [${p.name}](/products/${p.slug}) | ₹${p.price.toLocaleString('en-IN')} | ${p.review.join(' · ')} |`);
const withColours = added.filter((p) => p.variants);
lines.push('', '## Prints with several colours', '', `${withColours.length} product pages carry a colour choice. Each colour has its own link: /products/<page>?colour=<colour>. "shared photo" = that colour only appears in a group photo so far.`, '',
  '| Product | Catalogue rows | Colours (row · price · photo) |', '|---|---|---|');
for (const p of withColours) lines.push(`| [${p.name}](/products/${p.slug}) | ${p.catalogueRows.join(', ')} | ${p.variants.map((v) => `${v.name} (row ${v.catalogueRow} · ₹${v.price.toLocaleString('en-IN')} · ${v.imageShared ? 'shared photo' : 'own photo'})`).join('; ')} |`);
const unmatched = source.unmatched.map((u) => `- \`${u.file}\` — no catalogue photo matches it (closest score ${u.score}; a match is under 10).`);
lines.push('', '## Photos not used', '', 'From the "Photos without details" sheet: no description or price was supplied, and they match no catalogue photo.', '', ...unmatched,
  '', 'extra_photo_001 to _041 were used: each is the full-size copy of one catalogue photo (see catalogue-source.json, rows[].highRes).', '');
fs.writeFileSync(path.join(__dirname, 'catalogue/review.md'), lines.join('\n'));
console.log(`added ${added.length}; total ${data.products.length}; with review points ${added.filter((p) => p.review.length).length}`);
