/* Tota PDP (client, 23 Nov 2026), in the client's order (kept in model photography/Tota shoot (sent in chat 23 Nov 2026)/):
     1 full length under the flowered gazebo: a 2160×3840 video frame (tota-full-video-frame.jpg), cut to 2:3 from the bottom
       (crop 2160×3240 at y600: only vines above the head are lost), scaled to 2000×3000, shown whole
     2 at the blue shutter, hand to chin (tota-window.png, 1024×1536 camera photo, scaled to 2000×3000)
     3 close-up, smiling, shoulder border and booti (tota-closeup.png, same)
     4 booti zoom: the silver and gold zari booti, from photo 3 (crop 400×533 at x200 y800, light nlmeans, spline to 1600×2400, no sharpening)
     5 reel: tota.MP4 0.5 s–12 s (enhance-reel.sh, SMOOTH=15, highlight roll-off from 190, saturation untouched)
   Then run set-booti.cjs, set-feature-crops.cjs, make-detail-circles.mjs tota, make-slide-cuts.mjs tota, export-shopify.cjs. */
const fs = require('fs');
const KEEP = 'model photography/Tota shoot (sent in chat 23 Nov 2026)';
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const p = data.products.find((x) => x.slug === 'tota');
const photo = (name, src, alt, extra = {}) => ({ src: `/assets/images/${name}.jpg`, width: 2000, height: 3000, real: true, alt, source: `${KEEP}/${src}`, ...extra });
p.images = [
  photo('tota-n1', 'tota-full-video-frame.jpg (video frame, cut to 2:3 from the bottom)', 'Tota, a parrot-green Banarasi silk with silver and gold zari booti and a broad pallu showing temple and bridge scenes, worn full length in a flowered gazebo'),
  photo('tota-n2', 'tota-window.png', 'Tota worn at a navy shutter, hand to chin, the green silk with its scattered zari booti and gold border', { fit: 'cover' }),
  photo('tota-n3', 'tota-closeup.png', 'Tota close up, smiling: the gold floral border at the shoulder and silver and gold booti on parrot-green silk', { fit: 'cover' }),
  { src: '/assets/images/tota-booti-zoom.jpg', width: 1600, height: 2400, real: true, role: 'product', fit: 'cover', actual: true, alt: 'Tota booti up close: silver and gold zari flower sprigs on parrot-green silk',
    source: `${KEEP}/tota-closeup.png (cropped x200 y800 400×533, spline 4×, light denoise)` },
];
p.galleryListed = true;
p.crops = p.crops || {};
p.crops.styling = { img: 1, s: 1.3, ox: '50%', oy: '30%', op: '50% 20%' };
for (const c of Object.values(p.crops)) if (c && c.img != null && c.img > 3) c.img = 0;
delete p.detailCircles; delete p.slideCuts;
if (fs.existsSync('assets/video/tota-reel.mp4')) p.video = {
  src: '/assets/video/tota-reel.mp4', srcSmall: '/assets/video/tota-reel-small.mp4', poster: '/assets/images/tota-reel-poster.jpg', width: 1080, height: 1920, silent: true,
  sources: ["model photography/saree videos/saree model vids/tota/tota.MP4 0.5 s–12 s; enhanced by _tools/enhance-reel.sh (SMOOTH=15) with GRADE=\"lutyuv=y='if(gt(val\,190)\,190+(val-190)*0.6\,val)',eq=contrast=1.03:saturation=1.0,hqdn3d=1:1:2:2,unsharp=5:5:0.4:5:5:0\"; 23 Nov 2026; no sound"],
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(p.images.map((im, i) => `${i} ${im.src.split('/').pop()}`).join('\n'), '\nvideo:', !!p.video);
