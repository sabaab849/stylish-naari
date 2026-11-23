# Stylissh Naari — project notes for Claude

Storefront prototype for Stylissh Naari sarees (the brand is spelt "Stylissh Naari", double s, everywhere on the site and in the wordmark: client, 18 Nov 2026; the folder and Vercel URL keep the old spelling). No framework: a small Node renderer (`homepage/render/*.mjs`)
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

- **Case:** Title Case for every heading, h1–h6 (client, 20 Nov 2026; applied to every finished page in `render/includes.mjs` → `headingCase`, so write copy any way you like; minor words like "of" and "the" stay lower case). Sentence case for buttons. UPPERCASE only for eyebrows/labels (Inter Tight 500,
  `--letter-spacing-eyebrow`) and the approved caps headlines (hero, homepage banners, PDP colour name).
- **Small sub-headings in body copy** (the PDP "Shipping & return" panel: Shipping, Returns & exchanges, Import duty): `--font-size-body`, the same size as the text under them; Inter Tight 500 in ink over Inter 400 muted: weight and colour make the hierarchy, never size (client, 20 Nov 2026).
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
  "Styled imagery for representation"; real photoshoot sarees (`photoshoot: true`) read "Actual product photograph" on their model photos too (client, 20 Nov 2026; was no caption).
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

