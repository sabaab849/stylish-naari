// Product detail page renderer — the prototype's equivalent of Shopify's product template.
// Each render* function is one reusable section; sections with no data return '' rather than placeholders.

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = (n) => String(n).padStart(2, '0');
export const formatPrice = (n) => (n == null ? '' : '₹ ' + Number(n).toLocaleString('en-IN'));

const arrow = '<span class="link__arrow" aria-hidden="true">→</span>';
export const link = (label, href = '#', extra = '') => `<a class="link${extra}" href="${esc(href)}"><span class="link__label">${esc(label)}</span>${arrow}</a>`;

/* Inline style for a product photo's focus crop (zoom + focal point), plus its object-position. */
const focusStyle = (img) => [img.focus ? `--s:${img.focus.s}; --ox:${img.focus.ox}; --oy:${img.focus.oy}` : '', img.pos ? `object-position:${img.pos}` : ''].filter(Boolean).join('; ');

/* An image cropped from a product photo. Mirrors a Shopify focal point + zoom. */
function cropImg(product, crop, { alt = '', loading = 'lazy', cls = '' } = {}) {
  const img = product.images[crop.img ?? 0];
  if (!img) return '';
  const style = [
    crop.s ? `--s:${crop.s}` : '',
    crop.ox ? `--ox:${crop.ox}` : '',
    crop.oy ? `--oy:${crop.oy}` : '',
    crop.op ? `object-position:${crop.op}` : '',
  ].filter(Boolean).join('; ');
  return `<img class="crop ${cls}" src="${esc(img.src)}" alt="${esc(alt)}" width="${img.width}" height="${img.height}" loading="${loading}" decoding="async"${style ? ` style="${style}"` : ''}>`;
}

/* ─── 01 Hero: gallery + sticky product information ───────── */
function renderGallery(p) {
  // Views: each photograph, then closer views of the fall, pallu and border cut from those photographs.
  // (These replaced the separate "On the body" section, so the rail has more than one or two images.)
  const cropStyle = (c) => [c.s ? `--s:${c.s}` : '', c.ox ? `--ox:${c.ox}` : '', c.oy ? `--oy:${c.oy}` : '', c.op ? `object-position:${c.op}` : ''].filter(Boolean).join('; ');
  const views = p.images.map((img) => ({ img, style: focusStyle(img), alt: img.alt }));
  // Closer views are cut from the fabric close-up photo where one exists (sharp, and never a cropped body).
  // Sarees with a single photo get two fabric-only close-ups from it. Zoom is capped so they stay sharp.
  const hasDetail = p.images.length > 1 && (p.crops?.motif?.img ?? 0) > 0;
  const extra = hasDetail ? [['motif', 'the motif'], ['borderDetail', 'the border']] : (p.images.length > 1 ? [] : [['border', 'the border'], ['swatch', 'the fabric']]);
  for (const [key, label] of extra) {
    const c = p.crops?.[key];
    const img = c && p.images[c.img ?? 0];
    if (img) views.push({ img, style: cropStyle({ ...c, s: Math.min(c.s ?? 1, 2.4) }), alt: `${p.name}: ${label}` });
  }
  const many = views.length > 1;
  const slides = views.map((v, i) => `
        <figure class="pdp-gallery__slide${i === 0 ? ' is-active' : ''}" data-gallery-slide aria-label="Image ${i + 1} of ${views.length}"${i ? ' aria-hidden="true"' : ''}>
          <img class="crop" src="${esc(v.img.src)}" alt="${esc(v.alt)}" width="${v.img.width}" height="${v.img.height}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" style="${esc(v.style)}">
        </figure>`).join('');
  // A rail of thumbnails beside the image, and a round arrow on each side of it
  const thumbs = many ? `
      <ul class="pdp-gallery__thumbs">${views.map((v, i) => `
        <li><button class="pdp-gallery__thumb${i === 0 ? ' is-active' : ''}" type="button" data-gallery-thumb aria-label="Show image ${i + 1} of ${views.length}"${i === 0 ? ' aria-current="true"' : ''}>
          <img class="crop" src="${esc(v.img.src)}" alt="" width="${v.img.width}" height="${v.img.height}" loading="lazy" decoding="async" style="${esc(v.style)}">
        </button></li>`).join('')}
      </ul>` : '';
  const chevron = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${d}"/></svg>`;
  const controls = many ? `
        <button class="pdp-gallery__btn pdp-gallery__btn--prev" type="button" data-gallery-prev aria-label="Previous image">${chevron('M14.5 6l-6 6 6 6')}</button>
        <button class="pdp-gallery__btn pdp-gallery__btn--next" type="button" data-gallery-next aria-label="Next image">${chevron('M9.5 6l6 6-6 6')}</button>` : '';
  return `
    <section class="pdp-gallery${many ? ' pdp-gallery--many' : ''}" aria-label="${esc(p.name)} images" data-gallery tabindex="-1">${thumbs}
      <div class="pdp-gallery__main">
        <div class="pdp-gallery__stage" data-gallery-track style="--ratio:4 / 5">${slides}
        </div>${controls}
      </div>
    </section>`;
}

