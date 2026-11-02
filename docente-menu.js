/* docente-menu.js — Portal del docente
   Mueve el idioma (ES/EN) y el tamaño de letra (A−/A+) al menú del usuario:
   · Escritorio: dentro del desplegable del nombre.
   · Celular: dentro del menú lateral (botón ☰).
   Quita el selector ES/EN flotante y la píldora A−/A+ de la barra superior. Recuerda el tamaño de letra. */
(function () {
  var KEY_FONT = 'docenteFontLevel';
  var st = document.createElement('style');
  st.textContent =
    '#i18nSwitch{display:none!important}' +
    '.nav-user > .font-controls{display:none!important}' +
    '.user-dropdown{width:272px!important}' +
    '.dm-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;font-weight:700;font-size:.85rem;color:var(--text-main,#1e293b)}' +
    '.dm-row .dm-l{display:flex;align-items:center;gap:10px}' +
    '.dm-ic{overflow:hidden;width:30px;height:30px;border-radius:9px;background:#eff6ff;color:var(--primary,#1e40af);display:grid;place-items:center;flex-shrink:0}' +
    '.dm-ic .material-symbols-rounded{font-size:18px}' +
    '.dm-seg{display:inline-flex;background:#f1f5f9;border-radius:999px;padding:3px}' +
    '.dm-seg button{border:0;background:transparent;font:700 12px Inter,system-ui,sans-serif;padding:7px 13px;border-radius:999px;color:#64748b;cursor:pointer;min-height:32px}' +
    '.dm-seg button.on{background:var(--primary-dark,#1e3a8a);color:#fff}' +
    '.dm-zoom{display:inline-flex;align-items:center;gap:2px;background:#f1f5f9;border-radius:999px;padding:3px}' +
    '.dm-zoom button{border:0;background:#fff;color:var(--primary-dark,#1e3a8a);font:800 13px Inter,system-ui,sans-serif;border-radius:999px;min-width:34px;height:32px;box-shadow:0 1px 2px rgba(15,23,42,.1);cursor:pointer}' +
    '.dm-zoom button:disabled{opacity:.35;cursor:default}' +
    '.dm-zoom i{font:700 11.5px Inter,system-ui,sans-serif;font-style:normal;color:#64748b;min-width:40px;text-align:center}' +
    '.dm-sep{border-top:1px solid #e2e8f0;margin:5px 0}';
  document.head.appendChild(st);

  var NIVELES = 4; // coincide con fontSizes = 16/18/20/22 px de cada página

  function nivelActual() {
    var px = parseFloat(document.documentElement.style.fontSize) || 16;
    return Math.max(0, Math.min(NIVELES - 1, Math.round((px - 16) / 2)));
  }
  function pctTexto() { return Math.round(parseFloat(document.documentElement.style.fontSize || '16') / 16 * 100) + '%'; }

  function sincronizar() {
    var lang = (window.i18n && window.i18n.getLang && window.i18n.getLang()) || 'es';
    document.querySelectorAll('.dm-seg button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-l') === lang); });
    var n = nivelActual();
    document.querySelectorAll('.dm-pct').forEach(function (e) { e.textContent = pctTexto(); });
    document.querySelectorAll('.dm-zoom .dm-minus').forEach(function (b) { b.disabled = n === 0; });
    document.querySelectorAll('.dm-zoom .dm-plus').forEach(function (b) { b.disabled = n === NIVELES - 1; });
  }

  function cambiarLetra(step) {
    if (typeof window.changeFontSize === 'function') window.changeFontSize(step);
    else document.documentElement.style.fontSize = (16 + 2 * Math.max(0, Math.min(NIVELES - 1, nivelActual() + step))) + 'px';
    try { localStorage.setItem(KEY_FONT, String(nivelActual())); } catch (e) {}
    sincronizar();
  }

  function filaIdioma() {
    var d = document.createElement('div'); d.className = 'dm-row';
    d.innerHTML = '<span class="dm-l"><span class="dm-ic"><span class="material-symbols-rounded">language</span></span>Idioma</span>' +
      '<span class="dm-seg" translate="no"><button type="button" data-l="es">ES</button><button type="button" data-l="en">EN</button></span>';
    d.addEventListener('click', function (e) {
      e.stopPropagation();
      var l = e.target.getAttribute && e.target.getAttribute('data-l');
      if (l && window.i18n) { window.i18n.setLang(l); sincronizar(); }
    });
    return d;
  }
  function filaLetra() {
    var d = document.createElement('div'); d.className = 'dm-row';
    d.innerHTML = '<span class="dm-l"><span class="dm-ic"><span class="material-symbols-rounded">format_size</span></span>Tamaño de letra</span>' +
      '<span class="dm-zoom" translate="no"><button type="button" class="dm-minus" aria-label="Reducir letra">A−</button><i class="dm-pct">100%</i><button type="button" class="dm-plus" aria-label="Aumentar letra" style="font-size:16px">A+</button></span>';
    d.addEventListener('click', function (e) {
      e.stopPropagation();
      var b = e.target.closest && e.target.closest('button');
      if (!b) return;
      cambiarLetra(b.classList.contains('dm-plus') ? 1 : -1);
    });
    return d;
  }

  function init() {
    // Restaurar tamaño guardado
    try {
      var g = parseInt(localStorage.getItem(KEY_FONT), 10);
      if (!isNaN(g) && g > 0 && g < NIVELES) {
        document.documentElement.style.fontSize = (16 + 2 * g) + 'px';
        try { window.currentSizeLevel = g; } catch (e) {}
        try { currentSizeLevel = g; } catch (e) {}
      }
    } catch (e) {}

    // Escritorio: desplegable del usuario
    var dd = document.getElementById('userDropdownMenu') || document.querySelector('.user-dropdown');
    if (dd && !dd.querySelector('.dm-row')) {
      var logout = dd.querySelector('.dropdown-link.logout');
      var sep = logout && logout.previousElementSibling && logout.previousElementSibling.tagName === 'DIV' ? logout.previousElementSibling : logout;
      var cont = document.createDocumentFragment();
      var s0 = document.createElement('div'); s0.className = 'dm-sep';
      cont.appendChild(s0); cont.appendChild(filaIdioma()); cont.appendChild(filaLetra());
      if (sep) dd.insertBefore(cont, sep); else dd.appendChild(cont);
    }

    // Celular: menú lateral
    var drawerRow = document.querySelector('.mh-drawer .mh-drawer-row');
    if (drawerRow && !document.querySelector('.mh-drawer .dm-lang-row')) {
      var fila = document.createElement('div'); fila.className = 'mh-drawer-row dm-lang-row';
      fila.innerHTML = '<span>Idioma</span><span class="dm-seg" translate="no"><button type="button" data-l="es">ES</button><button type="button" data-l="en">EN</button></span>';
      fila.addEventListener('click', function (e) {
        var l = e.target.getAttribute && e.target.getAttribute('data-l');
        if (l && window.i18n) { window.i18n.setLang(l); sincronizar(); }
      });
      drawerRow.parentNode.insertBefore(fila, drawerRow);
      // Los botones A−/A+ propios de la página guardan el nivel y sincronizan
      drawerRow.addEventListener('click', function () { setTimeout(function () { try { localStorage.setItem(KEY_FONT, String(nivelActual())); } catch (e) {} sincronizar(); }, 0); });
    }

    sincronizar();
    window.addEventListener('languagechange-bgu', sincronizar);
  }

  // ===== Recordatorio de datos de pago incompletos =====
  var KEY_PAGO = 'docentePagoIncompleto';
  var CAMPOS = ['banco','moneda','tipo_cuenta','cuenta','cci','tipo_ruta','codigo_ruta'];
  function pagoPintar(inc) {
    try {
      document.querySelectorAll('a[href="perfil.html"]').forEach(function (a) {
        var ya = a.querySelector('.dp-dot');
        if (inc && !ya && !/perfil\.html/.test(location.pathname)) {
          var d = document.createElement('span'); d.className = 'dp-dot';
          d.style.cssText = 'display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;margin-left:6px;vertical-align:middle;';
          d.title = 'Faltan tus datos de pago'; a.appendChild(d);
        } else if (!inc && ya) ya.remove();
      });
      var wrap = document.getElementById('atencionWrap');
      var b = document.getElementById('dpBanner');
      if (inc && wrap && !b && !/perfil\.html/.test(location.pathname)) {
        b = document.createElement('a'); b.id = 'dpBanner'; b.href = 'perfil.html';
        b.style.cssText = 'display:flex;gap:10px;align-items:center;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;border-radius:14px;padding:12px 16px;margin-bottom:16px;text-decoration:none;font-size:.88rem;font-weight:600;';
        b.innerHTML = '<span class="material-symbols-rounded" style="font-size:22px;">payments</span><span style="flex:1;">Aún faltan tus datos de pago. Complétalos en tu perfil para que podamos depositarte al terminar tus cursos.</span><span style="white-space:nowrap;">Completar →</span>';
        wrap.parentNode.insertBefore(b, wrap);
      } else if (!inc && b) b.remove();
    } catch (e) {}
  }
  window.DocentePago = {
    set: function (inc) { try { sessionStorage.setItem(KEY_PAGO, inc ? '1' : '0'); } catch (e) {} pagoPintar(!!inc); }
  };
  function pagoInit() {
    var cache = null; try { cache = sessionStorage.getItem(KEY_PAGO); } catch (e) {}
    if (cache !== null) { pagoPintar(cache === '1'); return; }
    var id = null, url = null;
    try { id = localStorage.getItem('userId'); } catch (e) {}
    url = window.GAS_URL || (typeof GAS_URL !== 'undefined' ? GAS_URL : null);
    if (!id || !url || /perfil\.html/.test(location.pathname)) return;
    fetch(url, { method: 'POST', body: JSON.stringify({ action: 'get_profile', id: id }) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        var d = (r && r.data) || {};
        var inc = CAMPOS.some(function (k) { return !String(d[k] == null ? '' : d[k]).trim(); });
        if (r && (r.status === 'success' || r.status === 'partial')) window.DocentePago.set(inc);
      }).catch(function () {});
  }
  setTimeout(pagoInit, 400);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
