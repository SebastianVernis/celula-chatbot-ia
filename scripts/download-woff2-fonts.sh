#!/bin/bash

# Script para descargar fuentes WOFF2 directamente
# Grupo Musical La Célula - Optimizaciones

echo "🔤 Descargando fuentes WOFF2 directamente..."

# Crear directorio de fuentes
mkdir -p assets/fonts

# URLs de las fuentes en formato WOFF2 desde Google Fonts CDN
# Open Sans - Regular (400), 600, 700
echo "📥 Descargando Open Sans Regular (400)..."
curl -L "https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2" -o "assets/fonts/open-sans-v34-latin-regular.woff2"

echo "📥 Descargando Open Sans 600..."
curl -L "https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu0SC55I.woff2" -o "assets/fonts/open-sans-v34-latin-600.woff2"

echo "📥 Descargando Open Sans 700..."
curl -L "https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSGmu0SC55I.woff2" -o "assets/fonts/open-sans-v34-latin-700.woff2"

# Lobster - Regular
echo "📥 Descargando Lobster Regular..."
curl -L "https://fonts.gstatic.com/s/lobster/v28/neILzCirqoswsqX9zoKmM4MwWJU.woff2" -o "assets/fonts/lobster-v28-latin-regular.woff2"

# Raleway - Regular (400), 600
echo "📥 Descargando Raleway Regular (400)..."
curl -L "https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPNyCAIT4ttDfCmxA.woff2" -o "assets/fonts/raleway-v28-latin-regular.woff2"

echo "📥 Descargando Raleway 600..."
curl -L "https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPNyCAIT4ttDfCmxA.woff2" -o "assets/fonts/raleway-v28-latin-600.woff2"

echo "✅ Fuentes WOFF2 descargadas"
echo ""
echo "📊 Tamaños de archivos:"
du -sh assets/fonts/*
echo ""
echo "🚀 Recuerda actualizar index.html para usar estas fuentes localmente"