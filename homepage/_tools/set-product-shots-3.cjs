// Adds the client's own flat photographs of five third-shoot sarees, background removed
// (_tools/cutouts/cutout.ps1), as the last image in each PDP gallery. Safe to re-run.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const shots = {
  kahani:  ['black multicolor.jpeg',  'Kahani laid flat: black Kalamkari with painted panels, a flute-player pallu and a mustard border'],
  rangoli: ['multicolor border.jpeg', 'Rangoli laid flat: multicolour ikat with a deep maroon pallu border and a red and gold edge'],
  sindoor: ['red border.jpeg',        'Sindoor laid flat: red with a wide ikat border of elephants, parrots and dancers, finished in gold'],
  saanjh:  ['royal blue.jpeg',        'Saanjh laid flat: indigo ikat with elephants and parrots, a gold-striped royal blue border and tassels'],
  leela:   ['yellow multicolor.jpeg', 'Leela laid flat: Kalamkari medallions in blue and ochre, framed by a woven mustard and red border'],
};
for (const p of d.products) if (shots[p.slug]) {
  p.images = p.images.filter((im) => im.role !== 'product');
  p.images.push({ src: `/assets/images/${p.slug}-product.jpg`, width: 1200, height: 1600, alt: shots[p.slug][1], role: 'product', fit: 'contain', bg: '#F7F2EC', source: shots[p.slug][0], cutout: `/_tools/cutouts/${p.slug}.png` });
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(Object.keys(shots).map((s) => s + ': ' + d.products.find((p) => p.slug === s).images.length + ' images').join(' | '));
