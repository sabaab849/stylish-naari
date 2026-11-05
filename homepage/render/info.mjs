// Customer-help pages: /faq, /shipping, /returns, /care, /contact.
// One shared layout (title block, an "On this page" list, readable sections, a "More help" footer) so the five
// pages read as one family with the rest of the site. Copy lives in render/info-content.mjs.
import { page, esc } from './pdp.mjs';
import { HELP_LINKS, faq, shipping, returns, care, contact } from './info-content.mjs';

export const INFO_PAGES = { faq, shipping, returns, care, contact };

const slugify = (v) => String(v).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Inline text: escape, then [[text|/href]] → link, and any [Insert …] / [Confirm …] → a marked placeholder */
function inline(text) {
  return esc(text)
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (m, label, href) => `<a class="info__link" href="${href}">${label}</a>`)
    .replace(/\[((?:Insert|Confirm)[^\]]*)\]/g, (m, inner) => `<mark class="placeholder" title="Placeholder: awaiting client confirmation">[${inner}]</mark>`);
}

function blocks(list) {
  return list.map((b) => {
    if (b.p) return `<p>${inline(b.p)}</p>`;
    if (b.ul) return `<ul class="info__list">${b.ul.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`;
    if (b.ol) return `<ol class="info__steps">${b.ol.map((li) => `<li>${inline(li)}</li>`).join('')}</ol>`;
    if (b.note) return `<p class="info__verify">${inline(b.note)}</p>`;
    return '';
  }).join('\n          ');
}

const head = (p, extra = '') => `
    <header class="info__head">
      <p class="eyebrow">${esc(p.eyebrow)}</p>
      <h1 class="t-h1" id="page-title">${esc(p.title)}</h1>
      <p class="info__intro">${inline(p.intro)}</p>${extra}
    </header>`;

// A visible line on every help page while its copy is placeholder (store.helpPagesDraft in products.json)
const draftNote = (data) => (data.store?.helpPagesDraft === false ? '' : `
      <p class="info__draft">Draft page: details in <mark class="placeholder">[brackets]</mark> are placeholders awaiting confirmation.</p>`);

const toc = (items) => `
      <nav class="info__toc" aria-label="On this page">
        <p class="eyebrow">On this page</p>
        <ul>${items.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('')}</ul>
      </nav>`;

const moreHelp = (current) => `
    <aside class="info-more" aria-labelledby="more-help-title">
      <h2 class="t-h3" id="more-help-title">More help</h2>
      <ul class="info-more__links">${HELP_LINKS.filter(([, href]) => href !== `/${current}`).map(([label, href]) => `
        <li><a class="link" href="${href}"><span class="link__label">${esc(label)}</span><span class="link__arrow" aria-hidden="true">→</span></a></li>`).join('')}
      </ul>
    </aside>`;

const shell = (p, data, inner) => page({
  title: `${p.metaTitle || p.title} | Stylish Naari`,
  description: p.description,
  mainClass: `info info--${p.slug}`,
  styles: ['/assets/css/info.css'],
  scripts: p.slug === 'contact' ? ['/assets/js/contact.js'] : [],
  body: `
  <div class="container">${head(p, draftNote(data))}${inner}${moreHelp(p.slug)}
  </div>`,
});

/* ─── Policy-style pages: Shipping, Returns, Care ─────────── */
function renderSections(p, data) {
  const sections = p.sections.map((s) => `
        <section class="info-section" id="${s.id}" aria-labelledby="${s.id}-title">
          <h2 class="info-section__title" id="${s.id}-title">${esc(s.title)}${s.verify ? ' <span class="info__badge">To be verified</span>' : ''}</h2>
          ${blocks(s.body)}${s.fabrics ? `
          <div class="info-fabrics">${s.fabrics.map(([name, tips]) => `
            <div class="info-fabric">
              <h3 class="info-fabric__title">${esc(name)}</h3>
              <ul class="info__list">${tips.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>
            </div>`).join('')}
          </div>` : ''}
        </section>`).join('');
  return shell(p, data, `
    <div class="info__layout">${toc(p.sections.map((s) => [s.id, s.title]))}
      <div class="info__body">${sections}
      </div>
    </div>`);
}

/* ─── FAQ: categorised accordions (native <details>: keyboard and screen-reader support built in) ─ */
function renderFaq(p, data) {
  const groups = p.groups.map((g) => {
    const id = slugify(g.title);
    return `
        <section class="info-section faq-group" id="${id}" aria-labelledby="${id}-title">
          <h2 class="info-section__title" id="${id}-title">${esc(g.title)}</h2>
          <div class="accordion faq">${g.items.map(([q, a]) => `
            <details class="accordion__item">
              <summary class="accordion__summary">${esc(q)}</summary>
              <div class="accordion__panel">${blocks(a)}</div>
            </details>`).join('')}
          </div>
        </section>`;
  }).join('');
  return shell(p, data, `
    <div class="info__layout">${toc(p.groups.map((g) => [slugify(g.title), g.title]))}
      <div class="info__body">${groups}
        <section class="info-section info-cta" aria-labelledby="faq-contact-title">
          <h2 class="info-section__title" id="faq-contact-title">Still have a question?</h2>
          <p>We’re happy to help with anything about your order or our sarees.</p>
          <a class="button button--outline" href="/contact">Contact us</a>
        </section>
      </div>
    </div>`);
}

