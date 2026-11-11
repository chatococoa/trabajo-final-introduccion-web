const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listaProfesionales = document.getElementById('lista-profesionales');

function renderVeterinarios() {

    listaProfesionales.innerHTML = '';

    veterinarios.forEach((veterinario) => {

        listaProfesionales.innerHTML += `
        <div class="col">
            <article class="card h-100 text-center">
                <img
                    src="${veterinario.imagen}"
                    class="card-img-top profesional-img"
                    alt="${veterinario.nombre}">

                <div class="card-body">
                    <h3>${veterinario.nombre}</h3>

                    <p>${veterinario.especializacion}</p>

                    <p>
                        $ ${veterinario.valorDeLaConsulta.toLocaleString('es-AR')}
                </p>
            </div>
        </article>
    </div>
    `;

    });
}

renderVeterinarios();