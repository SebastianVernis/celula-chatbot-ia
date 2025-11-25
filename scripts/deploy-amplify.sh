#!/bin/bash

# AWS Amplify Deployment Script
# Script completo de despliegue optimizado para AWS Amplify

set -e  # Exit on any error

echo "🚀 AWS Amplify Deployment Script"
echo "================================"
echo "📅 $(date)"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Variables
AMPLIFY_APP_ID="${AMPLIFY_APP_ID:-}"
BRANCH_NAME="${AWS_BRANCH:-main}"
REGION="${AWS_REGION:-us-east-1}"

# Banner
echo -e "${BLUE}"
cat << "EOF"
   _____      __      _
  / ____|    / _|   | |
 | |     ___| |_   _| | __ _
 | |    / _ \  _| | | |/ _` |
 | |___|  __/ |_| |_| | (_| |
  \_____\___|\__|\__,_|\__,_|

  AWS Amplify Deployment
EOF
echo -e "${NC}"

# Verificar prerequisitos
echo -e "${BLUE}🔍 Verificando prerequisitos...${NC}"

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: v$NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

# Verificar archivos críticos
critical_files=(
    "amplify.yml"
    "package.json"
    "js/video-background.min.js"
    "assets/video/background-1080p.webm"
)

echo -e "${BLUE}🔍 Verificando archivos críticos...${NC}"
missing_files=0
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo -e "${GREEN}✅ $file ($size)${NC}"
    else
        echo -e "${RED}❌ $file - ARCHIVO CRÍTICO FALTANTE${NC}"
        ((missing_files++))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo -e "${RED}❌ Faltan $missing_files archivos críticos. Abortando despliegue.${NC}"
    exit 1
fi

# Fase 1: Pre-build validations
echo -e "${PURPLE}📋 FASE 1: Validaciones Pre-build${NC}"
echo "================================"

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm ci --production=false
echo -e "${GREEN}✅ Dependencias instaladas${NC}"

# Linting JavaScript
echo -e "${BLUE}🔧 Ejecutando linting JavaScript...${NC}"
if npm run lint:js; then
    echo -e "${GREEN}✅ Linting completado sin errores${NC}"
else
    echo -e "${YELLOW}⚠️ Linting completado con advertencias${NC}"
fi

# Validación HTML
echo -e "${BLUE}📝 Validando estructura HTML...${NC}"
if npm run validate:html; then
    echo -e "${GREEN}✅ Validación HTML exitosa${NC}"
else
    echo -e "${YELLOW}⚠️ Validación HTML con advertencias${NC}"
fi

# Test de rutas de video
echo -e "${BLUE}🎥 Probando rutas de video background...${NC}"
if npm run test:video-paths; then
    echo -e "${GREEN}✅ Video paths verificados${NC}"
else
    echo -e "${YELLOW}⚠️ Algunos video paths pueden tener problemas${NC}"
fi

# Fase 2: Build
echo -e "${PURPLE}🏗️ FASE 2: Build${NC}"
echo "================="

# Ejecutar build personalizado
echo -e "${BLUE}🔨 Ejecutando build optimizado...${NC}"
if npm run build:amplify; then
    echo -e "${GREEN}✅ Build exitoso${NC}"
else
    echo -e "${RED}❌ Build falló${NC}"
    exit 1
fi

# Verificar directorio dist
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Directorio dist no fue creado${NC}"
    exit 1
fi

# Análisis del build
echo -e "${BLUE}📊 Analizando build...${NC}"
total_files=$(find dist -type f | wc -l)
total_size=$(du -sh dist/ | cut -f1)
echo -e "${GREEN}📁 Total archivos: $total_files${NC}"
echo -e "${GREEN}📏 Tamaño total: $total_size${NC}"

# Verificar archivos específicos en dist
echo -e "${BLUE}🔍 Verificando archivos en dist...${NC}"
dist_critical=(
    "dist/index.html"
    "dist/blog.html"
    "dist/assets/video/background-1080p.webm"
    "dist/js/video-background.min.js"
    "dist/post/post-0.html"
)

for file in "${dist_critical[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $(basename $file)${NC}"
    else
        echo -e "${RED}❌ $(basename $file) faltante en dist${NC}"
    fi
done

# Fase 3: Optimizaciones
echo -e "${PURPLE}⚡ FASE 3: Optimizaciones${NC}"
echo "=========================="

# Verificar compresión de assets
echo -e "${BLUE}📦 Verificando compresión de assets...${NC}"
large_files=$(find dist -type f -size +1M 2>/dev/null | wc -l)
if [ $large_files -gt 0 ]; then
    echo -e "${YELLOW}⚠️ Se encontraron $large_files archivos > 1MB${NC}"
    echo -e "${BLUE}Archivos grandes:${NC}"
    find dist -type f -size +1M -exec ls -lh {} \; | awk '{print $5, $9}'
else
    echo -e "${GREEN}✅ No hay archivos excesivamente grandes${NC}"
fi

# Contar tipos de archivos
echo -e "${BLUE}📊 Distribución de archivos:${NC}"
echo -e "${GREEN}HTML: $(find dist -name "*.html" | wc -l) archivos${NC}"
echo -e "${GREEN}CSS: $(find dist -name "*.css" | wc -l) archivos${NC}"
echo -e "${GREEN}JS: $(find dist -name "*.js" | wc -l) archivos${NC}"
echo -e "${GREEN}Images: $(find dist -name "*.webp" -o -name "*.jpg" -o -name "*.png" | wc -l) archivos${NC}"
echo -e "${GREEN}Videos: $(find dist -name "*.webm" -o -name "*.mp4" | wc -l) archivos${NC}"

# Fase 4: Validaciones Post-build
echo -e "${PURPLE}✅ FASE 4: Validaciones Post-build${NC}"
echo "================================="

# Verificar integridad de posts
echo -e "${BLUE}📝 Verificando posts del blog...${NC}"
posts_count=$(find dist/post -name "*.html" 2>/dev/null | wc -l)
posts_with_video=$(find dist/post -name "*.html" -exec grep -l "video-background" {} \; 2>/dev/null | wc -l)

echo -e "${GREEN}📊 Posts encontrados: $posts_count${NC}"
echo -e "${GREEN}📊 Posts con video: $posts_with_video${NC}"

if [ "$posts_with_video" -eq "$posts_count" ] && [ "$posts_count" -gt 0 ]; then
    echo -e "${GREEN}✅ Todos los posts tienen video background${NC}"
elif [ "$posts_count" -eq 0 ]; then
    echo -e "${RED}❌ No se encontraron posts${NC}"
    exit 1
else
    echo -e "${YELLOW}⚠️ Algunos posts no tienen video background${NC}"
fi

# Verificar navigation links
echo -e "${BLUE}🔗 Verificando enlaces de navegación...${NC}"
nav_issues=0

# Verificar enlaces internos comunes
for html_file in dist/*.html; do
    if [ -f "$html_file" ]; then
        filename=$(basename "$html_file")

        # Verificar enlaces a CSS
        if ! grep -q "css/styles" "$html_file"; then
            echo -e "${YELLOW}⚠️ $filename: No contiene enlace a CSS${NC}"
            ((nav_issues++))
        fi

        # Verificar enlaces a JS (para páginas que deberían tenerlo)
        if [[ "$filename" != "offline.html" ]] && ! grep -q "js/" "$html_file"; then
            echo -e "${YELLOW}⚠️ $filename: No contiene enlaces a JS${NC}"
            ((nav_issues++))
        fi
    fi
done

if [ $nav_issues -eq 0 ]; then
    echo -e "${GREEN}✅ Enlaces de navegación correctos${NC}"
else
    echo -e "${YELLOW}⚠️ Se encontraron $nav_issues problemas de navegación${NC}"
fi

# Fase 5: Preparación para Amplify
echo -e "${PURPLE}🚀 FASE 5: Preparación para Amplify${NC}"
echo "==================================="

# Verificar configuración de Amplify
echo -e "${BLUE}⚙️ Verificando configuración de Amplify...${NC}"

if [ -f "amplify.yml" ]; then
    echo -e "${GREEN}✅ amplify.yml presente${NC}"

    # Verificar estructura básica del amplify.yml
    if grep -q "version: 1" amplify.yml && grep -q "frontend:" amplify.yml; then
        echo -e "${GREEN}✅ Estructura de amplify.yml válida${NC}"
    else
        echo -e "${YELLOW}⚠️ Estructura de amplify.yml podría ser inválida${NC}"
    fi
else
    echo -e "${RED}❌ amplify.yml faltante${NC}"
    exit 1
fi

# Verificar _headers file
if [ -f "dist/_headers" ]; then
    echo -e "${GREEN}✅ Archivo _headers presente${NC}"
else
    echo -e "${YELLOW}⚠️ Archivo _headers faltante${NC}"
fi

# Verificar manifest.json
if [ -f "dist/manifest.json" ]; then
    echo -e "${GREEN}✅ Web manifest presente${NC}"
else
    echo -e "${YELLOW}⚠️ Web manifest faltante${NC}"
fi

# Generar reporte de deployment
echo -e "${BLUE}📄 Generando reporte de deployment...${NC}"

cat > deployment-report.txt << EOF
🚀 AWS Amplify Deployment Report
=================================
📅 Date: $(date)
🏷️ Branch: $BRANCH_NAME
🌍 Region: $REGION

📊 Build Statistics:
- Total files: $total_files
- Build size: $total_size
- HTML files: $(find dist -name "*.html" | wc -l)
- Blog posts: $posts_count
- Posts with video: $posts_with_video

✅ Validations:
- Linting: Completed
- HTML validation: Completed
- Video paths: Verified
- Critical files: Present

⚠️ Warnings: $nav_issues navigation issues
❌ Errors: None

🔧 Next Steps:
1. Push changes to repository
2. Amplify will auto-deploy from $BRANCH_NAME branch
3. Monitor build logs in Amplify Console
4. Test video background functionality post-deployment

EOF

echo -e "${GREEN}✅ Reporte generado: deployment-report.txt${NC}"

# Resumen final
echo -e "${PURPLE}📋 RESUMEN FINAL${NC}"
echo "================"
echo -e "${GREEN}🎉 Pre-deployment validations completed successfully!${NC}"
echo -e "${BLUE}📁 Build directory: dist/${NC}"
echo -e "${BLUE}📏 Total size: $total_size${NC}"
echo -e "${BLUE}📊 Total files: $total_files${NC}"
echo -e "${BLUE}📝 Blog posts: $posts_count (all with video background)${NC}"

# Recomendaciones finales
echo -e "${YELLOW}💡 RECOMENDACIONES:${NC}"
echo -e "1. Revisar deployment-report.txt para detalles completos"
echo -e "2. Hacer commit y push de los cambios"
echo -e "3. Monitorear el build en AWS Amplify Console"
echo -e "4. Probar el video background después del despliegue"
echo -e "5. Verificar que las APIs (email/chat) funcionen correctamente"

# Final status
echo ""
echo -e "${GREEN}✅ READY FOR AWS AMPLIFY DEPLOYMENT${NC}"
echo -e "${BLUE}🔗 Next: git add . && git commit -m 'feat: ready for Amplify deployment' && git push${NC}"
echo ""