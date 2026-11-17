// Removes folded-only (catalogue) PDPs whose saree already has a model PDP, so no saree appears twice.
// Run from homepage/ AFTER every add-*.cjs:  node _tools/dedupe-folded.cjs   (safe to re-run)
// The 25 Premium Semi-Silk model sarees (add-semi-silk.cjs) carry their SN on images[].sn too.
// Matching (Nov 16, by eye: colour, print and border compared photo against photo):
//   - the 24 November 16 sarees carry their SN number (images[].sn), checked against the Drive "Original Product Photos";
//   - older model sarees matched to a catalogue photo: Kajal = SN-002 black, Phalsa = SN-013 purple, Panna = SN-023
//     emerald, Kasni = SN-030 lavender, Mehendi = SN-034, Kamal = SN-005.
// Two model sarees were the same saree twice: Chaman = Moonga (SN-006) and Shabnam = Chameli (SN-032). Moonga and Chameli
// are linked from the homepage and header, so they stay; Chaman's / Shabnam's model photo and real Drive photos are
// moved into them and the old URLs redirect (aliases). Chameli's AI flat "product" shot is dropped (the real one replaces it).
// What moves from a removed catalogue entry to the model PDP: price, fabric, range, Silk Mark claim, catalogue row and
// description (as catalogueDescription), so the client's own facts are kept. Old URLs redirect via aliases.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const P = (slug) => d.products.find((p) => p.slug === slug);
const snOf = (img) => (img.src.match(/catalogue\/sn-(\d+)\.jpg/) || [])[1];
const catBySn = (sn) => d.products.find((p) => p.source === 'catalogue' && p.images.some((i) => snOf(i) === sn));
const addAlias = (p, slug, colour) => { p.aliases = (p.aliases || []).filter((a) => a.slug !== slug); p.aliases.push(colour ? { slug, colour } : { slug }); };
const log = [];

// 1. Model + model duplicates: merge Chaman → Moonga, Shabnam → Chameli.
for (const [keep, drop] of [['moonga', 'chaman'], ['chameli', 'shabnam']]) {
  const k = P(keep), x = P(drop); if (!k || !x) continue;
  const fromDrop = x.images.map((i) => ({ ...i }));
  // drop the AI flat shot (<keep>-product.jpg) and anything already merged, then add the model photo + 3 originals
  k.images = [...k.images.filter((i) => !i.src.includes(`/${keep}-product`) && !i.src.includes(`/${drop}`)), ...fromDrop];
  k.galleryListed = true;
  for (const a of x.aliases || []) addAlias(k, a.slug, a.colour);
  addAlias(k, drop);
  k.categories = [...new Set([...(k.categories || []), ...(x.categories || [])])];
  if (x.categoryEvidence) k.categoryEvidence = { ...x.categoryEvidence, ...(k.categoryEvidence || {}) };
  d.products = d.products.filter((p) => p !== x);
  log.push(`merged ${drop} into ${keep} (${fromDrop.length} photos)`);
}

// 2. Which catalogue SN each model saree is.
const MAP = {}; // sn -> { slug, colour? }
for (const p of d.products) for (const i of p.images) if (i.sn) MAP[i.sn.slice(3)] = { slug: p.slug };
Object.assign(MAP, { '006': { slug: 'moonga' }, '032': { slug: 'chameli' }, '034': { slug: 'mehendi' }, '005': { slug: 'kamal' },
  '002': { slug: 'kajal', colour: 'black' }, '013': { slug: 'phalsa', colour: 'purple' }, '023': { slug: 'panna', colour: 'emerald' },
  '030': { slug: 'kasni', colour: 'lavender' } });
// Multi-colour catalogue entries: which colour the model saree is (by SN; shared photos need the colour named above).
const VARIANT_BY_SN = { '014': 'brown', '011': 'red', '045': 'rani-pink', '030': 'lavender',
  // Premium Semi-Silk (add-semi-silk.cjs): which colour of a multi-colour catalogue entry each model saree is
  '054': 'emerald', '061': 'rani-pink', '062': 'green', '064': 'coral', '068': 'royal-blue', '065': 'indigo', '066': 'emerald', '082': 'emerald',
  '071': 'pink', '072': 'green', '083': 'royal-blue' };

