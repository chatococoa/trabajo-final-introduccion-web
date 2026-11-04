

const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listaVeterinarios = document.getElementById('lista-veterinarios');

const total = document.getElementById('total');

const formulario = document.getElementById('form-veterinarios');

let idVeterinarioEditar = null;

//cargar datos el ingresar a la web
function render() {
    // limpiar datos al cargar la página para que los datos no se dupliquen
    listaVeterinarios.innerHTML = '';

    veterinarios.forEach( (veterinario) => {
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
         `
    });

    total.textContent = veterinarios.length;
};

render();

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

    const veterinario = veterinarios.find((veterinario) => {
        return veterinario.idVeterinario === id;
    });

    if (veterinario) {

        formulario.elements['matricula'].value = veterinario.matricula;
        formulario.elements['nombre'].value = veterinario.nombre;
        formulario.elements['especializacion'].value = veterinario.especializacion;
        formulario.elements['valorDeLaConsulta'].value = veterinario.valorDeLaConsulta;

        idVeterinarioEditar = id;


        formulario.scrollIntoView({ behavior: 'smooth' });
    }
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    console.log('El formulario de veterinarios se está ejecutando');

    const datos = new FormData(formulario);

    const nuevoVeterinario = {
        idVeterinario: idVeterinarioEditar || crypto.randomUUID(),

        //usar datos.get y pasar parámetros para capturar valores de la propiedad name 
        matricula: datos.get('matricula').trim(),
        nombre: datos.get('nombre').trim(),
        especializacion: datos.get('especializacion').trim(),
        valorDeLaConsulta: parseFloat(datos.get('valorDeLaConsulta')),
    };

     if (idVeterinarioEditar === null) {

        veterinarios.push(nuevoVeterinario);

    } else {

        const posicion = veterinarios.findIndex((veterinario) => {
            return veterinario.idVeterinario === idVeterinarioEditar;
        });

        if (posicion !== -1) {
            veterinarios[posicion] = nuevoVeterinario;
        }

        idVeterinarioEditar = null;
    }

    guardarDatosEnLocalStorage();

    render();

    formulario.reset();
});