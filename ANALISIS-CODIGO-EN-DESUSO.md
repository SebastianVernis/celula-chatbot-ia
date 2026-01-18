# 📊 Análisis de Código en Desuso - Grupo Musical La Célula

**Fecha de análisis:** 17 de enero de 2026  
**Archivos analizados:** 59 HTML, 11 CSS, 17 JS

---

## 🎯 Resumen Ejecutivo

| Categoría | Total Definidos | En Uso | No Usados | % Desuso |
|-----------|----------------|--------|-----------|----------|
| **Clases CSS** | 304 | 220 | 84* | 27.6% |
| **IDs CSS** | 61 | 45 | 16* | 26.2% |
| **Archivos JS** | 17 | 10 | 7 | 41.2% |
| **Archivos CSS** | 11 | 9 | 2 | 18.2% |

*Nota: Muchas "clases no usadas" son en realidad valores numéricos o colores extraídos incorrectamente del CSS (ej: .05, #000000). El número real de clases/IDs en desuso es menor.*

---

## 📌 1. ARCHIVOS JAVASCRIPT NO REFERENCIADOS

### ❌ Archivos completamente sin uso (7):

1. **`js/accessibility-fixes.js`**
   - **Propósito:** Correcciones de accesibilidad para widgets de terceros (Featurable)
   - **Estado:** NO referenciado en ningún HTML
   - **Recomendación:** ⚠️ ELIMINAR o agregar a index.html si se necesita

2. **`js/galeria-carousel.js`**
   - **Propósito:** Manejo del carrusel de galería en la página principal
   - **Estado:** NO referenciado (se usa `galeria-carousel.min.js` en index.html)
   - **Recomendación:** ✅ MANTENER (es el source del minificado)

3. **`js/gallery-dynamic.js`**
   - **Propósito:** Galería dinámica con datos embebidos
   - **Estado:** NO referenciado en ningún HTML
   - **Recomendación:** ⚠️ ELIMINAR (funcionalidad duplicada con galeria-carousel.js)

4. **`js/site-functionality.js`**
   - **Propósito:** Funcionalidad general del sitio (smooth scroll, lazy loading, flip cards)
   - **Estado:** Referenciado solo en index.html como `site-functionality.min.js`
   - **Recomendación:** ✅ MANTENER (es el source del minificado)

5. **`js/youtube-carousel.js`**
   - **Propósito:** Carrusel de videos de YouTube con lite embeds
   - **Estado:** Referenciado solo en index.html como `youtube-carousel.min.js`
   - **Recomendación:** ✅ MANTENER (es el source del minificado)

6. **`postcss.config.js`**
   - **Propósito:** Configuración de PostCSS para procesamiento de CSS
   - **Estado:** Usado por el build system, no referenciado en HTML
   - **Recomendación:** ✅ MANTENER (necesario para el build)

7. **`sw.js`**
   - **Propósito:** Service Worker para PWA
   - **Estado:** Registrado dinámicamente desde optimizations.js
   - **Recomendación:** ✅ MANTENER (necesario para PWA)

---

## 📌 2. ARCHIVOS CSS NO REFERENCIADOS

### ❌ Archivos sin uso (2):

1. **`js/chatbot.css`**
   - **Propósito:** Estilos del chatbot
   - **Estado:** NO referenciado (estilos están inline en HTML)
   - **Recomendación:** ⚠️ ELIMINAR (estilos duplicados inline)

2. **`marketing/css/main.css`**
   - **Propósito:** Estilos principales para páginas de marketing
   - **Estado:** NO referenciado en marketing/*.html
   - **Recomendación:** ⚠️ VERIFICAR y eliminar si no se usa

---

## 📌 3. CLASES CSS REALMENTE NO USADAS

### Clases definidas en CSS pero no usadas en HTML:

#### **Componentes de Video Player:**
- `.video-player-single`
- `.video-player-left`
- `.video-player-right`
- `.video-player-container`
- `.video-player-wrapper`
- `.video-player-element`
- `.video-player-overlay`
- `.video-player-loading`
- `.video-player-controls`
- `.video-spinner`
- `.video-btn-play-large`
- `.video-btn-close-compact`
- `.hidden`
- `.visible`
- `.minimized`

**Análisis:** Estas clases SÍ se usan, pero son creadas dinámicamente por `video-player-popup.js`. El análisis estático no las detecta.

#### **Componentes de Galería:**
- `.gallery-lightbox`
- `.lightbox-image`
- `.lightbox-close`
- `.lightbox-prev`
- `.lightbox-next`
- `.lightbox-caption`
- `.lightbox-counter`
- `.gallery-modal`
- `.gallery-modal-content`
- `.gallery-close`

**Análisis:** Estas clases SÍ se usan, creadas dinámicamente por `galeria-lightbox.js` y `galeria-carousel.js`.

#### **Componentes de Chatbot:**
- `.typing-indicator`
- `.user-message`
- `.bot-message`

**Análisis:** Estas clases SÍ se usan, creadas dinámicamente por `chatbot.js`.

#### **Componentes de Carrusel YouTube:**
- `.youtube-carousel`
- `.youtube-carousel-wrapper`
- `.youtube-video-group`
- `.youtube-video`

**Análisis:** Estas clases SÍ se usan, creadas dinámicamente por `youtube-carousel.js`.

#### **Clases potencialmente en desuso REAL:**
- `.flip-indicator` - Definida en CSS pero no se usa en ningún HTML
- `.package-highlight` - Definida en CSS pero no se usa en ningún HTML
- `.card-back-subtitle` - Definida en CSS pero no se usa en ningún HTML
- `.form-option` - Definida en CSS pero no se usa en ningún HTML
- `.form-section-title` - Definida en CSS pero no se usa en ningún HTML
- `.max-w-600` - Definida en CSS pero no se usa en ningún HTML
- `.mb-20` - Definida en CSS pero no se usa en ningún HTML
- `.text-center-important` - Definida en CSS pero no se usa en ningún HTML
- `.blog-post-card` - Creada dinámicamente por blog-pagination.js
- `.post-content-card` - Creada dinámicamente por blog-pagination.js

---

## 📌 4. FUNCIONES JAVASCRIPT EN DESUSO

### Funciones definidas pero potencialmente no llamadas:

#### **js/accessibility-fixes.js** (TODO EL ARCHIVO NO REFERENCIADO):
- `constructor()`
- `init()`
- `fixFeaturableAccessibility()`
- `fixVideoAccessibility()`
- `fixSliderFocusability()`
- `updateFocusability()`

**Recomendación:** ⚠️ Si no se usa Featurable widget, ELIMINAR todo el archivo.

#### **js/gallery-dynamic.js** (TODO EL ARCHIVO NO REFERENCIADO):
- `createGalleryItem()`
- `updateGallery()`
- `initCarousel()`
- `initLightbox()`
- `openLightbox()`
- `closeLightbox()`
- `showNext()`
- `showPrev()`
- `updateLightboxImage()`
- `handleSwipe()`

**Recomendación:** ⚠️ ELIMINAR (funcionalidad duplicada con galeria-carousel.js)

---

## 📌 5. ESTILOS INLINE DUPLICADOS

### Archivos con bloques `<style>` inline:

#### **Crítico - Estilos del Chatbot duplicados:**
- `index.html` - 6 bloques `<style>` (Critical CSS, Fonts, Testimonial Widget, Chatbot, Floating Widget, Video Player)
- `blog.html` - 1 bloque `<style>` (Chatbot)
- `cotizador.html` - 1 bloque `<style>` (Chatbot)

**Problema:** Los estilos del chatbot están duplicados inline en 3 archivos HTML diferentes.

**Recomendación:** 
1. Extraer estilos del chatbot a `css/chatbot.css`
2. Referenciar el archivo CSS en lugar de inline
3. Reducir el tamaño de los HTML

#### **Posts del Blog (47 archivos):**
Todos los archivos `post/post-*.html` tienen 1 bloque `<style>` inline.

**Recomendación:** Verificar si estos estilos son únicos por post o se pueden centralizar.

---

## 📌 6. ARCHIVOS DE PRUEBA/TESTING

### Archivos de desarrollo que pueden eliminarse en producción:

1. **`test-video-player.html`**
   - Archivo de prueba para el reproductor de video
   - ⚠️ MOVER a carpeta `/tests` o ELIMINAR

2. **`test-lightbox.html`**
   - Archivo de prueba para el lightbox de galería
   - ⚠️ MOVER a carpeta `/tests` o ELIMINAR

---

## 📌 7. ARCHIVOS DUPLICADOS (SOURCE + MINIFIED)

### Todos los archivos JS tienen versión source y minificada:

**Estado actual:**
- ✅ Los HTML referencian las versiones `.min.js` (correcto)
- ✅ Los archivos source se mantienen para desarrollo
- ✅ El proceso de build genera los minificados

**Recomendación:** ✅ MANTENER ambas versiones (buena práctica)

---

## 🎯 RECOMENDACIONES PRIORITARIAS

### 🔴 Alta Prioridad - ELIMINAR:

1. **`js/gallery-dynamic.js`** - Funcionalidad duplicada
2. **`js/chatbot.css`** - Estilos duplicados inline
3. **`test-video-player.html`** - Archivo de prueba
4. **`test-lightbox.html`** - Archivo de prueba

### 🟡 Media Prioridad - VERIFICAR:

1. **`js/accessibility-fixes.js`** - Verificar si se usa Featurable widget
2. **`marketing/css/main.css`** - Verificar si se necesita
3. **Estilos inline del chatbot** - Centralizar en un archivo CSS
4. **Clases CSS:** `.flip-indicator`, `.package-highlight`, `.card-back-subtitle`

### 🟢 Baja Prioridad - OPTIMIZAR:

1. **Estilos inline en posts** - Evaluar si se pueden centralizar
2. **Clases de utilidad no usadas** - Limpiar del CSS principal

---

## 📋 PLAN DE LIMPIEZA SUGERIDO

### Fase 1: Eliminación Segura
```bash
# Eliminar archivos completamente en desuso
rm js/gallery-dynamic.js
rm js/gallery-dynamic.min.js
rm js/chatbot.css
rm test-video-player.html
rm test-lightbox.html
```

### Fase 2: Verificación
```bash
# Verificar si accessibility-fixes se necesita
# Si no se usa Featurable, eliminar:
rm js/accessibility-fixes.js
rm js/accessibility-fixes.min.js

# Verificar marketing/css/main.css
# Si no se usa, eliminar
```

### Fase 3: Refactorización
1. Extraer estilos inline del chatbot a `css/chatbot.css`
2. Actualizar referencias en HTML
3. Limpiar clases CSS no usadas del archivo principal

---

## 📈 IMPACTO ESTIMADO

### Reducción de tamaño:
- **Archivos JS eliminados:** ~50-80 KB
- **Archivos CSS eliminados:** ~10-20 KB
- **Archivos HTML de prueba:** ~15-25 KB
- **Total estimado:** ~75-125 KB

### Beneficios:
- ✅ Código más limpio y mantenible
- ✅ Menor tiempo de carga
- ✅ Menos confusión para desarrolladores
- ✅ Mejor organización del proyecto

---

## ⚠️ NOTAS IMPORTANTES

1. **Clases dinámicas:** Muchas clases marcadas como "no usadas" en realidad SÍ se usan, pero son creadas dinámicamente por JavaScript. El análisis estático no puede detectarlas.

2. **Archivos minificados:** Los archivos `.min.js` y `.min.css` son generados automáticamente. Los archivos source deben mantenerse para desarrollo.

3. **Service Worker:** El archivo `sw.js` no está referenciado directamente en HTML, pero se registra dinámicamente desde `optimizations.js`.

4. **PostCSS:** El archivo `postcss.config.js` es necesario para el proceso de build, aunque no se referencie en HTML.

---

## 🔍 ANÁLISIS DETALLADO POR ARCHIVO

### Archivos JavaScript Actualmente Referenciados:

#### **index.html:**
- ✅ `js/video-background.min.js`
- ✅ `js/site-functionality.min.js`
- ✅ `js/navigation.min.js`
- ✅ `js/youtube-carousel.min.js`
- ✅ `js/galeria-carousel.min.js`
- ✅ `js/optimizations.min.js`
- ✅ `js/chatbot.min.js`
- ✅ `js/video-player-popup.min.js`
- ⚠️ `js/accessibility-fixes.js` (sin minificar, posible error)

#### **blog.html:**
- ✅ `js/navigation.min.js`
- ✅ `js/optimizations.min.js`
- ✅ `js/video-background.min.js`
- ✅ `js/blog-pagination.min.js`
- ✅ `js/chatbot.min.js`
- ✅ `js/video-player-popup.min.js`

#### **cotizador.html:**
- ✅ `js/form-handler.min.js`
- ✅ `js/video-background.min.js`
- ✅ `js/navigation.min.js`
- ✅ `js/optimizations.min.js`
- ✅ `js/chatbot.min.js`
- ✅ `js/video-player-popup.min.js`

#### **galeria.html:**
- ✅ `js/navigation.min.js`
- ✅ `js/galeria-lightbox.js` (sin minificar)
- ✅ `js/video-player-popup.min.js`

#### **testimonios.html:**
- ✅ `js/navigation.min.js`
- ✅ `js/video-background.min.js`
- ✅ `js/video-player-popup.min.js`

#### **marketing/*.html:**
- ✅ `js/common.js`
- ✅ `js/form-handler.js`
- ✅ `../js/video-player-popup.min.js`

### Archivos CSS Actualmente Referenciados:

#### **Páginas principales:**
- ✅ `css/styles.min.css` (index, blog, cotizador, galeria, testimonios)
- ✅ `css/galeria-styles.css` (galeria.html)
- ✅ `css/testimonios-styles.css` (testimonios.html)
- ✅ `css/video-player-popup.min.css` (todas las páginas)

#### **Marketing:**
- ✅ `css/common.css`
- ✅ `css/marketing-campaign.css`
- ✅ `css/bodas.css`
- ✅ `css/privada.css`
- ✅ `css/xv.css`

---

## 🚨 PROBLEMAS DETECTADOS

### 1. Inconsistencia en referencias a archivos minificados:

**Problema:** Algunos archivos se referencian sin minificar:
- `galeria.html` → `js/galeria-lightbox.js` (debería ser `.min.js`)
- `index.html` → `js/accessibility-fixes.js` (debería ser `.min.js`)

**Solución:**
```html
<!-- En galeria.html, cambiar: -->
<script src="js/galeria-lightbox.js"></script>
<!-- Por: -->
<script src="js/galeria-lightbox.min.js"></script>

<!-- En index.html, cambiar: -->
<script src="js/accessibility-fixes.js?v=1.0" defer></script>
<!-- Por: -->
<script src="js/accessibility-fixes.min.js?v=1.0" defer></script>
```

### 2. Estilos del chatbot duplicados:

**Problema:** Los estilos del chatbot están inline en 3 archivos HTML:
- `index.html`
- `blog.html`
- `cotizador.html`

**Impacto:** ~15-20 KB duplicados en cada archivo

**Solución:**
1. Crear `css/chatbot-inline.css` con todos los estilos
2. Referenciar el archivo en lugar de inline
3. O mantener inline pero asegurar que sea idéntico en todos

### 3. Archivos de prueba en producción:

**Problema:** Archivos de testing en la raíz del proyecto:
- `test-video-player.html`
- `test-lightbox.html`

**Solución:** Mover a carpeta `/tests` o eliminar

---

## 📊 ANÁLISIS DE FUNCIONES JAVASCRIPT

### Funciones que SÍ se usan (creadas dinámicamente):

Todas las funciones marcadas con ⚠️ en el análisis automático en realidad SÍ se usan, pero son:
- Métodos de clase (llamados internamente)
- Event handlers (llamados por eventos del DOM)
- Callbacks (llamados por APIs)

**Conclusión:** ✅ No hay funciones JavaScript realmente en desuso. El análisis estático no puede detectar llamadas dinámicas.

---

## 🎨 CLASES CSS POTENCIALMENTE EN DESUSO (VERIFICAR MANUALMENTE)

### Clases que podrían no usarse:

1. **`.flip-indicator`** - Indicador de flip en tarjetas de servicio
2. **`.package-highlight`** - Destacado de paquetes
3. **`.card-back-subtitle`** - Subtítulo en reverso de tarjetas
4. **`.form-option`** - Opciones de formulario
5. **`.form-section-title`** - Título de sección de formulario
6. **`.max-w-600`** - Utilidad de ancho máximo
7. **`.mb-20`** - Utilidad de margen inferior
8. **`.text-center-important`** - Utilidad de centrado
9. **`.service-features`** - Features de servicios (posiblemente reemplazada por `.detailed-features`)
10. **`.event-section`** - Sección de eventos (posiblemente legacy)
11. **`.event-container`** - Contenedor de eventos
12. **`.event-image`** - Imagen de evento
13. **`.event-text-column`** - Columna de texto de evento
14. **`.event-image-column`** - Columna de imagen de evento
15. **`.event-features`** - Features de evento

---

## 📝 CONCLUSIONES

### ✅ Código Limpio:
- La mayoría de los archivos JS y CSS están en uso
- El sistema de minificación funciona correctamente
- Las referencias a archivos son mayormente consistentes

### ⚠️ Áreas de Mejora:
1. Eliminar `js/gallery-dynamic.js` (duplicado)
2. Eliminar `js/chatbot.css` (duplicado inline)
3. Mover archivos de prueba a `/tests`
4. Centralizar estilos inline del chatbot
5. Corregir referencias a archivos sin minificar
6. Limpiar clases CSS legacy no usadas

### 📈 Impacto de la Limpieza:
- **Reducción de código:** ~100 KB
- **Mejora de mantenibilidad:** Alta
- **Riesgo:** Bajo (archivos claramente en desuso)
- **Tiempo estimado:** 1-2 horas

---

## 🛠️ SCRIPT DE LIMPIEZA AUTOMÁTICA

```bash
#!/bin/bash
# Script para limpiar código en desuso

echo "🧹 Limpiando código en desuso..."

# 1. Eliminar archivos JS duplicados/en desuso
rm -f js/gallery-dynamic.js
rm -f js/gallery-dynamic.min.js
rm -f js/chatbot.css

# 2. Mover archivos de prueba
mkdir -p tests/html
mv test-video-player.html tests/html/
mv test-lightbox.html tests/html/

# 3. Verificar archivos de marketing
# (requiere revisión manual)
echo "⚠️ Verificar manualmente: marketing/css/main.css"
echo "⚠️ Verificar manualmente: js/accessibility-fixes.js"

echo "✅ Limpieza completada"
echo "📊 Archivos eliminados: 3"
echo "📁 Archivos movidos: 2"
```

---

**Generado automáticamente por:** `analyze-unused-code.js`  
**Fecha:** 17 de enero de 2026
