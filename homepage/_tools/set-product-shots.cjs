// Adds each saree's product photograph (laid flat on ivory, from the "model photography" folder) to its
// images, and marks the fabric close-up photo as role "detail". Safe to re-run.
//   role "detail"  = the close-up photo: shown as the print detail, and cropped for the border detail
//   role "product" = the flat product shot: shown whole (fit: contain) on its own backdrop colour (bg)
// The PDP gallery order is: portrait → print detail → border detail → product shot.
// Moonga, Kairi, Jamun, Neel and Bagh have no product shot yet.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const IVORY = '#F7F2EC'; // the backdrop of the product shots (Panna's and Kajal's run to the edge, so they use it too)
const shots = {
  kamal:   { file: 'Embroidered Peach Fabric on Ivory.png',            width: 1489, height: 1056, bg: '#F5F0EA', alt: 'Kamal, folded flat: pink with a white embroidered border and scattered flowers' },
  chameli: { file: 'Blush Ivory Floral Embroidered Textile.png',       width: 1105, height: 1423, bg: '#F7F2EB', alt: 'Chameli, folded flat: ivory embroidered with roses, with a tone-on-tone border' },
  mehendi: { file: 'Folded Olive Floral Jacquard Saree.png',           width: 1507, height: 1044, bg: '#F8F3EC', alt: 'Mehendi, folded flat: olive floral jaal with a gold border edged in pink' },
  phalsa:  { file: 'Purple Brocade Saree on Ivory.png',                width: 1445, height: 1089, bg: '#F7F2EC', alt: 'Phalsa, folded flat: plum silk with gold elephants, vines and a floral border' },
  panna:   { file: 'Emerald Banarasi Saree with Paisley Border.png',   width: 1530, height: 1028, bg: IVORY,     alt: 'Panna, laid flat: emerald silk with a floral jaal and a paisley pallu' },
  kasni:   { file: 'Lavender Brocade Saree on Ivory.png',              width: 1459, height: 1078, bg: '#F7F2EC', alt: 'Kasni, folded flat: lavender brocade with a pink-striped border and floral pallu panels' },
  kajal:   { file: 'Black Saree with Elephant Embroidery.png',         width: 1549, height: 1015, bg: IVORY,     alt: 'Kajal, laid flat: black silk with lion motifs and a floral border in gold and silver' },
};
let added = 0;
for (const p of d.products) {
  // the second photograph of every second-shoot saree is its fabric close-up
  if (p.images.length > 1 && /-detail\.jpg$/.test(p.images[1].src)) p.images[1].role = 'detail';
  const s = shots[p.slug];
  p.images = p.images.filter((im) => im.role !== 'product');
  if (s) {
    p.images.push({ src: `/assets/images/${p.slug}-product.jpg`, width: s.width, height: s.height, alt: s.alt, role: 'product', fit: 'contain', bg: s.bg, source: s.file });
    added++;
  }
}
d._notes.productShots = 'images[].role: "detail" = the fabric close-up photo; "product" = the flat product shot, shown whole on its backdrop colour. Gallery order: portrait, print detail, border detail, product shot.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('product shots added:', added, '| sarees with a detail photo:', d.products.filter((p) => p.images.some((i) => i.role === 'detail')).length);
