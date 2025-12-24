# 🧪 Pruebas Locales - GTM Implementation

## Pre-requisitos

- ✅ Implementación de código completada
- ✅ Servidor local corriendo
- ✅ Acceso a GTM Container (GTM-5783XFN4)
- ✅ Navegador con DevTools

---

## 🚀 Paso 1: Iniciar Servidor Local

```bash
# Navega al directorio del proyecto
cd /home/sebastianvernis/celula-chatbot-ia

# Opción 1: Usar Python
python3 -m http.server 8000

# Opción 2: Usar Node.js
npx serve -p 8000

# Opción 3: Usar VS Code Live Server
# (Click derecho en index.html → Open with Live Server)
```

**URL local:** http://localhost:8000

---

## 🔍 Paso 2: Verificar GTM Carga

### En el Navegador:

1. Abre http://localhost:8000
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**

### Verificar dataLayer:

```javascript
// Verificar que dataLayer existe
console.log(window.dataLayer);
// Debe mostrar un array

// Ver todos los eventos
window.dataLayer.forEach(item => {
    if (item.event) console.log('Event:', item.event);
});

// Verificar GTM cargó
console.log(window.google_tag_manager);
// Debe mostrar un objeto con GTM-5783XFN4
```

**✅ Esperado:**
- `dataLayer` es un array
- Eventos iniciales: `gtm.js`, `gtm.load`
- `google_tag_manager['GTM-5783XFN4']` existe

---

## 🧪 Paso 3: Test Cotizador

### 1. Navega al Cotizador

```
http://localhost:8000/cotizador.html
```

### 2. Llena el Formulario

- **Nombre:** Tu nombre
- **Email:** test@example.com
- **Teléfono:** 5512345678
- **Evento:** Boda
- **Fecha:** Cualquier fecha futura
- **Ubicación:** CDMX
- **Invitados:** 100-150
- **Comentarios:** Test GTM

### 3. Antes de Enviar

Abre la consola y ejecuta:

```javascript
// Listener para capturar el evento
window.dataLayer = window.dataLayer || [];
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
    console.log('📊 DataLayer Push:', args);
    return originalPush.apply(this, args);
};
```

### 4. Envía el Formulario

Observa la consola. **Deberías ver:**

```javascript
📊 DataLayer Push: [{
    event: 'cotizador_completed',
    cotizadorData: {
        tipoEvento: 'Boda',
        numeroInvitados: '100-150',
        fechaEvento: '2025-12-31',
        ubicacion: 'CDMX'
    }
}]
```

### 5. Verificar en dataLayer

```javascript
// Ver último evento
console.log(window.dataLayer[window.dataLayer.length - 1]);

// Filtrar solo el evento cotizador
window.dataLayer.filter(item => item.event === 'cotizador_completed');
```

**✅ Test Exitoso:** Evento `cotizador_completed` aparece en dataLayer con datos correctos.

---

## 📰 Paso 4: Test Blog Post

### 1. Navega a un Post

```
http://localhost:8000/post/post-2.html
```

### 2. Verifica en Consola

```javascript
// Ver eventos en dataLayer
window.dataLayer.filter(item => item.event === 'view_blog_post');
```

**✅ Esperado:**

```javascript
[{
    event: 'view_blog_post',
    postTitle: 'Cómo Elegir la Música Correcta para tu Próximo Evento Corporativo',
    postUrl: '/post/post-2.html',
    postCategory: 'Blog'
}]
```

### 3. Verificar Log en Consola

Deberías ver:

```
📊 GTM Event: view_blog_post - Cómo Elegir la Música Correcta...
```

**✅ Test Exitoso:** Evento `view_blog_post` se dispara con título correcto.

---

## 💬 Paso 5: Test Click WhatsApp

### 1. En cualquier página, busca el botón de WhatsApp

### 2. Antes de hacer click, prepara la consola:

```javascript
// Listener para clicks
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href.includes('wa.me')) {
        console.log('🔗 WhatsApp Click:', link.href);
    }
}, true);
```

### 3. Click en el botón WhatsApp

**✅ Esperado:**
- Console log: `🔗 WhatsApp Click: https://wa.me/...`
- Click funciona correctamente

**Nota:** El tracking del click se configurará en GTM Dashboard con el activador.

---

## 🔧 Paso 6: Verificar Red (Network)

### En DevTools → Network:

1. Filtra por `gtm`
2. Recarga la página
3. Verifica que se cargue:
   - `gtm.js?id=GTM-5783XFN4`

**✅ Esperado:**
- Status: 200
- Type: script
- Size: ~100KB

---

## 📋 Checklist de Verificación Local

Antes de desplegar a producción, verifica:

- [ ] GTM snippet carga en todas las páginas
- [ ] `window.dataLayer` existe y es un array
- [ ] `window.google_tag_manager['GTM-5783XFN4']` existe
- [ ] Evento `cotizador_completed` se dispara al enviar formulario
- [ ] Variables `cotizadorData.*` tienen valores correctos
- [ ] Evento `view_blog_post` se dispara en posts del blog
- [ ] Variables `postTitle` y `postUrl` son correctas
- [ ] Clicks en WhatsApp funcionan
- [ ] No hay errores en consola relacionados con GTM
- [ ] Archivos JS minificados cargan correctamente

---

## 🐛 Troubleshooting

### ❌ dataLayer is undefined

**Solución:**
```javascript
// Inicializar manualmente
window.dataLayer = window.dataLayer || [];
```

Verifica que el snippet GTM esté en `<head>` **antes** de cualquier otro script.

---

### ❌ Evento no se dispara

**Verifica:**
1. Script está correcto en el HTML
2. No hay errores de JavaScript antes del push
3. DOMContentLoaded se dispara correctamente

```javascript
// Verificar que DOM cargó
if (document.readyState === 'complete') {
    console.log('✅ DOM ready');
} else {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOM ready');
    });
}
```

---

### ❌ Variables vacías

**Verifica:**
1. Selectores correctos en el código
2. Elementos existen en el HTML
3. Timing del evento (esperar a que elementos carguen)

```javascript
// Debug post title
const postTitle = document.querySelector('.blog-post-content h1, .post-title, h1');
console.log('Post Title Element:', postTitle);
console.log('Post Title Text:', postTitle?.textContent);
```

---

## 🎯 Próximo Paso

Una vez que todas las pruebas locales pasan:

1. ✅ **Commit cambios** a git
2. ✅ **Push a repositorio**
3. ✅ **Deploy a producción**
4. ✅ **Configurar GTM Dashboard** (usar `GTM_IMPLEMENTATION_SUMMARY.md`)
5. ✅ **Probar con Tag Assistant** en producción

---

## 📞 Herramientas Útiles

- **Console Snippets:** Guarda los scripts de verificación en Chrome DevTools → Sources → Snippets
- **GTM Preview:** Usar después de configurar el Dashboard
- **Tag Assistant:** https://tagassistant.google.com/

---

**Estado Local:** ⏳ Pendiente de pruebas  
**Documentación:** `GTM_IMPLEMENTATION_SUMMARY.md`
