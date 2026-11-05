/* Craft page hero: the carved Indian window frames around the photographs.

   Each frame is one inline SVG drawn here (no image files, so it stays sharp at any size). The photograph sits in an
   HTML box under the SVG, placed at the window's opening (`opening`, in % of the window), so it can be changed without
   touching the frame. The SVG covers only the frame (and the jali), never the opening.

   Three windows, each matched to the photographs it holds:
     jharokha  aged brass, floral relief, a frieze of small arches across the top, a jali screen around an arched
               opening. Holds the worn sarees (maroon, plum and gold tones).
     teak      carved teak, a row of beads with bone inlay, carved corner blocks. Holds the cloth close-ups.
     walnut    dark walnut, chip-carved diamonds set with brass pins. Holds the Kalamkari motifs.

   Colours come from CSS custom properties on the card (--m-hi, --m-base, --m-lo, --m-inlay, --m-patina; craft.css),
   so a material can be retuned there without editing this file. Lighting is from the top left throughout.
   Tile sizes divide each band exactly, so the carving lines up on all four sides. */

const LIGHT = 'rgba(255,240,205,.42)';
const DARK = 'rgba(25,14,6,.5)';

const n = (v) => +v.toFixed(2);
const rect = (x, y, w, h) => ({ x, y, w, h });
const grow = (r, d) => rect(r.x - d, r.y - d, r.w + 2 * d, r.h + 2 * d);
const box = (r) => `M${n(r.x)},${n(r.y)}h${n(r.w)}v${n(r.h)}h${n(-r.w)}Z`;
const ring = (o, i) => `${box(o)} ${box(i)}`; // drawn with fill-rule evenodd

// a sloped edge between rect r and r shrunk by d: raised = lit top/left, recessed = lit bottom/right
function bevel(r, d, raised = true) {
  const { x, y, w, h } = r;
  const p = (pts) => pts.map((q) => q.map(n).join(',')).join(' ');
  const top = p([[x, y], [x + w, y], [x + w - d, y + d], [x + d, y + d]]);
  const left = p([[x, y], [x + d, y + d], [x + d, y + h - d], [x, y + h]]);
  const bottom = p([[x, y + h], [x + d, y + h - d], [x + w - d, y + h - d], [x + w, y + h]]);
  const right = p([[x + w, y], [x + w, y + h], [x + w - d, y + h - d], [x + w - d, y + d]]);
  const [a, b] = raised ? [LIGHT, DARK] : [DARK, LIGHT];
  return `<polygon points="${top}" fill="${a}"/><polygon points="${left}" fill="${a}"/>`
    + `<polygon points="${bottom}" fill="${b}"/><polygon points="${right}" fill="${b}"/>`;
}

const GEOMETRY = {
  // W×H in SVG units; l/r/t/b = frame thickness on each side (outer moulding 12 + carved band + inner sight edge 9).
  // The jharokha and teak windows are kept short (they were 600 and 399 tall) so they don't tower over the hero.
  // To change a height, keep H − 24 a multiple of the tile, or the carving won't line up at the corners.
  jharokha: { W: 408, H: 504, l: 37, r: 37, t: 65, b: 53, tile: 16 },
  teak:     { W: 294, H: 339, l: 36, r: 36, t: 36, b: 36, tile: 15 },
  walnut:   { W: 294, H: 294, l: 36, r: 36, t: 36, b: 36, tile: 15 },
};

