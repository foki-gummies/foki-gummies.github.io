// FOKI – měření událostí pro GA4 (gtag) a Microsoft Clarity
(function () {
  function track(name, params) {
    params = params || {};
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    if (typeof window.clarity === 'function') { window.clarity('event', name); }
  }
  window.fokiTrack = track;

  // Kliky na CTA tlačítka: <a data-track="cta_hero" data-label="...">
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var name = el.getAttribute('data-track');
    var p = { cta_label: el.getAttribute('data-label') || el.textContent.trim() };
    if (el.dataset.value) { p.value = Number(el.dataset.value); p.currency = 'CZK'; p.items = [{ item_name: el.dataset.item, price: Number(el.dataset.value) }]; }
    track(name, p);
  });

  // Hloubka scrollu 25/50/75/100 %
  var marks = [25, 50, 75, 100], sent = {};
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var pct = Math.round((h.scrollTop + window.innerHeight) / h.scrollHeight * 100);
    marks.forEach(function (m) { if (pct >= m && !sent[m]) { sent[m] = 1; track('scroll_depth', { percent: m }); } });
  }, { passive: true });

  // FAQ – které otázky lidi otevírají
  document.querySelectorAll('details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) track('faq_open', { question: d.querySelector('summary').textContent.trim() }); });
  });

  // Formulář předregistrace (bez backendu – pouze měření konverze)
  var f = document.getElementById('waitlist');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    track('generate_lead', { form: 'waitlist', currency: 'CZK', value: 149 });
    f.style.display = 'none';
    document.querySelector('.cta .ok').style.display = 'block';
  });
})();
