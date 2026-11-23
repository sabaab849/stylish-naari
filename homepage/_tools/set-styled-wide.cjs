// "As styled" circle, wide (client, 23 Nov 2026: "it shouldn't crop in at styled"): the fourth "In detail" circle shows the styling
// as a whole — face, jewellery, blouse and the drape at the shoulder — never a tight zoom on the face. crops.styling keeps its
// centre (ox, oy, op) but its zoom is capped at MAX. Per-saree fixes for circles that were aimed off the model are in FIX
// (checked by eye on a contact sheet of every circle). Then re-cut: make-detail-circles.mjs. Safe to re-run.
// Run from homepage/: node _tools/set-styled-wide.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const MAX = 1.3;
// slug → full crops.styling override (image index, zoom, centre, object-position)
const FIX = {
  kumkum: { img: 3, s: 1.3, ox: '45%', oy: '55%', op: '50% 30%' }, // client portrait: the face sits low in the frame
  gulaabi: { img: 0, s: 1.3, ox: '50%', oy: '30%', op: '50% 10%' }, // was the close-up (no face): the full-length photo
  hiran: { img: 1, s: 1.3, ox: '50%', oy: '30%', op: '50% 15%' },   // first photo is now a close-up: the incense photo
  kesar: { img: 0, s: 1.3, ox: '50%', oy: '30%', op: '50% 10%' },   // was the pallu close-up (face cut off): the arch photo
  panna: { img: 0, s: 1.3, ox: '50%', oy: '40%', op: '50% 30%' },   // stairs photo (back view): hair, blouse line and pallu
  mehendi: { img: 0, s: 1.3, ox: '50%', oy: '40%', op: '50% 20%' }, // was aimed at the left edge
};
let capped = 0;
for (const p of data.products) {
  if (p.redirect || !p.crops) continue;
  if (FIX[p.slug]) { p.crops.styling = { ...FIX[p.slug] }; continue; }
  const c = p.crops.styling;
  if (c && (c.s ?? 1) > MAX) { c.s = MAX; capped++; }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`styling zoom capped at ${MAX} on ${capped} sarees; ${Object.keys(FIX).length} fixed by hand`);
