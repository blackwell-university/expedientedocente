/* i18n.js — Traducción español ↔ inglés por diccionario (sin API, sin costo).
   Uso en cada página (antes de </body>):
       <script src="i18n-en.js"></script>
       <script src="i18n.js"></script>
   - El idioma base es español; el diccionario (i18n-en.js) tiene "texto en español": "English text".
   - Las entradas con {} son patrones, p. ej. "¡Hola, {}!": "Hello, {}!".
   - Traduce lo que se ve (texto, placeholders, tooltips, alertas de SweetAlert2) y NO toca valores ni lógica.
   - El idioma elegido se recuerda en el navegador (localStorage "bgu_lang").
   - Para ver qué textos faltan por traducir, en la consola del navegador: i18n.missing() */
(function () {
  var KEY = 'bgu_lang';
  var DICT = window.I18N_EN || {};
  var exact = Object.create(null), patterns = [];
  Object.keys(DICT).forEach(function (es) {
    if (es.indexOf('{}') > -1) {
      var parts = es.split('{}').map(function (p) { return p.replace(/[.*+?^$()|[\]\\]/g, '\\$&'); });
      patterns.push({ re: new RegExp('^' + parts.join('(.+?)') + '$'), en: DICT[es] });
    } else { exact[es] = DICT[es]; }
  });
  patterns.sort(function (a, b) { return b.re.source.length - a.re.source.length; });

  var lang = 'es';
  try { lang = localStorage.getItem(KEY) || 'es'; } catch (e) {}
  var orig = new WeakMap();           // nodo/atributo -> {es, en}
  var missing = Object.create(null);
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, NOSCRIPT: 1 };

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function tr(s) {
    if (!s) return s;
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), pre = m[1], core = norm(m[2]), post = m[3];
    if (!core) return s;
    var out = exact[core];
    if (out === undefined) {
      for (var i = 0; i < patterns.length; i++) {
        var r = patterns[i].re.exec(core);
        if (r) { var k = 0; out = patterns[i].en.replace(/\{\}/g, function () { var v = r[++k] || ''; return exact[v] !== undefined ? exact[v] : v; }); break; }
      }
    }
    if (out === undefined) {
      if (/[áéíóúñ¿¡]|\b(el|la|de|para|con|que|los|las|tu|su)\b/i.test(core) && /[a-záéíóúñ]{3}/i.test(core)) missing[core] = 1;
      return s;
    }
    return pre + out + post;
  }

  function doText(n) {
    var cur = n.nodeValue, rec = orig.get(n);
    if (rec && cur === rec.en) return;          // lo escribimos nosotros
    if (lang === 'en') { var t = tr(cur); orig.set(n, { es: cur, en: t }); if (t !== cur) n.nodeValue = t; }
    else { orig.delete(n); }
  }
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  function doAttrs(el) {
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute || !el.hasAttribute(a)) return;
      var cur = el.getAttribute(a), key = '__i18n_' + a, rec = el[key];
      if (rec && cur === rec.en) return;
      if (lang === 'en') { var t = tr(cur); el[key] = { es: cur, en: t }; if (t !== cur) el.setAttribute(a, t); }
      else { delete el[key]; }
    });
    if (el.tagName === 'INPUT' && /^(button|submit|reset)$/i.test(el.type) && el.value) {
      var rec2 = el.__i18n_v, c2 = el.value;
      if (!(rec2 && c2 === rec2.en)) { if (lang === 'en') { var t2 = tr(c2); el.__i18n_v = { es: c2, en: t2 }; el.value = t2; } }
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!SKIP[root.parentNode && root.parentNode.tagName]) doText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.tagName]) return;
    doAttrs(root);
    for (var c = root.firstChild; c; c = c.nextSibling) walk(c);
  }
  function restore(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) { var r = orig.get(t); if (r && t.nodeValue === r.en) t.nodeValue = r.es; orig.delete(t); });
    root.querySelectorAll('*').forEach(function (el) {
      ATTRS.forEach(function (a) { var r = el['__i18n_' + a]; if (r && el.getAttribute(a) === r.en) el.setAttribute(a, r.es); delete el['__i18n_' + a]; });
      if (el.__i18n_v && el.value === el.__i18n_v.en) el.value = el.__i18n_v.es; delete el.__i18n_v;
    });
  }

  var titleEs = null;
  function applyTitle() {
    if (titleEs === null) titleEs = document.title;
    document.title = lang === 'en' ? tr(titleEs) : titleEs;
  }

  var obs = new MutationObserver(function (muts) {
    if (lang !== 'en') return;
    obs.disconnect();
    muts.forEach(function (m) {
      if (m.type === 'characterData') { if (!SKIP[m.target.parentNode && m.target.parentNode.tagName]) doText(m.target); }
      else if (m.type === 'attributes') doAttrs(m.target);
      else m.addedNodes.forEach(function (n) { walk(n); });
    });
    connect();
  });
  function connect() { obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat(['value']) }); }

  function paintButton() {
    var b = document.getElementById('i18nSwitch'); if (!b) return;
    b.querySelectorAll('[data-l]').forEach(function (s) { s.classList.toggle('on', s.getAttribute('data-l') === lang); });
  }
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'es';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);
    obs.disconnect();
    if (lang === 'en') walk(document.body); else restore(document.body);
    applyTitle();
    connect();
    paintButton();
    try { window.dispatchEvent(new CustomEvent('languagechange-bgu', { detail: lang })); } catch (e) {}
  }

  function buildButton() {
    if (document.getElementById('i18nSwitch')) return;
    var st = document.createElement('style');
    st.textContent = '#i18nSwitch{position:fixed;right:16px;bottom:18px;z-index:2147483000;display:flex;background:#fff;border:1px solid #e2e8f0;border-radius:999px;box-shadow:0 6px 18px rgba(15,23,42,.14);overflow:hidden;font:700 12px Inter,system-ui,sans-serif}' +
      '#i18nSwitch span{padding:8px 12px;cursor:pointer;color:#64748b;user-select:none}#i18nSwitch span.on{background:#1e3a8a;color:#fff}' +
      '@media(max-width:768px){#i18nSwitch{bottom:92px;right:12px}}';
    document.head.appendChild(st);
    var b = document.createElement('div'); b.id = 'i18nSwitch'; b.setAttribute('translate', 'no');
    b.innerHTML = '<span data-l="es" title="Español">ES</span><span data-l="en" title="English">EN</span>';
    b.addEventListener('click', function (e) { var l = e.target.getAttribute && e.target.getAttribute('data-l'); if (l) setLang(l); });
    document.body.appendChild(b);
    paintButton();
  }

  // alert() nativo también se traduce
  var nativeAlert = window.alert;
  window.alert = function (m) { return nativeAlert.call(window, lang === 'en' ? tr(String(m)) : m); };

  window.i18n = { setLang: setLang, getLang: function () { return lang; }, t: function (s) { return lang === 'en' ? tr(s) : s; }, missing: function () { return Object.keys(missing); } };

  function init() {
    buildButton();
    document.documentElement.setAttribute('lang', lang);
    if (lang === 'en') { walk(document.body); applyTitle(); }
    connect();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
