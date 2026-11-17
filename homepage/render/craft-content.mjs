// Copy for the Craft page (/craft). Rendered by render/craft.mjs.
// The shop categories (by craft: Banarasi, Kalamkari, Bandhani, Block prints, Chanderi) live in data.categories in
// products.json; the old state-wise region copy that sat here was removed with them (client, Nov 17 2026).

// ─── Hero: one craft film, an editorial composition over it ───────────────────
// BACKGROUND: ONE continuous video, craft-hero-loop.mp4: Kalamkari, handloom, zari and silk yarn, a new scene every
// 3 s with the cross-fades baked in, looping seamlessly every 24 s. The scenes live in the file, not in the page, so
// the page has a single <video> and nothing to switch. To change a scene, edit SCENES in
// homepage/_tools/build-craft-loop.mjs and re-run it (footage sources and licences are listed there).
//
// CARDS: three photographs of our own sarees laid over the film in FIXED places, each inside a carved Indian window
// frame (frame: 'jharokha' | 'teak' | 'walnut'; drawn in render/craft-windows.mjs). Each window holds ONE photograph
// that never changes: with the film already moving behind them, photos changing in the windows were distracting.
// photo = { src, width, height, pos }; pos is the focal point inside the window's opening. Every window has a fixed
// shape, so a different photo can never shift the layout. Other photos that suit each window (assets/images):
//   worn    panna.jpg, kahani.jpg, mehendi.jpg, phalsa.jpg, neel.jpg
//   detail  panna-detail.jpg, phalsa-detail.jpg, mehendi-detail.jpg, kasni-detail.jpg
//   motif   hariyali-detail.jpg, kalamkari-panels.jpg, kamal-detail.jpg
export const reel = {
  eyebrow: 'The craft',
  title: 'The art of',
  titleAccent: 'the saree',
  line: 'Painted, printed and woven by hand: the crafts behind every Stylish Naari saree.',
  primary: { label: 'Explore Kalamkari', href: '#kalamkari' },
  secondary: { label: 'Shop the collection', href: '/sarees' },
  video: {
    src: '/assets/video/craft-hero-loop.mp4',          // 1920×1080, 24 s
    srcMobile: '/assets/video/craft-hero-loop-720.mp4', // 1280×720, phones
    poster: '/assets/images/craft-hero-loop.jpg',       // its first frame: shown while it loads, if it can't play,
                                                        // and to visitors who prefer reduced motion
  },
  cards: [
    { // the saree worn
      key: 'worn', frame: 'jharokha', // brass jharokha with jali, centre
      photo: { src: '/assets/images/leela.jpg', width: 1024, height: 1536, pos: '50% 30%' },
    },
    { // the cloth up close
      key: 'detail', frame: 'teak', // carved teak, right
      photo: { src: '/assets/images/kalamkari-arch.jpg', width: 600, height: 450, pos: '40% 50%' },
    },
    { // a Kalamkari motif
      key: 'motif', frame: 'walnut', // walnut, left of the jharokha
      photo: { src: '/assets/images/kalamkari-medallion.jpg', width: 560, height: 560, pos: '50% 50%' },
    },
  ],
};

// The two certification marks. Facts kept to what each scheme states about itself; no claim that any
// Stylish Naari saree carries a mark until that saree is tagged with the mark's category in products.json.
export const marks = {
  handloom: {
    category: 'handloom-mark-sarees',
    eyebrow: 'Certified',
    title: 'The Handloom Mark',
    body: 'A Government of India label, run by the Textiles Committee, that certifies a fabric was woven by hand on a handloom. It protects the weaver’s craft and tells you exactly what you are buying.',
    cta: 'Shop Handloom Mark sarees',
    none: 'Sarees carrying the Handloom Mark will be listed here once their certification is confirmed.',
  },
  silk: {
    category: 'silk-mark-sarees',
    eyebrow: 'Certified',
    title: 'The Silk Mark',
    body: 'A quality label from the Silk Mark Organisation of India, under the Central Silk Board, that assures a product is made of pure natural silk.',
    cta: 'Shop Silk Mark sarees',
    none: 'Sarees carrying the Silk Mark will be listed here once their certification is confirmed.',
  },
};

export const closing = {
  eyebrow: 'The collection',
  title: 'Explore the sarees',
  href: '/sarees',
};

