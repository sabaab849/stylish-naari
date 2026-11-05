// Builds the Craft page hero video: ONE continuous, seamlessly looping MP4 of craft scenes, a new scene every 3 s,
// cross-fades baked into the file (the page plays a single <video>; nothing is layered or switched in the browser).
//
//   FFMPEG=path/to/ffmpeg node homepage/_tools/build-craft-loop.mjs
//
// Writes homepage/assets/video/craft-hero-loop.mp4 (1920×1080), craft-hero-loop-720.mp4 (1280×720, phones) and
// homepage/assets/images/craft-hero-loop.jpg (the poster: the loop's first frame).
//
// HOW THE TIMELINE IS MADE
//   Each scene is SCENE + FADE seconds of material (3.6 s). Scenes are chained with xfade, each fade starting where the
//   previous scene's 3 s are up, so a new scene is fully on screen every 3 s. Scene 1 is appended again at the end and
//   the output is trimmed from FADE to FADE + N×SCENE: the last frame then runs straight into the first (the same
//   frame of scene 1), so the loop has no seam and no black frame.
//
// SOURCES (all licensed for commercial use, or the brand's own):
//   _source-footage/pexels-6701504-handloom.mp4      Pexels #6701504, "Loom Machine Used for Weaving" (Pexels licence)
//   _source-footage/pixabay-44795-silk-weaving.mp4   Pixabay #44795, "Silk, Silk Cloth, Fabric" by paragnabaria2
//                                                    (Pixabay Content License): silk yarn worked by hand on a frame
//   assets/images/*.jpg                              Stylish Naari's own photographs, given a slow camera move
// No free, commercially licensed footage of Kalamkari painting or zari work exists (searched Pexels, Pixabay and
// Wikimedia Commons, Nov 2026), so those scenes move across close-ups of our own sarees. When real footage arrives
// (filmed, licensed or generated, see assets/video/craft-reel/README.md), put it in _source-footage/ and change the
// scene to { video, start } — then re-run this script.
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const SCENE = 3;     // seconds each scene holds the screen
const FADE = 0.6;    // cross-fade length, inside those 3 s
const FPS = 25;
const W = 1920, H = 1080;
const LOOM = '_source-footage/pexels-6701504-handloom.mp4';
const YARN = '_source-footage/pixabay-44795-silk-weaving.mp4';

// image scenes: a crop window (x, y, width; height follows 16:9) that moves from `from` to `to` over the scene
// video scenes: start time in the source, optional fixed crop window (for a closer framing of the same shot)
const SCENES = [
  { label: 'Kalamkari: the painted pallu', image: 'assets/images/hero-tradition.jpg', from: { x: 700, y: 0, w: 1342 }, to: { x: 880, y: 200, w: 1000 } },
  { label: 'Handloom: the shuttle and the weaver\'s hands', video: LOOM, start: 20 },
  { label: 'Zari: gold elephants and vines woven into silk', image: 'assets/images/phalsa-texture-wide.jpg', from: { x: 0, y: 120, w: 2391 }, to: { x: 320, y: 260, w: 1900 } },
  { label: 'Silk yarn worked by hand', video: YARN, start: 0.5 },
  { label: 'Kalamkari: painted panels on Leela', image: 'assets/images/leela.jpg', from: { x: 0, y: 560, w: 1024 }, to: { x: 60, y: 720, w: 920 } },
  { label: 'Handloom: closer on the warp', video: LOOM, start: 56, crop: { x: 480, y: 120, w: 1440 } },
  { label: 'Zari: the woven border of Hariyali', image: 'assets/images/hariyali-border.jpg', from: { x: 0, y: 0, w: 2048 }, to: { x: 220, y: 160, w: 1700 } },
  { label: 'Silk yarn on the frame', video: YARN, start: 10.2 },
];

const D = SCENE + FADE;
const grade = 'eq=saturation=0.94:contrast=1.04,colorbalance=rs=0.03:gs=0.01:bs=-0.03'; // one warm grade over everything
const inputs = [];
const chains = [];
const list = [...SCENES, SCENES[0]]; // scene 1 again, for the seamless loop
list.forEach((s, i) => {
  if (s.video) {
    inputs.push('-ss', String(s.start), '-t', String(D), '-i', join(ROOT, s.video));
    const crop = s.crop ? `crop=${s.crop.w}:${Math.round(s.crop.w * 9 / 16)}:${s.crop.x}:${s.crop.y},` : '';
    chains.push(`[${i}:v]${crop}scale=${W}:${H}:flags=lanczos,fps=${FPS},setsar=1,format=yuv420p,setpts=PTS-STARTPTS[s${i}]`);
  } else {
    inputs.push('-loop', '1', '-t', String(D), '-framerate', String(FPS), '-i', join(ROOT, s.image));
    // The window (x, y, w) eases from `from` to `to`. Each frame the whole photo is scaled by S = W / w(t), so the
    // window becomes exactly W wide, then a fixed W×H crop is taken at (x·S, y·S).
    const f = s.from, t = s.to;
    const ease = `(0.5-0.5*cos(PI*t/${D}))`; // slow in, slow out
    const lerp = (a, b) => `(${a}+(${b - a})*${ease})`;
    const S = `(${W}/${lerp(f.w, t.w)})`;
    chains.push(`[${i}:v]fps=${FPS},scale=w='trunc(iw*${S}/2)*2+2':h='trunc(ih*${S}/2)*2+2':eval=frame:flags=bicubic,crop=${W}:${H}:x='${lerp(f.x, t.x)}*${S}':y='${lerp(f.y, t.y)}*${S}',setsar=1,format=yuv420p,setpts=PTS-STARTPTS[s${i}]`);
  }
});
let last = 's0';
for (let i = 1; i < list.length; i++) {
  const out = i === list.length - 1 ? 'chain' : `x${i}`;
  chains.push(`[${last}][s${i}]xfade=transition=fade:duration=${FADE}:offset=${(SCENE * i).toFixed(3)}[${out}]`);
  last = out;
}
const LOOP = SCENE * SCENES.length;
chains.push(`[chain]trim=start=${FADE}:end=${FADE + LOOP},setpts=PTS-STARTPTS,${grade}[out]`);
chains.push(`[out]split=2[big][small0]`, `[small0]scale=1280:720:flags=lanczos[small]`);

const run = (args) => {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed (${r.status})`);
};
const VID = join(ROOT, 'assets/video'), IMG = join(ROOT, 'assets/images');
const enc = (crf, rate) => ['-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-maxrate', rate, '-bufsize', rate, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-g', String(FPS * SCENE)];
run([...inputs, '-filter_complex', chains.join(';'),
  '-map', '[big]', ...enc(25, '3M'), join(VID, 'craft-hero-loop.mp4'),
  '-map', '[small]', ...enc(27, '1.4M'), join(VID, 'craft-hero-loop-720.mp4')]);
run(['-i', join(VID, 'craft-hero-loop.mp4'), '-frames:v', '1', '-q:v', '3', join(IMG, 'craft-hero-loop.jpg')]);
console.log(`craft-hero-loop: ${SCENES.length} scenes × ${SCENE}s = ${LOOP}s, ${FADE}s cross-fades`);
SCENES.forEach((s, i) => console.log(`  ${String(i * SCENE).padStart(2)}–${(i + 1) * SCENE}s  ${s.label}`));
