// Gallery slides 2–4 for the early model sarees that match a client SN (photos made by _tools/originals-early.ps1):
// model photo first, then the SN's own folded photo, a print close-up and another view, then the remaining photos
// (detail crops, a second model photo). Drops the AI-generated flat "product" shots (<slug>-product.jpg) and, for Moonga
// and Chameli, the earlier 3:4 cut-outs from Chaman / Shabnam (<chaman|shabnam>-original/print/border.jpg), which the
// whole photos replace. Crop, backdrop and look image indexes are remapped by file. Safe to re-run.
// Run from homepage/:  node _tools/set-originals-early.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const DRIVE = 'Drive: 01 – Banarasi / Premium Silk / Original Product Photos – Pendrive';
const imgSize = (file) => {
  const b = fs.readFileSync(file); let i = 2;
  while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; }
  throw new Error('no size: ' + file);
};
// slug → [SN, colour folder or '', camera files for slides 2, 3, 4]
const SET = {
  kajal: ['002', 'Black', ['01 – _DSC4617', '04 – _DSC4620', '02 – _DSC4618']],
  kamal: ['005', '', ['01 (primary) – _DSC4528', '02 – _DSC4529', '04 – _DSC4545']],
  moonga: ['006', '', ['01 (primary) – _DSC4767', '03 – _DSC4769', '05 – _DSC4771']],
  phalsa: ['013', 'Purple', ['01 – _DSC4625', '04 – _DSC4628', '05 – _DSC4629']],
  panna: ['023', 'Dark green', ['01 – _DSC4652', '04 – _DSC4655', '02 – _DSC4653']],
  kasni: ['029', 'Lilac', ['01 – _DSC4681', '02 – _DSC4682', '03 – _DSC4683']],
  chameli: ['032', '', ['01 (primary) – _DSC4546', '03 – _DSC4548', '05 – _DSC4550']],
  mehendi: ['034', '', ['01 (primary) – _DSC4571', '03 – _DSC4573', '02 – _DSC4572']],
};
const low = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : '');
const KINDS = ['original', 'print', 'border'];
const log = [];
for (const [slug, [sn, colour, files]] of Object.entries(SET)) {
  const p = d.products.find((x) => x.slug === slug); if (!p) throw new Error('no product ' + slug);
  const ours = (src) => KINDS.some((k) => src === `/assets/images/${slug}-${k}.jpg`);
  const dropped = (src) => /-product\.jpg$/.test(src) || /\/(chaman|shabnam)-(original|print|border)\.jpg$/.test(src) || ours(src);
  const old = p.images;
  const what = [low(p.descriptor) || 'the saree itself', low(p.attributes?.motif) || 'the weave', low(p.attributes?.border) || 'the border'];
  const shots = KINDS.map((k, i) => {
    const src = `/assets/images/${slug}-${k}.jpg`; const [width, height] = imgSize(`assets/images/${slug}-${k}.jpg`);
    const alt = [`${p.name}, the saree itself: ${what[0]}`, `${p.name} up close: ${what[1]}`, `${p.name}, another view: ${what[2]}`][i];
    return { src, width, height, role: 'product', fit: 'cover', alt, source: `${DRIVE} / SN-${sn}${colour ? ' – ' + colour : ''} – ${files[i]}`, sn: `SN-${sn}` };
  });
  const rest = old.slice(1).filter((im) => !dropped(im.src));
  const next = [old[0], ...shots, ...rest];
  const at = (src) => next.findIndex((im) => im.src === src);
  const remap = (i) => { if (typeof i !== 'number' || !old[i]) return i; const n = at(old[i].src); return n >= 0 ? n : 2; }; // a dropped photo → the print close-up
  for (const c of Object.values(p.crops || {})) if (c && typeof c.img === 'number') c.img = remap(c.img);
  if (p.backdrop && typeof p.backdrop.img === 'number') p.backdrop.img = remap(p.backdrop.img);
  for (const l of p.looks || []) if (typeof l.img === 'number') l.img = remap(l.img);
  p.images = next; p.galleryListed = true;
  log.push(`${slug.padEnd(8)} SN-${sn}${colour ? ' ' + colour : ''}: ${next.map((im) => im.src.split('/').pop()).join(', ')}`);
}
d._notes.originalsEarly = 'Kajal, Kamal, Moonga, Phalsa, Panna, Kasni, Chameli and Mehendi: gallery slides 2–4 are the original pendrive photos of their SN (Drive Premium Silk / Original Product Photos – Pendrive), whole and turned upright (_tools/originals-early.ps1, set-originals-early.cjs). Kasni is SN-029 lilac (the arched meenakari pallu). Kairi, Jamun, Neel and Bagh have no folded photos: not in the client workbook and not in any of the 92 pendrive shoot folders.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(log.join('\n'));
