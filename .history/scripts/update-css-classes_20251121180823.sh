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
