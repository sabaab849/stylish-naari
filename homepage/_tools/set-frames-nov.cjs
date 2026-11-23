// Tighter 3:4 frames for the November sarees (Gulkand, Parinda, Elaichi), so the saree, not the backdrop, fills the
// gallery. Run from homepage/: node _tools/set-frames-nov.cjs   (safe to re-run)
// Rules (client, Nov 13): crop extra floor from the bottom, keep a little space above the head, never cut the saree.
// A frame is { x, y, w, h } as shares of the photo; on these 1024×1536 photos a 3:4 window has w = 1.125 × h.
// Measured by eye on a 5% grid: Parinda standing has floor from 0.92 down; Elaichi standing has door above 0.30.
// Gulkand standing already runs from just above the hair (0.167) to just under the hem (0.98), so it barely changes.
// silhouette = the "The drape" panel of the colour chapter, a zoom of the whole photo: the visible part starts at
// origin × (1 − 1/s), so s 1.15 with oy 80% shows 0.10–0.97 of the height.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const SET = {
  gulkand: { frames: { 0: { x: 0, y: 0.1111, w: 1, h: 0.8889 } }, silhouette: { img: 0, s: 1.1, ox: '50%', oy: '100%' } }, // real shoot, 20 Nov 2026
  parinda: {
    frames: {}, // 23 Nov 2026: the client's 2:3 photos are shown whole (set-parinda-shoot.cjs)
    silhouette: { img: 0, s: 1.15, ox: '25%', oy: '80%' },
  },
  elaichi: { frames: { 0: { x: 0, y: 0.1111, w: 1, h: 0.8889 } }, silhouette: { img: 0, s: 1.15, ox: '20%', oy: '100%' } },
};
for (const [slug, s] of Object.entries(SET)) {
  const p = d.products.find((x) => x.slug === slug);
  if (!p) { console.log('missing', slug); continue; }
  for (const [i, fr] of Object.entries(s.frames)) {
    const r = (fr.w * p.images[i].width) / (fr.h * p.images[i].height);
    if (Math.abs(r - 0.75) > 0.005 || fr.x + fr.w > 1.0001 || fr.y + fr.h > 1.0001) throw new Error(`${slug} ${i}: not a 3:4 window inside the photo`);
    p.images[i].frame = fr;
  }
  p.crops.silhouette = s.silhouette;
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('frames set');
