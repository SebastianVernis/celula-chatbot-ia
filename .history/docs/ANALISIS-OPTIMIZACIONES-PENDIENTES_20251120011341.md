# Análisis de Optimizaciones Pendientes

**Fecha de análisis:** 20 de noviembre de 2025  
**Proyecto:** Grupo Musical La Célula - Sitio Web

---

## ✅ Optimizaciones Ya Implementadas

### 1. **YouTube Lite Embeds** ✓
- **Estado:** Completado
- **Impacto:** Alto
- **Descripción:** Los videos de YouTube se cargan solo al hacer click (on-demand)
- **Ahorro:** ~1.5MB por video + reducción de requests HTTP
- **Archivo:** `js/youtube-carousel.js`

### 2. **Minificación de Assets** ✓
- **Estado:** Completado
- **CSS:** 44K (styles.min.css)
- **JS:** Todos los archivos tienen versiones minificadas
- **Scripts disponibles:** `minify-js.sh`, `minify-css.sh`, `minify-all.sh`

### 3. **Imágenes WebP** ✓
- **Estado:** Mayoría convertidas
- **Galería:** 51 imágenes en formato WebP
- **Scripts:** `convert-images-to-webp.sh`

---

## 🔴 Optimizaciones Pendientes de Alto Impacto

### 1. **Iconos Sociales en PNG → WebP/SVG** 🔴
**Impacto:** Medio  
**Prioridad:** Alta

**Archivos identificados:**
```
assets/icons/whatsapp-icon.png   (1.7K)
assets/icons/facebook-icon.png   (1.5K)
assets/icons/twitter-icon.png    (1.6K)
assets/icons/youtube-icon.png    (1.3K)
```

**Recomendación:**
- Convertir a SVG inline (mejor calidad + menor tamaño)
- Alternativa: Convertir a WebP
- **Ahorro estimado:** 50-70% del tamaño actual

**Acción:**
```bash
# Opción 1: SVG inline en HTML (recomendado)
# Opción 2: Convertir a WebP
cwebp -q 90 assets/icons/whatsapp-icon.png -o assets/icons/whatsapp-icon.webp
```

---

### 2. **Logo PNG → WebP/AVIF** 🔴
**Impacto:** Medio-Alto  
**Prioridad:** Alta

**Archivo crítico:**
```
assets/images/logo-blanco.png    (16K) - Usado en hero section
```

**Otros logos grandes (no críticos):**
```
assets/logo/encabezado 1.png              (1.6M) ← MUY GRANDE
assets/logo/LOGO CELULA PENTA oil.png     (336K)
assets/logo/encabezado celula.png         (206K)
assets/logo/Logo grupo musical la celula.png (150K)
assets/logo/android-chrome-512x512.png    (111K)
```

**Recomendación:**
- Logo-blanco.png → WebP con fallback
- Logos grandes no usados: eliminar o convertir
- **Ahorro estimado:** 70-80% en formato moderno

---

### 3. **Google Fonts → Self-hosted** 🟡
**Impacto:** Medio  
**Prioridad:** Media

**Fuentes cargadas:**
```html
<link href="https://fonts.googleapis.com/css2?family=Lobster:wght@400&family=Open+Sans:wght@400;600;700&family=Raleway:wght@400;600&display=swap" rel="stylesheet">
```

**Problemas:**
- Request adicional a dominio externo
- Dependencia de terceros
- Posible bloqueo de GDPR

**Recomendación:**
- Descargar fuentes y servir localmente
- Usar `font-display: swap` (ya implementado)
- Considerar fuentes variables para reducir archivos
- **Ahorro:** ~100-200ms en tiempo de carga

**Acción:**
```bash
# Usar google-webfonts-helper
# https://gwfh.mranftl.com/fonts
```

---

### 4. **Critical CSS** 🟡
**Impacto:** Medio  
**Prioridad:** Media

**Estado actual:**
