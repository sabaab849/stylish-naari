# Stylish Naari — project notes for Claude

Storefront prototype for Stylish Naari sarees. No framework: a small Node renderer (`homepage/render/*.mjs`)
fills `homepage/index.html` and renders collection and product pages from `homepage/assets/data/products.json`.

- Preview: `npm run dev` → http://localhost:4321 (restart after editing anything in `homepage/render/`; CSS, JS, JSON and `index.html` are read fresh on every request)
- Build for Vercel: `npm run build` → `dist/`
- Design rules: `brand-guidelines.md` (the source of truth). Tokens: `homepage/assets/css/tokens.css`.

## Typography

Every piece of text on the site uses one of three families and one of the size tokens below.
Never add a new font, weight or hard-coded size without a reason recorded here.

### Families

| Token | Family | Weights | Use |
|---|---|---|---|
| `--font-display` | **Inter Tight** | 400, 500, 600 | Headlines, product names, navigation, buttons, eyebrows, labels (600: header navigation only) |
| `--font-body` | **Inter** | 400, 500 | Paragraphs, descriptions, captions, form text |
| `--font-accent` | **Instrument Serif**, *italic only* | 400 | One or two words of emphasis inside a headline (`<em class="serif">`), the PDP name meaning |

Loaded from Google Fonts with `display=swap` in `index.html` and the page template in `render/pdp.mjs`
(the two `<link>` tags must stay identical). No bold (700) and no light (300) anywhere. Inter Tight 600
(`--font-weight-semibold`) is loaded for one use only: the header navigation links (client request, Nov 2026: at
500 they read too light).

**Text inside images:** none. Headlines are always live text over or beside a photograph, never baked into
the artwork, so they stay sharp, readable on phones and in the site's type. If a supplied campaign image
has lettering in it, remove the lettering and set the words in HTML (see the "Tradition in every thread"
banner on the homepage: `assets/images/hero-tradition.webp`, cleaned from `model photography/Tradition in Every
Thread v2 (with lettering).png`, kept lossless so the saree print is exactly as shot).

### Size scale (fluid)

All sizes are `clamp(min, preferred, max)` in `tokens.css`, so they grow smoothly with the screen — there
are no separate font files or font-size overrides per device. Approximate rendered sizes:

| Token | Phone 390px | Tablet 820px | Desktop 1440px | Line height | Tracking | Used for |
|---|---|---|---|---|---|---|
| `--font-size-display` | 52px | 73px | 104px | 0.95 | −0.035em | Rare, very large statements |
| `--font-size-h1` | 36px | 49px | 64px | 1.0 | −0.03em | Page titles (collection, product name) |
| `--font-size-headline-caps` | 32px | 44px | 60px | 0.98 | −0.015em | UPPERCASE campaign headlines: hero, homepage banners |
| `--font-size-h2` | 28px | 32px | 40px | 1.08 | −0.02em | Section headings |
| `--font-size-h3` | 18px | 19px | 21px | 1.25 | −0.01em | Card titles, sub-headings, footer heading |
| `--font-size-body-lg` | 17px | 18px | 19px | 1.5–1.6 | 0 | Intro paragraphs, banner lines |
| `--font-size-body` | 15px | 15px | 16px | 1.6 | 0 | Body copy |
| `--font-size-product` | 14px | 14px | 15px | 1.3–1.4 | 0 | Product card name, descriptor, price |
| `--font-size-header-nav` | — | 14px | 15px | — | 0 | Header navigation links, Inter Tight 600 (hidden on phones) |
| `--font-size-nav` / `--font-size-button` | 14px | 14px | 14px | — | 0.01em | Filter and sort controls, form labels, buttons, text links |
| `--font-size-caption` | 12px | 12px | 13px | 1.45 | 0 | Captions, notes, legal |
| `--font-size-eyebrow` | 11px | 11px | 12px | 1.2 | 0.14em | UPPERCASE eyebrows and labels (Inter Tight 500) |

Body text never goes below 15px and no text below 11px. Input fields use 16px so phones don't zoom.

### Breakpoints

