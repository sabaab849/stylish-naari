// One-off: adds the eight sarees from the second shoot to products.json. Safe to re-run (replaces by slug).
const fs = require('fs'); const f = 'assets/data/products.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const hex = h => [0,2,4].map(i => parseInt(h.slice(1).substr(i,2),16));
const toHex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();
const mix = (a,b,t) => a.map((v,i) => v + (b[i]-v)*t);
const lum = c => { const l = c.map(v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }); return .2126*l[0]+.7152*l[1]+.0722*l[2]; };
const con = (a,b) => { const x=lum(a), y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const INK = hex('#1F1A16'), IVORY = hex('#F6F1EA');
// nudge a sampled colour until ink or ivory text reaches 4.5:1 on it (same rule as the colour chapter)
function tone(h) { let c = hex(h); for (let i=0;i<14;i++){ const a=con(c,INK), b=con(c,IVORY); if (Math.max(a,b)>=4.5) return { hex: toHex(c), text: b>=a ? '#F6F1EA' : '#1F1A16' }; c = b>=a ? mix(c,[0,0,0],.06) : mix(c,[255,255,255],.06); } return { hex: toHex(c), text: '#1F1A16' }; }
const colour = (name, h) => ({ name, ...tone(h) });
const img = (slug, w, h, alt, pos) => ({ src: `/assets/images/${slug}.jpg`, width: w, height: h, alt, ...(pos ? { pos } : {}) });
const P = (slug, name, meaning, descriptor, description, colourLine, edits, colours, attrs, images, crops) => ({
  slug, name, nameMeaning: meaning, descriptor, description, descriptionStatus: 'draft', colourLine, colourLineStatus: 'draft',
  price: null, priceIsPlaceholder: false, isNew: true, edits, colours,
  attributes: { fabric: null, colourway: colours[0].name, border: null, motif: null, length: null, blousePiece: null, weave: null, origin: null, availability: null, ...attrs },
  images, crops, looks: [] });

const add = [
P('kajal','Kajal','kohl','Black silk with elephant motifs','Kajal is black silk with elephant and lion motifs and a floral border in gold and silver.','Black silk, lit with gold and silver.',['contrast','festive'],
  [colour('Black','#1C1616')], { fabric:'Silk', border:'Floral border in gold and silver', motif:'Elephant and lion motifs' },
  [img('kajal',1594,2392,'Kajal — a black silk saree with elephant motifs and a floral border, worn reclining on a red cloth beside loose jasmine'), img('kajal-detail',1594,2390,'Kajal up close: a lion motif and floral border in gold and silver on black silk')],
  { silhouette:{img:0}, fall:{img:0,s:1.8,ox:'78%',oy:'100%'}, pallu:{img:0,s:1.9,ox:'48%',oy:'55%'}, border:{img:1,s:1.4,ox:'55%',oy:'50%'}, weave:{img:1}, borderDetail:{img:1,s:1.8,ox:'50%',oy:'38%'}, motif:{img:1,s:2.4,ox:'24%',oy:'52%'}, colour:{img:0,s:1.5,ox:'55%',oy:'72%'}, swatch:{img:1,s:2.2,ox:'22%',oy:'52%'} }),
P('panna','Panna','emerald','Emerald silk with floral jaal','Panna is emerald silk covered in a floral jaal, with a gold zari border and a paisley pallu.','Deep emerald, threaded with gold.',['jewel','festive'],
  [colour('Emerald','#12382D')], { fabric:'Silk', border:'Gold zari border', motif:'Floral jaal with paisley pallu' },
  [img('panna',1750,3109,'Panna — an emerald silk saree with a floral jaal, seen from behind on a candlelit staircase, the paisley pallu spread across the steps','50% 78%'), img('panna-detail',1594,2392,'Panna up close: floral jaal, gold zari border and paisley motifs on emerald silk')],
  { silhouette:{img:0,op:'50% 80%'}, fall:{img:0,s:1.6,ox:'60%',oy:'90%',op:'50% 90%'}, pallu:{img:0,s:1.7,ox:'46%',oy:'38%',op:'50% 55%'}, border:{img:1,s:1.5,ox:'60%',oy:'45%'}, weave:{img:1}, zari:{img:1,s:2,ox:'66%',oy:'55%'}, borderDetail:{img:1,s:1.8,ox:'62%',oy:'38%'}, motif:{img:1,s:2.2,ox:'82%',oy:'82%'}, colour:{img:0,s:1.5,ox:'52%',oy:'72%',op:'50% 80%'}, swatch:{img:1,s:2,ox:'30%',oy:'50%'} }),
P('phalsa','Phalsa','a purple summer berry','Plum silk with elephant motifs','Phalsa is plum silk woven with elephants and flowering vines, finished with a gold floral border.','Plum silk, crossed by gold vines.',['jewel','festive'],
  [colour('Plum','#4B2040')], { fabric:'Silk', border:'Gold floral border', motif:'Elephant and vine motifs' },
  [img('phalsa',1836,2755,'Phalsa — a plum silk saree with gold elephant motifs, worn seated with chin on folded hands before red and ivory drapes'), img('phalsa-detail',1594,2391,'Phalsa up close: gold elephants, vines and a floral border on plum silk')],
  { silhouette:{img:0}, fall:{img:0,s:1.8,ox:'78%',oy:'100%'}, pallu:{img:0,s:1.8,ox:'45%',oy:'62%'}, border:{img:1,s:1.5,ox:'45%',oy:'50%'}, weave:{img:1}, borderDetail:{img:1,s:1.8,ox:'45%',oy:'58%'}, motif:{img:1,s:2.6,ox:'68%',oy:'45%'}, colour:{img:0,s:1.4,ox:'40%',oy:'75%'}, swatch:{img:1,s:2.2,ox:'72%',oy:'42%'} }),
P('moonga','Moonga','coral','Coral silk with botanical pallu','Moonga is coral silk with a gold border and a botanical pallu of flowering branches and birds.','Coral silk, flowering at the pallu.',['bright'],
  [colour('Coral','#D2562E')], { fabric:'Silk', border:'Gold border', motif:'Botanical pallu with birds' },
  [img('moonga',1465,2603,'Moonga — a coral silk saree with a botanical pallu, worn in profile against a peach and rose backdrop','50% 45%'), img('moonga-detail',1593,2390,'Moonga up close: flowering branches and birds on the coral pallu, edged in gold')],
  { silhouette:{img:0,op:'50% 45%'}, fall:{img:0,s:2,ox:'45%',oy:'62%',op:'50% 50%'}, pallu:{img:0,s:1.8,ox:'70%',oy:'55%',op:'50% 50%'}, border:{img:1,s:1.4,ox:'55%',oy:'88%'}, weave:{img:1}, borderDetail:{img:1,s:1.8,ox:'38%',oy:'45%'}, motif:{img:1,s:2.4,ox:'74%',oy:'52%'}, colour:{img:0,s:1.6,ox:'60%',oy:'55%',op:'50% 50%'}, swatch:{img:1,s:2,ox:'72%',oy:'48%'} }),
P('chameli','Chameli','jasmine','Ivory with rose floral embroidery','Chameli is ivory, embroidered with trailing roses and tone-on-tone lacework.','Ivory, scattered with roses.',['soft'],
  [colour('Ivory','#E3CDB4')], { border:'Tone-on-tone lacework', motif:'Rose floral embroidery' },
  [img('chameli',1465,2603,'Chameli — an ivory saree embroidered with roses, worn seated with the head resting on drawn-up knees','50% 92%'), img('chameli-detail',1594,2391,'Chameli up close: embroidered roses and tone-on-tone lacework on ivory')],
  { silhouette:{img:0,op:'50% 92%'}, fall:{img:0,s:1.6,ox:'40%',oy:'94%',op:'50% 100%'}, pallu:{img:0,s:1.7,ox:'70%',oy:'72%',op:'50% 88%'}, border:{img:1,s:1.4,ox:'65%',oy:'55%'}, weave:{img:1}, borderDetail:{img:1,s:1.7,ox:'60%',oy:'42%'}, motif:{img:1,s:2.4,ox:'25%',oy:'62%'}, colour:{img:0,s:1.4,ox:'55%',oy:'78%',op:'50% 92%'}, swatch:{img:1,s:2,ox:'24%',oy:'60%'} }),
P('kasni','Kasni','the colour of chicory flowers','Lavender brocade with pink border','Kasni is lavender brocade with a pink-striped border and floral panels on the pallu.','Lavender, edged in pink.',['soft'],
  [colour('Lavender','#B48CC6')], { weave:'Brocade', border:'Pink-striped border', motif:'Floral pallu panels' },
  [img('kasni',1594,2390,'Kasni — a lavender brocade saree with a pink border, worn seated on a stone block, the pallu falling to the floor'), img('kasni-detail',1594,2392,'Kasni up close: lavender brocade pleats, pink-striped border and floral pallu panels')],
  { silhouette:{img:0}, fall:{img:0,s:1.9,ox:'56%',oy:'70%'}, pallu:{img:0,s:1.7,ox:'78%',oy:'80%'}, border:{img:1,s:1.5,ox:'55%',oy:'50%'}, weave:{img:1}, borderDetail:{img:1,s:1.8,ox:'55%',oy:'45%'}, motif:{img:1,s:2.2,ox:'74%',oy:'76%'}, colour:{img:0,s:1.5,ox:'70%',oy:'62%'}, swatch:{img:1,s:2.2,ox:'32%',oy:'30%'} }),
P('mehendi','Mehendi','henna','Olive floral with pink-edged border','Mehendi is olive with a pale floral jaal and a gold border edged in pink.','Olive, softened by a pink edge.',['soft','contrast'],
  [colour('Olive','#7F7A4B'), colour('Rose','#C9728A')], { border:'Gold border edged in pink', motif:'Floral jaal' },
  [img('mehendi',1956,2444,'Mehendi — an olive floral saree with a pink-edged border, seen from above on a wooden staircase, the pallu spread across the steps'), img('mehendi-detail',1747,2182,'Mehendi up close: pale floral jaal on olive, with a gold border edged in pink')],
  { silhouette:{img:0}, fall:{img:0,s:1.8,ox:'38%',oy:'78%'}, pallu:{img:0,s:1.6,ox:'76%',oy:'40%'}, border:{img:1,s:1.5,ox:'60%',oy:'72%'}, weave:{img:1}, borderDetail:{img:1,s:1.8,ox:'30%',oy:'30%'}, motif:{img:1,s:2.4,ox:'74%',oy:'42%'}, colour:{img:0,s:1.4,ox:'55%',oy:'50%'}, swatch:{img:1,s:2,ox:'72%',oy:'44%'} }),
P('kamal','Kamal','lotus','Pink with white embroidery','Kamal is sheer pink with a white embroidered border and scattered flower motifs.','Pink, traced in white.',['soft'],
  [colour('Pink','#DE9A91')], { border:'White embroidered border', motif:'Scattered flower motifs' },
  [img('kamal',1747,2182,'Kamal — a sheer pink saree with white embroidery, worn seated against an olive wall, holding lotus flowers'), img('kamal-detail',1593,2390,'Kamal up close: white embroidery along the border of the pink saree')],
  { silhouette:{img:0}, fall:{img:0,s:1.9,ox:'62%',oy:'100%'}, pallu:{img:0,s:1.6,ox:'66%',oy:'56%'}, border:{img:1,s:1.4,ox:'40%',oy:'45%'}, weave:{img:1}, borderDetail:{img:1,s:1.8,ox:'35%',oy:'40%'}, motif:{img:1,s:2.4,ox:'30%',oy:'70%'}, colour:{img:0,s:1.3,ox:'55%',oy:'66%'}, swatch:{img:1,s:2,ox:'72%',oy:'50%'} }),
];
d.products = d.products.filter(p => !add.some(a => a.slug === p.slug)).concat(add);
d.edits.jewel.descriptor = 'Magenta, wine, plum, emerald and indigo — colour at full depth.';
d.edits.bright.descriptor = 'Chartreuse, coral, marigold. Sarees for daylight.';
d.edits.soft = { title: 'The Soft Edit', descriptor: 'Ivory, pink, lavender and olive. Colour, turned down.' };
d.edits.festive = { title: 'The Festive Edit', descriptor: 'For evenings, celebrations and everything worth dressing for.' };
for (const s of ['jamun','bagh']) { const p = d.products.find(x => x.slug === s); if (p && !p.edits.includes('festive')) p.edits.push('festive'); }
d._notes.secondShoot = 'Sarees 05–12 come from the second shoot (model photography folder). Their names are PROPOSALS in the same convention as the first four. Fabric is stated only where the photograph filename states it (silk, brocade); border and motif describe what is visible in the photographs. Prices are null: none have been supplied.';
fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
console.log(d.products.map(p => `${p.slug}: ${p.colours.map(c => c.name + ' ' + c.hex + ' on ' + c.text).join(', ')} [${p.edits}]`).join('\n'));
