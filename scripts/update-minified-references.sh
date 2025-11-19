#!/bin/bash

# Script para actualizar referencias a archivos minificados
echo "🔄 Actualizando referencias a archivos minificados..."

# Contador de cambios
total_changes=0

# Función para actualizar referencias en un archivo
update_file_minified() {
    local file="$1"
    local changes=0
    
    if [ -f "$file" ]; then
        # CSS - actualizar a versiones minificadas
        if grep -q 'css/styles.css' "$file"; then
            sed -i 's|css/styles\.css|css/styles.min.css|g' "$file"
            sed -i 's|\.\./css/styles\.css|../css/styles.min.css|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'css/chatbot.css' "$file"; then
            sed -i 's|css/chatbot\.css|css/chatbot.min.css|g' "$file"
            sed -i 's|\.\./css/chatbot\.css|../css/chatbot.min.css|g' "$file"
            ((changes++))
        fi
        
        # JS - actualizar a versiones minificadas (solo si no están ya minificadas)
        if grep -q 'js/navigation.js"' "$file" && ! grep -q 'js/navigation.min.js' "$file"; then
            sed -i 's|js/navigation\.js|js/navigation.min.js|g' "$file"
            sed -i 's|\.\./js/navigation\.js|../js/navigation.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/site-functionality.js' "$file"; then
            sed -i 's|js/site-functionality\.js|js/site-functionality.min.js|g' "$file"
            sed -i 's|\.\./js/site-functionality\.js|../js/site-functionality.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/youtube-carousel.js' "$file"; then
            sed -i 's|js/youtube-carousel\.js|js/youtube-carousel.min.js|g' "$file"
            sed -i 's|\.\./js/youtube-carousel\.js|../js/youtube-carousel.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/gallery-dynamic.js' "$file"; then
            sed -i 's|js/gallery-dynamic\.js|js/gallery-dynamic.min.js|g' "$file"
            sed -i 's|\.\./js/gallery-dynamic\.js|../js/gallery-dynamic.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/optimizations.js' "$file"; then
            sed -i 's|js/optimizations\.js|js/optimizations.min.js|g' "$file"
            sed -i 's|\.\./js/optimizations\.js|../js/optimizations.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/video-background.js' "$file"; then
            sed -i 's|js/video-background\.js|js/video-background.min.js|g' "$file"
            sed -i 's|\.\./js/video-background\.js|../js/video-background.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/blog-pagination.js' "$file"; then
            sed -i 's|js/blog-pagination\.js|js/blog-pagination.min.js|g' "$file"
            sed -i 's|\.\./js/blog-pagination\.js|../js/blog-pagination.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/chatbot.js' "$file"; then
            sed -i 's|js/chatbot\.js|js/chatbot.min.js|g' "$file"
            sed -i 's|\.\./js/chatbot\.js|../js/chatbot.min.js|g' "$file"
            ((changes++))
        fi
        
        if grep -q 'js/form-handler.js' "$file"; then
            sed -i 's|js/form-handler\.js|js/form-handler.min.js|g' "$file"
            sed -i 's|\.\./js/form-handler\.js|../js/form-handler.min.js|g' "$file"
            ((changes++))
        fi
        
        if [ $changes -gt 0 ]; then
            echo "✅ Actualizado: $file ($changes archivos)"
            total_changes=$((total_changes + changes))
        fi
    fi
}

# Actualizar archivos HTML en raíz
echo ""
echo "📄 Actualizando archivos HTML en raíz..."
for file in *.html; do
    [ -f "$file" ] && update_file_minified "$file"
done

# Actualizar archivos HTML en post/
echo ""
echo "📄 Actualizando archivos HTML en post/..."
for file in post/*.html; do
    [ -f "$file" ] && update_file_minified "$file"
done

echo ""
echo "✅ Actualización completada!"
echo "📊 Total de archivos actualizados: $total_changes"