/* ─── Contact ─────────────────────────────────────────────────
   The form validates in the browser (assets/js/contact.js). It only reports success when a real
   submission service has accepted the message: set store.support.formEndpoint in products.json
   (or wire the Shopify contact form). Until then it says plainly that the message was not sent. */
function renderContact(p, data) {
  const s = data.store?.support || {};
  const value = (v, placeholder) => (v ? esc(v) : `<mark class="placeholder">${esc(placeholder)}</mark>`);
  const email = s.email ? `<a class="info__link" href="mailto:${esc(s.email)}">${esc(s.email)}</a>` : value(null, '[Insert support email]');
  const field = (id, label, input, { optional = false, hint = '' } = {}) => `
          <div class="field" data-field>
            <label class="field__label" for="${id}">${esc(label)}${optional ? ' <span class="field__optional">(optional)</span>' : ''}</label>${hint ? `
            <p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}
            ${input}
            <p class="field__error" id="${id}-error" data-error hidden></p>
          </div>`;
  const described = (id, hint) => `aria-describedby="${hint ? `${id}-hint ` : ''}${id}-error"`;
  const form = `
        <form class="contact-form" novalidate data-contact-form${s.formEndpoint ? ` data-endpoint="${esc(s.formEndpoint)}"` : ''} aria-labelledby="contact-form-title">
          <h2 class="info-section__title" id="contact-form-title">Send us a message</h2>
          <p class="contact-form__required">All fields are required unless marked optional.</p>${field('contact-name', 'Full name',
            `<input class="field__input" id="contact-name" name="name" type="text" autocomplete="name" required ${described('contact-name')}>`)}${field('contact-email', 'Email address',
            `<input class="field__input" id="contact-email" name="email" type="email" inputmode="email" autocomplete="email" required ${described('contact-email')}>`)}${field('contact-order', 'Order number',
            `<input class="field__input" id="contact-order" name="order" type="text" autocomplete="off" ${described('contact-order', true)}>`, { optional: true, hint: 'If your message is about an order, you’ll find the number in your confirmation email.' })}${field('contact-topic', 'Enquiry type',
            `<select class="field__input field__select" id="contact-topic" name="topic" required ${described('contact-topic')}>
              <option value="">Choose a topic</option>${p.enquiries.map((e) => `
              <option>${esc(e)}</option>`).join('')}
            </select>`)}${field('contact-message', 'Message',
            `<textarea class="field__input field__textarea" id="contact-message" name="message" rows="6" required ${described('contact-message')}></textarea>`)}
          <button class="button button--filled contact-form__submit" type="submit" data-contact-submit>Send message</button>
          <div class="contact-form__status" role="status" aria-live="polite" tabindex="-1" data-contact-status hidden></div>
        </form>`;
  const details = `
        <aside class="contact-details" aria-label="Other ways to reach us">
          <div class="contact-details__item">
            <h2 class="eyebrow">Email</h2>
            <p>${email}</p>
          </div>
          <div class="contact-details__item">
            <h2 class="eyebrow">Support hours</h2>
            <p>${value(s.hours, '[Insert support hours]')}</p>
          </div>${s.phone ? `
          <div class="contact-details__item">
            <h2 class="eyebrow">Phone</h2>
            <p><a class="info__link" href="tel:${esc(s.phone.replace(/\s/g, ''))}">${esc(s.phone)}</a></p>
          </div>` : ''}${s.whatsapp ? `
          <div class="contact-details__item">
            <h2 class="eyebrow">WhatsApp</h2>
            <p><a class="info__link" href="https://wa.me/${esc(s.whatsapp.replace(/\D/g, ''))}">${esc(s.whatsapp)}</a></p>
          </div>` : ''}
          <div class="contact-details__item">
            <h2 class="eyebrow">Quick answers</h2>
            <ul class="contact-details__links">
              <li><a class="info__link" href="/faq">Frequently asked questions</a></li>
              <li><a class="info__link" href="/shipping">Shipping & delivery</a></li>
              <li><a class="info__link" href="/returns">Returns & exchanges</a></li>
            </ul>
          </div>
        </aside>`;
  return shell(p, data, `
    <div class="contact-layout">${form}${details}
    </div>`);
}

export function renderInfoPage(slug, data) {
  const p = INFO_PAGES[slug];
  if (!p) return null;
  if (slug === 'faq') return renderFaq(p, data);
  if (slug === 'contact') return renderContact(p, data);
  return renderSections(p, data);
}
