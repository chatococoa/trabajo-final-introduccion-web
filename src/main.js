document.addEventListener('DOMContentLoaded', function() {
    const lista = document.querySelector('.lista-veterinarios');
    const veterinarios = document.querySelectorAll('.veterinario');
    const btnAnterior = document.querySelector('.flecha.anterior');
    const btnSiguiente = document.querySelector('.flecha.siguiente');
    const indicadores = document.querySelector('.indicadores');

    if (!lista || veterinarios.length === 0) return;

    let pagina = 0;
    let porPantalla = cantidadPorPantalla();
    let totalPaginas = Math.ceil(veterinarios.length / porPantalla);

    function cantidadPorPantalla() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 4;
    }

    function crearIndicadores() {
        indicadores.innerHTML = '';
        for (let i = 0; i < totalPaginas; i++) {
            const punto = document.createElement('button');
            punto.type = 'button';
            punto.setAttribute('aria-label', 'Página ' + (i + 1));
            punto.addEventListener('click', function() {
                pagina = i;
                mover();
            });
            indicadores.appendChild(punto);
        }
    }

    function mover() {
        const ancho = veterinarios[0].getBoundingClientRect().width;
        const espacio = parseFloat(getComputedStyle(lista).gap) || 0;
        lista.style.transform = 'translateX(-' + (pagina * porPantalla * (ancho + espacio)) + 'px)';

        const puntos = indicadores.querySelectorAll('button');
        for (let i = 0; i < puntos.length; i++) {
            if (i === pagina) {
                puntos[i].classList.add('actual');
            } else {
                puntos[i].classList.remove('actual');
            }
        }
    }

    btnAnterior.addEventListener('click', function() {
        if (pagina > 0) {
            pagina--;
            mover();
        }
    });

    btnSiguiente.addEventListener('click', function() {
        if (pagina < totalPaginas - 1) {
            pagina++;
            mover();
        }
    });

    window.addEventListener('resize', function() {
        porPantalla = cantidadPorPantalla();
        totalPaginas = Math.ceil(veterinarios.length / porPantalla);
        if (pagina >= totalPaginas) pagina = totalPaginas - 1;
        crearIndicadores();
        mover();
    });

    crearIndicadores();
    mover();
});