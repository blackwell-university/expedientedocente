/* bgu-sidebar.js — Reorganiza el menú lateral del panel administrativo:
   encabezado compacto, títulos de sección y "Cerrar sesión" discreto.
   Incluir justo DESPUÉS de </aside>. No cambia ids, enlaces ni la lógica de roles de cada página. */
(function(){
  var sb=document.getElementById('sidebar')||document.querySelector('aside.sidebar');
  if(!sb||sb.classList.contains('bgu-sb'))return;
  sb.classList.add('bgu-sb');

  // 1) Encabezado: logo + nombre + botón contraer en una fila
  var brand=sb.querySelector('.brand-section'),btn=sb.querySelector('.collapse-btn');
  // Páginas sin botón de contraer (p. ej. Gestión de Clases): lo creamos y definimos toggleSidebar
  if(!btn){
    btn=document.createElement('div');btn.className='collapse-btn';btn.setAttribute('onclick','toggleSidebar()');
    btn.innerHTML='<i class="fa-solid fa-chevron-left" id="toggleIcon"></i>';
  }
  if(typeof window.toggleSidebar!=='function'){
    window.toggleSidebar=function(){
      sb.classList.toggle('collapsed');
      var ic=document.getElementById('toggleIcon');
      if(ic){ic.classList.toggle('fa-chevron-left');ic.classList.toggle('fa-chevron-right');}
    };
  }
  if(brand){
    var top=document.createElement('div');top.className='bgu-top';
    brand.parentNode.insertBefore(top,brand);
    top.appendChild(brand);
    if(btn&&btn.parentNode!==sb)sb.appendChild(btn);
    var bt=brand.querySelector('.brand-text');if(bt)bt.textContent='GlobalView';
    // La flecha refleja siempre el estado (abierto/contraído), aunque la página no cambie el ícono
    function syncArrow(){var ic=document.getElementById('toggleIcon');if(!ic)return;var col=sb.classList.contains('collapsed');ic.classList.toggle('fa-chevron-right',col);ic.classList.toggle('fa-chevron-left',!col);}
    new MutationObserver(syncArrow).observe(sb,{attributes:true,attributeFilter:['class']});syncArrow();
  }

  // 2) Títulos de sección + orden de los ítems
  var ul=sb.querySelector('.nav-list');
  if(ul){
    var SECS=[
      ['General',['administrativo.html']],
      ['Docentes',['gestion-docentes.html','gestion-expedientes.html','faculty-roster.html','reportes-docentes.html']],
      ['Académico',['gestion-cursos.html','academica-dashboard.html','gestion-asesoras.html']],
      ['Administración',['gestion-usuarios.html']],
      ['Firmas',['director-dashboard.html']]
    ];
    var items=[].slice.call(ul.children).filter(function(li){return li.querySelector&&li.querySelector('a.nav-link');});
    var others=[].slice.call(ul.children).filter(function(li){return items.indexOf(li)<0;});
    function hrefOf(li){return (li.querySelector('a.nav-link').getAttribute('href')||'').split('?')[0].split('/').pop();}
    var groups=[];var used=[];
    SECS.forEach(function(s){
      var lis=[];
      s[1].forEach(function(h){items.forEach(function(li){if(hrefOf(li)===h&&used.indexOf(li)<0){lis.push(li);used.push(li);}});});
      if(lis.length){var sec=document.createElement('li');sec.className='bgu-sec';sec.textContent=s[0];groups.push({sec:sec,lis:lis});}
    });
    var rest=items.filter(function(li){return used.indexOf(li)<0;});
    groups.forEach(function(g){ul.appendChild(g.sec);g.lis.forEach(function(li){ul.appendChild(li);});});
    rest.forEach(function(li){ul.appendChild(li);});
    others.forEach(function(li){ul.appendChild(li);});

    // Oculta el título si todos sus ítems están ocultos (los roles muestran/ocultan los <li> después)
    function refresh(){
      groups.forEach(function(g){
        var vis=g.lis.some(function(li){return getComputedStyle(li).display!=='none';});
        g.sec.style.display=vis?'':'none';
      });
    }
    refresh();
    new MutationObserver(refresh).observe(ul,{attributes:true,attributeFilter:['style','class'],subtree:true});
    window.addEventListener('load',refresh);
  }

  // 3) Cerrar sesión: enlace discreto al pie
  [].slice.call(sb.querySelectorAll('a.nav-link')).forEach(function(a){
    if(!ul||!ul.contains(a)){
      var oc=a.getAttribute('onclick')||'';
      if(/logout/i.test(oc)||/cerrar/i.test(a.textContent)){a.classList.add('bgu-logout');a.style.removeProperty('color');a.style.removeProperty('margin-top');}
    }
  });

  // 4) Íconos de trazo fino (en lugar de Font Awesome sólido) para que se vean ligeros
  function svg(p){var d=document.createElement('span');d.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';var s=d.firstChild;s.setAttribute('class','bgu-ic');return s;}
  var IC={
    'administrativo.html':'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    'gestion-docentes.html':'<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'gestion-expedientes.html':'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'faculty-roster.html':'<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="4" x2="9" y2="20"/>',
    'reportes-docentes.html':'<line x1="6" y1="20" x2="6" y2="11"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="14"/>',
    'gestion-cursos.html':'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    'academica-dashboard.html':'<rect x="3" y="4" width="18" height="12" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/>',
    'gestion-asesoras.html':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    'gestion-usuarios.html':'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    '__logout':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    '__logo':'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'
  };
  function swap(i,key){if(!i||!IC[key])return;i.parentNode.replaceChild(svg(IC[key]),i);}
  [].slice.call(sb.querySelectorAll('a.nav-link')).forEach(function(a){
    var i=a.querySelector('i');if(!i)return;
    if(a.classList.contains('bgu-logout')){swap(i,'__logout');return;}
    var h=(a.getAttribute('href')||'').split('?')[0].split('/').pop();swap(i,h);
  });
  var lg=sb.querySelector('.logo-box i');if(lg)swap(lg,'__logo');
})();

/* --- Responsive (celular): garantiza botón ☰, fondo oscuro y toggleMobileSidebar en todas las páginas --- */
(function(){
  var sb=document.getElementById('sidebar')||document.querySelector('aside.sidebar');
  if(!sb)return;
  if(typeof window.toggleMobileSidebar!=='function'){
    window.toggleMobileSidebar=function(){
      var s=document.getElementById('sidebar'),o=document.getElementById('sidebarOverlay');
      if(s)s.classList.toggle('show-mobile');
      if(o)o.classList.toggle('active');
    };
  }
  function init(){
    // Fondo oscuro
    if(!document.getElementById('sidebarOverlay')){
      var ov=document.createElement('div');ov.className='sidebar-overlay';ov.id='sidebarOverlay';
      ov.addEventListener('click',function(){window.toggleMobileSidebar();});
      document.body.insertBefore(ov,document.body.firstChild);
    }
    // Botón ☰ en el encabezado
    var h=document.querySelector('header');
    if(h&&!h.querySelector('.fa-bars')&&!h.querySelector('.bgu-burger')){
      var first=h.firstElementChild;
      var wrap=document.createElement('div');wrap.className='d-flex align-items-center gap-3';
      var b=document.createElement('button');b.type='button';b.className='btn border-0 p-0 d-md-none text-dark fs-4 bgu-burger';
      b.setAttribute('onclick','toggleMobileSidebar()');b.setAttribute('aria-label','Menú');
      b.innerHTML='<i class="fa-solid fa-bars"></i>';
      h.insertBefore(wrap,first);wrap.appendChild(b);if(first)wrap.appendChild(first);
    }
    // Al tocar una opción del menú en celular, se cierra
    sb.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a.nav-link');
      if(a&&sb.classList.contains('show-mobile')&&!a.classList.contains('bgu-logout')){sb.classList.remove('show-mobile');var o=document.getElementById('sidebarOverlay');if(o)o.classList.remove('active');}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
