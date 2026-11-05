// Static export of the prototype, for hosts that serve files (Vercel).
// Run from the repository root:  npm run build   → dist/
//
// Writes every page the preview server (serve.mjs) can render, using the same renderers:
//   dist/index.html              the homepage
//   dist/sarees.html             every saree
//   dist/wishlist.html           the saved list (filled in by shop.js)
//   dist/faq.html, shipping.html, returns.html, care.html, contact.html   help pages
//   dist/craft.html              the Craft page
//   dist/edits/<key>.html        one page per edit
//   dist/categories/<slug>.html  one page per shop category
//   dist/products/<slug>.html    one page per saree
//   dist/404.html                the not-found page
//   dist/assets/                 css, js, images, video, data
// vercel.json turns on clean URLs, so /products/kasni serves products/kasni.html.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderProduct, renderNotFound, aliasTarget } from './render/pdp.mjs';
import { renderCollection, renderWishlist } from './render/collection.mjs';
import { renderInfoPage, INFO_PAGES } from './render/info.mjs';
import { renderCraftPage } from './render/craft.mjs';
import { renderCategory } from './render/categories.mjs';
import { root, readData, withIncludes } from './render/includes.mjs';

const out = join(root, '..', 'dist');
const data = readData();
let pages = 0;

const write = (path, html) => {
  if (!html) throw new Error(`Nothing rendered for ${path}`);
  const page = withIncludes(html);
  const left = page.match(/<!-- include:[a-z-]+ -->/);
  if (left) throw new Error(`${path}: unresolved ${left[0]}`);
  const file = join(out, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  pages += 1;
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true });

// The homepage links its assets relatively; make them absolute so the page also works at any path
write('index.html', readFileSync(join(root, 'index.html'), 'utf8').replace(/(href|src|srcset|poster)="assets\//g, '$1="/assets/'));
write('sarees.html', renderCollection(data, null));
write('wishlist.html', renderWishlist(data));
for (const slug of Object.keys(INFO_PAGES)) write(`${slug}.html`, renderInfoPage(slug, data));
write('craft.html', renderCraftPage(data));
for (const key of Object.keys(data.edits)) write(`edits/${key}.html`, renderCollection(data, key));
for (const c of data.categories || []) write(`categories/${c.slug}.html`, renderCategory(data, c.slug));
for (const p of data.products) write(`products/${p.slug}.html`, renderProduct(p.slug, data));
// old links of sarees merged into one page with colours: a tiny page that forwards to the right colour
for (const p of data.products) for (const a of p.aliases || []) {
  const to = aliasTarget(a.slug, data);
  write(`products/${a.slug}.html`, `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(to)})</script><a href="${to}">Continue</a>`);
}
write('404.html', renderNotFound());

console.log(`Built ${pages} pages → dist/`);
