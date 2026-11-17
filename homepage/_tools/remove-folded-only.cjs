// Removes every PDP that has no model photograph (client request, 16 Nov 2026): the folded-only catalogue entries
// (source "catalogue"). Their photos stay on disk (assets/images/catalogue/) and their data stays in the client workbook;
// re-add a saree here once it has a model photo. Safe to re-run. Run from homepage/:  node _tools/remove-folded-only.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hasModel = (p) => p.images.some((im) => !im.role && !/\/catalogue\//.test(im.src) && !/\.mp4$/i.test(im.src));
const gone = d.products.filter((p) => !hasModel(p));
d.products = d.products.filter(hasModel);
d._notes.folded = 'Folded-only PDPs (no model photograph) were removed on 16 Nov 2026 by _tools/remove-folded-only.cjs; every product has a model photo.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('removed', gone.length, ':', gone.map((p) => p.slug).join(', '));
console.log('products now:', d.products.length);
