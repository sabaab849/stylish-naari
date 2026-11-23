// Collection pages (/sarees, /edits/<key>) and the homepage's data-driven parts.
// The prototype's equivalent of Shopify's collection template and a featured-collection section.
import { page, productCard, esc, slugify, PRICE_BANDS, priceBand, fabricOf } from './pdp.mjs';

const pad2 = (n) => String(n).padStart(2, '0');

/* ─── Filter sidebar + sort ───────────────────────────────────
   Every option is built from the sarees on the page: a colour, fabric, edit or price band only
   appears if at least one of them has it, with the number that do. shop.js does the filtering. */
function renderFilters(data, list, { withEdits }) {
  const tally = (values) => values.reduce((m, v) => m.set(v.value, { ...v, n: (m.get(v.value)?.n || 0) + 1 }), new Map());
  const option = (group, o, swatch = '') => `
              <li${o.sub ? ' class="filter__sub"' : ''}><label class="filter__option${o.n ? '' : ' is-empty'}"><input type="checkbox" name="${group}" value="${esc(o.value)}"${o.n ? '' : ' disabled'}>${swatch || '<span class="filter__box"></span>'}<span class="filter__name">${esc(o.label)}</span><span class="filter__n">${o.n ? pad2(o.n) : 'Soon'}</span></label></li>`;
  // Each category is its own collapsible section (native <details>) with a small chevron. Craft and Colour start open.
  const chevron = '<svg class="filter__chevron" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';
  const group = (key, label, options, swatches = false, open = false) => (options.length < 2 ? '' : `
          <details class="filter" data-filter="${key}"${open ? ' open' : ''}>
            <summary class="filter__summary"><span class="filter__label">${label} <span class="filter__count" data-filter-count hidden></span></span>${chevron}</summary>
            <div class="filter__panel"><ul>${options.map((o) => option(key, o, swatches ? `<span class="filter__swatch" style="background:${esc(o.hex)}"></span>` : '')).join('')}
            </ul></div>
          </details>`);

  const colours = [...tally(list.filter((p) => p.colours[0]).map((p) => ({ value: slugify(p.colours[0].name), label: p.colours[0].name, hex: p.colours[0].hex }))).values()];
  // Fabric: the store's own list first (including fabrics with no sarees yet), then anything else on the page
  const found = [...tally(list.filter(fabricOf).map((p) => ({ value: slugify(fabricOf(p)), label: fabricOf(p) }))).values()];
  const declared = (data.store.filters?.fabrics || []).map((label) => ({ value: slugify(label), label, n: found.find((f) => f.value === slugify(label))?.n || 0 }));
  const fabrics = declared.concat(found.filter((f) => !declared.some((d) => d.value === f.value)));
  const edits = withEdits ? Object.entries(data.edits).map(([key, e]) => ({ value: key, label: e.title, n: list.filter((p) => p.edits.includes(key)).length })).filter((o) => o.n) : [];
  // Craft: the shop-by-category crafts in their own order, each with its subcategories nested (indented) beneath it:
  // Banarasi → Premium semi-silk, Premium silk (semi-silk first: client, Nov 2026). Only crafts with sarees on this
  // page are listed. Ticking Banarasi shows every Banarasi saree; a subcategory narrows it.
  const cats = data.categories || [];
  const subsOf = (slug) => cats.filter((s) => s.parent === slug)
    .sort((a, b) => /semi/.test(b.slug) - /semi/.test(a.slug));
  const crafts = cats.filter((c) => c.group === 'craft' && !c.parent)
    .flatMap((c) => [c, ...subsOf(c.slug)])
    .map((c) => ({ value: c.slug, label: c.name, sub: !!c.parent, n: list.filter((p) => (p.categories || []).includes(c.slug)).length }))
    .filter((o) => o.n);
  const bands = PRICE_BANDS.map(([value, label]) => ({ value, label })).concat({ value: 'to-be-confirmed', label: 'Price to be confirmed' })
    .map((o) => ({ ...o, n: list.filter((p) => priceBand(p) === o.value).length })).filter((o) => o.n);

  // The sidebar (a slide-out drawer below 1024px) and the toolbar above the grid. shop.js runs both.
  const sidebar = `
    <div class="filters-overlay" data-filters-overlay></div>
    <aside class="filters" id="collection-filters" aria-labelledby="filters-title" data-filters-panel>
      <div class="filters__head">
        <h2 class="filters__title" id="filters-title">Filter</h2>
        <button type="button" class="filters__clear" data-filter-clear hidden>Clear all</button>
        <button class="icon-button filters__close" type="button" aria-label="Close filters" data-filters-close>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
        </button>
      </div>
      <div class="filters__body">${group('category', 'Craft', crafts, false, true)}${group('colour', 'Colour', colours, true, true)}${group('fabric', 'Fabric', fabrics)}${group('edit', 'Edit', edits)}${group('price-band', 'Price', bands)}
      </div>
      <div class="filters__foot">
        <button type="button" class="button button--filled filters__apply" data-filters-close data-filter-show>Show ${list.length} sarees</button>
      </div>
    </aside>`;
  const toolbar = `
      <div class="collection__toolbar">
        <button type="button" class="filters__toggle" aria-controls="collection-filters" aria-expanded="false" data-filters-open>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 6h14M6 10h8M8.5 14h3"/></svg>
          Filter <span class="filter__count" data-filter-total hidden></span>
        </button>
        <p class="filters__status"><span data-filter-result role="status" aria-live="polite">${list.length} sarees</span></p>
        <label class="filters__sort">Sort by
          <select data-sort>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>`;
  return { sidebar, toolbar };
}

