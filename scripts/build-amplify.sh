#!/bin/bash

# AWS Amplify Build Script
# Script optimizado para despliegue en AWS Amplify

set -e  # Exit on any error

echo "🚀 Iniciando build para AWS Amplify..."
echo "📅 $(date)"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Crear directorio dist
echo -e "${BLUE}📁 Creando directorio de distribución...${NC}"
mkdir -p dist

# Función para copiar archivos con verificación
copy_with_check() {
    local src=$1
    local dest=$2
    local desc=$3

    if [ -e "$src" ]; then
        cp -r "$src" "$dest"
        echo -e "${GREEN}✅ $desc copiado correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️ $desc no encontrado: $src${NC}"
    fi
}

# Copiar archivos y directorios
echo -e "${BLUE}📦 Copiando assets...${NC}"
copy_with_check "assets" "dist/" "Assets (imágenes, videos, etc.)"
copy_with_check "css" "dist/" "Estilos CSS"
copy_with_check "js" "dist/" "Scripts JavaScript"
copy_with_check "post" "dist/" "Posts del blog"
copy_with_check "functions" "dist/" "Functions (API)"
copy_with_check "widgets" "dist/" "Widgets"

# Copiar archivos individuales
echo -e "${BLUE}📄 Copiando archivos individuales...${NC}"
copy_with_check "*.html" "dist/" "Archivos HTML"
copy_with_check "*.json" "dist/" "Archivos JSON"
copy_with_check "*.xml" "dist/" "Archivos XML"
copy_with_check "*.txt" "dist/" "Archivos de texto"
copy_with_check "_headers" "dist/" "Headers file"
copy_with_check "manifest.json" "dist/" "Web manifest"

# Verificar video background en posts
echo -e "${BLUE}🎥 Verificando video background en posts...${NC}"
if [ -d "dist/post" ]; then
    video_posts=$(find dist/post -name "*.html" -exec grep -l "video-background" {} \; | wc -l)
    total_posts=$(find dist/post -name "*.html" | wc -l)
    echo -e "${GREEN}📊 Posts con video background: $video_posts de $total_posts${NC}"

    if [ "$video_posts" -eq "$total_posts" ]; then
        echo -e "${GREEN}✅ Todos los posts tienen video background configurado${NC}"
    else
        echo -e "${YELLOW}⚠️ Algunos posts podrían no tener video background${NC}"
    fi
else
    echo -e "${RED}❌ Directorio de posts no encontrado${NC}"
fi

# Verificar archivos críticos
echo -e "${BLUE}🔍 Verificando archivos críticos...${NC}"
critical_files=(
    "dist/assets/video/background-1080p.webm"
    "dist/assets/video/mobile-background.webm"
    "dist/js/video-background.min.js"
    "dist/js/video-background.js"
    "dist/index.html"
    "dist/blog.html"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo -e "${GREEN}✅ $file ($size)${NC}"
    else
        echo -e "${RED}❌ $file no encontrado${NC}"
    fi
done

# Verificar que los paths sean correctos en posts
echo -e "${BLUE}🔗 Verificando rutas relativas en posts...${NC}"
if [ -d "dist/post" ]; then
    # Verificar que las rutas ../js/video-background.min.js sean correctas
    posts_with_correct_path=$(find dist/post -name "*.html" -exec grep -l "../js/video-background.min.js" {} \; | wc -l)
    echo -e "${GREEN}📊 Posts con ruta correcta al script: $posts_with_correct_path${NC}"
fi

# Mostrar estructura final
echo -e "${BLUE}📋 Estructura final del directorio dist:${NC}"
ls -la dist/

echo -e "${BLUE}📋 Contenido de subdirectorios:${NC}"
for dir in assets css js post functions widgets; do
    if [ -d "dist/$dir" ]; then
        echo -e "${GREEN}📁 dist/$dir:${NC}"
        ls -la "dist/$dir/" | head -10
        total_files=$(find "dist/$dir" -type f | wc -l)
        echo -e "${BLUE}   Total archivos: $total_files${NC}"
        echo
    fi
done

# Verificar tamaño total
total_size=$(du -sh dist/ | cut -f1)
echo -e "${GREEN}📏 Tamaño total del build: $total_size${NC}"

echo -e "${GREEN}🎉 Build completado exitosamente${NC}"
echo -e "${BLUE}📋 Resumen:${NC}"
echo -e "  • Directorio: dist/"
echo -e "  • Tamaño: $total_size"
echo -e "  • Posts: $total_posts"
echo -e "  • Posts con video: $video_posts"
echo -e "${GREEN}✅ Listo para despliegue en AWS Amplify${NC}"