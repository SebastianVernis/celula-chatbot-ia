# 📋 TODO: Restauración Completa del Sistema

**Fecha**: 18 de Noviembre de 2025  
**Objetivo**: Restaurar todos los archivos modificados/creados en las conversaciones anteriores

---

## ✅ COMPLETADO (Sistema de Emails)

- [x] `functions/api/send-email.js` - Endpoint unificado creado
- [x] `js/form-handler.js` - Actualizado con nuevo endpoint
- [x] `docs/SISTEMA-EMAIL-RECUPERADO.md` - Documentación de recuperación
- [x] `docs/CONFIGURAR-EMAIL-SYSTEM.md` - Ya existía, verificado

---

## 🔄 PENDIENTE DE RESTAURAR

### 1. Chatbot (`js/chatbot.js`)

**Estado**: ⏳ Pendiente de actualización  
**Prioridad**: 🔴 Alta

**Tareas:**
- [ ] Leer archivo actual `js/chatbot.js` o verificar si existe
- [ ] Actualizar método `sendConversationSummary()` para usar `/api/send-email`
- [ ] Remover cualquier API key expuesta (si existe)
- [ ] Implementar formato de datos para tipo `chatbot`:
  ```javascript
  {
    type: 'chatbot',
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    message: conversationText
  }
  ```
- [ ] Mejorar manejo de errores
- [ ] Añadir notificaciones visuales

**Archivos relacionados:**
- `js/chatbot.js`
- `chatbot.css` (verificar si necesita actualización)

---

### 2. Archivos JavaScript Optimizados

**Estado**: ⏳ Verificar si existen versiones minificadas  
**Prioridad**: 🟡 Media

**Tareas:**
- [ ] Verificar existencia de archivos `.min.js`:
  - [ ] `js/form-handler.min.js`
  - [ ] `js/chatbot.min.js`
  - [ ] `js/blog-pagination.min.js`
  - [ ] `js/gallery-dynamic.min.js`
  - [ ] `js/navigation.min.js`
  - [ ] `js/optimizations.min.js`
  - [ ] `js/site-functionality.min.js`
  - [ ] `js/video-background.min.js`
  - [ ] `js/youtube-carousel.min.js`

- [ ] Si no existen, crear script de minificación:
  - [ ] `scripts/minify-js.sh`

- [ ] Actualizar referencias en HTML si usan versiones minificadas

---

### 3. Archivos CSS Optimizados

**Estado**: ⏳ Verificar optimizaciones  
**Prioridad**: 🟡 Media

**Tareas:**
- [ ] Verificar existencia de:
  - [ ] `css/styles.min.css`
  - [ ] `css/chatbot.min.css`
  - [ ] `css/critical.min.css`

- [ ] Si no existen, crear:
  - [ ] `scripts/minify-css.sh`

- [ ] Verificar que HTML use versiones minificadas en producción

---

### 4. Documentación API

**Estado**: ⏳ Pendiente de recrear  
**Prioridad**: 🟢 Baja (informativa)

**Tareas:**
- [ ] Recrear `docs/EMAIL-API.md` con:
  - [ ] Endpoint `/api/send-email`
  - [ ] Schemas de validación completos
  - [ ] Ejemplos de uso (chatbot y cotizador)
  - [ ] Respuestas del API
  - [ ] Rate limiting info
  - [ ] Troubleshooting
  - [ ] Testing con cURL
  - [ ] Dominios autorizados:
    - `https://grupolacelula.com`
    - `https://www.grupolacelula.com`
    - `https://grupomusicalcelula.pages.dev`
    - `http://localhost:8788`

---

### 5. Scripts de Optimización

**Estado**: ⏳ Verificar si existen  
**Prioridad**: 🟡 Media

**Tareas de verificación:**
- [ ] `scripts/minify-js.sh` - Minificar JavaScript
- [ ] `scripts/minify-css.sh` - Minificar CSS
- [ ] `scripts/generate-responsive-images.sh` - Ya existe, verificar
- [ ] `scripts/optimize-video.sh` - Verificar si existe
- [ ] `scripts/convert-images-to-webp.sh` - Verificar si existe
- [ ] `scripts/update-image-references.sh` - Verificar si existe
- [ ] `scripts/update-minified-references.sh` - Verificar si existe
- [ ] `scripts/analyze-seo.sh` - Verificar si existe

---

### 6. Imágenes Responsive

**Estado**: ⏳ Verificar generación  
**Prioridad**: 🟡 Media

**Tareas:**
- [ ] Verificar si existen versiones responsive de gallery:
  - [ ] `assets/gallery/banda-*-480.webp`
  - [ ] `assets/gallery/banda-*-768.webp`
  - [ ] `assets/gallery/banda-*-1200.webp`

- [ ] Si faltan, ejecutar script de generación
- [ ] Verificar que HTML use `<picture>` con srcset

---

### 7. Service Worker y PWA

**Estado**: ⏳ Verificar configuración  
**Prioridad**: 🟢 Baja

