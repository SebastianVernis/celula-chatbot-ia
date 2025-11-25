#!/bin/bash

# Script de limpieza para el proyecto celula-site
# Elimina archivos temporales y reorganiza el proyecto

echo "🧹 Iniciando limpieza del proyecto..."

# Directorio raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Limpiar archivos temporales
echo "📁 Limpiando archivos temporales..."
rm -rf temp/*
rm -rf tmp/*
rm -rf .history/

# Limpiar node_modules si se solicita
if [ "$1" == "--deep" ]; then
    echo "🔄 Limpieza profunda: eliminando node_modules..."
    rm -rf node_modules/
    rm -rf functions/node_modules/
    rm -f package-lock.json
    rm -f functions/package-lock.json
fi

# Limpiar archivos de backup
echo "💾 Limpiando archivos de backup..."
find . -type f -name "*.bak" -delete
find . -type f -name "*.backup" -delete
find . -type f -name "*~" -delete

# Limpiar archivos de sistema
echo "🖥️  Limpiando archivos de sistema..."
find . -type f -name ".DS_Store" -delete
find . -type f -name "Thumbs.db" -delete

# Mostrar resumen
echo ""
echo "✅ Limpieza completada!"
echo ""
echo "Estructura actual:"
tree -L 1 -d

if [ "$1" == "--deep" ]; then
    echo ""
    echo "⚠️  Node modules eliminados. Ejecuta 'npm install' para reinstalarlos."
fi
