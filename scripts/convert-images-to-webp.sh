#!/bin/bash

# Script para convertir imágenes JPG a WebP con diferentes tamaños
# Requiere: imagemagick (convert) y webp (cwebp)

echo "🖼️  Convirtiendo imágenes a WebP..."

# Directorio de imágenes
IMG_DIR="assets/images"
GALLERY_DIR="assets/gallery"

# Función para convertir una imagen
convert_to_webp() {
    local input_file="$1"
    local output_file="${input_file%.*}.webp"
    
    if [ -f "$input_file" ]; then
        echo "Convirtiendo: $input_file -> $output_file"
        cwebp -q 85 "$input_file" -o "$output_file" 2>/dev/null || \
        convert "$input_file" -quality 85 "$output_file" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Convertido: $output_file"
        else
            echo "❌ Error convirtiendo: $input_file"
        fi
    fi
}

# Función para crear versiones responsive
create_responsive() {
    local input_file="$1"
    local base_name="${input_file%.*}"
    local ext="${input_file##*.}"
    
    if [ -f "$input_file" ]; then
        echo "Creando versiones responsive de: $input_file"
        
        # Versión pequeña (móvil) - 480px ancho
        convert "$input_file" -resize 480x "$base_name-small.$ext" 2>/dev/null
        cwebp -q 80 "$base_name-small.$ext" -o "$base_name-small.webp" 2>/dev/null
        
        # Versión mediana (tablet) - 768px ancho
        convert "$input_file" -resize 768x "$base_name-medium.$ext" 2>/dev/null
        cwebp -q 85 "$base_name-medium.$ext" -o "$base_name-medium.webp" 2>/dev/null
        
        # Versión grande (desktop) - 1200px ancho
        convert "$input_file" -resize 1200x "$base_name-large.$ext" 2>/dev/null
        cwebp -q 85 "$base_name-large.$ext" -o "$base_name-large.webp" 2>/dev/null
        
        echo "✅ Versiones responsive creadas"
    fi
}

# Verificar si existen las herramientas necesarias
if ! command -v cwebp &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ Error: Se requiere 'cwebp' (webp) o 'convert' (imagemagick)"
    echo "Instala con: sudo apt-get install webp imagemagick"
    exit 1
fi

# Convertir TODAS las imágenes JPG del proyecto
echo ""
echo "📦 Convirtiendo TODAS las imágenes JPG a WebP..."

# Buscar todos los archivos JPG/jpg recursivamente
find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img;
 do
    if [ -f "$img" ]; then
        echo ""
        echo "Procesando: $img"
        
        # Convertir a WebP
        output_file="${img%.*}.webp"
        cwebp -q 85 "$img" -o "$output_file" 2>/dev/null || \
        convert "$img" -quality 85 "$output_file" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Convertido: $output_file"
            
            # Eliminar el archivo JPG original
            rm "$img"
            echo "🗑️  Eliminado original: $img"
        else
            echo "❌ Error convirtiendo: $img"
        fi
    fi
done

echo ""
echo "✅ Conversión completada!"
echo "📊 Verifica los archivos .webp generados en $IMG_DIR y $GALLERY_DIR"
