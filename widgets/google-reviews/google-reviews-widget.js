/**
 * Widget de Reseñas de Google para Grupo Musical La Célula
 * Versión: 1.0.0
 * Fecha: 2025-11-20
 * 
 * Este widget permite mostrar reseñas de Google My Business en el sitio web
 * sin necesidad de usar Google Cloud Platform.
 * 
 * Opciones de implementación:
 * 1. Con Featurable API (recomendado - gratis, sin límites)
 * 2. Con datos estáticos (fallback manual)
 */

class GoogleReviewsWidget {
  constructor(options = {}) {
    this.featurableId = options.featurableId || null;
    this.containerId = options.containerId || 'google-reviews-container';
    this.layout = options.layout || 'carousel'; // 'carousel', 'badge', 'grid'
    this.maxReviews = options.maxReviews || 10;
    this.autoplay = options.autoplay !== false;
    this.autoplaySpeed = options.autoplaySpeed || 5000;
    
    this.container = document.getElementById(this.containerId);
    this.reviews = [];
    this.businessInfo = {};
    this.currentIndex = 0;
    this.autoplayInterval = null;
    
    if (!this.container) {
      console.error(`Container with id "${this.containerId}" not found`);
      return;
    }
    
    this.init();
  }

  async init() {
    this.showLoading();
    
    try {
      if (this.featurableId) {
        await this.fetchFromFeaturable();
      } else {
        // Fallback a datos estáticos si no hay Featurable ID
        this.loadStaticData();
      }
      
      this.render();
      
      if (this.layout === 'carousel' && this.autoplay) {
        this.startAutoplay();
      }
    } catch (error) {
      console.error('Error initializing Google Reviews Widget:', error);
      this.showError();
    }
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="reviews-loading">
        <div class="spinner"></div>
        <p>Cargando reseñas...</p>
      </div>
    `;
  }

  showError() {
    this.container.innerHTML = `
      <div class="reviews-error">
        <p>No se pudieron cargar las reseñas en este momento.</p>
        <p>Por favor, intenta más tarde.</p>
      </div>
    `;
  }

  async fetchFromFeaturable() {
    try {
      const response = await fetch(
        `https://api.featurable.com/v1/widgets/${this.featurableId}/reviews`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.reviews = data.reviews.slice(0, this.maxReviews);
      this.businessInfo = {
        name: data.business.name || 'Grupo Musical Versátil La Célula',
        averageRating: data.business.averageRating || 5.0,
        totalReviewCount: data.business.totalReviewCount || this.reviews.length,
        profileUrl: data.business.profileUrl || '#'
      };
    } catch (error) {
      console.error('Error fetching from Featurable:', error);
      // Fallback a datos estáticos si falla Featurable
      this.loadStaticData();
    }
  }

  loadStaticData() {
    // Datos estáticos de ejemplo (reemplazar con reseñas reales)
    this.businessInfo = {
      name: 'Grupo Musical Versátil La Célula',
      averageRating: 5.0,
      totalReviewCount: 15,
      profileUrl: 'https://www.google.com/maps/place/Grupo+Musical+Versátil+La+Célula'
    };
    
    this.reviews = [
      {
        reviewId: '1',
        reviewer: {
          displayName: 'María González',
          profilePhotoUrl: 'assets/images/avatar-placeholder.jpg',
          isAnonymous: false
        },
        starRating: 5,
        comment: 'Excelente grupo musical! Amenizaron nuestra boda y fue todo perfecto. Muy profesionales y con un repertorio increíble.',
        createTime: '2025-10-15T12:00:00Z',
        updateTime: null
      },
      {
        reviewId: '2',
        reviewer: {
          displayName: 'Carlos Ramírez',
          profilePhotoUrl: 'assets/images/avatar-placeholder.jpg',
          isAnonymous: false
        },
        starRating: 5,
        comment: 'Contratamos a La Célula para el aniversario de nuestra empresa. La música fue espectacular y todos los invitados quedaron encantados.',
        createTime: '2025-09-22T18:30:00Z',
        updateTime: null
      },
      {
        reviewId: '3',
        reviewer: {
          displayName: 'Ana Martínez',
          profilePhotoUrl: 'assets/images/avatar-placeholder.jpg',
          isAnonymous: false
        },
        starRating: 5,
        comment: 'Los recomiendo ampliamente. Muy puntuales, excelente actitud y la música de primera calidad. Hicieron de nuestra fiesta un evento inolvidable.',
        createTime: '2025-08-10T20:15:00Z',
        updateTime: null
      }
    ];
  }

  render() {
    if (!this.reviews || this.reviews.length === 0) {
      this.showError();
      return;
    }

    switch (this.layout) {
      case 'badge':
        this.renderBadge();
        break;
      case 'grid':
        this.renderGrid();
        break;
      case 'carousel':
      default:
        this.renderCarousel();
        break;
    }
  }

  renderBadge() {
    const html = `
      <div class="google-reviews-badge">
        <a href="${this.businessInfo.profileUrl}" target="_blank" rel="noopener noreferrer" class="badge-link">
          <div class="badge-header">
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                 alt="Google" class="google-logo">
          </div>
          <div class="badge-rating">
            <div class="stars">${this.renderStars(this.businessInfo.averageRating)}</div>
            <span class="rating-number">${this.businessInfo.averageRating.toFixed(1)}</span>
          </div>
          <div class="badge-count">
            ${this.businessInfo.totalReviewCount} reseñas
          </div>
        </a>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  renderGrid() {
    const reviewsHtml = this.reviews.map(review => this.renderReviewCard(review)).join('');
    
    const html = `
      <div class="google-reviews-grid">
        <div class="reviews-header">
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
               alt="Google" class="google-logo">
          <div class="rating-summary">
            <div class="stars">${this.renderStars(this.businessInfo.averageRating)}</div>
            <span class="rating-text">${this.businessInfo.averageRating.toFixed(1)} / 5</span>
            <span class="review-count">(${this.businessInfo.totalReviewCount} reseñas)</span>
          </div>
        </div>
        <div class="reviews-grid-container">
          ${reviewsHtml}
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  renderCarousel() {
    const reviewsHtml = this.reviews.map((review, index) => {
      const displayClass = index === 0 ? 'active' : '';
      return `<div class="review-slide ${displayClass}">${this.renderReviewCard(review)}</div>`;
    }).join('');
    
    const html = `
      <div class="google-reviews-carousel">
        <div class="reviews-header">
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
               alt="Google" class="google-logo">
          <div class="rating-summary">
            <div class="stars">${this.renderStars(this.businessInfo.averageRating)}</div>
            <span class="rating-text">${this.businessInfo.averageRating.toFixed(1)} / 5</span>
            <span class="review-count">(${this.businessInfo.totalReviewCount} reseñas)</span>
          </div>
        </div>
        
        <div class="carousel-container">
          <div class="carousel-track">
            ${reviewsHtml}
          </div>
        </div>
        
        <div class="carousel-controls">
          <button class="carousel-btn prev" aria-label="Reseña anterior">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <div class="carousel-dots">
            ${this.reviews.map((_, i) => `
              <button class="dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ir a reseña ${i + 1}"></button>
            `).join('')}
          </div>
          <button class="carousel-btn next" aria-label="Siguiente reseña">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
    this.attachCarouselEvents();
  }

  renderReviewCard(review) {
    return `
      <div class="review-card">
        <div class="review-header">
          <img src="${review.reviewer.profilePhotoUrl}" 
               alt="${review.reviewer.displayName}" 
               class="reviewer-photo"
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2212%22 fill=%22%23e0e0e0%22/%3E%3Cpath d=%22M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z%22 fill=%22%23bdbdbd%22/%3E%3C/svg%3E'">
          <div class="reviewer-info">
            <h4 class="reviewer-name">${review.reviewer.displayName}</h4>
            <div class="review-stars">${this.renderStars(review.starRating)}</div>
            <span class="review-date">${this.formatDate(review.createTime)}</span>
          </div>
        </div>
        <div class="review-text">
          <p>${review.comment}</p>
        </div>
      </div>
    `;
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '<svg class="star star-full" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/></svg>';
      } else if (i === fullStars && hasHalfStar) {
        stars += '<svg class="star star-half" viewBox="0 0 24 24"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#half)"/></svg>';
      } else {
        stars += '<svg class="star star-empty" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" fill="currentColor"/></svg>';
      }
    }

    return stars;
  }

  formatDate(dateString) {
    if (!dateString) return 'Recientemente';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    if (diffDays < 60) return 'Hace 1 mes';
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} ${Math.floor(diffDays / 365) === 1 ? 'año' : 'años'}`;
  }

  attachCarouselEvents() {
    const prevBtn = this.container.querySelector('.carousel-btn.prev');
    const nextBtn = this.container.querySelector('.carousel-btn.next');
    const dots = this.container.querySelectorAll('.dot');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevSlide());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goToSlide(index);
      });
    });

    // Pausar autoplay al hover
    const carousel = this.container.querySelector('.google-reviews-carousel');
    if (carousel && this.autoplay) {
      carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  goToSlide(index) {
    const slides = this.container.querySelectorAll('.review-slide');
    const dots = this.container.querySelectorAll('.dot');

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    this.currentIndex = index;
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.reviews.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = this.currentIndex === 0 ? this.reviews.length - 1 : this.currentIndex - 1;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  destroy() {
    this.stopAutoplay();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleReviewsWidget;
}
