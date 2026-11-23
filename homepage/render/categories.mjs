// Shop by category: the homepage section (include:categories) and one page per category (/categories/<slug>).
// Everything comes from data.categories in products.json (_tools/set-categories.cjs). Categories are by craft
// (client, Nov 17 2026): Banarasi, Kalamkari, Bandhani, Block prints, Chanderi. A category with `parent` is a
// subcategory (Banarasi → Premium silk / Premium semi-silk), shown as links on its parent's page, not as a tile.
// A category without a photograph shows a plain panel; a category without sarees shows a short note, never a fake product.
import { page, productCard, esc, link } from './pdp.mjs';

const productsIn = (data, slug) => data.products.filter((p) => !p.unlisted && (p.categories || []).includes(slug)); // unlisted: colour variants shown only from their main saree's page (client, 23 Nov 2026)
const childrenOf = (data, slug) => (data.categories || []).filter((c) => c.parent === slug);

/* Old state-wise links (Banaras ki Bunkari …): where they go now, or null. */
export function categoryTarget(slug, data) {
  const c = (data.categories || []).find((x) => (x.formerly || []).includes(slug));
  if (c) return `/categories/${c.slug}`;
  return data.categoryRedirects?.[slug] || null;
}
export const oldCategorySlugs = (data) => [
  ...(data.categories || []).flatMap((c) => c.formerly || []),
  ...Object.keys(data.categoryRedirects || {}),
];

function tile(c) {
  const img = c.image;
  return `
          <li class="region-tile">
            <a class="region-tile__link" href="/categories/${esc(c.slug)}">
              <div class="region-tile__media${img ? '' : ' region-tile__media--empty'}">${img
                ? `<img src="${esc(img.src)}" alt="${esc(img.alt || c.name)}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async"${img.pos ? ` style="object-position:${esc(img.pos)}"` : ''}>`
                : `<span class="region-tile__place">Coming soon</span>`}
              </div>
              <span class="region-tile__name">${esc(c.name)}</span>
            </a>
          </li>`;
}

export function renderCategories(data) {
  const cats = data.categories || [];
  const crafts = cats.filter((c) => c.group === 'craft' && !c.parent);
  // Under the tiles: the certified categories only. Subcategories (Banarasi: Premium silk, Premium semi-silk) are not
  // listed on the homepage (client, Nov 2026); they stay as tabs on the Banarasi page and in the header menu.
  // The "more" categories (Designer fusion, Blouses, Jewellery, Others) keep their pages but are not listed here.
  const groups = [
    ['Certified', cats.filter((c) => c.group === 'mark')],
  ].filter(([, list]) => list.length);
  if (!crafts.length && !groups.length) return '';
  return `
    <section class="section regions" id="categories" aria-labelledby="regions-title">
      <div class="container">
        <header class="section-head regions__head" data-reveal>
          <div>
            <p class="eyebrow">Shop by category</p>
            <h2 class="t-h2" id="regions-title">Sarees by craft</h2>
          </div>
          ${link('All sarees', '/sarees')}
        </header>
        ${crafts.length ? `<ul class="regions__row" data-reveal>${crafts.map(tile).join('')}
        </ul>` : ''}
        ${groups.length ? `<div class="regions__more" data-reveal>${groups.map(([title, list]) => `
          <nav class="regions__group" aria-label="${esc(title)}">
            <p class="eyebrow">${esc(title)}</p>
            <ul>${list.map((c) => `<li><a href="/categories/${esc(c.slug)}">${esc(c.name)}</a></li>`).join('')}</ul>
          </nav>`).join('')}
        </div>` : ''}
      </div>
    </section>`;
}

export function renderCategory(data, slug) {
  const cats = data.categories || [];
  const c = cats.find((x) => x.slug === slug);
  if (!c) return null;
  const list = productsIn(data, slug);
  const parent = c.parent ? cats.find((x) => x.slug === c.parent) : null;
  const top = parent || c;
  const subs = childrenOf(data, top.slug);
  const title = parent ? `${parent.name} ${c.name.charAt(0).toLowerCase()}${c.name.slice(1)}` : c.name;
  // Parent and subcategory pages share one row of links: All Banarasi · Premium silk · Premium semi-silk
  // (the collection page's tab row: .collection__tabs in homepage.css)
  const pad2 = (n) => String(n).padStart(2, '0');
  const subnav = subs.length ? `
    <nav aria-label="${esc(top.name)}"><ul class="collection__tabs">${[top, ...subs].map((x) => `
      <li><a class="collection__tab${x.slug === slug ? ' is-current' : ''}" href="/categories/${esc(x.slug)}"${x.slug === slug ? ' aria-current="page"' : ''}>${esc(x === top ? `All ${top.name}` : x.name)} <span>${pad2(productsIn(data, x.slug).length)}</span></a></li>`).join('')}
    </ul></nav>` : '';
  return page({
    title: `${title} sarees | Stylissh Naari`,
    description: c.line ? `${title} sarees. ${c.line}` : `${title} sarees`,
    mainClass: 'collection',
    body: `
  <div class="container">
    <header class="collection__head">
      <p class="eyebrow">${parent ? `<a href="/categories/${esc(parent.slug)}">${esc(parent.name)}</a>` : 'Shop by category'}</p>
      <h1 class="t-h1">${esc(title)}</h1>${c.line ? `
      <p class="collection__intro">${esc(c.line)}</p>` : ''}
    </header>${subnav}
    ${list.length ? `<ul class="collection__grid">${list.map((p, i) => productCard(p, i)).join('')}
    </ul>` : `<div class="category-empty">
      <p>This collection is being put together. The first pieces will appear here soon.</p>
      ${link('See all sarees', '/sarees')}
    </div>`}
  </div>`,
  });
}
