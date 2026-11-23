// "The Art of the Saree" hero (homepage slide 2): builds the responsive image set and writes the <picture> into index.html
// (between <!-- art-hero:picture --> markers). Run again whenever the client sends new artwork.
//
// Sources (text-free artwork — the words are live HTML), in model photography/Art of the Saree hero (23 Nov 2026)/:
//   desktop:  art-desktop.(png|tif|jpg)   16:9, ideally 3840×2160 (min 3000×1688)
//   portrait: art-portrait.(png|tif|jpg)  9:16, ideally 2160×3840 (min 1440×2560) — optional; without it phones fall back
//             to the desktop artwork with a slow pan (interim only)
//   fallback until the client's files arrive: "art-of-the-saree (clean plate, interim).png" (1672×941, words removed by
//   _tools/art-hero-clean-plate.mjs)
// Output: assets/images/craft-hero/art-{desktop|portrait}-{w}.{avif,webp,jpg}; widths from the ladder below, never wider
// than the source (no upscaling). AVIF q≈ crf 30, WebP q 82, JPEG q 2 (ffmpeg scale) — high enough that the zari stays crisp.
//   FFMPEG=<ffmpeg.exe> FFPROBE=<ffprobe.exe> node _tools/art-hero-images.mjs   (from homepage/)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
const FF = process.env.FFMPEG || 'ffmpeg', FP = process.env.FFPROBE || 'ffprobe';
const DIR = '../model photography/Art of the Saree hero (23 Nov 2026)/';
const OUT = 'assets/images/craft-hero/';
const find = (base) => ['png', 'tif', 'tiff', 'jpg', 'jpeg', 'webp'].map((e) => `${DIR}${base}.${e}`).find(existsSync);
const size = (f) => execFileSync(FP, ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f]).toString().trim().split(',').map(Number);
const LADDER = { desktop: [1280, 1672, 1920, 2560, 3200, 3840], portrait: [720, 1080, 1440, 2160] };

function build(kind, src) {
  const [sw, sh] = size(src);
  for (const f of readdirSync(OUT)) if (f.startsWith(`art-${kind}-`)) unlinkSync(OUT + f);
  const widths = [...new Set([...LADDER[kind].filter((w) => w < sw), Math.min(sw, LADDER[kind].at(-1))])].sort((a, b) => a - b);
  for (const w of widths) {
    const h = Math.round((sh * w) / sw / 2) * 2, vf = `scale=${w}:${h}:flags=lanczos`, b = `${OUT}art-${kind}-${w}`;
    execFileSync(FF, ['-v', 'error', '-y', '-i', src, '-vf', vf, '-q:v', '2', `${b}.jpg`]);
    execFileSync(FF, ['-v', 'error', '-y', '-i', src, '-vf', vf, '-c:v', 'libwebp', '-quality', '82', `${b}.webp`]);
    execFileSync(FF, ['-v', 'error', '-y', '-i', src, '-vf', `${vf},format=yuv420p`, '-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '30', '-b:v', '0', `${b}.avif`]);
    console.log(kind, w, '×', h);
  }
  return { widths, w: sw, h: sh, ratio: `${sw} / ${sh}` };
}

const dSrc = find('art-desktop') || `${DIR}art-of-the-saree (clean plate, interim).png`;
const pSrc = find('art-portrait');
const d = build('desktop', dSrc), p = pSrc ? build('portrait', pSrc) : null;
const set = (kind, o, ext) => o.widths.map((w) => `assets/images/craft-hero/art-${kind}-${w}.${ext} ${w}w`).join(', ');
const PORTRAIT_MQ = '(max-aspect-ratio: 4/5)';
const sources = (kind, o, media, sizes) => ['avif', 'webp', 'jpg'].map((ext) =>
  `          <source${media ? ` media="${media}"` : ''} type="image/${ext === 'jpg' ? 'jpeg' : ext}" sizes="${sizes}" srcset="${set(kind, o, ext)}"${kind === 'portrait' ? ` width="${o.w}" height="${o.h}"` : ''}>`).join('\n');
const mid = d.widths.find((w) => w >= 1672) || d.widths.at(-1);
const html = `<!-- art-hero:picture (written by _tools/art-hero-images.mjs; do not edit by hand) -->
        <picture class="craft-hero__picture">
${p ? sources('portrait', p, PORTRAIT_MQ, '100vw') + '\n' : ''}${sources('desktop', d, '', '(min-aspect-ratio: 16/9) 100vw, 108vw')}
          <img class="craft-hero__art" src="assets/images/craft-hero/art-desktop-${mid}.jpg" width="${d.w}" height="${d.h}" loading="eager" fetchpriority="low" decoding="async"
               alt="Four women in one painted room of teal, gold and burgundy: a Kalamkari saree with its pallu flying, a black Banarasi seen from behind, a magenta Bandhani and an indigo block print">
        </picture>
        <!-- /art-hero:picture -->`;
let page = readFileSync('index.html', 'utf8');
const re = /<!-- art-hero:picture[\s\S]*?<!-- \/art-hero:picture -->/;
if (!re.test(page)) throw new Error('index.html has no art-hero:picture markers');
page = page.replace(re, html).replace(/(<section class="craft-hero"[^>]*?)( data-portrait-art)?(?=[ >])/, `$1${p ? ' data-portrait-art' : ''}`);
writeFileSync('index.html', page);
console.log('index.html updated; portrait artwork:', p ? 'yes' : 'none yet (desktop + pan fallback on phones)');
