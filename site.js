/* Infrastructure Reference — shared nav + command palette (progressive enhancement) */
(function () {
  var INDEX = [{"t":"Home","u":"index.html","g":"Page"},{"t":"Compare returns","u":"compare.html","g":"Page"},{"t":"Community","u":"community.html","g":"Page"},{"t":"Contact","u":"contact.html","g":"Page"},{"t":"Energy & Utilities","u":"energy-utilities.html","g":"Asset class"},{"t":"Electricity transmission","u":"electricity-transmission.html","g":"Energy & Utilities"},{"t":"Electricity distribution","u":"electricity-distribution.html","g":"Energy & Utilities"},{"t":"Last-mile electricity","u":"last-mile-electricity.html","g":"Energy & Utilities"},{"t":"Electricity interconnectors","u":"electricity-interconnectors.html","g":"Energy & Utilities"},{"t":"Gas transmission","u":"gas-transmission.html","g":"Energy & Utilities"},{"t":"Gas distribution","u":"gas-distribution.html","g":"Energy & Utilities"},{"t":"Water & wastewater","u":"water-wastewater.html","g":"Energy & Utilities"},{"t":"Last-mile water","u":"last-mile-water.html","g":"Energy & Utilities"},{"t":"Heat networks","u":"heat-networks.html","g":"Energy & Utilities"},{"t":"Transport","u":"transport.html","g":"Asset class"},{"t":"Roads","u":"roads.html","g":"Transport"},{"t":"Rail infrastructure","u":"rail-infrastructure.html","g":"Transport"},{"t":"Airports","u":"airports.html","g":"Transport"},{"t":"Ports","u":"ports.html","g":"Transport"},{"t":"Rolling stock","u":"rolling-stock.html","g":"Transport"},{"t":"EV charging","u":"ev-charging.html","g":"Transport"},{"t":"Bridges","u":"bridges.html","g":"Transport"},{"t":"Digital Infrastructure","u":"digital-infrastructure.html","g":"Asset class"},{"t":"Fibre networks","u":"fibre-networks.html","g":"Digital Infrastructure"},{"t":"Mobile towers","u":"mobile-towers.html","g":"Digital Infrastructure"},{"t":"Data centres","u":"data-centres.html","g":"Digital Infrastructure"},{"t":"Subsea cables","u":"subsea-cables.html","g":"Digital Infrastructure"},{"t":"Social Infrastructure","u":"social-infrastructure.html","g":"Asset class"},{"t":"Hospitals","u":"hospitals.html","g":"Social Infrastructure"},{"t":"Schools","u":"schools.html","g":"Social Infrastructure"},{"t":"Prisons","u":"prisons.html","g":"Social Infrastructure"},{"t":"Courts","u":"courts.html","g":"Social Infrastructure"},{"t":"Military","u":"military.html","g":"Social Infrastructure"},{"t":"Student accommodation","u":"student-accommodation.html","g":"Social Infrastructure"},{"t":"Energy Transition","u":"energy-transition.html","g":"Asset class"},{"t":"Onshore wind","u":"onshore-wind.html","g":"Energy Transition"},{"t":"Offshore wind","u":"offshore-wind.html","g":"Energy Transition"},{"t":"Solar","u":"solar.html","g":"Energy Transition"},{"t":"Battery storage","u":"battery-storage.html","g":"Energy Transition"},{"t":"Hydrogen","u":"hydrogen.html","g":"Energy Transition"},{"t":"Nuclear","u":"nuclear.html","g":"Energy Transition"},{"t":"Pumped hydro","u":"pumped-hydro.html","g":"Energy Transition"},{"t":"Environmental & Waste","u":"environmental-waste.html","g":"Asset class"},{"t":"Waste-to-energy","u":"waste-to-energy.html","g":"Environmental & Waste"},{"t":"Anaerobic digestion","u":"anaerobic-digestion.html","g":"Environmental & Waste"},{"t":"Recycling infrastructure","u":"recycling-infrastructure.html","g":"Environmental & Waste"},{"t":"RIIO-ED2 Revenue Calculator","u":"riio_ed2_calculator.html","g":"Tool"},{"t":"Investment Considerations","u":"heat_framework.html","g":"Tool"},{"t":"Regulatory Timeline","u":"heat_regulation_timeline.html","g":"Tool"},{"t":"HSA Cashflow Model","u":"heat_dcf.html","g":"Tool"},{"t":"Cash-flow & DCF model","u":"cashflow-model.html","g":"Tool"},{"t":"Infrastructure M&A","u":"infrastructure-ma.html","g":"Tool"},{"t":"Infrastructure deals database","u":"infrastructure-deals.html","g":"Tool"},{"t":"M&A in action: fibre market entry","u":"ma-in-action.html","g":"Tool"},{"t":"WACC Calculator","u":"wacc-calculator.html","g":"Tool"},{"t":"Macro Dashboard","u":"macro_dashboard.html","g":"Tool"},{"t":"Ofgem & Ofwat Tracker","u":"regulatory_tracker.html","g":"Tool"}];

  var classes = INDEX.filter(function (e) { return e.g === 'Asset class'; });
  var here = (location.pathname.split('/').pop() || 'index.html');

  /* ---------------- Previous / Next pager ---------------- */
  (function () {
    /* a linear tour through the reference library: asset-class pages + their
       sub-sectors, in INDEX order (skip Home/Compare/Community and the tools) */
    var SEQ = INDEX.filter(function (e) { return e.g !== 'Page' && e.g !== 'Tool'; });
    var idx = -1;
    for (var k = 0; k < SEQ.length; k++) { if (SEQ[k].u === here) { idx = k; break; } }
    var footer = document.querySelector('footer');
    if (idx < 0 || !footer) return;          /* not a tour page -> no pager */
    var prev = idx > 0 ? SEQ[idx - 1] : null;
    var next = idx < SEQ.length - 1 ? SEQ[idx + 1] : null;
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function card(e, dir) {
      if (!e) return '<span class="pager-link empty" aria-hidden="true"></span>';
      var label = dir === 'prev' ? 'Previous' : 'Next';
      var arrow = '<span class="pager-arrow">' + (dir === 'prev' ? '←' : '→') + '</span>';
      return '<a class="pager-link ' + dir + '" href="' + e.u + '">'
        + '<span class="pager-eyebrow">' + (dir === 'prev' ? arrow + label : label + arrow) + '</span>'
        + '<span class="pager-name">' + esc(e.t) + '</span>'
        + '<span class="pager-group">' + esc(e.g === 'Asset class' ? 'Asset class' : e.g) + '</span></a>';
    }
    var pager = document.createElement('nav');
    pager.className = 'pager' + (document.getElementById('ix') ? ' narrow' : '');
    pager.setAttribute('aria-label', 'Previous and next page');
    pager.innerHTML = card(prev, 'prev') + card(next, 'next');
    footer.parentNode.insertBefore(pager, footer);
  })();

  /* ---------------- Footer contact link ---------------- */
  (function () {
    var ft = document.querySelector('footer .footer-text');
    if (!ft || ft.querySelector('a[href="contact.html"]')) return;
    ft.appendChild(document.createTextNode(' · '));
    var a = document.createElement('a');
    a.href = 'contact.html'; a.textContent = 'Contact';
    a.style.cssText = 'color:var(--accent);text-decoration:none;font-weight:600';
    if (here === 'contact.html') a.setAttribute('aria-current', 'page');
    ft.appendChild(a);
  })();

  /* ---------------- Contact form (Web3Forms) — contact.html only ---------------- */
  (function () {
    /* The form lives on its own page; everywhere else "Contact" is just a link. */
    var mount = document.getElementById('contact-mount');
    if (!mount) return;

    /* Get a free access key at https://web3forms.com — it is safe to expose in
       client code, and it keeps your email address out of the page source.
       Submissions are emailed to the address linked to the key, with the
       visitor's email set as Reply-To so you can reply directly. */
    var ACCESS_KEY = '9e75f662-1d6a-429f-bac9-32ec7018c756';

    var topics = ['General enquiry', 'Feedback', 'Investment or advisory',
                  'Partnerships or collaboration', 'Media or speaking', 'Something else'];
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

    mount.innerHTML =
      '<div class="contact-card">' +
        '<form class="contact-form" novalidate>' +
          '<div class="contact-grid">' +
            '<div class="contact-field full"><label for="cf-topic">What’s this about?</label>' +
              '<select id="cf-topic" name="topic">' +
                topics.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') +
              '</select></div>' +
            '<div class="contact-field"><label for="cf-name">Name</label>' +
              '<input id="cf-name" name="name" type="text" autocomplete="name" placeholder="Your name"></div>' +
            '<div class="contact-field"><label for="cf-email">Email <span class="req">*</span></label>' +
              '<input id="cf-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div>' +
            '<div class="contact-field full"><label for="cf-msg">Message <span class="req">*</span></label>' +
              '<textarea id="cf-msg" name="message" required placeholder="How can I help?"></textarea></div>' +
          '</div>' +
          /* honeypot — hidden from users, catches bots */
          '<input type="checkbox" name="botcheck" class="cf-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<div class="contact-foot">' +
            '<button type="submit" class="contact-btn">Send message</button>' +
            '<span class="contact-status" role="status" aria-live="polite"></span>' +
          '</div>' +
          '<p class="contact-note">Your email is used only to reply to you — no newsletter, no sharing.</p>' +
        '</form>' +
      '</div>';

    var form = mount.querySelector('form'),
        statusEl = mount.querySelector('.contact-status'),
        btn = mount.querySelector('.contact-btn'),
        emailEl = mount.querySelector('#cf-email'),
        msgEl = mount.querySelector('#cf-msg'),
        sec = mount;
    function setStatus(msg, kind) { statusEl.textContent = msg; statusEl.className = 'contact-status' + (kind ? ' ' + kind : ''); }
    function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [emailEl, msgEl].forEach(function (el) { el.classList.remove('invalid'); });
      if (!emailOk(emailEl.value.trim())) { emailEl.classList.add('invalid'); ok = false; }
      if (msgEl.value.trim().length < 5) { msgEl.classList.add('invalid'); ok = false; }
      if (!ok) { setStatus('Please add a valid email and a short message.', 'err'); return; }
      if (ACCESS_KEY.indexOf('YOUR-') === 0) { setStatus('The form isn’t configured yet (add a Web3Forms access key).', 'err'); return; }

      var topic = sec.querySelector('#cf-topic').value;
      var payload = {
        access_key: ACCESS_KEY,
        subject: 'Contact — ' + topic,
        from_name: 'theinfrastructureinvestor.com',
        name: (sec.querySelector('#cf-name').value || '').trim(),
        email: emailEl.value.trim(),
        topic: topic,
        message: msgEl.value.trim(),
        page: location.pathname,
        botcheck: form.botcheck.checked ? 'true' : ''
      };
      btn.disabled = true; setStatus('Sending…', '');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (data) {
        if (data && data.success) { form.reset(); setStatus('Thanks — your message has been sent. I’ll be in touch.', 'ok'); }
        else { setStatus((data && data.message) || 'Something went wrong. Please try again.', 'err'); }
      }).catch(function () {
        setStatus('Network error — please try again in a moment.', 'err');
      }).then(function () { btn.disabled = false; });
    });
  })();

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

    // Contact link (beside Asset classes)
    var contactTop = document.createElement('a');
    contactTop.className = 'nav-link'; contactTop.href = 'contact.html'; contactTop.textContent = 'Contact';
    if (here === 'contact.html') contactTop.classList.add('on');

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
    actions.appendChild(contactTop);
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
    function open() {
      overlay.classList.add('show'); document.body.style.overflow = 'hidden'; input.value = ''; render();
      // focus reliably: the overlay animates in, so try now, next frame, and shortly after
      var f = function () { try { input.focus({ preventScroll: true }); } catch (_) { input.focus(); } };
      f(); requestAnimationFrame(f); setTimeout(f, 60);
    }
    function close() { overlay.classList.remove('show'); document.body.style.overflow = ''; }

    search.addEventListener('click', open);
    input.addEventListener('input', render);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    results.addEventListener('mousemove', function (e) {
      var row = e.target.closest('.cmdk-row'); if (row) { sel = +row.dataset.i; highlight(); }
    });
    document.addEventListener('keydown', function (e) {
      var isOpen = overlay.classList.contains('show');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); isOpen ? close() : open(); return; }
      if (!isOpen) {
        if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) { e.preventDefault(); open(); }
        return;
      }
      // palette is open — drive navigation from the document so it works even if
      // focus hasn't landed in the input yet
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, flat.length - 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); highlight(); }
      else if (e.key === 'Enter') { e.preventDefault(); go(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
  }
})();
