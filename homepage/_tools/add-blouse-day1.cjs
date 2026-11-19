// Blouse piece photos from the pendrive shoot "day1" (client, 19 Nov 2026), converted by _tools/blouse-day1.ps1, which also
// writes _tools/blouse-day1.json (slug, Drive source, size). Same treatment as add-blouse.cjs (the "2day" sarees): the photo
// becomes the last gallery slide (role "blouse", caption "Blouse piece, actual product photograph") and the details row
// "Blouse piece" is set. Safe to re-run. Run from homepage/: node _tools/add-blouse-day1.cjs
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'assets', 'data', 'products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'blouse-day1.json'), 'utf8').replace(/^﻿/, ''));

for (const { slug, source, width, height } of list) {
  const p = data.products.find((x) => x.slug === slug);
  if (!p) { console.log('missing product', slug); continue; }
  const src = `/assets/images/${slug}-blouse.jpg`;
  p.images = p.images.filter((im) => im.src !== src);
  p.images.push({
    src, width, height, role: 'blouse', fit: 'cover', actual: true,
    alt: `${p.name}: the blouse piece`,
    source: `Drive: 01 – Banarasi / ${source}`,
  });
  p.attributes = p.attributes || {};
  p.attributes.blousePiece = 'Included, unstitched (pictured)';
  console.log('blouse added', slug);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('products with a blouse piece:', data.products.filter((p) => p.images.some((i) => i.role === 'blouse')).length);