**Tareas:**
- [ ] Verificar `sw.js` está actualizado
- [ ] Verificar `manifest.json` tiene:
  - [ ] Iconos correctos
  - [ ] Nombre del sitio
  - [ ] Colores de tema
  - [ ] URLs start_url correcta

---

### 8. Middleware de Cloudflare

**Estado**: ⏳ Verificar si existe  
**Prioridad**: 🟢 Baja

**Tareas:**
- [ ] Verificar `functions/_middleware.js`
- [ ] Si existe y tiene errores, corregir o eliminar
- [ ] El nuevo sistema de emails no lo requiere

---

### 9. Archivos de Configuración

**Estado**: ⏳ Verificar configuración  
**Prioridad**: 🟡 Media

**Tareas:**
- [ ] Verificar `wrangler.toml` tiene:
  ```toml
  name = "celula-site"
  compatibility_date = "2024-01-01"
  
  [[kv_namespaces]]
  binding = "EMAIL_RATE_LIMIT"
  id = "tu_namespace_id_aqui"  # Actualizar cuando se cree
  ```

- [ ] Verificar `.gitignore` incluye:
  ```
  .dev.vars
  node_modules/
  .wrangler/
  *.min.js
  *.min.css
  ```

---

### 10. Package.json y Dependencias

**Estado**: ⏳ Verificar  
**Prioridad**: 🟡 Media

**Tareas:**
- [ ] Verificar si existe `package.json`
- [ ] Asegurar que incluya:
  ```json
  {
    "dependencies": {
      "resend": "^latest"
    },
    "devDependencies": {
      "wrangler": "^latest"
    }
  }
  ```

- [ ] Ejecutar `npm install` si es necesario

---

### 11. Reportes y Análisis

**Estado**: ✅ Ya existen  
**Prioridad**: 🟢 Baja (informativo)

**Archivos existentes (verificados):**
- [x] `reports/optimization-report-final-20251118.md`
- [x] `reports/lighthouse-report.report.html`
- [x] `reports/lighthouse-report.report.json`
- [x] `reports/seo-analysis-20251118-145032.txt`
- [x] `reports/seo-analysis-20251118-150034.txt`

---

## 📝 ORDEN DE EJECUCIÓN RECOMENDADO

### Fase 1: Crítico (Hacer Primero)
1. ✅ Sistema de emails (YA COMPLETADO)
2. ⏳ Actualizar `js/chatbot.js` con nuevo endpoint
3. ⏳ Configurar variables de entorno en Cloudflare
4. ⏳ Crear y vincular KV namespace

### Fase 2: Importante (Hacer Después)
5. ⏳ Verificar y crear archivos minificados
6. ⏳ Actualizar `package.json` y dependencias
7. ⏳ Verificar scripts de optimización

### Fase 3: Complementario (Cuando Sea Posible)
8. ⏳ Recrear documentación completa (`EMAIL-API.md`)
9. ⏳ Verificar imágenes responsive
10. ⏳ Optimizar Service Worker y PWA

---

## 🔍 COMANDOS ÚTILES PARA VERIFICACIÓN

```bash
# Ver todos los archivos JavaScript
find . -name "*.js" -not -path "./node_modules/*" -not -path "./.git/*"

# Ver archivos minificados
find . -name "*.min.js" -o -name "*.min.css"

# Ver scripts disponibles
ls -la scripts/

# Ver documentación
ls -la docs/

# Verificar imágenes responsive
ls -la assets/gallery/ | grep -E "(480|768|1200)"

# Ver configuración de Cloudflare
cat wrangler.toml

# Ver gitignore
cat .gitignore
```

---

## 📊 PROGRESO ACTUAL

### Completado: 4/11 categorías (36%)

- ✅ Sistema de emails unificado
- ✅ Form handler actualizado
- ✅ Documentación de recuperación
- ✅ Reportes existentes

### Pendiente: 7/11 categorías (64%)

- ⏳ Chatbot
- ⏳ Minificación JS/CSS
- ⏳ Documentación API completa
- ⏳ Scripts de optimización
- ⏳ Imágenes responsive
- ⏳ Configuraciones
- ⏳ Dependencias npm

---

## 🎯 META FINAL

Tener el sistema completamente restaurado y funcional con:
- ✅ Emails seguros y unificados
- ⏳ Chatbot integrado
- ⏳ Assets optimizados
- ⏳ Documentación completa
- ⏳ Scripts de mantenimiento
- ⏳ PWA configurado

---

## 📞 SIGUIENTE SESIÓN

**Prioridades para la próxima conversación:**

1. **Chatbot (`js/chatbot.js`)**
   - Actualizar para usar `/api/send-email`
   - Remover API keys expuestas
   - Mejorar UX

2. **Minificación**
   - Crear/verificar scripts
   - Generar archivos `.min.js` y `.min.css`

3. **Documentación API**
   - Recrear `docs/EMAIL-API.md` completo

4. **Configuración final**
   - Verificar `wrangler.toml`
   - Actualizar `package.json`

---

**Última actualización**: 18 de Noviembre de 2025, 06:22  
**Estado general**: 🟡 En progreso (36% completado)