function grain(id, horizontal, seed) {
  const f = horizontal ? '0.012 0.2' : '0.2 0.012';
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="3" seed="${seed}"/>
      <feColorMatrix values="0 0 0 0 .1  0 0 0 0 .06  0 0 0 0 .02  1.7 0 0 0 -.62"/>
    </filter>`;
}

function carving(kind, id, B, g) {
  const s = g.tile;
  const at = `x="${B.x}" y="${B.y}" width="${s}" height="${s}" patternUnits="userSpaceOnUse"`;
  if (kind === 'jharokha') { // four-petal rosettes in relief
    const petals = (dx, fill) => `<g transform="translate(${8 + dx},${8 + dx})" fill="${fill}">${
      [0, 90, 180, 270].map((a) => `<ellipse cx="0" cy="-3.7" rx="1.9" ry="3" transform="rotate(${a})"/>`).join('')}</g>`;
    return `<pattern id="${id}" ${at}>${petals(0.8, DARK)}${petals(0, LIGHT)}
      <circle cx="8" cy="8" r="1.5" style="fill:var(--m-hi)"/><circle cx="0" cy="0" r="1.2" fill="${DARK}"/><circle cx="16" cy="0" r="1.2" fill="${DARK}"/>
      <circle cx="0" cy="16" r="1.2" fill="${DARK}"/><circle cx="16" cy="16" r="1.2" fill="${DARK}"/></pattern>`;
  }
  if (kind === 'teak') { // turned beads, each set with a dot of bone inlay
    const c = s / 2;
    return `<radialGradient id="${id}-bead" fx=".34" fy=".32"><stop offset="0" stop-color="rgb(255,240,205)" stop-opacity=".55"/>
      <stop offset=".55" stop-color="rgb(255,240,205)" stop-opacity="0"/><stop offset=".8" stop-color="rgb(25,14,6)" stop-opacity=".25"/>
      <stop offset="1" stop-color="rgb(25,14,6)" stop-opacity=".6"/></radialGradient>
      <pattern id="${id}" ${at}><circle cx="${c}" cy="${c}" r="${c - 1.6}" fill="url(#${id}-bead)"/>
      <circle cx="${c}" cy="${c}" r="1.3" style="fill:var(--m-inlay)"/></pattern>`;
  }
  // walnut: chip-carved diamonds (lit upper half, shaded lower half) with a brass pin in each
  const c = s / 2, k = c - 1.5;
  return `<pattern id="${id}" ${at}>
      <path d="M${c},${c - k}L${c - k},${c}H${c + k}Z" fill="${LIGHT}"/><path d="M${c},${c + k}L${c - k},${c}H${c + k}Z" fill="${DARK}"/>
      <circle cx="${c}" cy="${c}" r="1.2" style="fill:var(--m-inlay)"/></pattern>`;
}

// a pointed Mughal arch inside the opening P; returns the path of the arch hole (open to the bottom)
function archPath(P) {
  const side = P.w * 0.13;
  const xl = P.x + side, xr = P.x + P.w - side, xc = P.x + P.w / 2;
  const ys = P.y + P.h * 0.34, ya = P.y + P.h * 0.05, yb = P.y + P.h;
  const hw = (xr - xl) / 2;
  return `M${n(xl)},${n(yb)}V${n(ys)}C${n(xl)},${n(ys - P.h * 0.15)} ${n(xc - hw * 0.42)},${n(ya + P.h * 0.07)} ${n(xc)},${n(ya)}`
    + `C${n(xc + hw * 0.42)},${n(ya + P.h * 0.07)} ${n(xr)},${n(ys - P.h * 0.15)} ${n(xr)},${n(ys)}V${n(yb)}`;
}

export function windowFrame(kind, uid) {
  const g = GEOMETRY[kind];
  const { W, H } = g;
  const O = rect(0, 0, W, H);
  const P = rect(g.l, g.t, W - g.l - g.r, H - g.t - g.b); // the opening
  const B = rect(12, 12, W - 24, H - 24);                  // outer edge of the carved band
  const Bi = grow(P, 9);                                   // inner edge of the carved band
  const id = (s) => `${uid}-${s}`;

  const defs = [
    `<linearGradient id="${id('mat')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--m-hi)"/>`
      + `<stop offset=".45" style="stop-color:var(--m-base)"/><stop offset="1" style="stop-color:var(--m-lo)"/></linearGradient>`,
    carving(kind, id('carve'), B, g),
    `<clipPath id="${id('rails')}"><rect width="${W}" height="${g.t}"/><rect y="${H - g.b}" width="${W}" height="${g.b}"/></clipPath>`,
    `<clipPath id="${id('stiles')}"><rect y="${g.t}" width="${g.l}" height="${P.h}"/><rect x="${W - g.r}" y="${g.t}" width="${g.r}" height="${P.h}"/></clipPath>`,
  ];
  const layers = [
    `<path d="${ring(O, P)}" fill-rule="evenodd" fill="url(#${id('mat')})"/>`,
  ];

  if (kind === 'jharokha') {
    // cast-brass texture and verdigris in the hollows instead of wood grain
    defs.push(`<filter id="${id('cast')}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="3" seed="7"/>
      <feColorMatrix values="0 0 0 0 .37  0 0 0 0 .5  0 0 0 0 .43  2.6 0 0 0 -1.35"/></filter>`);
    defs.push(`<clipPath id="${id('frame')}"><path d="${ring(O, P)}" clip-rule="evenodd"/></clipPath>`);
    layers.push(`<rect width="${W}" height="${H}" filter="url(#${id('cast')})" clip-path="url(#${id('frame')})" opacity=".55"/>`);
  } else {
    defs.push(grain(id('gh'), true, kind === 'teak' ? 3 : 11), grain(id('gv'), false, kind === 'teak' ? 5 : 13));
    layers.push(`<rect width="${W}" height="${H}" filter="url(#${id('gh')})" clip-path="url(#${id('rails')})" opacity=".5"/>`);
    layers.push(`<rect width="${W}" height="${H}" filter="url(#${id('gv')})" clip-path="url(#${id('stiles')})" opacity=".5"/>`);
  }

  // outer moulding (raised), then a step down into the carved band
  layers.push(bevel(O, 7, true), bevel(grow(O, -7), 5, false));
  layers.push(`<path d="${ring(B, Bi)}" fill-rule="evenodd" fill="url(#${id('carve')})"/>`);

  if (kind === 'jharokha') {
    // frieze of small blind arches across the top band
    const fy = B.y, fh = Bi.y - B.y, aw = 16;
    defs.push(`<pattern id="${id('frieze')}" x="${B.x}" y="${fy}" width="${aw}" height="${fh}" patternUnits="userSpaceOnUse">
      <path d="M3,${fh - 4}V${n(fh * 0.5)}Q8,${n(fh * 0.08)} 13,${n(fh * 0.5)}V${fh - 4}Z" fill="${DARK}"/>
      <path d="M3,${fh - 4}V${n(fh * 0.5)}Q8,${n(fh * 0.08)} 13,${n(fh * 0.5)}" fill="none" stroke="${LIGHT}" stroke-width="1.2"/>
      <circle cx="8" cy="${n(fh * 0.62)}" r="1.4" style="fill:var(--m-hi)"/></pattern>`);
    layers.push(`<rect x="${B.x}" y="${fy}" width="${B.w}" height="${fh}" fill="url(#${id('mat')})"/>`);
    layers.push(`<rect x="${B.x}" y="${fy}" width="${B.w}" height="${fh}" fill="url(#${id('frieze')})"/>`);
    layers.push(`<line x1="${B.x}" y1="${fy + fh - 1}" x2="${B.x + B.w}" y2="${fy + fh - 1}" stroke="${DARK}" stroke-width="2"/>`);
  } else {
    // carved corner blocks, each with a rosette
    const blocks = [[B.x, B.y], [Bi.x + Bi.w, B.y], [B.x, Bi.y + Bi.h], [Bi.x + Bi.w, Bi.y + Bi.h]];
    const bw = Bi.x - B.x, bh = Bi.y - B.y;
    for (const [x, y] of blocks) {
      const r = rect(x, y, bw, bh), cx = x + bw / 2, cy = y + bh / 2;
      layers.push(`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="url(#${id('mat')})"/>`, bevel(r, 2.5, true),
        `<circle cx="${n(cx + 0.7)}" cy="${n(cy + 0.7)}" r="${n(bw * 0.3)}" fill="${DARK}"/>`,
        `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(bw * 0.3)}" fill="${LIGHT}"/>`,
        `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(bw * 0.13)}" style="fill:var(--m-inlay)"/>`);
    }
  }
  // the sight edge sloping down into the opening
  layers.push(bevel(Bi, 9, false));

  if (kind === 'jharokha') {
    // jali screen around an arched opening: a shadow behind the lattice, the lattice, then the arch moulding
    const arch = archPath(P);
    const hole = `${arch}Z`;
    defs.push(`<pattern id="${id('jali')}" x="${P.x}" y="${P.y}" width="12" height="12" patternUnits="userSpaceOnUse">
      <path d="M0,0L12,12M12,0L0,12" stroke="${DARK}" stroke-width="2.6" transform="translate(.8,.8)"/>
      <path d="M0,0L12,12M12,0L0,12" style="stroke:var(--m-base)" stroke-width="2.2"/>
      <circle cx="6" cy="6" r="1.8" style="fill:var(--m-hi)"/><circle cx="0" cy="0" r="1.8" style="fill:var(--m-hi)"/>
      <circle cx="12" cy="0" r="1.8" style="fill:var(--m-hi)"/><circle cx="0" cy="12" r="1.8" style="fill:var(--m-hi)"/>
      <circle cx="12" cy="12" r="1.8" style="fill:var(--m-hi)"/></pattern>`);
    const screen = `${box(P)} ${hole}`;
    layers.push(`<path d="${screen}" fill-rule="evenodd" fill="rgba(25,14,6,.55)"/>`);
    layers.push(`<path d="${screen}" fill-rule="evenodd" fill="url(#${id('jali')})"/>`);
    layers.push(`<path d="${arch}" fill="none" stroke="${DARK}" stroke-width="7" transform="translate(1,1.2)"/>`);
    layers.push(`<path d="${arch}" fill="none" style="stroke:var(--m-base)" stroke-width="6"/>`);
    layers.push(`<path d="${arch}" fill="none" stroke="${LIGHT}" stroke-width="1.4" transform="translate(-1.6,-1.2)"/>`);
  }

  const svg = `<svg class="craft-window__art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>${defs.join('')}</defs>${layers.join('')}</svg>`;
  const pct = (v, of) => `${n((v / of) * 100)}%`;
  return {
    svg,
    ratio: `${W} / ${H}`,
    hw: +(H / W).toFixed(4), // height ÷ width, so craft.css can line the windows up with each other

    opening: `top:${pct(P.y, H)};right:${pct(g.r, W)};bottom:${pct(g.b, H)};left:${pct(P.x, W)}`,
  };
}
