// Blouse piece photos (client, 18 Nov 2026), from the Drive folder "2day" (one folder per saree, 49–92, unnamed _DSC
// photos). Each saree was matched to its site product by comparing the Drive photos with the product's own original
// photos (same shoot); the blouse piece is the shot of plain or lightly patterned cloth with the border beside it.
// Photos turned upright (90° clockwise), longest side 2400px: assets/images/<slug>-blouse.jpg.
// Adds the photo as the last gallery slide (role "blouse") and sets attributes.blousePiece. Safe to re-run.
//   Matched, with a blouse photo (10): below.
//   Matched, no blouse photo found here at first (4): surmai 53, jaswand 55, saunf 64, khubani 75. They do have one, woven
//   differently from the saree (19 Nov 2026): added by blouse-day1.ps1 + add-blouse-day1.cjs.
//   Drive folders with no site product (30): 49–52, 54, 56–63, 65, 66, 69, 70, 74, 77–82, 84–87, 90, 92.
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const BLOUSE = {
  mitti: [67, 'DSC6901'],
  gulbahar: [68, 'DSC6906'],
  jharokha: [71, 'DSC6923'],
  gunja: [72, 'DSC6928'],
  maina: [73, 'DSC6943'],
  tulsi: [76, 'DSC6960'],
  banafsha: [83, 'DSC7011'],
  laali: [88, 'DSC7039'],
  sitara: [89, 'DSC7044'],
  zamurrad: [91, 'DSC7054'],
};

for (const [slug, [folder, dsc]] of Object.entries(BLOUSE)) {
  const p = data.products.find((x) => x.slug === slug);
  if (!p) { console.log('missing product', slug); continue; }
  const src = `/assets/images/${slug}-blouse.jpg`;
  p.images = p.images.filter((im) => im.src !== src);
  p.images.push({
    src, width: 1600, height: 2400, role: 'blouse', fit: 'cover', actual: true,
    alt: `${p.name}: the blouse piece`,
    source: `Drive: 2day / ${folder} / _${dsc}`,
  });
  p.attributes = p.attributes || {};
  p.attributes.blousePiece = 'Included, unstitched (pictured)';
  console.log('blouse added', slug);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