/* ─── Collection page ─────────────────────────────────────── */
export function renderCollection(data, editKey = null) {
  const edit = editKey ? data.edits[editKey] : null;
  if (editKey && !edit) return null;
  const shown = data.products.filter((p) => !p.unlisted); // unlisted: colour variants shown only from their main saree's page (client, 23 Nov 2026)
  const list = edit ? shown.filter((p) => p.edits.includes(editKey)) : shown;
  const title = edit ? edit.title : 'All sarees';
  const intro = edit ? edit.descriptor : 'Every saree in the collection.';

  const tab = (href, label, count, current) =>
    `<li><a class="collection__tab${current ? ' is-current' : ''}" href="${href}"${current ? ' aria-current="page"' : ''}>${esc(label)} <span>${pad2(count)}</span></a></li>`;
  const tabs = [tab('/sarees', 'All sarees', data.products.length, !edit)]
    .concat(Object.entries(data.edits).map(([key, e]) =>
      tab(`/edits/${key}`, e.title, data.products.filter((p) => !p.unlisted && p.edits.includes(key)).length, key === editKey)))
    .join('');

  const filters = renderFilters(data, list, { withEdits: !edit });
  return page({
    title: `${title} | Stylissh Naari`,
    description: intro,
    mainClass: 'collection',
    body: `
  <div class="container">
    <header class="collection__head">
      <p class="eyebrow">${edit ? 'Shop by edit' : 'The collection'}</p>
      <h1 class="t-h1">${esc(title)}</h1>
      <p class="collection__intro">${esc(intro)}</p>
    </header>
    <nav aria-label="Edits"><ul class="collection__tabs collection__tabs--filtered">${tabs}</ul></nav>
    <div class="collection__layout" data-filters>${filters.sidebar}
      <div class="collection__main">${filters.toolbar}
        <ul class="collection__grid" data-filter-grid>${list.map(productCard).join('')}
        </ul>
        <p class="collection__empty" data-filter-empty hidden>No sarees match these filters. <button type="button" class="filters__clear" data-filter-reset>Clear all</button></p>
      </div>
    </div>
  </div>`,
  });
}

/* ─── Wishlist page (/wishlist) ───────────────────────────────
   The saved list lives in the visitor's browser, so the page carries a card for every saree and
   shop.js shows the saved ones. In the Shopify build this becomes the customer's saved list. */
export function renderWishlist(data) {
  return page({
    title: 'Wishlist | Stylissh Naari',
    description: 'The sarees you have saved.',
    mainClass: 'collection wishlist',
    body: `
  <div class="container">
    <header class="collection__head">
      <p class="eyebrow">Saved for later</p>
      <h1 class="t-h1">Wishlist</h1>
      <p class="collection__intro" data-wishlist-summary>The sarees you have saved.</p>
    </header>
    <ul class="collection__grid is-arranged wishlist__grid" data-wishlist-grid>${data.products.map(productCard).join('')}
    </ul>
    <div class="wishlist__empty" data-wishlist-empty hidden>
      <p>Nothing saved yet. Tap the heart on any saree to keep it here.</p>
      <a class="link" href="/sarees"><span class="link__label">See all sarees</span></a>
    </div>
    <noscript><p class="wishlist__empty">The wishlist needs JavaScript to show what you have saved.</p></noscript>
  </div>`,
  });
}

/* ─── Homepage: new arrivals row (include:new-arrivals) ───── */
export function renderNewArrivals(data) {
  // One card per print: of a colour-sibling set (products.json → colourSiblings) only the first colour is shown; the
  // others are a chip away on its PDP (client, 20 Nov 2026)
  const firstColour = (p) => !p.colourSiblings?.length || p.colourSiblings[0] === p.slug;
  const list = data.products.filter((p) => p.isNew && !p.unlisted && firstColour(p));
  // the homepage row carries no wishlist hearts: Quick add only
  return (list.length ? list : data.products).map((p, i) => productCard(p, i, { wishlist: false })).join('');
}
