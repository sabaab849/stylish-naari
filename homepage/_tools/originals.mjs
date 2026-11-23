// Shared by make-detail-circles.mjs and make-slide-cuts.mjs: find the sharpest copy of a site photo on disk.
// The site photo, or its original (images[].source → Drive pendrive folder on G:, or model photography/…) when that
// original is the same picture (checked by comparing thumbnails, in any of four turns). Needs FFMPEG and FFPROBE.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const FF = process.env.FFMPEG, FP = process.env.FFPROBE;
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRIVE = 'G:/My Drive/Stylish Naari – Saree Photography/';

// size as ffmpeg decodes it: camera JPEGs stored sideways with EXIF Orientation 5–8 come out turned upright, so swap
export const dims = (f) => {
  const out = execFileSync(FP, ['-v', 'error', '-show_entries', 'frame=width,height:frame_tags=Orientation', '-read_intervals', '%+#1', '-of', 'default=nw=1', f]).toString();
  const get = (k) => Number((out.match(new RegExp(`${k}=\\s*(\\d+)`)) || [])[1]);
  const [w, h, o] = [get('width'), get('height'), get('TAG:Orientation') || 1];
  return o >= 5 && o <= 8 ? [h, w] : [w, h];
};
const thumb = (f, vf) => execFileSync(FF, ['-v', 'error', '-nostdin', '-i', f, '-vf', `${vf ? vf + ',' : ''}scale=24:36,format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1e7 });

// images[].source → a local original, if one exists
export function original(img) {
  const s = (img.source || '').replace(/\s*\((cropped|whole|pasted|sent|the client)[^)]*\)\s*$/i, '').trim();
  const tries = [];
  const m = s.match(/^Drive: (?:(.+?) \/ )?Original Product Photos [–-] Pendrive \/ (SN-\d{3})(.*)$/);
  if (m) {
    // no range named: look in both Banarasi ranges; "SN-045 – 03" may be the start of a longer name ("… – _SKS6624")
    const ranges = m[1] ? [m[1].replace(/ \/ /g, '/')] : ['01 – Banarasi/Premium Silk', '01 – Banarasi/Premium Semi-Silk'];
    for (const r of ranges) {
      const base = `${DRIVE}${r}/Original Product Photos – Pendrive`;
      if (!fs.existsSync(base)) continue;
      for (const d of fs.readdirSync(base)) if (d.startsWith(m[2] + ' ')) {
        const dir = path.join(base, d);
        for (const f of fs.readdirSync(dir)) {
          const stem = f.replace(/\.jpe?g$/i, '');
          if (stem !== f && (stem === m[2] + m[3] || stem.startsWith(m[2] + m[3] + ' '))) tries.push(path.join(dir, f));
        }
      }
    }
  }
  if (/^model photography\//.test(s)) tries.push(path.join(ROOT, '..', s));
  if (/^[^/:]+\.(png|jpe?g)$/i.test(s)) tries.push(path.join(ROOT, '..', 'model photography', s));
  return tries.find((f) => fs.existsSync(f));
}

// is the original the same picture as the site photo, and in which turn? → { file, vf, W, H }
const cache = new Map();
export function bestSource(img) {
  const site = path.join(ROOT, img.src.replace(/^\//, ''));
  if (cache.has(site)) return cache.get(site);
  const [W, H] = dims(site);
  let best = { file: site, vf: '', W, H };
  const orig = original(img);
  if (orig) {
    const [ow, oh] = dims(orig);
    const a = thumb(site, '');
    for (const [vf, tw, th] of [['', ow, oh], ['transpose=1', oh, ow], ['transpose=2', oh, ow], ['hflip,vflip', ow, oh]]) {
      if (Math.abs(tw / th - W / H) > 0.012 || tw <= W) continue;
      const b = thumb(orig, vf);
      let diff = 0; for (let i = 0; i < a.length; i++) diff += Math.abs(a[i] - b[i]);
      if (diff / a.length < 14) { best = { file: orig, vf, W: tw, H: th }; break; }
    }
  }
  cache.set(site, best);
  return best;
}
export const isOriginal = (file) => file.includes('My Drive') || file.includes('model photography');
