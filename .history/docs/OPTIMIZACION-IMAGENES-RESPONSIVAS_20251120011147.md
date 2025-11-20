# Optimización de Imágenes Responsivas

Script completo para convertir imágenes JPG/PNG a formatos modernos (WebP y AVIF) en múltiples tamaños responsivos, con generación automática de templates HTML.

## 📋 Requisitos

### Dependencias del Sistema

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install imagemagick webp libavif-bin

# macOS (con Homebrew)
brew install imagemagick webp libavif

# Fedora/RHEL
sudo dnf install ImageMagick libwebp-tools libavif
```

## 🚀 Uso Básico

### Sintaxis

```bash
bash scripts/optimize-images-responsive.sh [INPUT_DIR] [OUTPUT_DIR] [SIZES]
```

### Parámetros

| Parámetro | Descripción | Default | Ejemplo |
|-----------|-------------|---------|---------|
| `INPUT_DIR` | Directorio con imágenes originales | `./assets/images` | `./photos` |
| `OUTPUT_DIR` | Directorio de salida | `./assets/images/optim` | `./optimized` |
