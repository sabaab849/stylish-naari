// SN-002 "Katan alfi lion motif" in three colours (client, 20 Nov 2026): Kajal (black), Kishmish (purple), Gulmohar (pink).
// Photos: Drive 01 – Banarasi / Premium Silk / Original Product Photos – Pendrive / SN-002 – Katan alfi lion motif saree
// (the client sent the same files), plus a new black folded photo and three model photos sent in chat (IN folder).
// Landscape photos are turned upright so the border runs along the bottom (ccw: border on the left of the landscape shot,
// cw: border on the right), 1600×2400, JPEG. Model photos are kept at their size (1024×1536).
// Run from homepage/: FFMPEG=<ffmpeg.exe> IN=<folder with the chat images> node _tools/convert-lion-colours.cjs
const { execFileSync } = require('child_process');
const path = require('path');
const FF = process.env.FFMPEG;
const IN = process.env.IN;
const DRIVE = 'G:/My Drive/Stylish Naari – Saree Photography/01 – Banarasi/Premium Silk/Original Product Photos – Pendrive/SN-002 – Katan alfi lion motif saree';
const OUT = path.join(__dirname, '..', 'assets', 'images');

// [output, source, turn]
const JOBS = [
  ['kajal-folded.jpg', `${IN}/54.jpg`, 'ccw'],                                  // new black folded photo (not in Drive)
  ['kajal-original.jpg', `${DRIVE}/SN-002 – Black – 01 – _DSC4617.JPG`, 'ccw'], // lions beside the border
  ['kajal-pallu.jpg', `${DRIVE}/SN-002 – Black – 02 – _DSC4618.JPG`, 'cw'],
  ['kajal-blouse.jpg', `${DRIVE}/SN-002 – Black – 04 – _DSC4620.JPG`, 'cw'],    // butti cloth + border = blouse piece
  ['kishmish-folded.jpg', `${DRIVE}/SN-002 – Purple – 01 – _DSC4621.JPG`, 'ccw'],
  ['kishmish-pallu.jpg', `${DRIVE}/SN-002 – Purple – 02 – _DSC4622.JPG`, 'cw'],
  ['kishmish-border.jpg', `${DRIVE}/SN-002 – Purple – 03 – _DSC4623.JPG`, 'ccw'],
  ['kishmish-blouse.jpg', `${DRIVE}/SN-002 – Purple – 04 – _DSC4624.JPG`, 'cw'],
  ['gulmohar-folded.jpg', `${DRIVE}/SN-002 – Pink – 01 (primary) – _DSC4611.JPG`, 'ccw'],
  ['gulmohar-pallu.jpg', `${DRIVE}/SN-002 – Pink – 02 – _DSC4612.JPG`, 'none'],  // already portrait
  ['gulmohar-border.jpg', `${DRIVE}/SN-002 – Pink – 03 – _DSC4613.JPG`, 'ccw'],
  ['gulmohar-blouse.jpg', `${DRIVE}/SN-002 – Pink – 05 – _DSC4615.JPG`, 'cw'],
  ['kajal-model.jpg', `${IN}/64.png`, 'model'],       // seated photo, replaced 57 (20 Nov 2026)
  ['kishmish-seated.jpg', `${IN}/66.png`, 'model'],  // seated photo, replaced 53 (20 Nov 2026)
  ['gulmohar-seated.jpg', `${IN}/67.png`, 'model'],  // seated photo, replaced 52 (20 Nov 2026)
];
for (const [out, src, turn] of JOBS) {
  const vf = { ccw: 'transpose=2,', cw: 'transpose=1,', none: '', model: '' }[turn] + (turn === 'model' ? 'null' : 'scale=1600:2400:flags=lanczos');
  execFileSync(FF, ['-v', 'error', '-y', '-nostdin', '-i', src, '-vf', vf, '-q:v', '3', path.join(OUT, out)]);
  console.log(out);
}
