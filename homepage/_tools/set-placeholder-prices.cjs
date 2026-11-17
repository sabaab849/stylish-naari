// Placeholder prices for the sarees that have none yet (client, Nov 17 2026: "put placeholder pricing to them").
// Every one is marked priceIsPlaceholder: true, so the site can sell them in the prototype but they are easy to find and
// replace: the Shopify export (export-shopify.cjs) still imports them as Draft and lists them in prices-needed.csv.
// Set in the range of the confirmed prices of the same kind (Banarasi premium silk: ₹13,999–52,500, median 29,500; the
// earlier placeholders: Kalamkari ₹14,900–16,500, Bandhani ₹19,500). Only fills a price that is null; never overwrites.
// Safe to re-run. Run from homepage/: node _tools/set-placeholder-prices.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const PRICES = {
  // Banarasi, AI model sarees with no SN (zari silk, by the look of them)
  gulkand: 24900, parinda: 27900, elaichi: 22900, bulbul: 26900, genda: 21900, kesar: 23900, nilofer: 28900, alta: 25900,
  hiran: 29900, kumkum: 26900, chandni: 31900, narangi: 27900, neelambari: 29900, gulaabi: 22900, pista: 24900,
  dariya: 21900, tota: 23900, saagar: 25900, nilam: 26900, baingani: 24900,
  // Kalamkari
  veena: 16900, darbar: 17900, chitra: 15900, gajraj: 16900, bansuri: 15900,
  // Bandhani
  chunari: 18900, sakhi: 17900, jamuni: 15900, bindiya: 19900, gulabo: 16900, lavanya: 21900,
  // Block prints (cotton and linen, by the look of them)
  rekha: 5900, syahi: 4900, chaand: 4500, champa: 4500, jaali: 3900, samandar: 5500, saras: 4900, shaam: 5500,
  rangrez: 5900, jugnu: 4500, patti: 4900, dhaara: 4500, sarson: 5900, raat: 6900, mehrab: 6900,
  // no category yet (embroidered and striped sarees)
  kamdhenu: 14900, gulnaar: 13900, saawan: 9900, gagan: 12900,
};
let n = 0;
for (const p of d.products) {
  if (p.price != null || !(p.slug in PRICES)) continue;
  p.price = PRICES[p.slug]; p.priceIsPlaceholder = true; n++;
}
const left = d.products.filter((p) => p.price == null).map((p) => p.slug);
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(`set ${n} placeholder prices; still without a price: ${left.length ? left.join(', ') : 'none'}`);
console.log(`placeholders now: ${d.products.filter((p) => p.priceIsPlaceholder).length} of ${d.products.length}`);
