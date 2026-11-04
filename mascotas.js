

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];

const listaMascotas = document.getElementById('lista-mascotas');

const total = document.getElementById('total');

const formulario = document.getElementById('form-mascotas');

let idMascotaEditar = null;

//cargar datos el ingresar a la web
function render() {
    // limpiar datos al cargar la página para que los datos no se dupliquen
    listaMascotas.innerHTML = '';

    mascotas.forEach( (mascota) => {
        listaMascotas.innerHTML += `
        <tr>
            <td>${mascota.nombreDuenio}</td>

            <td>${mascota.nombreMascota}</td>

            <td>${mascota.color}</td>

            <td>${mascota.edad}</td>

            <td>${mascota.peso}</td>

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

function editarMascota(id) {

    const mascota = mascotas.find((mascota) => {
        return mascota.idMascota === id;
    });

    if (mascota) {

        formulario.elements['nombreDuenio'].value = mascota.nombreDuenio;
        formulario.elements['nombreMascota'].value = mascota.nombreMascota;
        formulario.elements['color'].value = mascota.color;
        formulario.elements['edad'].value = mascota.edad;
        formulario.elements['peso'].value = mascota.peso;

        idMascotaEditar = id;


        formulario.scrollIntoView({ behavior: 'smooth' });
    }
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevaMascota = {
        idMascota: idMascotaEditar || crypto.randomUUID(),

        //usar datos.get y pasar parámetros para capturar valores de la propiedad name 
        nombreDuenio: datos.get('nombreDuenio').trim(),
        nombreMascota: datos.get('nombreMascota').trim(),
        color: datos.get('color').trim(),
        edad: parseInt(datos.get('edad')),
        peso: parseFloat(datos.get('peso'))
    };

    if (idMascotaEditar === null) {

        mascotas.push(nuevaMascota);

    } else {

        const posicion = mascotas.findIndex((mascota) => {
            return mascota.idMascota === idMascotaEditar;
        });

        if (posicion !== -1) {
            mascotas[posicion] = nuevaMascota;
        }

        idMascotaEditar = null;
    }

    guardarDatosEnLocalStorage();

    render();

    formulario.reset();
});