| Name | Width | What changes for type |
|---|---|---|
| Desktop | ≥ 1280px | Full scale; page margin 48px |
| Laptop | 1024–1279px | Page margin 40px |
| Tablet | 768–1023px | Page margin 32px; most banners keep text over the photo with a wider shade |
| Phone | ≤ 767px | Page margin 16px; text that sat over a photo moves below it on a solid colour; long headings wrap |

Sizes come from the fluid tokens, not from these breakpoints. Use the breakpoints only for layout
(where text sits, how wide it can run), not to set new font sizes.

### Rules

- **Case:** sentence case for headings and buttons. UPPERCASE only for eyebrows/labels (Inter Tight 500,
  `--letter-spacing-eyebrow`) and the approved caps headlines (hero, homepage banners, PDP colour name).
- **Weight:** 400 for headlines (they are large enough); 500 for product names, buttons and eyebrows; 600 for the
  header navigation links only.
- **Measure:** paragraphs `max-width: 22–36em`; headlines `max-width` in `em` so they break into 2–3 lines.
- **Text on photographs:** ivory (`--color-ivory`) on a warm shade gradient behind the words only, never
  a box. Contrast must reach 4.5:1 for body-size text; where it can't on a phone, stack the text below
  the image on a solid colour.
- **Section display sizes:** a few sections size their headline to fit their own frame (colour chapter,
  "The Saree, Unfolded", campaign titles). Those use `clamp()` with a `vw` term so they stay fluid; keep
  the minimum at or above `--font-size-h2` and record any new one here.
- **Image captions (PDP gallery):** Inter 400 at `--font-size-eyebrow` (11 → 12px), sentence case, no tracking,
  `--color-text-muted`, one line under the photograph (`.pdp-gallery__caption`). Every slide is captioned by what it
  really is (`render/pdp.mjs` → `isActual`): real photos of the saree (product shots, Drive pendrive / catalogue photos,
  `images[].actual`) read "Actual product photograph"; AI-made images, including close-ups and crops cut from them, read
  "Styled imagery for representation"; real photoshoot sarees (`photoshoot: true`) carry no caption on their model photos.
  New sarees: add them to `_tools/set-captions.cjs` if they are a real shoot or have real close-ups.
- **New text:** pick the role from the table above and use its tokens (`font-family`, `font-size`,
  `line-height`, `letter-spacing`). Check it at 390px, 820px and 1440px before finishing.

**Ways to pay:** logos, never text pills. SVGs in `assets/images/payments/` (UPI, Visa, Mastercard, RuPay; UPI and RuPay
lettering is outlined to paths so it never depends on a font), then a line bank icon + "Net banking" after a hairline.
PDP: `render/pdp.mjs` → `paymentMethods()` from `store.checkout.methods`; bag drawer: the same markup in
`partials/header.html`. Styles: `shop.css` → `.pay-methods`.

## Spacing

One responsive scale, in `tokens.css`. Use these tokens for page gutters, section gaps, grid and column gaps,
component padding, image-to-text and type spacing. Don't add one-off pixel values.

| Token | Phone → desktop | Use |
|---|---|---|
| `--space-2xs` | 4px | Hairline offsets, icon-to-label |
| `--space-xs` | 8 → 12px | Gallery gaps, tight stacks (title → descriptor) |
| `--space-sm` | 12 → 16px | Label → value, image → caption |
| `--space-md` | 16 → 24px | Component padding, card text, gutters inside a block |
| `--space-lg` | 24 → 32px | Between groups inside a section |
| `--space-xl` | 32 → 48px | Heading block → content, panel padding |
| `--space-2xl` | 40 → 64px | Large internal breaks |
| `--space-3xl` | 48 → 80px | Page-title blocks (collection, help pages) |
| `--section-spacing` | 56 → 96px | Between sections, on every page |
| `--section-header-gap` | 20 → 32px | Section heading → its content |
| `--page-margin` | 16 / 32 / 40 / 48px | Page gutters (phone / tablet / laptop / desktop) |
| `--grid-gutter` | 12 / 16 / 20 / 24px | Column gaps |

The older fixed steps `--spacing-1…12` remain for existing rules; `--spacing-10` and `--spacing-11` now scale with
the screen. Pages no longer override `--section-spacing` (the homepage and PDP used to); change the token instead.

