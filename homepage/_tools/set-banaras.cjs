// Assigns existing sarees to "Banaras ki Bunkari" only where the project documents them as Banarasi.
//   kairi, jamun, neel, bagh: the brand's original brief describes this first shoot as its Banarasi sarees
//   panna: the client's product photo is named "Emerald Banarasi Saree with Paisley Border"
// Other sarees are left unassigned until the client confirms them (see the report). Safe to re-run.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const CAT = 'banaras-ki-bunkari';
const banarasi = { kairi: 'Original brief: the brand\'s Banarasi sarees (first shoot)', jamun: 'Original brief: first shoot', neel: 'Original brief: first shoot', bagh: 'Original brief: first shoot', panna: 'Product photo filename: "Emerald Banarasi Saree with Paisley Border"' };
for (const p of d.products) if (banarasi[p.slug]) {
  p.categories = [...new Set([...(p.categories || []), CAT])];
  p.categoryEvidence = { ...(p.categoryEvidence || {}), [CAT]: banarasi[p.slug] };
}
const panna = d.products.find((p) => p.slug === 'panna').images[0];
const c = d.categories.find((x) => x.slug === CAT);
c.image = { src: panna.src, width: panna.width, height: panna.height, alt: 'Banaras ki Bunkari: Panna', pos: '50% 80%' };
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(CAT, '→', d.products.filter((p) => (p.categories || []).includes(CAT)).map((p) => p.name).join(', '));
