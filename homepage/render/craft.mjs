// The Craft page (/craft): a hero film of the crafts with photographs over it, the Bagh lookbook, Kalamkari told in depth, the Handloom
// Mark, and a closing call to the collection. Photographs do most of the work; copy lives in craft-content.mjs.
//
// Media (interim items are reused from the site; replace after the shoot):
//   hero       craft-hero-loop.mp4 (one video: Kalamkari, handloom, zari, silk; built by _tools/build-craft-loop.mjs)
//              and three photos of our own sarees in carved window frames, fixed (craft-content.mjs → reel)
//   lookbook   hero-bagh-wide.jpg (Bagh), pins from craft-content.mjs; the cards' close-ups are crops of bagh-front.jpg
//              and bagh-back.jpg
//   kalamkari  leela.jpg, kahani.jpg and four kalamkari-*.jpg details cut from the Kahani and Leela flats
//   handloom   the homepage loom film (craft-film*.mp4 + poster), interim stock footage
//   closing    hero-tradition.webp / .jpg (the homepage hero photograph, lettering removed)
// The Silk Mark section was taken off this page at the client's request; its copy stays in craft-content.mjs (marks.silk).
import { page, esc, cropImg } from './pdp.mjs';
import { reel, marks, closing, lookbook, kalamkari, crafts } from './craft-content.mjs';
import { windowFrame } from './craft-windows.mjs';

const productsIn = (data, slug) => data.products.filter((p) => (p.categories || []).includes(slug));
const arrowLink = (label, href, extra = '') => `<a class="link${extra}" href="${esc(href)}"><span class="link__label">${esc(label)}</span></a>`;

/* ─── 1. Hero: one craft film, an editorial composition over it ──────
   One landscape frame (16:9, never taller than the screen; a taller frame on phones so the words fit). Layers:
     film     ONE <video>: craft-hero-loop.mp4, every scene and cross-fade already inside the file
              (homepage/_tools/build-craft-loop.mjs). Autoplays muted, loops, plays inline; its poster is the first
              frame, so a slow or failed load shows the same picture.
     cards    three photographs of our sarees, each in a carved Indian window frame (craft-windows.mjs: brass
              jharokha, teak, walnut), hung as one small gallery group to the right of the words: the jharokha (the
              saree worn) is the main piece, the two Kalamkari frames are small pieces either side of it. Each window
              holds one photograph that never changes. Decorative: not links, not buttons, no hover (aria-hidden).
     words    the page title, one line, the button and a text link, over a warm shade.
   There are no visible controls. A pause button exists for keyboard users only: it appears when focused (like a
   skip link), so the moving film can always be stopped (WCAG 2.2.2) without adding anything to the composition. */
function renderHero() {
  const v = reel.video;
  const frames = reel.cards.map((c) => ({ c, w: windowFrame(c.frame, `win-${c.key}`) }));
  // each window's shape (height ÷ width): craft.css hangs the three as one group, edges lined up
  const shapes = frames.map(({ c, w }) => `--hw-${esc(c.key)}:${w.hw}`).join('; ');
  const cards = frames.map(({ c, w }, i) => {
    const ph = c.photo;
    return `
      <div class="craft-hero__card craft-hero__card--${esc(c.key)} craft-window craft-window--${esc(c.frame)}" style="--win:${w.ratio}">
        <div class="craft-hero__frame" style="${w.opening}">
          <img src="${esc(ph.src)}" width="${ph.width}" height="${ph.height}" alt="" decoding="async"${i === 0 ? ' fetchpriority="high"' : ''} style="object-position:${esc(ph.pos || '50% 50%')}">
        </div>${w.svg}
      </div>`;
  }).join('');
  return {
    preload: `<link rel="preload" as="image" href="${esc(v.poster)}" fetchpriority="high">`,
    html: `
  <section class="craft-hero" data-hero data-reel aria-labelledby="craft-title">
    <div class="craft-hero__film" aria-hidden="true">
      <video class="craft-hero__video" data-reel-video autoplay muted loop playsinline preload="auto" poster="${esc(v.poster)}" tabindex="-1">
        <source src="${esc(v.srcMobile)}" type="video/mp4" media="(max-width: 767px)">
        <source src="${esc(v.src)}" type="video/mp4">
      </video>
      <div class="craft-hero__grain"></div>
    </div>
    <div class="craft-hero__cards" style="${shapes}" aria-hidden="true">${cards}
    </div>
    <div class="container craft-hero__content">
      <p class="eyebrow craft-hero__eyebrow">${esc(reel.eyebrow)}</p>
      <h1 class="craft-hero__title" id="craft-title">${esc(reel.title)} <em class="serif">${esc(reel.titleAccent)}</em></h1>
      <p class="craft-hero__line">${esc(reel.line)}</p>
      <div class="craft-hero__actions">
        <a class="button craft-hero__cta" href="${esc(reel.primary.href)}">${esc(reel.primary.label)}</a>
        <a class="link link--on-dark" href="${esc(reel.secondary.href)}"><span class="link__label">${esc(reel.secondary.label)}</span></a>
      </div>
    </div>
    <button type="button" class="craft-hero__pause" data-reel-toggle aria-pressed="false">Pause the film</button>
  </section>`,
  };
}