// ─── Kalamkari: one craft, told in depth ──────────────────────────────────────
// Facts kept to what is generally documented about the two traditions; nothing here claims how a particular
// Stylish Naari saree was made. The photographs are details of our own Kalamkari sarees (Kahani and Leela);
// the captions name the saree and what it shows, not which school or technique made it — the products' records
// don't say.
// Images: leela.jpg, plus crops cut at full resolution from kahani-product.jpg and leela-product.jpg
// (kalamkari-*.jpg). Replace with dedicated close-up photography when it exists; keep the same files.
export const kalamkari = {
  eyebrow: 'The craft of Andhra Pradesh',
  title: 'Kalamkari —',
  titleRest: 'stories painted',
  titleAccent: 'by hand',
  intro: 'An ancient Indian textile art, Kalamkari brings stories to life through intricate hand-drawn illustrations, delicate botanical motifs and expressive patterns. Created through traditional processes of drawing, dyeing and printing, each composition reflects generations of artistic knowledge and craftsmanship.',
  name: 'The name joins kalam, the pen, with kari, craftsmanship.',
  open: {
    main: { src: '/assets/images/leela.jpg', width: 1024, height: 1536, pos: '50% 34%', alt: 'Leela, a Kalamkari saree with painted figurative panels and a mustard and red border, the pallu held open against a deep blue backdrop' },
    inset: { src: '/assets/images/kalamkari-medallion.jpg', width: 560, height: 560, alt: 'Detail of Leela: a painted medallion of two figures beneath a tree, ringed with lotus petals', caption: 'Leela, a painted medallion' },
  },
  artsEyebrow: 'Explore the art',
  artsNote: 'Two traditions, one name. Details from Kahani and Leela, in our collection.',
  traditions: [
    {
      key: 'srikalahasti',
      no: '01', label: 'The pen',
      name: 'Srikalahasti',
      body: 'Drawn entirely freehand with the kalam, a sharpened bamboo pen. Srikalahasti grew up around its great Shiva temple, and its painters made cloths that told sacred stories: scenes from the Ramayana and the Mahabharata, gods and devotees, trees of life, set out in panels and read like a scroll as the cloth unfolds.',
      facts: [['Technique', 'Freehand pen drawing'], ['Subjects', 'Epics, deities, the tree of life'], ['Place', 'Srikalahasti, a temple town in Andhra Pradesh']],
      main: { src: '/assets/images/kalamkari-arch.jpg', width: 600, height: 450, alt: 'Detail of Kahani: a blue-skinned flute player beneath an arch of lotuses, parrots in the creepers above', caption: 'Kahani, the flute player beneath a lotus arch' },
      inset: { src: '/assets/images/kalamkari-panels.jpg', width: 520, height: 390, alt: 'Detail of Kahani: cattle, a palanquin and figures in procession, in panels on black', caption: 'Kahani, a procession in panels' },
    },
    {
      key: 'machilipatnam',
      no: '02', label: 'The block',
      name: 'Machilipatnam',
      body: 'Printed rather than drawn: hand-carved wooden blocks press each outline and colour onto the cloth, and the finest details are still finished by pen. Around the old port of Machilipatnam and the nearby village of Pedana, centuries of trade with Persia shaped the style: flowers and creepers, paisleys, birds and borders, repeated with the rhythm of a pattern.',
      facts: [['Technique', 'Hand block printing'], ['Motifs', 'Florals, creepers, paisleys'], ['Place', 'Machilipatnam and Pedana, Andhra Pradesh']],
      main: { src: '/assets/images/kalamkari-creeper.jpg', width: 360, height: 460, alt: 'Detail of Kahani: red flowers, leaves and a parrot on a creeper, on a blue ground', caption: 'Kahani, flowers and creepers on blue' },
      // optional: category + cta add a "Shop …" link under the text
    },
  ],
  process: {
    eyebrow: 'The process',
    title: 'Colour,',
    titleAccent: 'layer by layer',
    image: { src: '/assets/images/kahani.jpg', width: 1024, height: 1536, pos: '50% 60%', alt: 'Kahani, a black Kalamkari saree with a mustard border, worn seated in a whitewashed alcove, the painted pallu falling over the ledge' },
    steps: [
      ['Prepare', 'The cotton is washed, then soaked in myrobalan and milk so that the dyes will hold.'],
      ['Outline', 'The design is drawn with the kalam or printed with blocks, in a black made from iron and jaggery.'],
      ['Colour', 'Reds come from alum and madder root, blues from indigo, yellows from myrobalan flowers. Greens are yellow laid over blue.'],
      ['Wash', 'Between stages the cloth is washed in running water and dried in the sun, many times over.'],
    ],
    note: 'The traditional process. Methods and dyes vary from workshop to workshop.',
  },
};

