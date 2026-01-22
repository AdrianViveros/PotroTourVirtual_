document.addEventListener('DOMContentLoaded', () => {
    console.log("--> CU Zumpango Virtual: Iniciado");
    console.log("--> FontAwesome y Estilos cargados");

    // Lógica para el botón de inicio (Llevar al mapa o iniciar tour 3D)
    const btnIniciar = document.getElementById('btn-iniciar');

    if (btnIniciar) {
        btnIniciar.addEventListener('click', () => {
            // Ejemplo: Al dar clic, bajamos suavemente a la sección de mapa o carreras
            const seccionMapa = document.getElementById('mapa');
            if(seccionMapa) {
                seccionMapa.scrollIntoView({ behavior: 'smooth' });
                console.log("Desplazando al mapa...");
            } else {
                alert("¡Bienvenido! Cargando el mapa virtual...");
            }
        });
    }
    
    // Aquí agregaremos luego la lógica para los botones de las carreras
    const tarjetasCarreras = document.querySelectorAll('.carrera-card');
    tarjetasCarreras.forEach(card => {
        card.addEventListener('click', (e) => {
            // Obtenemos el nombre de la carrera del span dentro de la tarjeta
            const nombreCarrera = card.querySelector('span').innerText;
            console.log(`Usuario seleccionó la carrera: ${nombreCarrera}`);
            // Aquí filtraremos el mapa más adelante
        });
    });
});