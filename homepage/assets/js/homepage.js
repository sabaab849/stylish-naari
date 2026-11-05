/* Stylish Naari — homepage interactions
   Small, dependency-free. Each block maps to one Shopify section's JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Hero: fade in once the image has loaded ─────────── */
  var hero = document.querySelector('[data-hero]');
  var heroImg = document.querySelector('[data-hero-img]');
  if (hero && heroImg) {
    var showHero = function () { hero.classList.add('is-loaded'); };
    if (heroImg.complete && heroImg.naturalWidth) showHero();
    else {
      heroImg.addEventListener('load', showHero, { once: true });
      heroImg.addEventListener('error', showHero, { once: true });
      setTimeout(showHero, 2500); // never leave the hero empty on a slow connection
    }
  }

  /* ─── Header: transparent over the hero at the very top; opaque and fixed in place once the page scrolls,
     then compact once the hero has gone. It never hides: it stays pinned for the whole page. */
  var header = document.querySelector('[data-header]');
  var announcement = document.querySelector('.announcement');
  var ticking = false;
  var menuOpen = false;

  function updateHeader() {
    var y = window.scrollY;
    var annH = announcement ? announcement.offsetHeight : 0;
    header.style.setProperty('--header-top', Math.max(0, annH - y) + 'px');

    // Transparent over the hero; solid once the hero has scrolled out from under the bar. Pages without a
    // full-bleed hero are always solid. The bar never changes size or width.
    var solid = !hero || y > hero.offsetHeight - header.offsetHeight;
    header.classList.toggle('is-solid', solid);

    ticking = false;
  }
  if (header) {
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });
    updateHeader();
  }

  /* ─── Shop mega menu ──────────────────────────────────── */
  var trigger = document.querySelector('[data-mega-trigger]');
  var mega = document.querySelector('[data-mega]');
  var openTimer, closeTimer;

  function openMega() {
    clearTimeout(closeTimer);
    if (!mega.hidden && mega.classList.contains('is-open')) return;
    mega.hidden = false;
    requestAnimationFrame(function () { mega.classList.add('is-open'); });
    trigger.setAttribute('aria-expanded', 'true');
    header.classList.add('is-menu-open');
    menuOpen = true;
  }
  function closeMega() {
    clearTimeout(openTimer);
    mega.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    header.classList.remove('is-menu-open');
    menuOpen = false;
    setTimeout(function () { if (!mega.classList.contains('is-open')) mega.hidden = true; }, 400);
  }

  if (trigger && mega) {
    var canHover = window.matchMedia('(hover: hover)').matches;
    if (canHover) {
      [trigger, mega].forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          clearTimeout(closeTimer);
          openTimer = setTimeout(openMega, 150);
        });
        el.addEventListener('mouseleave', function () {
          clearTimeout(openTimer);
          closeTimer = setTimeout(closeMega, 300);
        });
      });
    }
    trigger.addEventListener('click', function () {
      if (trigger.getAttribute('aria-expanded') === 'true') closeMega(); else openMega();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') { closeMega(); trigger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (trigger.getAttribute('aria-expanded') === 'true' && !mega.contains(e.target) && e.target !== trigger) closeMega();
    });
    mega.addEventListener('click', function (e) { if (e.target.closest('a')) closeMega(); });
  }

  /* ─── Mega menu preview: follows the hovered or focused link ─────── */
  var preview = document.querySelector('[data-mega-preview]');
  if (preview && mega) {
    var layers = preview.querySelectorAll('[data-preview-layer]');
    var titleEl = preview.querySelector('[data-preview-title-el]'), textEl = preview.querySelector('[data-preview-text-el]');
    var front = 0, currentLink = null, swapTimer;
    var show = function (a) {
      if (a === currentLink) return;
      if (currentLink) currentLink.classList.remove('is-previewed');
      currentLink = a; a.classList.add('is-previewed');
      var src = a.dataset.previewImg;
      preview.href = a.getAttribute('href');
      preview.classList.toggle('is-empty', !src);
      if (src) {
        var next = layers[1 - front];
        next.style.objectPosition = a.dataset.previewPos || '50% 50%';
        var reveal = function () { next.classList.add('is-shown'); layers[front].classList.remove('is-shown'); front = 1 - front; };
        if (next.getAttribute('src') === src) reveal();
        else { next.onload = reveal; next.src = src; }
      } else {
        layers[0].classList.remove('is-shown'); layers[1].classList.remove('is-shown');
      }
      // text: fade out, swap, fade back in
      preview.classList.add('is-swapping'); clearTimeout(swapTimer);
      swapTimer = setTimeout(function () {
        titleEl.textContent = a.dataset.previewTitle; textEl.textContent = a.dataset.previewText;
        preview.classList.remove('is-swapping');
      }, 150);
    };
    Array.prototype.forEach.call(mega.querySelectorAll('[data-preview]'), function (a, i) {
      a.addEventListener('mouseenter', function () { show(a); });
      a.addEventListener('focus', function () { show(a); });
      // the link the panel opens on (it matches the panel's starting link)
      if (a.getAttribute('href') === preview.getAttribute('href') && !currentLink) { currentLink = a; a.classList.add('is-previewed'); }
    });
    // warm the cache so the first swaps are instant
    trigger && trigger.addEventListener('mouseenter', function () {
      Array.prototype.forEach.call(mega.querySelectorAll('[data-preview-img]'), function (a) { if (a.dataset.previewImg) { var im = new Image(); im.src = a.dataset.previewImg; } });
    }, { once: true });
  }

  /* ─── Mobile menu ─────────────────────────────────────── */
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  var menuOpenBtn = document.querySelector('[data-menu-open]');
  var menuCloseBtn = document.querySelector('[data-menu-close]');

  function focusables() {
    return mobileMenu.querySelectorAll('a[href], button:not([disabled])');
  }
  function openMobileMenu() {
    mobileMenu.hidden = false;
    requestAnimationFrame(function () { mobileMenu.classList.add('is-open'); });
    menuOpenBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    setTimeout(function () { menuCloseBtn.focus(); }, 50);
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    menuOpenBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { mobileMenu.hidden = true; }, reduceMotion ? 0 : 400);
    menuOpenBtn.focus();
  }
  if (mobileMenu && menuOpenBtn && menuCloseBtn) {
    menuOpenBtn.addEventListener('click', openMobileMenu);
    menuCloseBtn.addEventListener('click', closeMobileMenu);
    mobileMenu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMobileMenu(); });
    mobileMenu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMobileMenu(); return; }
      if (e.key !== 'Tab') return;
      var items = focusables();
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ─── New arrivals: scroll progress line (tablet/mobile) ─ */
  var row = document.querySelector('[data-product-row]');
  var progress = document.querySelector('[data-row-progress]');
  // Arrow buttons (desktop): move the row by about three cards
  var rowPrev = document.querySelector('[data-row-prev]');
  var rowNext = document.querySelector('[data-row-next]');
  function stepRow(dir) {
    row.scrollBy({ left: dir * row.clientWidth * 0.9, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  if (row && rowPrev && rowNext) {
    rowPrev.addEventListener('click', function () { stepRow(-1); });
    rowNext.addEventListener('click', function () { stepRow(1); });
  }
  function updateProgress() {
    if (!row || !progress) return;
    var max = row.scrollWidth - row.clientWidth;
    var visible = row.clientWidth / row.scrollWidth;
    progress.style.width = (visible * 100) + '%';
    var p = max > 0 ? row.scrollLeft / max : 0;
    progress.style.transform = 'translateX(' + (p * (1 / visible - 1) * 100) + '%)';
    if (rowPrev) rowPrev.disabled = row.scrollLeft <= 2;
    if (rowNext) rowNext.disabled = row.scrollLeft >= max - 2;
  }
  if (row) {
    row.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ─── Campaign: particles run only on screen and travel with the scroll; a cursor scoped to the section ─ */
  var campaign = document.querySelector('[data-campaign]');
  if (campaign) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        campaign.classList.toggle('is-live', entries[0].isIntersecting);
      }).observe(campaign);
    } else {
      campaign.classList.add('is-live');
    }

    // Scroll position → --scroll, from -1 (section entering at the bottom) to 1 (leaving at the top)
    if (!reduceMotion) {
      var sparkTick = false;
      var setSparkScroll = function () {
        sparkTick = false;
        var box = campaign.getBoundingClientRect();
        var vh = window.innerHeight;
        if (box.bottom < 0 || box.top > vh) return;
        var p = (vh / 2 - (box.top + box.height / 2)) / ((vh + box.height) / 2);
        campaign.style.setProperty('--scroll', Math.max(-1, Math.min(1, p)).toFixed(3));
      };
      window.addEventListener('scroll', function () {
        if (!sparkTick) { sparkTick = true; window.requestAnimationFrame(setSparkScroll); }
      }, { passive: true });
      window.addEventListener('resize', setSparkScroll);
      setSparkScroll();
    }

    // Mouse and trackpad only: touch devices keep their normal behaviour and never see the star
    var star = campaign.querySelector('[data-campaign-cursor]');
    var trail = campaign.querySelector('[data-campaign-cursor-trail]');
    if (star && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var pointerX = 0, pointerY = 0, cursorFrame = 0, placed = false;
      // Share of the remaining distance covered per frame: the star keeps up, the sparkle drifts after it
      var marks = [{ el: star, x: 0, y: 0, follow: reduceMotion ? 1 : 0.6 }];
      if (trail) marks.push({ el: trail, x: 0, y: 0, follow: reduceMotion ? 1 : 0.16 });
      var moveCursor = function () {
        var box = campaign.getBoundingClientRect(); // read each frame, so scrolling under a still pointer stays correct
        var x = pointerX - box.left, y = pointerY - box.top;
        marks.forEach(function (m) {
          if (placed) { m.x += (x - m.x) * m.follow; m.y += (y - m.y) * m.follow; }
          else { m.x = x; m.y = y; }
          m.el.style.translate = m.x.toFixed(1) + 'px ' + m.y.toFixed(1) + 'px';
        });
        placed = true;
        cursorFrame = window.requestAnimationFrame(moveCursor);
      };
      var stopCursor = function () {
        campaign.classList.remove('is-pointing');
        window.cancelAnimationFrame(cursorFrame);
        cursorFrame = 0; placed = false;
      };
      campaign.classList.add('has-cursor');
      campaign.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        pointerX = e.clientX; pointerY = e.clientY;
        if (!cursorFrame) { campaign.classList.add('is-pointing'); cursorFrame = window.requestAnimationFrame(moveCursor); }
      });
      campaign.addEventListener('pointerleave', stopCursor);
      window.addEventListener('blur', stopCursor);
    }
  }

  /* ─── Reveal on scroll (once, staggered within a row) ─── */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute('data-reveal'); });
        el.style.transitionDelay = (siblings.indexOf(el) * 80) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ─── Craft films: play only while on screen; pausable ─ */
  var craft = document.querySelector('.craft-film, .craft');
  var craftVideos = document.querySelectorAll('[data-craft-video]');
  var craftToggle = document.querySelector('[data-craft-toggle]');
  var userPaused = reduceMotion; // reduced motion: never autoplay, show the poster still

  function setToggle() {
    if (!craftToggle) return;
    craftToggle.textContent = userPaused ? 'Play' : 'Pause';
    craftToggle.setAttribute('aria-pressed', String(userPaused));
  }
  function tryPlay(v) {
    if (userPaused) return;
    v.preload = 'auto';
    var p = v.play();
    if (p && p.catch) p.catch(function () {}); // missing file or autoplay blocked: poster stays
  }

  if (craftVideos.length) {
    craftVideos.forEach(function (v) {
      // The toggle only appears once real footage is actually playing
      var scope = v.closest('[data-craft-scope]') || craft; // the Craft page wraps its film in data-craft-scope
      v.addEventListener('playing', function () { if (scope) scope.classList.add('has-video'); });
      if (reduceMotion) {
        v.preload = 'metadata';
        v.addEventListener('loadedmetadata', function () { if (scope) scope.classList.add('has-video'); });
      }
    });

    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) tryPlay(entry.target); else entry.target.pause();
        });
      }, { threshold: 0.25 });
      craftVideos.forEach(function (v) { vio.observe(v); });
    } else {
      craftVideos.forEach(tryPlay);
    }

    if (craftToggle) {
      craftToggle.addEventListener('click', function () {
        userPaused = !userPaused;
        craftVideos.forEach(function (v) { if (userPaused) v.pause(); else tryPlay(v); });
        setToggle();
      });
      setToggle();
    }
  }

  /* ─── Newsletter: inline validation + success state ──── */
  var form = document.querySelector('[data-newsletter]');
  if (form) {
    /* Validates on submit only; the message sits in a fixed-height line under the field, so nothing moves.
       States: empty, invalid, already subscribed, sending, subscribed, could not subscribe.
       Submission: if the form has data-endpoint, the email is POSTed there as JSON (409 = already subscribed).
       Without one (this prototype), the address is kept in this browser so a repeat sign-up is recognised.
       In the Shopify build, the theme's customer form replaces both. */
    var input = form.querySelector('input[type="email"]');
    var msg = form.querySelector('.newsletter__msg');
    var button = form.querySelector('button[type="submit"]');
    var label = button.querySelector('.link__label');
    var KEY = 'sn-newsletter';
    // name@domain.tld: no spaces, one @, a domain made of dot-separated labels, a letters-only ending
    var emailPattern = /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
    var MESSAGES = {
      empty: 'Please enter your email address.',
      invalid: 'Please enter a valid email address.',
      duplicate: 'You’re already subscribed.',
      success: 'Thank you for subscribing.',
      failed: 'We couldn’t subscribe you just now. Please try again.',
    };

    var subscribed = function () {
      try { var v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch (err) { return []; }
    };
    var remember = function (email) {
      try { localStorage.setItem(KEY, JSON.stringify(subscribed().concat(email))); } catch (err) { /* private mode */ }
    };

    function show(state) {
      var error = state === 'empty' || state === 'invalid' || state === 'failed';
      form.classList.toggle('is-error', error);
      form.classList.toggle('is-done', state === 'success' || state === 'duplicate');
      if (error) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      msg.textContent = state ? MESSAGES[state] : '';
    }
    function busy(on) {
      form.classList.toggle('is-sending', on);
      button.disabled = on;
      button.setAttribute('aria-busy', String(on));
      label.textContent = on ? 'Subscribing…' : 'Subscribe';
    }

    // Once an error is showing, it clears as soon as the address becomes valid
    input.addEventListener('input', function () {
      if (form.classList.contains('is-error') && emailPattern.test(input.value.trim())) show(null);
      else if (form.classList.contains('is-done')) show(null);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-sending')) return;
      var email = input.value.trim().toLowerCase();
      if (!email) { show('empty'); input.focus(); return; }
      if (!emailPattern.test(email)) { show('invalid'); input.focus(); return; }

      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint && subscribed().indexOf(email) > -1) { show('duplicate'); return; }

      busy(true);
      var request = endpoint
        ? fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email: email }) })
          .then(function (res) { if (res.status === 409) return 'duplicate'; if (!res.ok) throw new Error('HTTP ' + res.status); return 'success'; })
        : new Promise(function (resolve) { setTimeout(function () { resolve('success'); }, 500); }); // prototype stand-in
      request
        .then(function (result) {
          if (result === 'success') { remember(email); input.value = ''; }
          show(result);
        })
        .catch(function () { show('failed'); })
        .then(function () { busy(false); });
    });
  }

  /* ─── Footer: link groups are accordions on mobile only ─ */
  var groups = document.querySelectorAll('[data-footer-group]');
  var desktop = window.matchMedia('(min-width: 768px)');
  function syncGroups() {
    groups.forEach(function (g) { if (desktop.matches) g.setAttribute('open', ''); else g.removeAttribute('open'); });
  }
  groups.forEach(function (g) {
    g.querySelector('summary').addEventListener('click', function (e) { if (desktop.matches) e.preventDefault(); });
  });
  syncGroups();
  if (desktop.addEventListener) desktop.addEventListener('change', syncGroups);

  /* ─── Craft page: hero film ───────────────────────────────────
     The film needs no timing code: its 3-second scenes and cross-fades are inside the one video file, which loops on
     its own. This block only plays or pauses that video. The windows over it hold fixed photographs (no script).
     The film stops when the hero is off screen, the tab is hidden, the page is left (pagehide) or the keyboard-only
     pause button is pressed. Reduced motion: the video stays on its first frame. */
  var reelEl = document.querySelector('[data-reel]');
  if (reelEl) {
    var rVideo = reelEl.querySelector('[data-reel-video]');
    var rToggle = reelEl.querySelector('[data-reel-toggle]');
    var rUserPaused = false, rVisible = true;
    var rRunning = function () { return !reduceMotion && !rUserPaused && rVisible && !document.hidden; };

    var start = function () {
      if (!rRunning()) return;
      reelEl.classList.remove('is-paused');
      if (rVideo) { var p = rVideo.play(); if (p && p.catch) p.catch(function () {}); } // autoplay blocked: poster stays
    };
    var stop = function () {
      if (rVideo) rVideo.pause();
      reelEl.classList.add('is-paused');
    };

    if (rVideo) {
      // if the film can't play at all, the poster frame stays in place (the video shows it)
      rVideo.addEventListener('error', function () { reelEl.classList.add('is-film-failed'); }, true);
      if (reduceMotion) { rVideo.removeAttribute('autoplay'); rVideo.pause(); try { rVideo.currentTime = 0; } catch (e) {} }
    }
    if (rToggle) rToggle.addEventListener('click', function () {
      rUserPaused = !rUserPaused;
      rToggle.setAttribute('aria-pressed', String(rUserPaused));
      rToggle.textContent = rUserPaused ? 'Play the film' : 'Pause the film';
      if (rUserPaused) stop(); else start();
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    window.addEventListener('pagehide', stop);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        rVisible = entries[0].isIntersecting;
        if (rVisible) start(); else stop();
      }, { threshold: 0.15 }).observe(reelEl);
    }
    if (rRunning()) start(); else stop();
  }

  /* ─── Craft page: lookbook pins ─────────────────────────────
     Pins are stored as a place on the photograph (data-x / data-y, % of its full size). The frame crops the photo
     (object-fit: cover: a wide band, a taller frame on phones), so each pin is re-placed in pixels to stay on the same
     spot of the saree, and hidden if that spot is cropped away. A card floats over the photograph beside its pin
     (phones: across the top or bottom), kept inside the frame, so the page never moves.
       mouse     hovering a pin opens its card; it closes a moment after the pointer leaves both the pin and the card
                 (long enough to cross into the card and use its link). A click holds it open; a second click closes it.
       touch     a tap on the pin opens it; a tap on the pin, the close button or anywhere else closes it.
       keyboard  Enter or Space on the pin toggles it; Escape closes it and returns focus to the pin. Tab goes from the
                 pin into its card; moving focus anywhere else closes it. */
  var lb = document.querySelector('[data-lookbook]');
  if (lb) {
    var frame = lb.querySelector('[data-lookbook-frame]');
    var lbImg = lb.querySelector('[data-lookbook-img]');
    var pins = Array.prototype.slice.call(lb.querySelectorAll('[data-lookbook-pin]'));
    var phone = window.matchMedia('(max-width: 767px)');
    var openPin = null, held = false, leaveTimer = 0, enterTimer = 0;
    var focusOf = function () {
      var v = getComputedStyle(lbImg).objectPosition.split(' ');
      return [parseFloat(v[0]) / 100, parseFloat(v[1] || v[0]) / 100];
    };
    var place = function () {
      var W = frame.clientWidth, H = frame.clientHeight;
      var w = Number(lbImg.getAttribute('width')), h = Number(lbImg.getAttribute('height'));
      var k = Math.max(W / w, H / h), f = focusOf();
      var ox = (W - w * k) * f[0], oy = (H - h * k) * f[1];
      pins.forEach(function (pin) {
        var x = ox + Number(pin.getAttribute('data-x')) / 100 * w * k;
        var y = oy + Number(pin.getAttribute('data-y')) / 100 * h * k;
        var inside = x > 16 && x < W - 16 && y > 16 && y < H - 16;
        pin.style.left = x + 'px'; pin.style.top = y + 'px';
        pin.hidden = !inside;
      });
      if (openPin) placeCard(openPin);
    };
    var cardOf = function (pin) { return document.getElementById(pin.getAttribute('aria-controls')); };
    var placeCard = function (pin) {
      var card = cardOf(pin);
      var W = frame.clientWidth, H = frame.clientHeight;
      var x = parseFloat(pin.style.left), y = parseFloat(pin.style.top);
      if (phone.matches) { // phones: CSS lays it across the photograph, at the top when the pin is in the lower half
        card.style.left = ''; card.style.top = '';
        card.classList.toggle('is-top', y > H / 2);
        return;
      }
      card.classList.remove('is-top');
      var gap = 26, pad = 16, reach = 22, cw = card.offsetWidth, ch = card.offsetHeight;
      var others = pins.filter(function (q) { return q !== pin && !q.hidden; })
        .map(function (q) { return [parseFloat(q.style.left), parseFloat(q.style.top)]; });
      var clampTop = function (t) { return Math.max(pad, Math.min(H - ch - pad, t)); };
      var clearOf = function (l, t) { // leaves every other pin's 44px target uncovered
        return others.every(function (o) { return o[0] < l - reach || o[0] > l + cw + reach || o[1] < t - reach || o[1] > t + ch + reach; });
      };
      // Beside the pin, outer side first (away from the middle, so it covers less of the saree): centred on the pin,
      // then rising from it, then falling from it; then the same on the other side. The first spot that fits in the
      // frame and leaves the other pins free to hover wins; failing that, the first spot that fits.
      var outer = x >= W / 2 ? 1 : -1, best = null, first = null;
      [outer, -outer].forEach(function (side) {
        var l = side > 0 ? x + gap : x - gap - cw;
        if (l < pad || l + cw > W - pad) return;
        [y - ch / 2, y - ch + 28, y - 28].forEach(function (t) {
          t = clampTop(t);
          if (!first) first = [l, t];
          if (!best && clearOf(l, t)) best = [l, t];
        });
      });
      var spot = best || first || [Math.max(pad, Math.min(W - cw - pad, outer > 0 ? x + gap : x - gap - cw)), clampTop(y - ch / 2)];
      card.style.left = spot[0] + 'px'; card.style.top = spot[1] + 'px';
      card.style.setProperty('--origin', (x - spot[0]) + 'px ' + (y - spot[1]) + 'px'); // it grows out of the pin
    };
    var cancelLeave = function () { clearTimeout(leaveTimer); leaveTimer = 0; };
    var close = function (returnFocus) {
      cancelLeave(); clearTimeout(enterTimer);
      if (!openPin) return;
      var pin = openPin, card = cardOf(pin);
      openPin = null; held = false;
      pin.setAttribute('aria-expanded', 'false');
      card.classList.remove('is-open');
      setTimeout(function () { if (!card.classList.contains('is-open')) card.hidden = true; }, reduceMotion ? 0 : 240);
      if (returnFocus) pin.focus();
    };
    var open = function (pin) {
      cancelLeave(); clearTimeout(enterTimer);
      if (openPin === pin) return;
      close(false);
      var card = cardOf(pin);
      openPin = pin;
      pin.setAttribute('aria-expanded', 'true');
      card.hidden = false;
      placeCard(pin);
      requestAnimationFrame(function () { if (openPin === pin) card.classList.add('is-open'); });
    };
    // A card opened by hover closes shortly after the pointer leaves its pin and the card; a held one stays.
    var leaveSoon = function () { cancelLeave(); leaveTimer = setTimeout(function () { if (!held) close(false); }, 320); };
    var isMouse = function (e) { return e.pointerType === 'mouse'; };
    pins.forEach(function (pin) {
      var card = cardOf(pin);
      pin.addEventListener('pointerenter', function (e) {
        if (!isMouse(e)) return;
        if (openPin === pin) { cancelLeave(); return; }
        // straight away when nothing is open; a short pause when another card is, so crossing a pin doesn't swap it
        if (!openPin) open(pin);
        else { clearTimeout(enterTimer); enterTimer = setTimeout(function () { open(pin); }, 140); }
      });
      pin.addEventListener('pointerleave', function (e) {
        if (!isMouse(e)) return;
        clearTimeout(enterTimer);
        if (openPin === pin && !held) leaveSoon();
      });
      pin.addEventListener('click', function (e) {
        e.stopPropagation();
        if (openPin !== pin) { open(pin); held = true; } // tap, Enter / Space, or a click on a closed pin
        else if (!held) { held = true; cancelLeave(); }  // already open from hovering: the click keeps it open
        else close(false);
      });
      card.addEventListener('pointerenter', function (e) { if (isMouse(e) && openPin === pin) cancelLeave(); });
      card.addEventListener('pointerleave', function (e) { if (isMouse(e) && openPin === pin && !held) leaveSoon(); });
      card.addEventListener('click', function (e) { e.stopPropagation(); });
    });
    lb.querySelectorAll('[data-lookbook-close]').forEach(function (b) { b.addEventListener('click', function () { close(true); }); });
    document.addEventListener('click', function () { close(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openPin) close(frame.contains(document.activeElement)); });
    frame.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (openPin && to && to !== openPin && !cardOf(openPin).contains(to)) close(false);
    });
    // The close-ups are lazy and their cards hidden, so they would only start loading on the first hover. Load them
    // once the photograph itself has loaded (it is lazy too, so that happens as the section comes near).
    var warm = function () { lb.querySelectorAll('.lookbook__card-img').forEach(function (im) { im.loading = 'eager'; }); };
    var ready = function () { place(); lb.classList.add('is-ready'); };
    if (lbImg.complete) { ready(); warm(); } else lbImg.addEventListener('load', function () { ready(); warm(); }, { once: true });
    window.addEventListener('resize', place);
    if (phone.addEventListener) phone.addEventListener('change', place);
    ready(); // the frame has its size before the photo loads, so the pins can be placed straight away
  }
})();
