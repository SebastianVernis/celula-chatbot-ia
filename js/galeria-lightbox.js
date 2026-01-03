/**
 * Galería Lightbox - Vista previa de imágenes
 * Para galeria.html - Página de galería completa
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de galería
    const galeriaGrid = document.getElementById('galeriaGrid');
    if (!galeriaGrid) return;

    let currentLightboxIndex = 0;
    let allImages = [];

    // Recolectar todas las imágenes de la galería
    function collectGalleryImages() {
        allImages = [];
        const imageElements = galeriaGrid.querySelectorAll('.galeria-item img');
        
        imageElements.forEach((img, index) => {
            allImages.push({
                src: img.src,
                alt: img.alt || 'Imagen de galería',
                element: img.closest('.galeria-item')
            });

            // Agregar evento click a cada imagen
            img.closest('.galeria-item').addEventListener('click', function() {
                openLightbox(index);
            });

            // Agregar cursor pointer
            img.closest('.galeria-item').style.cursor = 'pointer';
        });
    }

    // Crear estructura del lightbox
    function createLightbox() {
        if (document.getElementById('galeriaLightbox')) return;

        const lightbox = document.createElement('div');
        lightbox.id = 'galeriaLightbox';
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

        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                showNextImage();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                showPrevImage();
            }
        }
    }

    function openLightbox(index) {
        createLightbox();
        currentLightboxIndex = index;
        updateLightboxImage();
        
        const lightbox = document.getElementById('galeriaLightbox');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lightbox = document.getElementById('galeriaLightbox');
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentLightboxIndex--;
        if (currentLightboxIndex < 0) {
            currentLightboxIndex = allImages.length - 1;
        }
        updateLightboxImage();
    }

    function showNextImage() {
        currentLightboxIndex++;
        if (currentLightboxIndex >= allImages.length) {
            currentLightboxIndex = 0;
        }
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const lightbox = document.getElementById('galeriaLightbox');
        if (!lightbox) return;

        const image = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        const counter = lightbox.querySelector('.lightbox-counter');
        
        const currentImage = allImages[currentLightboxIndex];
        
        // Fade effect
        image.style.opacity = '0';
        setTimeout(() => {
            image.src = currentImage.src;
            image.alt = currentImage.alt;
            caption.textContent = currentImage.alt;
            counter.textContent = `${currentLightboxIndex + 1} / ${allImages.length}`;
            image.style.opacity = '1';
        }, 150);
    }

    // Inicializar
    collectGalleryImages();
    console.log('✅ Lightbox de galería inicializado:', allImages.length, 'imágenes');
});