// ─── Lookbook: one model shot with pins on the saree's details ───────────────
// Every line comes from the saree's record in products.json (bagh: colours, attributes, description, styling).
// Nothing here is a new claim: the record states no weave or zari, so no pin mentions one.
// x / y   the pin's place on the photograph, as a percentage of its full width and height (2731 x 1536)
// image   the close-up in the pin's card: a crop of one of the saree's own photographs (bagh.images: 0 = from the
//         front, 1 = from behind), zoomed by s around the point ox / oy, like the crops in products.json. Zoom stays
//         at 4 or less: the card image is small, so the crops stay sharp on high-density screens.
export const lookbook = {
  product: 'bagh',
  eyebrow: 'The lookbook',
  title: 'Bagh,',
  titleAccent: 'up close.',
  image: { src: '/assets/images/hero-bagh-wide.jpg', width: 2731, height: 1536, alt: 'Bagh: a woman seated on a wooden chair, seen from behind, in a magenta silk saree with a marigold border, a large red disc on the wall above her' },
  // Tablets and up: the photo runs as a wide band, cropped top and bottom. This keeps the lower half of the red disc,
  // her head and the drape down to the hem in frame. Phones: a taller frame, cropped left and right around her.
  focus: '50% 70%',
  focusPhone: '47% 50%',
  pins: [
    { x: 47.8, y: 41.0, eyebrow: 'As styled', title: 'Jasmine and gold', text: 'Shown with jasmine in the hair, gold earrings and wide gold cuffs.',
      image: { img: 0, s: 4, ox: '70%', oy: '37%', alt: 'Bagh from the front: jasmine in her hair, gold earrings and a wide gold cuff' } },
    { x: 46.2, y: 56.0, eyebrow: 'The silk', title: 'Magenta silk', text: 'The body of the saree, in the deep magenta of our Rani swatch (#A3175F).',
      image: { img: 1, s: 4, ox: '92%', oy: '82%', alt: 'The magenta silk of Bagh falling in folds to the floor' } },
    { x: 55.3, y: 66.4, eyebrow: 'The motif', title: 'Tree-of-life jaal', text: 'Woven across the magenta body.',
      image: { img: 0, s: 3.6, ox: '80%', oy: '80%', alt: 'The tree-of-life jaal across the magenta body of Bagh' } },
    // on the border where it runs down the front of the drape (the hem itself sits too low for the band's crop)
    { x: 57.6, y: 78.5, eyebrow: 'The border', title: 'Marigold border', text: 'The edge that finishes the drape, in marigold.',
      image: { img: 0, s: 4, ox: '62%', oy: '80%', alt: 'The marigold border of Bagh running down the drape' } },
  ],
};

