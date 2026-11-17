/* Stylish Naari — shopping tools (prototype)
   1. Wishlist: the heart on every product card, the count in the header and the /wishlist page. Saved in localStorage; in the Shopify build this
      becomes the customer's saved list, with the same data-wishlist attribute on the button.
   2. Collection filters and sort: works on the cards already on the page, using their data-* values.
   Quick add needs no code here: its button carries data-add-to-bag, which bag.js already handles. */
(function () {
  'use strict';

  /* ─── 1. Wishlist ─────────────────────────────────────── */
  var KEY = 'sn-wishlist';
  var memory = null;
  function saved() {
    if (memory) return memory;
    try { var v = JSON.parse(localStorage.getItem(KEY)); memory = Array.isArray(v) ? v : []; }
    catch (e) { memory = []; }
    return memory;
  }
  function store(list) {
    memory = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private mode: lasts for the page only */ }
  }
  function paintHearts() {
    var list = saved();
    document.querySelectorAll('[data-wishlist]').forEach(function (btn) {
      var on = list.indexOf(btn.getAttribute('data-wishlist')) > -1;
      var name = btn.getAttribute('data-name') || 'this saree';
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Remove ' + name + ' from your wishlist' : 'Save ' + name + ' to your wishlist');
    });
    document.querySelectorAll('[data-wishlist-count]').forEach(function (el) { el.textContent = list.length ? ' (' + list.length + ')' : ''; }); // "(n)" only once something is saved
    paintWishlistPage(list);
  }

  // The wishlist page carries every saree; only the saved ones are shown, most recently saved first
  function paintWishlistPage(list) {
    var page = document.querySelector('[data-wishlist-grid]');
    if (!page) return;
    Array.prototype.slice.call(page.querySelectorAll('[data-product]'))
      .map(function (card) { return { card: card, at: list.indexOf(card.querySelector('[data-wishlist]').getAttribute('data-wishlist')) }; })
      .sort(function (a, b) { return b.at - a.at; })
      .forEach(function (item) {
        item.card.classList.toggle('is-saved', item.at > -1);
        if (item.at > -1) item.card.classList.add('is-visible'); // no scroll reveal to wait for
        page.appendChild(item.card);
      });
    var empty = document.querySelector('[data-wishlist-empty]');
    var summary = document.querySelector('[data-wishlist-summary]');
    if (empty) empty.hidden = list.length > 0;
    if (summary) summary.textContent = list.length ? list.length + (list.length === 1 ? ' saree saved.' : ' sarees saved.') : 'The sarees you save will be kept here.';
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-wishlist]');
    if (!btn) return;
    var slug = btn.getAttribute('data-wishlist');
    var list = saved().slice();
    var at = list.indexOf(slug);
    if (at > -1) list.splice(at, 1); else list.push(slug);
    store(list);
    paintHearts();
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { memory = null; paintHearts(); } }); // other tabs
  paintHearts();

  /* ─── 2. Collection filters + sort ────────────────────── */
  var filters = document.querySelector('[data-filters]');
  var grid = document.querySelector('[data-filter-grid]');
  if (!filters || !grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-product]'));
  var groups = Array.prototype.slice.call(filters.querySelectorAll('[data-filter]'));
  var sort = filters.querySelector('[data-sort]');
  var result = filters.querySelector('[data-filter-result]');
  var clear = filters.querySelector('[data-filter-clear]');
  var empty = document.querySelector('[data-filter-empty]');

  // What each card offers per filter group. A saree can sit in several edits; the rest are single values.
  var valuesOf = function (card, group) {
    var v = card.getAttribute('data-' + group) || '';
    return v ? v.split(' ') : [];
  };
  var checkedIn = function (group) {
    return Array.prototype.map.call(group.querySelectorAll('input:checked'), function (i) { return i.value; });
  };
  var price = function (card) { var v = card.getAttribute('data-price'); return v === '' || v === null ? null : Number(v); };
  var order = function (card) { return Number(card.getAttribute('data-order')); };
  var sorters = {
    featured: function (a, b) { return order(a) - order(b); },
    // sarees without a price yet go last in both price orders
    'price-asc': function (a, b) { var x = price(a), y = price(b); return (x === null) - (y === null) || x - y || order(a) - order(b); },
    'price-desc': function (a, b) { var x = price(a), y = price(b); return (x === null) - (y === null) || y - x || order(a) - order(b); },
    newest: function (a, b) { return (b.hasAttribute('data-new') - a.hasAttribute('data-new')) || order(a) - order(b); },
  };

  function apply(updateUrl) {
    var active = groups.map(function (g) { return { key: g.getAttribute('data-filter'), el: g, values: checkedIn(g) }; });
    var shown = 0;
    cards.forEach(function (card) {
      // within a group any ticked value matches; across groups all must
      var ok = active.every(function (g) {
        if (!g.values.length) return true;
        var has = valuesOf(card, g.key);
        return g.values.some(function (v) { return has.indexOf(v) > -1; });
      });
      card.hidden = !ok;
      if (ok) { shown += 1; card.classList.add('is-visible'); } // a card revealed by a filter shouldn't wait for the scroll reveal
    });

    var mode = sort && sorters[sort.value] ? sort.value : 'featured';
    cards.slice().sort(sorters[mode]).forEach(function (card) { grid.appendChild(card); });

    var filtered = active.some(function (g) { return g.values.length; });
    grid.classList.toggle('is-arranged', filtered || mode !== 'featured');
    active.forEach(function (g) {
      var badge = g.el.querySelector('[data-filter-count]');
      if (badge) { badge.textContent = g.values.length ? '(' + g.values.length + ')' : ''; badge.hidden = !g.values.length; }
    });
    if (result) result.textContent = shown + (shown === 1 ? ' saree' : ' sarees') + (filtered ? ' of ' + cards.length : '');
    if (clear) clear.hidden = !filtered;
    if (empty) empty.hidden = shown > 0;

    if (updateUrl && window.history && history.replaceState) {
      var q = new URLSearchParams();
      active.forEach(function (g) { if (g.values.length) q.set(g.key, g.values.join(',')); });
      if (mode !== 'featured') q.set('sort', mode);
      var s = q.toString();
      history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash);
    }
  }

  // Start from the address bar, so a filtered view can be shared or refreshed
  var params = new URLSearchParams(location.search);
  groups.forEach(function (g) {
    var wanted = (params.get(g.getAttribute('data-filter')) || '').split(',');
    g.querySelectorAll('input').forEach(function (i) { i.checked = wanted.indexOf(i.value) > -1; });
  });
  if (sort && sorters[params.get('sort')]) sort.value = params.get('sort');

  filters.addEventListener('change', function () { apply(true); });
  var reset = function () {
    filters.querySelectorAll('input:checked').forEach(function (i) { i.checked = false; });
    apply(true);
  };
  if (clear) clear.addEventListener('click', reset);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-filter-reset]')) reset();
    // one panel open at a time; a click anywhere else closes it
    groups.forEach(function (g) { if (g.open && !g.contains(e.target)) g.open = false; });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    groups.forEach(function (g) { if (g.open) { g.open = false; g.querySelector('summary').focus(); } });
  });

  apply(false);
})();
