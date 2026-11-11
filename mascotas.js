
if (!estaLogeado()) {
    window.location.href = 'login.html';
}

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];

const listaMascotas = document.getElementById('lista-mascotas');

const total = document.getElementById('total');

const formulario = document.getElementById('form-mascotas');

const formularioEditar = document.getElementById('form-editar');

const modalEditar = new bootstrap.Modal(document.getElementById ('modal-editar'));

let idMascotaEditar = null;

//cargar datos el ingresar a la web
function render() {
    // limpiar datos al cargar la página para que los datos no se dupliquen
    listaMascotas.innerHTML = '';

    mascotas.forEach( (mascota) => {

        console.log(mascota.imagen);

        listaMascotas.innerHTML += `
        <tr>
            <td>${mascota.nombreMascota}</td>

            <td>${mascota.nombreDuenio}</td>

            <td>${mascota.color}</td>

            <td>${mascota.edad}</td>

            <td>${mascota.peso}</td>

            <td>
            <img
                src="${mascota.imagen}"width="80" height="80" style="object-fit: cover;" alt="${mascota.nombreMascota}">
            </td>         

            <td>
                <button class="btn btn-warning btn-sm" onclick="editarMascota('${mascota.idMascota}')">Editar</button>

                <button class="btn btn-danger btn-sm" onclick="eliminarMascota('${mascota.idMascota}')">Eliminar</button>
            </td>
        </tr>
         `
    });

    total.textContent = mascotas.length;
};

render();

function guardarDatosEnLocalStorage() {
    localStorage.setItem('mascotas', JSON.stringify(mascotas))
}

function eliminarMascota(id) {

    const confirmar = confirm('¿Desea eliminar esta mascota?');

    if (confirmar) {

        const posicion = mascotas.findIndex((mascota) => {
            return mascota.idMascota === id;
        });

        if (posicion !== -1) {

            mascotas.splice(posicion, 1);

            guardarDatosEnLocalStorage();

            render();
        }
    }
}

function editarMascota(id){
    idMascotaEditar = id;

    const mascota = mascotas.find((mascota) => mascota.idMascota === id);

    document.getElementById('editarNombreDuenio').value = mascota.nombreDuenio;
    document.getElementById('editarNombreMascota').value = mascota.nombreMascota;
    document.getElementById('editarColor').value = mascota.color;
    document.getElementById('editarEdad').value = mascota.edad;
    document.getElementById('editarPeso').value = mascota.peso;

    modalEditar.show();
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const archivo = document.getElementById('ImagenMascota').files[0];

    const lector = new FileReader();

    lector.onload = function () {

        const nuevaMascota = {
            idMascota: crypto.randomUUID(),
            nombreDuenio: datos.get('nombreDuenio').trim(),
            nombreMascota: datos.get('nombreMascota').trim(),
            color: datos.get('color').trim(),
            edad: parseInt(datos.get('edad')),
            peso: parseFloat(datos.get('peso')),
            imagen: lector.result
        };

        console.log(nuevaMascota.imagen);

        mascotas.push(nuevaMascota);

        guardarDatosEnLocalStorage();
        render();
        formulario.reset();
    };

    if (archivo) {
        lector.readAsDataURL(archivo);
    }
});