/* Nilofer (client, 23 Nov 2026): gallery = the client's photos in order: close-up, standing at the terracotta arch, seated, booti close-up
   (cut from the seated photo, 520px window, light denoise, no sharpening), then the reel (nilofer-reel.mp4, made by
   _tools/enhance-reel-merge-slow.sh: clip 1 from 5 s, clip 2 from 2 s for 3 s slowed to half speed and heavily stabilised, blur join).
   Photos are 1024x1536 chat copies, upscaled to 1600x2400: ask for the full-size files. Then run set-feature-crops.cjs, make-detail-circles.mjs, make-slide-cuts.mjs. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'nilofer');
const img = (n, alt, extra = {}) => ({ src: `/assets/images/nilofer-n${n}.jpg`, width: 1600, height: 2400, real: true, alt, ...extra });
const imgs = [
  img(5, 'Nilofer — close up of the lilac zari trees, the red brocade blouse and a pink tasselled parandi', { fit: 'cover' }),
  img(2, 'Nilofer — a lilac Banarasi saree with zari trees, worn standing in a terracotta arch with a red brocade blouse'),
  img(3, 'Nilofer — seated, the lilac silk with woven zari trees falling over the lap', { fit: 'cover' }),
  { src: '/assets/images/nilofer-n4.jpg', width: 1320, height: 1760, real: true, role: 'product', fit: 'cover', alt: 'Nilofer — close up of the woven zari tree booti on lilac silk', source: 'Client photo (seated), 520px window, light denoise' },
];
p.images = [imgs[1], imgs[2], imgs[0], imgs[3]]; // full length, seated, close-up, booti (client, 23 Nov 2026)
p.galleryListed = true;
const c = (img, s, ox, oy, op) => ({ img, s, ox, oy, op });
p.crops = {
  silhouette: { img: 0 },
  fall: c(0, 1.5, '86%', '100%', '50% 100%'),
  pallu: c(2, 1.2, '50%', '50%', '50% 50%'),
  border: c(0, 2, '66%', '100%', '50% 100%'),
  weave: c(1, 1.8, '50%', '85%', '50% 100%'),
  borderDetail: c(2, 2, '14%', '40%', '50% 50%'),
  motif: c(3, 1, '50%', '50%', '50% 50%'),
  colour: c(0, 1.5, '86%', '88%', '50% 100%'),
  swatch: c(3, 1, '50%', '50%', '50% 50%'),
  styling: c(1, 1.6, '50%', '25%', '50% 0%'),
};
p.video = { src: '/assets/video/nilofer-reel.mp4', srcSmall: '/assets/video/nilofer-reel-small.mp4', poster: '/assets/images/nilofer-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/nilofer/nilfer (1).MP4 from 5 s + nilfer (2).MP4 2 s-5 s slowed to half speed and heavily stabilised, merged with a blur transition; enhanced by _tools/enhance-reel-merge-slow.sh, 23 Nov 2026; no sound'] };
delete p.slideCuts; delete p.detailCircles;
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('ok', Object.keys(p).filter((k) => /slide|detail/i.test(k)));