function specRows(p) {
  const a = p.attributes;
  const colourNames = p.colours.map((c) => c.name).join(', ');
  return [
    ['Fabric', a.fabric],
    ['Colour', a.colourway || colourNames],
    ['Border', a.border],
    ['Motif', a.motif],
    ['Weave', a.weave],
    ['Length', a.length],
    ['Blouse piece', a.blousePiece],
    ['Origin', a.origin],
    ['Availability', a.availability],
  ].filter(([, v]) => v);
}

function renderInfo(p, data, index, total) {
  const edit = p.edits.map((k) => data.edits[k]).filter(Boolean)[0];
  const hasPrice = p.price != null;
  const meta = specRows(p).slice(0, 4).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  const button = hasPrice
    ? `<button class="button button--filled button--block" type="button" data-add-to-bag="${esc(p.slug)}" data-add-label="Add to bag">Add to bag</button>`
    : `<button class="button button--filled button--block" type="button" disabled>Add to bag</button>
          <p class="pdp-info__note">Price to be confirmed — this saree can’t be added to the bag yet.</p>`;
  return `
    <div class="pdp-info" data-pdp-info>
      ${edit ? `<p class="eyebrow">${esc(edit.title)}</p>` : ''}
      <h1 class="t-h1 pdp-info__name">${esc(p.name)}</h1>
      ${p.nameMeaning ? `<p class="pdp-info__meaning"><em class="serif">${esc(p.nameMeaning)}</em></p>` : ''}
      <p class="pdp-info__descriptor">${esc(p.descriptor)}</p>
      ${hasPrice ? `<p class="pdp-info__price" data-price>${formatPrice(p.price)}</p>` : ''}
      ${p.description ? `<p class="pdp-info__description">${esc(p.description)}</p>` : ''}
      <div class="pdp-info__actions" data-pdp-cta>
        ${button}
      </div>
      ${meta ? `<dl class="pdp-info__meta">${meta}</dl>` : ''}
      ${data.store.shipping ? `<p class="pdp-info__shipping">${esc(data.store.shipping)}</p>` : ''}
      ${renderSareeSwatch(p, index, total)}
    </div>`;
}

/* ─── 02 The Saree Swatch ─────────────────────────────────
   A textile specimen: an extreme close-up of the saree's own photo, then a band in its colour.
   It introduces the colour that the colour chapter later spreads across the whole screen.
   Reusable: everything comes from the product record (crops.swatch, colours, attributes). */
export function renderSareeSwatch(p, index, total) {
  const c = p.colours[0];
  if (!c) return '';
  const a = p.attributes;
  const crop = p.crops?.swatch || p.crops?.weave;
  const second = p.colours[1];
  const meta = [a.fabric, a.border].filter(Boolean).join(' · ');
  const alt = `Close-up of ${p.name}'s ${(a.fabric || 'fabric').toLowerCase()}${a.colourway ? `: ${a.colourway.toLowerCase()}` : ''}`;
  return `
    <figure class="saree-swatch" data-swatch
            style="--pc:${esc(c.hex)}; --pc-text:${esc(c.text)}${second ? `; --pc2:${esc(second.hex)}` : ''}">
      <div class="saree-swatch__fabric">
        ${crop ? cropImg(p, crop, { alt, cls: 'saree-swatch__img' }) : ''}
      </div>
      <figcaption class="saree-swatch__label${second ? ' saree-swatch__label--pair' : ''}">
        <span class="saree-swatch__row">
          <span class="saree-swatch__no">Saree ${pad2(index + 1)} / ${pad2(total)}</span>
          <span class="saree-swatch__hex">${esc(c.hex)}</span>
        </span>
        <span class="saree-swatch__name">${esc(c.name)}${second ? ` <em class="serif saree-swatch__pair">&amp; ${esc(second.name.toLowerCase())}</em>` : ''}</span>
        ${meta ? `<span class="saree-swatch__meta">${esc(meta)}</span>` : ''}
      </figcaption>
    </figure>`;
}
/* ─── 02b In detail — circular features ───────────────────
   Up to four circles, each a different crop of the saree's own photographs with a heading and one line.
   Every line is product data: colourway + fabric + weave, the border, the motif, and the styling
   visible in the portrait. A feature with no crop or no data is left out; fewer than two hides the section. */
