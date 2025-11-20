/**
 * Galería Dinámica - Grupo Musical Célula
 * Gestiona la carga y visualización dinámica de imágenes de la galería
 */

document.addEventListener('DOMContentLoaded', function() {
    // Lista de imágenes de la galería (esto puede ser actualizado automáticamente)
    const galleryImages = [
        { src: 'assets/gallery/banda-1.webp', alt: 'Grupo Musical La Célula en vivo', text: 'En vivo' },
        { src: 'assets/gallery/banda-2.webp', alt: 'Presentación musical', text: 'Presentación' },
        { src: 'assets/gallery/banda-3.webp', alt: 'Evento corporativo', text: 'Eventos' },
        { src: 'assets/gallery/banda-4.webp', alt: 'Boda musical', text: 'Bodas' },
        { src: 'assets/gallery/banda-5.webp', alt: 'Fiesta privada', text: 'Fiestas' },
        { src: 'assets/gallery/banda-6.webp', alt: 'Espectáculo musical', text: 'Shows' },
        { src: 'assets/gallery/banda-7.webp', alt: 'Grupo musical La Célula en el escenario', text: 'Escenario' },
        { src: 'assets/gallery/banda-8.webp', alt: 'Grupo musical La Célula en concierto', text: 'Concierto' },
        { src: 'assets/gallery/banda-9.webp', alt: 'Grupo musical La Célula actuando', text: 'Actuación' },
        { src: 'assets/gallery/banda-10.webp', alt: 'Grupo musical La Célula en evento', text: 'Evento' },
        { src: 'assets/gallery/banda-11.webp', alt: 'Grupo musical La Célula en desfile', text: 'Desfile' },
        { src: 'assets/gallery/banda-12.webp', alt: 'Grupo musical La Célula grupo completo', text: 'Grupo' },
        { src: 'assets/gallery/banda-13.webp', alt: 'Grupo musical La Célula con público', text: 'Público' },
        { src: 'assets/gallery/banda-14.webp', alt: 'Grupo musical La Célula en actuación', text: 'Actuación' },
        { src: 'assets/gallery/banda-15.webp', alt: 'Grupo musical La Célula en boda', text: 'Boda' },
        { src: 'assets/gallery/banda-16.webp', alt: 'Grupo musical La Célula en fiesta', text: 'Fiesta' },
        { src: 'assets/gallery/banda-17.webp', alt: 'Grupo musical La Célula en show', text: 'Show' },
        { src: 'assets/gallery/banda-18.webp', alt: 'Grupo musical La Célula en presentación', text: 'Presentación' },
        { src: 'assets/gallery/banda-19.webp', alt: 'Grupo musical La Célula en evento corporativo', text: 'Corporativo' },
        { src: 'assets/gallery/banda-20.webp', alt: 'Grupo musical La Célula en aniversario', text: 'Aniversario' },
        { src: 'assets/gallery/banda-21.webp', alt: 'Grupo Musical La Célula en XV años', text: 'XV años' },
        { src: 'assets/gallery/banda-22.webp', alt: 'Grupo musical La Célula en graduación', text: 'Graduación' },
        { src: 'assets/gallery/banda-23.webp', alt: 'Grupo musical La Célula en evento social', text: 'Social' },
        { src: 'assets/gallery/banda-24.webp', alt: 'Grupo musical La Célula en concierto al aire libre', text: 'Aire libre' },
        { src: 'assets/gallery/banda-25.webp', alt: 'Grupo musical La Célula en evento privado', text: 'Privado' },
        { src: 'assets/gallery/banda-26.webp', alt: 'Grupo musical La Célula en festival', text: 'Festival' },
        { src: 'assets/gallery/banda-27.webp', alt: 'Grupo musical La Célula en bar', text: 'Bar' },
        { src: 'assets/gallery/banda-28.webp', alt: 'Grupo musical La Célula en club', text: 'Club' },
        { src: 'assets/gallery/banda-29.webp', alt: 'Grupo musical La Célula en teatro', text: 'Teatro' },
        { src: 'assets/gallery/banda-30.webp', alt: 'Grupo musical La Célula en hotel', text: 'Hotel' },
        { src: 'assets/gallery/banda-31.webp', alt: 'Grupo musical La Célula en restaurante', text: 'Restaurante' },
        { src: 'assets/gallery/banda-32.webp', alt: 'Grupo musical La Célula en patio', text: 'Patio' },
        { src: 'assets/gallery/banda-33.webp', alt: 'Grupo musical La Célula en jardín', text: 'Jardín' },
        { src: 'assets/gallery/banda-34.webp', alt: 'Grupo musical La Célula en terraza', text: 'Terraza' },
        { src: 'assets/gallery/banda-35.webp', alt: 'Grupo musical La Célula en balcón', text: 'Balcón' },
        { src: 'assets/gallery/banda-36.webp', alt: 'Grupo musical La Célula en azotea', text: 'Azotea' },
        { src: 'assets/gallery/banda-37.webp', alt: 'Grupo musical La Célula en salón', text: 'Salón' },
        { src: 'assets/gallery/banda-38.webp', alt: 'Grupo musical La Célula en explanada', text: 'Explanada' },
        { src: 'assets/gallery/banda-39.webp', alt: 'Grupo musical La Célula en explanación', text: 'Explanación' },
        { src: 'assets/gallery/banda-40.webp', alt: 'Grupo musical La Célula en explanada abierta', text: 'Explanada Abierta' },
        { src: 'assets/gallery/banda-41.webp', alt: 'Grupo musical La Célula en explanada techada', text: 'Explanada Techada' },
        { src: 'assets/gallery/banda-42.webp', alt: 'Grupo musical La Célula en explanada techada 2', text: 'Techada 2' },
        { src: 'assets/gallery/banda-43.webp', alt: 'Grupo musical La Célula en explanada techada 3', text: 'Techada 3' },
        { src: 'assets/gallery/banda-44.webp', alt: 'Grupo musical La Célula en explanada techada 4', text: 'Techada 4' },
        { src: 'assets/gallery/banda-45.webp', alt: 'Grupo musical La Célula en explanada techada 5', text: 'Techada 5' },
        { src: 'assets/gallery/banda-46.webp', alt: 'Grupo musical La Célula en explanada techada 6', text: 'Techada 6' },
        { src: 'assets/gallery/banda-47.webp', alt: 'Grupo musical La Célula en explanada techada 7', text: 'Techada 7' },
        { src: 'assets/gallery/banda-48.webp', alt: 'Grupo musical La Célula en explanada techada 8', text: 'Techada 8' },
        { src: 'assets/gallery/banda-49.webp', alt: 'Grupo musical La Célula en explanada techada 9', text: 'Techada 9' },
        { src: 'assets/gallery/banda-50.webp', alt: 'Grupo musical La Célula en explanada techada 10', text: 'Techada 10' },
        { src: 'assets/gallery/banda-51.webp', alt: 'Grupo musical La Célula en cierre de evento', text: 'Cierre' }
    ];

    // Función para crear un elemento de galería
    function createGalleryItem(imageData) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML =
            '<img src="' + imageData.src + '" alt="' + imageData.alt + '" class="gallery-image">' +
            '<div class="gallery-overlay">' +
                '<span class="gallery-text">' + imageData.text + '</span>' +
            '</div>';
        return item;
    }

    // Actualizar la galería dinámicamente
    function updateGallery() {
        const carousel = document.getElementById('galleryCarousel');
        if (!carousel) return;

        // Limpiar el carrusel
        carousel.innerHTML = '';

        // Agregar las imágenes dinámicamente
        galleryImages.forEach(image => {
            const galleryItem = createGalleryItem(image);
            carousel.appendChild(galleryItem);
        });

        // Re-inicializar la funcionalidad del carrusel si existe
        if (window.CelulaNavigation && typeof window.CelulaNavigation.initGalleryCarousel === 'function') {
            // Si el carrusel ya tiene funcionalidad, la reejecutamos
            setTimeout(() => {
                initCarousel();
            }, 100);
        }
    }

    // Inicializar el carrusel
    function initCarousel() {
        const carousel = document.getElementById('galleryCarousel');
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');

        if (!carousel || !prevBtn || !nextBtn) return;

        const items = carousel.querySelectorAll('.gallery-item');
        if (items.length === 0) return;

        let currentIndex = 0;
        let itemsToShow = 1;

        // Ajustar cantidades según el tamaño de pantalla
        const updateItemsToShow = () => {
            if (window.innerWidth > 768) {
                itemsToShow = 3;
            } else {
                itemsToShow = 1;
            }
        };

        const updateCarousel = () => {
            const containerWidth = carousel.parentElement.clientWidth;
            
            if (window.innerWidth > 768) {
                // Desktop: mostrar 3 imágenes
                const totalMargin = (itemsToShow - 1) * 20;
                const itemWidth = (containerWidth - totalMargin) / itemsToShow;
                
                items.forEach(item => {
                    item.style.flex = `0 0 ${itemWidth}px`;
                    item.style.marginRight = '20px';
                });
                
                const offset = currentIndex * (itemWidth + 20);
                carousel.style.transform = `translateX(-${offset}px)`;
            } else {
                // Mobile: una imagen completa a la vez
                items.forEach(item => {
                    item.style.flex = `0 0 ${containerWidth}px`;
                    item.style.marginRight = '0';
                });
                
                const offset = currentIndex * containerWidth;
                carousel.style.transform = `translateX(-${offset}px)`;
            }
            
            carousel.style.transition = 'transform 0.3s ease';
        };

        const nextSlide = () => {
            const maxIndex = Math.max(0, items.length - itemsToShow);
            
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        };

        const prevSlide = () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        };

        // Inicializar el carrusel
        updateItemsToShow();
        updateCarousel();

        // Event listeners para los botones
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Actualizar cuando se cambia el tamaño de la ventana
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateItemsToShow();
                const maxIndex = Math.max(0, items.length - itemsToShow);
                currentIndex = Math.min(currentIndex, maxIndex);
                updateCarousel();
            }, 150);
        });

        // Lightbox functionality
        initLightbox(items, galleryImages);
    }

    // Inicializar lightbox para visualización fullscreen
    function initLightbox(items, images) {
        // Crear modal lightbox
        let lightbox = document.getElementById('gallery-lightbox');
        
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'gallery-lightbox';
            lightbox.className = 'gallery-lightbox';
            lightbox.innerHTML = `
                <button class="lightbox-close" aria-label="Cerrar">&times;</button>
                <button class="lightbox-prev" aria-label="Anterior">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                </button>
                <button class="lightbox-next" aria-label="Siguiente">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                </button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            `;
            document.body.appendChild(lightbox);
        }

        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxCounter = lightbox.querySelector('.lightbox-counter');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentLightboxIndex = 0;

        const openLightbox = (index) => {
            currentLightboxIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const updateLightboxImage = () => {
            const image = images[currentLightboxIndex];
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
            lightboxCaption.textContent = image.text;
            lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
        };

        const showNext = () => {
            currentLightboxIndex = (currentLightboxIndex + 1) % images.length;
            updateLightboxImage();
        };

        const showPrev = () => {
            currentLightboxIndex = (currentLightboxIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        };

        // Event listeners para abrir lightbox
        items.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        // Event listeners para controles del lightbox
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        // Cerrar al hacer clic fuera de la imagen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });

        // Touch gestures para mobile
        let touchStartX = 0;
        let touchEndX = 0;

        lightboxImg.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightboxImg.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) showNext();
            if (touchEndX > touchStartX + 50) showPrev();
        };
