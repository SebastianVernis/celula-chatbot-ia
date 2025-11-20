#!/bin/bash

# Script para descargar fuentes self-hosted
# Grupo Musical La Célula - Optimizaciones

echo "🔤 Descargando fuentes self-hosted..."

# Crear directorio de fuentes
mkdir -p assets/fonts

# URLs de las fuentes desde Google Webfonts Helper
# Open Sans
echo "📥 Descargando Open Sans..."
curl -L "https://github.com/google/fonts/raw/main/apache/opensans/OpenSans%5Bwdth%2Cwght%5D.ttf" -o "assets/fonts/open-sans-variable.ttf"

# Lobster
echo "📥 Descargando Lobster..."
curl -L "https://github.com/google/fonts/raw/main/ofl/lobster/Lobster-Regular.ttf" -o "assets/fonts/lobster-regular.ttf"

# Raleway
echo "📥 Descargando Raleway..."
curl -L "https://github.com/google/fonts/raw/main/ofl/raleway/Raleway%5Bwght%5D.ttf" -o "assets/fonts/raleway-variable.ttf"

echo "✅ Fuentes descargadas"
echo ""
echo "⚠️  NOTA: Las fuentes están en formato TTF."
echo "   Para mejor compresión, convierte a WOFF2 usando:"
echo "   https://everythingfonts.com/ttf-to-woff2"
echo ""
echo "   O descarga directamente WOFF2 desde:"
