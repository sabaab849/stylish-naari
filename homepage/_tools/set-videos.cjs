// Adds a `video` (the saree in motion) to every product in _tools/saree-clips.json whose reel has been encoded
// (_tools/encode-clips.mjs). Same shape as Hariyali's: it becomes the last slide of the gallery and the
// "in motion" section further down the PDP (render/pdp.mjs). Safe to re-run. Run from homepage/: node _tools/set-videos.cjs
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const clips = JSON.parse(fs.readFileSync('_tools/saree-clips.json', 'utf8'));
const batches = [[clips.map, (n) => `Drive saree clips / ${n}.mp4`], [clips.map2 || {}, (n) => `Drive saree clips 2 / Sequence ${n}.mp4`]];
const done = [], missing = [];
for (const [map, label] of batches) for (const [slug, n] of Object.entries(map)) {
  const p = d.products.find((x) => x.slug === slug);
  if (!p) { missing.push(`${slug} (no product)`); continue; }
  if (!fs.existsSync(`assets/video/${slug}-reel.mp4`)) { missing.push(`${slug} (not encoded)`); continue; }
  p.video = {
    src: `/assets/video/${slug}-reel.mp4`, srcSmall: `/assets/video/${slug}-reel-small.mp4`,
    poster: `/assets/images/${slug}-reel-poster.jpg`, width: 720, height: 1280,
    sources: [label(n)],
  };
  done.push(slug);
}
d._notes.videos = 'Saree reels: products with a video from the Drive saree clips (_tools/saree-clips.json: map = first batch, 16 Nov; map2 = second batch, 18 Nov; encode-clips.mjs, set-videos.cjs), shown as the last gallery slide and the "in motion" section, like Hariyali.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('video set on', done.length, ':', done.join(', '));
if (missing.length) console.log('missing:', missing.join(', '));
