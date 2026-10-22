// Adds the client's saree categories (from their handwritten list) to products.json. Safe to re-run.
//   group  region  = a state's own saree tradition, shown as photo tiles on the homepage
//          mark    = certified sarees
//          more    = everything else in the shop
//   place  = the word set large on the tile until a photograph is supplied
//   image  = null until the client's photograph arrives: { src, width, height, alt, pos? }
// Order follows the client's list. Spellings tidied: "Pedna" → Pedana (the Kalamkari town in Andhra
// Pradesh), "Chandui" → Chanderi. Sarees join a category through product.categories (a list of slugs).
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const keep = Object.fromEntries((d.categories || []).map((c) => [c.slug, c.image])); // keep any photographs already added
const C = (slug, name, group, place, region) => ({ slug, name, group, place: place || null, region: region || null, image: keep[slug] ?? null });
d.categories = [
  C('banaras-ki-bunkari',      'Banaras ki Bunkari',        'region', 'Banaras',        'Uttar Pradesh'),
  C('kolkata-ki-kalakari',     'Kolkata ki Kalakari',       'region', 'Kolkata',        'West Bengal'),
  C('rajasthan-ki-rajshahi',   'Rajasthan ki Rajshahi',     'region', 'Rajasthan',      'Rajasthan'),
  C('gujarat-ki-garima',       'Gujarat ki Garima',         'region', 'Gujarat',        'Gujarat'),
  C('pedana-ki-kalamkari',     'Pedana ki Kalamkari',       'region', 'Pedana',         'Andhra Pradesh'),
  C('handloom-mark-sarees',    'Handloom Mark sarees',      'mark'),
  C('silk-mark-sarees',        'Silk Mark certified sarees','mark'),
  C('designer-fusion-sarees',  'Designer fusion sarees',    'more'),
  C('bihar-ki-bahar',          'Bihar ki Bahar',            'region', 'Bihar',          'Bihar'),
  C('madhya-pradesh-ki-chanderi', 'Madhya Pradesh ki Chanderi', 'region', 'Madhya Pradesh', 'Madhya Pradesh'),
  C('blouses',                 'Blouses',                   'more'),
  C('jewellery',               'Jewellery',                 'more'),
  C('others',                  'Others',                    'more'),
];
d._notes.categories = 'categories: the client\'s shop categories, in their order. Regional ones show as tiles on the homepage; image stays null until their photograph is supplied. Assign a saree with product.categories = ["banaras-ki-bunkari", …].';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(d.categories.length, 'categories:', d.categories.map((c) => c.group[0]).join(''));
