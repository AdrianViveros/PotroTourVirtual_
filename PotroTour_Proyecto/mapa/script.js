document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. PRELOADER
    // =========================================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Opción A: Esperar a que cargue todo
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500); 
        });

        // Opción B: Seguridad (si tarda mucho, quitarlo a los 5 seg)
        setTimeout(() => {
            if (!preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
            }
        }, 5000); 
    }

    console.log("--> CU Zumpango Virtual: Iniciado");


    // =========================================================
    // 2. SEGURIDAD (ANTI-COPIA)
    // =========================================================
    document.addEventListener('contextmenu', e => e.preventDefault()); // Bloquea click derecho
    
    // Bloqueo de teclas de inspección
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['c','x','u','s','p'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
        if (e.key === 'F12') e.preventDefault();
    });

    document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));


    // =========================================================
    // 3. LOGICA DEL MAPA 2D (PIXEL ART)
    // =========================================================
    const contenedorMapa = document.getElementById('contenedorMapaPrincipal');
    const mapViewport = document.getElementById('mapViewport');
    const mapWrapper = document.getElementById('mapWrapper');
    const baseMapImg = document.getElementById('base-map');

    if (mapViewport && mapWrapper) {
        
        // --- 3.1 Base de Datos de Lugares (INFO DETALLADA) ---
        const pathPrefix = ''; 

        const datosLugares = {
            "edificioa": { 
                titulo: "Edificio A - Administrativo", 
                asset: pathPrefix + "recursos/edificioa.png", 
                real: pathPrefix + "recursos/edificioa_real.jpg", 
                descripcion: `
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-down"></i> Piso Inferior:</strong>
                        <ul>
                            <li>Control Escolar y Dirección</li>
                            <li>Difusión Cultural y Coord. de Egresados</li>
                            <li>Papelería y Baños</li>
                            <li>Aulas de estudio y Salones de tutoría</li>
                        </ul>
                    </div>
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-up"></i> Piso Superior:</strong>
                        <ul>
                            <li>Centro de Atención Psicológica (CAPSI)</li>
                            <li>Carreras: Derecho, Ciencias Políticas, Sociología</li>
                            <li>Aulas de estudio y Baños</li>
                        </ul>
                    </div>`
            },
            "edificiob": { 
                titulo: "Edificio B - Multidisciplinario", 
                asset: pathPrefix + "recursos/edificiob.png", 
                real: pathPrefix + "recursos/edificiob_real.jpg", 
                descripcion: `
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-down"></i> Piso Inferior:</strong>
                        <ul>
                            <li>Salones de Psicología e Ing. en Computación</li>
                            <li>Auditorio Principal</li>
                            <li>Papelería y Baños</li>
                            <li>Estación de Snacks Saludables</li>
                        </ul>
                    </div>
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-up"></i> Piso Superior:</strong>
                        <ul>
                            <li>Salones de Enfermería, Administración y Contaduría</li>
                            <li>Sala de Maestros y Baños</li>
                        </ul>
                    </div>`
            },
            "edificioc": { 
                titulo: "Edificio C - Cómputo e Idiomas", 
                asset: pathPrefix + "recursos/edificioc.png", 
                real: pathPrefix + "recursos/edificioc_real.jpeg", 
                descripcion: `
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-down"></i> Piso Inferior:</strong>
                        <ul>
                            <li>Salones de Diseño Industrial</li>
                            <li>Cómputo de Ing. en Computación</li>
                            <li>Aulas de estudio y Baños</li>
                        </ul>
                    </div>
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-up"></i> Piso Superior:</strong>
                        <ul>
                            <li>Salones de Cómputo y CELE (Idiomas)</li>
                            <li>Coordinación de Psicología</li>
                            <li>Cámara de Gesell</li>
                        </ul>
                    </div>`
            },
            "edificiod": { 
                titulo: "Edificio D - Laboratorios", 
                asset: pathPrefix + "recursos/edificiod.png", 
                real: pathPrefix + "recursos/edificiod_real.jpg", 
                descripcion: `
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-down"></i> Piso Inferior:</strong>
                        <ul>
                            <li>Sala de Juicios Orales</li>
                            <li>Espacio para Área de Diseño</li>
                            <li>Baños y Lockers</li>
                        </ul>
                    </div>
                    <div class="info-piso">
                        <strong><i class="fas fa-arrow-up"></i> Piso Superior:</strong>
                        <ul>
                            <li>Laboratorios de Ing. en Computación y Enfermería</li>
                            <li>Aulas de Enfermería y Baños</li>
                        </ul>
                    </div>`
            },
            "biblioteca": { 
                titulo: "Biblioteca “Wenceslao Labra”", 
                asset: pathPrefix + "recursos/biblioteca.png", 
                real: pathPrefix + "recursos/biblioteca_real.jpeg", 
                descripcion: `
                    <ul>
                        <li>Cubículos de estudio individual y grupal</li>
                        <li>Biblioteca Digital y Sala de Cómputo</li>
                        <li>Libros separados por áreas de conocimiento</li>
                        <li>Módulo de atención y Préstamo interno con credencial</li>
                    </ul>`
            },
            "cancha": { 
                titulo: "Arcotecho Deportivo", 
                asset: pathPrefix + "recursos/cancha.png", 
                real: pathPrefix + "recursos/arcotecho_real.jpeg", 
                descripcion: `
                    <ul>
                        <li>2 Canchas Multiusos (Básquetbol, Fútbol, Voleibol)</li>
                        <li>Gradas y Alumbrado</li>
                        <li>Tienda y Lugar de descanso para estudiantes</li>
                        <li>Puntos de reciclaje</li>
                    </ul>`
            },
            "cafeteria": { 
                titulo: "Cafetería Universitaria", 
                asset: pathPrefix + "recursos/cafeteria.png", 
                real: pathPrefix + "recursos/cafeteria_real.jpg", 
                descripcion: "<p>Zona de alimentación con mostrador, cocina equipada, y área de mesas y sillas para convivencia.</p>" 
            },
            "tutorias": { 
                titulo: "Edificio de Tutorías", 
                asset: pathPrefix + "recursos/tutorias.png", 
                real: pathPrefix + "recursos/tutorias_real.jpeg", 
                descripcion: "<p>Espacio dedicado exclusivamente para las áreas de tutoría académica y seguimiento estudiantil.</p>" 
            },
            "estatua": { 
                titulo: "Esculturas y Monumentos", 
                asset: pathPrefix + "recursos/estatua.png", 
                real: pathPrefix + "recursos/estatua_real.jpg", 
                descripcion: "<p>Expresiones artísticas que embellecen el campus, representando el orgullo y la identidad universitaria de los Potros.</p>" 
            },
            "elementos": { 
                titulo: "Esculturas", 
                asset: pathPrefix + "recursos/elementos.png", 
                real: pathPrefix + "recursos/estatua2.jpg", 
                descripcion: "<p>Espacio cultural al aire libre que rinde homenaje a nuestras raíces. Cuenta con representaciones artísticas de una pirámide y la serpiente emplumada (Quetzalcóatl), integrando la identidad histórica con la vida universitaria.</p>" 
            },
            "gimnacio": { 
                titulo: "Gimnasio al Aire Libre", 
                asset: pathPrefix + "recursos/gimnacio.png", 
                real: pathPrefix + "recursos/gim_real.jpg", 
                descripcion: "<p>Zona de aparatos de ejercicio al aire libre para fomentar la salud física de la comunidad universitaria.</p>" 
            }
        };

        // --- 3.2 Centrado Automático ---
        const centerMap = () => {
            if (mapWrapper && mapViewport) {
                const scrollX = (mapWrapper.offsetWidth - mapViewport.offsetWidth) / 2;
                const scrollY = (mapWrapper.offsetHeight - mapViewport.offsetHeight) / 2;
                if (scrollX > 0) mapViewport.scrollLeft = scrollX;
                if (scrollY > 0) mapViewport.scrollTop = scrollY;
            }
        };

        if (baseMapImg) {
            if (baseMapImg.complete) {
                setTimeout(centerMap, 100);
            } else {
                baseMapImg.onload = () => setTimeout(centerMap, 100);
            }
        }
        window.addEventListener('resize', centerMap);


        // --- 3.3 Pantalla Completa (Fullscreen) ---
        const btnFullscreen = document.getElementById('btnFullscreen');
        if (btnFullscreen && contenedorMapa) {
            const iconFs = btnFullscreen.querySelector('i');
            
            btnFullscreen.addEventListener('click', () => {
                contenedorMapa.classList.toggle('fullscreen-mode');
                const isFs = contenedorMapa.classList.contains('fullscreen-mode');
                
                if (isFs) {
                    iconFs.classList.replace('fa-expand', 'fa-compress');
                    document.body.style.overflow = 'hidden'; 
                } else {
                    iconFs.classList.replace('fa-compress', 'fa-expand');
                    document.body.style.overflow = ''; 
                }
                setTimeout(centerMap, 300);
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && contenedorMapa.classList.contains('fullscreen-mode')) {
                    btnFullscreen.click();
                }
            });
        }


        // --- 3.4 Pista Visual "Arrastra" ---
        const hint = document.getElementById('gestureHint');
        const hideHint = () => {
            if (hint) {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 600);
            }
        };
        mapViewport.addEventListener('mousedown', hideHint, { once: true });
        mapViewport.addEventListener('touchstart', hideHint, { once: true });


        // --- 3.5 Lógica de Arrastre (Drag) ---
        let isDown = false;
        let startX, startY, scrollLeft, scrollTop;

        const startDrag = (e) => {
            isDown = true;
            mapViewport.classList.add('active');
            const pageX = e.pageX || e.touches[0].pageX;
            const pageY = e.pageY || e.touches[0].pageY;
            startX = pageX - mapViewport.offsetLeft;
            startY = pageY - mapViewport.offsetTop;
            scrollLeft = mapViewport.scrollLeft;
            scrollTop = mapViewport.scrollTop;
        };

        const stopDrag = () => {
            isDown = false;
            mapViewport.classList.remove('active');
        };

        const moveDrag = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const pageX = e.pageX || e.touches[0].pageX;
            const pageY = e.pageY || e.touches[0].pageY;
            const x = pageX - mapViewport.offsetLeft;
            const y = pageY - mapViewport.offsetTop;
            
            const walkX = (x - startX) * 1.5;
            const walkY = (y - startY) * 1.5;
            
            mapViewport.scrollLeft = scrollLeft - walkX;
            mapViewport.scrollTop = scrollTop - walkY;
        };

        mapViewport.addEventListener('mousedown', startDrag);
        mapViewport.addEventListener('mouseleave', stopDrag);
        mapViewport.addEventListener('mouseup', stopDrag);
        mapViewport.addEventListener('mousemove', moveDrag);
        mapViewport.addEventListener('touchstart', startDrag, {passive: false});
        mapViewport.addEventListener('touchend', stopDrag);
        mapViewport.addEventListener('touchmove', moveDrag, {passive: false});


        // --- 3.6 Modal Popup + VISOR FULLSCREEN ---
        const modal = document.getElementById('modal-info');
        const modalTitle = document.getElementById('modal-titulo');
        const modalBody = document.querySelector('.modal-body');
        const closeBtn = document.querySelector('.close-btn');

        // Variables del Lightbox (Visor)
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');

        // Función para detectar orientación de imagen
        window.detectarOrientacion = function(img) {
            if (img.naturalHeight > img.naturalWidth) {
                img.parentElement.classList.add('vertical');
                img.parentElement.classList.remove('horizontal');
            } else {
                img.parentElement.classList.add('horizontal');
                img.parentElement.classList.remove('vertical');
            }
        };

        document.querySelectorAll('.map-overlay').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isDown) return; // Si arrastra, no abre

                const id = icon.getAttribute('data-id');
                const data = datosLugares[id];

                if (data) {
                    modalTitle.innerText = data.titulo;
                    
                    // Inyección de HTML
                    modalBody.innerHTML = `
                        <div class="modal-images-grid">
                            <div class="img-card">
                                <img src="${data.asset}" onload="detectarOrientacion(this)" alt="Virtual">
                                <span class="label-img"><i class="fas fa-cube"></i> Virtual</span>
                            </div>
                            <div class="img-card real zoomable" title="Toca para ampliar">
                                <img src="${data.real}" id="img-real-target" onload="detectarOrientacion(this)" onerror="this.onerror=null; this.src='${pathPrefix}recursos/mascota2.png'; console.log('Error imagen:', '${data.real}');" alt="Real">
                                <span class="label-img"><i class="fas fa-camera"></i> Real (Ver en grande)</span>
                            </div>
                        </div>
                        <div class="desc-text-scroll">
                            ${data.descripcion}
                        </div>
                    `;
                    modal.classList.add('active');

                    // --- ACTIVAR VISOR AL CLIC EN FOTO REAL ---
                    const imgReal = document.getElementById('img-real-target');
                    if (imgReal) {
                        imgReal.addEventListener('click', () => {
                            lightboxImg.src = imgReal.src; // Pasa la foto al visor
                            lightbox.classList.add('active');
                        });
                    }
                }
            });
        });

        // Cerrar Modal
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // --- LÓGICA DEL VISOR (CERRAR) ---
        if (lightbox) {
            // Cerrar con X
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
                setTimeout(() => { lightboxImg.src = ''; }, 300); // Limpiar
            });
            // Cerrar clic afuera
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.classList.remove('active');
            });
            // Cerrar con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    lightbox.classList.remove('active');
                }
            });
        }
    }


    // =========================================================
    // 4. MAPA REAL (Leaflet / OSM)
    // =========================================================
    if (document.getElementById('map-osm')) {
        const lat = 19.8282409;
        const lng = -99.0768595;
        
        const mapReal = L.map('map-osm', {
            scrollWheelZoom: false,
            dragging: !L.Browser.mobile 
        }).setView([lat, lng], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapReal);

        L.marker([lat, lng]).addTo(mapReal)
            .bindPopup('<div style="text-align:center;"><b>CU UAEM Zumpango</b><br>¡Bienvenidos Potros!</div>')
            .openPopup();
    }


    // =========================================================
    // 5. CHATBOT FLOTANTE
    // =========================================================
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => chatWindow.classList.toggle('active'));
        if (closeChat) closeChat.addEventListener('click', () => chatWindow.classList.remove('active'));
    }

    function botReply(text) {
        const t = text.toLowerCase();
        let r = "¡Hola! Soy el Asistente Potro. 🐴 Explora el mapa tocando los edificios.";
        
        if (t.includes('ubicacion') || t.includes('llegar')) {
            r = "Estamos en Camino Viejo a Jilotzingo. Revisa el mapa de abajo para la ruta.";
        } else if (t.includes('tramite')) {
            r = "Para trámites escolares, dirígete al **Edificio A** (Administrativo).";
        } else if (t.includes('gracias')) {
            r = "¡De nada! Disfruta tu visita virtual. 💚💛";
        }
        addMessage(r, 'bot-message');
    }

    function addMessage(text, type) {
        const div = document.createElement('div');
        div.classList.add('message', type);
        div.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const txt = chatInput.value.trim();
            if(!txt) return;
            addMessage(txt, 'user-message');
            chatInput.value = '';
            setTimeout(() => botReply(txt), 800);
        });
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendBtn.click();
        });
    }
});