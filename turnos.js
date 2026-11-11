
//const token = sessionStorage.getItem('accessToken');

if (!estaLogeado()) {
    window.location.href = 'login.html';
}

const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

const listaTurnos = document.getElementById('lista-turnos');

const total = document.getElementById('total');

const formulario = document.getElementById('form-turnos');

const mascotasRegistradas = JSON.parse(localStorage.getItem('mascotas')) || [];

const veterinariosRegistrados = JSON.parse(localStorage.getItem('veterinarios')) || [];

const formularioEditar = document.getElementById('form-editar');

const modalEditar = new bootstrap.Modal(document.getElementById('modal-editar'));

const btnSubmit = document.getElementById('btn-submit-turno');

const selectMascota = document.getElementById('mascota');

const selectVeterinario = document.getElementById('veterinario');

const filtroVeterinario = document.getElementById('filtroVeterinario');

const selectEditarMascota = document.getElementById('editarMascota');

const selectEditarVeterinario = document.getElementById('editarVeterinario');

const costoConsulta = document.getElementById('costoConsulta');

const editarCostoConsulta = document.getElementById('editarCostoConsulta');

let idTurnoEditar = null;

mascotasRegistradas.forEach((mascota) => {
    selectMascota.innerHTML += `
        <option value="${mascota.idMascota}">
            ${mascota.nombreMascota}
        </option>
    `;
});

veterinariosRegistrados.forEach((veterinario) => {
    selectVeterinario.innerHTML += `
        <option value="${veterinario.idVeterinario}">
            ${veterinario.nombre}
        </option>
    `;
});

mascotasRegistradas.forEach((mascota) => {
    selectEditarMascota.innerHTML += `
        <option value="${mascota.idMascota}">
            ${mascota.nombreMascota}
        </option>
    `;
});

veterinariosRegistrados.forEach((veterinario) => {
    selectEditarVeterinario.innerHTML += `
        <option value="${veterinario.idVeterinario}">
            ${veterinario.nombre}
        </option>
    `;
});

function actualizarCostoEdicion() {

    const veterinario = veterinariosRegistrados.find((v) => v.idVeterinario === selectEditarVeterinario.value);

    editarCostoConsulta.value = veterinario ? '$ ' + veterinario.valorDeLaConsulta.toLocaleString('es-AR') : '';
}

selectEditarVeterinario.addEventListener('change', actualizarCostoEdicion);

function actualizarCostoConsulta() {

    const veterinario = veterinariosRegistrados.find((v) => v.idVeterinario === selectVeterinario.value);

    if (veterinario) {
        costoConsulta.value = '$ ' + veterinario.valorDeLaConsulta.toLocaleString('es-AR');
    } else {
        costoConsulta.value = '';
    }
}

selectVeterinario.addEventListener('change', actualizarCostoConsulta);

function cargarFiltroVeterinarios() {

    veterinariosRegistrados.forEach((veterinario) => {

        filtroVeterinario.innerHTML += `
            <option value="${veterinario.idVeterinario}">
                ${veterinario.nombre}
            </option>
        `;
    });
}

function render() {
 
    listaTurnos.innerHTML = '';

    const veterinarioSeleccionado = filtroVeterinario.value;

    const turnosFiltrados = turnos.filter((turno) => {
        return veterinarioSeleccionado === '' ||
           turno.veterinario === veterinarioSeleccionado;
    });

    turnosFiltrados.forEach((turno) => {
        const mascota = mascotasRegistradas.find((m) => m.idMascota === turno.mascota);

        const veterinario = veterinariosRegistrados.find((v) => v.idVeterinario === turno.veterinario);
        listaTurnos.innerHTML += `
        <tr>
            <td>${turno.fechaHora}</td>

            <td>${mascota ? mascota.nombreMascota : 'No encontrada'}</td>

            <td>${veterinario ? veterinario.nombre : 'No encontrado'}</td>

            <td>${veterinario ? '$ ' + veterinario.valorDeLaConsulta.toLocaleString('es-AR'): 'No disponible'}</td>

            <td>
                <button class="btn btn-warning btn-sm" onclick="editarTurno('${turno.idTurno}')">Editar</button>

                <button type="button" class="btn btn-danger btn-sm" onclick="eliminarTurno('${turno.idTurno}')">Eliminar</button>
            </td>

        </tr>
         `
    });

    total.textContent = turnos.length;
};

cargarFiltroVeterinarios();

render();

filtroVeterinario.addEventListener('change', render);

function guardarDatosEnLocalStorage() {
    localStorage.setItem('turnos', JSON.stringify(turnos))
}

function eliminarTurno(id) {

    const confirmar = confirm('¿Desea eliminar Turno?');

    if (confirmar) {

        const posicion = turnos.findIndex((turno) => {
            return turno.idTurno === id;
        });

        if (posicion !== -1) {

            turnos.splice(posicion, 1);

            guardarDatosEnLocalStorage();

            render();
        }
    }
}

function editarTurno(id){
    idTurnoEditar = id;

    const turno = turnos.find((turno) => turno.idTurno === id);

    document.getElementById('editarFechaHora').value = turno.fechaHora;
    document.getElementById('editarMascota').value = turno.mascota;
    document.getElementById('editarVeterinario').value = turno.veterinario;

    actualizarCostoEdicion();
    
    modalEditar.show();
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    console.log('El formulario de turnos se está ejecutando');

    const datos = new FormData(formulario);

    const nuevoTurno = {
        idTurno: idTurnoEditar || crypto.randomUUID(),

        //usar datos.get y pasar parámetros para capturar valores de la propiedad name 
        fechaHora: datos.get('fechaHora').trim(),
        mascota: datos.get('mascota').trim(),
        veterinario: datos.get('veterinario').trim(),
    };

     if (idTurnoEditar === null) {

        turnos.push(nuevoTurno);

    } else {

        const posicion = turnos.findIndex((turno) => {
            return turno.idTurno === idTurnoEditar;
        });

        if (posicion !== -1) {
            turnos[posicion] = nuevoTurno;
        }

        idTurnoEditar = null;
    }

    guardarDatosEnLocalStorage();

    render();

    formulario.reset();

    actualizarCostoConsulta();

    idTurnoEditar = null;
    
    btnSubmit.textContent = 'Agregar Turno';
});

formularioEditar.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formularioEditar);

    const turno = turnos.find((turno) => turno.idTurno === idTurnoEditar);

    if (!turno) return;

    turno.fechaHora = datos.get('editarFechaHora').trim();
    turno.mascota = datos.get('editarMascota').trim();
    turno.veterinario = datos.get('editarVeterinario').trim();

    guardarDatosEnLocalStorage();
    render();

    modalEditar.hide();
    idTurnoEditar = null;
});