function carry(model, cat, variant) {
  const a = cat.attributes || {};
  // the catalogue price is the client's; it replaces a missing or placeholder price
  if (model.price == null || model.priceIsPlaceholder) { model.price = variant?.price ?? cat.price ?? null; model.priceIsPlaceholder = false; }
  model.attributes = { ...model.attributes, fabric: model.attributes?.fabric || a.fabric || null, ...(a.range ? { range: a.range } : {}), ...(a.silkMark ? { silkMark: a.silkMark } : {}) };
  model.catalogueRow = variant?.catalogueRow ?? cat.catalogueRow;
  if (cat.description) model.catalogueDescription = cat.description;
  for (const c of cat.categories || []) if (!(model.categories || []).includes(c)) model.categories = [...(model.categories || []), c];
}

for (const [sn, m] of Object.entries(MAP).sort()) {
  const cat = catBySn(sn); const model = P(m.slug);
  if (!cat || !model) continue;
  const colour = m.colour || VARIANT_BY_SN[sn];
  const vs = cat.variants || [];
  // a named colour must still be on the entry (already split off on an earlier run → nothing to do)
  if (colour && vs.length && !vs.some((x) => x.key === colour)) continue;
  if (vs.length > 1) {
    const v = vs.find((x) => x.key === colour);
    if (!v) { log.push(`!! SN-${sn}: ${cat.slug} has colours ${vs.map((x) => x.key)}; none is "${colour}" — left alone`); continue; }
    carry(model, cat, v);
    const rest = vs.filter((x) => x !== v);
    // drop the photo only if it belonged to this colour alone
    if (!v.imageShared) {
      const drop = v.imageIndex; cat.images = cat.images.filter((_, i) => i !== drop);
      for (const r of rest) if (r.imageIndex > drop) r.imageIndex -= 1;
    }
    cat.variants = rest;
    cat.colours = cat.colours.filter((c) => c.name !== v.name);
    for (const a of cat.aliases || []) if (a.colour === v.key) { addAlias(model, a.slug); }
    cat.aliases = (cat.aliases || []).filter((a) => a.colour !== v.key);
    if (cat.catalogueRows) cat.catalogueRows = [...new Set(rest.map((r) => r.catalogueRow))];
    const prices = rest.map((r) => r.price).filter((x) => x != null);
    if (prices.length) { cat.price = Math.min(...prices); cat.priceMax = Math.max(...prices); }
    if (rest.length === 1) {
      const only = rest[0]; cat.descriptor = `${only.name} ${(cat.attributes?.fabric || '').toLowerCase()}`.trim();
      cat.descriptor = cat.descriptor.charAt(0).toUpperCase() + cat.descriptor.slice(1);
    } else cat.descriptor = cat.descriptor.replace(/\d+ colours/, `${rest.length} colours`);
    (cat.review = cat.review || []).push(`The ${v.name.toLowerCase()} colour (catalogue row ${v.catalogueRow}) is now the ${model.name} PDP, which has model photographs.`);
    log.push(`SN-${sn}: removed colour ${v.key} from ${cat.slug} → ${model.slug}${v.imageShared ? ' (shared photo kept for the other colours)' : ''}`);
  } else {
    carry(model, cat, vs[0]);
    for (const a of cat.aliases || []) addAlias(model, a.slug);
    addAlias(model, cat.slug);
    d.products = d.products.filter((p) => p !== cat);
    log.push(`SN-${sn}: removed ${cat.slug} → ${model.slug}`);
  }
}

d._notes.dedupe = 'Folded-only catalogue PDPs whose saree has a model PDP were removed by _tools/dedupe-folded.cjs (Nov 16); price, fabric and catalogue description moved to the model PDP, old URLs redirect. Chaman was merged into Moonga and Shabnam into Chameli (same sarees).';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(log.join('\n')); console.log('products:', d.products.length);
