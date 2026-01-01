/**
 * Common functionality for Marketing campaign pages
 */

document.addEventListener('DOMContentLoaded', function () {
    // Scroll Arrow Handler
    const scrollArrow = document.getElementById('scrollArrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function () {
            const eventosSection = document.getElementById('eventos');
            if (eventosSection) {
                eventosSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
});
