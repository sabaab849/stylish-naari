/* Stylish Naari — bag (prototype)
   Stores line items in localStorage so the count survives page changes. In the Shopify build this is
   replaced by the Cart AJAX API (/cart/add.js, /cart.js); the markup and data-attributes stay the same. */
(function () {
  'use strict';

  var KEY = 'sn-bag';
  var catalogue = null; // products.json, loaded on demand

  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* private mode: bag lasts for the page only */ }
    memory = items;
  }
  var memory = read();
  function items() { var v = read(); return v.length || !memory.length ? v : memory; }
  function count() { return items().reduce(function (n, i) { return n + i.qty; }, 0); }

  function formatPrice(n) { return '₹ ' + Number(n).toLocaleString('en-IN'); }

  function loadCatalogue() {
    if (catalogue) return Promise.resolve(catalogue);
    return fetch('/assets/data/products.json').then(function (r) { return r.json(); }).then(function (d) {
      catalogue = d.products; return catalogue;
    });
  }
  function find(slug) { return (catalogue || []).filter(function (p) { return p.slug === slug; })[0]; }

  /* ─── Count everywhere ─────────────────────────────── */
  function renderCount() {
    var n = count();
    document.querySelectorAll('[data-bag-count]').forEach(function (el) { el.textContent = n; });
    document.querySelectorAll('[data-bag-badge]').forEach(function (el) { el.hidden = n === 0; });
    document.querySelectorAll('.bag-icon').forEach(function (el) { el.setAttribute('aria-label', 'Bag, ' + n + (n === 1 ? ' item' : ' items')); });
  }

  /* ─── Drawer ───────────────────────────────────────── */
  var drawer = document.querySelector('[data-bag-drawer]');
  var overlay = document.querySelector('[data-bag-overlay]');
  var list = document.querySelector('[data-bag-items]');
  var foot = document.querySelector('[data-bag-foot]');
  var subtotal = document.querySelector('[data-bag-subtotal]');
  var lastFocus = null;

  function renderDrawer() {
    if (!list) return;
    var lines = items();
    if (!lines.length) {
      list.innerHTML = '<p class="bag-drawer__empty">Your bag is empty.</p>' +
        '<a class="link" href="/#new-arrivals"><span class="link__label">Start with the new arrivals</span><span class="link__arrow" aria-hidden="true">→</span></a>';
      foot.hidden = true;
      return;
    }
    var total = 0;
    list.innerHTML = '<ul class="bag-lines">' + lines.map(function (line) {
      var p = find(line.slug);
      if (!p) return '';
      total += (p.price || 0) * line.qty;
      var img = p.images[0];
      return '<li class="bag-line">' +
        '<a class="bag-line__media" href="/products/' + p.slug + '"><img src="' + img.src + '" alt="" width="' + img.width + '" height="' + img.height + '"></a>' +
        '<div class="bag-line__info">' +
          '<a class="bag-line__name" href="/products/' + p.slug + '">' + p.name + '</a>' +
          '<p class="bag-line__descriptor">' + p.descriptor + '</p>' +
          '<div class="bag-line__qty">' +
            '<button type="button" class="bag-line__step" data-bag-step="-1" data-slug="' + p.slug + '" aria-label="Decrease quantity of ' + p.name + '">−</button>' +
            '<span aria-live="polite">' + line.qty + '</span>' +
            '<button type="button" class="bag-line__step" data-bag-step="1" data-slug="' + p.slug + '" aria-label="Increase quantity of ' + p.name + '">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="bag-line__end">' +
          '<p class="bag-line__price">' + formatPrice(p.price * line.qty) + '</p>' +
          '<button type="button" class="bag-line__remove" data-bag-remove="' + p.slug + '">Remove</button>' +
        '</div>' +
      '</li>';
    }).join('') + '</ul>';
    subtotal.textContent = formatPrice(total);
    foot.hidden = false;
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    loadCatalogue().then(renderDrawer).catch(function () { list.innerHTML = '<p class="bag-drawer__empty">Your bag couldn’t load. Refresh the page and try again.</p>'; });
    drawer.hidden = false; overlay.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add('is-open'); overlay.classList.add('is-open'); });
    document.body.classList.add('no-scroll');
    setTimeout(function () { var c = drawer.querySelector('[data-bag-close]'); if (c) c.focus(); }, 60);
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open'); overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { drawer.hidden = true; overlay.hidden = true; }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ─── Mutations ────────────────────────────────────── */
  function add(slug, qty) {
    var lines = items();
    var line = lines.filter(function (l) { return l.slug === slug; })[0];
    if (line) line.qty += qty || 1; else lines.push({ slug: slug, qty: qty || 1 });
    write(lines); renderCount();
  }
  function step(slug, delta) {
    var lines = items().map(function (l) { if (l.slug === slug) l.qty += delta; return l; }).filter(function (l) { return l.qty > 0; });
    write(lines); renderCount(); renderDrawer();
  }
  function remove(slug) {
    write(items().filter(function (l) { return l.slug !== slug; })); renderCount(); renderDrawer();
  }

  /* ─── Events ───────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var opener = t.closest('[data-bag-open]');
    if (opener) { e.preventDefault(); openDrawer(); return; }
    if (t.closest('[data-bag-close]') || t.closest('[data-bag-overlay]')) { closeDrawer(); return; }

    var adder = t.closest('[data-add-to-bag]');
    if (adder && !adder.disabled) {
      var slug = adder.getAttribute('data-add-to-bag');
      add(slug, 1); // optimistic: the count changes immediately
      var label = adder.getAttribute('data-add-label') || adder.textContent;
      adder.textContent = 'Added';
      adder.classList.add('is-added');
      setTimeout(function () { adder.textContent = label; adder.classList.remove('is-added'); }, 2000);
      setTimeout(openDrawer, 250);
      return;
    }
    var stepper = t.closest('[data-bag-step]');
    if (stepper) { step(stepper.getAttribute('data-slug'), Number(stepper.getAttribute('data-bag-step'))); return; }
    var remover = t.closest('[data-bag-remove]');
    if (remover) { remove(remover.getAttribute('data-bag-remove')); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab' && drawer && !drawer.hidden) {
      var f = drawer.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) renderCount(); }); // other tabs

  renderCount();
  window.SNBag = { add: add, count: count, open: openDrawer, close: closeDrawer };
})();
