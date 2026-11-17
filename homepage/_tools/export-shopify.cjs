// Exports every saree in products.json to Shopify's product import CSV, plus the files needed around it.
// Run from homepage/: node _tools/export-shopify.cjs      → homepage/shopify/import/
//   products.csv      Shopify Admin → Products → Import (one row per product + one row per extra photo)
//   redirects.csv     Shopify Admin → Content → Menus → URL redirects → Import (old links → new)
//   collections.csv   the smart collections to create, one per category / edit (rule: product tag equals …)
//   prices-needed.csv the sarees imported as Draft because they have no confirmed price yet; fill price in
//                     products.json and re-run, or set it in Shopify and publish
// See homepage/shopify/README.md for the order to do things in.
//
// Rules (client, Nov 17 2026: all products, payment and checkout on Shopify):
//   Handle = the site's slug, so /products/<slug> is the same on the site and in Shopify, and the site's bag finds each
//            saree in Shopify by its handle at checkout (assets/js/bag.js).
//   Status = active only with a confirmed price; no price or a placeholder price (priceIsPlaceholder) → draft, price 0.
//   Photos = the PDP gallery's photographs in gallery order, as public URLs on store.shopify.siteUrl (the deployed site:
//            push and deploy first so new photos exist there). Crops and close-ups cut by CSS are not files and are not
//            exported; Shopify shows the photos themselves.
//   Tags   = category:<slug>, edit:<key>, colour:<name>, new-arrival → smart collections (collections.csv).
//   SKU    = the catalogue's SN number when the saree has one (SN-002), else SN-<SLUG>.
//   Inventory is not tracked (no stock numbers have been supplied); weight 0 (shipping is free across India).
const fs = require('fs'); const path = require('path');
const d = JSON.parse(fs.readFileSync('assets/data/products.json', 'utf8'));
const cfg = d.store.shopify || {};
const SITE = (cfg.siteUrl || '').replace(/\/$/, '');
const OUT = path.join('shopify', 'import');
fs.mkdirSync(OUT, { recursive: true });

const csv = (rows) => rows.map((r) => r.map((v) => {
  const s = v == null ? '' : String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}).join(',')).join('\r\n') + '\r\n';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const catName = Object.fromEntries((d.categories || []).map((c) => [c.slug, c]));
const firstSentence = (s) => { const m = String(s || '').match(/^.*?[.!?](\s|$)/); return (m ? m[0] : String(s || '')).trim(); };
const clip = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

// gallery order, as render/pdp.mjs builds it (portraits, folded originals, details, close-ups, product shots)
function photos(p) {
  const shown = p.images.filter((im) => im.gallery !== false && im.src && !/\.mp4$/i.test(im.src));
  if (p.galleryListed) return shown;
  const portraits = shown.filter((im) => !im.role);
  const early = shown.filter((im) => im.role === 'product' && im.second);
  const details = shown.filter((im) => im.role === 'detail');
  const closeups = shown.filter((im) => im.role && !['detail', 'product'].includes(im.role));
  const products = shown.filter((im) => im.role === 'product' && !im.second);
  return [...portraits, ...early, ...details, ...closeups, ...products];
}

function body(p) {
  const a = p.attributes || {};
  const rows = [
    ['Colour', p.colours?.map((c) => c.name).join(', ')], ['Details', p.catalogueDescription],
    ['Fabric', a.fabric], ['Border', a.border], ['Motif', a.motif], ['Weave', a.weave],
    ['Length', a.length], ['Blouse piece', a.blousePiece], ['Origin', a.origin],
  ].filter(([, v]) => v);
  return [
    p.description ? `<p>${esc(p.description)}</p>` : '',
    rows.length ? `<ul>${rows.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join('')}</ul>` : '',
    p.styling ? `<p><em>${esc(p.styling)}</em></p>` : '',
  ].join('');
}

const HEAD = ['Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Policy',
  'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable',
  'Variant Weight Unit', 'Image Src', 'Image Position', 'Image Alt Text', 'SEO Title', 'SEO Description', 'Status',
  'Name meaning (product.metafields.custom.name_meaning)', 'Colour line (product.metafields.custom.colour_line)',
  'Fabric (product.metafields.custom.fabric)', 'Border (product.metafields.custom.border)', 'Motif (product.metafields.custom.motif)'];
const rows = [HEAD]; const needPrice = [['Handle', 'Title', 'Descriptor', 'Current price on site', 'Why draft']];
const missingFiles = [];

