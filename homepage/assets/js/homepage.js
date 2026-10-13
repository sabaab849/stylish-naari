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

  /* ─── Header: transparent over hero → solid; hide on scroll down ─ */
  var header = document.querySelector('[data-header]');
  var announcement = document.querySelector('.announcement');
  var lastY = window.scrollY;
  var ticking = false;
  var menuOpen = false;

  function updateHeader() {
    var y = window.scrollY;
    var annH = announcement ? announcement.offsetHeight : 0;
    header.style.setProperty('--header-top', Math.max(0, annH - y) + 'px');

    var solidAt = hero ? hero.offsetHeight * 0.8 : 0;
    var solid = !hero || y > solidAt; // pages without a full-bleed hero start solid
    header.classList.toggle('is-solid', solid);

    var goingDown = y > lastY + 2;
    var goingUp = y < lastY - 2;
    if (solid && goingDown && !menuOpen) header.classList.add('is-hidden');
    if (goingUp || !solid) header.classList.remove('is-hidden');

    lastY = y;
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
      v.addEventListener('playing', function () { craft.classList.add('has-video'); });
      if (reduceMotion) {
        v.preload = 'metadata';
        v.addEventListener('loadedmetadata', function () { craft.classList.add('has-video'); });
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
    var input = form.querySelector('input[type="email"]');
    var msg = form.querySelector('.newsletter__msg');
    var submit = form.querySelector('button[type="submit"] .link__label');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    input.addEventListener('input', function () {
      if (form.classList.contains('is-error') && emailPattern.test(input.value.trim())) {
        form.classList.remove('is-error');
        input.removeAttribute('aria-invalid');
        msg.textContent = '';
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = input.value.trim();
      if (!emailPattern.test(value)) {
        form.classList.add('is-error');
        input.setAttribute('aria-invalid', 'true');
        msg.textContent = value ? "That email doesn't look right. Check it and try again." : 'Add your email address to subscribe.';
        input.focus();
        return;
      }
      // Prototype only: Shopify's customer form posts here in the theme build.
      submit.textContent = 'Subscribing…';
      setTimeout(function () {
        var done = document.createElement('p');
        done.className = 'newsletter__success';
        done.setAttribute('role', 'status');
        done.textContent = 'Thank you — you’re on the list.';
        form.replaceWith(done);
      }, 500);
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
})();
