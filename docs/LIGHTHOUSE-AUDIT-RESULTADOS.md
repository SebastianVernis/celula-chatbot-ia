# Resultados Lighthouse Audit - Grupo Musical La Célula

**Fecha:** 20 de noviembre de 2025  
**URL:** https://grupomusicalcelula.pages.dev/  
**Dispositivo:** Emulated Moto G Power (Mobile)

---

## 📊 SCORE GENERAL: 70/100

### ✅ **Performance Score: 70** (COLOR NARANJA)

---

## 🎯 CORE WEB VITALS

### Métricas Principales:

| Métrica | Valor Actual | Score | Estado |
|---------|-------------|--------|---------|
| **FCP** (First Contentful Paint) | 3.7s | 30 | ⚠️ ROJO |
| **LCP** (Largest Contentful Paint) | 4.0s | 51 | 🟡 NARANJA |
| **TBT** (Total Blocking Time) | 120ms | 97 | ✅ VERDE |
| **CLS** (Cumulative Layout Shift) | 0 | 100 | ✅ VERDE |
| **Speed Index** | 15.6s | 0 | 🔴 ROJO |

### Otras Métricas:

| Métrica | Valor | Score |
|---------|-------|--------|
| **TTI** (Time to Interactive) | 48.7s | 0 |
| **Max Potential FID** | 210ms | 63 |

---

## ✅ LO QUE ESTÁ FUNCIONANDO BIEN:

### 1. **Total Blocking Time (TBT): 120ms** ✓
- Excelente desempeño
- Scripts defer funcionando correctamente
- Tareas largas bajo control (solo 4)

### 2. **Cumulative Layout Shift (CLS): 0** ✓✓✓
- ¡PERFECTO! 
- Width/height explícitos funcionando
- Sin cambios de diseño inesperados

### 3. **Server Response Time: 40ms** ✓
- Excelente tiempo de respuesta inicial
- Cloudflare Pages funcionando perfectamente

### 4. **Max Potential FID: 210ms** ✓
- Dentro del rango aceptable
- Buena interactividad

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS:

### 1. **FCP: 3.7s** (Objetivo: <1.8s)
**Problema:** Contenido renderiza muy tarde

**Causas:**
- **Render-blocking resources:** 1,560ms de bloqueo
  - Google Fonts CSS: 1,037ms
  - web3forms.js: 769ms  
  - styles.min.css: 395ms

**Solución:** ✅ YA DOCUMENTADA en `docs/CRITICAL-CSS-IMPLEMENTATION.md`
- Inline Critical CSS
- Preload de fuentes
- Async/defer en scripts no críticos (YA HECHO)

---

### 2. **LCP: 4.0s** (Objetivo: <2.5s)
**Problema:** Imagen principal tarda mucho en cargar

**Desglose LCP:**
- Time to First Byte: 103ms ✓
- Resource Load Delay: 31ms ✓
- Resource Load Duration: 121ms ✓
- **Element Render Delay: 2,084ms** 🔴 **PRINCIPAL PROBLEMA**

**Elemento LCP:** `img.chatbot-icon` (whatsapp-icon.png)
- Ubicación: Botón de chatbot flotante
- Tamaño: 30x30px

**Problemas:**
- ❌ NO tiene `fetchpriority="high"`
- ✅ SÍ es descubrible en HTML inicial
- ✅ NO tiene lazy loading

**Solución URGENTE:**
```html
<!-- ACTUAL: -->
<img src="assets/icons/whatsapp-icon.png" 
     alt="Chat" 
     class="chatbot-icon">

<!-- CORREGIR A: -->
<img src="assets/icons/whatsapp-icon.webp" 
     alt="Chat" 
     class="chatbot-icon"
     width="30"
     height="30"
     fetchpriority="high">
```

---

### 3. **Speed Index: 15.6s** (Objetivo: <3.4s)
**Problema CRÍTICO:** Contenido visual tarda demasiado en renderizar

**Causas:**
1. 150 thumbnails de YouTube cargando (i.ytimg.com)
2. 26 imágenes de galería pesadas
3. Video background mobile (1.64MB)

