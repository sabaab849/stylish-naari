// Border slide of the November 16 sarees = the WHOLE Drive shot that shows the border beside the print (client, Nov 16),
// shown uncut on the page ivory (fit: contain), made by _tools/originals-nov16.ps1. Megh (no Drive folder) has none.
// Run from homepage/ after originals-nov16.ps1:  node _tools/set-borders-nov16.cjs   (safe to re-run)
// Patches products.json in place, so the prices and merges done by dedupe-folded.cjs are kept.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const DRIVE = { kattha: '014 – 02', sosan: '001 – 03', khus: '036 – 03', haldi: '035 – 02', rani: '007 – 02', sawari: '003 – 03',
  taal: '021 – 03', shabnam: '032 – 02', mor: '008 – 02', palash: '027 – 03', mehfil: '045 – 02', mishri: '020 – 02', ambi: '012 – 03',
  bahaar: '026 – 03', shagun: '038 – 02', mangal: '011 – 03', aasmaan: '004 – 03', airavat: '033 – 02', shringaar: '028 – 02',
  firoza: '048 – 02', gulistan: '025 – 02', basant: '019 – 03', chaman: '006 – 02', moti: '010 – 03' };
const PRINT = { kattha: '014 – 03', sosan: '001 – 04', khus: '036 – 02', haldi: '035 – 03', rani: '007 – 04', sawari: '003 – 04',
  taal: '021 – 02', shabnam: '032 – 03', mor: '008 – 03', palash: '027 – 02', mehfil: '045 – 03', mishri: '020 – 03', ambi: '012 – 04',
  bahaar: '026 – 04', shagun: '038 – 03', mangal: '011 – 04', aasmaan: '004 – 04', airavat: '033 – 03', shringaar: '028 – 03',
  firoza: '048 – 03', gulistan: '025 – 03', basant: '019 – 04', chaman: '006 – 03', moti: '010 – 02' }; // whole shots (client: zoom out, see the print as a whole)
const size = (file) => { const b = fs.readFileSync(file); let i = 2; while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; } };
const MINE = new Set([...Object.keys(DRIVE), 'megh', 'moonga', 'chameli']); // only these (other sarees have their own -print/-border.jpg)
let n = 0;
for (const p of d.products) {
  if (!MINE.has(p.slug)) continue;
  const before = p.images.length;
  p.images = p.images.filter((im) => im.src !== '/assets/images/megh-border.jpg');
  if (p.images.length < before) { // Megh: border crops pointed at the removed photo → none
    for (const k of ['border', 'borderDetail']) delete p.crops[k];
    p.closer && (p.closer.items = p.closer.items); n++;
  }
  for (const im of p.images) {
    const m = im.src.match(/\/assets\/images\/([a-z]+)-(border|print|original)\.jpg$/); if (!m || !im.sn) continue;
    { const [w, h] = size(`assets${im.src.slice(7)}`); im.width = w; im.height = h; } // turned upright by originals-nov16.ps1
    const [, slug, kind] = m;
    if (kind === 'print') { Object.assign(im, { fit: 'contain', bg: '#F6F1EA' }); if (PRINT[slug]) im.source = `Drive: Original Product Photos - Pendrive / SN-${PRINT[slug]} (whole)`; }
    if (kind !== 'border' || !DRIVE[slug]) continue;
    const [w, h] = size(`assets${im.src.slice(7)}`);
    Object.assign(im, { width: w, height: h, fit: 'contain', bg: '#F6F1EA', source: `Drive: Original Product Photos - Pendrive / SN-${DRIVE[slug]} (whole)` });
    im.alt = im.alt.replace(/^(\S+) up close: /, '$1: the border beside the print, ');
    n++;
  }
  // crops that cut a circle or card detail from the border photo: aim at its border edge, gently
  for (const k of ['border', 'borderDetail']) {
    const c = p.crops?.[k]; const im = c && p.images[c.img ?? 0];
    if (im && /-border\.jpg$/.test(im.src) && im.sn) p.crops[k] = { img: c.img, s: k === 'border' ? 1.6 : 1.8, ox: '30%', oy: '50%' };
  }
}
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n'); console.log('updated', n);
