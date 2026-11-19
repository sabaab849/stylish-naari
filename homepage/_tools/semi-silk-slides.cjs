// Premium semi-silk PDP slides, checked against the Drive folder "Original folded images" (one folder per SN,
// https://drive.google.com/drive/folders/1TBBDpzEnCymyXMRIRBTA-wEuoR4vXsL6), client, 19 Nov 2026.
// Order on every PDP: model → folded original → print close-up → border beside the print → blouse piece → film.
// Fixes made here (photos turned upright 90° clockwise, longest side 2400px):
//   surmai   folded = SN-057 – 03 (client's pick); fabric = SN-057 – 04 (plain grey body); border = SN-057 – 01.
//            SN-057 – 02 (teal and gold jaal) is not Surmai and is dropped.
//   zamurrad border = SN-066 – 03 (was SN-066 – 05, the blouse piece photo, hidden)
//   sitara   border = SN-065 – 03 (was SN-065 – 05, the blouse piece photo, hidden)
//   maina    border = SN-052 – 07 (was SN-052 – 08, the pallu, hidden)
//   shikara  border SN-083 – 03 shown (paisley border beside the blue body)
// Safe to re-run.
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const DRIVE = 'Drive: Original folded images';
const get = (slug) => data.products.find((p) => p.slug === slug);
const img = (src, alt, sn, n) => ({ src, width: 1600, height: 2400, role: 'product', fit: 'cover', actual: true, alt, source: `${DRIVE} / ${sn} – ${n}`, sn });

// Surmai: model, folded, fabric, border, blouse (indices kept so crops still point at print 2 and border 3)
{
  const p = get('surmai');
  const model = p.images[0];
  const folded = p.images.find((i) => i.src.endsWith('surmai-folded.jpg'));
  const blouse = p.images.find((i) => i.role === 'blouse');
  p.images = [
    model, folded,
    img('/assets/images/surmai-fabric.jpg', 'Surmai up close: the plain grey body, a fine silk weave', 'SN-057', '04'),
    img('/assets/images/surmai-original.jpg', 'Surmai: the gold zari border and pallu beside the grey body', 'SN-057', '01'),
    blouse,
  ].filter(Boolean);
}

// Border slides: replace the hidden one with a photo of the border beside the print
const BORDER = {
  zamurrad: ['SN-066', '03', 'Zamurrad: the gold border beside the green jaal'],
  sitara: ['SN-065', '03', 'Sitara: the border beside the navy and silver jaal'],
  maina: ['SN-052', '07', 'Maina: the zari border beside the floral jaal'],
};
for (const [slug, [sn, n, alt]] of Object.entries(BORDER)) {
  const p = get(slug);
  const i = p.images.findIndex((im) => /-border(-print)?\.jpg$/.test(im.src));
  p.images[i] = img(`/assets/images/${slug}-border-print.jpg`, alt, sn, n);
}

// No Drive photo of the border beside the print: the border is cut from the folded original (SN – 01) at full
// resolution, never enlarged (client, 19 Nov 2026). Box in the 2624×3936 original: x, y, w, h.
const CROP = {
  neem: ['SN-082', [1250, 2050, 1200, 1600], 'Neem up close: the silver border beside the green body and its hand-embroidered boota'],
  shahtoot: ['SN-076', [650, 2250, 1200, 1600], 'Shahtoot up close: the silver floral border beside the appliqué flowers'],
  kachnar: ['SN-071', [150, 1300, 1050, 1400], 'Kachnar up close: the green temple border beside the pink body and its woven flower'],
  tesu: ['SN-078', [1050, 2300, 1050, 1400], 'Tesu up close: the gold border beside the orange buti body'],
};
for (const [slug, [sn, [x, y, w, h], alt]] of Object.entries(CROP)) {
  const p = get(slug);
  const i = p.images.findIndex((im) => /-border(-crop)?\.jpg$/.test(im.src));
  p.images[i] = { ...img(`/assets/images/${slug}-border-crop.jpg`, alt, sn, '01'), width: w, height: h, source: `${DRIVE} / ${sn} – 01 (primary), cropped x${x} y${y} ${w}×${h}` };
}

// Shikara: its border shot shows the paisley border, so it is a slide
delete get('shikara').images.find((im) => im.src.endsWith('shikara-border.jpg')).gallery;

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
for (const s of ['surmai', 'zamurrad', 'sitara', 'maina', 'shikara', 'neem', 'shahtoot', 'kachnar', 'tesu']) console.log(s, get(s).images.map((i) => i.src.split('/').pop() + (i.gallery === false ? ' (hidden)' : '')).join(' · '));
