// Sets product.closer: the copy for the "A closer look" section on each PDP.
//   heading = a short line in the pattern "<colour>, <what it does>", written per saree (DRAFT copy)
//   items   = up to three [label, value] pairs, each taken from that saree's attributes
//             (colourway, motif, border, weave). Labels adapt to the saree: Embroidery, Motif, Pallu, Weave.
// The fourth cell of the grid is always the shipping accordion, rendered from store/product policy data.
// Chameli's values are the client's own wording. Safe to re-run.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const closer = {
  kairi:   ['Chartreuse, turning rose.',   [['Colour', 'Chartreuse and rose ombré'], ['Motif', 'Scattered floral buti'], ['Border', 'Gold zari']]],
  jamun:   ['Wine, lit with gold.',        [['Colour', 'Wine'], ['Motif', 'Gold buti'], ['Border', 'Rose zari']]],
  neel:    ['Indigo, edged in silver.',    [['Colour', 'Indigo'], ['Motif', 'Lotus buti'], ['Border', 'Aqua-silver']]],
  bagh:    ['Magenta, in full garden.',    [['Colour', 'Magenta'], ['Motif', 'Tree-of-life jaal'], ['Border', 'Marigold']]],
  kajal:   ['Black, in gold and silver.',  [['Colour', 'Black'], ['Motif', 'Elephants and lions'], ['Border', 'Gold and silver florals']]],
  panna:   ['Emerald, threaded with gold.',[['Colour', 'Emerald'], ['Motif', 'Floral jaal, paisley pallu'], ['Border', 'Gold zari']]],
  phalsa:  ['Plum, crossed by vines.',     [['Colour', 'Plum'], ['Motif', 'Elephants and vines'], ['Border', 'Gold florals']]],
  moonga:  ['Coral, in flower.',           [['Colour', 'Coral'], ['Pallu', 'Flowering branches and birds'], ['Border', 'Gold']]],
  chameli: ['Ivory, in bloom.',            [['Colour', 'Soft ivory'], ['Embroidery', 'Rose florals'], ['Border', 'Intricate lacework']]],
  kasni:   ['Lavender, edged in pink.',    [['Colour', 'Lavender'], ['Weave', 'Brocade'], ['Border', 'Pink stripes']]],
  mehendi: ['Olive, softened with pink.',  [['Colour', 'Olive'], ['Motif', 'Floral jaal'], ['Border', 'Gold, edged in pink']]],
  kamal:   ['Pink, traced in white.',      [['Colour', 'Pink'], ['Motif', 'Scattered flowers'], ['Border', 'White embroidery']]],
};
for (const p of d.products) if (closer[p.slug]) p.closer = { heading: closer[p.slug][0], headingStatus: 'draft', items: closer[p.slug][1] };
d._notes.closer = 'product.closer drives the "A closer look" section: a per-saree heading (draft copy) and up to three attribute pairs drawn from that saree\'s attributes. Without it the section falls back to the attributes directly.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('closer set on', d.products.filter(p => p.closer).length, 'products');
