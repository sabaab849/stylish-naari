/* Parinda PDP (client, 23 Nov 2026): gallery in the client's exact order, then the reel —
     1 standing at the gold door            parinda-door.jpg
     2 by the lotus pillar, pallu held out  parinda-pillar.jpg
     3 seated against the sky (low angle)   parinda-sky.jpg
     4 pallu and blouse close-up            parinda-detail.jpg
     5 booti close-up cut from photo 3      parinda-booti.jpg (512×768 at x60 y768 of parinda-sky, enlarged 2× bicubic, no sharpening)
   All four photos are the 1024×1536 copies sent in chat (kept in model photography/Parinda shoot (sent in chat 23 Nov 2026)/);
   no full-size files yet. They replace the 20 Nov photos (seat / stand / close), whose files stay on disk.
   Every photo is 2:3, so no frames: each fills the 2:3 gallery frame whole. Reel: painda.MP4 3 s–13 s, enhanced by
   _tools/enhance-reel.sh with GRADE (luma only: gamma 0.97, highlights above 140 compressed to 45 %, contrast +6 %,
   saturation +3 %; white balance untouched):
     GRADE="lutyuv=y='if(gt(255*pow(val/255\,0.97)\,140)\,140+(255*pow(val/255\,0.97)-140)*0.45\,255*pow(val/255\,0.97))',eq=contrast=1.06:saturation=1.03,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0" \
       _tools/enhance-reel.sh parinda ".../parinda/painda.MP4" 3 10
   Run from homepage/: node _tools/set-parinda-shoot.cjs
   then set-feature-crops.cjs and make-detail-circles.mjs. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'parinda');
const KEEP = 'model photography/Parinda shoot (sent in chat 23 Nov 2026)';
const img = (name, alt, extra = {}) => ({ src: `/assets/images/${name}.jpg`, width: 1024, height: 1536, real: true, alt, source: `${KEEP}/${name}.png`, ...extra });
// old index → new index, so crops aimed at the old photos land on the nearest new one
const was = p.images.map((im) => im.src.split('/').pop());
const remap = { 'parinda-seat.jpg': 2, 'parinda-stand.jpg': 0, 'parinda-close.jpg': 1 };
p.images = [
  img('parinda-door', 'Parinda worn standing before a carved gold and copper door: maroon silk woven with zari parrots, the pallu over one arm, a mustard blouse'),
  img('parinda-pillar', 'Parinda beside a carved sandstone pillar, the pallu of zari parrots held out, the broad floral border falling to the floor'),
  img('parinda-sky', 'Parinda seated against a clear sky: the zari buta pallu across the lap and parrots all over the maroon skirt'),
  img('parinda-detail', 'Parinda up close: zari parrots on flowering branches, the woven border and the buta pallu beside an embroidered mustard blouse'),
  img('parinda-booti', 'Parinda booti up close: zari parrots on flowering branches and the buta of the pallu, cut from the seated photograph',
    { source: `${KEEP}/parinda-sky.png (cropped x60 y768 512×768, enlarged 2× bicubic)` }),
];
for (const c of Object.values(p.crops || {})) if (c && c.img != null) c.img = remap[was[c.img]] ?? 0;
p.video = {
  src: '/assets/video/parinda-reel.mp4', srcSmall: '/assets/video/parinda-reel-small.mp4', poster: '/assets/images/parinda-reel-poster.jpg',
  width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/parinda/painda.MP4 (3 s to 13 s; enhanced by _tools/enhance-reel.sh with a highlight roll-off for the sunlit stone, 23 Nov 2026; no sound)'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'));
