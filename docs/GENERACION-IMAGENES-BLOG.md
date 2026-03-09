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
| 4 | Géneros Musicales Boda | Bodas |
| 5 | Recepción de Boda | Bodas |
| 6 | Proceso de Contratación | Guía |
| 8 | Momentos Clave del Evento | Bodas |
| 9 | Boda Romántica | Bodas |
| 10 | Música y Emociones | Ciencia |
| 11 | Playlist de Boda | Bodas |
| 12 | Setup Técnico | Técnico |
| 13 | Lanzamiento de Producto | Corporativos |
| 14 | Errores Comunes | Guía |
| 15 | Testimoniales | Social Proof |
| 16 | Fiesta XV Años | Quinceañeras |
| 17 | Hotel de Lujo | Bodas Premium |
| 18 | Presentación Visual | Imagen |
| 19 | Primera Danza | Bodas |
| 20 | Posada Navideña | Festividades |
| 21 | Team Building | Corporativos |
| 22 | Música vs Jukebox | Comparación |
| 23 | Visión 2026 | Futuro |
| 24 | Mapa de Proveedores | Logística |
| 25 | Gala Formal | Eventos Premium |
| 26 | Baile de Cumbia | Cultural |
| 27 | Checklist de Preguntas | Guía |
| 28 | Aniversario | Bodas |
| 29 | Behind the Scenes | Producción |
| 30 | Contrato Profesional | Legal |

## Manejo de Errores

### El script maneja automáticamente:

1. **Falta de API Key**: Detiene ejecución y muestra instrucciones
2. **Errores HTTP**: Guarda respuesta en archivo JSON para debug
3. **Respuestas sin URL**: Guarda respuesta completa para análisis
4. **Fallos de descarga**: Registra error y continúa con siguiente imagen

### Archivos de Debug

En caso de error, revisa:
- `assets/images/blog-generated/post-{ID}_error.json` - Errores HTTP
- `assets/images/blog-generated/post-{ID}_response.json` - Respuestas sin URL
- `assets/images/blog-generated/generation_log_*.txt` - Log completo

## Resumen Post-Ejecución

Al finalizar, el script muestra:
- Total de imágenes procesadas
- Cantidad exitosa
- Cantidad fallida
- Timestamp de inicio y fin
- Ubicación del directorio de salida
- Ubicación del archivo de log

## Mejoras Respecto a la Versión Original

### Prompts Optimizados
✅ Especificaciones técnicas detalladas (resolución, formato)  
✅ Descripciones de iluminación profesional  
✅ Paletas de colores definidas  
✅ Estilos artísticos específicos  
✅ Detalles de composición visual  
✅ Referencias de atmósfera y mood  

### Script de Automatización
✅ Procesamiento batch de 30 imágenes  
✅ Intervalo configurable entre peticiones  
✅ Output con colores para mejor legibilidad  
✅ Barra de progreso visual  
✅ Manejo robusto de errores  
✅ Logging automático  
✅ Validación de API key  
✅ Creación automática de directorios  
✅ Estadísticas finales  

## Personalización

### Modificar el Intervalo entre Peticiones

Edita la línea 176 en `generate-blog-images.sh`:

```bash
sleep 30  # Cambia 30 por los segundos deseados
```

### Modificar el Directorio de Salida

Edita la línea 17:

```bash
OUTPUT_DIR="tu/directorio/personalizado"
```

### Generar Solo Algunas Imágenes

Modifica la línea 172 para incluir solo los IDs deseados:

```bash
for post_id in 0 5 10 15; do  # Solo estas 4 imágenes
```

## Integración con el Blog

Una vez generadas las imágenes:

1. Revisa la calidad en `assets/images/blog-generated/`
2. Copia las imágenes aprobadas al directorio de blog correspondiente
3. Renombra si es necesario para seguir la convención del proyecto
4. Actualiza las referencias en los archivos HTML de los posts

## Solución de Problemas

### Error: "BLACKBOX_API_KEY no está configurada"
```bash
export BLACKBOX_API_KEY='tu_clave_aqui'
```

### Error: "Permission denied"
```bash
chmod +x scripts/generate-blog-images.sh
```

### Imágenes no se generan
1. Verifica tu conexión a internet
2. Confirma que la API key es válida
3. Revisa los archivos `*_error.json` para detalles

### El script se detiene prematuramente
- Verifica que tienes suficiente espacio en disco
- Revisa los logs para identificar el punto de falla
- Puedes reiniciar desde un post específico modificando el loop

## Mantenimiento

### Actualizar Prompts
Edita `docs/INDICE-ARTICULOS-BLOG_PROMPTS_OPTIMIZADO.txt` y luego actualiza el array PROMPTS en el script.

### Agregar Nuevos Posts
1. Agrega el prompt al archivo de texto
2. Agrega la entrada al array PROMPTS en el script
3. Incluye el nuevo ID en el loop de generación
4. Incrementa TOTAL_IMAGES

## Licencia y Créditos

- **Proyecto**: Grupo Musical La Célula
- **Tecnología**: Blackbox AI - Kandinsky 2.2
- **Versión**: 1.0
- **Fecha**: Noviembre 2025

---

**Nota**: Este sistema está diseñado para generar ilustraciones conceptuales. Las imágenes finales pueden requerir edición o ajustes según las necesidades específicas de cada artículo del blog.
