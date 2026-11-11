function obtenerToken() {
    return sessionStorage.getItem('accessToken');
}

function estaLogeado() {
    return obtenerToken() !== null
}

function cerrarSesion() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('usuario');

    window.location.href = 'login.html'
}