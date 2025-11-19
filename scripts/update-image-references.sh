#!/bin/bash

# Script para actualizar referencias de .jpg a .webp en archivos HTML y CSS
echo "🔄 Actualizando referencias de imágenes JPG a WebP..."

# Contador de cambios
total_changes=0

# Función para actualizar referencias en un archivo
update_file() {
    local file="$1"
    
    if [ -f "$file" ]; then
        # Contar cambios antes
        before=$(grep -c '\.jpg\|\.JPG\|\.jpeg\|\.JPEG' "$file" 2>/dev/null || echo 0)
        
        if [ "$before" -gt 0 ]; then
            echo "Actualizando: $file ($before referencias)"
            
            # Reemplazar extensiones (case insensitive)
            sed -i 's/\.jpg/.webp/gi' "$file"
            sed -i 's/\.jpeg/.webp/gi' "$file"
            
            # Actualizar type="image/jpeg" a type="image/webp"
            sed -i 's/type="image\/jpeg"/type="image\/webp"/g' "$file"
            
            total_changes=$((total_changes + before))
            echo "✅ Actualizado: $file"
        fi
    fi
}

# Actualizar archivos HTML en raíz
echo ""
echo "📄 Actualizando archivos HTML en raíz..."
for file in *.html; do
    [ -f "$file" ] && update_file "$file"
done

# Actualizar archivos HTML en post/
echo ""
echo "📄 Actualizando archivos HTML en post/..."
for file in post/*.html; do
    [ -f "$file" ] && update_file "$file"
done

# Actualizar archivos CSS
echo ""
echo "🎨 Actualizando archivos CSS..."
for file in css/*.css; do
    [ -f "$file" ] && update_file "$file"
done

# Actualizar archivos JS (por si hay referencias)
echo ""
echo "⚡ Actualizando archivos JavaScript..."
for file in js/*.js; do
    [ -f "$file" ] && update_file "$file"
done

echo ""
echo "✅ Actualización completada!"
echo "📊 Total de referencias actualizadas: $total_changes"
