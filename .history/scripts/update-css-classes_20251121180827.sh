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
