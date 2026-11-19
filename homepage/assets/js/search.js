/* Stylissh Naari — header search
   The Search link (desktop) and the magnifier (phone) open a panel under the header. It loads a small index of every
   saree once (/search-index.json, built by render/search.mjs) and shows matching sarees as you type: by name and its
   meaning, colour, fabric, weave, border, motif, craft and edit. Every word typed must match; names rank first, and a
   name one letter off still matches ("keser" finds Kesar). Enter opens the top result; Escape closes.
   Any page with ?search=<words> opens the panel with those words typed. */
(function () {
  var panel = document.querySelector('[data-search]');
  if (!panel) return;
  var overlay = document.querySelector('[data-search-overlay]');
  var input = panel.querySelector('[data-search-input]');
  var form = panel.querySelector('[data-search-form]');
  var list = panel.querySelector('[data-search-results]');
  var status = panel.querySelector('[data-search-status]');
  var suggest = panel.querySelector('[data-search-suggest]');
  var openers = document.querySelectorAll('[data-search-open]');
  var index = null, loading = null, lastOpener = null, timer = 0;
  var MAX = 24;
  var TERMS = ['Red', 'Pink', 'Green', 'Blue', 'Ivory', 'Silk', 'Tissue', 'Kora', 'Zari', 'Buti'];

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9₹]+/g, ' ').trim();
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function price(n) { return n == null ? '' : '₹ ' + Number(n).toLocaleString('en-IN'); }

  // one letter added, dropped or changed
  function near(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  }

  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch('/search-index.json').then(function (r) { return r.json(); }).then(function (d) {
        index = d.products.map(function (p) {
          return { p: p, name: norm(p.n), nameWords: norm(p.n).split(' '), desc: norm(p.d), descWords: norm(p.d).split(' '), keys: norm(p.k), keyWords: norm(p.k).split(' ') };
        });
        index.suggest = d.suggest || [];
        return index;
      }).catch(function () { loading = null; throw new Error('index'); });
    }
    return loading;
  }

  function scoreToken(e, t) {
    var bare = t.length > 3 && t.slice(-1) === 's' ? t.slice(0, -1) : t; // "sarees" → "saree", "reds" → "red"
    function starts(words) { return words.some(function (w) { return w.indexOf(t) === 0 || w.indexOf(bare) === 0; }); }
    if (starts(e.nameWords)) return 10;
    if (e.name.indexOf(t) > -1) return 6;            // inside a name
    if (t.length >= 4 && e.nameWords.some(function (w) { return near(w, t); })) return 5;
    if (e.descWords[0].indexOf(t) === 0) return 5;   // the main colour, first in the descriptor
    if (starts(e.descWords)) return 4;
    if (starts(e.keyWords)) return 2;
    // a one-letter typo in a colour, fabric, craft or edit ("kalamkri", "banarsi", "bandhni") still matches, ranked last
    if (t.length >= 5 && e.descWords.concat(e.keyWords).some(function (w) { return near(w, t); })) return 1;
    return 0;
  }

  function search(q) {
    var tokens = norm(q).split(' ').filter(function (t) { return t && t !== 'saree' && t !== 'sarees' && t !== 'sari'; });
    if (!tokens.length) return null;
    var out = [];
    index.forEach(function (e, order) {
      var total = 0;
      for (var i = 0; i < tokens.length; i++) { var s = scoreToken(e, tokens[i]); if (!s) return; total += s; }
      out.push({ e: e, s: total, o: order });
    });
    out.sort(function (a, b) { return b.s - a.s || a.o - b.o; });
    return out;
  }

  function renderSuggest() {
    var crafts = (index && index.suggest || []).map(function (c) { return '<li><a class="site-search__chip" href="' + esc(c.h) + '">' + esc(c.t) + '</a></li>'; }).join('');
    var terms = TERMS.map(function (t) { return '<li><button class="site-search__chip" type="button" data-search-term="' + esc(t) + '">' + esc(t) + '</button></li>'; }).join('');
    suggest.innerHTML = (crafts ? '<p class="site-search__label">Shop by craft</p><ul class="site-search__chips">' + crafts + '</ul>' : '') +
      '<p class="site-search__label">Try</p><ul class="site-search__chips">' + terms + '</ul>';
  }

  function render() {
    var q = input.value.trim();
    var hits = search(q);
    if (!hits) { list.innerHTML = ''; status.textContent = ''; suggest.hidden = false; return; }
    suggest.hidden = true;
    if (!hits.length) {
      list.innerHTML = '';
      status.innerHTML = 'No sarees match “' + esc(q) + '”. Try a colour, a fabric or a craft, or <a href="/sarees">browse all sarees</a>.';
      return;
    }
    status.textContent = hits.length + (hits.length === 1 ? ' saree' : ' sarees') + ' for “' + q + '”' + (hits.length > MAX ? ', showing the first ' + MAX : '');
    list.innerHTML = hits.slice(0, MAX).map(function (h) {
      var p = h.e.p;
      return '<li><a class="site-search__result" href="/products/' + esc(p.s) + '">' +
        '<span class="site-search__media"><img src="' + esc(p.i) + '" alt="" loading="lazy" decoding="async"' + (p.o ? ' style="object-position:' + esc(p.o) + '"' : '') + '></span>' +
        '<span class="site-search__name">' + esc(p.n) + '</span>' +
        '<span class="site-search__desc">' + esc(p.d) + '</span>' +
        (p.p != null ? '<span class="site-search__price">' + (p.f ? 'From ' : '') + price(p.p) + '</span>' : '') +
        '</a></li>';
    }).join('');
  }

  function open(e) {
    if (e) e.preventDefault();
    lastOpener = e && e.currentTarget;
    panel.hidden = false; overlay.hidden = false;
    document.documentElement.classList.add('is-search-open');
    openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    requestAnimationFrame(function () { panel.classList.add('is-open'); input.focus(); });
    status.textContent = index ? '' : 'Loading…';
    load().then(function () { status.textContent = ''; renderSuggest(); render(); })
      .catch(function () { status.textContent = 'Search could not load. Please try again.'; });
  }
  function close() {
    panel.classList.remove('is-open');
    panel.hidden = true; overlay.hidden = true;
    document.documentElement.classList.remove('is-search-open');
    openers.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (lastOpener) lastOpener.focus();
  }

  openers.forEach(function (b) { b.addEventListener('click', open); });
  // a link can open search with words already typed: any page ?search=red+silk
  var preset = new URLSearchParams(location.search).get('search');
  if (preset) { input.value = preset; open(); }
  panel.querySelector('[data-search-close]').addEventListener('click', close);
  overlay.addEventListener('click', close);
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { if (index) render(); }, 80); });
  suggest.addEventListener('click', function (e) {
    var t = e.target.closest('[data-search-term]');
    if (!t) return;
    input.value = t.getAttribute('data-search-term'); input.focus(); render();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = list.querySelector('a');
    if (first) location.href = first.href;
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { close(); return; }
    // "/" opens search from anywhere but a text field
    if (e.key === '/' && panel.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) open(e);
  });
  // keep Tab inside the panel while it is open
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = panel.querySelectorAll('input, button, a[href]');
    var vis = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
    if (!vis.length) return;
    var first = vis[0], last = vis[vis.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
