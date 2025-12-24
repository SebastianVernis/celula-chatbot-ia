# ✅ Checklist Rápido - Implementación GTM

## 🎯 Implementación del Código (COMPLETADO)

- [x] **36 archivos HTML actualizados** con GTM-5783XFN4
  - [x] 4 páginas principales (index, blog, cotizador, testimonios)
  - [x] 32 posts del blog
- [x] **Código antiguo eliminado** (gtag.js, conversiones duplicadas)
- [x] **Eventos implementados:**
  - [x] `cotizador_completed` → Formulario de cotización enviado
  - [x] `view_blog_post` → Vista de artículos del blog
- [x] **Scripts minificados** (`form-handler.min.js`)

---

## 🖥️ Configuración en GTM Dashboard (PENDIENTE)

Accede a: https://tagmanager.google.com/ → Container `GTM-5783XFN4`

### Variables a Crear:
- [ ] `DL - cotizadorData` (tipo: Variable de capa de datos)
- [ ] `DL - postTitle` (tipo: Variable de capa de datos)
- [ ] `DL - postUrl` (tipo: Variable de capa de datos)
- [ ] `Click URL` (tipo: Variable de clic)
- [ ] `Click Text` (tipo: Variable de clic)

### Activadores a Crear:
- [ ] `Custom Event - cotizador_completed`
- [ ] `Custom Event - view_blog_post`
- [ ] `Click - WhatsApp` (condición: Click URL contiene `wa.me`)
- [ ] `Click - Teléfono` (condición: Click URL contiene `tel:`)

### Etiquetas a Crear:
- [ ] **Google Ads - Conversión Cotizador**
  - ID: `943484255`
  - Label: `jZjxCKPzodYbEN_a8cED`
  - Valor: `10 MXN`
  - Activador: `Custom Event - cotizador_completed`
- [ ] **GA4 - Evento Cotizador** (opcional)
- [ ] **GA4 - Vista Blog Post** (opcional)
- [ ] **GA4 - Click WhatsApp** (opcional)
- [ ] **GA4 - Click Teléfono** (opcional)

---

## 🧪 Pruebas (PENDIENTE)

### Preview Mode:
- [ ] Activar Preview en GTM
- [ ] Conectar a `grupomusicalcelula.com`
- [ ] Verificar que GTM carga correctamente

### Test 1: Cotizador
- [ ] Ir a `/cotizador`
- [ ] Llenar y enviar formulario
- [ ] Verificar evento `cotizador_completed` en Tag Assistant
- [ ] Verificar que etiqueta Google Ads se dispara

### Test 2: Blog
- [ ] Abrir cualquier post del blog
- [ ] Verificar evento `view_blog_post` en Tag Assistant
- [ ] Verificar que variables `postTitle` y `postUrl` tienen datos

### Test 3: Clicks
- [ ] Click en botón WhatsApp
- [ ] Verificar evento de click en Tag Assistant
- [ ] Click en teléfono (si existe)

---

## 🚀 Publicación (PENDIENTE)

- [ ] Todas las pruebas pasaron exitosamente
- [ ] Publicar versión en GTM con nombre descriptivo
- [ ] Desplegar sitio a producción
- [ ] Verificar en producción con Preview Mode

---

## 📊 Monitoreo Post-Implementación

### 24-48 horas después:
- [ ] Revisar conversiones en Google Ads (Cuenta: `943484255`)
- [ ] Verificar eventos en GA4 (si configurado)
- [ ] Comprobar que no hay errores en consola

### Semanal:
- [ ] Analizar métricas de conversión
- [ ] Optimizar activadores si es necesario
- [ ] Agregar nuevos eventos según necesidades

---

## 📄 Documentación Completa

Ver archivo: `GTM_IMPLEMENTATION_SUMMARY.md` para guía detallada paso a paso.

---

## 🛠️ Comandos Útiles

### Validar implementación local:
```bash
node tools/validate-gtm-implementation.js
```

### Re-minificar archivos JS:
```bash
npx terser js/form-handler.js -o js/form-handler.min.js -c -m
```

---

## 📞 Enlaces Rápidos

- **GTM Dashboard:** https://tagmanager.google.com/
- **Google Ads:** https://ads.google.com/
- **Tag Assistant:** https://tagassistant.google.com/
- **GTM Help:** https://support.google.com/tagmanager

---

## ✅ Estado Actual

**Código:** ✅ 100% Completado  
**GTM Config:** ⏳ Pendiente  
**Pruebas:** ⏳ Pendiente  
**Producción:** ⏳ Pendiente

---

**Siguiente paso:** Configurar variables, activadores y etiquetas en GTM Dashboard usando la guía detallada.
