// Booti work (client, 23 Nov 2026): sarees whose close-up slides show booti — small separate motifs repeated over the body
// of the saree (woven zari or meenakari, embroidered, or block-printed) — get a "Booti work" detail row on the PDP
// (products.json → attributes.booti; render/pdp.mjs → specRows, always shown like the blouse piece) and match "booti" in search.
// Checked by eye on each saree's close-up slides (contact sheets, 23 Nov 2026). Not booti: all-over jaal / tanchoi / lattice
// weaves, patola, kalamkari, bandhani dots, continuous embroidery. Sarees with only model photos (no close-up) are not listed.
// Safe to re-run (it rewrites the list). Run from homepage/: node _tools/set-booti.cjs
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const BOOTI = {
  // Banarasi, woven
  kairi: 'Scattered floral booti in zari',
  jamun: 'Gold zari booti',
  neel: 'Silver lotus booti',
  bagh: 'Silver floral booti',
  tota: 'Silver and gold zari flower booti',
  pista: 'Gold and silver zari booti in a vine jaal',
  hariyali: 'Gold flower booti with magenta leaves',
  gulkand: 'Small floral booti in silver and red',
  parinda: 'Zari parrot booti',
  elaichi: 'Silver and gold floral booti',
  bulbul: 'Silver zari bird booti',
  genda: 'Silver and gold zari booti',
  kesar: 'Silver zari booti',
  alta: 'Meenakari booti',
  khus: 'Gold buta and pastel rosettes',
  rani: 'Gold coin booti',
  taal: 'Gold zari booti',
  mor: 'Gold leaf booti',
  palash: 'Small zari and meenakari booti',
  mehfil: 'Large zari flower buta',
  mishri: 'Gold and silver buta',
  ambi: 'Gold buta',
  shagun: 'Gold and silver buta',
  mangal: 'All-over gold floral booti',
  airavat: 'Peach and silver rosette buta',
  shringaar: 'Gold buta',
  firoza: 'Gold leaf buta',
  megh: 'Gold buta',
  kumkum: 'Coral, navy and olive buta',
  gulaabi: 'Turquoise, coral and marigold flower booti',
  dariya: 'Small silver zari booti',
  nilam: 'Silver zari buta and meenakari roses',
  baingani: 'Silver flower buta',
  gunja: 'Small gold booti',
  jaswand: 'Large gold floral booti',
  tulsi: 'Silver floral booti',
  tesu: 'Red flower booti',
  mitti: 'Small orange, green and silver booti',
  saunf: 'Gold floral booti',
  pudina: 'Silver floral booti',
  laali: 'Gold rosette booti',
  // embroidered
  kamal: 'White embroidered flower booti',
  kattha: 'Embroidered floral buta',
  // block printed
  syahi: 'Block-printed red leaf booti',
  champa: 'Block-printed floral booti',
  saras: 'Block-printed crane booti',
  samandar: 'Block-printed paisley buta',
  mehrab: 'Block-printed floral booti',
};
let n = 0;
for (const p of data.products) {
  if (!p.attributes) continue;
  if (BOOTI[p.slug]) { p.attributes.booti = BOOTI[p.slug]; n++; } else delete p.attributes.booti;
}
const missing = Object.keys(BOOTI).filter((s) => !data.products.some((p) => p.slug === s));
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`${n} sarees with booti work${missing.length ? '; not found: ' + missing.join(', ') : ''}`);
