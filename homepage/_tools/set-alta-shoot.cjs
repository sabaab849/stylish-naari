/* Alta PDP (client, 23 Nov 2026): four new shoot photos replace slides 1–3; the zari-stripe close-up stays 4th and the reel
   stays last, as the client asked —
     1 full length by the carved arch, hand to the cheek       alta-arch.jpg      (38.png, 1122×1402, shown whole: full-length-first)
     2 by the pillar under blue sky, eyes down                 alta-pillar.jpg    (39.jpg, 1080×1350)
     3 close-up: brocade blouse, pendant, alta-painted hands   alta-closeup.jpg   (40.jpg, 1080×1350)
     4 alta-detail.jpg (unchanged)
     5 standing in the niche, roundel pallu in front           alta-niche.jpg     (41.png, 1122×1402)
     6 reel (unchanged)
   Chat copies, kept at their own size (never enlarged), saved as top-quality JPEGs (q 1, 4:4:4) so they don't block up;
   originals in model photography/Alta shoot (23 Nov 2026)/. Old alta-1/-2/-3 stay on disk.
   Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<chat images> node _tools/set-alta-shoot.cjs,
   then (client: "remove the shadow completely") the wall shadow is taken out of photo 1 with _tools/alta-arch-deshadow.cjs
   (ffmpeg → raw rgb24 → node → "alta-arch (shadow removed).png" → alta-arch.jpg q 1), then full-length-first.cjs, set-feature-crops.cjs, make-detail-circles.mjs alta, export-shopify.cjs. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG, IN = process.env.IN;
const KEEP = 'model photography/Alta shoot (23 Nov 2026)';
const IMG = 'assets/images';
const PHOTOS = { 'alta-arch': ['38.png', 1122, 1402], 'alta-pillar': ['39.jpg', 1080, 1350], 'alta-closeup': ['40.jpg', 1080, 1350], 'alta-niche': ['41.png', 1122, 1402] };
if (FF && IN) {
  fs.mkdirSync(path.join('..', KEEP), { recursive: true });
  for (const [name, [src]] of Object.entries(PHOTOS)) {
    fs.copyFileSync(path.join(IN, src), path.join('..', KEEP, `${name}${path.extname(src)}`));
    execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', path.join(IN, src), '-q:v', '1', '-pix_fmt', 'yuvj444p', `${IMG}/${name}.jpg`]);
  }
}
for (const n of Object.keys(PHOTOS)) if (!fs.existsSync(`${IMG}/${n}.jpg`)) throw new Error(`missing ${n}.jpg: set FFMPEG and IN`);

const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'alta');
const img = (name, alt, extra = {}) => {
  const [src, width, height] = PHOTOS[name];
  const w = +((height * 3) / 4 / width).toFixed(4); // 3:4 window, full height (the photos are 4:5)
  return { src: `/assets/images/${name}.jpg`, width, height, real: true, alt, source: `${KEEP}/${name}${path.extname(src)}`,
    frame: { x: +((1 - w) / 2).toFixed(4), y: 0, w, h: 1 }, ...extra };
};
const detail = p.images.find((im) => im.src.endsWith('/alta-detail.jpg'));
p.images = [
  img('alta-arch', 'Alta, a coral red silk saree with fine zari stripes, a diagonal floral border and gold roundels on the pallu, worn full length beneath a carved terracotta arch with a purple brocade blouse'),
  img('alta-pillar', 'Alta worn by a terracotta pillar under a blue sky, the striped pallu held out with tiny meenakari booti across it'),
  img('alta-closeup', 'Alta up close with a purple brocade blouse, a carnelian pendant and alta-painted hands on the striped drape', { fit: 'cover' }),
  detail,
  img('alta-niche', 'Alta worn standing in a terracotta niche, the pallu in front with its gold roundels and diagonal floral border'),
];
p.galleryListed = true;
Object.assign(p.crops, {
  silhouette: { img: 0 },
  fall: { img: 0, s: 1.5, ox: '50%', oy: '100%', op: '50% 100%' },
  pallu: { img: 4, s: 1.6, ox: '45%', oy: '65%' },
  border: { img: 4, s: 2, ox: '47%', oy: '78%' },
  borderDetail: { img: 4, s: 2.4, ox: '47%', oy: '75%' },
  motif: { img: 4, s: 2.4, ox: '39%', oy: '60%' },
  colour: { img: 0, s: 1.5, ox: '50%', oy: '55%' },
  styling: { img: 1, s: 1.3, ox: '58%', oy: '30%', op: '50% 20%' },
});
delete p.detailCircles; delete p.slideCuts;
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'));
