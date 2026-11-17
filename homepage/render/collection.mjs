// Collection pages (/sarees, /edits/<key>) and the homepage's data-driven parts.
// The prototype's equivalent of Shopify's collection template and a featured-collection section.
import { page, productCard, esc, slugify, PRICE_BANDS, priceBand, fabricOf } from './pdp.mjs';

const pad2 = (n) => String(n).padStart(2, '0');

/* ─── Filter + sort bar ───────────────────────────────────────
   Every option is built from the sarees on the page: a colour, fabric, edit or price band only
   appears if at least one of them has it, with the number that do. shop.js does the filtering. */
function renderFilters(data, list, { withEdits }) {
  const tally = (values) => values.reduce((m, v) => m.set(v.value, { ...v, n: (m.get(v.value)?.n || 0) + 1 }), new Map());
  const option = (group, o, swatch = '') => `
              <li><label class="filter__option${o.n ? '' : ' is-empty'}"><input type="checkbox" name="${group}" value="${esc(o.value)}"${o.n ? '' : ' disabled'}>${swatch || '<span class="filter__box"></span>'}<span class="filter__name">${esc(o.label)}</span><span class="filter__n">${o.n ? pad2(o.n) : 'Soon'}</span></label></li>`;
  const group = (key, label, options, swatches = false) => (options.length < 2 ? '' : `
        <details class="filter" data-filter="${key}">
          <summary class="filter__summary">${label} <span class="filter__count" data-filter-count hidden></span></summary>
          <div class="filter__panel"><ul>${options.map((o) => option(key, o, swatches ? `<span class="filter__swatch" style="background:${esc(o.hex)}"></span>` : '')).join('')}
          </ul></div>
        </details>`);

  const colours = [...tally(list.filter((p) => p.colours[0]).map((p) => ({ value: slugify(p.colours[0].name), label: p.colours[0].name, hex: p.colours[0].hex }))).values()];
  // Fabric: the store's own list first (including fabrics with no sarees yet), then anything else on the page
  const found = [...tally(list.filter(fabricOf).map((p) => ({ value: slugify(fabricOf(p)), label: fabricOf(p) }))).values()];
  const declared = (data.store.filters?.fabrics || []).map((label) => ({ value: slugify(label), label, n: found.find((f) => f.value === slugify(label))?.n || 0 }));
  const fabrics = declared.concat(found.filter((f) => !declared.some((d) => d.value === f.value)));
  const edits = withEdits ? Object.entries(data.edits).map(([key, e]) => ({ value: key, label: e.title, n: list.filter((p) => p.edits.includes(key)).length })).filter((o) => o.n) : [];
  const bands = PRICE_BANDS.map(([value, label]) => ({ value, label })).concat({ value: 'to-be-confirmed', label: 'Price to be confirmed' })
    .map((o) => ({ ...o, n: list.filter((p) => priceBand(p) === o.value).length })).filter((o) => o.n);

  return `
    <section class="filters" data-filters aria-label="Filter and sort">
      <div class="filters__bar">
        <div class="filters__groups">${group('colour', 'Colour', colours, true)}${group('fabric', 'Fabric', fabrics)}${group('edit', 'Edit', edits)}${group('price-band', 'Price', bands)}
        </div>
        <label class="filters__sort">Sort by
          <select data-sort>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>
      <p class="filters__status"><span data-filter-result role="status" aria-live="polite">${list.length} sarees</span><button type="button" class="filters__clear" data-filter-clear hidden>Clear all</button></p>
    </section>`;
}

/* ─── Collection page ─────────────────────────────────────── */
export function renderCollection(data, editKey = null) {
  const edit = editKey ? data.edits[editKey] : null;
  if (editKey && !edit) return null;
  const list = edit ? data.products.filter((p) => p.edits.includes(editKey)) : data.products;
  const title = edit ? edit.title : 'All sarees';
  const intro = edit ? edit.descriptor : 'Every saree in the collection.';

  const tab = (href, label, count, current) =>
    `<li><a class="collection__tab${current ? ' is-current' : ''}" href="${href}"${current ? ' aria-current="page"' : ''}>${esc(label)} <span>${pad2(count)}</span></a></li>`;
  const tabs = [tab('/sarees', 'All sarees', data.products.length, !edit)]
    .concat(Object.entries(data.edits).map(([key, e]) =>
      tab(`/edits/${key}`, e.title, data.products.filter((p) => p.edits.includes(key)).length, key === editKey)))
    .join('');

  return page({
    title: `${title} | Stylish Naari`,
    description: intro,
    mainClass: 'collection',
    body: `
  <div class="container">
    <header class="collection__head">
      <p class="eyebrow">${edit ? 'Shop by edit' : 'The collection'}</p>
      <h1 class="t-h1">${esc(title)}</h1>
      <p class="collection__intro">${esc(intro)}</p>
    </header>
    <nav aria-label="Edits"><ul class="collection__tabs collection__tabs--filtered">${tabs}</ul></nav>${renderFilters(data, list, { withEdits: !edit })}
    <ul class="collection__grid" data-filter-grid>${list.map(productCard).join('')}
    </ul>
    <p class="collection__empty" data-filter-empty hidden>No sarees match these filters. <button type="button" class="filters__clear" data-filter-reset>Clear all</button></p>
  </div>`,
  });
}

/* ─── Wishlist page (/wishlist) ───────────────────────────────
   The saved list lives in the visitor's browser, so the page carries a card for every saree and
   shop.js shows the saved ones. In the Shopify build this becomes the customer's saved list. */
export function renderWishlist(data) {
  return page({
    title: 'Wishlist | Stylish Naari',
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
  const list = data.products.filter((p) => p.isNew);
  // the homepage row carries no wishlist hearts: Quick add only
  return (list.length ? list : data.products).map((p, i) => productCard(p, i, { wishlist: false })).join('');
}
