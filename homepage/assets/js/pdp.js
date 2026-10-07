/* Stylish Naari — product detail page interactions.
   Header, menus, reveals and the related-products row are handled by homepage.js; the bag by bag.js. */
(function () {
  'use strict';

  var swipeMode = window.matchMedia('(max-width: 1023px)');

  /* ─── Gallery: crossfade on desktop, swipe on tablet/mobile ─ */
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var track = gallery.querySelector('[data-gallery-track]');
    var slides = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-slide]'));
    var indexEl = gallery.querySelector('[data-gallery-index]');
    var current = 0;

    var label = function (i) { return String(i + 1).padStart(2, '0'); };
    var setIndex = function (i) {
      current = i;
      if (indexEl) indexEl.textContent = label(i);
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        if (n === i) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
    };
    var go = function (i) {
      var next = (i + slides.length) % slides.length;
      if (swipeMode.matches) track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
      setIndex(next);
    };

    if (slides.length > 1) {
      var prev = gallery.querySelector('[data-gallery-prev]');
      var nextBtn = gallery.querySelector('[data-gallery-next]');
      if (prev) prev.addEventListener('click', function () { go(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1); });
      gallery.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      });
      // Swipe: keep the counter in step with the scroll position
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

    /* Timeline (fraction of the pinned scroll): hold, cross, hold, cross, hold, release */
    var HOLDS = n === 3 ? [[0, 0.27], [0.36, 0.57], [0.66, 0.85]] : n === 2 ? [[0, 0.4], [0.5, 0.85]] : [[0, 0.85]];
    var RELEASE = [0.86, 1];
    var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }; // easeInOutCubic
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    // Continuous state position: 0 … n-1, eased across each crossing
    var statePos = function (p) {
      for (var i = 0; i < HOLDS.length; i++) {
        if (p <= HOLDS[i][1]) return i;
        var next = HOLDS[i + 1];
        if (next && p < next[0]) return i + ease((p - HOLDS[i][1]) / (next[0] - HOLDS[i][1]));
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

    function render() {
      var rect = chapter.getBoundingClientRect();
      var vh = window.innerHeight;
      var entry = clamp((vh - rect.top) / vh, 0, 1);                 // 0 → 1 as the chapter arrives
      var p = clamp(-rect.top / Math.max(1, rect.height - vh), 0, 1); // 0 → 1 across the pinned scroll
      var still = reduce.matches;
      var gentle = compact.matches;

      var sp = statePos(p);
      if (still) sp = Math.round(sp);

      // Colour: spreads out from the centre on arrival, contracts back into it on release.
      var grow = still ? (entry > 0.5 ? 1 : 0) : ease(clamp((entry - 0.15) / 0.85, 0, 1));
      var release = still ? (p < 0.93 ? 1 : 0) : 1 - ease(clamp((p - RELEASE[0]) / (RELEASE[1] - RELEASE[0]), 0, 1));
      var radius = 71 * Math.min(grow, release);

      var pc = at(palette, sp);
      var bg = mix(pc[0].bg, pc[1].bg, pc[2]);
      var text = mix(pc[0].text, pc[1].text, pc[2]);
      var geo = geoFixed || (lum(bg) > 0.1 ? mix(bg, BLACK, 0.2) : mix(bg, WHITE, 0.14));

      chapter.style.setProperty('--ch-r', radius.toFixed(2) + '%');
      chapter.style.setProperty('--ch-bg', css(bg));
      chapter.style.setProperty('--ch-text', css(text));
      chapter.style.setProperty('--ch-geo', css(geo));

      // Content arrives once the colour has mostly spread, and leaves before it contracts
      var contentIn = still ? (entry > 0.6 ? 1 : 0) : clamp((entry - 0.55) / 0.4, 0, 1);
      var contentOut = still ? (p < 0.9 ? 1 : 0) : 1 - clamp((p - 0.85) / 0.06, 0, 1);
      inner.style.opacity = Math.min(contentIn, contentOut).toFixed(3);

      // Frame shape
      var sh = at(SHAPES, sp);
      var top = lerp(sh[0][0], sh[1][0], sh[2]), side = lerp(sh[0][1], sh[1][1], sh[2]), round = lerp(sh[0][2], sh[1][2], sh[2]);
      frame.style.setProperty('--ch-clip', 'inset(' + top.toFixed(2) + '% ' + side.toFixed(2) + '% round ' + round.toFixed(2) + '%)');

      // Images: interpolate zoom + focal point; crossfade between different photographs
      var drift = still || gentle ? 1 : 1 + 0.035 * p; // a slow push-in through the whole chapter
      layers.forEach(function (el, li) {
        var lc = at(layerCrop[li], sp);
        var id = Number(el.getAttribute('data-chapter-img'));
        var o0 = crops[Math.floor(sp)].img === id ? 1 : 0;
        var o1 = crops[Math.min(Math.floor(sp) + 1, n - 1)].img === id ? 1 : 0;
        el.style.opacity = lerp(o0, o1, lc[2]).toFixed(3);
        var s = lerp(lc[0].s, lc[1].s, lc[2]) * drift;
        el.style.transformOrigin = lerp(pct(lc[0].ox), pct(lc[1].ox), lc[2]).toFixed(2) + '% ' + lerp(pct(lc[0].oy), pct(lc[1].oy), lc[2]).toFixed(2) + '%';
        el.style.objectPosition = (lc[2] < 0.5 ? lc[0].op : lc[1].op) || '50% 50%';
        el.style.transform = 'scale(' + s.toFixed(4) + ')';
      });

      // The disc drifts up and grows a little: one shape, moving slowly
      if (still) disc.style.transform = 'none';
      else {
        var travel = gentle ? 4 : 10;
        disc.style.transform = 'translate3d(0,' + lerp(travel, -travel, p).toFixed(2) + '%,0) scale(' + lerp(0.9, 1.06, p).toFixed(4) + ')';
      }

      // State text: crossfade with a short rise
      var active = Math.round(sp);
      stateEls.forEach(function (el, k) {
        var d = sp - k;
        var o = clamp(1 - Math.abs(d) * 2.2, 0, 1);
        el.style.opacity = o.toFixed(3);
        el.style.transform = still ? 'none' : 'translate3d(0,' + (-d * 28).toFixed(1) + 'px,0)';
        el.classList.toggle('is-active', k === active);
      });
      if (counter) counter.textContent = String(active + 1).padStart(2, '0');
    }

    var running = false, queued = false;
    var frameTick = function () { queued = false; render(); };
    var onScroll = function () { if (running && !queued) { queued = true; requestAnimationFrame(frameTick); } };
    // Only work while the chapter is within a screen of the viewport
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) onScroll();
      }, { rootMargin: '100% 0px 100% 0px' }).observe(chapter);
    } else running = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { if (running) render(); });
    if (reduce.addEventListener) reduce.addEventListener('change', render);
    render();
  }

  /* ─── Buy bar: appears once the main Add to bag has scrolled away ─ */
  var bar = document.querySelector('[data-buybar]');
  var cta = document.querySelector('[data-pdp-cta]');
  var footer = document.querySelector('.site-footer');
  // A scroll check rather than IntersectionObserver: the CTA can start below the fold on phones, and a jump
  // past it (anchor link, fast fling, restored scroll) never crosses a threshold, so an observer wouldn't fire.
  if (bar && cta) {
    var barButton = bar.querySelector('button');
    var shown = null, queued = false;
    var update = function () {
      queued = false;
      var ctaGone = cta.getBoundingClientRect().bottom < 0;
      var footerIn = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
      var show = ctaGone && !footerIn;
      if (show === shown) return;
      shown = show;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', String(!show));
      if (barButton) barButton.tabIndex = show ? 0 : -1;
    };
    var queue = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }
})();
