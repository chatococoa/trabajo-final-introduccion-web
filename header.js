const listaItems = document.querySelector('.collapse > ul');

if (estaLogeado()) {
    listaItems.innerHTML += `
        <li>
            <a href="admin.html">Panel Admin</a>
        </li>

        <li>
            <button class= "btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
        </li>
    `;

    document.getElementById('link-login').remove()
}