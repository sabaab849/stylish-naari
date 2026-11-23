// Kasni, Basanti, Surkh (SN-029 colours): new main photos (client, 23 Nov 2026), one matching set: seated on a stone block
// beside brass bells and a bowl of rose petals, the pallu falling to the floor. Styled (AI) imagery, 1024×1536, kept at that
// size; the chat files are kept in model photography/SN-029 colours seated (23 Nov 2026)/. Replaces images[0] only, so every
// other crop index stays valid. 3:4 window around the model and the pallu (the brass props on the left fall outside).
// Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<folder with the chat images> node _tools/set-kasni-seated.cjs
// Then: set-styled-wide.cjs, make-detail-circles.mjs kasni basanti surkh, make-slide-cuts.mjs kasni basanti surkh, export-shopify.cjs.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const ROOT = path.join(__dirname, '..');
const DIR = 'model photography/SN-029 colours seated (23 Nov 2026)';
const SET = {
  kasni: ['31.png', 'Kasni, a lavender brocade saree with a meenakari skirt border and pink-striped pallu, worn seated on a stone block beside brass bells and rose petals, the pallu falling to the floor'],
  basanti: ['32.png', 'Basanti, a mustard brocade saree with a meenakari skirt border and pink-striped pallu, worn seated on a stone block beside brass bells and rose petals, the pallu falling to the floor'],
  surkh: ['33.png', 'Surkh, a red brocade saree with a meenakari skirt border and gold-striped pallu, worn seated on a stone block beside brass bells and rose petals, the pallu falling to the floor'],
};
const W = 1024, H = 1536, fw = 0.8, fh = +((fw * W * 4) / 3 / H).toFixed(4);
const file = path.join(ROOT, 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const [slug, [src, alt]] of Object.entries(SET)) {
  const out = path.join(ROOT, 'assets', 'images', `${slug}-seated.jpg`);
  if (FF && IN) {
    fs.mkdirSync(path.join(ROOT, '..', DIR), { recursive: true });
    fs.copyFileSync(path.join(IN, src), path.join(ROOT, '..', DIR, `${slug}-seated.png`));
    execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', path.join(IN, src), '-q:v', '2', out]);
  }
  if (!fs.existsSync(out)) throw new Error(`missing ${out}: set FFMPEG and IN`);
  const p = data.products.find((x) => x.slug === slug);
  p.images[0] = { src: `/assets/images/${slug}-seated.jpg`, width: W, height: H, alt, pos: '75% 50%',
    frame: { x: 1 - fw, y: 0.25, w: fw, h: fh }, source: `${DIR}/${slug}-seated.png` };
  p.crops.styling = { img: 0, s: 1.3, ox: '100%', oy: '50%', op: '50% 0%' };
  p.crops.fall = { img: 0, s: 1.9, ox: '75%', oy: '85%' };
  p.crops.pallu = { img: 0, s: 1.7, ox: '75%', oy: '70%' };
  p.crops.colour = { img: 0, s: 1.5, ox: '55%', oy: '55%' };
  if (p.crops.silhouette) p.crops.silhouette = { img: 0 };
  if (p.detailCircles) delete p.detailCircles.styled;
  console.log(slug, p.images[0].src, JSON.stringify(p.images[0].frame));
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