const FEATURE_ZOOM_MAX = 3.6; // the first-shoot photos are ~1,100px wide; a deeper zoom goes soft in a circle
const pct = (v) => parseFloat(v ?? '50') / 100;
/* The crops in products.json were framed for portrait boxes (frame = height / width) and some zoom
   further than a circle can show sharply. This keeps the middle of each crop where it was authored
   while the zoom is capped and the box becomes a square. Crops with their own object-position
   (crops.styling) were framed for the circle and pass through. */
function circleCrop(p, crop, frame) {
  const img = p.images[crop.img ?? 0];
  const from = crop.s ?? 1;
  const s = Math.min(from, FEATURE_ZOOM_MAX);
  if (!img || crop.op || s <= 1) return { ...crop, s };
  const middle = (o) => o * (1 - 1 / from) + 0.5 / from; // centre of the authored view, 0…1 across its box
  const origin = (c) => Math.round(Math.min(Math.max((c - 0.5 / s) / (1 - 1 / s), 0), 1) * 100) + '%';
  const aspect = Math.max(img.height / img.width, 1);
  const seen = Math.min(frame / aspect, 1); // share of the photo's height the portrait box showed
  const y = (1 - seen) / 2 + seen * middle(pct(crop.oy)); // the same point, as a share of the photo's height
  return { ...crop, s, ox: origin(middle(pct(crop.ox))), oy: origin((y - (1 - 1 / aspect) / 2) * aspect) };
}
const sameSpot = (a, b) => a && b && (a.img ?? 0) === (b.img ?? 0) && Math.abs(pct(a.ox) - pct(b.ox)) < 0.12 && Math.abs(pct(a.oy) - pct(b.oy)) < 0.12;
function renderFeatures(p) {
  const a = p.attributes;
  const crops = p.crops || {};
  const sentence = (t) => (t && !/[.!?]$/.test(t) ? t + '.' : t);
  const cloth = [a.colourway || p.colours[0]?.name, a.fabric?.toLowerCase(), a.weave?.toLowerCase()].filter(Boolean).join(' ');
  const border = crops.borderDetail || crops.border;
  // The fabric circle never shows the same spot as the border or motif circle: it falls back to a wider crop
  const fabric = [crops.swatch, crops.colour, crops.weave].find((c) => c && !sameSpot(c, border) && !sameSpot(c, crops.motif));
  const items = [
    [fabric && circleCrop(p, fabric, 5 / 4), a.fabric || a.weave ? 'Fabric & colour' : 'Colour', cloth],
    [border && circleCrop(p, border, 4 / 3), 'The border', a.border],
    [crops.motif && circleCrop(p, crops.motif, 4 / 3), 'The motif', a.motif],
    [crops.styling && circleCrop(p, crops.styling), 'As styled', p.styling],
  ].filter(([crop, , text]) => crop && text);
  if (items.length < 2) return '';
  const features = items.map(([crop, title, text]) => `
        <li class="feature" data-reveal>
          <div class="media feature__media">${cropImg(p, crop, { alt: `${p.name}: ${title.toLowerCase()}` })}</div>
          <h3 class="feature__title">${esc(title)}</h3>
          <p class="feature__text">${esc(sentence(text))}</p>
        </li>`).join('');
  return `
  <section class="features section" aria-labelledby="features-title">
    <div class="container">
      <header class="features__head" data-reveal>
        <p class="eyebrow">In detail</p>
        <h2 class="t-h2" id="features-title">${esc(p.name)}, up close.</h2>
      </header>
      <ul class="features__grid features__grid--${items.length}">${features}
      </ul>
    </div>
  </section>`;
}
/* ─── 03 The drape study — only what the colour chapter doesn't show ─
   The chapter already shows the colour crop, the full silhouette and the weave, so this section
   covers how the saree falls: the fall, the pallu and the border. */
