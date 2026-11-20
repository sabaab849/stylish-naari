// Shared by serve.mjs (local preview) and build.mjs (static export): reads the product data and
// fills the <!-- include:name --> markers, so both produce exactly the same pages.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderNewArrivals } from './collection.mjs';
import { renderCategories } from './categories.mjs';
import { renderCampaign } from './campaign.mjs';
import { renderTextureBanner } from './texture-banner.mjs';

export const root = fileURLToPath(new URL('..', import.meta.url));

// Read fresh on every call so edits show on refresh without restarting the preview server.
export const readData = () => JSON.parse(readFileSync(join(root, 'assets/data/products.json'), 'utf8'));

// Includes rendered from data rather than read from partials/ (Shopify: a section bound to a collection)
const dataIncludes = {
  'new-arrivals': () => renderNewArrivals(readData()),
  // Shop by category: the saree categories by craft (data.categories); tiles fill in as photographs arrive
  categories: () => renderCategories(readData()),
  // The homepage campaign: one edit, shown through one saree's portrait, on the studio colour behind it
  campaign: () => renderCampaign(readData(), { edit: 'soft', product: 'kasni', position: '50% 42%' }),
  // The texture banner: Phalsa's close-up, edge to edge. From tablet up it uses a landscape file of
  // the same photograph (the cloth turned on its side, 2,391px wide) so the weave stays sharp at full
  // width; phones use the portrait original. The shade behind the words is Phalsa's plum, near black.
  texture: () => renderTextureBanner(readData(), {
    product: 'phalsa', image: 1, href: '/sarees',
    eyebrow: 'Texture first', title: 'An art of its own.', line: 'Every weave has a story.', cta: 'Discover the collection',
    wide: { src: '/assets/images/phalsa-texture-wide.jpg', width: 2391, height: 1594 },
    shade: '22, 9, 18',
    position: '50% 50%', positionTablet: '50% 50%', positionMobile: '50% 40%',
  }),
};

/* Heading case (client, 20 Nov 2026): every h1–h6 is set in Title Case, whatever the copy says. Applied to the
   finished page so headings from templates, JSON and info copy all follow one rule. Minor words stay lower case
   (never the first word); words that already carry a capital after their first letter (GSTIN, UPI) are left alone. */
const MINOR = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'of', 'in', 'on', 'at', 'to', 'by', 'as', 'vs', 'per']);
export function titleCase(text, first = true) {
  return text.replace(/&[#\w]+;|[^\s\-–—&]+/g, (w) => {
    if (w[0] === '&' && w.length > 1) return w;
    const i = w.search(/[A-Za-z]/);
    if (i < 0) return w;
    const core = w.slice(i).replace(/[^A-Za-z']+$/, '');
    const isFirst = first;
    first = false;
    if (/[A-Z]/.test(core.slice(1))) return w;
    if (!isFirst && MINOR.has(core.toLowerCase())) return w.slice(0, i) + core.toLowerCase() + w.slice(i + core.length);
    return w.slice(0, i) + core.charAt(0).toUpperCase() + w.slice(i + 1);
  });
}
const headingCase = (html) =>
  html.replace(/(<h[1-6]\b[^>]*>)([\s\S]*?)(<\/h[1-6]>)/g, (m, open, inner, close) => {
    let first = true;
    return open + inner.replace(/([^<]+)|(<[^>]*>)/g, (t, text) => {
      if (!text || !text.trim()) return t;
      const out = titleCase(text, first);
      first = false;
      return out;
    }) + close;
  });

export const withIncludes = (html) => headingCase(
  html.replace(/<!-- include:([a-z-]+) -->/g, (m, name) => {
    try { return dataIncludes[name] ? dataIncludes[name]() : readFileSync(join(root, 'partials', `${name}.html`), 'utf8'); } catch { return m; }
  }));
