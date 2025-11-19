#!/bin/bash

# Script para minificar archivos CSS
echo "🗜️  Minificando archivos CSS..."

CSS_DIR="css"

# Función para minificar un archivo CSS
minify_css() {
    local input_file="$1"
    local output_file="${input_file%.css}.min.css"
    
    if [ -f "$input_file" ]; then
        echo "Minificando: $input_file -> $output_file"
        npx -y clean-css-cli -o "$output_file" "$input_file" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            # Calcular tamaño original y minificado
            original_size=$(stat -c%s "$input_file" 2>/dev/null || stat -f%z "$input_file" 2>/dev/null)
            minified_size=$(stat -c%s "$output_file" 2>/dev/null || stat -f%z "$output_file" 2>/dev/null)
            reduction=$((100 - (minified_size * 100 / original_size)))
            
            echo "✅ Minificado: $output_file (reducción: ${reduction}%)"
        else
            echo "❌ Error minificando: $input_file"
        fi
    fi
}

# Verificar si npx está disponible
if ! command -v npx &> /dev/null; then
    echo "❌ Error: Se requiere 'npx' (Node.js)"
    echo "Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Minificar archivos principales
echo ""
echo "📦 Minificando archivos CSS..."

minify_css "$CSS_DIR/styles.css"
minify_css "$CSS_DIR/chatbot.css"
minify_css "$CSS_DIR/critical.css"

echo ""
echo "✅ Minificación completada!"
echo "📊 Los archivos .min.css están listos para producción"
