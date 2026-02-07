document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. PRELOADER (NUEVO) ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Opción A: Esperar a que cargue toda la ventana (imágenes incluidas)
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500); // Pequeño retraso para que se vea la animación
        });

        // Opción de seguridad: Si tarda mucho (por internet lento), quitarlo a los 3 seg
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 5000); 
    }

    console.log("--> CU Zumpango Virtual: Iniciado");

    // =========================================
    // 1. MENÚ MÓVIL (HAMBURGUESA)
    // =========================================
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // =========================================
    // 2. SCROLL SUAVE (BOTÓN INICIAR)
    // =========================================
    const btnIniciar = document.getElementById('btn-iniciar');
    if (btnIniciar) {
        btnIniciar.addEventListener('click', () => {
            const seccionMapa = document.getElementById('mapa');
            if(seccionMapa) {
                seccionMapa.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // =========================================
    // 3. ANIMACIONES 3D (TILT EN TARJETAS MAPA)
    // =========================================
    const tarjetasOpcion = document.querySelectorAll('.opcion-card');
    
    // Observer para que aparezcan al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aparecer');
            }
        });
    }, { threshold: 0.2 });

    tarjetasOpcion.forEach(card => observer.observe(card));

    // Efecto Tilt (Seguir al mouse)
    tarjetasOpcion.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            // Calcular rotación
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

            // Efecto brillo
            const brillo = card.querySelector('.efecto-brillo');
            if (brillo) {
                brillo.style.opacity = '1';
                brillo.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3), transparent 60%)`;
            }
        });

        // Resetear al salir
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            const brillo = card.querySelector('.efecto-brillo');
            if (brillo) brillo.style.opacity = '0';
        });
    });

    // =========================================
    // 4. EFECTO DE ESCRITURA (TYPEWRITER)
    // =========================================
    const elementoTexto = document.getElementById('texto-maquina');
    if (elementoTexto) {
        const textoCompleto = "Tu guía interactiva para ubicar salones, laboratorios y servicios sin perderte en el campus.";
        let indice = 0;
        
        function escribir() {
            if (indice < textoCompleto.length) {
                elementoTexto.innerHTML += textoCompleto.charAt(indice);
                indice++;
                setTimeout(escribir, 30); 
            } else {
                elementoTexto.style.borderRight = "none";
            }
        }
        // Iniciar con un pequeño retraso
        setTimeout(escribir, 1000); 
    }

    // =========================================
    // 5. LÓGICA DE PESTAÑAS (MISIÓN/VISIÓN)
    // =========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.content-block');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar clase activa
            tabBtns.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Activar actual
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // =========================================
    // 6. SEGURIDAD (ANTI-COPIA)
    // =========================================
    // Bloquear clic derecho
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Bloquear atajos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'c': case 'x': case 'u': case 's': case 'p':
                    e.preventDefault(); 
                    break;
            }
        }
        if (e.key === 'F12') e.preventDefault();
    });

    // Bloquear arrastre de imágenes
    document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));


    // =========================================
    // 7. CHATBOT "POTROBOT" (LÓGICA MEJORADA)
    // =========================================
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    // --- A. Abrir/Cerrar Chat ---
    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            // Ocultar notificación roja
            const badge = chatToggle.querySelector('.notification-badge');
            if(badge) badge.style.display = 'none';
        });

        if (closeChat) {
            closeChat.addEventListener('click', () => {
                chatWindow.classList.remove('active');
            });
        }
    }

    // --- B. Funciones de Mensajería ---
    
    function sendMessage() {
        const text = chatInput.value.trim();
        if (text === "") return;

        // 1. Mostrar mensaje del usuario
        addMessage(text, 'user-message');
        chatInput.value = "";

        // 2. Simular espera y responder
        setTimeout(() => {
            botReply(text);
        }, 600);
    }

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.innerHTML = `<p>${text}</p>`; // Permite insertar HTML (enlaces)
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll al final
    }

    function cleanText(text) {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // --- C. Función para crear Botones de Opción ---
    function addOptions(opciones) {
        const optionsDiv = document.createElement('div');
        optionsDiv.style.cssText = "display:flex; gap:8px; margin-top:5px; flex-wrap:wrap;";

        opciones.forEach(opcion => {
            const btn = document.createElement('button');
            btn.innerText = opcion;
            // Estilos directos para los botones (o podrías usar una clase CSS)
            btn.style.cssText = "padding:6px 12px; border:1px solid #1B5E20; border-radius:15px; background:#fff; color:#1B5E20; cursor:pointer; font-size:0.85rem; transition:0.2s;";
            
            // Efecto Hover simple
            btn.onmouseover = () => { btn.style.background = "#1B5E20"; btn.style.color = "#fff"; };
            btn.onmouseout = () => { btn.style.background = "#fff"; btn.style.color = "#1B5E20"; };
            
            btn.onclick = () => {
                // Al hacer clic, enviamos la opción como si el usuario la hubiera escrito
                addMessage(opcion, 'user-message');
                optionsDiv.remove(); // Opcional: quitar botones tras clic para limpieza
                setTimeout(() => botReply(opcion), 500);
            };
            optionsDiv.appendChild(btn);
        });

        chatBody.appendChild(optionsDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // --- D. CEREBRO DEL BOT (Inteligencia) ---
    function botReply(userText) {
        const text = cleanText(userText);
        let reply = "";
        let showOptions = false;

        // --- 1. SALUDOS ---
        if (text.match(/hola|buenos|buenas|inicio|empezar/)) {
            reply = "¡Hola! Soy el Asistente Potro. 🐴 ¿Sobre qué quieres saber?";
            showOptions = true;
        } 
        // --- 2. UBICACIÓN / MAPA ---
        else if (text.match(/mapa|donde|llegar|ubicacion|lugar/)) {
            reply = "Estamos en el <strong>Mapa General</strong>. Baja a la sección 'Mapa' para elegir entre la vista 2D o el recorrido 360°. 🗺️";
        }
        // --- 3. CARRERAS ---
        else if (text.match(/carrera|licenciatura|ingenieria|estudiar|oferta/)) {
            reply = "Tenemos una gran oferta académica: Derecho, Computación, Enfermería, Turismo y más. Ve a la sección <strong>'Explora por Licenciatura'</strong> arriba.";
        }
        // --- 4. HORARIOS ---
        else if (text.match(/horario|abierto|cerrado|tramite|papeles/)) {
            reply = "El horario administrativo es de <strong>9:00 AM a 5:00 PM</strong>. Para trámites específicos, te recomiendo ir a Control Escolar (Edificio Administrativo).";
        }
        // --- 5. INSCRIPCIÓN / PAGOS ---
        else if (text.match(/inscripci|examen|costo|pago/)) {
            reply = "Para convocatorias y pagos, visita el sitio oficial: <a href='https://nuevoingreso.uaemex.mx' target='_blank'>nuevoingreso.uaemex.mx</a>";
        }
        // --- 6. DESPEDIDA ---
        else if (text.match(/gracias|adios|bye/)) {
            reply = "¡Un gusto ayudarte! Sigue disfrutando el recorrido virtual. 💚💛";
        }
        // --- 7. DEFAULT (NO ENTIENDE) ---
        else {
            reply = "No estoy seguro de entender. 🤔 Intenta elegir una opción o pregunta por 'mapa' o 'carreras'.";
            showOptions = true; 
        }

        addMessage(reply, 'bot-message');

        // Si corresponde, mostramos los botones de ayuda
        if (showOptions) {
            addOptions(["Ver Mapa", "Ver Carreras", "Inscripciones", "Horarios"]);
        }
    }

    // --- E. Event Listeners (Envío) ---
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

});