

if (!estaLogeado()) {
    window.location.href = 'login.html';
}

const historiasClinicas = JSON.parse(localStorage.getItem('historiaClinica')) || [];

const listaHistoriasClinicas = document.getElementById('lista-historiaClinica');

const total = document.getElementById('total');

const formulario = document.getElementById('form-historiaClinica');

const mascotasRegistradas = JSON.parse(localStorage.getItem('mascotas')) || [];

const veterinariosRegistrados = JSON.parse(localStorage.getItem('veterinarios')) || [];

const selectMascota = document.getElementById('mascota');

const filtroMascota = document.getElementById('filtroMascota');

const selectVeterinario = document.getElementById('veterinario');

const formularioEditar = document.getElementById('form-editar');

const modalEditar = new bootstrap.Modal(document.getElementById ('modal-editar'));

const selectEditarMascota = document.getElementById('editarMascota');

const selectEditarVeterinario = document.getElementById('editarVeterinario');

let idHistoriaClinicaEditar = null;

mascotasRegistradas.forEach((mascota) => {
    selectMascota.innerHTML += `
        <option value="${mascota.idMascota}">${mascota.nombreMascota}</option>
    `;
});

veterinariosRegistrados.forEach((veterinario) => {
    selectVeterinario.innerHTML += `
        <option value="${veterinario.idVeterinario}">${veterinario.nombre}</option>
    `;
});

mascotasRegistradas.forEach((mascota) => {
    selectEditarMascota.innerHTML += `
        <option value="${mascota.idMascota}">${mascota.nombreMascota}</option>
    `;
});

veterinariosRegistrados.forEach((veterinario) => {
    selectEditarVeterinario.innerHTML += `
        <option value="${veterinario.idVeterinario}">${veterinario.nombre}</option>
    `;
});

function cargarFiltroMascotas() {

    mascotasRegistradas.forEach((mascota) => {
        filtroMascota.innerHTML += `
            <option value="${mascota.idMascota}">${mascota.nombreMascota}</option>
        `;
    });
}

//cargar datos el ingresar a la web
function render() {
    // Limpiar datos para que no se dupliquen
    listaHistoriasClinicas.innerHTML = '';

    const mascotaSeleccionada = filtroMascota.value;

    const historiasFiltradas = historiasClinicas.filter((historiaClinica) => {
        return mascotaSeleccionada === '' || historiaClinica.mascota === mascotaSeleccionada;
    });

    // Ordenar las consultas desde la más antigua hasta la más reciente
    historiasFiltradas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

    historiasFiltradas.forEach((historiaClinica) => {

        const mascota = mascotasRegistradas.find((m) => m.idMascota === historiaClinica.mascota);

        const veterinario = veterinariosRegistrados.find((v) => v.idVeterinario === historiaClinica.veterinario);

        listaHistoriasClinicas.innerHTML += `
        <tr>
            <td>${mascota ? mascota.nombreMascota : 'No encontrada'}</td>

            <td>${veterinario ? veterinario.nombre : 'No encontrado'}</td>

            <td>${historiaClinica.fechaHora}</td>

            <td>${historiaClinica.observaciones}</td>

            <td>
                <button class="btn btn-warning btn-sm" onclick="editarHistoriaClinica('${historiaClinica.idHistoriaClinica}')">Editar</button>

                <button class="btn btn-danger btn-sm" onclick="eliminarHistoriaClinica('${historiaClinica.idHistoriaClinica}')">Eliminar</button>
            </td>
        </tr>
        `;
    });

    total.textContent = historiasClinicas.length;
}

cargarFiltroMascotas();

render();

filtroMascota.addEventListener('change', render);

function guardarDatosEnLocalStorage() {
    localStorage.setItem('historiaClinica', JSON.stringify(historiasClinicas));
}

function eliminarHistoriaClinica(id) {

    const confirmar = confirm('¿Desea eliminar Historia Clínica?');

    if (confirmar) {

        const posicion = historiasClinicas.findIndex((historiaClinica) => {
            return historiaClinica.idHistoriaClinica === id;
        });

        if (posicion !== -1) {

            historiasClinicas.splice(posicion, 1);

            guardarDatosEnLocalStorage();

            render();
        }
    }
}

function editarHistoriaClinica(id){
    idHistoriaClinicaEditar = id;

    const historiaClinica = historiasClinicas.find((historiaClinica) => historiaClinica.idHistoriaClinica === id);

    document.getElementById('editarMascota').value = historiaClinica.mascota;
    document.getElementById('editarVeterinario').value = historiaClinica.veterinario;
    document.getElementById('editarFechaHora').value = historiaClinica.fechaHora;
    document.getElementById('editarObservaciones').value = historiaClinica.observaciones;

    modalEditar.show();
}


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevaHistoriaClinica = {
        idHistoriaClinica: idHistoriaClinicaEditar || crypto.randomUUID(),

        //usar datos.get y pasar parámetros para capturar valores de la propiedad name 
        mascota: datos.get('mascota').trim(),
        veterinario: datos.get('veterinario').trim(),
        fechaHora: datos.get('fechaHora').trim(),
        observaciones: datos.get('observaciones').trim(),

    };

    if (idHistoriaClinicaEditar === null) {

        historiasClinicas.push(nuevaHistoriaClinica);

    } else {

        const posicion = historiasClinicas.findIndex((historiaClinica) => {
            return historiaClinica.idHistoriaClinica === idHistoriaClinicaEditar;
        });

        if (posicion !== -1) {
            historiasClinicas[posicion] = nuevaHistoriaClinica;
        }

        idHistoriaClinicaEditar = null;
    }

    guardarDatosEnLocalStorage();

    render();

    formulario.reset();
});

formularioEditar.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = new FormData(formularioEditar);
    const historiaClinica = historiasClinicas.find((historiaClinica) => historiaClinica.idHistoriaClinica === idHistoriaClinicaEditar);
    if (!historiaClinica) return;

    historiaClinica.mascota = datos.get('editarMascota').trim();
    historiaClinica.veterinario = datos.get('editarVeterinario').trim();
    historiaClinica.fechaHora = datos.get('editarFechaHora').trim();
    historiaClinica.observaciones = datos.get('editarObservaciones').trim();

    guardarDatosEnLocalStorage();

    render();

    modalEditar.hide();

    idHistoriaClinicaEditar = null;
});