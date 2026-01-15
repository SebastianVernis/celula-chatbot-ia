#!/bin/bash

# Directorio raíz de tu sitio web (ej. /var/www/html)
SITE_DIR="/home/sebastianvernis/celula-chatbot-ia/"
# URL base de tu sitio
BASE_URL="https://www.grupomusicalcelula.com"
# Nombre del archivo sitemap
SITEMAP_FILE="sitemap.xml"

# Crear directorio temporal para almacenar URLs
TEMP_DIR=$(mktemp -d)
HTML_SITEMAP="$TEMP_DIR/html_sitemap.tmp"
CSS_SITEMAP="$TEMP_DIR/css_sitemap.tmp"
JS_SITEMAP="$TEMP_DIR/js_sitemap.tmp"
IMAGE_SITEMAP="$TEMP_DIR/image_sitemap.tmp"
VIDEO_SITEMAP="$TEMP_DIR/video_sitemap.tmp"

echo "Generando sitemap para archivos HTML..."

# Buscar archivos HTML y generar entradas
find $SITE_DIR -name "*.html" -type f | while read file; do
    # Calcular la ruta relativa y la URL
    relative_path="${file#$SITE_DIR}"
    url="$BASE_URL/$relative_path"

    # Reemplazar backslashes por forward slashes (en caso de problemas de formato)
    url=$(echo "$url" | sed 's/\\/\//g' | sed 's/\/\//\//g')

    # Obtener fecha de última modificación (formato YYYY-MM-DD)
    lastmod=$(stat -c %y "$file" | cut -d' ' -f1)

    # Determinar prioridad y frecuencia de cambio según la importancia de la página
    if [[ "$relative_path" == "index.html" ]]; then
        changefreq="weekly"
        priority="1.0"
    elif [[ "$relative_path" == "blog.html" ]]; then
        changefreq="weekly"
        priority="0.9"
    elif [[ "$relative_path" == "cotizador.html" || "$relative_path" == "galeria.html" || "$relative_path" == "testimonios.html" ]]; then
        changefreq="monthly"
        priority="0.9"
    elif [[ "$relative_path" == marketing/* ]]; then
        changefreq="monthly"
        priority="0.8"
    elif [[ "$relative_path" == post/* ]]; then
        changefreq="monthly"
        priority="0.7"
    else
        changefreq="yearly"
        priority="0.5"
    fi

    # Añadir la entrada al sitemap temporal
    cat >> "$HTML_SITEMAP" << EOF
  <url>
    <loc>$url</loc>
    <lastmod>$lastmod</lastmod>
    <changefreq>$changefreq</changefreq>
    <priority>$priority</priority>
  </url>
EOF
done

# Añadir CSS files
echo "Generando sitemap para archivos CSS..."
find $SITE_DIR -name "*.css" -type f | while read file; do
    relative_path="${file#$SITE_DIR}"
    url="$BASE_URL/$relative_path"
    url=$(echo "$url" | sed 's/\\/\//g' | sed 's/\/\//\//g')
    lastmod=$(stat -c %y "$file" | cut -d' ' -f1)

    cat >> "$CSS_SITEMAP" << EOF
  <url>
    <loc>$url</loc>
    <lastmod>$lastmod</lastmod>
  </url>
EOF
done

# Añadir JS files
echo "Generando sitemap para archivos JS..."
find $SITE_DIR -name "*.js" -type f | while read file; do
    relative_path="${file#$SITE_DIR}"
    url="$BASE_URL/$relative_path"
    url=$(echo "$url" | sed 's/\\/\//g' | sed 's/\/\//\//g')
    lastmod=$(stat -c %y "$file" | cut -d' ' -f1)

    cat >> "$JS_SITEMAP" << EOF
  <url>
    <loc>$url</loc>
    <lastmod>$lastmod</lastmod>
  </url>
EOF
done

# Añadir imágenes
echo "Generando sitemap para imágenes..."
find $SITE_DIR -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.gif" \) | while read file; do
    relative_path="${file#$SITE_DIR}"
    url="$BASE_URL/$relative_path"
    url=$(echo "$url" | sed 's/\\/\//g' | sed 's/\/\//\//g')
    lastmod=$(stat -c %y "$file" | cut -d' ' -f1)

    cat >> "$IMAGE_SITEMAP" << EOF
  <url>
    <loc>$url</loc>
    <lastmod>$lastmod</lastmod>
  </url>
EOF
done

# Añadir videos
echo "Generando sitemap para videos..."
find $SITE_DIR -type f \( -name "*.mp4" -o -name "*.webm" -o -name "*.ogg" -o -name "*.mov" -o -name "*.avi" \) | while read file; do
    relative_path="${file#$SITE_DIR}"
    url="$BASE_URL/$relative_path"
    url=$(echo "$url" | sed 's/\\/\//g' | sed 's/\/\//\//g')
    lastmod=$(stat -c %y "$file" | cut -d' ' -f1)

    cat >> "$VIDEO_SITEMAP" << EOF
  <url>
    <loc>$url</loc>
    <lastmod>$lastmod</lastmod>
  </url>
EOF
done

# Combinar todos los sitemaps en uno solo
{
    echo '<?xml version="1.0" encoding="UTF-8"?>'
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

    # Agregar URLs de HTML
    if [ -f "$HTML_SITEMAP" ]; then
        cat "$HTML_SITEMAP"
    fi

    # Agregar URLs de CSS
    if [ -f "$CSS_SITEMAP" ]; then
        cat "$CSS_SITEMAP"
    fi

    # Agregar URLs de JS
    if [ -f "$JS_SITEMAP" ]; then
        cat "$JS_SITEMAP"
    fi

    # Agregar URLs de imágenes
    if [ -f "$IMAGE_SITEMAP" ]; then
        cat "$IMAGE_SITEMAP"
    fi

    # Agregar URLs de videos
    if [ -f "$VIDEO_SITEMAP" ]; then
        cat "$VIDEO_SITEMAP"
    fi

    echo '</urlset>'
} > "$SITEMAP_FILE"

# Limpiar directorio temporal
rm -rf "$TEMP_DIR"

echo "Sitemap generado: $SITEMAP_FILE"
