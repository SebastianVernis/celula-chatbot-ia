#!/bin/bash

# HTML Validation Script
# Valida estructura HTML y rutas de video background

set -e

echo "🔍 Iniciando validación HTML..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Contadores
total_files=0
valid_files=0
warnings=0
errors=0

# Función para validar un archivo HTML
validate_html_file() {
    local file=$1
    local filename=$(basename "$file")

    echo -e "${BLUE}📄 Validando: $filename${NC}"

    # Verificaciones básicas
    local file_errors=0
    local file_warnings=0

    # 1. Verificar DOCTYPE
    if ! grep -q "<!DOCTYPE html>" "$file"; then
        echo -e "${RED}❌ DOCTYPE HTML5 faltante${NC}"
        ((file_errors++))
    fi

    # 2. Verificar etiquetas básicas
    if ! grep -q "<html" "$file"; then
        echo -e "${RED}❌ Etiqueta <html> faltante${NC}"
        ((file_errors++))
    fi

    if ! grep -q "<head>" "$file"; then
        echo -e "${RED}❌ Etiqueta <head> faltante${NC}"
        ((file_errors++))
    fi

    if ! grep -q "<body>" "$file"; then
        echo -e "${RED}❌ Etiqueta <body> faltante${NC}"
        ((file_errors++))
    fi

    # 3. Verificar meta tags importantes
    if ! grep -q "charset=" "$file"; then
        echo -e "${YELLOW}⚠️ Meta charset faltante${NC}"
        ((file_warnings++))
    fi

    if ! grep -q "viewport" "$file"; then
        echo -e "${YELLOW}⚠️ Meta viewport faltante${NC}"
        ((file_warnings++))
    fi

    # 4. Verificar título
    if ! grep -q "<title>" "$file"; then
        echo -e "${YELLOW}⚠️ Elemento <title> faltante${NC}"
        ((file_warnings++))
    fi

    # 5. Verificar video background (para posts)
    if [[ "$file" == *"/post/"* ]]; then
        if grep -q "video-background" "$file"; then
            # Verificar que la ruta sea correcta
            if grep -q "\.\./js/video-background\.min\.js" "$file"; then
                echo -e "${GREEN}✅ Video background correctamente configurado${NC}"
            else
                echo -e "${YELLOW}⚠️ Ruta de video background podría ser incorrecta${NC}"
                ((file_warnings++))
            fi
        else
            echo -e "${RED}❌ Video background faltante en post${NC}"
            ((file_errors++))
        fi
    fi

    # 6. Verificar rutas relativas
    if grep -q "\.\./assets/" "$file"; then
        echo -e "${GREEN}✅ Rutas relativas a assets presentes${NC}"
    fi

    if grep -q "\.\./css/" "$file"; then
        echo -e "${GREEN}✅ Rutas relativas a CSS presentes${NC}"
    fi

    # 7. Verificar estructura de navegación
    if grep -q "nav-container\|site-header" "$file"; then
        echo -e "${GREEN}✅ Navegación presente${NC}"
    else
        echo -e "${YELLOW}⚠️ Estructura de navegación no encontrada${NC}"
        ((file_warnings++))
    fi

    # Mostrar resumen del archivo
    if [ $file_errors -eq 0 ] && [ $file_warnings -eq 0 ]; then
        echo -e "${GREEN}✅ $filename - Sin problemas${NC}"
        ((valid_files++))
    elif [ $file_errors -eq 0 ]; then
        echo -e "${YELLOW}⚠️ $filename - $file_warnings advertencias${NC}"
        ((valid_files++))
    else
        echo -e "${RED}❌ $filename - $file_errors errores, $file_warnings advertencias${NC}"
    fi

    ((errors += file_errors))
    ((warnings += file_warnings))

    echo ""
}

# Validar archivos HTML principales
echo -e "${BLUE}🏠 Validando archivos HTML principales...${NC}"
main_files=("index.html" "blog.html" "cotizador.html" "offline.html")

for file in "${main_files[@]}"; do
    if [ -f "$file" ]; then
        validate_html_file "$file"
        ((total_files++))
    else
        echo -e "${YELLOW}⚠️ $file no encontrado${NC}"
    fi
done

# Validar posts del blog
if [ -d "post" ]; then
    echo -e "${BLUE}📝 Validando posts del blog...${NC}"

    post_count=0
    for post in post/post-*.html; do
        if [ -f "$post" ]; then
            validate_html_file "$post"
            ((total_files++))
            ((post_count++))
        fi
    done

    echo -e "${BLUE}📊 Total posts validados: $post_count${NC}"
else
    echo -e "${YELLOW}⚠️ Directorio de posts no encontrado${NC}"
fi

# Verificar archivos críticos
echo -e "${BLUE}🔍 Verificando archivos críticos...${NC}"

critical_files=(
    "js/video-background.min.js"
    "js/video-background.js"
    "css/styles.min.css"
    "assets/video/background-1080p.webm"
    "assets/video/mobile-background.webm"
)

missing_critical=0
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo -e "${GREEN}✅ $file ($size)${NC}"
    else
        echo -e "${RED}❌ $file - ARCHIVO CRÍTICO FALTANTE${NC}"
        ((missing_critical++))
        ((errors++))
    fi
done

# Resumen final
echo -e "${BLUE}📋 RESUMEN DE VALIDACIÓN${NC}"
echo -e "════════════════════════════"
echo -e "Archivos validados: $total_files"
echo -e "Archivos válidos: $valid_files"
echo -e "Total errores: $errors"
echo -e "Total advertencias: $warnings"
echo -e "Archivos críticos faltantes: $missing_critical"

if [ $errors -eq 0 ] && [ $missing_critical -eq 0 ]; then
    echo -e "${GREEN}🎉 VALIDACIÓN EXITOSA${NC}"
    echo -e "${GREEN}✅ Todos los archivos HTML son válidos${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️ VALIDACIÓN CON ADVERTENCIAS${NC}"
    echo -e "${YELLOW}Se encontraron $warnings advertencias pero no errores críticos${NC}"
    exit 0
else
    echo -e "${RED}❌ VALIDACIÓN FALLIDA${NC}"
    echo -e "${RED}Se encontraron $errors errores que deben ser corregidos${NC}"
    exit 1
fi