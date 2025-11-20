#!/bin/bash

################################################################################
# Script de Optimización de Imágenes Responsivas
# Convierte JPG/PNG a WebP y AVIF en múltiples tamaños
# Genera template HTML con srcset y sizes
################################################################################

set -e  # Salir si hay error

# ============================================================================
# CONFIGURACIÓN - MODIFICAR SEGÚN NECESIDADES
# ============================================================================

INPUT_DIR="${1:-./assets/images}"
OUTPUT_DIR="${2:-./assets/images/optim}"
SIZES="${3:-480,800,1280}"
QUALITY_WEBP=85
QUALITY_AVIF=80

# ============================================================================
# COLORES PARA OUTPUT
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# FUNCIONES
# ============================================================================

print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Verificar dependencias
check_dependencies() {
    print_header "Verificando dependencias"
    
    local missing_deps=0
    
    # Verificar ImageMagick
    if ! command -v convert &> /dev/null; then
        print_error "ImageMagick no está instalado (convert)"
        echo "  Instalar: sudo apt-get install imagemagick"
        missing_deps=1
    else
        print_success "ImageMagick instalado"
    fi
    
    # Verificar cwebp
    if ! command -v cwebp &> /dev/null; then
        print_error "cwebp no está instalado"
        echo "  Instalar: sudo apt-get install webp"
        missing_deps=1
    else
        print_success "cwebp instalado"
    fi
    
    # Verificar avifenc
    if ! command -v avifenc &> /dev/null; then
        print_error "avifenc no está instalado"
        echo "  Instalar: sudo apt-get install libavif-bin"
        missing_deps=1
    else
        print_success "avifenc instalado"
    fi
    
    if [ $missing_deps -eq 1 ]; then
        print_error "Faltan dependencias. Por favor instalarlas antes de continuar."
        exit 1
    fi
}

# Crear estructura de directorios
create_directories() {
    print_header "Creando estructura de directorios"
    
    mkdir -p "$OUTPUT_DIR/webp"
    mkdir -p "$OUTPUT_DIR/avif"
    mkdir -p "$OUTPUT_DIR/html-templates"
    
    print_success "Directorios creados en: $OUTPUT_DIR"
}

# Convertir array de tamaños a formato legible
IFS=',' read -ra SIZE_ARRAY <<< "$SIZES"

# Procesar una imagen
process_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local name="${filename%.*}"
    local extension="${filename##*.}"
    
    print_info "Procesando: $filename"
    
    # Obtener dimensiones originales
    local original_width=$(identify -format "%w" "$input_file")
    local original_height=$(identify -format "%h" "$input_file")
    
    print_info "  Dimensiones originales: ${original_width}x${original_height}"
    
    # Arrays para srcset
    local webp_srcset=()
    local avif_srcset=()
    
    # Procesar cada tamaño
    for size in "${SIZE_ARRAY[@]}"; do
        # Solo procesar si el tamaño es menor o igual al original
        if [ "$size" -le "$original_width" ]; then
            print_info "  Generando tamaño: ${size}px"
            
            # Calcular altura proporcional
            local height=$((original_height * size / original_width))
            
            # 1. Redimensionar imagen temporal
            local temp_resized="${OUTPUT_DIR}/temp_${name}_${size}.png"
            convert "$input_file" -resize "${size}x${height}" -quality 95 "$temp_resized"
            
            # 2. Convertir a WebP
            local webp_output="${OUTPUT_DIR}/webp/${name}_${size}w.webp"
            cwebp -q "$QUALITY_WEBP" "$temp_resized" -o "$webp_output" &> /dev/null
            local webp_size=$(du -h "$webp_output" | cut -f1)
            print_success "    WebP: ${name}_${size}w.webp (${webp_size})"
            webp_srcset+=("${name}_${size}w.webp ${size}w")
            
            # 3. Convertir a AVIF
            local avif_output="${OUTPUT_DIR}/avif/${name}_${size}w.avif"
            avifenc -s 4 -q "$QUALITY_AVIF" "$temp_resized" "$avif_output" &> /dev/null
            local avif_size=$(du -h "$avif_output" | cut -f1)
            print_success "    AVIF: ${name}_${size}w.avif (${avif_size})"
            avif_srcset+=("${name}_${size}w.avif ${size}w")
            
            # Limpiar temporal
            rm "$temp_resized"
        else
            print_info "  Saltando tamaño ${size}px (mayor que el original)"
        fi
    done
    
    # Generar template HTML
    generate_html_template "$name" "$webp_srcset" "$avif_srcset" "$filename"
}

# Generar template HTML
generate_html_template() {
    local name="$1"
    shift
    local webp_srcset=("$@")
    
    # Separar arrays (los primeros N elementos son webp, el resto avif)
    local half=$((${#webp_srcset[@]} / 2))
    local webp_list=("${webp_srcset[@]:0:$half}")
    local avif_list=("${webp_srcset[@]:$half}")
    local original_filename="${webp_srcset[-1]}"
    
    local html_file="${OUTPUT_DIR}/html-templates/${name}.html"
    
    cat > "$html_file" << 'EOF'
<!-- Template HTML con srcset y múltiples formatos -->
<picture>
    <!-- AVIF (mejor compresión, soporte moderno) -->
    <source
        type="image/avif"
        srcset="
EOF
    
    # Agregar srcset AVIF
    local first=true
    for item in "${avif_list[@]}"; do
        if [ "$first" = true ]; then
            echo "            ./assets/images/optim/avif/$item" >> "$html_file"
            first=false
        else
            echo "            ./assets/images/optim/avif/$item," >> "$html_file"
        fi
    done
    
    cat >> "$html_file" << 'EOF'
        "
        sizes="(max-width: 480px) 100vw,
               (max-width: 800px) 90vw,
               (max-width: 1280px) 80vw,
               1280px">

    <!-- WebP (buena compresión, amplio soporte) -->
    <source
        type="image/webp"
        srcset="
EOF
    
    # Agregar srcset WebP
    first=true
    for item in "${webp_list[@]}"; do
        if [ "$first" = true ]; then
            echo "            ./assets/images/optim/webp/$item" >> "$html_file"
            first=false
        else
            echo "            ./assets/images/optim/webp/$item," >> "$html_file"
        fi
    done
    
    cat >> "$html_file" << EOF
        "
        sizes="(max-width: 480px) 100vw,
               (max-width: 800px) 90vw,
               (max-width: 1280px) 80vw,
               1280px">

    <!-- Fallback JPG/PNG (compatibilidad universal) -->
    <img
        src="./assets/images/$original_filename"
        alt="Descripción de la imagen"
        loading="lazy"
        decoding="async"
        width="1280"
        height="auto">
</picture>

<!-- 
NOTAS DE USO:
1. El navegador elegirá automáticamente el formato más eficiente que soporte
2. Los atributos 'sizes' indican al navegador qué tamaño de imagen cargar según el viewport
3. 'loading="lazy"' carga la imagen solo cuando está cerca del viewport
4. 'decoding="async"' evita bloquear el renderizado mientras decodifica la imagen

PERSONALIZACIÓN:
- Modificar 'alt' con descripción relevante para SEO y accesibilidad
