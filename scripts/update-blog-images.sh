#!/bin/bash

# Script para actualizar las imágenes principales de los posts del blog
# con imágenes aleatorias de la galería.

echo "🔄 Actualizando imágenes de los posts del blog..."

POST_DIR="celula-site Actual/post"
GALLERY_DIR="celula-site Actual/assets/gallery"

# Verificar que los directorios existen
if [ ! -d "$POST_DIR" ] || [ ! -d "$GALLERY_DIR" ]; then
    echo "❌ Error: No se encontraron los directorios 'post' o 'assets/gallery'."
    exit 1
fi

# Obtener la lista de imágenes de la galería
# Usamos find y sed para obtener rutas relativas correctas para los posts
images=($(find "$GALLERY_DIR" -type f -name "*.webp" | sed "s|celula-site Actual/|../|"))

if [ ${#images[@]} -eq 0 ]; then
    echo "❌ No se encontraron imágenes .webp en la galería."
    exit 1
fi

echo "🖼️  ${#images[@]} imágenes encontradas en la galería."

# Iterar sobre todos los archivos de posts
find "$POST_DIR" -type f -name "post-*.html" | while read -r post_file; do
    
    # Seleccionar una imagen aleatoria de la galería
    random_index=$(( RANDOM % ${#images[@]} ))
    new_image=${images[$random_index]}

    echo "📄 Actualizando '$post_file' con la imagen '$new_image'..."

    # Usar sed para reemplazar el src de la imagen con la clase 'post-image-full'
    # El delimitador | se usa para evitar conflictos con las barras / en las rutas
    sed -i "s|src=\"[^\"]*\" alt=\"[^\"]*\" class=\"post-img post-image-full\"|src=\"${new_image}\" alt=\"Imagen del post\" class=\"post-img post-image-full\"|g" "$post_file"

    if [ $? -eq 0 ]; then
        echo "✅ Actualización exitosa."
    else
        echo "❌ Error al actualizar '$post_file'."
    fi
done

echo ""
echo "🎉 Proceso de actualización de imágenes del blog completado."
