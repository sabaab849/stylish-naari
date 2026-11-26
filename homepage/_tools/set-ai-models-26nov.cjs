// New AI model photographs for 15 Premium Semi-Silk sarees (client, 26 Nov 2026). Each was sent in chat beside its folded
// original as a reference; the folded photo was matched to its Drive SN folder by fingerprint (Drive "Original Product
// Photos – Pendrive"), then the AI image paired with it by eye. Only the AI image goes on the site: it replaces slide 1
// (the model photo); the Drive slides after it are unchanged.
// Images are 1024×1536, the generator's full size (the Downloads copies are the same pixels), kept at that size: no
// upscaling, JPEG quality 2 with full 4:4:4 colour so the weave does not smear. Originals: model photography/AI model images
// (26 Nov 2026)/. Then: set-styled-wide.cjs, make-detail-circles.mjs (the "As styled" circle), make-slide-cuts.mjs.
// Run from homepage/: FFMPEG=<ffmpeg.exe> node _tools/set-ai-models-26nov.cjs <folder with the chat images>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG || 'ffmpeg';
const SRC = process.argv[2];
const ORIG = path.join('..', 'model photography', 'AI model images (26 Nov 2026)');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// slug: [chat image no., SN, frame y (3:4 window, full width), card pos, styling, fall, pallu, colour, alt]
// crop centres are shares of the whole photo, read off each picture.
const SPEC = {
  surmai: [46, 'SN-057', 0.1111, '50% 40%', ['52%', '30%', '52% 15%'], ['35%', '88%'], ['58%', '72%'], ['40%', '62%'],
    'Surmai — a grey tissue saree with a broad gold zari pallu, worn seated beneath a painting of cows'],
  neem: [47, 'SN-082', 0.0800, '45% 35%', ['40%', '32%', '40% 18%'], ['38%', '80%'], ['85%', '55%'], ['30%', '72%'],
    'Neem — a bottle green saree with hand-embroidered bootas and a silver zari border, worn seated on a wooden chair'],
  gunja: [48, 'SN-070', 0.1111, '55% 75%', ['60%', '58%', '60% 50%'], ['30%', '86%'], ['72%', '82%'], ['45%', '70%'],
    'Gunja — a red saree with gold buti and a black floral border and pallu, worn seated in a palm garden'],
  mitti: [49, 'SN-056', 0.0800, '55% 35%', ['58%', '30%', '58% 15%'], ['40%', '86%'], ['66%', '70%'], ['45%', '55%'],
    'Mitti — a grey-beige saree with orange and green buti and a white woven border, worn against a pale blue wall'],
  saunf: [50, 'SN-062', 0.0556, '50% 35%', ['46%', '28%', '46% 12%'], ['52%', '86%'], ['80%', '80%'], ['45%', '50%'],
    'Saunf — an olive green saree with gold buti and a paisley border, worn with a purple blouse beside a wooden chair'],
  tulsi: [51, 'SN-054', 0.0556, '45% 35%', ['42%', '28%', '42% 14%'], ['25%', '90%'], ['60%', '65%'], ['55%', '55%'],
    'Tulsi — a bottle green saree with silver buti and a floral border, worn seated on a carpet, looking over her shoulder'],
  laali: [52, 'SN-064', 0.0556, '45% 40%', ['46%', '36%', '46% 22%'], ['60%', '90%'], ['85%', '85%'], ['72%', '55%'],
    'Laali — a coral red saree with gold buti and a rani pink and gold border, worn seated beside a wooden crate'],
  amavas: [53, 'SN-074', 0.0556, '45% 35%', ['45%', '28%', '45% 14%'], ['40%', '85%'], ['70%', '50%'], ['55%', '55%'],
    'Amavas — a black saree with large woven buta and a colourful floral border, worn seated on red velvet'],
  maina: [54, 'SN-052', 0.0556, '45% 35%', ['40%', '30%', '40% 15%'], ['20%', '85%'], ['62%', '70%'], ['50%', '50%'],
    'Maina — a magenta saree woven with birds and flowers, with a gold border, worn seated on a brass stool'],
  sitara: [55, 'SN-065', 0.0556, '45% 35%', ['40%', '28%', '40% 14%'], ['60%', '86%'], ['52%', '42%'], ['50%', '66%'],
    'Sitara — a navy saree with a silver and gold jaal and a rani pink edge, worn seated holding a pink lotus'],
  jaswand: [56, 'SN-061', 0.0556, '55% 35%', ['55%', '30%', '55% 15%'], ['40%', '90%'], ['70%', '50%'], ['40%', '85%'],
    'Jaswand — a rani pink saree with gold paisley buta and a purple border, worn holding a lotus bud'],
  gulbahar: [57, 'SN-055', 0.0556, '45% 35%', ['40%', '28%', '40% 14%'], ['70%', '85%'], ['60%', '55%'], ['60%', '60%'],
    'Gulbahar — a red saree woven with colourful floral vines and border, worn seated reading a book'],
  kachnar: [73, 'SN-071', 0.0556, '45% 35%', ['47%', '28%', '47% 14%'], ['40%', '80%'], ['62%', '55%'], ['50%', '72%'],
    'Kachnar — a pink and lime green saree with large woven flowers, worn standing by a wooden door reading a book'],
  tesu: [74, 'SN-078', 0.0556, '45% 35%', ['48%', '28%', '48% 14%'], ['40%', '86%'], ['60%', '50%'], ['50%', '72%'],
    'Tesu — a marigold yellow saree with orange buti, worn seated on a cane bench against a green wall'],
  zamurrad: [75, 'SN-066', 0.0556, '45% 35%', ['45%', '28%', '45% 14%'], ['40%', '86%'], ['75%', '70%'], ['50%', '55%'],
    'Zamurrad — a green saree with a gold jaal and a magenta border, worn seated on old stone steps'],
};

fs.mkdirSync(ORIG, { recursive: true });
for (const [slug, [n, sn, fy, pos, sty, fall, pallu, colour, alt]] of Object.entries(SPEC)) {
  const p = data.products.find((x) => x.slug === slug);
  if (!p) throw new Error('no product ' + slug);
  const chat = fs.readdirSync(SRC).find((f) => f.replace(/\.\w+$/, '') === String(n));
  const orig = path.join(ORIG, `${p.name} (${sn}).png`);
  fs.copyFileSync(path.join(SRC, chat), orig);
  const out = `assets/images/${slug}-ai.jpg`;
  execFileSync(FF, ['-v', 'error', '-y', '-i', orig, '-pix_fmt', 'yuvj444p', '-q:v', '2', out]);
  p.images[0] = {
    src: '/' + out.replace(/^assets/, 'assets'),
    width: 1024,
    height: 1536,
    pos,
    alt,
    source: `model photography/AI model images (26 Nov 2026)/${p.name} (${sn}).png`,
    frame: { x: 0, y: fy, w: 1, h: 0.8889 },
  };
  p.images[0].src = `/assets/images/${slug}-ai.jpg`;
  const c = (p.crops = p.crops || {});
  c.silhouette = { img: 0 };
  c.fall = { img: 0, s: 1.5, ox: fall[0], oy: fall[1] };
  c.pallu = { img: 0, s: 1.5, ox: pallu[0], oy: pallu[1] };
  c.colour = { img: 0, s: 1.4, ox: colour[0], oy: colour[1] };
  c.styling = { img: 0, s: 1.3, ox: sty[0], oy: sty[1], op: sty[2] };
  p.backdrop = { img: 0, pos, posMobile: pos };
  if (p.detailCircles) delete p.detailCircles.styled;
  console.log(slug.padEnd(9), sn, '←', chat);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
