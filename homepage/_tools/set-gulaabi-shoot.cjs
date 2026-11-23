/* Gulaabi PDP (client, 23 Nov 2026), in the client's order (all real photos sent in chat, 1024×1536, kept in
   model photography/Gulaabi shoot (sent in chat 23 Nov 2026)/):
     1 full length at the stained-glass door (gulaabi-full.png), shown whole
     2 the zari pallu border with red booti falling over the arm (gulaabi-border-photo.png)
     3 close-up: border at the shoulder, flower booti, yellow blouse (gulaabi-closeup.png)
     4 border zoom: the zari border with red booti, from photo 2 (crop 330×440 at x390 y560)
     5 booti zoom: teal, orange and red flower booti, from photo 3 (crop 360×480 at x360 y840)
     6 reel: gulabi.MP4 0–10 s (enhance-reel.sh, SMOOTH=15)
   Zooms: light nlmeans (s 1.5), spline scaling to 1600×2400 (photos: lanczos to 2000×3000), no sharpening. 1024px chat copies: ask for the full-size files.
   Then run set-feature-crops.cjs, make-detail-circles.mjs gulaabi, export-shopify.cjs. */
const fs = require('fs');
const KEEP = 'model photography/Gulaabi shoot (sent in chat 23 Nov 2026)';
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'gulaabi');
const photo = (n, src, alt, extra = {}) => ({ src: `/assets/images/${n}.jpg`, width: /zoom/.test(n) ? 1600 : 2000, height: /zoom/.test(n) ? 2400 : 3000, real: true, alt, source: `${KEEP}/${src}`, ...extra });
const zoom = { role: 'product', fit: 'cover', actual: true };
p.images = [
  photo('gulaabi-n1', 'gulaabi-full.png', 'Gulaabi, a blush-pink Banarasi saree with teal, coral and marigold flower booti and a gold zari pallu, worn full length at a stained-glass door'),
  photo('gulaabi-n2', 'gulaabi-border-photo.png', 'Gulaabi, the gold zari pallu border with red flower booti falling over the arm, on blush pink silk', { fit: 'cover' }),
  photo('gulaabi-n3', 'gulaabi-closeup.png', 'Gulaabi close up: the zari border at the shoulder and teal, coral and marigold flower booti, with the yellow blouse', { fit: 'cover' }),
  photo('gulaabi-border-zoom', 'gulaabi-border-photo.png (cropped x390 y560 330×440, spline 3.5×, light denoise)', 'Gulaabi border up close: a gold zari border with red booti on blush pink', zoom),
  photo('gulaabi-booti-zoom', 'gulaabi-closeup.png (cropped x360 y840 360×480, spline 3×, light denoise)', 'Gulaabi booti up close: teal, coral and marigold flower booti on blush pink', zoom),
];
p.galleryListed = true;
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/gulaabi-reel.mp4')) p.video = {
  src: '/assets/video/gulaabi-reel.mp4', srcSmall: '/assets/video/gulaabi-reel-small.mp4', poster: '/assets/images/gulaabi-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ['model photography/saree videos/saree model vids/gulabi/gulabi.MP4 0–10 s; enhanced by _tools/enhance-reel.sh (SMOOTH=15), 23 Nov 2026; no sound'],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video);
