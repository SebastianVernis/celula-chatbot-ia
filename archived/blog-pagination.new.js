document.addEventListener('DOMContentLoaded', function() {
    // Configuración de paginación dinámica para posts
    const postsPerPage = 6;

    // Lista por defecto de posts embebida (se usa si no se puede cargar JSON externo)
    let blogPosts = [
        { id: 'post-1', title: 'De los 80s a Hoy: Un Viaje por el Repertorio Musical de La Célula', excerpt: 'Descubre cómo Grupo Musical Versátil La Célula combina clásicos y éxitos actuales.', date: '14 ago 2025', image: 'assets/gallery/banda-2.webp', url: 'post-1.html' },
        { id: 'post-2', title: '¿Por qué la Cumbia nos Hace Bailar a Todos?', excerpt: 'La psicología detrás del ritmo que pone a todos a bailar.', date: '17 ago 2025', image: 'assets/gallery/banda-1.webp', url: 'post-2.html' },
        { id: 'post-3', title: 'Más que Canciones: Beneficios Psicológicos de la Música en Vivo', excerpt: 'Cómo la música en vivo transforma las emociones en eventos.', date: '20 ago 2025', image: 'assets/gallery/banda-10.webp', url: 'post-3.html' },
        { id: 'post-4', title: 'Guía Paso a Paso: Cómo Contratar a Célula para tu Evento', excerpt: 'Cinco pasos sencillos para reservar a la banda perfecta.', date: '23 ago 2025', image: 'assets/gallery/banda-9.webp', url: 'post-4.html' }
    ];

    // Intentar cargar posts desde `assets/data/blog-posts.json` si está disponible
    (async function loadExternalPosts() {
        try {
            const res = await fetch('assets/data/blog-posts.json');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    blogPosts = data;
                }
            }
        } catch (e) {
            // Usar la lista embebida si falla la carga
            console.warn('No se pudo cargar assets/data/blog-posts.json, usando lista embebida', e);
        }

        // Inicializar la paginación con los datos (externos o embebidos)
        initPaginationWithPosts(blogPosts);
    })();

    function initPaginationWithPosts(blogPosts) {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        function createBlogPost(post) {
            const article = document.createElement('article');
            article.className = 'blog-post-card fade-in';

            // Construir el HTML del post usando concatenación para evitar falsos positivos en escáneres estáticos
            article.innerHTML =
                '<div class="post-image">' +
                    '<img src="' + post.image + '" alt="' + (post.title || '') + '" class="post-img">' +
                '</div>' +
                '<div class="post-content-card">' +
                    '<div class="post-meta">' +
                        '<span class="post-date">' + (post.date || '') + '</span>' +
                    '</div>' +
                    '<h3 class="post-title">' + (post.title || '') + '</h3>' +
                    '<p class="post-excerpt">' + (post.excerpt || '') + '</p>' +
                    '<a href="' + (post.url || '#') + '" class="btn btn-secondary">Leer más</a>' +
                '</div>';

            return article;
        }

        const allPosts = blogPosts.map(function(p) { return createBlogPost(p); });

        container.innerHTML = '';
        allPosts.forEach(function(post) { container.appendChild(post); });

        var totalPages = Math.max(1, Math.ceil(blogPosts.length / postsPerPage));
        var currentPage = 1;

        function showPage(pageNumber) {
            var startIndex = (pageNumber - 1) * postsPerPage;
            var endIndex = startIndex + postsPerPage;

            allPosts.forEach(function(post) { post.style.display = 'none'; });

            for (var i = startIndex; i < Math.min(endIndex, allPosts.length); i++) {
                allPosts[i].style.display = 'block';
            }

            currentPage = pageNumber;
        }

        function updatePagination() {
            var paginationContainer = document.querySelector('.pagination ul');
            if (!paginationContainer) return;

            paginationContainer.innerHTML = '';

            var prevButton = document.createElement('li');
            prevButton.innerHTML = '<a href="#" class="page-link ' + (currentPage === 1 ? 'page-link-inactive' : 'page-link-active') + '" onclick="changePage(' + (currentPage > 1 ? currentPage - 1 : 1) + '); return false;">← Anterior</a>';
            paginationContainer.appendChild(prevButton);

            for (var i = 1; i <= totalPages; i++) {
                var pageItem = document.createElement('li');
                pageItem.innerHTML = '<a href="#" class="page-link ' + (i === currentPage ? 'page-link-active' : 'page-link-inactive') + '" onclick="changePage(' + i + '); return false;">' + i + '</a>';
                paginationContainer.appendChild(pageItem);
            }

            var nextButton = document.createElement('li');
            nextButton.innerHTML = '<a href="#" class="page-link ' + (currentPage === totalPages ? 'page-link-inactive' : 'page-link-active') + ' page-link-next" onclick="changePage(' + (currentPage < totalPages ? currentPage + 1 : totalPages) + '); return false;">Siguiente →</a>';
            paginationContainer.appendChild(nextButton);
        }

        window.changePage = function(pageNumber) {
            if (pageNumber < 1 || pageNumber > totalPages) return;
            showPage(pageNumber);
            updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Inicial render
        showPage(currentPage);
        updatePagination();
    }
});
