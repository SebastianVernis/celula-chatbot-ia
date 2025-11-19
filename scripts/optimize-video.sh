#!/bin/bash

# Script de optimización de videos para fondo web
# Optimiza videos manteniendo calidad visual aceptable

echo "🎥 Script de Optimización de Video para Web"
echo "========================================="
echo ""

# Verificar que ffmpeg esté instalado
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Error: ffmpeg no está instalado"
    echo "Instalar con: sudo apt install ffmpeg"
    exit 1
fi

# Verificar argumentos
if [ $# -eq 0 ]; then
    echo "Uso: $0 <video-input> [video-output]"
    echo ""
    echo "Ejemplo:"
    echo "  $0 assets/video/mi-video.mp4"
    echo "  $0 assets/video/mi-video.mp4 assets/video/optimizado.mp4"
    echo ""
    exit 1
fi

INPUT_VIDEO="$1"
OUTPUT_VIDEO="${2:-${INPUT_VIDEO%.*}-optimized.mp4}"

# Verificar que el archivo existe
if [ ! -f "$INPUT_VIDEO" ]; then
    echo "❌ Error: El archivo '$INPUT_VIDEO' no existe"
    exit 1
fi

echo "📁 Archivo de entrada: $INPUT_VIDEO"
echo "📁 Archivo de salida: $OUTPUT_VIDEO"
echo ""

# Obtener información del video original
echo "📊 Analizando video original..."
ORIGINAL_SIZE=$(du -h "$INPUT_VIDEO" | cut -f1)
echo "   Tamaño original: $ORIGINAL_SIZE"
echo ""

# Optimización para video de fondo web
# - Resolución: 1920x1080 (Full HD) o menor si el original es más pequeño
# - Codec: H.264 (mejor compatibilidad)
# - Bitrate: ~2.5Mbps (balance entre calidad y tamaño)
# - Audio: Eliminado (los videos de fondo no necesitan audio)
# - Frame rate: 30fps máximo
# - CRF: 28 (Constant Rate Factor - 0=sin pérdida, 51=peor calidad)

echo "⚙️  Optimizando video..."
echo "   - Codec: H.264"
echo "   - Resolución máxima: 1920x1080"
echo "   - CRF: 28 (calidad optimizada)"
echo "   - Sin audio (video de fondo)"
echo "   - FPS: 30 máximo"
echo ""

ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,fps=30" \
    -c:v libx264 \
    -preset slow \
    -crf 28 \
    -profile:v main \
    -level 4.0 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    -y \
    "$OUTPUT_VIDEO"

# Verificar que la conversión fue exitosa
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Optimización completada exitosamente"
    echo ""
    
    # Mostrar comparación de tamaños
    NEW_SIZE=$(du -h "$OUTPUT_VIDEO" | cut -f1)
    ORIGINAL_BYTES=$(stat -f%z "$INPUT_VIDEO" 2>/dev/null || stat -c%s "$INPUT_VIDEO")
    NEW_BYTES=$(stat -f%z "$OUTPUT_VIDEO" 2>/dev/null || stat -c%s "$OUTPUT_VIDEO")
    REDUCTION=$(echo "scale=1; 100 - ($NEW_BYTES * 100 / $ORIGINAL_BYTES)" | bc)
    
    echo "📊 Resultados:"
    echo "   Original: $ORIGINAL_SIZE"
    echo "   Optimizado: $NEW_SIZE"
    echo "   Reducción: ${REDUCTION}%"
    echo ""
    echo "💾 Archivo guardado en: $OUTPUT_VIDEO"
    echo ""
    echo "🎯 Siguiente paso: Reemplazar el video en tu HTML"
    echo "   <video src=\"$OUTPUT_VIDEO\"></video>"
else
    echo ""
    echo "❌ Error durante la optimización"
    exit 1
fi