function markSection(key, data, media) {
  const m = marks[key];
  const count = productsIn(data, m.category).length;
  return `
  <section class="craft-mark craft-mark--${key}" id="${key}-mark" aria-labelledby="${key}-mark-title">
    <div class="container craft-mark__grid">${media}
      <div class="craft-mark__text" data-reveal>
        <p class="eyebrow">${esc(m.eyebrow)}</p>
        <h2 class="t-h2" id="${key}-mark-title">${esc(m.title)}</h2>
        <p class="craft-mark__body">${esc(m.body)}</p>
        ${count ? arrowLink(m.cta, `/categories/${m.category}`) : `<p class="craft-mark__none">${esc(m.none)}</p>`}
      </div>
    </div>
  </section>`;
}


/* ─── 2. Lookbook: one model shot, pins on the saree's details ───────────
   The photograph runs full width as a wide band (about 2.4 : 1, at most 72% of the screen tall) so the section stays
   short; phones get a taller frame. Each pin is a button that opens a small frosted card beside it (on phones, across
   the top or bottom of the photograph): a close-up cut from the saree's own photographs, the detail, and a link to
   the saree. With a mouse the card opens on hover; a tap or Enter opens it on touch and keyboard. The cards float over
   the photograph, so opening one never moves the page, and each card comes right after its pin in the page, so Tab
   goes from a pin into its card. Pins are placed on the photograph itself (x / y in craft-content.mjs); homepage.js
   keeps them on the same spot when the frame crops the photo. Without the script the pins and cards are not shown. */
function renderLookbook(data) {
  const lb = lookbook;
  const p = data.products.find((x) => x.slug === lb.product);
  if (!p) return '';
  const img = lb.image;
  const plus = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
  const view = arrowLink(`View ${p.name}`, `/products/${p.slug}`, ' lookbook__card-link');
  const items = lb.pins.map((pin, i) => {
    const id = `lookbook-card-${i + 1}`;
    const shot = pin.image ? cropImg(p, pin.image, { alt: pin.image.alt, cls: 'lookbook__card-img' }) : '';
    return `
        <button class="lookbook__pin" type="button" data-lookbook-pin data-x="${pin.x}" data-y="${pin.y}" style="--x:${pin.x}%; --y:${pin.y}%; --i:${i}"
                aria-expanded="false" aria-controls="${id}" aria-label="${esc(pin.eyebrow)}: ${esc(pin.title)}">${plus}</button>
        <div class="lookbook__card${shot ? ' has-media' : ''}" id="${id}" role="group" aria-labelledby="${id}-title" data-lookbook-card hidden>${shot ? `
          <div class="lookbook__card-media">${shot}</div>` : ''}
          <div class="lookbook__card-body">
            <p class="lookbook__card-eyebrow">${esc(pin.eyebrow)}</p>
            <h3 class="lookbook__card-title" id="${id}-title">${esc(pin.title)}</h3>
            <p class="lookbook__card-text">${esc(pin.text)}</p>
            ${view}
          </div>
          <button class="lookbook__card-close" type="button" data-lookbook-close aria-label="Close">${plus}</button>
        </div>`;
  }).join('');
  return `
  <section class="lookbook section" aria-labelledby="lookbook-title" data-lookbook>
    <header class="container lookbook__head" data-reveal>
      <p class="eyebrow">${esc(lb.eyebrow)}</p>
      <h2 class="t-h2" id="lookbook-title">${esc(lb.title)} <em class="serif">${esc(lb.titleAccent)}</em></h2>
      <p class="lookbook__hint"><span class="lookbook__hint-hover">Hover over a point on the saree to see its detail.</span><span class="lookbook__hint-touch">Tap a point on the saree to see its detail.</span></p>
    </header>
    <figure class="lookbook__frame" data-lookbook-frame style="--focus:${esc(lb.focus)}; --focus-phone:${esc(lb.focusPhone || lb.focus)}">
      <img class="lookbook__img" data-lookbook-img src="${esc(img.src)}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async" alt="${esc(img.alt)}">
      <div class="lookbook__pins">${items}
      </div>
    </figure>
    <p class="container lookbook__caption"><span>${esc(p.name)}</span> · ${esc(p.descriptor)}${p.price != null ? ` · ₹ ${p.price.toLocaleString('en-IN')}` : ''}</p>
  </section>`;
}

