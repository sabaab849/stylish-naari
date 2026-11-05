// Adds Hariyali (the teal saree: "Elegant Teal Saree Garden Portrait" + "teal saree", "01", "02") to
// products.json, with its merged reel (teal videos 04 + 03 + 01; "teal videos 02" shows a different saree
// and is left out). Name and copy are proposals; fabric is not stated in any file, so it stays null.
// Safe to re-run.
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const p = {
  slug: 'hariyali', name: 'Hariyali', nameMeaning: 'greenery after the rains',
  descriptor: 'Teal with gold and magenta flower buti',
  description: 'Hariyali is sheer teal woven with round gold flower buti and magenta leaves, with a heavy gold zari pallu and a tasselled gold border.',
  descriptionStatus: 'draft',
  colourLine: 'Teal, in full bloom.', colourLineStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true,
  edits: ['jewel', 'festive'],
  colours: [{ name: 'Teal', hex: '#226656', text: '#F6F1EA' }, { name: 'Magenta', hex: '#B8337A', text: '#F6F1EA' }],
  attributes: { fabric: null, colourway: 'Teal', border: 'Tasselled gold border', motif: 'Gold flower buti with magenta leaves', length: null, blousePiece: null, weave: null, origin: null, availability: null },
  images: [
    { src: '/assets/images/hariyali.jpg', width: 1024, height: 1536, alt: 'Hariyali — a teal saree with gold flower buti, worn seated and looking back over her shoulder, the gold zari pallu spread across the floor', pos: '50% 45%', source: 'Hariyali Seated Portrait.png' },
    { src: '/assets/images/hariyali-detail.jpg', width: 2048, height: 1365, alt: 'Hariyali up close: gold flower buti with magenta leaves woven into sheer teal', role: 'detail', source: 'teal saree 02.jpg' },
    { src: '/assets/images/hariyali-border.jpg', width: 2048, height: 1365, alt: 'Hariyali: the tasselled gold border beside the teal body', role: 'source', source: 'teal saree.jpg' },
    { src: '/assets/images/hariyali-product.jpg', width: 2048, height: 1365, alt: 'Hariyali laid flat: teal body with gold buti and the full gold zari pallu', role: 'product', fit: 'cover', source: 'teal saree 01 (1).jpg' },
  ],
  crops: {
    silhouette: { img: 0 },
    fall: { img: 0, s: 1.4, ox: '40%', oy: '88%' },
    pallu: { img: 0, s: 1.4, ox: '62%', oy: '60%' },
    border: { img: 0, s: 1.6, ox: '22%', oy: '78%' },
    weave: { img: 1 },
    borderDetail: { img: 2, s: 1.2, ox: '18%', oy: '40%' }, // the tassel and lace edge, cut from the border photograph
    motif: { img: 1, s: 1.4, ox: '75%', oy: '60%' },
    colour: { img: 0, s: 1.3, ox: '55%', oy: '55%' },
    swatch: { img: 1, s: 1.6, ox: '80%', oy: '55%' },
  },
  looks: [],
  backdrop: { img: 3, pos: '50% 50%', posMobile: '50% 50%' },
  closer: { heading: 'Teal, in full bloom.', headingStatus: 'draft', items: [['Colour', 'Teal'], ['Motif', 'Gold flowers, magenta leaves'], ['Border', 'Tasselled gold']] },
  motion: {
    title: 'The drape in motion',
    text: 'Sheer teal falls in soft folds, and the gold buti catch the light as it moves. The zari pallu turns heavy and bright at the shoulder, finished with a tasselled gold edge that swings with every step.',
    textStatus: 'draft', cta: 'Explore the craft', href: '/#craft',
  },
  video: { src: '/assets/video/hariyali-reel.mp4', srcSmall: '/assets/video/hariyali-reel-small.mp4', poster: '/assets/images/hariyali-reel-poster.jpg', width: 720, height: 1280, sources: ['teal video 04.mp4', 'teal video 03.mp4', 'teal video.mp4'] },
};
d.products = d.products.filter((x) => x.slug !== p.slug).concat(p);
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log('added', p.name, '— products:', d.products.length);
