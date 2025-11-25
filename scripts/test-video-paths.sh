#!/bin/bash

# Video Paths Testing Script
# Verifica que las rutas de video background funcionen correctamente

set -e

echo "🎥 Iniciando prueba de rutas de video background..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Contadores
total_posts=0
posts_with_video=0
correct_paths=0
missing_files=0

# Verificar archivos de video
echo -e "${BLUE}📹 Verificando archivos de video...${NC}"

video_files=(
    "assets/video/background-1080p.webm"
    "assets/video/mobile-background.webm"
    "assets/video/background-720p.webm"
    "assets/video/hero-snippet.webm"
)

for video in "${video_files[@]}"; do
    if [ -f "$video" ]; then
        size=$(du -h "$video" | cut -f1)
        echo -e "${GREEN}✅ $video ($size)${NC}"
    else
        echo -e "${RED}❌ $video - FALTANTE${NC}"
        ((missing_files++))
    fi
done

# Verificar scripts de video background
echo -e "${BLUE}🔧 Verificando scripts de video background...${NC}"

script_files=(
    "js/video-background.js"
    "js/video-background.min.js"
)

for script in "${script_files[@]}"; do
    if [ -f "$script" ]; then
        size=$(du -h "$script" | cut -f1)
        echo -e "${GREEN}✅ $script ($size)${NC}"

        # Verificar que contiene las clases esperadas
        if grep -q "PersistentVideoBackground" "$script"; then
            echo -e "${GREEN}  ✅ Contiene clase PersistentVideoBackground${NC}"
        else
            echo -e "${YELLOW}  ⚠️ No contiene clase PersistentVideoBackground${NC}"
        fi
    else
        echo -e "${RED}❌ $script - FALTANTE${NC}"
        ((missing_files++))
    fi
done

# Verificar imágenes de fallback
echo -e "${BLUE}🖼️ Verificando imágenes de fallback...${NC}"

fallback_images=(
    "assets/images/hero-background.webp"
    "assets/images/hero-background-480w.webp"
    "assets/images/hero-background-768w.webp"
    "assets/images/hero-background-1024w.webp"
    "assets/images/hero-background-1920w.webp"
    "assets/images/mobile-background.webp"
)

fallback_missing=0
for image in "${fallback_images[@]}"; do
    if [ -f "$image" ]; then
        size=$(du -h "$image" | cut -f1)
        echo -e "${GREEN}✅ $image ($size)${NC}"
    else
        echo -e "${YELLOW}⚠️ $image - Imagen de fallback faltante${NC}"
        ((fallback_missing++))
    fi
done

# Verificar rutas en posts
if [ -d "post" ]; then
    echo -e "${BLUE}📝 Verificando rutas en posts del blog...${NC}"

    for post in post/post-*.html; do
        if [ -f "$post" ]; then
            ((total_posts++))
            filename=$(basename "$post")

            # Verificar si tiene video background
            if grep -q "video-background" "$post"; then
                ((posts_with_video++))
                echo -e "${BLUE}🔍 Analizando: $filename${NC}"

                # Verificar ruta del script
                if grep -q "\.\./js/video-background\.min\.js" "$post"; then
                    ((correct_paths++))
                    echo -e "${GREEN}  ✅ Ruta correcta al script${NC}"

                    # Simular la ruta desde el post
                    script_path="js/video-background.min.js"
                    if [ -f "$script_path" ]; then
                        echo -e "${GREEN}  ✅ Archivo de script existe${NC}"
                    else
                        echo -e "${RED}  ❌ Archivo de script no encontrado${NC}"
                    fi
                else
                    echo -e "${RED}  ❌ Ruta incorrecta o faltante al script${NC}"
                fi

                # Verificar otras rutas relativas
                if grep -q "\.\./assets/" "$post"; then
                    echo -e "${GREEN}  ✅ Rutas a assets presentes${NC}"
                else
                    echo -e "${YELLOW}  ⚠️ No se encontraron rutas a assets${NC}"
                fi

                if grep -q "\.\./css/" "$post"; then
                    echo -e "${GREEN}  ✅ Rutas a CSS presentes${NC}"
                else
                    echo -e "${YELLOW}  ⚠️ No se encontraron rutas a CSS${NC}"
                fi

            else
                echo -e "${RED}❌ $filename - Sin video background${NC}"
            fi

            echo ""
        fi
    done
