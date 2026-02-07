# 🎯 RESUMEN: Código en Desuso - La Célula

---

## 🔴 ARCHIVOS PARA ELIMINAR (5)

### JavaScript (3 archivos):
1. ❌ **`js/gallery-dynamic.js`** + `.min.js` → Duplicado de galeria-carousel.js
2. ❌ **`js/chatbot.css`** → Estilos duplicados inline en HTML

### HTML de Prueba (2 archivos):
3. ❌ **`test-video-player.html`** → Mover a `/tests/html/`
4. ❌ **`test-lightbox.html`** → Mover a `/tests/html/`

**Impacto:** ~17 KB eliminados

---

## 🟡 ARCHIVOS PARA VERIFICAR (1)

1. ⚠️ **`marketing/css/main.css`** → NO referenciado en ningún HTML

**Acción:** Revisar contenido y eliminar si no se usa

---

## 🔧 CORRECCIONES NECESARIAS (2)

### Referencias incorrectas a archivos sin minificar:

1. **`galeria.html` línea 221:**
```html
<!-- ❌ Actual: -->
<script src="js/galeria-lightbox.js"></script>

<!-- ✅ Corregir a: -->
<script src="js/galeria-lightbox.min.js"></script>
```

2. **`index.html` (buscar):**
```html
<!-- ❌ Actual: -->
<script src="js/accessibility-fixes.js?v=1.0" defer></script>

<!-- ✅ Corregir a: -->
<script src="js/accessibility-fixes.min.js?v=1.0" defer></script>
```

---

## 🎨 CLASES CSS EN DESUSO (31 clases)

### En `css/styles.css` (14 clases):

```css
/* ❌ ELIMINAR - No usadas */
.card-back-subtitle
.flip-indicator
.form-option
.form-section-title
.gallery-grid           /* Solo en galeria-styles.css */
.hero-background-video  /* Inline CSS */
.hero-video-container   /* Inline CSS */
.max-w-600
.mb-20
.option-icon
.package-highlight
.service-features       /* Reemplazada por .detailed-features */
.text-center-important
.video-background       /* Legacy */
```

### En `marketing/css/marketing-campaign.css` (8 clases):

```css
/* ❌ ELIMINAR - Diseño anterior no implementado */
.event-container
.event-features
.event-image
.event-image-column
.event-section
.event-section-subtitle
.event-section-title
.event-text-column
```

### En `js/chatbot.css` (9 clases):

```css
/* ❌ TODO EL ARCHIVO - Duplicado inline */
.chat-input
.chatbot-close
.chatbot-container
.chatbot-header
.chatbot-title
.form-subtitle
.form-title
.message
.submit-btn
```

---

## 💡 OPTIMIZACIÓN OPCIONAL

### Estilos Inline del Chatbot (Duplicados en 3 archivos):

**Archivos afectados:**
- `index.html` (~300 líneas inline)
- `blog.html` (~300 líneas inline)
- `cotizador.html` (~300 líneas inline)

**Problema:** ~45-60 KB duplicados

**Solución:**
1. Extraer a `css/chatbot-inline.css`
2. Referenciar en los 3 HTML
3. Eliminar bloques `<style>` inline

**Impacto:** ~45-60 KB eliminados

---

## 📋 SCRIPT DE LIMPIEZA RÁPIDA

```bash
#!/bin/bash
# Limpieza rápida de código en desuso

# Backup
mkdir -p backup-$(date +%Y%m%d)
cp -r js css *.html backup-$(date +%Y%m%d)/

# Eliminar archivos
rm -f js/gallery-dynamic.js js/gallery-dynamic.min.js js/chatbot.css

# Mover pruebas
mkdir -p tests/html
mv test-*.html tests/html/ 2>/dev/null || true

echo "✅ Limpieza completada"
```

---

## 📊 IMPACTO TOTAL

| Acción | Archivos | Reducción |
|--------|----------|-----------|
| **Eliminar JS duplicados** | 3 | ~12 KB |
| **Eliminar CSS duplicado** | 1 | ~5 KB |
| **Limpiar clases CSS** | 31 | ~8 KB |
| **Optimizar inline** | 3 | ~60 KB |
| **TOTAL** | - | **~85 KB** |

---

## ✅ PRÓXIMOS PASOS

1. ✅ Revisar este reporte
2. ⚠️ Ejecutar script de limpieza
3. ⚠️ Corregir referencias en HTML
4. ⚠️ Limpiar clases CSS
5. ✅ Ejecutar `npm run build`
6. ✅ Probar todas las páginas
7. ✅ Commit de cambios

---

**Fecha:** 17 de enero de 2026  
**Análisis:** Automatizado + Manual
