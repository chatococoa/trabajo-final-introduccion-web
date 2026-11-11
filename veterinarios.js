

if (!estaLogeado()) {
    window.location.href = 'login.html';
}

const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listaVeterinarios = document.getElementById('lista-veterinarios');

const filtroEspecializacion = document.getElementById('filtroEspecializacion');

const total = document.getElementById('total');

const formulario = document.getElementById('form-veterinarios');

const formularioEditar = document.getElementById('form-editar');

const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));

const btnSubmit = document.getElementById('btn-submit-veterinario');

let idVeterinarioEditar = null;

function cargarEspecializaciones() {
    const seleccionActual = filtroEspecializacion.value;

    const especializaciones = [...new Set(veterinarios.map(v => v.especializacion))];

    filtroEspecializacion.innerHTML =
        '<option value="">Todas las especializaciones</option>';

    especializaciones.forEach((especializacion) => {
        filtroEspecializacion.value = seleccionActual;
        filtroEspecializacion.innerHTML += `
            <option value="${especializacion}">
                ${especializacion}
            </option>
        `;
    });
}

//cargar datos el ingresar a la web
function render() {

    listaVeterinarios.innerHTML = '';

    const especializacionSeleccionada = filtroEspecializacion.value;

    const veterinariosFiltrados = veterinarios.filter((veterinario) => {
        return especializacionSeleccionada === '' ||
               veterinario.especializacion === especializacionSeleccionada;
    });

    veterinariosFiltrados.forEach((veterinario) => {

        listaVeterinarios.innerHTML += `
        <tr>
            <td>${veterinario.matricula}</td>

            <td>${veterinario.nombre}</td>

            <td>${veterinario.especializacion}</td>

            <td>$ ${veterinario.valorDeLaConsulta.toLocaleString('es-AR')}</td>

            <td>
                <button class="btn btn-warning btn-sm" onclick="editarVeterinario('${veterinario.idVeterinario}')">Editar</button>

                <button type="button" class="btn btn-danger btn-sm" onclick="eliminarVeterinario('${veterinario.idVeterinario}')">Eliminar</button>
            </td>

        </tr>
        `;
    });

    total.textContent = veterinarios.length;
}

cargarEspecializaciones();

render();

filtroEspecializacion.addEventListener('change', render);

function guardarDatosEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios))
}

function eliminarVeterinario(id) {

    const confirmar = confirm('¿Desea eliminar este Veterinario?');

    if (confirmar) {

        const posicion = veterinarios.findIndex((veterinario) => {
            return veterinario.idVeterinario === id;
        });

        if (posicion !== -1) {

            veterinarios.splice(posicion, 1);

            guardarDatosEnLocalStorage();

            render();
        }
    }
}

function editarVeterinario(id) {

    idVeterinarioEditar = id;

    const veterinario = veterinarios.find((veterinario) => veterinario.idVeterinario === id);

    if (!veterinario) return;

    document.getElementById('editarMatricula').value = veterinario.matricula;

    document.getElementById('editarNombre').value = veterinario.nombre;

    document.getElementById('editarEspecializacion').value = veterinario.especializacion;

    document.getElementById('editarValorConsulta').value = veterinario.valorDeLaConsulta;

    modalEditar.show();
}


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const archivo = document.getElementById('imagen').files[0];

    const lector = new FileReader();

    lector.onload = function () {

        const nuevoVeterinario = {
            idVeterinario: idVeterinarioEditar || crypto.randomUUID(),
            matricula: datos.get('matricula').trim(),
            nombre: datos.get('nombre').trim(),
            especializacion: datos.get('especializacion').trim(),
            valorDeLaConsulta: parseFloat(datos.get('valorDeLaConsulta')),
            imagen: lector.result
        };

        veterinarios.push(nuevoVeterinario);

        guardarDatosEnLocalStorage();

        render();

        formulario.reset();

        console.log('Veterinario registrado:', nuevoVeterinario);
    };

    if (archivo) {
        lector.readAsDataURL(archivo);
    }
});


formularioEditar.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(formularioEditar);
    const veterinario = veterinarios.find((veterinario) => veterinario.idVeterinario === idVeterinarioEditar);

    if (!veterinario) return;

    veterinario.matricula = datos.get('editarMatricula').trim();

    veterinario.nombre = datos.get('editarNombre').trim();

    veterinario.especializacion = datos.get('editarEspecializacion').trim();

    veterinario.valorDeLaConsulta = parseFloat(datos.get('editarValorConsulta'));

    guardarDatosEnLocalStorage();

    render();

    modalEditar.hide();

    idVeterinarioEditar = null;
});