const DRAPE = [
  ['fall', 'The fall'],
  ['pallu', 'The pallu'],
  ['border', 'The border'],
];
function renderDrape(p) {
  const items = DRAPE.filter(([k]) => p.crops?.[k]);
  if (!items.length) return '';
  const figures = items.map(([k, label], i) => `
        <figure class="drape__item drape__item--${k}" data-reveal>
          <div class="media drape__media">${cropImg(p, p.crops[k], { alt: `${p.name}: ${label.toLowerCase()}` })}</div>
          <figcaption><span>${pad2(i + 1)}</span> / ${esc(label)}</figcaption>
        </figure>`).join('');
  return `
  <section class="drape section" aria-labelledby="drape-title" style="--pc:${esc(p.colours[0]?.hex)}">
    <div class="container">
      <header class="drape__head" data-reveal>
        <p class="eyebrow">On the body</p>
        <h2 class="t-h2" id="drape-title">The fall, the pallu, the border</h2>
      </header>
      <div class="drape__grid">${figures}
      </div>
    </div>
  </section>`;
}
/* ─── 04 Colour chapter — scroll-driven, pinned (pdp.js drives it) ─
   Three states: the colour → the drape → the weave. Each state's image is a crop from products.json;
   the copy comes only from product data. Without JS it renders as a static colour section (state 01). */
function renderColourChapter(p) {
  const c = p.colours[0];
  if (!c) return '';
  const a = p.attributes;
  const crops = p.crops || {};
  const states = [
    { key: 'colour', crop: crops.colour || crops.silhouette || { img: 0 }, eyebrow: 'The colour', title: c.name, copy: p.colourLine },
    { key: 'drape', crop: crops.silhouette || { img: 0 }, eyebrow: 'How it falls', title: 'The drape', copy: p.descriptor },
    { key: 'weave', crop: crops.weave || crops.zari || crops.borderDetail, eyebrow: 'Up close', title: 'The weave', copy: [a.border, a.motif].filter(Boolean).join(' · ') },
  ].filter((s) => s.crop);
  const layers = [...new Set(states.map((s) => s.crop.img ?? 0))];
  const imgs = layers.map((i, n) => {
    const img = p.images[i];
    return `<img class="chapter__img" data-chapter-img="${i}" src="${esc(img.src)}" alt="${n === 0 ? esc(img.alt) : ''}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async">`;
  }).join('\n            ');
  const chips = p.colours.map((x) => `<li><span class="chapter__chip" style="background:${esc(x.hex)}" aria-hidden="true"></span>${esc(x.name)} <span class="chapter__hex">${esc(x.hex)}</span></li>`).join('');
  const articles = states.map((s, i) => `
          <article class="chapter__state${i === 0 ? ' is-active' : ''}" data-chapter-state="${i}">
            <p class="eyebrow chapter__eyebrow">${esc(s.eyebrow)}</p>
            <${i === 0 ? 'h2 id="chapter-title"' : 'h3'} class="chapter__title" style="--chars:${s.title.length}">${esc(s.title)}</${i === 0 ? 'h2' : 'h3'}>
            ${s.copy ? `<p class="chapter__copy">${esc(s.copy)}</p>` : ''}
            ${i === 0 ? `<ul class="chapter__chips">${chips}</ul>` : ''}
          </article>`).join('');
  // Zoom is capped at 3×: the chapter frame is near full-screen and the source photos are ~1,100px wide.
  const stateData = states.map((s) => ({ img: s.crop.img ?? 0, s: Math.min(s.crop.s ?? 1, 3), ox: s.crop.ox ?? '50%', oy: s.crop.oy ?? '50%', op: s.crop.op ?? null }));
  return `
  <section class="chapter" aria-labelledby="chapter-title" data-chapter
           data-colour="${esc(c.hex)}"${p.colours[1] ? ` data-geo="${esc(p.colours[1].hex)}"` : ''}
           data-states='${esc(JSON.stringify(stateData))}'
           style="--pc:${esc(c.hex)}; --pc-text:${esc(c.text)}">
    <div class="chapter__sticky">
      <div class="chapter__bg" data-chapter-bg aria-hidden="true"></div>
      <div class="container chapter__inner" data-chapter-inner>
        <p class="chapter__count" aria-hidden="true"><span data-chapter-index>01</span> / ${pad2(states.length)}</p>
        <div class="chapter__visual">
          <span class="chapter__disc" data-chapter-disc aria-hidden="true"></span>
          <div class="chapter__frame" data-chapter-frame>
            ${imgs}
          </div>
        </div>
        <div class="chapter__states">${articles}
        </div>
      </div>
    </div>
  </section>`;
}
/* ─── 06 Product details ──────────────────────────────────── */
/* The photograph behind "The Saree, Unfolded": the saree's own picture, chosen per product in
   products.json (backdrop.img = which of its images, pos / posMobile = object-position, wide = an
   optional landscape file of the same saree for desktop). Without a backdrop it uses the last image. */
