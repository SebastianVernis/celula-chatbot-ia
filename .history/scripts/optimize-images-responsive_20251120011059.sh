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
            
