// SN-029 "Katan tanchoi skirt border" in two more colours (client, 20 Nov 2026), siblings of Kasni (lilac):
// Basanti (Drive "Gold", mustard) and Surkh (Drive "Red"). Photos: Drive 01 – Banarasi / Premium Silk / Original Product
// Photos – Pendrive / SN-029 (the client sent the same files in chat), plus the two model photos sent in chat (IN folder).
// Landscape photos are turned upright like Kasni's (border along the bottom), 1600×2400 JPEG. Model photos keep their size.
// Gold 02 (folded together with the lilac) is not used; Gold 04 (border close-up) was not sent.
// Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<folder with the chat images> node _tools/convert-kasni-colours.cjs
const { execFileSync } = require('child_process');
const path = require('path');
const FF = process.env.FFMPEG;
const IN = process.env.IN;
if (!FF || !IN) throw new Error('set FFMPEG and IN');
const DRIVE = 'G:/My Drive/Stylish Naari – Saree Photography/01 – Banarasi/Premium Silk/Original Product Photos – Pendrive/SN-029 – Katan tanchoi skirt border';
const OUT = path.join(__dirname, '..', 'assets', 'images');

// [output, source, turn]  ccw: the left edge ends at the bottom; cw: the right edge ends at the bottom
const JOBS = [
  ['basanti-folded.jpg', `${DRIVE}/SN-029 – Gold – 01 (primary) – _DSC4669.JPG`, 'none'],
  ['basanti-print.jpg', `${DRIVE}/SN-029 – Gold – 05 – _DSC4674.JPG`, 'cw'],
  ['basanti-border.jpg', `${DRIVE}/SN-029 – Gold – 03 – _DSC4672.JPG`, 'cw'],
  ['basanti-blouse.jpg', `${DRIVE}/SN-029 – Gold – 06 – _DSC4675.JPG`, 'ccw'],
  ['surkh-folded.jpg', `${DRIVE}/SN-029 – Red – 01 – _DSC4676.JPG`, 'ccw'],
  ['surkh-print.jpg', `${DRIVE}/SN-029 – Red – 04 – _DSC4679.JPG`, 'none'],
  ['surkh-pallu.jpg', `${DRIVE}/SN-029 – Red – 02 – _DSC4677.JPG`, 'cw'],
  ['surkh-border.jpg', `${DRIVE}/SN-029 – Red – 03 – _DSC4678.JPG`, 'ccw'],
  ['surkh-blouse.jpg', `${DRIVE}/SN-029 – Red – 05 – _DSC4680.JPG`, 'cw'],
  ['basanti.jpg', `${IN}/15.png`, 'model'],
  ['surkh.jpg', `${IN}/20.png`, 'model'],
];
for (const [out, src, turn] of JOBS) {
  const vf = { ccw: 'transpose=2,', cw: 'transpose=1,', none: '', model: '' }[turn] + (turn === 'model' ? 'null' : 'scale=1600:2400:flags=lanczos');
  execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', src, '-vf', vf, '-q:v', '2', path.join(OUT, out)]);
  console.log(out);
}
