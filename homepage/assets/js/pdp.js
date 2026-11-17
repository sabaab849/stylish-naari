/* Stylish Naari — product detail page interactions.
   Header, menus, reveals and the related-products row are handled by homepage.js; the bag by bag.js. */
(function () {
  'use strict';

  var swipeMode = window.matchMedia('(max-width: 767px)'); // phones swipe; tablets and up keep the rail + main image

  /* ─── Gallery: crossfade beside the thumbnail rail (tablet and desktop), swipe on phones ─ */
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var track = gallery.querySelector('[data-gallery-track]');
    var slides = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-slide]'));
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-thumb]'));
    var rail = gallery.querySelector('.pdp-gallery__thumbs');
    var caption = gallery.querySelector('[data-gallery-caption]'); // follows the photo on screen (styled / actual product)
    var current = 0;
    // When the rail holds more thumbnails than fit beside the photo it scrolls on its own; keep the chosen one in
    // view by scrolling the rail only (never the page)
    var revealThumb = function (t) {
      if (!rail || !t || swipeMode.matches || rail.scrollHeight <= rail.clientHeight + 1) return;
      var y = t.offsetTop, h = t.offsetHeight;
      if (y < rail.scrollTop) rail.scrollTop = y - 4;
      else if (y + h > rail.scrollTop + rail.clientHeight) rail.scrollTop = y + h - rail.clientHeight + 4;
    };

    var setIndex = function (i) {
      current = i;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        if (n === i) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      thumbs.forEach(function (t, n) {
        t.classList.toggle('is-active', n === i);
        if (n === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      });
      if (caption && slides[i]) caption.textContent = slides[i].getAttribute('data-caption') || '';
      gallery.dispatchEvent(new CustomEvent('gallery:change', { detail: { index: i } })); // the colour choice follows the photo
    };
    var go = function (i) {
      var next = (i + slides.length) % slides.length;
      if (swipeMode.matches) track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
      setIndex(next);
      revealThumb(thumbs[next]);
    };

    gallery.snGo = function (i) { if (i !== current) go(i); }; // used by the colour choice

    if (slides.length > 1) {
      var prev = gallery.querySelector('[data-gallery-prev]');
      var nextBtn = gallery.querySelector('[data-gallery-next]');
      if (prev) prev.addEventListener('click', function () { go(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1); });
      thumbs.forEach(function (t, n) { t.addEventListener('click', function () { go(n); }); });
      gallery.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      });
      // Swipe: keep the thumbnails in step with the scroll position
      var ticking = false;
      track.addEventListener('scroll', function () {
        if (!swipeMode.matches || ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var i = Math.round(track.scrollLeft / track.clientWidth);
          if (i !== current) setIndex(Math.max(0, Math.min(slides.length - 1, i)));
          ticking = false;
        });
      }, { passive: true });
      // Leaving swipe mode: the slides stack again, so reset the scroll offset
      var onMode = function () { if (!swipeMode.matches) track.scrollLeft = 0; else track.scrollLeft = current * track.clientWidth; };
      if (swipeMode.addEventListener) swipeMode.addEventListener('change', onMode);
    }
  }

  /* ─── Colour choice: one print in several colours ───────────
     Each chip carries its colour's name, price, swatch colour and gallery slide. Choosing one updates them all,
     the bag buttons and the address (?colour=<key>), so every colour has its own link. */
  var variants = document.querySelector('[data-variants]');
  if (variants) {
    var chips = Array.prototype.slice.call(variants.querySelectorAll('[data-variant]'));
    var note = variants.querySelector('[data-variant-note]');
    var swatch = document.querySelector('[data-swatch]');
    var formatPrice = function (n) { return '₹ ' + Number(n).toLocaleString('en-IN'); };
    var chosen = null;
    var choose = function (chip, opts) {
      opts = opts || {};
      if (!chip || chip === chosen) return;
      chosen = chip;
      var key = chip.getAttribute('data-variant');
      chips.forEach(function (c) { c.setAttribute('aria-checked', String(c === chip)); c.tabIndex = c === chip ? 0 : -1; });
      document.querySelectorAll('[data-variant-label]').forEach(function (el) { el.textContent = chip.getAttribute('data-variant-name'); });
      var price = chip.getAttribute('data-variant-price');
      if (price) document.querySelectorAll('[data-variant-price-text]').forEach(function (el) { el.textContent = formatPrice(price); });
      document.querySelectorAll('[data-add-to-bag][data-variant]').forEach(function (b) { b.setAttribute('data-variant', key); });
      if (note) note.hidden = !chip.hasAttribute('data-variant-shared');
      if (swatch) {
        swatch.style.setProperty('--pc', chip.getAttribute('data-variant-hex'));
        swatch.style.setProperty('--pc-text', chip.getAttribute('data-variant-text'));
        var hex = swatch.querySelector('[data-swatch-hex]'); if (hex) hex.textContent = chip.getAttribute('data-variant-hex');
        var nm = swatch.querySelector('[data-swatch-name]'); if (nm) nm.textContent = chip.getAttribute('data-variant-name');
      }
      if (!opts.fromGallery && gallery && gallery.snGo) gallery.snGo(Number(chip.getAttribute('data-variant-slide')));
      if (!opts.silent) {
        try { var u = new URL(location.href); u.searchParams.set('colour', key); history.replaceState(null, '', u); } catch (e) { /* old browser: the link just doesn't change */ }
      }
    };
    chips.forEach(function (c, i) {
      c.tabIndex = i === 0 ? 0 : -1;
      c.addEventListener('click', function () { choose(c); });
      // arrow keys move between colours, as in any radio group
      c.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = chips[(i + d + chips.length) % chips.length];
        next.focus(); choose(next);
      });
    });
    // Browsing to a colour's own photo in the gallery chooses that colour (shared photos leave the choice alone)
    if (gallery) gallery.addEventListener('gallery:change', function (e) {
      if (chosen && Number(chosen.getAttribute('data-variant-slide')) === e.detail.index) return;
      var owners = chips.filter(function (c) { return Number(c.getAttribute('data-variant-slide')) === e.detail.index; });
      if (owners.length === 1) choose(owners[0], { fromGallery: true });
    });
    // Start at the colour in the link, if there is one
    var wanted = null;
    try { wanted = new URL(location.href).searchParams.get('colour'); } catch (e) { /* ignore */ }
    var start = chips.filter(function (c) { return c.getAttribute('data-variant') === wanted; })[0];
    chosen = null;
    choose(start || chips[0], { silent: !start });
  }

  /* ─── Saree swatch: the fabric drifts a few pixels toward the pointer ─
     Mouse only, and not under reduced motion. CSS eases the movement, so this only writes two numbers. */
  var swatch = document.querySelector('[data-swatch]');
  if (swatch && window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var swatchQueued = false, mx = 0, my = 0;
    var writeSwatch = function () {
      swatchQueued = false;
      swatch.style.setProperty('--mx', mx.toFixed(3));
      swatch.style.setProperty('--my', my.toFixed(3));
    };
    swatch.addEventListener('pointermove', function (e) {
      var r = swatch.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!swatchQueued) { swatchQueued = true; requestAnimationFrame(writeSwatch); }
    });
    swatch.addEventListener('pointerleave', function () { mx = 0; my = 0; requestAnimationFrame(writeSwatch); });
  }

  /* ─── Colour chapter: scroll position → visual state ─────────────
     Pure read-then-write per animation frame, only while the chapter is near the viewport.
     Scrolling is never intercepted: no snapping, no wheel handling, no locked states. */
  var chapter = document.querySelector('[data-chapter]');
  if (chapter) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var compact = window.matchMedia('(max-width: 1023px)');
    var bgEl = chapter.querySelector('[data-chapter-bg]');
    var inner = chapter.querySelector('[data-chapter-inner]');
    var frame = chapter.querySelector('[data-chapter-frame]');
    var disc = chapter.querySelector('[data-chapter-disc]');
    var counter = chapter.querySelector('[data-chapter-index]');
    var stateEls = Array.prototype.slice.call(chapter.querySelectorAll('[data-chapter-state]'));
    var layers = Array.prototype.slice.call(chapter.querySelectorAll('[data-chapter-img]'));
    var crops = JSON.parse(chapter.getAttribute('data-states'));
    var n = crops.length;

    /* Colour maths (sRGB) */
    var hex = function (h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); };
    var mix = function (a, b, t) { return [0, 1, 2].map(function (i) { return a[i] + (b[i] - a[i]) * t; }); };
    var css = function (c) { return 'rgb(' + c.map(function (v) { return Math.round(v); }).join(',') + ')'; };
    var lum = function (c) {
      var l = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
    };
    var contrast = function (a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    var INK = hex('#1F1A16'), IVORY = hex('#F6F1EA'), BLACK = [0, 0, 0], WHITE = [255, 255, 255];

    // A tone plus the text colour that reads on it. If neither ink nor ivory reaches 4.5:1,
    // the tone is nudged darker or lighter until one does: contrast wins over exact colour.
    var tone = function (c) {
      for (var i = 0; i < 12; i++) {
        var onInk = contrast(c, INK), onIvory = contrast(c, IVORY);
        if (Math.max(onInk, onIvory) >= 4.5) return { bg: c, text: onIvory >= onInk ? IVORY : INK };
        c = onIvory >= onInk ? mix(c, BLACK, 0.08) : mix(c, WHITE, 0.08);
      }
      return { bg: c, text: contrast(c, IVORY) >= contrast(c, INK) ? IVORY : INK };
    };
    // Tonal family around the product colour: base → slightly lighter → deeper. Never another hue.
    var base = hex(chapter.getAttribute('data-colour'));
    var palette = [tone(base), tone(mix(base, WHITE, 0.1)), tone(mix(base, BLACK, 0.34))].slice(0, n);
    var geoFixed = chapter.getAttribute('data-geo') ? hex(chapter.getAttribute('data-geo')) : null;

    /* Timeline (fraction of the pinned scroll): hold, cross, hold, cross, hold.
       The colour stays at full spread to the end and the chapter scrolls away still filled, straight
       into the full-bleed photograph below, so there is no empty ivory screen on the way out. */
    var HOLDS = n === 3 ? [[0, 0.27], [0.36, 0.57], [0.66, 0.86]] : n === 2 ? [[0, 0.4], [0.5, 0.86]] : [[0, 0.86]];
    var RELEASE = [0.88, 1]; // the last stretch of the pinned scroll: the colour closes back into the centre
    var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }; // easeInOutCubic
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    // Continuous state position: 0 … n-1, eased across each crossing
    var statePos = function (p) {
      for (var i = 0; i < HOLDS.length; i++) {
        if (p <= HOLDS[i][1]) return i;
        var next = HOLDS[i + 1];
        if (next && p < next[0]) return i + (p - HOLDS[i][1]) / (next[0] - HOLDS[i][1]);
      }
      return n - 1;
    };
    var at = function (arr, sp) { var i = Math.floor(sp), t = sp - i; return [arr[i], arr[Math.min(i + 1, arr.length - 1)], t]; };

    /* Frame shapes per state — insets (%) + corner radius (%): rectangle → tall column → circle */
    var SHAPES = [[0, 0, 0], [0, 13, 0], [14, 5, 50]].slice(0, n);
    // Each image layer keeps the crop of the nearest state that uses it, so it never jumps while hidden
    var layerCrop = layers.map(function (el) {
      var id = Number(el.getAttribute('data-chapter-img'));
      return crops.map(function (c, k) {
        if (c.img === id) return c;
        for (var d = 1; d < n; d++) {
          if (crops[k - d] && crops[k - d].img === id) return crops[k - d];
          if (crops[k + d] && crops[k + d].img === id) return crops[k + d];
        }
        return c;
      });
    });
    var pct = function (v) { return parseFloat(v); };

    // Write a style only when its value has changed, so a held state costs the browser nothing
    var written = new Map();
    var put = function (el, prop, value) {
      var seen = written.get(el);
      if (!seen) { seen = {}; written.set(el, seen); }
      if (seen[prop] === value) return;
      seen[prop] = value;
      el.style[prop] = value;
    };

    var under = chapter.nextElementSibling && chapter.nextElementSibling.classList.contains('unfolded') ? chapter.nextElementSibling : null;
    if (under) document.documentElement.classList.add('has-chapter-reveal');

    /* Pace: scrolling sets where the chapter is heading; the picture follows at the scroll's own speed, within
       limits, the same way scrolling down and up. Scroll slowly and it keeps step with the page; scroll faster and
       it speeds up with you; flick and it tops out at a pace where every change is still seen, so a mouse wheel's
       steps and a hard flick both read as one continuous movement. Each value (how far the colour has opened,
       progress through the chapter, the state position) moves toward its target at
         speed = the scroll's own speed + keep × how far behind it is,
       kept between min (so it always settles) and max (the fastest it ever moves), in units per second.
       At max, one change of state takes about half a second (1 / 2); slower scrolling gives slower changes, down
       to the scroll's own pace. Scrolling itself is never touched. */
    var PACE = {
      entry: { min: 0.3, max: 2.4, keep: 4 },  // the colour opening as the chapter arrives
      p:     { min: 0.1, max: 1.2, keep: 3 },  // progress through the pinned scroll
      sp:    { min: 0.35, max: 2, keep: 3 },   // state position: 0 … n-1
    };
    // No state is ever skipped: the content arrives on the first state and leaves on the last, in both directions.
    // ENTRY_IN: by here the colour has opened and the content faded in. P_OUT: after here the content starts to leave.
    var ENTRY_IN = 0.65, P_OUT = 0.84;
    var shown = null, lastTime = 0; // shown = the { entry, p, sp } currently on screen
    var aimed = null, speedOf = { entry: 0, p: 0, sp: 0 }; // last frame's targets, and how fast the scroll moves each

    // Draws one frame. Returns true once the picture has caught up with the scroll position.
    function render(now) {
      var rect = chapter.getBoundingClientRect();
      var vh = window.innerHeight;
      var still = reduce.matches;
      var gentle = compact.matches;

      // The section after the chapter ("A closer look") overlaps the chapter's last screen in the layout.
      // While the chapter is pinned, hold that section at the top of the screen underneath it, so the closing
      // circle uncovers the photograph rather than an empty page. This follows the real scroll position (not
      // the smoothed one); at the end of the pin the offset is zero and the two scroll on together.
      if (under) {
        var lead = rect.top + (rect.height - vh); // how far below the top of the screen the section naturally sits
        put(under, 'transform', rect.top <= 0 && lead > 0 ? 'translate3d(0,' + (-lead).toFixed(1) + 'px,0)' : '');
      }

      var target = {
        entry: clamp((vh - rect.top) / vh, 0, 1),                 // 0 → 1 as the chapter arrives
        p: clamp(-rect.top / Math.max(1, rect.height - vh), 0, 1), // 0 → 1 across the pinned scroll
      };
      target.sp = statePos(target.p);
      var settled = true;
      if (still || !shown || !aimed || typeof now !== 'number') {
        shown = { entry: target.entry, p: target.p, sp: target.sp };
        speedOf = { entry: 0, p: 0, sp: 0 };
      } else {
        var dt = Math.min(now - lastTime, 64) / 1000; // seconds since the last frame (capped after a pause)
        var before = { entry: shown.entry, p: shown.p, sp: shown.sp };
        ['entry', 'p', 'sp'].forEach(function (key) {
          // how fast the scroll is moving this value, smoothed over about a tenth of a second
          if (dt > 0) speedOf[key] += ((target[key] - aimed[key]) / dt - speedOf[key]) * Math.min(1, dt / 0.1);
          var gap = target[key] - shown[key], pace = PACE[key];
          var step = clamp(Math.abs(speedOf[key]) + pace.keep * Math.abs(gap), pace.min, pace.max) * dt;
          if (Math.abs(gap) <= step) shown[key] = target[key];
          else shown[key] += gap > 0 ? step : -step;
        });
        // Hold back whichever value would skip a state. Decided from the last frame, so arriving and leaving run
        // in the same order both ways.
        if (before.entry < ENTRY_IN) shown.sp = Math.min(shown.sp, 0);    // arriving: the first state shows before anything changes
        if (before.sp > 0) shown.entry = Math.max(shown.entry, ENTRY_IN); // leaving upward: back to the first state before the colour closes
        if (before.sp < n - 1) shown.p = Math.min(shown.p, P_OUT);         // leaving downward: the last state shows before the content goes
        if (before.p > P_OUT) shown.sp = Math.max(shown.sp, n - 1);        // coming back up: the content returns on the last state
        settled = shown.entry === target.entry && shown.p === target.p && shown.sp === target.sp;
        if (settled) speedOf = { entry: 0, p: 0, sp: 0 };
      }
      aimed = { entry: target.entry, p: target.p, sp: target.sp };
      lastTime = typeof now === 'number' ? now : performance.now();
      var entry = shown.entry, p = shown.p;

      // the state position moves at its paced speed (above); each crossing is then eased in and out
      var sp = Math.floor(shown.sp) + ease(shown.sp - Math.floor(shown.sp));
      if (still) sp = Math.round(shown.sp);

      // Colour: opens from the centre as the chapter arrives and closes back into the centre as it ends.
      // Both are tied to scroll position, so scrolling up replays each one in reverse: coming back from
      // below, the circle reopens from the centre; leaving at the top, it closes.
      var grow = still ? (entry > 0.2 ? 1 : 0) : ease(clamp(entry / 0.6, 0, 1));
      var release = still ? (p < 0.94 ? 1 : 0) : 1 - ease(clamp((p - RELEASE[0]) / (RELEASE[1] - RELEASE[0]), 0, 1));
      var radius = 71 * Math.min(grow, release);

      var pc = at(palette, sp);
      var bg = mix(pc[0].bg, pc[1].bg, pc[2]);
      var text = mix(pc[0].text, pc[1].text, pc[2]);
      var geo = geoFixed || (lum(bg) > 0.1 ? mix(bg, BLACK, 0.2) : mix(bg, WHITE, 0.14));

      // Each value goes straight onto the one element that uses it (not onto a variable on the whole
      // chapter, which made the browser restyle everything inside it on every frame). Once the colour
      // covers the screen the circular clip is dropped altogether: an unclipped fill is far cheaper.
      put(bgEl, 'clipPath', radius >= 70.99 ? 'none' : 'circle(' + radius.toFixed(2) + '% at 50% 50%)');
      put(bgEl, 'backgroundColor', css(bg));
      put(inner, 'color', css(text));
      put(disc, 'backgroundColor', css(geo));

      // Content arrives once the colour has mostly spread
      var contentIn = still ? (entry > 0.3 ? 1 : 0) : clamp((entry - 0.3) / 0.35, 0, 1);
      // …and leaves just before the colour closes
      var contentOut = still ? (p < 0.92 ? 1 : 0) : 1 - clamp((p - 0.84) / 0.06, 0, 1);
      put(inner, 'opacity', Math.min(contentIn, contentOut).toFixed(3));

      // Frame shape (left unclipped while it is a plain rectangle)
      var sh = at(SHAPES, sp);
      var top = lerp(sh[0][0], sh[1][0], sh[2]), side = lerp(sh[0][1], sh[1][1], sh[2]), round = lerp(sh[0][2], sh[1][2], sh[2]);
      put(frame, 'clipPath', top + side + round < 0.01 ? 'none' : 'inset(' + top.toFixed(2) + '% ' + side.toFixed(2) + '% round ' + round.toFixed(2) + '%)');

      // Images: interpolate zoom + focal point; crossfade between different photographs
      var drift = still || gentle ? 1 : 1 + 0.035 * p; // a slow push-in through the whole chapter
      layers.forEach(function (el, li) {
        var lc = at(layerCrop[li], sp);
        var id = Number(el.getAttribute('data-chapter-img'));
        var o0 = crops[Math.floor(sp)].img === id ? 1 : 0;
        var o1 = crops[Math.min(Math.floor(sp) + 1, n - 1)].img === id ? 1 : 0;
        var opacity = lerp(o0, o1, lc[2]);
        put(el, 'opacity', opacity.toFixed(3));
        put(el, 'visibility', opacity < 0.001 ? 'hidden' : 'visible'); // a hidden photograph is not drawn or moved at all
        if (opacity < 0.001) return;
        var s = lerp(lc[0].s, lc[1].s, lc[2]) * drift;
        put(el, 'transformOrigin', lerp(pct(lc[0].ox), pct(lc[1].ox), lc[2]).toFixed(2) + '% ' + lerp(pct(lc[0].oy), pct(lc[1].oy), lc[2]).toFixed(2) + '%');
        put(el, 'objectPosition', (lc[2] < 0.5 ? lc[0].op : lc[1].op) || '50% 50%');
        put(el, 'transform', 'scale(' + s.toFixed(4) + ')');
      });

      // The disc drifts up and grows a little: one shape, moving slowly
      if (still) put(disc, 'transform', 'none');
      else {
        var travel = gentle ? 4 : 10;
        put(disc, 'transform', 'translate3d(0,' + lerp(travel, -travel, p).toFixed(2) + '%,0) scale(' + lerp(0.9, 1.06, p).toFixed(4) + ')');
      }

      // State text: crossfade with a short rise
      var active = Math.round(sp);
      stateEls.forEach(function (el, k) {
        var d = sp - k;
        var o = clamp(1 - Math.abs(d) * 2.2, 0, 1);
        put(el, 'opacity', o.toFixed(3));
        put(el, 'transform', still ? 'none' : 'translate3d(0,' + (-d * 28).toFixed(1) + 'px,0)');
        el.classList.toggle('is-active', k === active);
      });
      var count = String(active + 1).padStart(2, '0');
      if (counter && counter.textContent !== count) counter.textContent = count;
      return settled;
    }

    var running = false, queued = false;
    // Keeps drawing frames after the last scroll event until the picture has caught up
    var frameTick = function (now) {
      queued = false;
      if (!render(now) && running) { queued = true; requestAnimationFrame(frameTick); }
    };
    var onScroll = function () { if (running && !queued) { queued = true; requestAnimationFrame(frameTick); } };
    // The photographs are large. Decode them before the chapter arrives, not in the middle of the scroll.
    var decoded = false;
    var decodeAhead = function () {
      if (decoded) return;
      decoded = true;
      layers.forEach(function (el) {
        el.loading = 'eager';
        if (el.decode) el.decode().catch(function () {});
      });
    };
    // Only work while the chapter is within a screen of the viewport
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) { shown = null; decodeAhead(); onScroll(); } // start from the true position, not a stale one
      }, { rootMargin: '100% 0px 100% 0px' }).observe(chapter);
    } else { running = true; decodeAhead(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    var redraw = function () { shown = null; render(); }; // jump straight to the right state, no easing
    window.addEventListener('resize', function () { if (running) redraw(); });
    if (reduce.addEventListener) reduce.addEventListener('change', redraw);
    redraw();
  }

  /* ─── Saree video ─────────────────────────────────────────────
     Gallery: the video slide plays (muted) only while it is the active slide; a toggle turns sound on.
     Film card: loops silently while on screen; "Watch with sound" opens the full video in a dialog.
     Reduced motion or data saver: nothing autoplays; posters show. A broken file hides its player. */
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !!(navigator.connection && navigator.connection.saveData);
  var load = function (v) { if (v && !v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.load(); } };
  var tryPlay = function (v) { load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); };

  var videoSlide = document.querySelector('[data-gallery-video]');
  if (videoSlide) {
    var gv = videoSlide.querySelector('video'), sound = videoSlide.querySelector('[data-video-sound]');
    var sync = function () {
      if (videoSlide.classList.contains('is-active')) { if (!still || gv.dataset.asked) tryPlay(gv); } else gv.pause();
    };
    new MutationObserver(sync).observe(videoSlide, { attributes: true, attributeFilter: ['class'] });
    // choosing the video is itself a request to play it, even under reduced motion
    var thumb = document.querySelector('.pdp-gallery__thumb--video');
    if (thumb) thumb.addEventListener('click', function () { gv.dataset.asked = '1'; setTimeout(sync, 0); });
    sound.addEventListener('click', function () {
      gv.muted = !gv.muted;
      sound.setAttribute('aria-pressed', String(!gv.muted));
      sound.textContent = gv.muted ? 'Sound off' : 'Sound on';
      sound.setAttribute('aria-label', gv.muted ? 'Turn sound on' : 'Turn sound off');
      if (!gv.muted) tryPlay(gv);
    });
    gv.addEventListener('error', function () { var li = thumb && thumb.closest('li'); if (li) li.hidden = true; });
  }

  /* Video card: loops silently while on screen; controls appear on hover, focus or a tap */
  Array.prototype.forEach.call(document.querySelectorAll('[data-vcard]'), function (card) {
    var cv = card.querySelector('[data-vcard-video]'), soundBtn = card.querySelector('[data-vcard-sound]');
    var label = card.querySelector('[data-vcard-sound-label]'), iconOn = card.querySelector('[data-vcard-icon-on]'), iconOff = card.querySelector('[data-vcard-icon-off]');
    var timeEl = card.querySelector('[data-vcard-time]');
    var fmt = function (s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    cv.addEventListener('loadedmetadata', function () { timeEl.textContent = fmt(cv.duration); });
    cv.addEventListener('error', function () { card.hidden = true; });
    var setSound = function (on) {
      cv.muted = !on;
      soundBtn.setAttribute('aria-pressed', String(on));
      label.textContent = on ? 'Sound on' : 'Sound off';
      iconOn.hidden = !on; iconOff.hidden = on;
      if (on) tryPlay(cv);
    };
    soundBtn.addEventListener('click', function () { setSound(cv.muted); });
    var fullBtn = card.querySelector('[data-vcard-full]');
    if (fullBtn) fullBtn.addEventListener('click', function () {
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      if (card.requestFullscreen) { card.requestFullscreen().then(function () { setSound(true); }).catch(function () {}); }
      else if (cv.webkitEnterFullscreen) { load(cv); cv.webkitEnterFullscreen(); } // iPhone: the native player
    });
    // touch screens have no hover: a tap on the video shows the controls for a few seconds
    var hideTimer;
    cv.addEventListener('click', function () { card.classList.add('is-revealed'); clearTimeout(hideTimer); hideTimer = setTimeout(function () { card.classList.remove('is-revealed'); }, 3000); });
    if (still) { load(cv); cv.preload = 'metadata'; }
    else if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { if (e[0].isIntersecting) tryPlay(cv); else cv.pause(); }, { threshold: 0.35 }).observe(card);
    else tryPlay(cv);
  });

  /* ─── Buy bar: appears once the main Add to bag has scrolled away ─ */
  /* ─── The Saree, Unfolded: the photograph shifts slightly as the section crosses the screen ─ */
  var unfolded = document.querySelector('[data-unfolded]');
  if (unfolded && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var shiftQueued = false;
    var setShift = function () {
      shiftQueued = false;
      var box = unfolded.getBoundingClientRect();
      var vh = window.innerHeight;
      if (box.bottom < 0 || box.top > vh) return;
      var p = (vh / 2 - (box.top + box.height / 2)) / ((vh + box.height) / 2); // -1 entering → 1 leaving
      unfolded.style.setProperty('--shift', Math.max(-1, Math.min(1, p)).toFixed(3));
    };
    var queueShift = function () { if (!shiftQueued) { shiftQueued = true; requestAnimationFrame(setShift); } };
    window.addEventListener('scroll', queueShift, { passive: true });
    window.addEventListener('resize', queueShift);
    setShift();
  }

  var bar = document.querySelector('[data-buybar]');
  var cta = document.querySelector('[data-pdp-cta]');
  var footer = document.querySelector('.site-footer');
  // A scroll check rather than IntersectionObserver: the CTA can start below the fold on phones, and a jump
  // past it (anchor link, fast fling, restored scroll) never crosses a threshold, so an observer wouldn't fire.
  if (bar && cta) {
    var barButton = bar.querySelector('button');
    var barShown = null, barQueued = false; // own names: var is function-scoped, and the colour chapter above uses shown / queued
    var updateBar = function () {
      barQueued = false;
      var ctaGone = cta.getBoundingClientRect().bottom < 0;
      var footerIn = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
      var show = ctaGone && !footerIn;
      if (show === barShown) return;
      barShown = show;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', String(!show));
      if (barButton) barButton.tabIndex = show ? 0 : -1;
    };
    var queueBar = function () { if (!barQueued) { barQueued = true; requestAnimationFrame(updateBar); } };
    window.addEventListener('scroll', queueBar, { passive: true });
    window.addEventListener('resize', queueBar);
    updateBar();
  }
})();
