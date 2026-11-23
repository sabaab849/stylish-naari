/* Stylissh Naari — homepage hero carousel (client, 23 Nov 2026)
   Slide 1 = the original hero (left exactly as it was), slide 2 = "The Art of the Saree", slide 3 = the Dulhan Edit film (portrait film shown whole, original audio, sound button).
   Autoplay (client, 23 Nov 2026, replacing the brand guidelines §13 no-auto-advance rule for this hero): every slide shows for 6 s, then the
   next unfolds in (CSS .is-entering / .is-leaving); it loops. The only visible control is the pagination (01 ━━ 02 ─ 03 ─): click any
   number to go there; one 50 ms clock fills the active line and advances when it is full, so the timer and the line can never drift
   apart and there is only ever one timer. Paused while a mouse is over the hero, focus is inside it, the tab is hidden, or the
   visitor has turned the film's sound on / pressed its play button; reduced motion = no autoplay. Swipe and the arrow keys still work. The inactive slide is inert. While a light slide is showing, <html data-hero-slide>
   is set so homepage.js keeps the header solid (dark logo); mark such a slide data-light. Slide 2 also gets a very light pointer drift
   (max 10px, fine pointers only, off under reduced motion): set DRIFT to false to remove it. */
(function () {
  'use strict';
  var root = document.querySelector('[data-hero-carousel]');
  if (!root) return;
  var DRIFT = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides = Array.prototype.filter.call(root.children, function (el) { return el.tagName === 'SECTION'; });
  if (slides.length < 2) return;
  var pager = root.querySelector('[data-carousel-pager]');
  var items = [];
  var index = -1;
  var LEAVE_MS = 1600;
  var leaveTimer = 0;
  var hover = false, focusIn = false, filmHeld = false;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  slides.forEach(function (s, i) {
    s.setAttribute('data-slide', '');
    s.setAttribute('aria-roledescription', 'slide');
    if (!s.hasAttribute('aria-label') && !s.hasAttribute('aria-labelledby')) s.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
  });
  if (pager) {
    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hero-pager__item';
      var label = s.getAttribute('aria-label') || ((document.getElementById(s.getAttribute('aria-labelledby') || '') || {}).textContent || '').trim();
      b.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of ' + slides.length + (label ? ': ' + label : ''));
      b.innerHTML = '<span class="hero-pager__num" aria-hidden="true">' + pad(i + 1) + '</span><span class="hero-pager__track" aria-hidden="true"><span class="hero-pager__fill"></span></span>';
      b.addEventListener('click', function () { show(i, false, false); });
      pager.appendChild(b);
      items.push(b);
    });
    pager.hidden = false;
  }
  var DUR = 6000, STEP = 50, elapsed = 0, last = 0, clock = 0;
  function paused() { return hover || focusIn || filmHeld || document.hidden; }
  function syncPause() { root.classList.toggle('is-paused', paused()); }
  function tick() {
    var now = performance.now();
    var dt = last ? Math.min(now - last, 200) : 0; // a long gap (tab away, throttled timer) never counts as play time
    last = now;
    if (paused()) return;
    elapsed += dt;
    var fill = items[index] && items[index].firstChild.nextSibling.firstChild;
    if (fill) fill.style.transform = 'scaleX(' + Math.min(1, elapsed / DUR).toFixed(4) + ')';
    if (elapsed >= DUR) show(index + 1, false, true);
  }
  function restartProgress() {
    elapsed = 0;
    items.forEach(function (b, n) {
      b.setAttribute('aria-current', n === index ? 'true' : 'false');
      b.firstChild.nextSibling.firstChild.style.transform = (reduce && n === index) ? 'none' : 'scaleX(0)';
    });
    if (!reduce && !clock && items.length) clock = setInterval(tick, STEP);
  }

  function show(i, focus, auto) {
    var next = (i + slides.length) % slides.length;
    if (next === index) { restartProgress(); return; }
    var prev = index;
    index = next;
    clearTimeout(leaveTimer);
    slides.forEach(function (s, n) {
      var on = n === index;
      s.classList.remove('is-leaving', 'is-entering');
      if (n === prev) s.classList.add('is-leaving');
      if (on && prev !== -1) { void s.offsetWidth; s.classList.add('is-entering'); }
      s.classList.toggle('is-active', on);
      s.inert = !on;
      if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
    });
    var slide = slides[index];
    var light = slide.hasAttribute('data-light'); // a slide on a light ground: header goes solid, controls ink
    root.classList.toggle('is-light', light);
    if (light) document.documentElement.setAttribute('data-hero-slide', String(index));
    else document.documentElement.removeAttribute('data-hero-slide');
    window.dispatchEvent(new CustomEvent('heroslide', { detail: { index: index } }));
    leaveTimer = setTimeout(function () {
      slides.forEach(function (s) { s.classList.remove('is-leaving', 'is-entering'); });
    }, LEAVE_MS + 50);
    restartProgress();
    if (slide.classList.contains('craft-hero') && !slide.classList.contains('is-revealed')) {
      // two frames so the hidden start state paints before the reveal runs
      requestAnimationFrame(function () { requestAnimationFrame(function () { slide.classList.add('is-revealed'); }); });
    }
    if (!slide.hasAttribute('data-film-hero')) { filmHeld = false; syncPause(); }
    film(slide.hasAttribute('data-film-hero'), auto);
    if (focus) slide.focus({ preventScroll: true });
  }

  // pause: a mouse over the hero (not touch), keyboard focus inside it, a hidden tab
  // Hover pauses only over something clickable in the hero (the pagination, the headline links, the film buttons): the hero fills the
  // screen, so pausing for the whole hero meant a resting mouse stopped the slideshow for good.
  var HOLD = 'a, button, [data-carousel-pager]';
  root.addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse') return;
    var on = !!(e.target.closest && e.target.closest(HOLD));
    if (on !== hover) { hover = on; syncPause(); }
  });
  root.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && hover) { hover = false; syncPause(); } });
  root.addEventListener('focusin', function (e) { focusIn = e.target.matches(':focus-visible'); syncPause(); }); // keyboard focus only: a click on the pagination must not stop the slideshow
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { focusIn = false; syncPause(); } });
  document.addEventListener('visibilitychange', syncPause);
  root.addEventListener('keydown', function (e) {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowRight') { show(index + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { show(index - 1); e.preventDefault(); }
  });

  // Swipe (horizontal only; vertical scroll is never intercepted)
  var sx = 0, sy = 0, tracking = false;
  root.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (!tracking) return; tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Light pointer drift on the craft slide: layers move by their depth (--d), eased by the CSS transition
  var craft = root.querySelector('[data-craft-hero]');
  if (craft && DRIFT && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var raf = 0, lx = 0, ly = 0;
    craft.addEventListener('pointermove', function (e) {
      var r = craft.getBoundingClientRect();
      lx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ly = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0; craft.style.setProperty('--px', lx.toFixed(3)); craft.style.setProperty('--py', ly.toFixed(3));
      });
    });
    craft.addEventListener('pointerleave', function () { craft.style.setProperty('--px', 0); craft.style.setProperty('--py', 0); });
  }

  // Slide 3, the Dulhan Edit film (client, 23 Nov 2026). Nothing downloads until the slide is first opened; it plays only while
  // showing and while the tab is visible; plays WITH sound until the visitor mutes it (the slide is reached by an arrow, swipe or key press, which counts as the gesture browsers want; if a browser still refuses, it falls back to muted and the button shows that); reduced motion = poster, tap to play.
  // Landscape screens get the 16:9 cut, portrait screens the 9:16 film; a phone / data-saver gets the smaller file of either.
  var filmSlide = root.querySelector('[data-film-hero]');
  var vid = filmSlide && filmSlide.querySelector('[data-film]');
  var playBtn = filmSlide && filmSlide.querySelector('[data-film-play]');
  var soundBtn = filmSlide && filmSlide.querySelector('[data-film-sound]');
  var filmOn = false, loaded = false, userPaused = reduce, kind = '';
  var wideMQ = window.matchMedia('(min-aspect-ratio: 1/1)');
  function filmSource() {
    var k = wideMQ.matches ? 'wide' : 'tall';
    var small = window.innerWidth < 768 || (navigator.connection && navigator.connection.saveData);
    if (k === kind) return;
    var t = kind ? vid.currentTime : 0, had = !!kind; kind = k;
    vid.poster = vid.getAttribute('data-' + k + '-poster');
    vid.src = vid.getAttribute('data-' + k + (small ? '-small' : ''));
    vid.load();
    if (had) vid.addEventListener('loadedmetadata', function f() { vid.removeEventListener('loadedmetadata', f); try { vid.currentTime = Math.max(0, Math.min(t, (vid.duration || t) - 0.1)); } catch (e) {} });
  }
  function soundUi() {
    if (!soundBtn) return;
    soundBtn.setAttribute('aria-pressed', vid.muted ? 'false' : 'true');
    soundBtn.setAttribute('aria-label', vid.muted ? 'Turn sound on' : 'Turn sound off');
  }
  function filmSync() {
    if (!loaded) return;
    if (filmOn && !userPaused && !document.hidden) {
      var p = vid.play();
      if (p && p.catch) p.catch(function () {
        if (vid.muted) return;
        vid.muted = true; soundUi(); // autoplay with sound was refused: play muted instead; the button offers sound
        var q = vid.play(); if (q && q.catch) q.catch(function () {});
      });
    } else vid.pause();
  }
  var soundChosen = false;
  function film(on, auto) {
    if (!vid) return;
    if (on && auto && !soundChosen) { vid.muted = true; soundUi(); } // reached by autoplay: start silent; the button offers sound
    filmOn = on;
    if (on && !loaded) { loaded = true; filmSource(); }
    filmSync();
  }
  if (vid) {
    vid.muted = false; soundUi(); // sound on by default
    document.addEventListener('visibilitychange', filmSync);
    var onShape = function () { if (loaded) { filmSource(); filmSync(); } };
    if (wideMQ.addEventListener) wideMQ.addEventListener('change', onShape); else wideMQ.addListener(onShape);
    playBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    playBtn.setAttribute('aria-label', userPaused ? 'Play film' : 'Pause film');
    playBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      playBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
      playBtn.setAttribute('aria-label', userPaused ? 'Play film' : 'Pause film');
      filmHeld = !userPaused; syncPause(); // pressing play = watching: hold the slideshow
      filmSync();
    });
    soundBtn.addEventListener('click', function () {
      vid.muted = !vid.muted;
      soundChosen = !vid.muted;
      filmHeld = !vid.muted; syncPause(); // listening: hold the slideshow until sound is turned off
      soundUi();
      if (!vid.muted && userPaused) playBtn.click(); // asking for sound means asking to watch
    });
  }

  // ?slide=2 opens a given slide (handy for review links)
  var q = parseInt(new URLSearchParams(location.search).get('slide'), 10);
  show(q > 0 && q <= slides.length ? q - 1 : 0, false, true);
})();
