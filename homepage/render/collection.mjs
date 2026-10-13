// Collection pages (/sarees, /edits/<key>) and the homepage's data-driven parts.
// The prototype's equivalent of Shopify's collection template and a featured-collection section.
import { page, productCard, esc } from './pdp.mjs';

const pad2 = (n) => String(n).padStart(2, '0');

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
    <nav aria-label="Edits"><ul class="collection__tabs">${tabs}</ul></nav>
    <ul class="collection__grid">${list.map(productCard).join('')}
    </ul>
  </div>`,
  });
}

/* ─── Homepage: new arrivals row (include:new-arrivals) ───── */
export function renderNewArrivals(data) {
  const list = data.products.filter((p) => p.isNew);
  return (list.length ? list : data.products).map(productCard).join('');
}
