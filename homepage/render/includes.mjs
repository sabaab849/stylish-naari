// Shared by serve.mjs (local preview) and build.mjs (static export): reads the product data and
// fills the <!-- include:name --> markers, so both produce exactly the same pages.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderNewArrivals } from './collection.mjs';
import { renderCampaign } from './campaign.mjs';
import { renderTextureBanner } from './texture-banner.mjs';

export const root = fileURLToPath(new URL('..', import.meta.url));

// Read fresh on every call so edits show on refresh without restarting the preview server.
export const readData = () => JSON.parse(readFileSync(join(root, 'assets/data/products.json'), 'utf8'));

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

export const withIncludes = (html) =>
  html.replace(/<!-- include:([a-z-]+) -->/g, (m, name) => {
    try { return dataIncludes[name] ? dataIncludes[name]() : readFileSync(join(root, 'partials', `${name}.html`), 'utf8'); } catch { return m; }
  });
