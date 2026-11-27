/* Hotel demo core: accessibility panel, menu, header, date picker, booking bar,
   booking flow, gallery, forms. No dependencies. Reads window.SITE (rooms, i18n). */
(function () {
  'use strict';
  var d = document, html = d.documentElement, S = window.SITE || { t: {}, rooms: [] };
  var T = function (k) { return (S.t && S.t[k]) || k; };
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var IC = {
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
  };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var LOCALE = /^es/.test(html.lang) ? 'es-ES' : 'en-GB';

  /* ---------- dates (local YYYY-MM-DD strings, no timezone surprises) ---------- */
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var iso = function (dt) { return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate()); };
  var parse = function (s) { if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null; var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var addDays = function (s, n) { var x = parse(s); x.setDate(x.getDate() + n); return iso(x); };
  var nights = function (a, b) { return Math.round((parse(b) - parse(a)) / 864e5); };
  var fmt = function (s, o) { var x = parse(s); return x ? x.toLocaleDateString(LOCALE, o || { weekday: 'short', day: 'numeric', month: 'short' }) : ''; };
  var today = iso(new Date());
  var money = function (n) { return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n); };

  /* Demo availability: a few fixed "fully booked" nights per room, derived from the date so it is stable. */
  function bookedFor(roomId, s) {
    var x = parse(s), seed = (x.getDate() * 7 + (x.getMonth() + 1) * 13 + roomId.length * 5) % 23;
    return seed === 3 || seed === 11;
  }
  function anyFree(s) { return S.rooms.some(function (r) { return !bookedFor(r.id, s); }); }
  function rangeFree(roomId, a, b) { for (var s = a; s < b; s = addDays(s, 1)) if (bookedFor(roomId, s)) return false; return true; }

  /* ---------- accessibility panel ---------- */
  var A11Y_DEFAULT = { text: 0, contrast: false, motion: false, links: false, spacing: false, font: false };
  var a11y = Object.assign({}, A11Y_DEFAULT, store.get('a11y') || {});
  function applyA11y() {
    html.setAttribute('data-text', a11y.text);
    html.classList.toggle('a-contrast', a11y.contrast);
    html.classList.toggle('a-motion', a11y.motion || matchMedia('(prefers-reduced-motion: reduce)').matches);
    html.classList.toggle('a-links', a11y.links);
    html.classList.toggle('a-spacing', a11y.spacing);
    html.classList.toggle('a-font', a11y.font);
    $$('[data-a11y-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', !!a11y[b.dataset.a11yToggle]); });
    $$('[data-a11y-text]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.a11yText === a11y.text)); });
    var lab = $('[data-a11y-size]'); if (lab) lab.textContent = [100, 115, 130, 150][a11y.text] + '%';
    store.set('a11y', a11y);
    d.dispatchEvent(new CustomEvent('a11y:change', { detail: a11y }));
  }
  applyA11y();
  var panel = $('#a11y-panel'), opener = $('[data-a11y-open]');
  function openPanel(o) {
    if (!panel) return;
    panel.hidden = !o; if (opener) opener.setAttribute('aria-expanded', String(o));
    if (o) { var f = $('button', panel); f && f.focus(); } else if (opener) opener.focus();
  }
  if (panel) {
    $$('[data-a11y-open]').forEach(function (b) { b.addEventListener('click', function () { openPanel(panel.hidden); }); });
    $$('[data-a11y-close]').forEach(function (b) { b.addEventListener('click', function () { openPanel(false); }); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') openPanel(false); });
    $$('[data-a11y-text]').forEach(function (b) { b.addEventListener('click', function () { a11y.text = +b.dataset.a11yText; applyA11y(); }); });
    $$('[data-a11y-step]').forEach(function (b) { b.addEventListener('click', function () { a11y.text = Math.max(0, Math.min(3, a11y.text + +b.dataset.a11yStep)); applyA11y(); }); });
    $$('[data-a11y-toggle]').forEach(function (b) { b.addEventListener('click', function () { var k = b.dataset.a11yToggle; a11y[k] = !a11y[k]; applyA11y(); }); });
    $$('[data-a11y-reset]').forEach(function (b) { b.addEventListener('click', function () { a11y = Object.assign({}, A11Y_DEFAULT); applyA11y(); }); });
  }

  /* ---------- header: solid after scroll, hide on scroll down ---------- */
  var header = $('.site-header'), lastY = 0;
  if (header) {
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-solid', y > 40);
      header.classList.toggle('is-hidden', y > 300 && y > lastY && !d.body.classList.contains('menu-open'));
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  /* mobile menu */
  var mbtn = $('[data-menu]'), menu = $('#menu');
  if (mbtn && menu) {
    mbtn.addEventListener('click', function () {
      var o = mbtn.getAttribute('aria-expanded') !== 'true';
      mbtn.setAttribute('aria-expanded', String(o)); d.body.classList.toggle('menu-open', o);
      if (o) { var l = $('a', menu); l && l.focus(); }
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.body.classList.contains('menu-open')) { mbtn.click(); mbtn.focus(); } });
  }

  /* ---------- date picker (dialog with two months, roving focus grid) ---------- */
  function DatePicker() {
    var el = d.createElement('div');
    el.className = 'dp'; el.hidden = true; el.setAttribute('data-lenis-prevent', '');
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', T('dp.title'));
    el.innerHTML = '<div class="dp-sheet"><div class="dp-head"><button type="button" class="dp-nav" data-dp-prev aria-label="' + T('dp.prev') + '">' + IC.chevL + '</button>' +
      '<p class="dp-hint" aria-live="polite"></p><button type="button" class="dp-nav" data-dp-next aria-label="' + T('dp.next') + '">' + IC.chevR + '</button>' +
      '<button type="button" class="dp-close" data-dp-close aria-label="' + T('close') + '">' + IC.close + '</button></div>' +
      '<div class="dp-months"></div><p class="dp-legend"><span><s>23</s> ' + T('dp.booked') + '</span><span><i></i> ' + T('dp.stay') + '</span></p>' +
      '<div class="dp-foot"><p class="dp-sum"></p><div class="dp-act"><button type="button" class="btn btn-ghost" data-dp-clear>' + T('dp.clear') + '</button>' +
      '<button type="button" class="btn btn-primary" data-dp-apply>' + T('dp.apply') + '</button></div></div></div>';
    d.body.appendChild(el);
    var st = { a: null, b: null, view: null, cb: null, back: null, focus: null };
    var hint = $('.dp-hint', el), months = $('.dp-months', el), sum = $('.dp-sum', el);
    function render() {
      var v = parse(st.view), out = '';
      for (var m = 0; m < 2; m++) {
        var first = new Date(v.getFullYear(), v.getMonth() + m, 1), dim = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
        var lead = (first.getDay() + 6) % 7;
        out += '<div class="dp-month"><h3>' + first.toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' }) + '</h3><div class="dp-grid" role="grid">';
        out += '<div class="dp-row dp-wd" role="row">' + [1, 2, 3, 4, 5, 6, 0].map(function (w) {
          var x = new Date(2024, 0, w === 0 ? 7 : w); return '<span role="columnheader" aria-label="' + x.toLocaleDateString(LOCALE, { weekday: 'long' }) + '">' + x.toLocaleDateString(LOCALE, { weekday: 'short' }).slice(0, 2) + '</span>';
        }).join('') + '</div><div class="dp-row" role="row">';
        for (var i = 0; i < lead; i++) out += '<span role="gridcell"></span>';
        for (var day = 1; day <= dim; day++) {
          var s = iso(new Date(first.getFullYear(), first.getMonth(), day)), past = s < today, full = !anyFree(s);
          var off = past || (st.a && !st.b ? !(canEnd(s) || !full) : full);
          var cls = s === st.a ? ' is-start' : s === st.b ? ' is-end' : (st.a && st.b && s > st.a && s < st.b) ? ' is-in' : '';
          if ((lead + day - 1) % 7 === 0 && day > 1) out += '</div><div class="dp-row" role="row">';
          out += '<span role="gridcell"><button type="button" class="dp-day' + cls + (full ? ' is-full' : '') + '" data-date="' + s + '" tabindex="-1"' +
            (off ? ' disabled aria-disabled="true"' : '') + ' aria-pressed="' + (s === st.a || s === st.b) + '" aria-label="' + fmt(s, { weekday: 'long', day: 'numeric', month: 'long' }) + (full ? ', ' + T('dp.booked') : '') + '">' + day + '</button></span>';
        }
        out += '</div></div></div>';
      }
      months.innerHTML = out;
      hint.textContent = !st.a || st.b ? T('dp.pickIn') : T('dp.pickOut');
      sum.innerHTML = st.a && st.b ? '<b>' + nights(st.a, st.b) + ' ' + T(nights(st.a, st.b) === 1 ? 'night' : 'nights') + '</b> ' + fmt(st.a) + ' – ' + fmt(st.b) : T('dp.none');
      $('[data-dp-apply]', el).disabled = !(st.a && st.b);
      var target = st.focus && $('[data-date="' + st.focus + '"]:not([disabled])', el) || $('.dp-day.is-start', el) || $('.dp-day:not([disabled])', el);
      if (target) { target.tabIndex = 0; if (st.focus) target.focus(); }
    }
    /* a departure day may itself be fully booked (you leave that morning), but every night before it must be free */
    function canEnd(s) { if (!st.a || s <= st.a) return false; for (var x = st.a; x < s; x = addDays(x, 1)) if (!anyFree(x)) return false; return true; }
    function pick(s) {
      if (!st.a || st.b || s <= st.a || !canEnd(s)) { st.a = s; st.b = null; }
      else { st.b = s; }
      st.focus = s; render();
    }
    months.addEventListener('click', function (e) { var b = e.target.closest('.dp-day'); if (b && !b.disabled) pick(b.dataset.date); });
    months.addEventListener('keydown', function (e) {
      var b = e.target.closest('.dp-day'); if (!b) return;
      var mv = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (!mv) return;
      e.preventDefault(); var n = addDays(b.dataset.date, mv); st.focus = n;
      var lastShown = addDays(iso(new Date(parse(st.view).getFullYear(), parse(st.view).getMonth() + 2, 1)), -1);
      if (n < st.view) shift(-1); else if (n > lastShown) shift(1); else { var t = $('[data-date="' + n + '"]', el); if (t) { $$('.dp-day', el).forEach(function (x) { x.tabIndex = -1; }); t.tabIndex = 0; t.focus(); } }
    });
    function shift(n) { var v = parse(st.view); st.view = iso(new Date(v.getFullYear(), v.getMonth() + n, 1)); render(); }
    $('[data-dp-prev]', el).addEventListener('click', function () { shift(-1); });
    $('[data-dp-next]', el).addEventListener('click', function () { shift(1); });
    $('[data-dp-clear]', el).addEventListener('click', function () { st.a = st.b = null; render(); });
    $('[data-dp-apply]', el).addEventListener('click', function () { st.cb && st.cb(st.a, st.b); close(); });
    $$('[data-dp-close]', el).forEach(function (b) { b.addEventListener('click', close); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    function close() { el.hidden = true; d.body.classList.remove('dp-open'); st.back && st.back.focus(); }
    return {
      open: function (a, b, cb, back) {
        st.a = a; st.b = b; st.cb = cb; st.back = back; st.focus = null;
        var base = parse(a || today); st.view = iso(new Date(base.getFullYear(), base.getMonth(), 1));
        el.hidden = false; d.body.classList.add('dp-open'); render();
        var f = $('.dp-day.is-start', el) || $('.dp-day:not([disabled])', el); f && f.focus();
      }
    };
  }
  var dp = null; var getDP = function () { return dp || (dp = DatePicker()); };

  /* default stay: next Thursday for three nights */
  function defaultStay() { var x = new Date(); x.setDate(x.getDate() + 14); while (x.getDay() !== 4) x.setDate(x.getDate() + 1); var a = iso(x); return [a, addDays(a, 3)]; }
  var saved = store.get('stay');
  var stay = saved && saved.in >= today ? saved : { in: defaultStay()[0], out: defaultStay()[1], guests: 2 };

  /* ---------- booking bars (home, room pages, mobile sticky) ---------- */
  function paintBar(f) {
    var i = $('[data-field="in"] b', f), o = $('[data-field="out"] b', f), g = $('select[name=guests]', f);
    if (i) i.textContent = fmt(stay.in); if (o) o.textContent = fmt(stay.out); if (g) g.value = String(stay.guests);
    $$('[data-nights]', f).forEach(function (n) { n.textContent = nights(stay.in, stay.out) + ' ' + T('nights'); });
    var rp = f.dataset.price; if (rp) { var n = nights(stay.in, stay.out); $$('[data-total]', f).forEach(function (t) { t.textContent = money(rp * n); }); $$('[data-calc]', f).forEach(function (t) { t.textContent = money(rp) + ' × ' + n + ' ' + T('nights'); }); }
  }
  /* live price comparison (home page): booking sites vs booking direct, for the chosen dates */
  function paintCompare() {
    $$('[data-compare]').forEach(function (c) {
      var r = S.rooms[0], N = nights(stay.in, stay.out), g = stay.guests || 2;
      var ota = Math.round(r.price * N * (S.ota || 1.11)), bf = (S.breakfastOta || 12) * g * N, us = r.price * N;
      var set = function (k, v) { $$('[data-c-' + k + ']', c).forEach(function (e) { e.textContent = v; }); };
      set('stay', fmt(stay.in) + ' – ' + fmt(stay.out) + ' · ' + N + ' ' + T('nights') + ' · ' + g + ' ' + T(g === 1 ? 'guest' : 'guests'));
      set('ota', money(ota)); set('bf', '+ ' + money(bf)); set('us', money(us)); set('save', money(ota + bf - us));
    });
  }
  document.addEventListener('stay:change', paintCompare);
  $$('form[data-booking]').forEach(function (f) {
    paintBar(f);
    $$('[data-field]', f).forEach(function (btn) {
      btn.addEventListener('click', function () {
        getDP().open(stay.in, stay.out, function (a, b) { stay.in = a; stay.out = b; store.set('stay', stay); $$('form[data-booking]').forEach(paintBar); paintCompare(); }, btn);
      });
    });
    var g = $('select[name=guests]', f); if (g) g.addEventListener('change', function () { stay.guests = +g.value; store.set('stay', stay); paintCompare(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault(); store.set('stay', stay);
      var u = new URL(f.action, location.href); u.searchParams.set('in', stay.in); u.searchParams.set('out', stay.out); u.searchParams.set('guests', stay.guests);
      if (f.dataset.room) u.searchParams.set('room', f.dataset.room);
      location.href = u.pathname + u.search;
    });
  });
  paintCompare();
  /* sticky mobile bar shows once the main booking bar has scrolled away */
  var sticky = $('.sticky-book'), watch = $('[data-sticky-watch]');
  if (sticky && 'IntersectionObserver' in window) {
    if (watch) new IntersectionObserver(function (es) { sticky.classList.toggle('is-on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe(watch);
    else sticky.classList.add('is-on');
  }

  /* ---------- booking flow (book page) ---------- */
  var flow = $('[data-flow]');
  if (flow) (function () {
    var q = new URLSearchParams(location.search);
    var st = {
      in: q.get('in') && q.get('in') >= today ? q.get('in') : stay.in,
      out: q.get('out') && q.get('out') > (q.get('in') || '') ? q.get('out') : stay.out,
      guests: +(q.get('guests') || stay.guests) || 2, room: q.get('room') || null, extras: {}
    };
    var steps = $$('[data-step]', flow), live = $('[data-flow-live]');
    var OTA = S.ota || 1.11, BREAKFAST = S.breakfastOta || 12;
    function room() { return S.rooms.filter(function (r) { return r.id === st.room; })[0]; }
    function n() { return nights(st.in, st.out); }
    function extrasTotal() { return (S.extras || []).reduce(function (t, x) { return t + (st.extras[x.id] ? x.price : 0); }, 0); }
    function total() { var r = room(); return r ? r.price * n() + extrasTotal() : 0; }
    function otaTotal() { var r = room(); return r ? Math.round(r.price * n() * OTA + BREAKFAST * st.guests * n()) : 0; }
    function go(k, push) {
      steps.forEach(function (s) { s.hidden = s.dataset.step !== String(k); });
      $$('[data-progress] li').forEach(function (li, i) { li.classList.toggle('is-done', i + 1 < k); li.classList.toggle('is-on', i + 1 === k); if (i + 1 === k) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      var h = $('[data-step="' + k + '"] h1, [data-step="' + k + '"] h2', flow); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
      window.scrollTo({ top: 0, behavior: html.classList.contains('a-motion') ? 'auto' : 'smooth' });
      if (push !== false) history.pushState({ step: k }, '', '#step-' + k);
      summary();
    }
    window.addEventListener('popstate', function () { var m = /step-(\d)/.exec(location.hash); go(m ? +m[1] : 1, false); });
    function summary() {
      var r = room();
      $$('[data-s="dates"]').forEach(function (e) { e.textContent = fmt(st.in) + ' – ' + fmt(st.out); });
      $$('[data-s="nights"]').forEach(function (e) { e.textContent = n(); });
      $$('[data-s="guests"]').forEach(function (e) { e.textContent = st.guests + ' ' + T(st.guests === 1 ? 'guest' : 'guests'); });
      $$('[data-s="room"]').forEach(function (e) { e.textContent = r ? r.name : T('flow.chooseRoom'); });
      $$('[data-s="line"]').forEach(function (e) { e.textContent = r ? money(r.price) + ' × ' + n() + ' ' + T('nights') : '—'; });
      $$('[data-s="roomTotal"]').forEach(function (e) { e.textContent = r ? money(r.price * n()) : '—'; });
      $$('[data-s="extras"]').forEach(function (e) { var x = extrasTotal(); e.parentElement.hidden = !x; e.textContent = money(x); });
      $$('[data-s="total"]').forEach(function (e) { e.textContent = r ? money(total()) : '—'; });
      $$('[data-s="save"]').forEach(function (e) { e.parentElement.hidden = !r; if (r) e.textContent = money(Math.max(0, otaTotal() - r.price * n())); });
      $$('[data-s="img"]').forEach(function (e) { if (r) { e.src = r.img; e.alt = r.alt; } e.hidden = !r; });
      $$('[data-need-room]').forEach(function (b) { b.disabled = !r; });
    }
    /* step 1: rooms list */
    function rooms() {
      var list = $('[data-rooms]', flow), N = n(), out = '';
      S.rooms.forEach(function (r) {
        var free = rangeFree(r.id, st.in, st.out) && st.guests <= r.max, sel = st.room === r.id;
        out += '<li class="fr' + (sel ? ' is-sel' : '') + (free ? '' : ' is-off') + '"><img src="' + r.thumb + '" alt="' + r.alt + '" width="320" height="240" loading="lazy">' +
          '<div class="fr-b"><div class="fr-top"><h3>' + r.name + '</h3>' + (r.tag && free ? '<span class="tag-soft">' + r.tag + '</span>' : '') + '</div><p class="fr-meta">' + r.meta + '</p>' +
          '<p class="fr-inc">' + T('flow.included').split(' · ').map(function (x) { return '<span>' + IC.check + x + '</span>'; }).join('') + '</p><div class="fr-price"><div>' + (free ? '<s>' + T('flow.ota') + ' ' + money(Math.round(r.price * N * OTA)) + '</s><b>' + money(r.price * N) + ' ' + T('flow.forNights').replace('{n}', N) + '</b><small>' + money(r.price) + ' / ' + T('night') + '</small>' : '<b>' + (st.guests > r.max ? T('flow.tooMany') : T('flow.notFree')) + '</b>') + '</div>' +
          (free ? '<button type="button" class="btn ' + (sel ? 'btn-dark' : 'btn-ghost') + '" data-pick="' + r.id + '" aria-pressed="' + sel + '">' + (sel ? IC.check + T('flow.selected') : T('flow.select')) + '<span class="sr"> ' + r.name + '</span></button>' : '') + '</div></div></li>';
      });
      list.innerHTML = out;
      $('[data-flow-dates]', flow).textContent = fmt(st.in) + ' – ' + fmt(st.out) + ' · ' + N + ' ' + T('nights') + ' · ' + st.guests + ' ' + T(st.guests === 1 ? 'guest' : 'guests');
      summary();
    }
    flow.addEventListener('click', function (e) {
      var p = e.target.closest('[data-pick]'); if (p) { st.room = p.dataset.pick; rooms(); live.textContent = room().name + ' — ' + T('flow.selected'); var c = $('[data-pick="' + st.room + '"]'); c && c.focus(); }
      var ch = e.target.closest('[data-change-dates]'); if (ch) getDP().open(st.in, st.out, function (a, b) { st.in = a; st.out = b; stay.in = a; stay.out = b; store.set('stay', stay); if (st.room && !rangeFree(st.room, a, b)) st.room = null; rooms(); }, ch);
      var nx = e.target.closest('[data-next]'); if (nx) go(+nx.dataset.next);
      var bk = e.target.closest('[data-back]'); if (bk) history.back();
    });
    var gs = $('[data-flow-guests]', flow); if (gs) { gs.value = st.guests; gs.addEventListener('change', function () { st.guests = +gs.value; if (room() && st.guests > room().max) st.room = null; rooms(); }); }
    $$('[data-extra]', flow).forEach(function (c) { c.addEventListener('change', function () { st.extras[c.dataset.extra] = c.checked; summary(); }); });
    /* step 2: details with inline validation */
    var form = $('[data-details]', flow);
    function check(inp) {
      var ok = inp.checkValidity(), msg = $('#' + inp.id + '-err');
      inp.setAttribute('aria-invalid', String(!ok));
      if (msg) msg.textContent = ok ? '' : (inp.validity.valueMissing ? T('err.required') : inp.type === 'email' ? T('err.email') : inp.type === 'tel' ? T('err.phone') : T('err.required'));
      return ok;
    }
    if (form) {
      $$('input,select,textarea', form).forEach(function (i) { i.addEventListener('blur', function () { if (i.value || i.getAttribute('aria-invalid')) check(i); }); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = $$('input[required],select[required]', form).filter(function (i) { return !check(i); });
        if (bad.length) { live.textContent = T('err.summary').replace('{n}', bad.length); bad[0].focus(); return; }
        var code = S.code + '-' + String(Math.floor(10000 + Math.random() * 89999));
        var name = $('[name=first]', form).value.trim();
        $('[data-ok-name]').textContent = name; $('[data-ok-code]').textContent = code; $('[data-ok-email]').textContent = $('[name=email]', form).value.trim();
        var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//' + S.name + '//Demo//EN', 'BEGIN:VEVENT', 'UID:' + code + '@demo', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
          'DTSTART;VALUE=DATE:' + st.in.replace(/-/g, ''), 'DTEND;VALUE=DATE:' + st.out.replace(/-/g, ''), 'SUMMARY:' + S.name + ' – ' + room().name, 'LOCATION:' + S.address, 'DESCRIPTION:' + T('flow.code') + ' ' + code, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        var a = $('[data-ics]'); if (a) { a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics); a.download = S.code.toLowerCase() + '-stay.ics'; }
        go(3);
      });
    }
    rooms();
    var m0 = /step-(\d)/.exec(location.hash); go(m0 && +m0[1] > 1 && st.room ? +m0[1] : 1, false);
  })();

  /* ---------- room gallery: crossfade, arrows, swipe, keyboard ---------- */
  $$('[data-gallery]').forEach(function (g) {
    var slides = $$('.g-slide', g), i = 0, count = $('[data-g-count]', g);
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
      if (count) count.textContent = (i + 1) + ' / ' + slides.length;
    }
    $$('[data-g]', g).forEach(function (b) { b.addEventListener('click', function () { show(i + +b.dataset.g); }); });
    g.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
    var x0 = null; g.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    g.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
    show(0);
  });

  /* ---------- demo forms (newsletter, contact) ---------- */
  $$('form[data-demo-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var em = $('input[type=email]', f);
      var msg = $('[data-form-msg]', f);
      if (em && !em.checkValidity()) { em.setAttribute('aria-invalid', 'true'); msg.textContent = T('err.email'); em.focus(); return; }
      if (em) em.setAttribute('aria-invalid', 'false');
      msg.textContent = T('form.thanks'); f.reset();
    });
  });

  /* ---------- year ---------- */
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
