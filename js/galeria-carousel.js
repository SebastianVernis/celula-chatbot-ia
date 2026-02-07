/**
 * Galería Carousel - Grupo Musical La Célula
 * Maneja el carrusel de galería en la página principal
 * - Muestra 3 imágenes a la vez con padding de 20px
 * - Loop de 6 imágenes
 * - Doble clic en Next -> redirige a galeria.html
 */

document.addEventListener('DOMContentLoaded', function () {
    // Solo las primeras 6 imágenes para el carrusel en index
    const carouselImages = [
        { src: 'assets/gallery/banda-1.webp', alt: 'Grupo Musical La Célula en vivo', text: 'En vivo' },
        { src: 'assets/gallery/banda-2.webp', alt: 'Presentación musical', text: 'Presentación' },
        { src: 'assets/gallery/banda-3.webp', alt: 'Evento corporativo', text: 'Eventos' },
        { src: 'assets/gallery/banda-4.webp', alt: 'Boda musical', text: 'Bodas' },
        { src: 'assets/gallery/banda-5.webp', alt: 'Fiesta privada', text: 'Fiestas' },
        { src: 'assets/gallery/banda-6.webp', alt: 'Espectáculo musical', text: 'Shows' }
    ];

    let currentIndex = 0;
    const imagesPerView = 3;
    const totalImages = carouselImages.length;
    let lastClickTime = 0;
    const doubleClickThreshold = 300; // ms

    // Función para crear un elemento de galería para carrusel
    function createCarouselItem(imageData, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.minWidth = 'calc(33.333% - 14px)'; // 3 items con gap de 20px
        item.style.margin = '0 7px'; // Mitad del gap a cada lado
        item.dataset.index = index; // Para lightbox
        
        item.innerHTML =
            '<img src="' + imageData.src + '" alt="' + imageData.alt + '" class="gallery-image" loading="lazy">' +
            '<div class="gallery-overlay">' +
                '<span class="gallery-text">' + imageData.text + '</span>' +
            '</div>';
        
        // Agregar evento click para abrir lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        
        return item;
    }

    // Actualizar el carrusel en la página principal
    function updateCarousel() {
        const carousel = document.getElementById('galleryCarousel');
        if (!carousel) return;

        carousel.innerHTML = '';

        // Crear todas las imágenes
        carouselImages.forEach((image, index) => {
            const item = createCarouselItem(image, index);
            carousel.appendChild(item);
        });

        // Aplicar transformación inicial
        updateCarouselPosition();
    }

    // Actualizar posición del carrusel
    function updateCarouselPosition() {
        const carousel = document.getElementById('galleryCarousel');
        if (!carousel) return;

        // Calcular offset: cada imagen es 33.333% del contenedor + gaps
        const offset = currentIndex * (100 / imagesPerView);
        carousel.style.transform = `translateX(-${offset}%)`;
    }

    // Navegación: siguiente
    function nextSlide() {
        currentIndex++;
        
        // Loop: volver al inicio después de la última posición válida
        if (currentIndex > totalImages - imagesPerView) {
            currentIndex = 0;
        }
        
        updateCarouselPosition();
    }

    // Navegación: anterior
    function prevSlide() {
        currentIndex--;
        
        // Loop: ir al final si estamos al inicio
        if (currentIndex < 0) {
            currentIndex = totalImages - imagesPerView;
        }
        
        updateCarouselPosition();
    }

    // Detectar doble clic en botón Next
    function handleNextClick() {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;

        if (timeDiff < doubleClickThreshold && timeDiff > 0) {
            // Doble clic detectado -> ir a galeria.html
            window.location.href = 'galeria.html';
            return;
        }

        lastClickTime = currentTime;
        nextSlide();
    }

    // Inicializar cuando cargue la página
    updateCarousel();

    // Configurar botones de navegación
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextClick);
    }

    // Auto-scroll opcional (comentado por ahora para dar control manual)
    /*
    let autoSlideInterval = setInterval(nextSlide, 4000);

    // Pausar auto-scroll en hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    }
    */

    // Observador de intersección para lazy loading mejorado
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observar todas las imágenes del carrusel
        const lazyImages = document.querySelectorAll('.gallery-image[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Responsive: ajustar en móviles para mostrar 1 imagen a la vez
    function handleResize() {
        const carousel = document.getElementById('galleryCarousel');
        if (!carousel) return;

        const items = carousel.querySelectorAll('.gallery-item');
        
        if (window.innerWidth <= 768) {
            // Móvil: 1 imagen a la vez
            items.forEach(item => {
                item.style.minWidth = '100%';
                item.style.margin = '0';
            });
        } else {
            // Desktop: 3 imágenes a la vez
            items.forEach(item => {
                item.style.minWidth = 'calc(33.333% - 14px)';
                item.style.margin = '0 7px';
            });
        }
        
        updateCarouselPosition();
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar al iniciar

    // ===== LIGHTBOX FUNCTIONALITY =====
    let currentLightboxIndex = 0;

    // Crear estructura del lightbox si no existe
    function createLightbox() {
        if (document.getElementById('galleryLightbox')) return;

        const lightbox = document.createElement('div');
        lightbox.id = 'galleryLightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Cerrar">&times;</button>
            <button class="lightbox-prev" aria-label="Anterior">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>
            <button class="lightbox-next" aria-label="Siguiente">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </button>
            <img src="" alt="" class="lightbox-image">
            <div class="lightbox-caption"></div>
            <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(lightbox);

        // Event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        });
    }

    function openLightbox(index) {
        createLightbox();
        currentLightboxIndex = index;
        updateLightboxImage();
        
        const lightbox = document.getElementById('galleryLightbox');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lightbox = document.getElementById('galleryLightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentLightboxIndex--;
        if (currentLightboxIndex < 0) {
            currentLightboxIndex = carouselImages.length - 1;
        }
        updateLightboxImage();
    }

    function showNextImage() {
        currentLightboxIndex++;
        if (currentLightboxIndex >= carouselImages.length) {
            currentLightboxIndex = 0;
        }
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const lightbox = document.getElementById('galleryLightbox');
        const image = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        const counter = lightbox.querySelector('.lightbox-counter');
        
        const currentImage = carouselImages[currentLightboxIndex];
        image.src = currentImage.src;
        image.alt = currentImage.alt;
        caption.textContent = currentImage.text;
        counter.textContent = `${currentLightboxIndex + 1} / ${carouselImages.length}`;
    }
});
