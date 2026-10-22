// Shop by category: the homepage section (include:categories) and one page per category (/categories/<slug>).
// Everything comes from data.categories in products.json. A category without a photograph shows its place
// name on a plain panel; a category without sarees shows a short note, never a fake product.
import { page, productCard, esc, link } from './pdp.mjs';

const productsIn = (data, slug) => data.products.filter((p) => (p.categories || []).includes(slug));

function tile(c) {
  const img = c.image;
  return `
          <li class="region-tile">
            <a class="region-tile__link" href="/categories/${esc(c.slug)}">
              <div class="region-tile__media${img ? '' : ' region-tile__media--empty'}">${img
                ? `<img src="${esc(img.src)}" alt="${esc(img.alt || c.name)}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async"${img.pos ? ` style="object-position:${esc(img.pos)}"` : ''}>`
                : ''}
              </div>
              <span class="region-tile__name">${esc(c.name)}</span>
            </a>
          </li>`;
}

export function renderCategories(data) {
  const cats = data.categories || [];
  const regions = cats.filter((c) => c.group === 'region');
  // The "more" categories (Designer fusion, Blouses, Jewellery, Others) keep their pages but are not
  // listed in this homepage section.
  const groups = [
    ['Certified', cats.filter((c) => c.group === 'mark')],
  ].filter(([, list]) => list.length);
  if (!regions.length && !groups.length) return '';
  return `
    <section class="section regions" id="categories" aria-labelledby="regions-title">
      <div class="container">
        <header class="section-head regions__head" data-reveal>
          <div>
            <p class="eyebrow">Shop by region</p>
            <h2 class="t-h2" id="regions-title">Sarees from across India</h2>
          </div>
          ${link('All sarees', '/sarees')}
        </header>
        ${regions.length ? `<ul class="regions__row" data-reveal>${regions.map(tile).join('')}
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
  const c = (data.categories || []).find((x) => x.slug === slug);
  if (!c) return null;
  const list = productsIn(data, slug);
  return page({
    title: `${c.name} | Stylish Naari`,
    description: c.region ? `${c.name}: sarees from ${c.region}.` : c.name,
    mainClass: 'collection',
    body: `
  <div class="container">
    <header class="collection__head">
      <p class="eyebrow">${c.group === 'region' ? `Shop by region${c.region ? ` · ${esc(c.region)}` : ''}` : 'Shop by category'}</p>
      <h1 class="t-h1">${esc(c.name)}</h1>
    </header>
    ${list.length ? `<ul class="collection__grid">${list.map((p, i) => productCard(p, i)).join('')}
    </ul>` : `<div class="category-empty">
      <p>This collection is being put together. The first pieces will appear here soon.</p>
      ${link('See all sarees', '/sarees')}
    </div>`}
  </div>`,
  });
}
