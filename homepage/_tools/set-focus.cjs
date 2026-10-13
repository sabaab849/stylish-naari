// Sets how each product photograph is framed in the PDP gallery and on product cards (a 3:4 portrait frame).
//   pos   = object-position: which part of a taller/wider photo the frame keeps
//   focus = optional gentle zoom (s) around a focal point (ox, oy), used only where the model is small in
//           the photo. Values are chosen so the whole figure, head to hem, stays inside the frame.
// Safe to re-run.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const framing = {
  kairi:   [{ focus: { s: 1.2,  ox: '65%', oy: '62%' } }],
  jamun:   [{ focus: { s: 1.2,  ox: '62%', oy: '75%' } }],
  neel:    [{ focus: { s: 1.15, ox: '60%', oy: '80%' } }],
  bagh:    [{}, {}],
  kajal:   [{ pos: '50% 75%' }, {}],
  panna:   [{ pos: '50% 100%' }, {}],
  phalsa:  [{ pos: '50% 85%' }, {}],
  moonga:  [{ pos: '50% 45%', focus: { s: 1.2, ox: '72%', oy: '45%' } }, {}],
  chameli: [{ pos: '50% 100%' }, {}],
  kasni:   [{ focus: { s: 1.25, ox: '80%', oy: '68%' } }, {}],
  mehendi: [{}, {}],
  kamal:   [{}, {}],
};
for (const p of d.products) (framing[p.slug] || []).forEach((v, i) => {
  const img = p.images[i]; if (!img) return;
  delete img.focus; delete img.pos;
  if (v.focus) img.focus = v.focus;
  if (v.pos) img.pos = v.pos;
});
d._notes.focus = 'images[].pos / images[].focus frame each photograph in the 3:4 gallery and card frame. The whole figure stays in frame; zoom is used only where the model is small in the photo.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('framing set on', d.products.length, 'products');
