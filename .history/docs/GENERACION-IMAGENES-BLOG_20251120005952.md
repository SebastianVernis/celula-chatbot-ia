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
- **Ubicación**: `assets/images/blog-generated/`
- **Contenido**:
  - Imágenes generadas: `post-{ID}.png`
  - Logs de generación con timestamp
  - Archivos de respuesta JSON (en caso de error)

## Requisitos Previos

### API Key de Blackbox AI
Necesitas configurar tu API key como variable de entorno:

```bash
export BLACKBOX_API_KEY='tu_clave_api_aqui'
```

**Nota**: Para hacerla permanente, agrégala a tu archivo `~/.bashrc` o `~/.zshrc`:

```bash
echo 'export BLACKBOX_API_KEY="tu_clave_api_aqui"' >> ~/.bashrc
source ~/.bashrc
```

### Dependencias del Sistema
- `curl` (para peticiones HTTP)
- `bash` 4.0 o superior (para arrays asociativos)

## Uso

### Ejecución Completa