/* ─── 3. Kalamkari: one craft, told in depth ─────────────────────────
   An editorial chapter in three movements, all on Ivory so the textiles carry the colour (brand §9.4: indigo,
   madder and ochre come from the photographs, not from painted fields):
     open        the headline and introduction beside a layered pair: Leela worn, and a detail of her medallion
     the art     the two traditions as mirrored spreads; each a large detail with a smaller one laid over it
     process     the traditional steps beside Kahani worn, as a numbered list
   Photographs settle in on reveal (homepage.js reveal + a slow scale in craft.css), staggered within each pair. */
function kkFigure(img, cls, { sizes = '', eager = false } = {}) {
  const pos = img.pos ? ` style="object-position:${esc(img.pos)}"` : '';
  return `
        <figure class="${cls}" data-reveal>
          <div class="kalamkari__frame" style="--ar:${img.width} / ${img.height}"><img src="${esc(img.src)}" width="${img.width}" height="${img.height}" alt="${esc(img.alt)}" ${eager ? '' : 'loading="lazy" '}decoding="async"${sizes}${pos}></div>${img.caption ? `
          <figcaption class="kalamkari__caption">${esc(img.caption)}</figcaption>` : ''}
        </figure>`;
}

function renderKalamkari(data) {
  const k = kalamkari;
  const facts = (list) => `
          <dl class="kalamkari-art__facts">${list.map(([t, d]) => `
            <div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}
          </dl>`;
  const arts = k.traditions.map((t, i) => {
    const count = t.category ? productsIn(data, t.category).length : 0;
    return `
      <article class="kalamkari-art kalamkari-art--${esc(t.key)}${i % 2 ? ' kalamkari-art--mirror' : ''}" aria-labelledby="kalamkari-${esc(t.key)}-title">
        <div class="kalamkari-art__media${t.inset ? ' has-inset' : ''}">${kkFigure(t.main, 'kalamkari-art__main')}${t.inset ? kkFigure(t.inset, 'kalamkari-art__inset') : ''}
        </div>
        <div class="kalamkari-art__text" data-reveal>
          <p class="eyebrow kalamkari-art__index"><span>${esc(t.no)}</span><span aria-hidden="true">—</span>${esc(t.label)}</p>
          <h3 class="t-h2 kalamkari-art__title" id="kalamkari-${esc(t.key)}-title">${esc(t.name)} <em class="serif">Kalamkari</em></h3>
          <p class="kalamkari-art__body">${esc(t.body)}</p>${facts(t.facts)}${count ? `
          ${arrowLink(t.cta, `/categories/${t.category}`, ' kalamkari-art__link')}` : ''}
        </div>
      </article>`;
  }).join('');

  const pr = k.process;
  const steps = pr.steps.map(([title, text], i) => `
            <li class="kalamkari-process__step">
              <span class="kalamkari-process__no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <h4 class="kalamkari-process__name">${esc(title)}</h4>
              <p class="kalamkari-process__line">${esc(text)}</p>
            </li>`).join('');

  return `
  <section class="kalamkari" id="kalamkari" aria-labelledby="kalamkari-title">
    <div class="container kalamkari-open">
      <div class="kalamkari-open__text" data-reveal>
        <p class="eyebrow">${esc(k.eyebrow)}</p>
        <h2 class="kalamkari-open__title" id="kalamkari-title">${esc(k.title)} <span>${esc(k.titleRest)}</span> <em class="serif">${esc(k.titleAccent)}</em></h2>
        <p class="kalamkari-open__intro">${esc(k.intro)}</p>
        <p class="kalamkari-open__name">${esc(k.name)}</p>
      </div>
      <div class="kalamkari-open__media">${kkFigure(k.open.main, 'kalamkari-open__main')}${kkFigure(k.open.inset, 'kalamkari-open__inset')}
      </div>
    </div>

    <div class="container kalamkari-arts">
      <header class="kalamkari-arts__head" data-reveal>
        <p class="eyebrow">${esc(k.artsEyebrow)}</p>
        <p class="kalamkari-arts__note">${esc(k.artsNote)}</p>
      </header>${arts}
    </div>

    <div class="container kalamkari-process">
      <div class="kalamkari-process__media">${kkFigure(pr.image, 'kalamkari-process__figure')}
      </div>
      <div class="kalamkari-process__text">
        <header data-reveal>
          <p class="eyebrow">${esc(pr.eyebrow)}</p>
          <h3 class="t-h2" id="kalamkari-process-title">${esc(pr.title)} <em class="serif">${esc(pr.titleAccent)}</em></h3>
        </header>
        <ol class="kalamkari-process__steps" data-reveal>${steps}
        </ol>
        <p class="kalamkari-process__note" data-reveal>${esc(pr.note)}</p>
      </div>
    </div>
  </section>`;
}

/* ─── 3b. The other crafts: Banarasi, Bandhani, Block prints, Chanderi ───────────────────
   One chapter each, built like the Kalamkari opening (same type, same layered pair of photographs), with the
   photograph on alternate sides so the page reads as a sequence of spreads. Facts as in the Kalamkari traditions, and
   a link to the category when it has sarees. A craft with no photograph yet shows a plain panel saying so. */
function renderCrafts(data) {
  return crafts.map((c, i) => {
    const count = c.category ? productsIn(data, c.category).length : 0;
    const media = c.main
      ? `${kkFigure(c.main, 'kalamkari-open__main')}${c.inset ? kkFigure(c.inset, 'kalamkari-open__inset') : ''}`
      : `
        <div class="craft-chapter__empty" data-reveal><span>${esc(c.title.replace(/\s*—$/, ''))} sarees</span><span>Coming soon</span></div>`;
    return `
  <section class="kalamkari craft-chapter${i % 2 === 1 ? ' craft-chapter--mirror' : ''}" id="${esc(c.key)}" aria-labelledby="${esc(c.key)}-title">
    <div class="container kalamkari-open">
      <div class="kalamkari-open__text" data-reveal>
        <p class="eyebrow">${esc(c.eyebrow)}</p>
        <h2 class="kalamkari-open__title" id="${esc(c.key)}-title">${esc(c.title)} <span>${esc(c.titleRest)}</span> <em class="serif">${esc(c.titleAccent)}</em></h2>
        <p class="kalamkari-open__intro">${esc(c.intro)}</p>
        <p class="kalamkari-open__name">${esc(c.name)}</p>
        <dl class="kalamkari-art__facts">${c.facts.map(([t, d]) => `
          <div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}
        </dl>${count ? `
        ${arrowLink(c.cta, `/categories/${c.category}`, ' kalamkari-art__link')}` : ''}
      </div>
      <div class="kalamkari-open__media${c.main ? '' : ' is-empty'}">${media}
      </div>
    </div>
  </section>`;
  }).join('');
}