**Header height:** `--header-height` is 80px on tablet and up (72px until Nov 2026) and 56px on phones. Everything
that sits below the header or sticks under it (page tops, the PDP's sticky columns, the menus) uses the token, so
change the token, never a page.

**PDP layout** (`pdp.css` → "PDP layout: thumbnail rail + main image, sticky details"; modelled on houseofmasaba.com's PDP):
- Desktop (≥1024): a vertical thumbnail rail (every view: portraits, close-ups, border, folded/laid-flat shot, film)
  on the left, ONE main photograph beside it, and the details (`minmax(360px, 560px)`), centred together as one group
  so the space either side is equal. Photo width `--pdp-photo-w` = the larger of "fits the screen height" and 36vw,
  at most 660px, and never so wide that the details drop below 360px. Never move the rail below the photograph on desktop.
- Frame shape: 3:4 when the first photo has a `frame`; otherwise the first photo's own shape, never wider than square.
- Model photos are cropped to a 3:4 window around the model and the saree so the backdrop doesn't dominate:
  `products.json` → `images[].frame` = { x, y, w, h } as shares of the photo (`render/pdp.mjs` turns it into
  `--fw` / `--fx` / `--fy`). Set one for every new model photo; catalogue photos without a frame are shown whole.
- The whole details column is ONE sticky element (`top: var(--pdp-sticky-top)`); never make parts of it sticky.
  The gallery is sticky too: in the shared row only the shorter column can move (usually the photograph holds
  beside the longer details). A photograph taller than the screen sticks by its bottom edge (negative `top`). Both live in `.pdp-hero`, so nothing can run into the next section. The rail scrolls
  on its own if it outgrows the photograph (`pdp.js` keeps the chosen thumbnail in view by scrolling the rail only).
- Buy bar: once the main Add to bag button scrolls away (until the footer), a bar pinned to the bottom shows the
  photo, name, price and Add to bag, on every screen size (`pdp.js` → `[data-buybar]`).
- Tablet (768–1023): rail + photograph side by side, centred, photo no taller than ~76% of the screen; details below.
- A saree with a single portrait normally gets two fabric close-ups cut from it (crops.border, crops.swatch) as slides
  2–3. `galleryListed: true` instead shows every photo in its listed order with nothing cut from them: the November 16
  sarees (`_tools/add-nov16.cjs`) run model portrait → original product photo (the Drive "SN-0xx – 01 (primary)",
  unedited, on its own black backdrop) → print → border. The print is the WHOLE Drive shot of the print (zoomed out, never one motif); the border is the
  WHOLE Drive shot that shows the border beside the print, uncut, on ivory (fit: contain): never a crop of the border
  alone, never made up when Drive has no shot (Megh has none). Black studio backdrop → page ivory
  (`_tools/originals-nov16.ps1`, then `_tools/set-borders-nov16.cjs`). All three carry the
  "Actual product photograph" caption (role "product").
- No saree has two PDPs. When a model PDP exists for a catalogue saree, the folded catalogue PDP (or that colour of a
  multi-colour one) is removed and redirects to the model PDP, which takes over its price and fabric
  (`_tools/dedupe-folded.cjs`, run after any add-*.cjs; it lists every match).
- Premium Semi-Silk sarees (Surmai … Laali, `_tools/convert-semi-silk.ps1` + `add-semi-silk.cjs`, then `dedupe-folded.cjs`):
  model photo, then slides 2–4 from the Drive pendrive folder of the saree's SN (its own photo, a print close-up, another
  view). Those are whole photos, never cropped; a landscape photo is turned upright (90° clockwise) so it fills the
  portrait frame (`fit: cover`), longest side 2400px.
- The second gallery slide always fills the frame edge to edge, never shown whole with bands at the sides (client,
  17 Nov 2026; `render/pdp.mjs`, after the views are built). Later slides keep their own `fit`.
- One model photograph per product (client, Nov 2026): slide 1 is the only photo of the model; later slides are the
  original product photos and fabric close-ups. Never add a second pose, back view or portrait (`_tools/one-model-photo.cjs`).
- No border-only slides (client, Nov 2026): a photo that shows the border beside plain body cloth, with none of the
  print, is not a gallery slide. It stays in `images` with `gallery: false` (crops still use it by index; `render/pdp.mjs`
  skips it, and skips crops cut from it). List: `_tools/hide-border-only.cjs` — check every new saree's border shot by eye.
- First-shoot Banarasi sarees (Kairi, Jamun, Neel, Bagh): model photo → real folded photo (`images[].second: true`, from the
  Drive folder "Stylissh Naari" flat-lays, turned upright: `_tools/originals-firstshoot.ps1` + `add-originals-firstshoot.cjs`)
  → border crop → print crop. Kairi = IMG_7947, Bagh = IMG_7944. No flat-lay of Jamun or Neel in that folder yet (Jamun's real
  model shoot is IMG_8016–8029). The gallery caps crop zoom at 2.4, so `crops.border` and `crops.swatch` must point at
  different spots (hem border vs body print) or the two slides look the same.
- Phone (≤767): full-width swipe gallery with a horizontal thumbnail strip under it; details below. Nothing sticky
  below 1024px except the buy bar (`pdp.js` swipe mode is `max-width: 767px`).

## Categories

By craft, never by state (client, 17 Nov 2026): **Banarasi** (subcategories **Premium silk** and **Premium semi-silk**),
**Kalamkari**, **Bandhani**, **Block prints**, **Chanderi**, plus the certified (`mark`) and `more` pages. Defined in
`products.json` → `categories` by `_tools/set-categories.cjs` (run it after any add-*.cjs; it also remaps old slugs).
A subcategory has `parent`; a saree in it carries both slugs. Banarasi subcategory = the Drive workbook "Pendrive Photo
Audit – Banarasi": SN-001…049 Premium silk, SN-050…091 Premium semi-silk; every SN saree is Banarasi. Banarasi sarees with
no SN (first shoot, AI model sarees) have no subcategory until the client says. Old state-wise links
(`banaras-ki-bunkari` …) redirect via `categories[].formerly` / `categoryRedirects` (serve.mjs 301, build.mjs forwarding
page). Shown in: homepage tiles (`render/categories.mjs`, top-level crafts only; the Banarasi subcategories are not listed on the homepage: client, Nov 2026), the header
mega menu "By category" (`partials/header.html`, hand-written: keep it in step), category pages with an "All Banarasi ·
Premium silk · Premium semi-silk" tab row. Ikat sarees (Rangoli, Saanjh, Sindoor) and a few others have no category yet.
Kalamkari model sarees Veena, Darbar, Chitra, Gajraj, Bansuri: `_tools/convert-kalamkari.ps1` + `add-kalamkari.cjs`.
Bandhani (not "Bandhej": client, 17 Nov 2026; `/categories/bandhej` redirects) model sarees Chunari, Sakhi, Jamuni, Bindiya,
Gulabo, Lavanya: `_tools/convert-bandhani.ps1` + `add-bandhani.cjs`; Anaar is Bandhani too.
Block print sarees (15): `_tools/convert-blockprint.ps1` + `add-blockprint.cjs`, then `set-captions.cjs` (the eleven WhatsApp
"IMG-2026…" photos are a real shoot: photoshoot, no caption; Rekha, Syahi, Raat, Mehrab are AI) and `set-categories.cjs`.

## Policy pages

`/shipping`, `/exchanges`, `/privacy`, `/terms` and `/faq` (copy in `render/info-content.mjs`, layout in `render/info.mjs`,
footer column "Policies"). Terms are the client's (launch questions reply, 17 Nov 2026). Shipping is **free across India on
every order** — a fixed business rule, never add a charge or threshold; outside India, charges are given by email. Dispatch
4–12 days (by availability, confirmed by email, working days only), delivery 6–12 working days, tracking within 24–48 hours,
no cash on delivery; these must match `store.shipping` in `products.json`. No returns; exchanges only for damage or misprints,
within 14 days, unused with tags, unboxing video required, never for handloom, customised or sale items; customer pays
exchange shipping; settled with a store credit note valid 15 days. Business (registered as "Stylissh Naari"): Brindaban Complex, Majiwada,
Thane West; GSTIN 27AVTPM2829F2Z5; support stylisshnaari3552026@gmail.com, +91 73048 12124 (`store.support`); disputes: courts of Mumbai. A page shows the "Draft page" line only while its copy still contains
`[Insert …]` / `[Confirm …]`.
