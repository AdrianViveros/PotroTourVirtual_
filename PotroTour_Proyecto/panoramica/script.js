document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. PRELOADER Y SEGURIDAD
    // =========================================================
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        if (preloader) setTimeout(() => preloader.classList.add('hidden'), 500);
    });

    setTimeout(() => { 
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 5000); 

    // Bloqueos básicos de seguridad
    document.addEventListener('contextmenu', e => e.preventDefault()); 
    document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || (e.ctrlKey && ['u', 's', 'p'].includes(e.key.toLowerCase()))) {
            e.preventDefault();
        }
    });

    // =========================================================
    // 2. CONFIGURACIÓN INICIAL & DATOS
    // =========================================================
    console.log("--> Iniciando Tour UAEMex...");
    const esMovil = window.innerWidth <= 768;
    const zoomInicial = esMovil ? 90 : 100; 

    // --- A. DATOS DE LAS 9 ZONAS (DESCRIPCIONES) ---
    const datosZonas = [
        {
            titulo: "Entrada y Punto de Reunión",
            desc: "Vista desde la entrada en el primer punto de reunión con vista al edificio A y B."
        },
        {
            titulo: "Frente al Edificio B",
            desc: "Vista desde el segundo punto de reunión frente al edificio B con vista al camino al arcotecho."
        },
        {
            titulo: "Lateral Arcotecho y Edificio A",
            desc: "Vista desde un lado del arcotecho, con perspectiva hacia el Edificio A."
        },
        {
            titulo: "Centro del Arcotecho",
            desc: "Vista desde el centro del arcotecho con vista a las canchas y las gradas."
        },
        {
            titulo: "Estacionamiento (Edificio D)",
            desc: "Vista desde el estacionamiento, atrás del arcotecho y cerca del edificio D."
        },
        {
            titulo: "Edificio C y Biblioteca",
            desc: "Vista desde el punto de reunión enfrente del edificio C y biblioteca."
        },
        {
            titulo: "Frente al Edificio D",
            desc: "Vista situada enfrente del edificio D."
        },
        {
            titulo: "Esculturas y Biblioteca",
            desc: "Vista desde las esculturas de la pirámide, el Quetzalcóatl y a un lado de la biblioteca, con vista al arcotecho."
        },
        {
            titulo: "Cafetería y Tutorías",
            desc: "Vista desde el edificio de tutorías y la cafetería, con vista a las áreas verdes."
        }
    ];

    // --- B. CONEXIONES DE NAVEGACIÓN (FLECHAS) ---
    // Aquí es donde agregas los números que sacas con Ctrl+Clic
    const conexiones = {
        // ESCENA 0 (1.jpg) -> Conecta con la 2.jpg (escena1)
        "escena0": [
            { 
                "pitch": -1, 
                "yaw": -141, 
                "sceneId": "escena1", 
                "text": "Ir a Frente al Edificio B ➡" 
            }
        ],
        
        // ESCENA 1 (2.jpg) -> Aquí deberás poner las flechas para ir a la 3 (escena2) o volver a la 1 (escena0)
        "escena1": [
            // Ejemplo (borra o ajusta estos números cuando tengas los reales):
            // { "pitch": -5, "yaw": 180, "sceneId": "escena0", "text": "⬅ Regresar a Entrada" },
            // { "pitch": -5, "yaw": 0, "sceneId": "escena2", "text": "Ir a Arcotecho ➡" }
        ]
        
        // ... Continúa configurando las demás escenas (escena2, escena3, etc.)
    };

    // =========================================================
    // 3. GENERACIÓN DE ESCENAS
    // =========================================================
    const listaFotos = [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", 
        "6.jpg", "7.jpg", "8.jpg", "9.jpg"
    ];
    
    const escenas = {};
    const listaBotones = document.getElementById('lista-escenas');
    const carpeta = "recursos/"; 

    listaFotos.forEach((nombreArchivo, index) => {
        const idEscena = `escena${index}`;
        
        // Obtenemos título y descripción de la lista
        const infoZona = datosZonas[index] || { titulo: `Zona ${index + 1}`, desc: "Información no disponible." };

        // 1. Tapas (Hotspots fijos)
        let misHotSpots = [
            { "pitch": 90, "yaw": 0, "cssClass": "tapa-polo", "scale": true },
            { "pitch": -90, "yaw": 0, "cssClass": "tapa-polo", "scale": true }
        ];

        // 2. Flechas de navegación (si existen en 'conexiones')
        if (conexiones[idEscena]) {
            conexiones[idEscena].forEach(flecha => {
                misHotSpots.push({
                    "pitch": flecha.pitch,
                    "yaw": flecha.yaw,
                    "type": "scene",
                    "sceneId": flecha.sceneId,
                    "text": flecha.text
                });
            });
        }

        escenas[idEscena] = {
            "title": infoZona.titulo, 
            "type": "equirectangular", 
            "panorama": carpeta + nombreArchivo,
            "autoLoad": false, 
            "haov": 360, "vaov": 65, "vOffset": 0,
            "hfov": zoomInicial, "minHfov": 50, "maxHfov": 100, 
            "hotSpots": misHotSpots 
        };

        // Crear botones del menú lateral
        if (listaBotones) {
            const btn = document.createElement('button');
            btn.className = 'btn-escena';
            btn.id = `btn-${idEscena}`;
            btn.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${infoZona.titulo}`;
            btn.onclick = () => {
                detenerAutoTour();
                cargarEscena(idEscena, btn);
            };
            listaBotones.appendChild(btn);
            if (index === 0) btn.classList.add('activo');
        }
    });

    // =========================================================
    // 4. INICIALIZAR PANNELLUM
    // =========================================================
    let visor;
    try {
        visor = pannellum.viewer('panorama', {
            "default": {
                "firstScene": "escena0",
                "sceneFadeDuration": 2500,
                "autoRotate": -2,
                "autoRotateInactivity": 5000,
                "showZoomCtrl": false,
                "compass": false,
                "touchPanSpeedCoeffFactor": 1,
                "backgroundColor": [30, 30, 30], 
                "strings": {
                    "loadButtonLabel": "👆 Toca para ver la zona", 
                    "loadingLabel": "Cargando...",
                    "errorMsg": "Error al cargar la imagen."
                }
            },
            "scenes": escenas
        });
    } catch (e) { console.error("Error al iniciar visor:", e); }

    function cargarEscena(id, btnElement) {
        if (visor) {
            visor.loadScene(id);
            document.querySelectorAll('.btn-escena').forEach(b => b.classList.remove('activo'));
            
            if (!btnElement) btnElement = document.getElementById(`btn-${id}`);
            if(btnElement) {
                btnElement.classList.add('activo');
                btnElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }

    // =========================================================
    // 5. FUNCIONES DE INTERFAZ
    // =========================================================
    
    // --- MODAL INFO ---
    const btnInfo = document.getElementById('btn-info');
    const modalInfo = document.getElementById('modal-info');
    const btnCerrarModal = document.getElementById('btn-cerrar-info');
    const txtTitulo = document.getElementById('modal-titulo');
    const txtCuerpo = document.getElementById('modal-texto');

    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            if (!visor) return;
            detenerAutoTour();
            
            const sceneId = visor.getScene();
            const index = parseInt(sceneId.replace('escena', ''));
            const info = datosZonas[index];

            if (info) {
                txtTitulo.innerText = info.titulo;
                txtCuerpo.innerText = info.desc;
                modalInfo.classList.remove('hidden');
            }
        });
    }
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', () => modalInfo.classList.add('hidden'));
    if (modalInfo) modalInfo.addEventListener('click', (e) => { if (e.target === modalInfo) modalInfo.classList.add('hidden'); });

    // --- BARRA INSTRUCCIONES ---
    window.cerrarBarra = function() { 
        const barra = document.getElementById('barra-instrucciones');
        if (barra) {
            barra.classList.add('oculta');
            setTimeout(() => { barra.style.display = 'none'; }, 500);
        }
    }
    setTimeout(window.cerrarBarra, 15000);

    // --- AUTO-TOUR ---
    const btnAutoTour = document.getElementById('btn-auto-tour');
    let tourInterval = null;
    let tourActivo = false;

    if (btnAutoTour) {
        btnAutoTour.addEventListener('click', () => {
            if (tourActivo) detenerAutoTour();
            else iniciarAutoTour();
        });
    }

    function iniciarAutoTour() {
        if (!visor) return;
        tourActivo = true;
        btnAutoTour.innerHTML = '<i class="fas fa-pause"></i>'; 
        btnAutoTour.classList.add('tour-activo');
        btnAutoTour.title = "Detener Auto-Tour";
        
        const siguienteEscena = () => {
            if (!tourActivo) return;
            const escenaActual = visor.getScene();
            let indexActual = parseInt(escenaActual.replace('escena', ''));
            let siguienteIndex = indexActual + 1;
            if (siguienteIndex >= listaFotos.length) siguienteIndex = 0;
            cargarEscena(`escena${siguienteIndex}`);
        };
        tourInterval = setInterval(siguienteEscena, 10000); 
    }

    function detenerAutoTour() {
        tourActivo = false;
        clearInterval(tourInterval);
        if (btnAutoTour) {
            btnAutoTour.innerHTML = '<i class="fas fa-play"></i>'; 
            btnAutoTour.classList.remove('tour-activo');
            btnAutoTour.title = "Iniciar Auto-Tour";
        }
    }

    // --- GIROSCOPIO ---
    const btnGyro = document.getElementById('btn-gyro');
    let gyroActivo = false; 
    if (btnGyro) {
        btnGyro.addEventListener('click', () => {
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(r => { if (r === 'granted') alternarGiroscopio(); })
                    .catch(console.error);
            } else { alternarGiroscopio(); }
        });
    }
    function alternarGiroscopio() {
        if (!gyroActivo) {
            visor.startOrientation();
            btnGyro.classList.add('gyro-on');
            btnGyro.innerHTML = '<i class="fas fa-check-circle"></i> Giroscopio: ON';
            gyroActivo = true;
        } else {
            visor.stopOrientation();
            btnGyro.classList.remove('gyro-on');
            btnGyro.innerHTML = '<i class="fas fa-mobile-alt"></i> Activar Giroscopio';
            gyroActivo = false;
        }
    }

    // =========================================================
    // 6. HERRAMIENTA DE DESARROLLO (SOLO PARA TI)
    // =========================================================
    const contenedorPano = document.getElementById('panorama');
    if (contenedorPano) {
        contenedorPano.addEventListener('mousedown', (e) => {
            if (e.ctrlKey && visor) {
                const p = Math.floor(visor.getPitch());
                const y = Math.floor(visor.getYaw());
                alert(`¡Coordenadas!\nPitch: ${p}\nYaw: ${y}`);
            }
        });
    }

    console.log("--> Sistema Listo 🚀");
});