export function renderCraftPage(data) {
  const handloomMedia = `
      <figure class="craft-mark__media craft-mark__media--film" data-craft-scope data-reveal>
        <video class="craft-mark__video" data-craft-video muted loop playsinline preload="none" poster="/assets/images/craft-film-poster.jpg"
               aria-label="A weaver's hands working a silk handloom, the shuttle passing across pink silk">
          <source src="/assets/video/craft-film-720.mp4" type="video/mp4" media="(max-width: 767px)">
          <source src="/assets/video/craft-film.mp4" type="video/mp4">
        </video>
        <button class="craft-mark__toggle" type="button" data-craft-toggle aria-pressed="false">Pause</button>
      </figure>`;
  const hero = renderHero();

  const body = `
${hero.html}
${renderLookbook(data)}
${renderKalamkari(data)}
${renderCrafts(data)}

${markSection('handloom', data, handloomMedia)}

  <section class="craft-close" aria-labelledby="craft-close-title">
    <picture class="craft-close__media">
      <source type="image/webp" srcset="/assets/images/hero-tradition.webp" width="2042" height="770">
      <img src="/assets/images/hero-tradition.jpg" width="2042" height="770" loading="lazy" decoding="async"
           alt="A woman in a Kalamkari saree with a mustard and red border and gold jhumkas, holding the pallu open as it sweeps across the frame in warm light">
    </picture>
    <div class="container craft-close__content" data-reveal>
      <p class="eyebrow craft-close__eyebrow">${esc(closing.eyebrow)}</p>
      <h2 class="craft-close__title" id="craft-close-title"><a class="craft-close__link" href="${esc(closing.href)}">${esc(closing.title)}</a></h2>
      <span class="link link--on-dark" aria-hidden="true"><span class="link__label">Shop all sarees</span></span>
    </div>
  </section>`;

  return page({
    title: 'The art of the saree | Stylish Naari',
    description: 'The crafts behind Stylish Naari sarees: Kalamkari painted and printed by hand, Banarasi silk and zari, Bandhani, block printing and Chanderi, weaving on the handloom, and what the Handloom Mark means.',
    ogImage: '/assets/images/hero-tradition.jpg',
    preload: hero.preload,
    mainClass: 'craft-page',
    styles: ['/assets/css/craft.css'],
    body,
  });
}
