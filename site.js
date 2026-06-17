/* Infrastructure Reference — shared nav + command palette (progressive enhancement) */
(function () {
  var INDEX = [{"t":"Home","u":"index.html","g":"Page"},{"t":"Compare returns","u":"compare.html","g":"Page"},{"t":"Community","u":"community.html","g":"Page"},{"t":"Energy & Utilities","u":"energy-utilities.html","g":"Asset class"},{"t":"Electricity transmission","u":"electricity-transmission.html","g":"Energy & Utilities"},{"t":"Electricity distribution","u":"electricity-distribution.html","g":"Energy & Utilities"},{"t":"Last-mile electricity","u":"last-mile-electricity.html","g":"Energy & Utilities"},{"t":"Electricity interconnectors","u":"electricity-interconnectors.html","g":"Energy & Utilities"},{"t":"Gas transmission","u":"gas-transmission.html","g":"Energy & Utilities"},{"t":"Gas distribution","u":"gas-distribution.html","g":"Energy & Utilities"},{"t":"Water & wastewater","u":"water-wastewater.html","g":"Energy & Utilities"},{"t":"Last-mile water","u":"last-mile-water.html","g":"Energy & Utilities"},{"t":"Heat networks","u":"heat-networks.html","g":"Energy & Utilities"},{"t":"Transport","u":"transport.html","g":"Asset class"},{"t":"Roads","u":"roads.html","g":"Transport"},{"t":"Rail infrastructure","u":"rail-infrastructure.html","g":"Transport"},{"t":"Airports","u":"airports.html","g":"Transport"},{"t":"Ports","u":"ports.html","g":"Transport"},{"t":"Rolling stock","u":"rolling-stock.html","g":"Transport"},{"t":"EV charging","u":"ev-charging.html","g":"Transport"},{"t":"Bridges","u":"bridges.html","g":"Transport"},{"t":"Digital Infrastructure","u":"digital-infrastructure.html","g":"Asset class"},{"t":"Fibre networks","u":"fibre-networks.html","g":"Digital Infrastructure"},{"t":"Mobile towers","u":"mobile-towers.html","g":"Digital Infrastructure"},{"t":"Data centres","u":"data-centres.html","g":"Digital Infrastructure"},{"t":"Subsea cables","u":"subsea-cables.html","g":"Digital Infrastructure"},{"t":"Social Infrastructure","u":"social-infrastructure.html","g":"Asset class"},{"t":"Hospitals","u":"hospitals.html","g":"Social Infrastructure"},{"t":"Schools","u":"schools.html","g":"Social Infrastructure"},{"t":"Prisons","u":"prisons.html","g":"Social Infrastructure"},{"t":"Courts","u":"courts.html","g":"Social Infrastructure"},{"t":"Military","u":"military.html","g":"Social Infrastructure"},{"t":"Student accommodation","u":"student-accommodation.html","g":"Social Infrastructure"},{"t":"Energy Transition","u":"energy-transition.html","g":"Asset class"},{"t":"Onshore wind","u":"onshore-wind.html","g":"Energy Transition"},{"t":"Offshore wind","u":"offshore-wind.html","g":"Energy Transition"},{"t":"Solar","u":"solar.html","g":"Energy Transition"},{"t":"Battery storage","u":"battery-storage.html","g":"Energy Transition"},{"t":"Hydrogen","u":"hydrogen.html","g":"Energy Transition"},{"t":"Nuclear","u":"nuclear.html","g":"Energy Transition"},{"t":"Pumped hydro","u":"pumped-hydro.html","g":"Energy Transition"},{"t":"Environmental & Waste","u":"environmental-waste.html","g":"Asset class"},{"t":"Waste-to-energy","u":"waste-to-energy.html","g":"Environmental & Waste"},{"t":"Anaerobic digestion","u":"anaerobic-digestion.html","g":"Environmental & Waste"},{"t":"Recycling infrastructure","u":"recycling-infrastructure.html","g":"Environmental & Waste"},{"t":"RIIO-ED2 Revenue Calculator","u":"riio_ed2_calculator.html","g":"Tool"},{"t":"Investment Considerations","u":"heat_framework.html","g":"Tool"},{"t":"Regulatory Timeline","u":"heat_regulation_timeline.html","g":"Tool"},{"t":"HSA Cashflow Model","u":"heat_dcf.html","g":"Tool"},{"t":"WACC Calculator","u":"wacc-calculator.html","g":"Tool"},{"t":"Macro Dashboard","u":"macro_dashboard.html","g":"Tool"},{"t":"Ofgem & Ofwat Tracker","u":"regulatory_tracker.html","g":"Tool"}];

  var classes = INDEX.filter(function (e) { return e.g === 'Asset class'; });
  var here = (location.pathname.split('/').pop() || 'index.html');

  /* ---------------- Top navigation ---------------- */
  var wrap = document.querySelector('nav .wrap');
  if (wrap) {
    var meta = wrap.querySelector('.nav-meta');
    if (meta) meta.classList.add('nav-meta-hide');

    var actions = document.createElement('div');
    actions.className = 'nav-actions';

    // Asset-classes dropdown
    var dd = document.createElement('div');
    dd.className = 'nav-dd';
    var ddBtn = document.createElement('button');
    ddBtn.className = 'nav-link nav-dd-btn';
    ddBtn.type = 'button';
    ddBtn.innerHTML = 'Asset classes <span class="caret">▾</span>';
    var ddMenu = document.createElement('div');
    ddMenu.className = 'nav-dd-menu';
    classes.forEach(function (c) {
      var a = document.createElement('a');
      a.href = c.u; a.textContent = c.t;
      if (c.u === here) a.className = 'on';
      ddMenu.appendChild(a);
    });
    dd.appendChild(ddBtn); dd.appendChild(ddMenu);
    ddBtn.addEventListener('click', function (e) {
      e.stopPropagation(); dd.classList.toggle('open');
    });
    document.addEventListener('click', function () { dd.classList.remove('open'); });

    // Compare link
    var cmp = document.createElement('a');
    cmp.className = 'nav-link'; cmp.href = 'compare.html'; cmp.textContent = 'Compare';
    if (here === 'compare.html') cmp.classList.add('on');

    // Search trigger
    var search = document.createElement('button');
    search.className = 'nav-search'; search.type = 'button';
    search.setAttribute('aria-label', 'Search the site');
    search.innerHTML = '<span class="ns-ico">⌕</span><span class="ns-txt">Search</span><kbd class="ns-kbd">' +
      (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K') + '</kbd>';

    actions.appendChild(dd);
    actions.appendChild(cmp);
    actions.appendChild(search);
    wrap.appendChild(actions);

    /* ---------------- Command palette ---------------- */
    var overlay = document.createElement('div');
    overlay.className = 'cmdk';
    overlay.innerHTML =
      '<div class="cmdk-box" role="dialog" aria-modal="true" aria-label="Search">' +
        '<div class="cmdk-in"><span class="cmdk-ico">⌕</span>' +
        '<input type="search" id="cmdkInput" placeholder="Search asset classes, sub-sectors, tools…" autocomplete="off" spellcheck="false">' +
        '<kbd class="cmdk-esc">esc</kbd></div>' +
        '<div class="cmdk-results" id="cmdkResults"></div>' +
        '<div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('#cmdkInput');
    var results = overlay.querySelector('#cmdkResults');
    var flat = [], sel = 0;

    function score(q, e) {
      var t = e.t.toLowerCase(), g = e.g.toLowerCase();
      if (!q) return 1;
      var i = t.indexOf(q);
      if (i === 0) return 1000;
      if (i > 0) return 600 - i;
      if (g.indexOf(q) >= 0) return 200;
      // subsequence (fuzzy)
      var qi = 0; for (var k = 0; k < t.length && qi < q.length; k++) if (t[k] === q[qi]) qi++;
      return qi === q.length ? 80 : -1;
    }
    function render() {
      var q = input.value.trim().toLowerCase();
      var scored = INDEX.map(function (e) { return { e: e, s: score(q, e) }; })
                        .filter(function (x) { return x.s >= 0; })
                        .sort(function (a, b) { return b.s - a.s; });
      if (q) scored = scored.slice(0, 40);
      var order = ['Page', 'Asset class', 'Energy & Utilities', 'Transport', 'Digital Infrastructure',
                   'Social Infrastructure', 'Energy Transition', 'Environmental & Waste', 'Tool'];
      var groups = {}; scored.forEach(function (x) { (groups[x.e.g] = groups[x.e.g] || []).push(x.e); });
      flat = []; var html = '';
      var keys = Object.keys(groups).sort(function (a, b) {
        var ia = order.indexOf(a), ib = order.indexOf(b);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
      keys.forEach(function (g) {
        html += '<div class="cmdk-grp">' + g + '</div>';
        groups[g].forEach(function (e) {
          var i = flat.length; flat.push(e);
          html += '<a class="cmdk-row" data-i="' + i + '" href="' + e.u + '">' +
                  '<span class="cmdk-t">' + e.t + '</span><span class="cmdk-g">' + g + '</span></a>';
        });
      });
      if (!flat.length) html = '<div class="cmdk-empty">No matches for “' + (input.value || '') + '”</div>';
      results.innerHTML = html;
      sel = 0; highlight();
    }
    function highlight() {
      var rows = results.querySelectorAll('.cmdk-row');
      rows.forEach(function (r, i) { r.classList.toggle('on', i === sel); });
      var cur = rows[sel]; if (cur) cur.scrollIntoView({ block: 'nearest' });
    }
    function go() { var e = flat[sel]; if (e) location.href = e.u; }
    function open() { overlay.classList.add('show'); document.body.style.overflow = 'hidden'; input.value = ''; render(); setTimeout(function () { input.focus(); }, 20); }
    function close() { overlay.classList.remove('show'); document.body.style.overflow = ''; }

    search.addEventListener('click', open);
    input.addEventListener('input', render);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    results.addEventListener('mousemove', function (e) {
      var row = e.target.closest('.cmdk-row'); if (row) { sel = +row.dataset.i; highlight(); }
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, flat.length - 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); highlight(); }
      else if (e.key === 'Enter') { e.preventDefault(); go(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.classList.contains('show') ? close() : open(); }
      else if (e.key === '/' && !overlay.classList.contains('show') && !/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||''))) { e.preventDefault(); open(); }
    });
  }
})();
