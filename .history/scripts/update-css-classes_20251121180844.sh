#!/bin/bash

echo "🔄 Actualizando clases CSS en archivos HTML..."

# Función para actualizar clases en un archivo
update_file() {
    local file=$1
    echo "📝 Procesando: $file"
    
    # Navegación
    sed -i 's/class="site-header"/class="nav-menu-container"/g' "$file"
    sed -i 's/id="SITE_HEADER"/class="nav-menu-container"/g' "$file"
    sed -i 's/class="nav-container"/class="nav-menu-wrapper"/g' "$file"
    sed -i 's/class="nav-item"/class="nav-menu-item"/g' "$file"
    sed -i 's/class="nav-link"/class="nav-menu-link"/g' "$file"
    sed -i 's/class="nav-link active"/class="nav-menu-link active"/g' "$file"
    sed -i 's/class="mobile-menu-toggle"/class="nav-menu-toggle"/g' "$file"
    
    # Footer
    sed -i 's/class="site-footer"/class="footer"/g' "$file"
    sed -i 's/id="SITE_FOOTER"/class="footer"/g' "$file"
}

# Actualizar index.html
if [ -f "index.html" ]; then
    update_file "index.html"
    
    # Reemplazos específicos para index.html
    sed -i 's/<section class="hero-section"/<section class="hero-index"/g' index.html
    sed -i 's/class="hero-content"/class="hero-index-content"/g' index.html
    sed -i 's/class="hero-logo"/class="hero-index-logo"/g' index.html
    sed -i 's/class="hero-title"/class="hero-index-title"/g' index.html
    sed -i 's/class="social-bar"/class="hero-index-social"/g' index.html
    
    # Servicios
    sed -i 's/<section class="content-section" id="servicios">/<section class="services-index" id="servicios">/g' index.html
    sed -i 's/class="services-grid"/class="services-index-grid"/g' index.html
    sed -i 's/class="service-card"/class="services-index-card"/g' index.html
    sed -i 's/class="card-inner"/class="services-index-card-inner"/g' index.html
    sed -i 's/class="card-front"/class="services-index-card-front"/g' index.html
    sed -i 's/class="card-back"/class="services-index-card-back"/g' index.html
    sed -i 's/class="service-image"/class="services-index-image"/g' index.html
    sed -i 's/class="service-content"/class="services-index-content"/g' index.html
    sed -i 's/class="service-title"/class="services-index-card-title"/g' index.html
    
    # Videos
    sed -i 's/<section class="content-section videos-section"/<section class="carousel-youtube"/g' index.html
    sed -i 's/class="youtube-carousel-container"/class="carousel-youtube-container"/g' index.html
    
    # Galería
    sed -i 's/<section class="content-section banda-section"/<section class="carousel-gallery"/g' index.html
    sed -i 's/class="gallery-item"/class="carousel-gallery-item"/g' index.html
    sed -i 's/class="gallery-image"/class="carousel-gallery-image"/g' index.html
    
    echo "✅ index.html actualizado"
fi

# Actualizar cotizador.html
if [ -f "cotizador.html" ]; then
    update_file "cotizador.html"
    
    sed -i 's/<section class="hero-section"/<section class="hero-cotizador"/g' cotizador.html
    sed -i 's/class="hero-content"/class="hero-cotizador-content"/g' cotizador.html
    sed -i 's/<section class="content-section"/<section class="cotizador-form"/g' cotizador.html
    sed -i 's/class="cotizador-form"/class="cotizador-form-wrapper"/g' cotizador.html
    sed -i 's/class="form-group"/class="cotizador-form-group"/g' cotizador.html
    sed -i 's/class="form-label"/class="cotizador-form-label"/g' cotizador.html
    sed -i 's/class="form-input"/class="cotizador-form-input"/g' cotizador.html
    sed -i 's/class="form-select"/class="cotizador-form-select"/g' cotizador.html
    sed -i 's/class="form-textarea"/class="cotizador-form-textarea"/g' cotizador.html
    
    echo "✅ cotizador.html actualizado"
fi

# Actualizar blog.html
if [ -f "blog.html" ]; then
    update_file "blog.html"
    
    sed -i 's/<section class="hero-section"/<section class="hero-blog"/g' blog.html
    sed -i 's/class="hero-content"/class="hero-blog-content"/g' blog.html
    sed -i 's/class="blog-posts-grid"/class="navigation-blog-grid"/g' blog.html
    sed -i 's/class="blog-post-card"/class="navigation-blog-card"/g' blog.html
    
    echo "✅ blog.html actualizado"
fi

# Actualizar archivos de posts
for file in post/post-*.html; do
    if [ -f "$file" ]; then
        update_file "$file"
        
        sed -i 's/<section class="hero-section"/<section class="hero-post"/g' "$file"
        sed -i 's/class="hero-content"/class="hero-post-content"/g' "$file"
        sed -i 's/<section class="content-section"/<section class="post-content"/g' "$file"
        sed -i 's/class="blog-post-content"/class="post-content-wrapper"/g' "$file"
        
        echo "✅ $(basename $file) actualizado"
    fi
done

echo ""
echo "✨ Actualización completada!"
echo "📋 Archivos actualizados:"
echo "   - index.html"
echo "   - cotizador.html"
echo "   - blog.html"
echo "   - post/*.html"
echo ""
echo "⚠️  Importante: Revisa los archivos para verificar que todo esté correcto"
