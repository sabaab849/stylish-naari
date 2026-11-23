/* Narangi (client, 23 Nov 2026): gallery = the client's three photos in order (full length at the red curtain, side profile, close-up),
   a booti close-up cut from the close-up photo (460px window, light denoise, no sharpening), then the reel (narangi-reel.mp4:
   narangi.MP4 1 s-9 s at half speed, heavily stabilised, enhanced: _tools/enhance-reel-slow.sh). Photos are 1024x1536 chat copies upscaled
   to 1600x2400: ask for the full-size files. Then run set-feature-crops.cjs, make-detail-circles.mjs, make-slide-cuts.mjs. */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'narangi');
const img = (n, alt, extra = {}) => ({ src: `/assets/images/narangi-n${n}.jpg`, width: 1600, height: 2400, real: true, alt, ...extra });
p.images = [
  img(1, 'Narangi — an orange Banarasi saree with a broad zari pallu and red brocade blouse, worn between red velvet curtains'),
  img(2, 'Narangi — in profile, the orange silk with its zari pallu and woven floral booti against damask wallpaper', { fit: 'cover' }),
  img(3, 'Narangi — close up of the zari pallu, the red brocade blouse and the woven floral booti', { fit: 'cover' }),
  { src: '/assets/images/narangi-n4.jpg', width: 1320, height: 1760, real: true, role: 'product', fit: 'cover', alt: 'Narangi — close up of the woven red and green floral booti on orange silk', source: 'Client photo (close-up), 460px window, light denoise' },
];
p.galleryListed = true;
const c = (img, s, ox, oy, op) => ({ img, s, ox, oy, op });
p.crops = {
  silhouette: { img: 0 },
  fall: c(0, 1.5, '50%', '100%', '50% 100%'),
  pallu: c(1, 1.4, '70%', '70%', '50% 60%'),
  border: c(2, 2, '30%', '40%', '50% 50%'),
  weave: c(2, 1.8, '55%', '85%', '50% 100%'),
  borderDetail: c(2, 2, '40%', '45%', '50% 50%'),
  motif: c(3, 1, '50%', '50%', '50% 50%'),
  colour: c(0, 1.5, '50%', '70%', '50% 100%'),
  swatch: c(3, 1, '50%', '50%', '50% 50%'),
  styling: c(1, 1.6, '50%', '25%', '50% 0%'),
};
p.video = { src: '/assets/video/narangi-reel.mp4', srcSmall: '/assets/video/narangi-reel-small.mp4', poster: '/assets/images/narangi-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/narangi/narangi.MP4 1 s-9 s, slowed to half speed and heavily stabilised; enhanced by _tools/enhance-reel-slow.sh, 23 Nov 2026; no sound'] };
delete p.slideCuts; delete p.detailCircles;
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('ok');
