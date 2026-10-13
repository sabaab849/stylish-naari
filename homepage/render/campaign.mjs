// Homepage campaign — a full-bleed editorial section bound to one edit and one saree's photograph.
// The prototype's equivalent of a Shopify section with an edit (collection) and a product picker.
// Copy comes only from products.json: the edit's title and descriptor.
// The Shopify version of this section is shopify/sections/campaign.liquid — keep the two in step.
import { esc } from './pdp.mjs';

/* Floating light particles. Seeded, so the markup is identical on every request.
   Each spark carries its own position, size, opacity, drift, timing and scroll travel (--p) as custom
   properties; homepage.css turns those into two CSS animations (drift + glow) and a shift on scroll. */
export function renderSparks(count = 22, seed = 11) {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const between = (min, max, dp = 0) => (min + rnd() * (max - min)).toFixed(dp);
  return Array.from({ length: count }, () => {
    const depth = rnd(); // 0 = far (small, dim, slow) → 1 = near
    const vars = [
      `--x:${between(2, 98, 1)}%`, `--y:${between(4, 96, 1)}%`,
      `--d:${(1.5 + depth * 3).toFixed(1)}px`, `--o:${(0.25 + depth * 0.5).toFixed(2)}`,
      `--dx:${between(-80, 80)}px`, `--dy:${between(-140, -40)}px`,
      `--t:${(17 - depth * 7 + rnd() * 3).toFixed(1)}s`, `--g:${between(3, 7, 1)}s`,
      `--delay:-${between(0, 30, 1)}s`, `--p:${(-20 - depth * 100).toFixed(0)}px`,
    ];
    return `<span class="spark" style="${vars.join('; ')}"></span>`;
  }).join('');
}

/* The section's cursor: a four-point star on the pointer and a smaller sparkle that trails it */
const star = (cls, attr) => `<svg class="${cls}" ${attr} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 0C12.6 7.6 16.4 11.4 24 12 16.4 12.6 12.6 16.4 12 24 11.4 16.4 7.6 12.6 0 12 7.6 11.4 11.4 7.6 12 0Z"/></svg>`;

export function renderCampaign(data, { edit: editKey, product: slug, image = 0, background = 'var(--color-studio-umber)', position = '' } = {}) {
  const edit = data.edits[editKey];
  const p = data.products.find((x) => x.slug === slug);
  const img = p?.images[image];
  if (!edit || !img) return '';
  return `
    <section class="campaign" data-campaign aria-labelledby="campaign-title" style="--cc:${esc(background)}">
      <div class="campaign__media">
        <img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async"${position ? ` style="--pos:${esc(position)}"` : ''}>
      </div>
      <div class="campaign__sparks" aria-hidden="true">${renderSparks()}</div>
      <div class="container campaign__content" data-reveal>
        <p class="eyebrow campaign__eyebrow">The campaign</p>
        <h2 class="campaign__title" id="campaign-title"><a class="campaign__link" href="/edits/${esc(editKey)}">${esc(edit.title)}</a></h2>
        <p class="campaign__line">${esc(edit.descriptor)}</p>
        <span class="link link--on-dark" aria-hidden="true"><span class="link__label">Explore the edit</span><span class="link__arrow">→</span></span>
      </div>
      ${star('campaign__cursor campaign__cursor--star', 'data-campaign-cursor')}
      ${star('campaign__cursor campaign__cursor--sparkle', 'data-campaign-cursor-trail')}
    </section>`;
}
