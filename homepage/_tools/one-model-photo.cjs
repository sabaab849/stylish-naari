// One model photograph per product (client request, 16 Nov 2026): keep the first photo of each model saree and remove
// every other photo that shows the model (a second pose, a back view, a portrait). Fabric close-ups (role detail/border/
// source, where the cloth is the subject), the original product photos (role product) and films stay.
// A later photo counts as a model photograph if it has no role (a full pose), or it is one of the close-ups listed in
// PORTRAITS below, which show the model's face (checked by eye on every gallery). Folded catalogue PDPs are untouched.
// Image indexes (crops, backdrop, looks, anything with a numeric `img`) are remapped; a crop that pointed at a removed
// photo moves to the first photo, centred on that photo's own colour/pallu point. Safe to re-run.
// Run from homepage/:  node _tools/one-model-photo.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const PORTRAITS = new Set(['kamdhenu-detail', 'saagar-detail', 'pista-detail', 'saawan-detail', 'gagan-detail']);
const base = (src) => src.split('/').pop().replace(/\.[a-z0-9]+$/i, '');
const isModel = (im) => !/\.mp4$/i.test(im.src) && (!im.role || PORTRAITS.has(base(im.src)));
const log = [];
for (const p of d.products) {
  if (p.source === 'catalogue' || !p.images?.length) continue;
  const old = p.images;
  const keep = old.filter((im, i) => i === 0 || !isModel(im));
  if (keep.length === old.length) continue;
  const at = (src) => keep.findIndex((im) => im.src === src);
  const point = (c) => c && c.img === 0 && c.ox ? { ox: c.ox, oy: c.oy } : null;
  const fallback = point(p.crops?.colour) || point(p.crops?.pallu) || { ox: '50%', oy: '55%' };
  const fix = (o) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(fix); return; }
    if (typeof o.img === 'number' && old[o.img]) {
      const n = at(old[o.img].src);
      if (n >= 0) o.img = n; else { o.img = 0; if ('ox' in o) Object.assign(o, fallback); }
    }
    for (const [k, v] of Object.entries(o)) if (k !== 'images' && v && typeof v === 'object') fix(v);
  };
  fix(p.crops); fix(p.backdrop); fix(p.looks); fix(p.closer);
  p.images = keep;
  log.push(`${p.slug.padEnd(11)} removed ${old.filter((im) => !keep.includes(im)).map((im) => base(im.src)).join(', ')}`);
}
d._notes.oneModelPhoto = 'One model photograph per product (Nov 16): later poses and portraits removed by _tools/one-model-photo.cjs; fabric close-ups and original product photos kept.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(log.join('\n')); console.log(log.length, 'products changed');
