# 📋 LISTA COMPLETA: Código en Desuso

---

## 🔴 ARCHIVOS JAVASCRIPT EN DESUSO

### ❌ Para ELIMINAR:

1. **`js/gallery-dynamic.js`**
   - Funcionalidad duplicada con `galeria-carousel.js`
   - ~8 KB

2. **`js/gallery-dynamic.min.js`**
   - Versión minificada del anterior
   - ~4 KB

3. **`js/chatbot.css`**
   - Estilos duplicados inline en HTML
   - ~5 KB

**Total:** 3 archivos, ~17 KB

---

## 🔴 ARCHIVOS CSS EN DESUSO

### ❌ Para ELIMINAR:

1. **`js/chatbot.css`** (ya listado arriba)

### ⚠️ Para VERIFICAR:

1. **`marketing/css/main.css`**
   - NO referenciado en ningún HTML
   - Verificar contenido antes de eliminar

---

## 🔴 ARCHIVOS HTML DE PRUEBA

### ❌ Para MOVER a `/tests/html/`:

1. **`test-video-player.html`**
   - Archivo de prueba del reproductor de video
   - ~8 KB

2. **`test-lightbox.html`**
   - Archivo de prueba del lightbox
   - ~7 KB

**Total:** 2 archivos, ~15 KB

---

## 🎨 CLASES CSS EN DESUSO

### En `css/styles.css` (14 clases):

| Clase | Razón |
|-------|-------|
| `.card-back-subtitle` | Nunca usada |
| `.flip-indicator` | Nunca usada |
| `.form-option` | Nunca usada |
| `.form-section-title` | Nunca usada |
| `.gallery-grid` | Solo debe estar en galeria-styles.css |
| `.hero-background-video` | Definida en inline CSS |
| `.hero-video-container` | Definida en inline CSS |
| `.max-w-600` | Utilidad no usada |
| `.mb-20` | Utilidad no usada |
| `.option-icon` | Nunca usada |
| `.package-highlight` | Nunca usada |
| `.service-features` | Reemplazada por `.detailed-features` |
| `.text-center-important` | Utilidad no usada |
| `.video-background` | Legacy, reemplazada |

---

### En `marketing/css/marketing-campaign.css` (8 clases):

| Clase | Razón |
|-------|-------|
| `.event-container` | Diseño anterior no implementado |
| `.event-features` | Diseño anterior no implementado |
| `.event-image` | Diseño anterior no implementado |
| `.event-image-column` | Diseño anterior no implementado |
| `.event-section` | Diseño anterior no implementado |
| `.event-section-subtitle` | Diseño anterior no implementado |
| `.event-section-title` | Diseño anterior no implementado |
| `.event-text-column` | Diseño anterior no implementado |

---

### En `js/chatbot.css` (9 clases):

| Clase | Razón |
|-------|-------|
| `.chat-input` | Archivo completo duplicado |
| `.chatbot-close` | Archivo completo duplicado |
| `.chatbot-container` | Archivo completo duplicado |
| `.chatbot-header` | Archivo completo duplicado |
| `.chatbot-title` | Archivo completo duplicado |
| `.form-subtitle` | Archivo completo duplicado |
| `.form-title` | Archivo completo duplicado |
| `.message` | Archivo completo duplicado |
| `.submit-btn` | Archivo completo duplicado |

**Total:** 31 clases CSS en desuso

---

## 🔧 CORRECCIONES DE REFERENCIAS

### En `galeria.html` (línea 221):

```html
<!-- ❌ INCORRECTO: -->
<script src="js/galeria-lightbox.js"></script>

<!-- ✅ CORRECTO: -->
<script src="js/galeria-lightbox.min.js"></script>
```

---

### En `index.html` (buscar "accessibility-fixes"):

```html
<!-- ❌ INCORRECTO: -->
<script src="js/accessibility-fixes.js?v=1.0" defer></script>

<!-- ✅ CORRECTO: -->
<script src="js/accessibility-fixes.min.js?v=1.0" defer></script>
```

---

## 📊 FUNCIONES JAVASCRIPT

### ✅ TODAS LAS FUNCIONES ESTÁN EN USO

**Conclusión:** No hay funciones JavaScript en desuso. Las funciones son:
- Métodos de clase (llamados internamente)
- Event handlers (llamados por eventos DOM)
- Callbacks (llamados por APIs)

**Acción:** ✅ NO eliminar ninguna función

---

## 💡 ESTILOS INLINE DUPLICADOS

### Chatbot (3 archivos):

| Archivo | Bloques `<style>` | Líneas aprox. |
|---------|-------------------|---------------|
| `index.html` | 6 bloques | ~900 líneas |
| `blog.html` | 1 bloque | ~300 líneas |
| `cotizador.html` | 1 bloque | ~300 líneas |

**Problema:** Estilos del chatbot duplicados en 3 archivos

**Impacto:** ~45-60 KB duplicados

---

### Posts del Blog (47 archivos):

| Archivos | Bloques `<style>` cada uno |
|----------|----------------------------|
| `post/post-*.html` (47 archivos) | 1 bloque |

**Análisis:** Requiere revisión manual para determinar si son estilos únicos o comunes

---

## 📈 IMPACTO TOTAL DE LA LIMPIEZA

### Reducción Inmediata (Fases 1-2):

| Categoría | Reducción |
|-----------|-----------|
| Archivos JS eliminados | ~12 KB |
| Archivos CSS eliminados | ~5 KB |
| Archivos HTML movidos | ~15 KB |
| **TOTAL INMEDIATO** | **~32 KB** |

### Reducción con Optimización (Fases 3-4):

| Categoría | Reducción |
|-----------|-----------|
| Clases CSS limpiadas | ~8 KB |
| Estilos inline optimizados | ~60 KB |
| **TOTAL CON OPTIMIZACIÓN** | **~100 KB** |

---

## ✅ CHECKLIST DE LIMPIEZA

### Fase 1: Eliminación Segura
- [ ] Crear backup del proyecto
- [ ] Eliminar `js/gallery-dynamic.js`
- [ ] Eliminar `js/gallery-dynamic.min.js`
- [ ] Eliminar `js/chatbot.css`
- [ ] Mover `test-video-player.html` a `/tests/html/`
- [ ] Mover `test-lightbox.html` a `/tests/html/`

### Fase 2: Correcciones
- [ ] Corregir referencia en `galeria.html` línea 221
- [ ] Corregir referencia en `index.html` (accessibility-fixes)

### Fase 3: Limpieza CSS
- [ ] Eliminar 14 clases de `css/styles.css`
- [ ] Eliminar 8 clases de `marketing/css/marketing-campaign.css`
- [ ] Verificar `marketing/css/main.css`

### Fase 4: Verificación
- [ ] Ejecutar `npm run build`
- [ ] Probar index.html
- [ ] Probar blog.html
- [ ] Probar cotizador.html
- [ ] Probar galeria.html
- [ ] Probar testimonios.html
- [ ] Probar marketing/*.html
- [ ] Verificar chatbot funciona
- [ ] Verificar galería funciona
- [ ] Verificar videos popup funcionan

### Fase 5: Commit
- [ ] `git add .`
- [ ] `git commit -m "Limpieza de código en desuso"`
- [ ] `git push`

---

**Generado:** 17 de enero de 2026