// ─── The other crafts: one chapter each, after Kalamkari (client, Nov 17 2026) ──────────────────────────────────
// Banarasi, Bandhani, Block prints and Chanderi: the shop's other categories (products.json → categories). Each chapter is
// laid out like the Kalamkari opening: eyebrow, a three-line headline (name, a phrase, an Instrument Serif accent), the
// history in a paragraph, a line on the name, facts, and a link to the category. The photograph alternates sides.
// Photographs are our own sarees; insets are details cut from them (assets/images/craft-*-detail.jpg). A craft with no
// photograph yet (Chanderi) shows a plain "Coming soon" panel. History is kept to what is generally documented about each
// craft; nothing claims how a particular Stylish Naari saree was made.
export const crafts = [
  {
    key: 'banarasi', category: 'banarasi', cta: 'Shop Banarasi sarees',
    eyebrow: 'The craft of Varanasi',
    title: 'Banarasi —', titleRest: 'woven in silk', titleAccent: 'and gold',
    intro: 'Woven in Varanasi on the banks of the Ganga, the Banarasi saree carries centuries of Mughal-era design into silk. Gold and silver zari is worked into the cloth on the handloom as brocade, building floral buti, trailing jaal and paisley kalga thread by thread; a single saree can take weeks to weave.',
    name: 'Banaras, the old name of Varanasi, gave the weave its name.',
    facts: [['Technique', 'Handloom brocade, woven with zari'], ['Motifs', 'Buti, jaal, kalga, shikargah'], ['Our range', 'Premium silk and premium semi-silk'], ['Place', 'Varanasi, Uttar Pradesh']],
    main: { src: '/assets/images/panna.jpg', width: 1750, height: 3109, pos: '50% 70%', alt: 'Panna, a Banarasi saree woven with zari, worn by candlelight' },
    inset: { src: '/assets/images/panna-detail.jpg', width: 1594, height: 2392, pos: '50% 50%', alt: 'Detail of Panna: a zari jaal of flowers and a paisley border woven into dark green silk', caption: 'Panna, a zari jaal' },
  },
  {
    key: 'bandhani', category: 'bandhani', cta: 'Shop Bandhani sarees',
    eyebrow: 'The craft of Gujarat and Rajasthan',
    title: 'Bandhani —', titleRest: 'colour tied', titleAccent: 'dot by dot',
    intro: 'One of India’s oldest resist-dyeing arts, Bandhani is made by pinching the cloth into thousands of tiny points and binding each one tightly with thread before it is dyed. Where the thread holds, the colour cannot reach; when the knots are opened, the pattern appears as dots, squares and waves, often built up over several rounds of dye.',
    name: 'The name comes from bandhan, to tie.',
    facts: [['Technique', 'Tie-and-dye resist, knotted by hand'], ['Motifs', 'Dots, squares, chequered gharchola'], ['Place', 'Kutch and Jamnagar in Gujarat; Rajasthan']],
    main: { src: '/assets/images/jamuni.jpg', width: 1006, height: 1564, pos: '50% 50%', alt: 'Jamuni, a violet Bandhani saree with a white floral border, the panelled pallu swept out' },
    inset: { src: '/assets/images/craft-bandhani-detail.jpg', width: 560, height: 560, alt: 'Detail of Bindiya: tied dots in clusters inside gold tissue checks on plum', caption: 'Bindiya, tied dots in gold checks' },
  },
  {
    key: 'block-prints', category: 'block-prints', cta: 'Shop block print sarees',
    eyebrow: 'The craft of Rajasthan',
    title: 'Block print —', titleRest: 'pattern pressed', titleAccent: 'by hand',
    intro: 'Carved by hand from wood, each block is dipped in colour and pressed onto the cloth one impression at a time, lined up by eye with the last. In Rajasthan, Sanganer and Bagru have printed this way for centuries, with natural dyes and dabu, a mud resist, layering florals, stripes and geometric patterns in indigo, madder red and black.',
    name: 'A single design can need a separate block for every colour.',
    facts: [['Technique', 'Hand block printing, dabu mud resist'], ['Colours', 'Indigo, madder red, black, ochre'], ['Place', 'Sanganer and Bagru, Rajasthan']],
    main: { src: '/assets/images/mehrab.jpg', width: 1024, height: 1536, pos: '50% 55%', alt: 'Mehrab, a cobalt block print saree with a white triangle border, worn beneath a painted palace arch' },
    inset: { src: '/assets/images/craft-blockprint-detail.jpg', width: 560, height: 560, alt: 'Detail of Raat: printed medallion bands and cypress motifs in red on indigo', caption: 'Raat, printed medallions' },
  },
  {
    key: 'chanderi', category: 'chanderi', cta: 'Shop Chanderi sarees',
    eyebrow: 'The craft of Madhya Pradesh',
    title: 'Chanderi —', titleRest: 'woven light', titleAccent: 'as air',
    intro: 'Woven in the hill town of Chanderi for centuries, Chanderi cloth is prized for being sheer, light and softly lustrous. Fine silk and cotton yarns are woven on the handloom, lit with small zari or coloured buti and slim borders; it was long a cloth of royal courts.',
    name: 'Our Chanderi sarees are on their way.',
    facts: [['Technique', 'Handloom weaving in silk and cotton'], ['Motifs', 'Buti, coins, peacocks, florals'], ['Place', 'Chanderi, Madhya Pradesh']],
    main: null,
  },
];
