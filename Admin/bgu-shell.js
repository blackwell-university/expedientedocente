
/** Redirige al login si no hay sesión o el rol no está permitido. */
function bguGuard(rolesPermitidos) {
    const ok = localStorage.getItem('isLoggedIn') === 'true';
    const rol = localStorage.getItem('userRole');
    const permitido = typeof rolesPermitidos === 'function'
        ? rolesPermitidos(rol)
        : rolesPermitidos.includes(rol);
    if (!ok || !permitido) window.location.href = '../index.html';
}

/** Abre/cierra el menú lateral en móvil. */
function toggleMobileSidebar() {
    document.getElementById('sidebar').classList.toggle('show-mobile');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}

/** Pide confirmación y cierra la sesión. */
function logout(textoPortal) {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Vas a salir del ' + (textoPortal || 'portal') + '.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: { popup: 'rounded-4' }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = '../index.html';
        }
    });
}
