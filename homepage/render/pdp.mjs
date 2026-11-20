// Product detail page renderer — the prototype's equivalent of Shopify's product template.
// Each render* function is one reusable section; sections with no data return '' rather than placeholders.

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = (n) => String(n).padStart(2, '0');
export const formatPrice = (n) => (n == null ? '' : '₹ ' + Number(n).toLocaleString('en-IN'));

// Text links carry no arrow (client, Nov 2026)
export const link = (label, href = '#', extra = '') => `<a class="link${extra}" href="${esc(href)}"><span class="link__label">${esc(label)}</span></a>`;

/* Inline style for a product photo's focus crop (zoom + focal point), plus its object-position. */
const focusStyle = (img) => [img.focus ? `--s:${img.focus.s}; --ox:${img.focus.ox}; --oy:${img.focus.oy}` : '', img.pos ? `object-position:${img.pos}` : ''].filter(Boolean).join('; ');

/* An image cropped from a product photo. Mirrors a Shopify focal point + zoom. */
export function cropImg(product, crop, { alt = '', loading = 'lazy', cls = '' } = {}) {
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

/* What a product photograph shows, from its record in products.json:
     product  the saree itself, folded or laid flat: images[].role "product", and the catalogue photos (no role,
              in /assets/images/catalogue/), which are all folded shots
     styled   a model wearing it: the other photographs without a role
     detail   close-ups (role "detail", "border" and so on) */
export const imageKind = (img) => (img.role === 'product' || (!img.role && img.src.includes('/catalogue/')) ? 'product' : img.role ? 'detail' : 'styled');
const CAPTION = { styled: 'Styled imagery for representation', product: 'Actual product photograph', blouse: 'Blouse piece, actual product photograph' };
/* A real photograph of the saree itself: a product shot, a catalogue photo, a Drive pendrive photo (images[].sn), or a
   photo marked actual: true (e.g. Hariyali's own close-ups). */
export const isActual = (img) => !!(img && (imageKind(img) === 'product' || img.sn || img.actual));

/* ─── 01 Hero: gallery + sticky product information ───────── */
function renderGallery(p) {
  // Views: each photograph, then closer views of the fall, pallu and border cut from those photographs.
  // (These replaced the separate "On the body" section, so the rail has more than one or two images.)
  const cropStyle = (c) => [c.s ? `--s:${c.s}` : '', c.ox ? `--ox:${c.ox}` : '', c.oy ? `--oy:${c.oy}` : '', c.op ? `object-position:${c.op}` : ''].filter(Boolean).join('; ');
  // Every photograph of the saree is in the rail. Order: the portrait(s) → the close-up photographs (print,
  // embroidery, border) → a border crop if no border photograph exists → the product shot(s) → the video.
  //   close-ups     = each close-up photo itself, uncropped (full resolution, so it stays sharp)
  //   border detail = a modest crop of the close-up (zoom capped at 1.6 so it stays sharp too), only when the
  //                   photograph it is cut from isn't already shown in full
  //   product shot  = the saree laid flat or folded, shown whole on its own backdrop colour
  // Sarees with only a portrait get two fabric-only close-ups cut from it instead.
  // images[].gallery: false = kept for crops elsewhere on the page, but not a slide (e.g. a border shot with no print in it)
  const shown = p.images.filter((im) => im.gallery !== false);
  const portraits = shown.filter((im) => !im.role);
  const details = shown.filter((im) => im.role === 'detail');
  const closeups = shown.filter((im) => im.role && im.role !== 'detail' && im.role !== 'product'); // e.g. a border photo
  const products = shown.filter((im) => im.role === 'product');
  // Model portraits with a frame (images[].frame: a 3:4 window, as shares of the photo) are cropped in on the model and
  // the saree, so the backdrop doesn't fill the picture. Other portraits are shown whole. Close-up views are crops.
  const framed = (f) => `--fw:${+(100 / f.w).toFixed(3)}%; --fx:${+(-100 * f.x / f.w).toFixed(3)}%; --fy:${+(-100 * f.y / f.h).toFixed(3)}%`;
  const portraitView = (img) => img.frame
    ? { img, style: framed(img.frame), alt: img.alt, frame: true }
    : { img, style: '', alt: img.alt, whole: true };
  // A product shot is shown whole on its backdrop colour, unless it is a full-frame photo of the cloth (fit: cover)
  const productView = (img) => ({ img, style: img.fit === 'cover' ? '' : `object-fit:contain; background:${img.bg || 'transparent'}`, alt: img.alt, bg: img.bg, whole: img.fit !== 'cover' });
  // galleryListed: true = every photograph exactly in the order listed in products.json, nothing cut from them
  // (the November 16 sarees: model portrait → original product photo → print → border).
  const views = p.galleryListed ? shown.map((img) => (img.role === 'product' ? productView(img) : img.role ? { img, style: '', alt: img.alt } : portraitView(img)))
    : portraits.map(portraitView);
  // images[].second: true = a product shot that comes straight after the model photo (the first-shoot folded originals,
  // _tools/originals-firstshoot.ps1); the close-up crops follow it as before.
  const early = p.galleryListed ? [] : products.filter((im) => im.second);
  for (const img of early) views.push(productView(img));
  const cropView = (key, label, maxZoom) => {
    const c = p.crops?.[key];
    const img = c && p.images[c.img ?? 0];
    if (img && img.gallery !== false) views.push({ img, style: cropStyle({ ...c, s: Math.min(c.s ?? 1, maxZoom) }), alt: `${p.name}: ${label}` });
  };
  if (p.galleryListed) {
    // already complete
  } else if (details.length || closeups.length) {
    details.forEach((img, n) => views.push({ img, style: '', alt: n ? (img.alt || `${p.name}: up close`) : `${p.name}: the print, up close` }));
    closeups.forEach((img) => views.push({ img, style: '', alt: img.alt || `${p.name}: up close` }));
    const bc = p.crops?.borderDetail;
    if (bc && !closeups.includes(p.images[bc.img ?? 0])) cropView('borderDetail', 'the border', 1.6);
  } else if (portraits.length === 1) {
    cropView('border', 'the border', 2.4);
    cropView('swatch', 'the fabric', 2.4);
  }
  if (!p.galleryListed) for (const img of products) if (!early.includes(img)) views.push(productView(img));
  // The second photograph always fills the frame edge to edge, no bands either side (client, 17 Nov 2026)
  if (views[1] && !views[1].video && views[1].whole) views[1] = { ...views[1], style: '', whole: false };
  if (p.video?.src) views.push({ video: p.video, img: { src: p.video.poster || p.images[0].src, width: p.video.width || 720, height: p.video.height || 1280 }, alt: `${p.name}: the saree in motion` });
  // Caption under every photograph (client, Nov 16), from what the photo really is (isActual):
  //   real photo of the saree itself (folded / laid flat / Drive pendrive / catalogue)  → "Actual product photograph"
  //   anything AI-made: the model portrait and every close-up or crop cut from it      → "Styled imagery for representation"
  //   a real photoshoot (products.json → photoshoot: true): its model photos are real, so they read "Actual product photograph" (client, 20 Nov 2026)
  // The film carries none.
  for (const v of views) v.caption = v.video ? '' : v.img.role === 'blouse' ? CAPTION.blouse : isActual(v.img) || p.photoshoot || v.img.real ? CAPTION.product : CAPTION.styled;
  const captioned = views.some((v) => v.caption);
  const many = views.length > 1;
  // The frame's shape: 3:4 when the first photo is framed; otherwise the first photo's own shape, but never wider than
  // square (a landscape catalogue photo sits whole inside a square frame), so the picture always fits the screen.
  const first = views[0].img;
  const [rw, rh] = views[0].frame ? [3, 4] : first.width > first.height ? [1, 1] : [first.width, first.height];
  const ratio = `--ratio:${rw} / ${rh}; --ratio-n:${(rw / rh).toFixed(4)}`;
  const slides = views.map((v, i) => v.video ? `
        <figure class="pdp-gallery__slide pdp-gallery__slide--video" data-gallery-slide data-gallery-video aria-label="Video, ${i + 1} of ${views.length}" aria-hidden="true">
          <video class="pdp-gallery__video" muted loop playsinline preload="none" poster="${esc(v.video.poster || '')}" data-src="${esc(v.video.src)}" width="${v.img.width}" height="${v.img.height}" aria-label="${esc(v.alt)}"></video>
          <button class="pdp-gallery__sound" type="button" data-video-sound aria-pressed="false" aria-label="Turn sound on">Sound off</button>
        </figure>` : `
        <figure class="pdp-gallery__slide${i === 0 ? ' is-active' : ''}${v.whole ? ' pdp-gallery__slide--whole' : ''}${v.frame ? ' pdp-gallery__slide--framed' : ''}" data-gallery-slide data-caption="${esc(v.caption)}" aria-label="Image ${i + 1} of ${views.length}"${i ? ' aria-hidden="true"' : ''}>
          <img class="crop" src="${esc(v.img.src)}" alt="${esc(v.alt)}" width="${v.img.width}" height="${v.img.height}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" style="${esc(v.style)}">
        </figure>`).join('');
  // A rail of thumbnails beside the image, and a round arrow on each side of it
  const thumbs = many ? `
      <ul class="pdp-gallery__thumbs">${views.map((v, i) => `
        <li><button class="pdp-gallery__thumb${i === 0 ? ' is-active' : ''}${v.video ? ' pdp-gallery__thumb--video' : ''}" type="button" data-gallery-thumb aria-label="${v.video ? 'Play the video' : `Show image ${i + 1} of ${views.length}`}"${i === 0 ? ' aria-current="true"' : ''}>
          <img class="crop" src="${esc(v.img.src)}" alt="" width="${v.img.width}" height="${v.img.height}" loading="lazy" decoding="async" style="${esc(v.style || '')}">${v.video ? '<span class="pdp-gallery__thumb-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="12" height="12"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>' : ''}
        </button></li>`).join('')}
      </ul>` : '';
  const chevron = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${d}"/></svg>`;
  const controls = many ? `
        <button class="pdp-gallery__btn pdp-gallery__btn--prev" type="button" data-gallery-prev aria-label="Previous image">${chevron('M14.5 6l-6 6 6 6')}</button>
        <button class="pdp-gallery__btn pdp-gallery__btn--next" type="button" data-gallery-next aria-label="Next image">${chevron('M9.5 6l6 6-6 6')}</button>` : '';
  return `
    <section class="pdp-gallery${many ? ' pdp-gallery--many' : ''}${captioned ? ' has-captions' : ''}" aria-label="${esc(p.name)} images" data-gallery tabindex="-1" style="${ratio}">${thumbs}
      <div class="pdp-gallery__main">
        <div class="pdp-gallery__stage" data-gallery-track>${slides}
        </div>${controls}${captioned ? `
        <p class="pdp-gallery__caption" data-gallery-caption>${esc(views[0].caption)}</p>` : ''}
      </div>
    </section>`;
}

/* ─── Video card: in the product panel, for sarees with a video ─────────────
   A 9:16 reel that loops silently. Nothing sits on the video until it is hovered (or tapped on touch
   screens): then a soft gradient brings up a sound toggle, the running time and a full-screen button.
   Same behaviour as react/SareeVideoCard.jsx. */
function renderFilmCard(p, { full = true, cls = '' } = {}) {
  const v = p.video;
  const icon = (d) => `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  return `
      <figure class="video-card${cls ? ' ' + cls : ''}" data-vcard>
        <video class="video-card__video" data-vcard-video muted loop playsinline preload="none" poster="${esc(v.poster || '')}" data-src="${esc(v.src)}" width="${v.width || 720}" height="${v.height || 1280}" aria-label="${esc(p.name)}: the saree in motion"></video>
        <div class="video-card__shade" aria-hidden="true"></div>
        <figcaption class="video-card__bar">
          <button class="video-card__glass video-card__sound" type="button" data-vcard-sound aria-pressed="false">
            <span data-vcard-icon-off>${icon('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/>')}</span>
            <span data-vcard-icon-on hidden>${icon('<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>')}</span>
            <span data-vcard-sound-label>Sound off</span>
          </button>
          <span class="video-card__right">
            <span class="video-card__glass video-card__time" data-vcard-time>0:00</span>
            ${full ? `<button class="video-card__glass video-card__full" type="button" data-vcard-full aria-label="Watch full screen">${icon('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>')}</button>` : ''}
          </span>
        </figcaption>
      </figure>`;
}

/* ─── The drape in motion: a full-width editorial feature, for sarees with a video ──
   A softly blurred, vignetted backdrop of the saree's own poster frame; on it a two-panel card: the 9:16
   reel in a white frame, and a short editorial note on ivory. Copy comes from product.motion (draft), or
   falls back to the product's own description. */
function renderMotion(p) {
  if (!p.video?.src) return '';
  const m = p.motion || {};
  const text = m.text || p.description;
  const motif = '<svg viewBox="0 0 48 16" width="48" height="16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M0 8h17M31 8h17"/><circle cx="24" cy="8" r="4.5"/><circle cx="24" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>';
  return `
  <section class="motion" aria-labelledby="motion-title" style="--motion-bg:url('${esc(p.video.poster || p.images[0].src)}')">
    <div class="motion__backdrop" aria-hidden="true"></div>
    <div class="motion__card" data-reveal>
      <div class="motion__frame">${renderFilmCard(p, { full: false, cls: 'video-card--framed' })}</div>
      <div class="motion__text">
        <h2 class="motion__title" id="motion-title">${esc(m.title || 'The drape in motion')}</h2>
        <span class="motion__motif">${motif}</span>
        ${text ? `<p class="motion__body">${esc(text)}</p>` : ''}
        <a class="motion__cta" href="${esc(m.href || '/#craft')}">${esc(m.cta || 'Explore the craft')}</a>
      </div>
    </div>
  </section>`;
}

function specRows(p) {
  const a = p.attributes;
  const colourNames = p.colours.map((c) => c.name).join(', ');
  return [
    ['Fabric', a.fabric],
    ['Range', a.range], // Premium / Semi-premium, from the client's catalogue
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

/* ─── Colour variants: one print in several colours ─────────
   A product with variants (products.json → variants[]) shows a colour choice under the price. Each colour has its
   own link (?colour=<key>), price and photo (variants[].imageIndex = its slide in the gallery). pdp.js swaps the
   name, price, photo, swatch and the bag button when a colour is chosen; the page renders the first colour. */
export const variantsOf = (p) => (p.variants?.length > 1 ? p.variants : null);

/* Colour siblings: the same print in other colours, each its own named saree with its own page (client, 20 Nov 2026:
   Kajal / Kishmish / Gulmohar, SN-002). products.json → colourSiblings = the slugs in display order, the same list on
   every member. Same look as the colour choice, but each chip is a link to that saree's page. */
const siblingsOf = (p, data) => (p.colourSiblings || []).map((s) => data.products.find((x) => x.slug === s)).filter(Boolean);
function renderColourSiblings(p, data) {
  const sibs = siblingsOf(p, data);
  if (sibs.length < 2) return '';
  return `
      <div class="pdp-colours">
        <p class="pdp-colours__label"><span class="pdp-colours__eyebrow">Colour</span> <span class="pdp-colours__name">${esc(p.colours[0]?.name || p.name)}</span></p>
        <ul class="pdp-colours__list" aria-label="Also in other colours">${sibs.map((x) => `
          <li><a class="pdp-colours__chip" href="/products/${esc(x.slug)}"${x.slug === p.slug ? ' aria-current="page"' : ''}
            aria-label="${esc(`${x.name}, ${x.colours[0]?.name || ''}`)}" title="${esc(`${x.name} · ${x.colours[0]?.name || ''}`)}"
            style="--chip:${esc(x.colours[0]?.hex || '#ccc')}"></a></li>`).join('')}
        </ul>
      </div>`;
}

function renderColourChoice(p, data) {
  const vs = variantsOf(p);
  if (!vs) return renderColourSiblings(p, data);
  const v = vs[0];
  const sharedNote = 'Shown together with the other colours in one photograph.';
  return `
      <div class="pdp-colours" data-variants data-shared-note="${esc(sharedNote)}">
        <p class="pdp-colours__label"><span class="pdp-colours__eyebrow">Colour</span> <span class="pdp-colours__name" data-variant-label>${esc(v.name)}</span></p>
        <ul class="pdp-colours__list" role="radiogroup" aria-label="Colour">${vs.map((x, i) => `
          <li><button class="pdp-colours__chip" type="button" role="radio" aria-checked="${i === 0}" aria-label="${esc(x.name)}"
            data-variant="${esc(x.key)}" data-variant-name="${esc(x.name)}" data-variant-price="${x.price ?? ''}" data-variant-slide="${x.imageIndex}"
            data-variant-hex="${esc(x.colour.hex)}" data-variant-text="${esc(x.colour.text)}"${x.imageShared ? ' data-variant-shared' : ''}
            style="--chip:${esc(x.colour.hex)}"></button></li>`).join('')}
        </ul>
        <p class="pdp-colours__note" data-variant-note${v.imageShared ? '' : ' hidden'}>${esc(sharedNote)}</p>
      </div>`;
}

function renderInfo(p, data, index, total) {
  const edit = p.edits.map((k) => data.edits[k]).filter(Boolean)[0];
  const vs = variantsOf(p);
  const price = vs ? vs[0].price : p.price;
  const hasPrice = price != null;
  const chips = false && p.colours.length ? `<span class="pdp-info__chips">${p.colours.map((c) => `<span class="pdp-info__chip" style="background:${esc(c.hex)}" title="${esc(c.name)}"></span>`).join('')}</span>` : '';
  // The first four details, plus the blouse piece whenever it is known (client, 18 Nov 2026)
  const rows = specRows(p);
  const meta = [...rows.slice(0, 4), ...rows.slice(4).filter(([k]) => k === 'Blouse piece')].map(([k, v]) => k === 'Colour' && vs
    ? `<div><dt>${esc(k)}</dt><dd data-variant-label>${esc(vs[0].name)}</dd></div>`
    : `<div><dt>${esc(k)}</dt><dd>${esc(v)}${k === 'Colour' ? chips : ''}</dd></div>`).join('');
  const variantAttr = vs ? ` data-variant="${esc(vs[0].key)}"` : '';
  const button = hasPrice
    ? `<button class="button button--filled button--block" type="button" data-add-to-bag="${esc(p.slug)}"${variantAttr} data-add-label="Add to bag">Add to bag</button>`
    : `<button class="button button--filled button--block" type="button" disabled>Add to bag</button>
          <p class="pdp-info__note">Price to be confirmed — this saree can’t be added to the bag yet.</p>`;
  return `
    <div class="pdp-info" data-pdp-info>
      ${edit ? `<p class="eyebrow">${esc(edit.title)}</p>` : ''}
      <h1 class="t-h1 pdp-info__name">${esc(p.name)}</h1>
      ${p.nameMeaning ? `<p class="pdp-info__meaning"><em class="serif">${esc(p.nameMeaning)}</em></p>` : ''}
      <p class="pdp-info__descriptor">${esc(p.descriptor)}</p>
      ${hasPrice ? `<p class="pdp-info__price" data-price data-variant-price-text>${formatPrice(price)}</p>` : ''}
      ${renderColourChoice(p, data)}
      ${p.description ? `<p class="pdp-info__description">${esc(p.description)}</p>` : ''}
      <div class="pdp-info__actions" data-pdp-cta>
        ${button}
      </div>${renderTrust(p, data)}
      ${meta ? `<dl class="pdp-info__meta">${meta}</dl>` : ''}
      ${data.store.shipping && !data.store.assurances?.length ? `<p class="pdp-info__shipping">${esc(data.store.shipping)}</p>` : ''}
      ${renderPolicyAccordions(data)}
      ${p.video?.src ? '' : renderSareeSwatch(p, index, total)}
    </div>`;
}

/* Collapsible "Shipping & return" and "Disclaimer" under the buy box, on every PDP. Copy matches
   /shipping and /exchanges (store.shipping). Import duty is PLACEHOLDER text until the client confirms it. */
const POLICY_RETURNS = 'We do not accept returns. Exchanges are offered only for damaged items or misprints, within 14 days of delivery, if the saree is unused and has its tags. An unboxing video is required. Exchanges are not available for handloom, customised or sale items.';
const POLICY_DUTY = '[Insert import duty details] Orders shipped outside India may attract customs duties, taxes or handling fees charged by the destination country. These are payable by the buyer on delivery.';
const POLICY_DISCLAIMER = [
  'Due to photographic lighting conditions and differences in screen resolutions, the colour of the actual product may slightly vary from the images provided.',
  'There may be slight variation in design and measurement as these items are handmade. In fact, that ensures the authenticity of a handmade product.',
  'The blouse or jewellery worn by the model are only for the purpose of photoshoot and styling references.',
];
const chevron = '<svg class="pdp-acc__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9.5l6 6 6-6"/></svg>';
function renderPolicyAccordions(data) {
  const ship = data.store.shipping;
  const item = (title, body) => `
        <details class="pdp-acc__item">
          <summary><span>${title}</span>${chevron}</summary>
          <div class="pdp-acc__panel">${body}</div>
        </details>`;
  const sub = (h, t) => `<h3>${h}</h3><p>${esc(t)}</p>`;
  return `
      <div class="pdp-acc">${item('Shipping &amp; return', `${ship ? sub('Shipping', ship) : ''}${sub('Returns &amp; exchanges', POLICY_RETURNS)}${sub('Import duty', POLICY_DUTY)}`)}${item('Disclaimer', `<ul>${POLICY_DISCLAIMER.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`)}
      </div>`;
}

/* ─── Checkout + assurances, under Add to bag ─────────────
   Everything here is store data (products.json → store.checkout, store.assurances); nothing is
   written in the template. An assurance marked for one fabric only shows on sarees of that fabric. */
const lock = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="10.5" width="14" height="9.5" rx="1"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/></svg>';
const tick = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
/* Ways to pay as logos (assets/images/payments/*.svg, brand colours, fixed height in CSS); "Net banking" is a line bank
   icon plus its name, after a divider. A method with no logo here falls back to its name. Same markup in the bag drawer
   (partials/header.html), so keep the two in step. */
const PAY_LOGOS = { upi: ['upi.svg', 'UPI', 176, 52], visa: ['visa.svg', 'Visa', 1000, 324], mastercard: ['mastercard.svg', 'Mastercard', 152, 94], rupay: ['rupay.svg', 'RuPay', 300, 67] };
export const bankIcon = '<svg class="pay-methods__bank" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 9.5 12 4l9 5.5M3.5 9.5h17v2h-17zM5.5 11.5v6.5M9.5 11.5v6.5M14.5 11.5v6.5M18.5 11.5v6.5M4.5 18h15v2h-15z"/></svg>';
export function paymentMethods(methods = [], cls = '') {
  if (!methods.length) return '';
  const key = (m) => m.toLowerCase().replace(/[^a-z]/g, '');
  const logos = methods.filter((m) => PAY_LOGOS[key(m)]);
  const other = methods.filter((m) => !PAY_LOGOS[key(m)]);
  const img = ([file, alt, w, h]) => `<li><img class="pay-methods__logo pay-methods__logo--${file.replace('.svg', '')}" src="/assets/images/payments/${file}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async"></li>`;
  return `<ul class="pay-methods ${cls}" aria-label="Ways to pay">${logos.map((m) => img(PAY_LOGOS[key(m)])).join('')}${other.map((m) => `<li class="pay-methods__text">${/bank/i.test(m) ? bankIcon : ''}${esc(m)}</li>`).join('')}</ul>`;
}
function renderTrust(p, data) {
  const checkout = data.store.checkout;
  const fabric = (p.attributes.fabric || '').toLowerCase();
  const assurances = (data.store.assurances || []).filter((a) => a && a.title && (!a.fabric || a.fabric.toLowerCase() === fabric));
  if (!checkout && !assurances.length) return '';
  return `
      <div class="pdp-trust">
        ${checkout ? `<div class="pdp-trust__secure"><div class="pdp-trust__row">
          <span class="pdp-trust__label">${lock}${esc(checkout.label)}</span>
          ${paymentMethods(checkout.methods, 'pdp-trust__methods')}
        </div></div>` : ''}
        ${assurances.length ? `<ul class="pdp-trust__list">${assurances.map((a) => `<li>${tick}${esc(a.title)}</li>`).join('')}</ul>` : ''}
      </div>`;
}

/* ─── 02 The Saree Swatch ─────────────────────────────────
   A textile specimen: an extreme close-up of the saree's own photo, then a band in its colour.
   It introduces the colour that the colour chapter later spreads across the whole screen.
   Reusable: everything comes from the product record (crops.swatch, colours, attributes). */
export function renderSareeSwatch(p, index, total) {
  const vs = variantsOf(p);
  const c = vs ? vs[0].colour : p.colours[0];
  if (!c) return '';
  const a = p.attributes;
  const crop = p.crops?.swatch || p.crops?.weave;
  const second = vs ? null : p.colours[1];
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
          <span class="saree-swatch__hex" data-swatch-hex>${esc(c.hex)}</span>
        </span>
        <span class="saree-swatch__name" data-swatch-name>${esc(c.name)}${second ? ` <em class="serif saree-swatch__pair">&amp; ${esc(second.name.toLowerCase())}</em>` : ''}</span>
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
// A real photograph of the saree: a real photoshoot, a product / folded / blouse shot, or one marked actual or from Drive
const isRealPhoto = (p, img) => !!img && !!(p.photoshoot || img.real || img.actual || img.sn || img.second || ['product', 'blouse', 'source'].includes(img.role));
const sameSpot = (a, b) => a && b && (a.img ?? 0) === (b.img ?? 0) && Math.abs(pct(a.ox) - pct(b.ox)) < 0.12 && Math.abs(pct(a.oy) - pct(b.oy)) < 0.12;
/* The four circles' crops, as the page shows them: { key, crop, title, text }. Exported for
   _tools/make-detail-circles.mjs, which cuts each one into its own sharp 720×720 file (products.json → detailCircles). */
export const circleSig = (p, crop) => [p.images[crop.img ?? 0]?.src, crop.s ?? 1, crop.ox ?? '', crop.oy ?? '', crop.op ?? ''].join('|');
export function featureItems(p) {
  const a = p.attributes;
  const crops = p.crops || {};
  const feat = p.features || {}; // real-photo crops (_tools/set-feature-crops.cjs); the AI model photo is only for "As styled"
  const cloth = [a.colourway || p.colours[0]?.name, a.fabric?.toLowerCase(), a.weave?.toLowerCase()].filter(Boolean).join(' ');
  // Fabric, border and motif are cut only from real photographs of the saree (client, 19 Nov 2026): never the AI
  // model photo or AI close-ups. A saree with no real photograph has no detail circles (and so no section).
  const real = (c) => c && isRealPhoto(p, p.images[c.img ?? 0]) ? c : null;
  const border = real(crops.borderDetail) || real(crops.border);
  const motif = real(crops.motif);
  // The fabric circle never shows the same spot as the border or motif circle: it falls back to a wider crop
  const fabric = [crops.swatch, crops.colour, crops.weave].map(real).find((c) => c && !sameSpot(c, border) && !sameSpot(c, motif));
  return [
    ['fabric', feat.fabric || (fabric && circleCrop(p, fabric, 5 / 4)), a.fabric || a.weave ? 'Fabric & colour' : 'Colour', cloth],
    ['border', feat.border || (border && circleCrop(p, border, 4 / 3)), 'The border', a.border],
    ['motif', feat.motif || (motif && circleCrop(p, motif, 4 / 3)), 'The motif', a.motif],
    ['styled', crops.styling && circleCrop(p, crops.styling), 'As styled', p.styling],
  ].filter(([, crop, , text]) => crop && text).map(([key, crop, title, text]) => ({ key, crop, title, text }));
}
/* Each circle shows its own pre-cut file when there is one (client, 20 Nov 2026: never blurry): cut from the sharpest
   photo on disk, zoomed out where the photo hasn't enough pixels, scaled with Lanczos. Otherwise the live crop. */
function renderFeatures(p) {
  const sentence = (t) => (t && !/[.!?]$/.test(t) ? t + '.' : t);
  const items = featureItems(p);
  if (items.length < 2) return '';
  const features = items.map(({ key, crop, title, text }) => {
    const cut = p.detailCircles?.[key];
    const file = cut && cut.from === circleSig(p, crop) ? cut.src : null; // a stale cut (the crop changed since) is ignored
    const alt = `${p.name}: ${title.toLowerCase()}`;
    const img = file
      ? `<img class="crop" src="${esc(file)}" alt="${esc(alt)}" width="720" height="720" loading="lazy" decoding="async">`
      : cropImg(p, crop, { alt });
    return `
        <li class="feature" data-reveal>
          <div class="media feature__media">${img}</div>
          <h3 class="feature__title">${esc(title)}</h3>
          <p class="feature__text">${esc(sentence(text))}</p>
        </li>`;
  }).join('');
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
    <div class="unfolded__pin">
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
/* Values the collection filters read from each card (assets/js/shop.js) */
export const slugify = (v) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const PRICE_BANDS = [
  ['under-25000', 'Under ₹ 25,000', (n) => n < 25000],
  ['25000-50000', '₹ 25,000 – ₹ 50,000', (n) => n >= 25000 && n <= 50000],
  ['over-50000', 'Over ₹ 50,000', (n) => n > 50000],
];
export const priceBand = (p) => (p.price == null ? 'to-be-confirmed' : PRICE_BANDS.find(([, , test]) => test(p.price))[0]);
export const fabricOf = (p) => p.attributes.fabric || p.attributes.weave || null;

const heart = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.5S3.5 15.4 3.5 9.3A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 8.5 1.7c0 6.1-8.5 11.2-8.5 11.2Z"/></svg>';

/* One card = one link, plus two controls laid over the photograph as its siblings: a wishlist heart
   and, for a saree that has a price, Quick add (bag.js picks up data-add-to-bag). The index is the
   card's place in the editorial order, which "Featured" sorts back to. */
export function productCard(p, index = 0, { wishlist = true } = {}) {
  const main = p.images[0];
  const detail = p.crops?.border;
  const colour = p.colours[0];
  const vs = variantsOf(p);
  const colourValues = (vs ? vs.map((v) => v.name) : colour ? [colour.name] : []).map(slugify);
  const quickAdd = p.price != null && !vs;
  const priceText = p.price == null ? '' : (p.priceMax && p.priceMax !== p.price ? 'From ' : '') + formatPrice(p.price);
  const facts = [
    `data-order="${index}"`,
    colourValues.length ? `data-colour="${esc(colourValues.join(' '))}"` : '',
    fabricOf(p) ? `data-fabric="${esc(slugify(fabricOf(p)))}"` : '',
    `data-edit="${esc(p.edits.join(' '))}"`,
    (p.categories || []).length ? `data-category="${esc(p.categories.join(' '))}"` : '',
    `data-price-band="${priceBand(p)}"`,
    `data-price="${p.price ?? ''}"`,
    p.isNew ? 'data-new' : '',
  ].filter(Boolean).join(' ');
  return `
          <li class="product-card" data-reveal data-product ${facts}>
            <a href="/products/${esc(p.slug)}" class="product-card__link">
              <div class="media media--3-4 product-card__media">
                <img class="product-card__img crop" src="${esc(main.src)}" alt="${esc(main.alt)}" width="${main.width}" height="${main.height}" loading="lazy" decoding="async" style="${esc(focusStyle(main))}">
                ${detail ? cropImg(p, detail, { cls: 'product-card__detail' }) : ''}
              </div>
              <h3 class="product-card__title">${esc(p.name)}</h3>
              <p class="product-card__descriptor">${esc(p.descriptor)}</p>
              ${priceText ? `<p class="product-card__price">${priceText}</p>` : ''}
            </a>
            <div class="product-card__actions">
              ${!wishlist ? '' : `<button class="product-card__save" type="button" data-wishlist="${esc(p.slug)}" data-name="${esc(p.name)}" aria-pressed="false" aria-label="Save ${esc(p.name)} to your wishlist">${heart}</button>`}
              ${quickAdd ? `<button class="product-card__quick" type="button" data-add-to-bag="${esc(p.slug)}" data-add-label="Quick add" aria-label="Quick add ${esc(p.name)} to your bag">Quick add</button>` : ''}
            </div>
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
      <ul class="product-row" data-product-row>${list.map((x, i) => productCard(x, i, { wishlist: false })).join('')}
      </ul>
      <div class="row-progress" aria-hidden="true"><span data-row-progress></span></div>
    </div>
  </section>`;
}

/* ─── Buy bar: name, price and Add to bag, pinned to the bottom once the main button scrolls away ── */
function renderBuyBar(p) {
  const vs = variantsOf(p);
  if ((vs ? vs[0].price : p.price) == null) return '';
  return `
  <div class="pdp-buybar" data-buybar aria-hidden="true">
    <img class="pdp-buybar__thumb" src="${esc(p.images[0].src)}" alt="" width="${p.images[0].width}" height="${p.images[0].height}" loading="lazy" decoding="async">
    <div class="pdp-buybar__info"><span class="pdp-buybar__name">${esc(p.name)}</span><span class="pdp-buybar__price" data-variant-price-text>${formatPrice(vs ? vs[0].price : p.price)}</span></div>
    <button class="button button--filled" type="button" data-add-to-bag="${esc(p.slug)}"${vs ? ` data-variant="${esc(vs[0].key)}"` : ''} data-add-label="Add to bag" tabindex="-1">Add to bag</button>
  </div>`;
}

/* ─── Page ────────────────────────────────────────────────── */
export function page({ title, description, body, preload = '', ogImage = '', mainClass = 'pdp', styles = [], scripts = [] }) {
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  ${preload}
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/homepage.css">
  <link rel="stylesheet" href="/assets/css/bag.css">
  <link rel="stylesheet" href="/assets/css/pdp.css">
  <link rel="stylesheet" href="/assets/css/shop.css">${styles.map((href) => `
  <link rel="stylesheet" href="${esc(href)}">`).join('')}
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
  <script src="/assets/js/shop.js" defer></script>
  <script src="/assets/js/search.js" defer></script>
  <script src="/assets/js/pdp.js" defer></script>${scripts.map((src) => `
  <script src="${esc(src)}" defer></script>`).join('')}
</body>
</html>
`;
}

/* Old product links: sarees merged into one page with colour variants keep working (products[].aliases). */
export function aliasTarget(slug, data) {
  for (const p of data.products) {
    const a = (p.aliases || []).find((x) => x.slug === slug);
    if (a) return `/products/${p.slug}${a.colour ? `?colour=${a.colour}` : ''}`;
  }
  return null;
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
  ${renderMotion(p)}
  ${renderFeatures(p)}
  ${renderColourChapter(p)}
  ${renderDetails(p, data)}
  ${renderStyleIt(p)}
  ${renderRelated(p, data)}
  ${renderBuyBar(p)}`;
  return page({
    title: `${p.name} — ${p.descriptor} | Stylissh Naari`,
    description: p.description || p.descriptor,
    ogImage: p.images[0]?.src,
    preload: `<link rel="preload" as="image" href="${esc(p.images[0].src)}" fetchpriority="high">`,
    body,
  });
}

export function renderNotFound() {
  return page({
    title: 'Not found | Stylissh Naari',
    description: 'This page has unravelled.',
    body: `
  <section class="pdp-404 container">
    <p class="eyebrow">404</p>
    <h1 class="t-h1">This page has unravelled.</h1>
    ${link('Back to the collection', '/sarees')}
  </section>`,
  });
}
