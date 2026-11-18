// Encodes the saree clips listed in _tools/saree-clips.json into PDP reels, the same format as Hariyali's:
//   assets/video/<slug>-reel.mp4        720×1280 H.264, silent, first 24 s, ~2.5 Mbps, faststart
//   assets/video/<slug>-reel-small.mp4  432×768, ~0.45 Mbps
//   assets/images/<slug>-reel-poster.jpg  frame at 1.5 s, 720×1280
// Usage (from homepage/): node _tools/encode-clips.mjs <folder with 001.mp4…> <ffmpeg.exe>
// Raw clips: download from the Drive folder in saree-clips.json (they are not kept in the repo).
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const [src, ffmpeg, mapKey = 'map'] = process.argv.slice(2); // mapKey: 'map' (first batch) or 'map2' (second batch)
if (!src || !ffmpeg) { console.error('usage: node _tools/encode-clips.mjs <clips folder> <ffmpeg>'); process.exit(1); }
const map = JSON.parse(fs.readFileSync('_tools/saree-clips.json', 'utf8'))[mapKey];
const run = (args) => execFileSync(ffmpeg, ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
for (const [slug, n] of Object.entries(map)) {
  const inp = path.join(src, `${n}.mp4`);
  if (!fs.existsSync(inp)) { console.log(`skip ${slug}: ${n}.mp4 missing`); continue; }
  const out = `assets/video/${slug}-reel.mp4`, small = `assets/video/${slug}-reel-small.mp4`, poster = `assets/images/${slug}-reel-poster.jpg`;
  if (!fs.existsSync(out)) run(['-i', inp, '-t', '24', '-an', '-vf', 'scale=720:1280:flags=lanczos,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-maxrate', '2600k', '-bufsize', '5200k', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  if (!fs.existsSync(small)) run(['-i', inp, '-t', '24', '-an', '-vf', 'scale=432:768:flags=lanczos,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-maxrate', '500k', '-bufsize', '1000k', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', small]);
  if (!fs.existsSync(poster)) run(['-ss', '1.5', '-i', inp, '-frames:v', '1', '-vf', 'scale=720:1280:flags=lanczos', '-q:v', '3', poster]);
  console.log(`${slug.padEnd(10)} ${n}  ${(fs.statSync(out).size / 1e6).toFixed(1)} MB / ${(fs.statSync(small).size / 1e6).toFixed(1)} MB`);
}
