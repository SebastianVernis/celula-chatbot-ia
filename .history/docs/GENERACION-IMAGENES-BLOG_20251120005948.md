# Generación Automática de Imágenes para Blog

## Descripción

Sistema automatizado para generar imágenes ilustrativas para los artículos del blog del Grupo Musical La Célula utilizando la API de Blackbox AI con el modelo Kandinsky 2.2.

## Archivos Principales

### 1. Prompts Optimizados
- **Ubicación**: `docs/INDICE-ARTICULOS-BLOG_PROMPTS_OPTIMIZADO.txt`
- **Contenido**: 30 prompts detallados y optimizados para generar imágenes profesionales
- **Características**:
  - Resolución especificada: 1920x1080px
  - Estilo artístico detallado
  - Especificaciones de iluminación y composición
  - Paletas de colores definidas
  - Detalles técnicos precisos

### 2. Script de Generación Automática
- **Ubicación**: `scripts/generate-blog-images.sh`
- **Funcionalidad**:
  - Genera automáticamente las 30 imágenes
  - Intervalo de 30 segundos entre peticiones
  - Manejo de errores y logging
  - Progreso visual con colores
  - Estadísticas finales

### 3. Directorio de Salida
