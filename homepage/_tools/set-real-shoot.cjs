/* Real photoshoot photographs replace the AI main photo (client, 20 Nov 2026): Parinda, Bulbul, Kesar.
   images[0] becomes the real photo (images[].real: true → no "styled" caption, counts as a real photograph for the
   "In detail" circles). The crops that use image 0 are re-aimed at the new photo; fabric / border / motif circles are in
   set-feature-crops.cjs. Run from homepage/:  node _tools/set-real-shoot.cjs */
const fs = require('fs');
const file = 'assets/data/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const W = 1600, H = 2400, a = H / W;
const cl = (v, x, y) => Math.min(Math.max(v, x), y);
const crop = (fx, fy, s) => { // photo is 2:3, shown in a square: object-position + zoom centred on the focal point
  const wy = 1 / a, top = cl(fy - wy / 2, 0, 1 - wy);
  const by = (fy - top) / wy, o = (c) => Math.round(cl((c - 0.5 / s) / (1 - 1 / s), 0, 1) * 100) + '%';
  return { img: 0, s, ox: o(fx), oy: o(by), op: `50% ${Math.round((top / (1 - wy)) * 100)}%` };
};
const SHOOTS = {
  pista: { file: "pista-shoot.jpg", y: 0.05, alt: "Pista — a pistachio Banarasi saree with gold zari trellis and small silver flowers, worn standing on a palm-shaded veranda with a wide zari pallu", styling: "Shown with a coral blouse, an oxidised silver necklace and earrings, and a silver cuff.",
    styling_c: [.55, .27], pallu: [.78, .6], fall: [.5, .8], colour: [.6, .55] },
  gulnaar: { file: "gulnaar-shoot.jpg", y: 0.11, alt: "Gulnaar — a magenta saree with fine zari stripes and a border of embroidered roses, seen from behind against a white arched wall", styling: "Shown with a mustard blouse and long loose hair.",
    styling_c: [.6, .3], pallu: [.45, .75], fall: [.5, .9], colour: [.5, .65] },
  saawan: { file: "saawan-shoot.jpg", y: 0.11, alt: "Saawan — a teal saree with broad mottled stripes of moss green and rust and a gold-striped teal pallu, worn standing on white steps with the pallu in the wind", styling: "Shown with a sleeveless black blouse, a silver bird ring and a low ponytail.",
    styling_c: [.43, .36], pallu: [.7, .4], fall: [.4, .85], colour: [.4, .7] },
  neelambari: { file: "neelambari-shoot.jpg", y: 0.06, alt: "Neelambari — a purple saree with small gold elephants, a black border with gold roundels and a paisley pallu, worn standing against a blue wall", styling: "Shown with a brocade blouse, oxidised silver jhumkas, a gold cuff and loose curls.",
    styling_c: [.5, .28], pallu: [.7, .75], fall: [.55, .9], colour: [.55, .6] },
  parinda: { file: 'parinda-shoot.jpg', y: 0.09, alt: 'Parinda — a maroon Banarasi saree with silver zari parrots on flowering branches, worn standing between carved sandstone pillars, the pallu draped open',
    styling: [.6, .26], pallu: [.4, .5], fall: [.65, .85], colour: [.65, .65] },
  bulbul: { file: 'bulbul-shoot.jpg', y: 0.11, alt: 'Bulbul — a plum Banarasi saree with silver zari birds and flowering trees, worn seated on a tiled floor holding a pink lotus',
    styling: [.45, .33], pallu: [.78, .6], fall: [.6, .9], colour: [.5, .7] },
  kesar: { file: 'kesar-shoot.jpg', y: 0.07, alt: 'Kesar — a coral red Banarasi saree with silver zari booti and a scalloped floral pallu, worn standing in an arched alcove, the pallu held open',
    styling: [.4, .2], pallu: [.72, .55], fall: [.55, .9], colour: [.65, .4] },
};
for (const [slug, s] of Object.entries(SHOOTS)) {
  const p = data.products.find((x) => x.slug === slug);
  p.images[0] = { src: '/assets/images/' + s.file, width: W, height: H, real: true, alt: s.alt,
    frame: { x: 0, y: s.y, w: 1, h: Math.round((W * 4 / 3 / H) * 10000) / 10000 } };
  p.crops.silhouette = { img: 0 };
  p.crops.styling = crop(...(s.styling_c || s.styling), 1.8); if (s.styling_c) p.styling = s.styling; p.crops.pallu = crop(...s.pallu, 1.6);
  p.crops.fall = crop(...s.fall, 1.5); p.crops.colour = crop(...s.colour, 1.5);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log('real shoot photos set on', Object.keys(SHOOTS).join(', '));
