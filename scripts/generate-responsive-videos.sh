#!/bin/bash

# Script para generar videos responsivos (480p, 720p, 1080p)
echo "🎬 Generando videos responsivos..."

# Verificar que ffmpeg esté instalado
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Error: ffmpeg no está instalado. Instálalo para continuar."
    exit 1
fi

# Verificar argumentos
if [ $# -eq 0 ]; then
    echo "Uso: $0 <video-input>"
    echo "Ejemplo: $0 assets/video/mi-video.mov"
    exit 1
fi

INPUT_VIDEO="$1"
BASE_NAME="${INPUT_VIDEO%.*}"

# Resoluciones a generar
RESOLUTIONS=("480" "720" "1080")

# Verificar que el archivo de entrada existe
if [ ! -f "$INPUT_VIDEO" ]; then
    echo "❌ Error: El archivo '$INPUT_VIDEO' no existe."
    exit 1
fi

echo "📁 Archivo de entrada: $INPUT_VIDEO"
echo ""

for res in "${RESOLUTIONS[@]}"; do
    OUTPUT_VIDEO="${BASE_NAME}-${res}p.mp4"
    echo "⚙️  Generando versión de ${res}p -> ${OUTPUT_VIDEO}"

    # Optimización para video de fondo web
    # -vf scale: -1 para mantener aspect ratio
    # -crf 28: balance calidad/tamaño
    # -preset slow: mejor compresión
    # -an: sin audio
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "scale=-1:${res}" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -an \
        -y \
        "$OUTPUT_VIDEO"

    if [ $? -eq 0 ]; then
        NEW_SIZE=$(du -h "$OUTPUT_VIDEO" | cut -f1)
        echo "✅ Generado: ${OUTPUT_VIDEO} (${NEW_SIZE})"
        echo ""
    else
        echo "❌ Error generando la versión de ${res}p."
    fi
done

echo "✅ Proceso de generación de videos responsivos completado."