function backdropPicture(p) {
  const b = p.backdrop || {};
  const img = p.images[b.img ?? p.images.length - 1];
  if (!img) return '';
  const vars = [b.pos ? `--pos:${b.pos}` : '', b.posMobile ? `--pos-m:${b.posMobile}` : ''].filter(Boolean).join('; ');
  return `<picture>
        ${b.wide ? `<source media="(min-width: 768px)" srcset="${esc(b.wide.src)}" width="${b.wide.width}" height="${b.wide.height}">` : ''}
        <img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async"${vars ? ` style="${esc(vars)}"` : ''}>
      </picture>`;
}

/* "A closer look": one reusable section for every saree. The photograph, heading and attributes all come
   from that product's record (backdrop, closer); the fourth cell is the shipping accordion, filled from
   the store's policy data. Anything missing is left out rather than filled in. */
function renderDetails(p, data) {
  const a = p.attributes;
  const fallback = [['Colour', a.colourway || p.colours[0]?.name], ['Motif', a.motif], ['Border', a.border]];
  const items = (p.closer?.items || fallback).filter(([, v]) => v).slice(0, 3);
  const heading = p.closer?.heading || `${p.colours[0]?.name || p.name}, up close.`;
  const policies = [
    ['Shipping', p.shipping ?? data.store.shipping],
    ['Returns', p.returns ?? data.store.returns],
    ['Care', p.care ?? data.store.care],
  ].filter(([, v]) => v);
  if (!items.length && !policies.length) return '';
  return `
  <section class="unfolded" aria-labelledby="details-title" data-unfolded style="--pc:${esc(p.colours[0]?.hex || 'var(--color-ink)')}">
    <div class="unfolded__media" data-unfolded-media>
      ${backdropPicture(p)}
    </div>
    <div class="unfolded__scrim" aria-hidden="true"></div>
    <div class="container unfolded__inner">
      <header class="unfolded__head" data-reveal>
        <p class="eyebrow unfolded__eyebrow">A closer look</p>
        <h2 class="unfolded__title" id="details-title">${esc(heading)}</h2>
      </header>
      <div class="unfolded__body" data-reveal>
        <dl class="closer">${items.map(([k, v]) => `
          <div class="closer__item"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}${policies.length ? `
          <div class="closer__item closer__item--policy">
            <dt>Shipping</dt>
            <dd>
              <details class="closer__more">
                <summary>Shipping details</summary>
                <div class="closer__panel">${policies.map(([k, v]) => `
                  <p>${policies.length > 1 ? `<span>${esc(k)}</span> ` : ''}${esc(v)}</p>`).join('')}
                </div>
              </details>
            </dd>
          </div>` : ''}
        </dl>
      </div>
    </div>
  </section>`;
}
/* ─── 07 Style it — renders only when styling images exist ─ */
function renderStyleIt(p) {
  const looks = (p.looks || []).filter((l) => l && l.src);
  if (!looks.length) return '';
  return `
  <section class="style-it section" aria-labelledby="style-title">
    <div class="container">
      <header class="section-head" data-reveal><h2 class="t-h2" id="style-title">Style it</h2></header>
      <div class="style-it__grid style-it__grid--${Math.min(looks.length, 3)}">${looks.map((l) => `
        <figure class="style-it__look" data-reveal>
          <div class="media media--3-4"><img src="${esc(l.src)}" alt="${esc(l.alt || '')}" loading="lazy" decoding="async"></div>
          ${l.label ? `<figcaption>${esc(l.label)}</figcaption>` : ''}
        </figure>`).join('')}
      </div>
    </div>
  </section>`;
}

/* ─── 08 Complete the story / From the edit ───────────────── */
export function productCard(p) {
  const main = p.images[0];
  const detail = p.crops?.border;
  return `
          <li class="product-card" data-reveal>
            <a href="/products/${esc(p.slug)}" class="product-card__link">
              <div class="media media--3-4 product-card__media">
                <img class="product-card__img crop" src="${esc(main.src)}" alt="${esc(main.alt)}" width="${main.width}" height="${main.height}" loading="lazy" decoding="async" style="${esc(focusStyle(main))}">
                ${detail ? cropImg(p, detail, { cls: 'product-card__detail' }) : ''}
              </div>
              <h3 class="product-card__title">${esc(p.name)}</h3>
              <p class="product-card__descriptor">${esc(p.descriptor)}</p>
              ${p.price != null ? `<p class="product-card__price">${formatPrice(p.price)}</p>` : ''}
            </a>
          </li>`;
}

function renderRelated(p, data) {
  const others = data.products.filter((x) => x.slug !== p.slug);
  // Prefer sarees that share an edit; fall back to the rest of the collection.
  const sharedKey = p.edits.find((k) => others.some((x) => x.edits.includes(k)));
  const shared = sharedKey ? others.filter((x) => x.edits.includes(sharedKey)) : [];
  const list = (shared.length ? shared : others).slice(0, 3);
  if (!list.length) return '';
  const title = shared.length ? `From ${data.edits[sharedKey].title.replace(/^The /, 'the ')}` : 'Complete the story';
  return `
  <section class="section related" aria-labelledby="related-title">
    <div class="container">
      <header class="section-head" data-reveal>
        <h2 class="t-h2" id="related-title">${esc(title)}</h2>
        ${link(shared.length ? 'Shop the edit' : 'View all', shared.length ? `/edits/${sharedKey}` : '/sarees')}
      </header>
      <ul class="product-row" data-product-row>${list.map(productCard).join('')}
      </ul>
      <div class="row-progress" aria-hidden="true"><span data-row-progress></span></div>
    </div>
  </section>`;
}

/* ─── Mobile buy bar ──────────────────────────────────────── */
function renderBuyBar(p) {
  if (p.price == null) return '';
  return `
  <div class="pdp-buybar" data-buybar aria-hidden="true">
    <div class="pdp-buybar__info"><span class="pdp-buybar__name">${esc(p.name)}</span><span class="pdp-buybar__price">${formatPrice(p.price)}</span></div>
    <button class="button button--filled" type="button" data-add-to-bag="${esc(p.slug)}" data-add-label="Add to bag" tabindex="-1">Add to bag</button>
  </div>`;
}

/* ─── Page ────────────────────────────────────────────────── */
export function page({ title, description, body, preload = '', ogImage = '', mainClass = 'pdp' }) {
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Inter+Tight:wght@400;500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
  ${preload}
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/homepage.css">
  <link rel="stylesheet" href="/assets/css/bag.css">
  <link rel="stylesheet" href="/assets/css/pdp.css">
  <script>document.documentElement.classList.add('js');</script>
</head>
<body class="page--solid-header">
  <a class="skip-link" href="#main">Skip to content</a>

  <!-- include:header -->

  <main id="main" class="${mainClass}">${body}
  </main>

  <!-- include:footer -->

  <script src="/assets/js/homepage.js" defer></script>
  <script src="/assets/js/bag.js" defer></script>
  <script src="/assets/js/pdp.js" defer></script>
</body>
</html>
`;
}

export function renderProduct(slug, data) {
  const index = data.products.findIndex((x) => x.slug === slug);
  if (index < 0) return null;
  const p = data.products[index];
  const body = `
  <div class="pdp-hero container">
    ${renderGallery(p)}
    ${renderInfo(p, data, index, data.products.length)}
  </div>
  ${renderFeatures(p)}
  ${renderColourChapter(p)}
  ${renderDetails(p, data)}
  ${renderStyleIt(p)}
  ${renderRelated(p, data)}
  ${renderBuyBar(p)}`;
  return page({
    title: `${p.name} — ${p.descriptor} | Stylish Naari`,
    description: p.description || p.descriptor,
    ogImage: p.images[0]?.src,
    preload: `<link rel="preload" as="image" href="${esc(p.images[0].src)}" fetchpriority="high">`,
    body,
  });
}

export function renderNotFound() {
  return page({
    title: 'Not found | Stylish Naari',
    description: 'This page has unravelled.',
    body: `
  <section class="pdp-404 container">
    <p class="eyebrow">404</p>
    <h1 class="t-h1">This page has unravelled.</h1>
    ${link('Back to the collection', '/sarees')}
  </section>`,
  });
}
