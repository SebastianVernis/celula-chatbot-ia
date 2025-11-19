#!/bin/bash

#################################################
# Script para minificar archivos JS y CSS
# Grupo Musical La Célula
# Fecha: 18 de Noviembre de 2025
#################################################

echo "🎵 =========================================="
echo "   Minificación de Assets - La Célula"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
js_success=0
js_fail=0
css_success=0
css_fail=0

# Verificar que terser y csso están instalados
echo "🔍 Verificando herramientas necesarias..."

if ! command -v terser &> /dev/null; then
    echo -e "${YELLOW}⚠️  terser no está instalado. Instalando...${NC}"
    npm install -g terser
fi

if ! command -v csso &> /dev/null; then
    echo -e "${YELLOW}⚠️  csso-cli no está instalado. Instalando...${NC}"
    npm install -g csso-cli
fi

echo -e "${GREEN}✅ Herramientas verificadas${NC}"
echo ""

#################################################
# MINIFICAR ARCHIVOS JAVASCRIPT
#################################################

echo "📦 Minificando archivos JavaScript..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

JS_FILES=(
    "js/chatbot.js"
    "js/form-handler.js"
    "js/blog-pagination.js"
    "js/gallery-dynamic.js"
    "js/navigation.js"
    "js/optimizations.js"
    "js/site-functionality.js"
    "js/video-background.js"
    "js/youtube-carousel.js"
)

for file in "${JS_FILES[@]}"; do
    if [ -f "$file" ]; then
        output_file="${file%.js}.min.js"
        echo -n "   → Procesando $(basename "$file")... "
        
        if terser "$file" \
            --compress \
            --mangle \
            --output "$output_file" 2>/dev/null; then
            
            # Calcular tamaños
            original_size=$(wc -c < "$file" | tr -d ' ')
            minified_size=$(wc -c < "$output_file" | tr -d ' ')
            reduction=$(( 100 - (minified_size * 100 / original_size) ))
            
            echo -e "${GREEN}✅${NC} (${original_size} → ${minified_size} bytes, -${reduction}%)"
            ((js_success++))
        else
            echo -e "${RED}❌ Error${NC}"
            ((js_fail++))
        fi
    else
        echo -e "   ${YELLOW}⚠️  $(basename "$file") no encontrado${NC}"
    fi
done

echo ""

#################################################
# MINIFICAR ARCHIVOS CSS
#################################################

echo "🎨 Minificando archivos CSS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CSS_FILES=(
    "css/styles.css"
    "css/critical.css"
    "chatbot.css"
)

for file in "${CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        output_file="${file%.css}.min.css"
        echo -n "   → Procesando $(basename "$file")... "
        
        if csso "$file" --output "$output_file" 2>/dev/null; then
            # Calcular tamaños
            original_size=$(wc -c < "$file" | tr -d ' ')
            minified_size=$(wc -c < "$output_file" | tr -d ' ')
            reduction=$(( 100 - (minified_size * 100 / original_size) ))
            
            echo -e "${GREEN}✅${NC} (${original_size} → ${minified_size} bytes, -${reduction}%)"
            ((css_success++))
        else
            echo -e "${RED}❌ Error${NC}"
            ((css_fail++))
        fi
    else
        echo -e "   ${YELLOW}⚠️  $(basename "$file") no encontrado${NC}"
    fi
done

echo ""

#################################################
# RESUMEN FINAL
#################################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumen de minificación:"
echo ""
echo "   JavaScript:"
echo "   ✅ Exitosos: $js_success"
if [ $js_fail -gt 0 ]; then
    echo -e "   ${RED}❌ Fallidos: $js_fail${NC}"
fi
echo ""
echo "   CSS:"
echo "   ✅ Exitosos: $css_success"
if [ $css_fail -gt 0 ]; then
    echo -e "   ${RED}❌ Fallidos: $css_fail${NC}"
fi
echo ""

total_success=$((js_success + css_success))
total_fail=$((js_fail + css_fail))
total=$((total_success + total_fail))

if [ $total_fail -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todos los archivos minificados exitosamente!${NC}"
else
    echo -e "${YELLOW}⚠️  Algunos archivos no se pudieron minificar${NC}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Recuerda actualizar las referencias en HTML a los archivos .min.js y .min.css"
echo ""
