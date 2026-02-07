document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PRELOADER
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 500));
        setTimeout(() => { 
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 3000); 
    }

    // 2. ANIMACIÓN DE ENTRADA
    const cards = document.querySelectorAll('.card-objetivo, .card-extra, .card-tarea, .egreso-box, .contenedor-mapa, .area-item');
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