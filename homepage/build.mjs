// Static export of the prototype, for hosts that serve files (Vercel).
// Run from the repository root:  npm run build   → dist/
//
// Writes every page the preview server (serve.mjs) can render, using the same renderers:
//   dist/index.html              the homepage
//   dist/sarees.html             every saree
//   dist/edits/<key>.html        one page per edit
//   dist/products/<slug>.html    one page per saree
//   dist/404.html                the not-found page
//   dist/assets/                 css, js, images, video, data
// vercel.json turns on clean URLs, so /products/kasni serves products/kasni.html.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderProduct, renderNotFound } from './render/pdp.mjs';
import { renderCollection } from './render/collection.mjs';
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
for (const key of Object.keys(data.edits)) write(`edits/${key}.html`, renderCollection(data, key));
for (const p of data.products) write(`products/${p.slug}.html`, renderProduct(p.slug, data));
write('404.html', renderNotFound());

console.log(`Built ${pages} pages → dist/`);
