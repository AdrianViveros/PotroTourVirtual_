document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PRELOADER (Seguridad anti-bloqueo)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const removePreloader = () => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        };
        window.addEventListener('load', () => setTimeout(removePreloader, 500));
        setTimeout(removePreloader, 3000); 
    }

    // 2. ANIMACIÓN DE ENTRADA
    const cards = document.querySelectorAll('.card-objetivo, .card-extra, .card-tarea, .egreso-box, .contenedor-mapa');
    if ('IntersectionObserver' in window && cards.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });
    } else {
        cards.forEach(c => c.style.opacity = 1);
    }

    // 3. MAPA CURRICULAR
    const mapContainer = document.querySelector('.contenedor-mapa');
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) window.open(img.src, '_blank');
        });
    }
});