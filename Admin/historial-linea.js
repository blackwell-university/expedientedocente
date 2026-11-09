/* Historial (línea de tiempo) de una invitación o un expediente. Uso:
   BGUHistorial.cargar(document.getElementById('x'), GAS_URL, { idInvitacion:'..', idExpediente:'..', modo:'invitacion'|'expediente' }) */
(function () {
    var PRINCIPALES = {
        invitacion: [
            ['invitacion_enviada', 'Invitación enviada al docente'], ['invitacion_aceptada', 'Docente aceptó la invitación'],
            ['registro_enviado', 'Docente registró y envió su información'], ['docs_enviados_docente', 'Documentos enviados al docente para firma'],
            ['docente_firmo', 'Docente firmó los documentos'], ['enviado_directores', 'Enviado a firma de los directores'],
            ['firma_zamudio', 'Director Zamudio firmó'], ['firma_ernesto', 'Director Ernesto firmó'],
            ['documentos_completados', 'Documentos completados (todas las firmas)'], ['curso_culminado', 'Curso culminado por la asesora'],
            ['conformidad_dictado', 'Conformidad del dictado'], ['recibo_subido', 'Docente envió su recibo por honorarios']
        ],
        expediente: [
            ['registro_enviado', 'Docente registró y envió su información'], ['docs_enviados_docente', 'Documentos enviados al docente para firma'],
            ['docente_firmo', 'Docente firmó los documentos'], ['enviado_directores', 'Enviado a firma de los directores'],
            ['firma_zamudio', 'Director Zamudio firmó'], ['firma_ernesto', 'Director Ernesto firmó'],
            ['documentos_completados', 'Documentos completados (todas las firmas)']
        ]
    };
    var css = '.hl-list{position:relative;margin:6px 0 0;padding:0;list-style:none}.hl-item{position:relative;padding:0 0 16px 28px}' +
        '.hl-item::before{content:"";position:absolute;left:7px;top:16px;bottom:-2px;width:2px;background:#e2e8f0}.hl-item:last-child::before{display:none}' +
        '.hl-dot{position:absolute;left:0;top:3px;width:16px;height:16px;border-radius:50%;background:#16a34a;border:3px solid #dcfce7}' +
        '.hl-item.ant .hl-dot{background:#94a3b8;border-color:#e2e8f0}.hl-item.pend .hl-dot{background:#fff;border:2px dashed #cbd5e1}' +
        '.hl-t{font-size:.88rem;font-weight:700;color:#0f172a;line-height:1.3}.hl-item.pend .hl-t{color:#94a3b8;font-weight:600}' +
        '.hl-f{font-size:.78rem;color:#475569;font-weight:600}.hl-m{font-size:.76rem;color:#64748b}' +
        '.hl-tag{display:inline-block;font-size:.66rem;font-weight:700;color:#64748b;background:#f1f5f9;border-radius:6px;padding:1px 7px;margin-left:6px}' +
        '.hl-sub{font-size:.7rem;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin:10px 0 8px}';
    function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function estilos() { if (document.getElementById('hl-css')) return; var s = document.createElement('style'); s.id = 'hl-css'; s.textContent = css; document.head.appendChild(s); }
    function pintar(el, eventos, modo) {
        estilos();
        if (!eventos.length) { el.innerHTML = '<div class="text-muted small">Todavía no hay movimientos registrados.</div>'; return; }
        var hechos = {}; eventos.forEach(function (e) { hechos[e.clave] = true; if (e.clave === 'recibo_reemplazado') hechos.recibo_subido = true; });
        var items = eventos.map(function (e) {
            return '<li class="hl-item' + (e.anterior ? ' ant' : '') + '"><span class="hl-dot"></span><div class="hl-t">' + esc(e.titulo) + '</div>' +
                '<div class="hl-f"><i class="fa-regular fa-calendar me-1"></i>' + esc(e.cuando) +
                (e.anterior ? '<span class="hl-tag" title="Fecha tomada de lo que ya estaba guardado antes del historial (puede no tener hora)">dato anterior</span>' : '') + '</div>' +
                ((e.por || e.detalle) ? '<div class="hl-m">' + (e.por ? 'Por ' + esc(e.por) : '') + (e.por && e.detalle ? ' · ' : '') + esc(e.detalle) + '</div>' : '') + '</li>';
        }).join('');
        var pend = (PRINCIPALES[modo] || PRINCIPALES.invitacion).filter(function (x) { return !hechos[x[0]]; });
        var pendHtml = pend.length ? '<div class="hl-sub">Aún sin registrar</div><ul class="hl-list">' + pend.map(function (x) {
            return '<li class="hl-item pend"><span class="hl-dot"></span><div class="hl-t">' + esc(x[1]) + '</div></li>'; }).join('') + '</ul>' : '';
        el.innerHTML = '<ul class="hl-list">' + items + '</ul>' + pendHtml;
    }
    window.BGUHistorial = {
        cargar: function (el, gasUrl, opt) {
            if (!el) return Promise.resolve();
            el.innerHTML = '<div class="text-muted small">Cargando historial…</div>';
            return fetch(gasUrl, { method: 'POST', body: JSON.stringify({ action: 'get_historial_invitacion', idInvitacion: opt.idInvitacion || '', idExpediente: opt.idExpediente || '', rol: localStorage.getItem('userRole') }) })
                .then(function (r) { return r.json(); })
                .then(function (r) { if (r.status === 'success') pintar(el, r.eventos || [], opt.modo); else el.innerHTML = '<div class="text-danger small">' + esc(r.message || 'No se pudo cargar el historial.') + '</div>'; })
                .catch(function () { el.innerHTML = '<div class="text-danger small">No se pudo cargar el historial.</div>'; });
        },
        pintar: pintar
    };
})();