for (const p of d.products) {
  const priced = p.price != null && !p.priceIsPlaceholder;
  if (!priced) needPrice.push([p.slug, p.name, p.descriptor, p.price ?? '', p.price == null ? 'No price supplied' : 'Placeholder price, not confirmed']);
  const sn = (JSON.stringify(p).match(/SN-(\d{3})/) || [])[1];
  const tags = [
    ...(p.categories || []).map((c) => `category:${c}`),
    ...(p.edits || []).map((e) => `edit:${e}`),
    ...(p.colours || []).map((c) => `colour:${c.name.toLowerCase()}`),
    ...(p.isNew ? ['new-arrival'] : []),
  ];
  const pics = photos(p);
  for (const im of pics) if (!fs.existsSync(path.join('.', im.src))) missingFiles.push(im.src);
  const crumb = (p.categories || []).map((c) => catName[c]).find((c) => c && !c.parent);
  const seoTitle = clip(`${p.name}, ${p.descriptor}${crumb ? ` | ${crumb.name.replace(/^Block prints$/, 'Block print')} saree` : ''}`, 70);
  const a = p.attributes || {};
  rows.push([
    p.slug, p.name, body(p), cfg.vendor || 'Stylish Naari', cfg.productType || 'Saree', tags.join(', '), priced ? 'TRUE' : 'FALSE',
    'Title', 'Default Title', sn ? `SN-${sn}` : `SN-${p.slug.toUpperCase()}`, 0, '', 'deny',
    'manual', priced ? Number(p.price).toFixed(2) : '0.00', '', 'TRUE', 'TRUE',
    'kg', pics[0] ? SITE + pics[0].src : '', pics[0] ? 1 : '', pics[0]?.alt || '', seoTitle, clip(firstSentence(p.description || p.descriptor), 160),
    priced ? 'active' : 'draft',
    p.nameMeaning || '', p.colourLine || '', a.fabric || '', a.border || '', a.motif || '',
  ]);
  pics.slice(1).forEach((im, i) => {
    const r = new Array(HEAD.length).fill('');
    r[0] = p.slug; r[HEAD.indexOf('Image Src')] = SITE + im.src; r[HEAD.indexOf('Image Position')] = i + 2; r[HEAD.indexOf('Image Alt Text')] = im.alt || '';
    rows.push(r);
  });
}

// Collections: one smart collection per category and per edit, plus New arrivals
const collections = [['Title', 'Handle', 'Rule (Product tag is equal to)', 'Description', 'Products now']];
const count = (tag) => d.products.filter((p) => {
  const t = [...(p.categories || []).map((c) => `category:${c}`), ...(p.edits || []).map((e) => `edit:${e}`), ...(p.isNew ? ['new-arrival'] : [])];
  return t.includes(tag);
}).length;
for (const c of d.categories || []) {
  if (c.group === 'more' || c.group === 'mark') continue;
  const parent = c.parent ? catName[c.parent] : null;
  const title = (parent ? `${parent.name} ${c.name.toLowerCase()}` : c.name).replace(/^Block prints$/, 'Block print');
  collections.push([`${title} sarees`, c.slug, `category:${c.slug}`, c.line || '', count(`category:${c.slug}`)]);
}
for (const [key, e] of Object.entries(d.edits || {})) collections.push([e.title, `edit-${key}`, `edit:${key}`, e.descriptor || '', count(`edit:${key}`)]);
collections.push(['New arrivals', 'new-arrivals', 'new-arrival', 'The newest sarees.', count('new-arrival')]);

// Redirects: merged sarees' old links, old state-wise category links, and site paths → Shopify paths
const redirects = [['Redirect from', 'Redirect to']];
for (const p of d.products) for (const a of p.aliases || []) redirects.push([`/products/${a.slug}`, `/products/${p.slug}`]);
for (const c of d.categories || []) {
  redirects.push([`/categories/${c.slug}`, `/collections/${c.slug}`]);
  for (const old of c.formerly || []) redirects.push([`/categories/${old}`, `/collections/${c.slug}`]);
}
for (const [old, to] of Object.entries(d.categoryRedirects || {})) redirects.push([`/categories/${old}`, to === '/sarees' ? '/collections/all' : to]);
redirects.push(['/sarees', '/collections/all']);
for (const key of Object.keys(d.edits || {})) redirects.push([`/edits/${key}`, `/collections/edit-${key}`]);
for (const [from, to] of [['/shipping', '/policies/shipping-policy'], ['/privacy', '/policies/privacy-policy'], ['/terms', '/policies/terms-of-service'], ['/exchanges', '/policies/refund-policy'], ['/faq', '/pages/faq'], ['/contact', '/pages/contact'], ['/care', '/pages/care'], ['/craft', '/pages/craft']]) redirects.push([from, to]);

fs.writeFileSync(path.join(OUT, 'products.csv'), '﻿' + csv(rows));
fs.writeFileSync(path.join(OUT, 'collections.csv'), '﻿' + csv(collections));
fs.writeFileSync(path.join(OUT, 'redirects.csv'), '﻿' + csv(redirects));
fs.writeFileSync(path.join(OUT, 'prices-needed.csv'), '﻿' + csv(needPrice));

const active = d.products.length - (needPrice.length - 1);
console.log(`${d.products.length} products → ${OUT}/products.csv (${rows.length - 1} rows: ${active} active, ${needPrice.length - 1} draft)`);
console.log(`${collections.length - 1} collections, ${redirects.length - 1} redirects; photos from ${SITE}`);
if (missingFiles.length) console.log('MISSING photo files:', missingFiles.join(', '));