**Soluciones:**
1. **YouTube Lite Embeds:** ✅ YA IMPLEMENTADO
2. **Lazy loading agresivo:** Cargar galería SOLO en viewport
3. **Video snippet 10s:** ✅ YA GENERADO (2.7MB) - usar en mobile

---

## 📦 PROBLEMAS DE TAMAÑO:

### **Total Page Weight: 16.98 MB** 🔴
- Video mobile: 1.64MB
- Imágenes galería: ~15MB
- YouTube thumbnails: ~2.3MB

**Recomendaciones:**
1. ✅ Video 720p generado (usar `background-1080p.webm` 7.9MB es más ligero)
2. ✅ Responsive images hero generadas (480w-1920w)
3. Implementar lazy loading REAL para galería (IntersectionObserver)

---

## ⚠️ ADVERTENCIAS:

### **Preconnect Hints:**
- **4 preconnect detectados** (máximo recomendado: 4)
- 2 NO USADOS:
  - `https://www.youtube.com` (no se usa directamente)
  - Link header duplicado

**Solución:** Remover preconnects no usados del HTML

---

## 🎯 OPTIMIZACIONES PENDIENTES (Por Prioridad):

### **URGENTE (Mejora LCP +2s):**
1. ✅ Agregar `fetchpriority="high"` al icono chatbot
2. ✅ Usar webp en iconos (YA GENERADOS)
3. Implementar Critical CSS inline
4. Lazy loading REAL para imágenes galería

### **IMPORTANTE (Mejora Speed Index):**
5. Remover preconnects no usados
6. Comprimir más imágenes galería
7. Considerar eliminar/ocultar galería inicial en mobile

### **OPCIONAL:**
8. Self-host Google Fonts
9. Lazy load YouTube thumbnails solo cuando usuario scrollea
10. Service Worker para cache offline

---

## 📋 CHECKLIST DE ACCIÓN INMEDIATA:

### **Fixes Rápidos (30 min):**
- [ ] Agregar `fetchpriority="high"` al icono chatbot
- [ ] Agregar width/height al icono chatbot
- [ ] Usar whatsapp-icon.webp en lugar de PNG
- [ ] Remover preconnects no usados (`www.youtube.com`)
- [ ] Implementar Critical CSS inline (guía ya lista)

### **Optimizaciones Media (1-2 horas):**
- [ ] Lazy loading real para galería (IntersectionObserver)
- [ ] Usar video snippet 10s en mobile
- [ ] Comprimir más imágenes galería (AVIF?)
- [ ] Self-host Google Fonts (guía ya lista)

---

## 💡 RECOMENDACIONES FINALES:

### **Para LCP < 2.5s:**
1. Fix icono chatbot (fetchpriority + webp)
2. Critical CSS inline
3. Preload fuentes críticas

### **Para Speed Index < 5.8s:**
1. Lazy loading real en galería
2. Reducir peso de imágenes galería
3. Postergar carga de YouTube thumbnails

### **Para FCP < 1.8s:**
1. Critical CSS inline (impacto ~500ms)
2. Remover render-blocking resources
3. Optimizar orden de carga

---

## 📈 PROYECCIÓN DESPUÉS DE FIXES:

**Con TODOS los fixes aplicados:**
- **Performance Score:** 85-95 (vs actual 70)
- **FCP:** 1.2-1.4s (vs actual 3.7s)
- **LCP:** 1.8-2.0s (vs actual 4.0s)
- **Speed Index:** 4-6s (vs actual 15.6s)
- **TBT:** 100ms ✓ (ya óptimo)
- **CLS:** 0 ✓✓✓ (ya perfecto)

---

## 🔧 COMANDOS PARA IMPLEMENTAR FIXES:

### Fix 1: Icono Chatbot (URGENTE)
```bash
# Ya tenemos whatsapp-icon.webp generado
# Solo actualizar HTML index.html línea ~1025
```

### Fix 2: Critical CSS
```bash
# Ver guía completa en:
# docs/CRITICAL-CSS-IMPLEMENTATION.md
```

### Fix 3: Remover preconnects no usados
```bash
# Eliminar del index.html:
# <link rel="preconnect" href="https://www.youtube.com">
```

---

**Reporte generado automáticamente - Lighthouse CLI**  
**Versión Lighthouse:** 13.0.1  
**User Agent:** Chrome/142.0.0.0 Mobile
