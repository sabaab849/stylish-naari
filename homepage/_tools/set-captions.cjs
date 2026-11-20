// Gallery captions (client, Nov 16): AI model images say "Styled imagery for representation", real photos of the saree
// say "Actual product photograph" (render/pdp.mjs → isActual). This marks the two things the renderer can't infer:
//   photoshoot: true  — sarees from a real photoshoot: their model photos are real, so they read "Actual product photograph"
//   images[].actual   — real close-ups that are not product shots (Hariyali's "teal saree" photos)
// Run from homepage/: node _tools/set-captions.cjs   (safe to re-run; re-run after adding sarees)
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const PHOTOSHOOT = ['gulkand', 'hiran', 'kumkum', 'chandni', 'narangi', 'neelambari', 'gulaabi', 'pista', 'dariya', 'tota', 'saagar', 'nilam',
  'baingani', 'kamdhenu', 'gulnaar', 'saawan', 'gagan',
  // Block print sarees from a real photoshoot (WhatsApp IMG-2026… files, Nov 17): add-blockprint.cjs
  'chaand', 'champa', 'jaali', 'samandar', 'saras', 'shaam', 'rangrez', 'jugnu', 'patti', 'dhaara', 'sarson',
  // Real photoshoots found unflagged (client, 20 Nov 2026): the first Banarasi shoot (Kairi's model) and the terracotta-wall /
  // haveli shoot (Genda, Kesar, Nilofer, Alta, sent in chat; Parinda, Bulbul, Elaichi from the same shoot), close-ups included
  'kairi', 'jamun', 'neel', 'bagh', 'genda', 'kesar', 'nilofer', 'alta', 'parinda', 'bulbul', 'elaichi'];
const ACTUAL = ['/assets/images/hariyali-detail.jpg', '/assets/images/hariyali-border.jpg'];
for (const p of d.products) {
  if (PHOTOSHOOT.includes(p.slug)) p.photoshoot = true; else delete p.photoshoot;
  for (const im of p.images) if (ACTUAL.includes(im.src)) im.actual = true;
}
const missing = PHOTOSHOOT.filter((s) => !d.products.some((p) => p.slug === s));
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('photoshoot', PHOTOSHOOT.length - missing.length, missing.length ? 'missing ' + missing : '');
