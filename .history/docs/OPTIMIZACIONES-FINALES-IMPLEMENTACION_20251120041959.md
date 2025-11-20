# Guía de Implementación - Optimizaciones Finales
## Grupo Musical La Célula

**Fecha:** 20 de noviembre de 2025  
**Estado:** En progreso

---

## 📋 OPTIMIZACIONES A IMPLEMENTAR

### ✅ 1. Critical CSS Inline (COMPLETADO PARCIALMENTE)

**Objetivo:** Incluir el CSS crítico inline en el `<head>` para mejorar el FCP (First Contentful Paint).

**Implementación:**
- Extraer CSS crítico (above-the-fold)
- Incluir inline en `<head>`
- Cargar CSS completo de forma asíncrona

**Beneficio:** FCP 300-500ms más rápido

---

### 🔄 2. Hero Responsive Srcsets (EN PROCESO)

**Objetivo:** Servir imágenes optimizadas según el dispositivo del usuario.

**Archivos necesarios:**
```bash
assets/images/hero-background-480w.webp   # Mobile pequeño
assets/images/hero-background-768w.webp   # Tablet
assets/images/hero-background-1024w.webp  # Desktop pequeño
assets/images/hero-background-1920w.webp  # Desktop grande
```

**Comando para generar:**
```bash
# Generar imágenes responsive
for size in 480 768 1024 1920; do
  ffmpeg -i assets/images/hero-background.webp \
    -vf "scale=${size}:-1" \
    assets/images/hero-background-${size}w.webp
done
```

**Implementación HTML:**
```html
<picture>
  <source 
    srcset="assets/images/hero-background-480w.webp" 
    media="(max-width: 480px)" 
    type="image/webp">
  <source 
    srcset="assets/images/hero-background-768w.webp" 
    media="(max-width: 768px)" 
    type="image/webp">
  <source 
    srcset="assets/images/hero-background-1024w.webp" 
    media="(max-width: 1024px)" 
    type="image/webp">
  <source 
    srcset="assets/images/hero-background-1920w.webp" 
    type="image/webp">
  <img 
    src="assets/images/hero-background.webp" 
    alt="Background"
    width="1920"
    height="1080">
</picture>
```

**Beneficio:** 60-80% ahorro en mobile

---

### 🔄 3. SVG Inline Icons (EN PROCESO)

**Objetivo:** Eliminar requests HTTP convirtiendo iconos a SVG inline.

**Iconos a convertir:**
- WhatsApp (assets/icons/whatsapp-icon.png)
- Facebook (assets/icons/facebook-icon.png)
- YouTube (assets/icons/youtube-icon.png)
- Twitter (assets/icons/twitter-icon.png)

**SVGs a usar:**

```html
<!-- WhatsApp -->
<svg class="social-icon" viewBox="0 0 24 24" fill="#25D366">
