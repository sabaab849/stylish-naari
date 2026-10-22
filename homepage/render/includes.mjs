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
  // Shop by region: the client's saree categories (data.categories); tiles fill in as photographs arrive
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

export const withIncludes = (html) =>
  html.replace(/<!-- include:([a-z-]+) -->/g, (m, name) => {
    try { return dataIncludes[name] ? dataIncludes[name]() : readFileSync(join(root, 'partials', `${name}.html`), 'utf8'); } catch { return m; }
  });