else
    echo -e "${RED}❌ Directorio de posts no encontrado${NC}"
fi

# Verificar estructura del video background script
echo -e "${BLUE}🔧 Analizando configuración de video background...${NC}"

if [ -f "js/video-background.min.js" ]; then
    # Verificar rutas de video en el script
    if grep -q "background-1080p\.webm" "js/video-background.min.js"; then
        echo -e "${GREEN}✅ Referencia a background-1080p.webm encontrada${NC}"
    else
        echo -e "${YELLOW}⚠️ Referencia a background-1080p.webm no encontrada${NC}"
    fi

    if grep -q "mobile-background\.webm" "js/video-background.min.js"; then
        echo -e "${GREEN}✅ Referencia a mobile-background.webm encontrada${NC}"
    else
        echo -e "${YELLOW}⚠️ Referencia a mobile-background.webm no encontrada${NC}"
    fi

    # Verificar rutas de imágenes de fallback
    if grep -q "hero-background" "js/video-background.min.js"; then
        echo -e "${GREEN}✅ Referencias a imágenes de fallback encontradas${NC}"
    else
        echo -e "${YELLOW}⚠️ Referencias a imágenes de fallback no encontradas${NC}"
    fi
fi

# Generar reporte de prueba
echo -e "${BLUE}📊 REPORTE DE PRUEBA DE VIDEO PATHS${NC}"
echo -e "══════════════════════════════════════"
echo -e "Total posts analizados: $total_posts"
echo -e "Posts con video background: $posts_with_video"
echo -e "Posts con rutas correctas: $correct_paths"
echo -e "Archivos faltantes: $missing_files"
echo -e "Imágenes fallback faltantes: $fallback_missing"

# Calcular porcentajes
if [ $total_posts -gt 0 ]; then
    coverage_percent=$(( (posts_with_video * 100) / total_posts ))
    echo -e "Cobertura de video: ${coverage_percent}%"

    if [ $posts_with_video -gt 0 ]; then
        correct_percent=$(( (correct_paths * 100) / posts_with_video ))
        echo -e "Rutas correctas: ${correct_percent}%"
    fi
fi

# Resultado final
echo -e "${BLUE}📋 RESULTADO${NC}"
if [ $missing_files -eq 0 ] && [ $posts_with_video -eq $total_posts ] && [ $correct_paths -eq $posts_with_video ]; then
    echo -e "${GREEN}🎉 PRUEBA EXITOSA${NC}"
    echo -e "${GREEN}✅ Todos los video paths están configurados correctamente${NC}"
    exit 0
elif [ $missing_files -eq 0 ] && [ $correct_paths -eq $posts_with_video ]; then
    echo -e "${YELLOW}⚠️ PRUEBA PARCIALMENTE EXITOSA${NC}"
    echo -e "${YELLOW}Algunos posts no tienen video background configurado${NC}"
    exit 0
else
    echo -e "${RED}❌ PRUEBA FALLIDA${NC}"
    echo -e "${RED}Se encontraron problemas que deben ser corregidos${NC}"

    if [ $missing_files -gt 0 ]; then
        echo -e "${RED}• Archivos faltantes: $missing_files${NC}"
    fi

    if [ $correct_paths -lt $posts_with_video ]; then
        incorrect_paths=$(( posts_with_video - correct_paths ))
        echo -e "${RED}• Rutas incorrectas: $incorrect_paths${NC}"
    fi

    exit 1
fi