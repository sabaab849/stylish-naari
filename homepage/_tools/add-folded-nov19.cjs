// Real folded photos and reels for Neel and Kairi (client, Nov 19 2026). Gallery: model photo → folded saree (whole) →
// close-up of the pallu and border → the crops as before → the reel. Both photos are images[].second (straight after the
// model photo, render/pdp.mjs) with role "product" ("Actual product photograph").
// Photos: model photography/folded originals nov19/*.jpg (sent in chat) → assets/images/<slug>-original.jpg and
// <slug>-closeup.jpg, 1350×2400. Kairi's earlier folded photo (Drive IMG_7947) is replaced by the new one.
// Reels: model photography/saree videos/saree shoot/saree reels/"neel video.mp4", "kairi video.mp4" (4K HEVC, 4–5 s),
// encoded like the other reels (_tools/encode-clips.mjs settings): <slug>-reel.mp4 720×1280, -reel-small.mp4, -reel-poster.jpg.
// Then: node _tools/set-feature-crops.cjs (the "In detail" circles use image 2, the close-up). Run from homepage/.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const SAREES = {
  neel: {
    folded: 'Neel, folded: the saree itself, indigo fading to mint at one end, with silver zari lotus buti and a silver brocade pallu folded open',
    closeup: 'Neel up close: a silver zari lotus buti on indigo, the brocade pallu and its silver border',
  },
  kairi: {
    folded: 'Kairi, folded: the saree itself, rose pink with small zari buti, the chartreuse pallu folded open with its gold zari border',
    closeup: 'Kairi up close: rose pink with zari buti meeting the chartreuse pallu, its gold zari border and meenakari flowers',
  },
};
for (const [slug, a] of Object.entries(SAREES)) {
  const p = d.products.find((x) => x.slug === slug);
  const keep = p.images.filter((im) => !/-(original|closeup)\.jpg$/.test(im.src)); // model photo (and anything else) stay first
  p.images = [keep[0],
    { src: `/assets/images/${slug}-original.jpg`, width: 1350, height: 2400, role: 'product', fit: 'cover', second: true, alt: a.folded, source: `model photography/folded originals nov19/${slug} folded.jpg (sent in chat, November 19)` },
    { src: `/assets/images/${slug}-closeup.jpg`, width: 1350, height: 2400, role: 'product', fit: 'cover', second: true, alt: a.closeup, source: `model photography/folded originals nov19/${slug} closeup.jpg (sent in chat, November 19)` },
    ...keep.slice(1)];
  p.video = {
    src: `/assets/video/${slug}-reel.mp4`, srcSmall: `/assets/video/${slug}-reel-small.mp4`,
    poster: `/assets/images/${slug}-reel-poster.jpg`, width: 720, height: 1280,
    sources: [`model photography/saree videos/saree shoot/saree reels/${slug} video.mp4`],
  };
  console.log(slug, p.images.map((im) => im.src.split('/').pop()).join(' → '), '+ reel');
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
