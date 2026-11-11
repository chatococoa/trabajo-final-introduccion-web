if (!estaLogeado()) {
    window.location.href = 'login.html';
}

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
const historiaClinica = JSON.parse(localStorage.getItem('historiaClinica')) || [];

document.getElementById('nombre-usuario').textContent = sessionStorage.getItem('usuario');
document.getElementById('total-mascotas').textContent = mascotas.length + ' registradas';
document.getElementById('total-veterinarios').textContent = veterinarios.length + ' registrados';
document.getElementById('total-turnos').textContent = turnos.length + ' registrados';
document.getElementById('total-historiaClinica').textContent = historiaClinica.length + ' registradas';