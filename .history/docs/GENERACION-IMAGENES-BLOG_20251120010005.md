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
Para generar todas las 30 imágenes:

```bash
./scripts/generate-blog-images.sh
```

### Tiempo Estimado
- **Tiempo por imagen**: ~30-45 segundos
- **Total**: Aproximadamente 15-20 minutos para las 30 imágenes

### Monitoreo
El script muestra en tiempo real:
- Progreso actual (X/30)
- ID del post procesándose
- Preview del prompt (primeros 100 caracteres)
- Resultado de cada generación (✓ exitosa / ✗ fallida)
- Cuenta regresiva de 30 segundos entre peticiones

## Estructura de Prompts Optimizados

Cada prompt incluye:

1. **Tipo de Ilustración**: Digital, cinematográfica, técnica, etc.
2. **Resolución**: Siempre 1920x1080px
3. **Elementos Principales**: Descripción detallada del contenido
4. **Iluminación**: Especificaciones de luz y tonos
5. **Composición**: Estructura visual y perspectiva
6. **Paleta de Colores**: Colores específicos y atmósfera
7. **Estilo**: Fotorealista, infográfico, artístico, etc.

### Ejemplo de Prompt Optimizado

```
Professional digital illustration, vibrant colors, high resolution 1920x1080px. 
Show a versatile 6-member musical group 'La Célula' on a modern illuminated stage. 
Include: electric guitar, bass, drums, keyboard, saxophone, and vocalist. 
Stage lighting with purple, blue, and amber tones. 
Festive atmosphere with subtle crowd silhouettes. 
Photorealistic style with dynamic composition, warm color palette, 
bokeh background effects. Sharp focus on instruments and musicians.
```

## Mapeo de Posts

| Post ID | Tema | Categoría |
|---------|------|-----------|
| 0 | Presentación La Célula | Introducción |
| 1 | Timeline Musical 80s-2025 | Historia |
| 2 | Evento Corporativo | Corporativos |
| 3 | DJ vs Banda en Vivo | Comparación |