**Header height:** `--header-height` is 112px on tablet and up (72px, then 80px, until the logo went in: client, 20 Nov 2026) and 64px on phones. The logo is the client's full emblem + script wordmark (`assets/images/logo.png`, white, over the hero; `logo-dark.png`, white parts in ink, on the solid ivory header), 72px tall on tablet and up and 48px on phones (scaled down: client, 21 Nov 2026), centred, no lines beside it (`homepage.css` → `.site-header__logo`). Both were cut from a file with a baked-in checkerboard, so ask the client for a real transparent PNG or SVG. Everything
that sits below the header or sticks under it (page tops, the PDP's sticky columns, the menus) uses the token, so
change the token, never a page.

**PDP layout** (`pdp.css` → "PDP layout: thumbnail rail + main image, sticky details"; modelled on houseofmasaba.com's PDP):
- Desktop (≥1024): a vertical thumbnail rail (every view: portraits, close-ups, border, folded/laid-flat shot, film)
  on the left, ONE main photograph beside it, and the details (`minmax(360px, 560px)`), centred together as one group
  so the space either side is equal. Photo width `--pdp-photo-w` = the larger of "fits the screen height" and 36vw,
  at most 660px, and never so wide that the details drop below 360px. Never move the rail below the photograph on desktop.
- Frame shape: 3:4 when the first photo has a `frame`; otherwise the first photo's own shape, never wider than square.
  Full-length first photo (client, 20 Nov 2026): Genda, Elaichi, Kesar, Nilofer, Alta, Hiran, Gulaabi show their first photo whole
  (no `frame`, 2:3), head to hem: `_tools/full-length-first.cjs`, run after any script that sets frames.
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
  portrait frame (`fit: cover`), longest side 2400px. Slide order: model → folded → print → border beside the print →
  blouse piece (client, 19 Nov 2026; checked against Drive "Original folded images", `_tools/semi-silk-slides.cjs`).
  SN-057 – 02 in Drive is not Surmai (teal jaal): never use it.
- The second gallery slide always fills the frame edge to edge, never shown whole with bands at the sides (`images[].keepWhole: true` would show it whole with bands; the client tried it on Elaichi, 23 Nov 2026, and preferred the fill) (client,
  17 Nov 2026; `render/pdp.mjs`, after the views are built). Later slides keep their own `fit`.
- Blouse piece (client, 18 Nov 2026): the last slide, role "blouse", caption "Blouse piece, actual product photograph", and
  the details row "Blouse piece" (always shown when set). From Drive folder "2day" (folders 49–92, matched to products by
  comparing photos, not by number: the folder numbers are not SNs). `_tools/add-blouse.cjs` lists the 10 sarees, the 4
  matched ones with no blouse photo, and the 30 folders with no site product. Premium Silk sarees (client, 19 Nov 2026): from
  the "day1" shoot (Drive folder 1pJXlePZQ8OwY0l8eE95p89qQB0kyMhgk = the Premium Silk pendrive SN folders on G:), the plain
  cloth + border shot, usually photo 05; turned so the border runs along the bottom (`_tools/blouse-day1.ps1` +
  `add-blouse-day1.cjs`, 25 sarees incl. Neem's embroidered neckline). A blouse piece can have a different weave or print
  from the saree: Surmai, Jaswand, Saunf and Khubani (2day 53/6, 55/5, 64/5, 75/4) were added that way, same scripts. No blouse shot: Kattha, Aasmaan, Kamal, Moti, Mehfil,
  Firoza; Megh has no SN folder.
- One model photograph per product (client, Nov 2026): slide 1 is the only photo of the model; later slides are the
  original product photos and fabric close-ups. Never add a second pose, back view or portrait (`_tools/one-model-photo.cjs`).
- No border-only slides (client, Nov 2026): a photo that shows the border beside plain body cloth, with none of the
  print, is not a gallery slide. It stays in `images` with `gallery: false` (crops still use it by index; `render/pdp.mjs`
  skips it, and skips crops cut from it). List: `_tools/hide-border-only.cjs` — check every new saree's border shot by eye.
- First-shoot Banarasi sarees Kairi, Jamun, Neel, Bagh (client, 23 Nov 2026, replaces the note below): the folded / laid-flat photos are NOT these sarees and are removed. Gallery = model photo → border zoom → print zoom (`<slug>-border-zoom.jpg`, `<slug>-print-zoom.jpg`, cut from the ~1100px model photo: light nlmeans, spline scaling to 1320×1760, no sharpening), galleryListed; circles from those zooms. The old note below is superseded; add-originals-firstshoot.cjs and detail-slides-from-original.cjs no longer touch them. Larger camera originals of the model photos would make the zooms sharper.
- First-shoot Banarasi sarees (Kairi, Jamun, Neel, Bagh): model photo → real folded photo (`images[].second: true`, from the
  Drive folder "Stylissh Naari" flat-lays, turned upright: `_tools/originals-firstshoot.ps1` + `add-originals-firstshoot.cjs`)
  → border crop → print crop. Kairi = IMG_7947, Bagh = IMG_7944. Kahani and Leela (client, 20 Nov 2026): their laid-flat product photo is slide 2 the same way (`second: true`). No flat-lay of Jamun or Neel in that folder yet (Jamun's real
  model shoot is IMG_8016–8029). The gallery caps crop zoom at 2.4, so `crops.border` and `crops.swatch` must point at
  different spots (hem border vs body print) or the two slides look the same.
- "In detail" circles (client, 19 Nov 2026): fabric & colour, border and motif are cut only from real photos of the saree
  (`products.json` → `features`, set by `_tools/set-feature-crops.cjs`; otherwise only crops whose image passes
  `render/pdp.mjs` → `isRealPhoto`). "As styled" keeps the model photo. A saree with no real photo has no section.
- Colour siblings (client, 20 Nov 2026): one print in several colours, each its own named saree and page, linked by a
  "Colour" row of square chips under the price (`products.json → colourSiblings`, the same slug list on each member;
  `render/pdp.mjs` → `renderColourSiblings`). First set: SN-002 lion motif = Kajal (black), Kishmish (plum), Gulmohar
  (rani pink): `_tools/convert-lion-colours.cjs` + `add-lion-colours.cjs`, then `set-feature-crops.cjs`. Their blouse piece is
  the buti cloth with the border (Drive photo 04 / 05). (`variants[]` is the other, older model: one page, `?colour=`.)
  Second set: SN-029 tanchoi skirt border = Kasni (lilac), Basanti (Drive "Gold", mustard), Surkh (red):
  `_tools/convert-kasni-colours.cjs` + `add-kasni-colours.cjs`, then `set-feature-crops.cjs`; blouse piece = the plain
  striped body with the border (Gold 06, Red 05); Gold 02 (folded with the lilac) is not used; Kasni's reel stays lilac only.
  The homepage shows only the first colour of a set (`render/collection.mjs` → `renderNewArrivals`); category pages show all.
  Third set (client, 23 Nov 2026): Jamun's weave in Tamra (copper orange, rani pink pallu) and Mirchi (chilli red, bottle green
  pallu), `_tools/add-jamun-colours.cjs`; folded photos only (camera originals in `model photography/Jamun colours (23 Nov 2026)/`),
  turned upright, plus booti and border close-ups cut from the originals. These carry `unlisted: true`: a colour variant that
  appears ONLY via its main saree's colour chips (and search), never on the homepage, shop all, category, craft or edit pages or
  under "you may also like" (filters in collection.mjs, categories.mjs, craft.mjs, pdp.mjs). Use it for any future variant set.
  Fourth set (client, 23 Nov 2026): Neel's lotus buti weave in Abeer (magenta, orange pallu), Kopal (pista green, rose pink pallu),
  Bhanwra (violet, lemon yellow pallu), `_tools/add-neel-colours.cjs`, unlisted. Every page of the set, Neel included, has the group
  photo (Neel's model seated beside the three folded colours, `neel-colours-group.jpg`) as slide 2. Neel's reel was removed (it showed
  another colour of the design).
  Fifth set (client, 23 Nov 2026): Kairi's floral buta weave in Sabza (sage green, lilac pallu), Mohini (magenta, rose pink pallu),
  Mahavar (crimson, rose pink pallu), `_tools/add-kairi-colours.cjs`, unlisted; folded photos + booti and border close-ups. Kairi's
  reel was removed for the same reason.
  Their model photos are the seated set sent 20 Nov 2026 (`kajal-model.jpg`, `kishmish-seated.jpg`, `gulmohar-seated.jpg`, 1024×1536):
  3:4 frame from the bottom (y 0.1111), card `pos: 50% 70%`. The earlier padded `-space.jpg` photos are no longer used.
- Slides 3–4 come from the original (client, 20 Nov 2026): model → original saree photo → print and border close-ups from the
  original (or the Drive print / border shots) → blouse → film. Sarees with one original photo get their close-ups cut from
  it (`_tools/detail-slides-from-original.cjs`: Kairi, Neel, Bagh, Rangoli, Saanjh, Sindoor, Kahani, Leela, Veena, Darbar,
  Gajraj, Bansuri; the folded-photo sarees Lavanya, Bindiya, Sakhi, Chitra were set the same way by hand). 44 sarees have no
  original photo yet (AI-only or real model shoot only): they keep model-photo slides until one is supplied.
- Close-up slides cut sharp (client, 23 Nov 2026: "the 3rd and 4th image mustn't be pixelated"): the gallery's crop slides
  (crops.border / swatch / borderDetail) are pre-cut into `assets/images/slides/<slug>-<key>.jpg`, 1320px wide at the frame's
  shape (`products.json → slideCuts`), by `_tools/make-slide-cuts.mjs` (needs FFMPEG and FFPROBE). It cuts from the sharpest copy
  on disk (`_tools/originals.mjs`, shared with the circle tool) and never uses fewer than 600 source px across (80% of the photo's
  width for photos too small for that), so a crop deeper than the photo can hold widens instead of going soft. A cut is used only
  while its crop and the frame shape are unchanged (`render/pdp.mjs` → `slideSig`): **re-run it after changing any crop, photo
  or first photo**, and for new sarees. The small WhatsApp block-print photos (Patti, Jaali, Chaand: ~700px) can't give a deep sharp
  close-up; ask the client for larger files.
- Booti work (client, 23 Nov 2026): sarees whose close-up slides show booti (small separate motifs repeated over the body: woven,
  embroidered or block-printed) carry `attributes.booti`, a "Booti work" row always shown under the price like the blouse piece,
  and match booti / buti / buta in search. List and wording: `_tools/set-booti.cjs` (46 sarees; checked by eye on the close-ups).
- Phone (≤767): full-width swipe gallery with a horizontal thumbnail strip under it; details below. Nothing sticky
  below 1024px except the buy bar (`pdp.js` swipe mode is `max-width: 767px`).

## Header utilities

Right side of the header (client, 21 Nov 2026): Search (icon + word), then Wishlist, Account and Bag as outline icons only (Lucide shapes,
20px, stroke 1.5, 44px targets; `partials/header.html`, styles `homepage.css` → `.site-util`). Counts are badges: wishlist from `shop.js`
(`[data-wishlist-badge]`), bag from `bag.js` (`[data-bag-badge]`); hidden at zero; styles `bag.css` → `.site-util__badge`. Hover is a 200ms
fade, never a scale. Phones keep menu + logo + search icon + bag; Wishlist and Account live in the menu. Account still links to `#` (no page yet).

## Search

Header Search (desktop) and the magnifier (phone) open a panel under the header (`partials/header.html` → `.site-search`,
`assets/js/search.js`, styles in `shop.css`). It searches a small index, `/search-index.json` (`render/search.mjs`; served by
serve.mjs, written by build.mjs), never the half-megabyte products.json. Matches name, name meaning, descriptor, colours,
fabric, weave, border, motif, craft, edit and "blouse piece"; every word must match; names rank first; one-letter typos in
names still match. Enter opens the top result, Escape closes, "/" opens it, `?search=<words>` on any page opens it prefilled.

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
Thane West; GSTIN 27AVTPM2829F2Z5 (never shown on the website: not in the footer, About, brand sections or policy pages; it belongs only on tax invoices and billing documents, which Shopify generates: client, 20 Nov 2026); support stylisshnaari3552026@gmail.com, +91 73048 12124 (`store.support`); disputes: courts of Mumbai. A page shows the "Draft page" line only while its copy still contains
`[Insert …]` / `[Confirm …]`.

## Shopify (products, payment, checkout)

All products, payment and checkout run on Shopify (client, 17 Nov 2026); the site stays on Vercel as the shop window.
- Catalogue: `node _tools/export-shopify.cjs` (from `homepage/`) → `homepage/shopify/import/` (products.csv in Shopify's
  import format, collections.csv, prices-needed.csv, redirects.csv). Re-run after any product change. Setup steps for the
  store: `homepage/shopify/README.md`.
- Handle = slug, always. Status is active only with a confirmed price (no price or `priceIsPlaceholder` → draft at ₹0).
  Photos are exported as URLs on `store.shopify.siteUrl`, so push and deploy before importing.
- Checkout: `assets/js/bag.js` → Storefront API (`product(handle)` for each line, then `cartCreate`) → redirect to the
  cart's `checkoutUrl`. Settings in `products.json → store.shopify` (`storeDomain`, public `storefrontToken`,
  `apiVersion`, `country: IN`); the button stays disabled until both are set. Never put an Admin API token in the site.

## PDP "In detail" circles

The first three circles (Fabric & colour, The border, The motif) are cut from the saree's own photographs, never from the
AI model photo or AI close-ups (client, 19 Nov 2026); only "As styled" uses the model shoot. Sarees with real photos
use `products.json → features` (`_tools/set-feature-crops.cjs`: [image, focal x, focal y, zoom] per circle; add new sarees
there). Sarees with no real photo yet (53 AI-only or photoshoot sarees) still use their old crops until one is supplied.

"As styled" is wide, never a tight zoom on the face (client, 23 Nov 2026): crops.styling zoom is capped at 1.3 and aimed at a photo that shows the face, jewellery and blouse (; per-saree fixes in its FIX list). Run it, then make-detail-circles.mjs, after changing any model photo.

"As styled" is wide, never a tight zoom on the face (client, 23 Nov 2026): crops.styling zoom is capped at 1.3 and aimed at a
photo that shows the face, jewellery and blouse (`_tools/set-styled-wide.cjs`; per-saree fixes in its FIX list). Run it, then
make-detail-circles.mjs, after changing any model photo.

Never blurry (client, 20 Nov 2026): every circle is pre-cut into its own 720×720 file, `assets/images/detail/<slug>-<key>.jpg`
(`products.json → detailCircles`), by `_tools/make-detail-circles.mjs` (needs FFMPEG and FFPROBE). It cuts from the sharpest copy
on disk (the Drive or `model photography/` original when it is the same picture), never uses fewer than 480 source pixels across
a circle (a deeper zoom widens the view instead, leaning towards the saree), and scales with Lanczos. A cut is used only while its
crop is unchanged (`render/pdp.mjs` → `circleSig`), so **re-run it after changing any crop, feature or photo**, and for new sarees.
New camera shoots sent in chat (4000×6000): keep the full-size files in `model photography/<Saree> shoot (<date>)/` and point `images[].source` at them, so circles cut from the original (Elaichi, 20 Nov 2026; Genda the same day: standing → portrait → blouse close-up (added 23 Nov 2026, chat copy 1024px) → cuff close-up in the client's order, `_tools/set-genda-shoot.cjs`; reel = genda (1) 3–10 s + genda (2) 3 s–end joined by `_tools/enhance-reel-merge.sh`; two model photos at the client's request; Kumkum likewise: full length → lotus portrait → close-up → damask, `_tools/set-kumkum-shoot.cjs`). The tool reads EXIF Orientation, so sideways-stored camera JPEGs still match.

## PDP "Shipping & return" and "Disclaimer" accordions

Two collapsed `<details>` rows under the details block on every PDP (client, 20 Nov 2026; `render/pdp.mjs` → `renderPolicyAccordions`,
styles `pdp.css` → `.pdp-acc`). "Shipping & return" holds Shipping (`store.shipping`), Returns & exchanges (same terms as `/exchanges`) and
**Import duty, which is PLACEHOLDER text** (`[Insert import duty details]`) until the client supplies it. "Disclaimer" is about photographs
(colour variation, handmade variation, model's blouse/jewellery is styling only). Copy lives as constants in `pdp.mjs`.

Parinda (client, 23 Nov 2026; was the 20 Nov seat / stand / close set) is an exception to "one model photograph per product": its gallery is the client's four photos in order — standing at the gold door, by the lotus pillar, seated against the sky, close-up — then a booti close-up cut from the seated photo (enlarged 2× bicubic, no sharpening, so it stays smooth), then the reel (3 s–13 s of painda.MP4, GRADE as in `_tools/set-parinda-shoot.cjs`). All four are 1024×1536 chat copies: ask for the full-size files. Circles come from the close-up.

Neelambari (client, 23 Nov 2026): the client's three photos in order (over the shoulder by the pillar → full length → smiling) → border zoom → booti zoom, both cut from photo 1 (light nlmeans, spline scaling, no sharpening); circles from the zooms; `_tools/set-neelambari-shoot.cjs` (1024px chat copies: ask for full-size files).

Gulkand (client, 23 Nov 2026) is a second exception: main photo → back view (pallu held out) → border close-up (cut from a 488px photo sent in chat; ask for the full-size file) → booti close-up (cut from the back view; cleaned of JPEG blocking, no sharpening, so it reads smooth) → aanchal; the film goes after it when supplied. Circles come from the 20 Nov close-up, kept as `images[5]` with `gallery: false`. Originals: `model photography/Gulkand shoot (20–23 Nov 2026)/`.

Reel enhancement (client-approved, 23 Nov 2026): raw model videos go through `homepage/_tools/enhance-reel.sh <slug> "<original>" [start] [duration]` (light vid.stab stabilisation capped at 24px, highlight roll-off only, no white-balance change, contrast +4%, saturation +3%, light denoise + gentle sharpen, 1080×1920 at 25fps, no sound). It keeps the original, writes `<name> - enhanced.mp4` beside it, the site reel + small copy + poster. Always send the client a side-by-side preview first. A clip with no sound sets `video.silent: true`, which removes the sound buttons (`render/pdp.mjs`, `pdp.js`). First: Gulkand, from 0:02. Hiran (23 Nov 2026): 3–11 s, `SMOOTH=30` and a GRADE that rolls off clipped red chroma (the "red flashes"); gallery = full length → incense pot → close-up (client's order) (`_tools/set-hiran-shoot.cjs`, 1024px chat copies). Elaichi (23 Nov 2026): 1 s–8 s, with `GRADE=` for its sunlit background (luma only: gamma 0.95, highlights above 125 compressed to 40 %, contrast +8 %, saturation +6 %); the command is in `_tools/set-elaichi-shoot.cjs`'s video entry. Its gallery is the client's four photos in order (door → pillar with rose → close-up → peacock feather; pillar and door originals kept hidden for the circles): `_tools/set-elaichi-shoot.cjs`. Photos 2 and 4 are chat copies (~1100px): ask for the full-size files.

Bright backlit reels (Dariya, 23 Nov 2026, re-graded at the client's request): enhance-reel-slow.sh with SMOOTH=45 MAXSHIFT=40 (firmer but the zoom stays ~7%) and a GRADE that deepens the mids (gamma 1.12) and compresses everything above 160 to 42%; the full command is in products.json → dariya.video.sources.

Low-light reels (Kumkum, 23 Nov 2026, client-approved): run enhance-reel.sh with GRADE set to the default grade plus a gentle lift of Y < 70 and hqdn3d 1.5:1.5:3:3: GRADE="lutyuv=y='if(gt(val\,200)\,200+(val-200)*35/55\,if(lt(val\,70)\,val+(70-val)*(val-16)/54*0.18\,val))',eq=contrast=1.04:saturation=1.03,hqdn3d=1.5:1.5:3:3,unsharp=5:5:0.4:5:5:0" (keep the backslashes before the commas)

Dariya (client, 23 Nov 2026): the client's three photos in order (arcade → palms → laughing) → border zoom → booti zoom (both from photo 3, light nlmeans, spline, no sharpening) → reel (dariya.MP4 0–6 s, 0.8× via `_tools/enhance-reel-slow.sh` with SMOOTH=15 MAXSHIFT=16 and a stronger highlight roll-off for the overexposed arcade; exact GRADE in `_tools/set-dariya-shoot.cjs`). Preview: `dariya - PREVIEW original vs enhanced.mp4` beside the original. 1024px chat copies: ask for full-size files.
