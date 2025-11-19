#!/bin/bash

# Script para minificar archivos JavaScript
echo "🗜️  Minificando archivos JavaScript..."

JS_DIR="js"

# Función para minificar un archivo
minify_js() {
    local input_file="$1"
    local output_file="${input_file%.js}.min.js"
    
    if [ -f "$input_file" ]; then
        echo "Minificando: $input_file -> $output_file"
        terser "$input_file" -c -m -o "$output_file" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            # Calcular tamaño original y minificado
            original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
            minified_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
            reduction=$((100 - (minified_size * 100 / original_size)))
            
            echo "✅ Minificado: $output_file (reducción: ${reduction}%)"
        else
            echo "❌ Error minificando: $input_file"
        fi
    fi
}

# Verificar si terser está instalado
if ! command -v terser &> /dev/null; then
    echo "❌ Error: Se requiere 'terser'"
    echo "Instala con: npm install -g terser"
    exit 1
fi

# Minificar archivos principales
echo ""
echo "📦 Minificando archivos JavaScript..."

minify_js "$JS_DIR/site-functionality.js"
minify_js "$JS_DIR/navigation.js"
minify_js "$JS_DIR/youtube-carousel.js"
minify_js "$JS_DIR/gallery-dynamic.js"
minify_js "$JS_DIR/optimizations.js"
minify_js "$JS_DIR/video-background.js"
minify_js "$JS_DIR/blog-pagination.js"
minify_js "$JS_DIR/chatbot.js"
minify_js "$JS_DIR/form-handler.js"

echo ""
echo "✅ Minificación completada!"
echo "📊 Los archivos .min.js están listos para producción"
