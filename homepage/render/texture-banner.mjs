// Homepage texture banner — "Texture first": one saree photograph, edge to edge, with the words set into it.
// The prototype's equivalent of a Shopify section with a product (image) picker and four text settings.
// The photograph comes from products.json; the copy is the section's own settings.
// The Shopify version of this section is shopify/sections/texture-banner.liquid — keep the two in step.
import { esc } from './pdp.mjs';

export function renderTextureBanner(data, {
  product: slug, image = 0, href = '/sarees',
  eyebrow = '', title = '', line = '', cta = '',
  position = '', positionTablet = '', positionMobile = '',
} = {}) {
  const p = data.products.find((x) => x.slug === slug);
  const img = p?.images[image];
  if (!img || !title) return '';
  const pos = [
    position ? `--pos:${esc(position)}` : '',
    positionTablet ? `--pos-tablet:${esc(positionTablet)}` : '',
    positionMobile ? `--pos-mobile:${esc(positionMobile)}` : '',
  ].filter(Boolean).join('; ');
  return `
    <section class="texture-banner" aria-labelledby="texture-title">
      <div class="texture-banner__media">
        <img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async"${pos ? ` style="${pos}"` : ''}>
      </div>
      <div class="texture-banner__scrim" aria-hidden="true"></div>
      <div class="container texture-banner__content" data-reveal>
        ${eyebrow ? `<p class="eyebrow texture-banner__eyebrow">${esc(eyebrow)}</p>` : ''}
        <h2 class="texture-banner__title" id="texture-title"><a class="texture-banner__link" href="${esc(href)}">${esc(title)}</a></h2>
        ${line ? `<p class="texture-banner__line">${esc(line)}</p>` : ''}
        ${cta ? `<span class="link link--on-dark texture-banner__cta" aria-hidden="true"><span class="link__label">${esc(cta)}</span><span class="link__arrow">↗</span></span>` : ''}
      </div>
    </section>`;
}
