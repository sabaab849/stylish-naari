// Local preview server for the Stylish Naari prototype.
// Run from this folder:  node serve.mjs   → http://localhost:4321
//
// Routes
//   /                    index.html
//   /products/<slug>     product page rendered from assets/data/products.json (render/pdp.mjs)
//   /sarees              every saree (render/collection.mjs)
//   /edits/<key>         the sarees in one edit
//   everything else      static files
//
// HTML responses get shared partials inserted: <!-- include:header --> → partials/header.html, etc.
// This stands in for Shopify's section rendering, so the header and footer exist in one place only.
import { createServer } from 'node:http';
import { createReadStream, statSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderProduct, renderNotFound } from './render/pdp.mjs';
import { renderCollection, renderNewArrivals } from './render/collection.mjs';
import { renderCampaign } from './render/campaign.mjs';
import { renderTextureBanner } from './render/texture-banner.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 4321;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.md': 'text/plain; charset=utf-8',
};

// Read fresh on every request so edits show on refresh without restarting.
const readData = () => JSON.parse(readFileSync(join(root, 'assets/data/products.json'), 'utf8'));
// Includes rendered from data rather than read from partials/ (Shopify: a section bound to a collection)
const dataIncludes = {
  'new-arrivals': () => renderNewArrivals(readData()),
  // The homepage campaign: one edit, shown through one saree's portrait, on the studio colour behind it
  campaign: () => renderCampaign(readData(), { edit: 'soft', product: 'kasni', position: '50% 42%' }),
  // The texture banner: Panna's close-up, edge to edge. Each position picks the band of the
  // portrait photo that the banner shows at that width (jaal on the left, zari border, paisleys on the right).
  texture: () => renderTextureBanner(readData(), {
    product: 'panna', image: 1, href: '/sarees',
    eyebrow: 'Texture first', title: 'An art of its own.', line: 'Every weave has a story.', cta: 'Discover the collection',
    position: '50% 74%', positionTablet: '50% 80%', positionMobile: '50% 100%',
  }),
};
const withIncludes = (html) =>
  html.replace(/<!-- include:([a-z-]+) -->/g, (m, name) => {
    try { return dataIncludes[name] ? dataIncludes[name]() : readFileSync(join(root, 'partials', `${name}.html`), 'utf8'); } catch { return m; }
  });
const sendHtml = (res, status, html) => {
  res.writeHead(status, { 'Content-Type': types['.html'], 'Cache-Control': 'no-cache' });
  res.end(withIncludes(html));
};

createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  // Product pages
  const product = urlPath.match(/^\/products\/([a-z0-9-]+)\/?$/);
  if (product) {
    try {
      const html = renderProduct(product[1], readData());
      sendHtml(res, html ? 200 : 404, html || renderNotFound());
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Product render failed: ' + err.message);
    }
    return;
  }

  // Collection pages
  const collection = urlPath.match(/^\/(?:sarees|edits\/([a-z0-9-]+))\/?$/);
  if (collection) {
    try {
      const html = renderCollection(readData(), collection[1] || null);
      sendHtml(res, html ? 200 : 404, html || renderNotFound());
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Collection render failed: ' + err.message);
    }
    return;
  }

  // Keep internal folders private
  if (/^\/(render|partials|_source-footage)\//.test(urlPath) || urlPath === '/serve.mjs') {
    sendHtml(res, 404, renderNotFound());
    return;
  }

  let file = normalize(join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  let stat;
  try { stat = statSync(file); if (stat.isDirectory()) { file = join(file, 'index.html'); stat = statSync(file); } }
  catch { sendHtml(res, 404, renderNotFound()); return; }

  const type = types[extname(file).toLowerCase()] || 'application/octet-stream';
  if (type === types['.html']) { sendHtml(res, 200, readFileSync(file, 'utf8')); return; }

  const range = req.headers.range;
  // Range requests let browsers seek and loop video properly
  if (range) {
    const [s, e] = range.replace('bytes=', '').split('-');
    const start = Number(s), end = e ? Number(e) : stat.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
  createReadStream(file).pipe(res);
}).on('error', (err) => {
  console.error(err.code === 'EADDRINUSE' ? `Port ${port} is busy. Try: PORT=4322 node serve.mjs` : err.message);
  process.exit(1);
}).listen(port, '::', () => console.log(`Stylish Naari → http://localhost:${port}`));
