// The shop categories (client, Nov 17 2026; Bandhej renamed Bandhani the same day): by craft, not by state. The state-wise categories (Banaras ki Bunkari,
// Pedana ki Kalamkari, Rajasthan ki Rajshahi, Gujarat ki Garima, Kolkata, Bihar, Madhya Pradesh) are gone; their old
// links redirect (categories[].formerly → serve.mjs / build.mjs; links with no new home go to /sarees).
//   group  craft = Kalamkari, Bandhani, Block prints, Chanderi, Banarasi: photo tiles on the homepage, header menu
//          mark  = certified sarees;  more = other pages (not listed on the homepage)
//   parent = a subcategory: Banarasi → Premium silk / Premium semi-silk. A saree in a subcategory carries both slugs.
//   image  = the homepage tile photograph, null until one is supplied.
// Banarasi subcategories come from the Drive workbook "Pendrive Photo Audit – Banarasi" (folder 01 – Banarasi):
// SN-001…049 = "Banarasi – Premium" (Drive folder Premium Silk), SN-050…091 = "Banarasi – Semi-Premium" (Premium
// Semi-Silk). Every SN-numbered saree is Banarasi by that workbook. Banarasi sarees with no SN (the first shoot and the AI
// model sarees) stay in Banarasi without a subcategory until the client says which.
// Safe to re-run; run after any add-*.cjs. Run from homepage/: node _tools/set-categories.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const keep = Object.fromEntries((d.categories || []).map((c) => [c.slug, c.image]));
const C = (slug, name, group, extra = {}) => ({ slug, name, group, image: keep[slug] ?? null, ...extra });
const img = (src, width, height, alt, pos) => ({ src, width, height, alt, pos });
d.categories = [
  C('banarasi', 'Banarasi', 'craft', { formerly: ['banaras-ki-bunkari'],
    line: 'Silk and zari from the looms of Varanasi.',
    image: keep.banarasi || keep['banaras-ki-bunkari'] || img('/assets/images/panna.jpg', 1750, 3109, 'Banarasi: Panna', '50% 80%') }),
  C('banarasi-premium-silk', 'Premium silk', 'craft', { parent: 'banarasi', line: 'Pure katan, kora and tissue silk, woven in Banaras.' }),
  C('banarasi-premium-semi-silk', 'Premium semi-silk', 'craft', { parent: 'banarasi', line: 'Banarasi weaves in lighter semi-silk blends.' }),
  C('kalamkari', 'Kalamkari', 'craft', { formerly: ['pedana-ki-kalamkari'], line: 'Stories and florals, painted and printed by hand.',
    image: keep.kalamkari || img('/assets/images/chitra.jpg', 1025, 1534, 'Kalamkari: Chitra', '50% 35%') }),
  C('bandhani', 'Bandhani', 'craft', { formerly: ['bandhej', 'rajasthan-ki-rajshahi'], line: 'Colour resisted by hand, dot by dot, before the cloth is dyed.',
    image: keep.bandhani || img('/assets/images/jamuni.jpg', 1006, 1564, 'Bandhani: Jamuni', '50% 40%') }),
  C('block-prints', 'Block prints', 'craft', { line: 'Printed by hand with carved wooden blocks.',
    image: keep['block-prints'] || img('/assets/images/mehrab.jpg', 1024, 1536, 'Block prints: Mehrab', '50% 40%') }),
  C('chanderi', 'Chanderi', 'craft', { formerly: ['madhya-pradesh-ki-chanderi'], line: 'Sheer, light weaves of silk and cotton.' }),
  C('handloom-mark-sarees', 'Handloom Mark sarees', 'mark'),
  C('silk-mark-sarees', 'Silk Mark certified sarees', 'mark'),
  C('designer-fusion-sarees', 'Designer fusion sarees', 'more'),
  C('blouses', 'Blouses', 'more'),
  C('jewellery', 'Jewellery', 'more'),
  C('others', 'Others', 'more'),
];
// old state-wise links with no craft of their own
d.categoryRedirects = { 'kolkata-ki-kalakari': '/sarees', 'gujarat-ki-garima': '/sarees', 'bihar-ki-bahar': '/sarees' };

const MOVE = { 'banaras-ki-bunkari': 'banarasi', 'pedana-ki-kalamkari': 'kalamkari', 'rajasthan-ki-rajshahi': 'bandhani', bandhej: 'bandhani', 'madhya-pradesh-ki-chanderi': 'chanderi' };
const OLD = ['kolkata-ki-kalakari', 'gujarat-ki-garima', 'bihar-ki-bahar', ...Object.keys(MOVE)];
const SUBS = ['banarasi-premium-silk', 'banarasi-premium-semi-silk'];
const WB = 'Drive workbook "Pendrive Photo Audit – Banarasi"';
const counts = {};
for (const p of d.products) {
  const cats = new Set(); const ev = {};
  for (const c of p.categories || []) {
    const to = MOVE[c] || (OLD.includes(c) ? null : c);
    if (!to) continue;
    cats.add(to);
    const e = p.categoryEvidence?.[c] ?? p.categoryEvidence?.[to];
    if (e) ev[to] = e;
  }
  for (const s of SUBS) cats.delete(s);
  const sn = (JSON.stringify(p).match(/SN-(\d{3})/) || [])[1];
  if (sn) {
    const sub = +sn <= 49 ? SUBS[0] : SUBS[1];
    cats.add('banarasi'); cats.add(sub);
    ev.banarasi = ev[sub] = `${WB}: SN-${sn}, ${+sn <= 49 ? 'Banarasi – Premium' : 'Banarasi – Semi-Premium'}`;
  }
  p.categories = [...cats];
  if (Object.keys(ev).length) p.categoryEvidence = ev; else delete p.categoryEvidence;
  for (const c of p.categories) counts[c] = (counts[c] || 0) + 1;
}
d._notes.categories = 'categories: the shop categories by craft (client, Nov 17 2026), set by _tools/set-categories.cjs. Craft ones show as tiles on the homepage and in the header menu; parent marks a subcategory (a saree in it carries the parent slug too). formerly / categoryRedirects keep the old state-wise links working.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(counts);
console.log('no category:', d.products.filter((p) => !p.categories.length).map((p) => p.slug).join(', '));
