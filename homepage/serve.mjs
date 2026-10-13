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
import { renderProduct, renderNotFound } from './render/pdp.mjs';
import { renderCollection } from './render/collection.mjs';
import { root, readData, withIncludes } from './render/includes.mjs';

const port = Number(process.env.PORT) || 4321;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.md': 'text/plain; charset=utf-8',
};

// Product data and the <!-- include:name --> markers are handled in render/includes.mjs (shared with build.mjs).
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
