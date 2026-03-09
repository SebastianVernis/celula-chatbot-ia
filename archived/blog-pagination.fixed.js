// blog-pagination.fixed.js — clean, single implementation

document.addEventListener('DOMContentLoaded', function() {
    const postsPerPage = 6;

    // Fallback: small embedded list used if fetch fails
    let blogPosts = [
        { id: 'post-1', title: 'De los 80s a Hoy: Un Viaje por el Repertorio Musical de La Célula', excerpt: 'Descubre cómo Grupo Musical Versátil La Célula combina clásicos y éxitos actuales.', date: '14 ago 2025', image: 'assets/gallery/banda-2.webp', url: 'post-1.html' },
        { id: 'post-2', title: '¿Por qué la Cumbia nos Hace Bailar a Todos?', excerpt: 'La psicología detrás del ritmo que pone a todos a bailar.', date: '17 ago 2025', image: 'assets/gallery/banda-1.webp', url: 'post-2.html' },
        { id: 'post-3', title: 'Más que Canciones: Beneficios Psicológicos de la Música en Vivo', excerpt: 'Cómo la música en vivo transforma las emociones en eventos.', date: '20 ago 2025', image: 'assets/gallery/banda-10.webp', url: 'post-3.html' }
    ];

    // Try to load external posts JSON, fall back to embedded list
    (async function tryLoad() {
        try {
            const res = await fetch('assets/data/blog-posts.json');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length) blogPosts = data;
            }
        } catch (err) {
            // ignore — we'll use embedded blogPosts
            console.warn('blog-pagination: failed to load external JSON, using embedded posts', err);
        }

        initPaginationWithPosts(blogPosts);
    })();

    function initPaginationWithPosts(posts) {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        // create DOM node for a post
        function createBlogPost(post) {
            const article = document.createElement('article');
            article.className = 'blog-post-card fade-in';

            // build HTML using concatenation (avoid static analyzers misreading template literals)
            article.innerHTML =
                '<div class="post-image">' +
                    '<img src="' + (post.image || '') + '" alt="' + (post.title || '') + '" class="post-img">' +
                '</div>' +
                '<div class="post-content-card">' +
                    '<div class="post-meta"><span class="post-date">' + (post.date || '') + '</span></div>' +
                    '<h3 class="post-title">' + (post.title || '') + '</h3>' +
                    '<p class="post-excerpt">' + (post.excerpt || '') + '</p>' +
                    '<a href="' + (post.url || '#') + '" class="btn btn-secondary">Leer más</a>' +
                '</div>';

            return article;
        }

        const allPosts = posts.map(function(p) { return createBlogPost(p); });

        // attach
        container.innerHTML = '';
        allPosts.forEach(function(n) { container.appendChild(n); });

        const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
        let currentPage = 1;

        function showPage(pageNumber) {
            const start = (pageNumber - 1) * postsPerPage;
            const end = start + postsPerPage;
            allPosts.forEach(function(el) { el.style.display = 'none'; });
            for (let i = start; i < Math.min(end, allPosts.length); i++) allPosts[i].style.display = 'block';
            currentPage = pageNumber;
        }

        function updatePagination() {
            const paginationContainer = document.querySelector('.pagination ul');
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';

            const prev = document.createElement('li');
            prev.innerHTML = '<a href="#" class="page-link ' + (currentPage === 1 ? 'page-link-inactive' : 'page-link-active') + '" onclick="changePage(' + (currentPage > 1 ? currentPage - 1 : 1) + '); return false;">← Anterior</a>';
            paginationContainer.appendChild(prev);

            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="#" class="page-link ' + (i === currentPage ? 'page-link-active' : 'page-link-inactive') + '" onclick="changePage(' + i + '); return false;">' + i + '</a>';
                paginationContainer.appendChild(li);
            }

            const next = document.createElement('li');
            next.innerHTML = '<a href="#" class="page-link ' + (currentPage === totalPages ? 'page-link-inactive' : 'page-link-active') + ' page-link-next" onclick="changePage(' + (currentPage < totalPages ? currentPage + 1 : totalPages) + '); return false;">Siguiente →</a>';
            paginationContainer.appendChild(next);
        }

        window.changePage = function(pageNumber) {
            if (pageNumber < 1 || pageNumber > totalPages) return;
            showPage(pageNumber);
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // initial render
        showPage(currentPage);
        updatePagination();
    }
});
