# 📊 Resumen de Implementación GTM - Sitio Principal

**Fecha de implementación:** 23 de diciembre de 2025  
**GTM Container ID:** `GTM-5783XFN4`  
**Sitio:** grupomusicalcelula.com

---

## ✅ Cambios Implementados

### 1. Instalación de GTM Container

**Archivos actualizados:**
- ✅ `index.html` - Página principal
- ✅ `blog.html` - Listado de blog
- ✅ `cotizador.html` - Formulario de cotización
- ✅ `testimonios.html` - Página de testimonios
- ✅ 32 posts del blog en `/post/*.html`

**Cambios realizados:**
- ✅ Snippet GTM agregado en `<head>` (JavaScript)
- ✅ Snippet GTM noscript agregado en `<body>`
- ✅ ID actualizado de `GTM-KTG6F589` a `GTM-5783XFN4`

### 2. Limpieza de Código Antiguo

**Código eliminado:**
- ❌ Scripts `gtag.js` antiguos (Google Analytics directo)
- ❌ Código de conversión `AW-943484255` duplicado
- ❌ Referencias a `G-VKRHM9YWLY` (GA4 standalone)

**Resultado:**
Todo el tracking ahora se centraliza en GTM, eliminando código redundante y conflictos.

### 3. Eventos de DataLayer Implementados

#### 📋 Evento: `cotizador_completed`

**Archivo:** `/js/form-handler.js` (línea ~119-129)

**Código implementado:**
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
    event: 'cotizador_completed',
    cotizadorData: {
        tipoEvento: data.evento,
        numeroInvitados: numeroInvitados,
        fechaEvento: data.fecha,
        ubicacion: data.ubicacion
    }
});
```

**Cuándo se dispara:**
Cuando el usuario envía exitosamente el formulario del cotizador.

**Variables disponibles:**
- `cotizadorData.tipoEvento` - Tipo de evento (Boda, XV Años, etc.)
- `cotizadorData.numeroInvitados` - Número de invitados
- `cotizadorData.fechaEvento` - Fecha del evento
- `cotizadorData.ubicacion` - Ubicación del evento

---

#### 📰 Evento: `view_blog_post`

**Archivos:** Todos los posts en `/post/*.html` (32 archivos)

**Código implementado:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const postTitle = document.querySelector('.blog-post-content h1, .post-title, h1')?.textContent?.trim() || 'Post sin título';
    const postUrl = window.location.pathname;
    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'view_blog_post',
        postTitle: postTitle,
        postUrl: postUrl,
        postCategory: 'Blog'
    });
});
```

**Cuándo se dispara:**
Cuando un usuario visita cualquier artículo del blog.

**Variables disponibles:**
- `postTitle` - Título del artículo
- `postUrl` - URL del post
- `postCategory` - Siempre "Blog"

---

## 🎯 Próximos Pasos en GTM Dashboard

### Paso 1: Configurar Variables en GTM

Accede a: https://tagmanager.google.com/ → Container `GTM-5783XFN4`

#### Variables a Crear:

1. **Variable: `DL - cotizadorData`**
   - Tipo: Variable de capa de datos
   - Nombre de variable: `cotizadorData`
   - Versión: 2

2. **Variable: `DL - postTitle`**
   - Tipo: Variable de capa de datos
   - Nombre de variable: `postTitle`
   - Versión: 2

3. **Variable: `DL - postUrl`**
   - Tipo: Variable de capa de datos
   - Nombre de variable: `postUrl`
   - Versión: 2

4. **Variable: `Click URL`** (si no existe)
   - Tipo: Variable de clic
   - Componente: Click URL

5. **Variable: `Click Text`** (si no existe)
   - Tipo: Variable de clic
   - Componente: Click Text

### Paso 2: Configurar Activadores

#### Activador: `Custom Event - cotizador_completed`
- Tipo: Evento personalizado
- Nombre del evento: `cotizador_completed`
- Se activa en: Todos los eventos personalizados

#### Activador: `Custom Event - view_blog_post`
- Tipo: Evento personalizado
- Nombre del evento: `view_blog_post`
- Se activa en: Todos los eventos personalizados

#### Activador: `Click - WhatsApp`
- Tipo: Todos los clics
- Se activa en: Algunos clics
- Condición: `Click URL` **contiene** `wa.me`

#### Activador: `Click - Teléfono`
- Tipo: Todos los clics
- Se activa en: Algunos clics
- Condición: `Click URL` **contiene** `tel:`

### Paso 3: Configurar Etiquetas (Tags)

#### 🎯 Etiqueta: Google Ads - Conversión Cotizador

**Configuración:**
- Tipo: Seguimiento de conversiones de Google Ads
- ID de conversión: `943484255`
- Etiqueta de conversión: `jZjxCKPzodYbEN_a8cED`
- Valor de conversión: `10` (o el valor deseado)
- Código de moneda: `MXN`
- Activación: `Custom Event - cotizador_completed`

#### 📊 Etiqueta: GA4 - Evento Cotizador (Opcional)

**Configuración:**
- Tipo: Evento de Google Analytics 4
- Measurement ID: `GT-5MXH55ZG` (verificar tu ID real)
- Nombre del evento: `cotizador_completed`
- Parámetros del evento:
  - `tipo_evento`: `{{DL - cotizadorData.tipoEvento}}`
  - `invitados`: `{{DL - cotizadorData.numeroInvitados}}`
  - `value`: `10`
  - `currency`: `MXN`
- Activación: `Custom Event - cotizador_completed`

#### 📰 Etiqueta: GA4 - Vista Blog Post

**Configuración:**
- Tipo: Evento de Google Analytics 4
- Measurement ID: `GT-5MXH55ZG`
- Nombre del evento: `view_blog_post`
- Parámetros del evento:
  - `post_title`: `{{DL - postTitle}}`
  - `post_url`: `{{DL - postUrl}}`
  - `content_type`: `blog`
- Activación: `Custom Event - view_blog_post`

#### 💬 Etiqueta: GA4 - Click WhatsApp

**Configuración:**
- Tipo: Evento de Google Analytics 4
- Measurement ID: `GT-5MXH55ZG`
- Nombre del evento: `click_whatsapp`
- Parámetros del evento:
  - `link_url`: `{{Click URL}}`
  - `link_text`: `{{Click Text}}`
  - `page_location`: `{{Page URL}}`
- Activación: `Click - WhatsApp`

#### 📞 Etiqueta: GA4 - Click Teléfono

**Configuración:**
- Tipo: Evento de Google Analytics 4
- Measurement ID: `GT-5MXH55ZG`
- Nombre del evento: `click_phone`
- Parámetros del evento:
  - `link_url`: `{{Click URL}}`
  - `page_location`: `{{Page URL}}`
- Activación: `Click - Teléfono`

---

## 🧪 Cómo Probar con Tag Assistant

### 1. Activar Preview Mode

1. Ve a GTM Dashboard: https://tagmanager.google.com/
2. Selecciona container `GTM-5783XFN4`
3. Click en **Vista previa** (arriba a la derecha)
4. Ingresa URL: `https://grupomusicalcelula.com`
5. Click en **Connect**

### 2. Pruebas a Realizar

#### ✅ Test 1: Carga del Sitio
1. Carga `grupomusicalcelula.com`
2. Verifica en Tag Assistant:
   - ✅ GTM container carga
   - ✅ Tags configuradas se disparan (conversión linker, etc.)

#### ✅ Test 2: Cotizador
1. Ve a `/cotizador`
2. Llena el formulario completo
3. Envía el formulario
4. Verifica en Tag Assistant:
   - ✅ Evento `cotizador_completed` aparece
   - ✅ Etiqueta de Google Ads conversión se dispara
   - ✅ Variables `cotizadorData.*` tienen valores correctos

#### ✅ Test 3: Blog Post
1. Ve a `/blog`
2. Click en cualquier artículo
3. Verifica en Tag Assistant:
   - ✅ Evento `view_blog_post` aparece
   - ✅ Variables `postTitle` y `postUrl` tienen valores
   - ✅ Etiqueta GA4 se dispara

#### ✅ Test 4: Click WhatsApp
1. En cualquier página, click en botón de WhatsApp
2. Verifica en Tag Assistant:
   - ✅ Evento `Click - WhatsApp` aparece
   - ✅ Variable `Click URL` contiene `wa.me`
   - ✅ Etiqueta GA4 se dispara

#### ✅ Test 5: Click Teléfono
1. Click en número de teléfono (si existe en el sitio)
2. Verifica en Tag Assistant:
   - ✅ Evento `Click - Teléfono` aparece
   - ✅ Variable `Click URL` contiene `tel:`

### 3. Revisar en Consola del Navegador

Abre las DevTools (F12) → Consola:

```javascript
// Verificar que GTM cargó
console.log(window.google_tag_manager);

// Verificar dataLayer
console.log(window.dataLayer);

// Ver eventos registrados
window.dataLayer.forEach(item => console.log(item));
```

**Deberías ver:**
- ✅ `gtm.js` event
- ✅ `gtm.load` event
- ✅ `cotizador_completed` (después de enviar formulario)
- ✅ `view_blog_post` (al abrir un post)

---

## 📈 Verificar Conversiones en Google Ads

### Después de 24-48 horas:

1. Ve a Google Ads: https://ads.google.com/
2. Cuenta: `943484255`
3. Menú → **Herramientas y configuración**
4. En **Medición** → **Conversiones**
5. Busca la conversión: `jZjxCKPzodYbEN_a8cED`
6. Verifica que aparezcan conversiones registradas

**Nota:** Las conversiones pueden tardar hasta 48 horas en aparecer.

---

## 📊 Eventos Rastreados - Resumen

| Evento | Dispara en | Conversión | Etiquetas Sugeridas |
|--------|------------|------------|---------------------|
| `cotizador_completed` | Formulario enviado | ✅ Sí | Google Ads, GA4 |
| `view_blog_post` | Vista de artículo | No | GA4 |
| Click WhatsApp | Click en `wa.me` | Opcional | GA4 |
| Click Teléfono | Click en `tel:` | Opcional | GA4 |

---

## 🛠️ Herramientas Útiles

- **GTM Dashboard:** https://tagmanager.google.com/ (Container: GTM-5783XFN4)
- **Google Ads:** https://ads.google.com/ (Cuenta: 943484255)
- **Tag Assistant:** https://tagassistant.google.com/
- **GTM Documentation:** https://support.google.com/tagmanager
- **DataLayer Guide:** https://developers.google.com/tag-platform/devguides/datalayer

---

## 🔍 Troubleshooting

### ❌ GTM no carga

**Verifica en consola:**
```javascript
console.log(window.dataLayer);
// Debe mostrar un array, no 'undefined'
```

**Solución:**
- Verifica que el snippet esté correctamente copiado en `<head>` y `<body>`
- Limpia caché del navegador
- Verifica que no haya errores de JavaScript bloqueando la ejecución

### ❌ Eventos no se disparan

**Verifica:**
1. Preview Mode está activo en GTM
2. El evento existe en Tag Assistant
3. Las condiciones del activador son correctas
4. Las variables capturan los datos

**Revisar en consola:**
```javascript
// Ver eventos del dataLayer
window.dataLayer.filter(item => item.event);
```

### ❌ Conversiones no aparecen en Google Ads

**Causas comunes:**
- Tarda 24-48 horas en aparecer
- Etiqueta de conversión mal configurada
- ID de conversión incorrecto

**Solución:**
1. Verifica en Tag Assistant que la etiqueta se dispara
2. Espera 24-48 horas
3. Revisa en Google Ads → Conversiones

---

## 📝 Checklist Final

### En el Código (✅ COMPLETADO):
- [x] Snippet GTM en todas las páginas HTML
- [x] Código antiguo de tracking eliminado
- [x] Push al dataLayer en cotizador
- [x] Push al dataLayer en posts del blog
- [x] Archivos JS minificados (`form-handler.min.js`)

### En GTM Dashboard (⏳ PENDIENTE):
- [ ] Variables de dataLayer creadas
- [ ] Activadores configurados
- [ ] Etiquetas de Google Ads configuradas
- [ ] Etiquetas de GA4 configuradas (opcional)
- [ ] Probado con Tag Assistant
- [ ] Publicado con nombre de versión

### En Producción (⏳ PENDIENTE):
- [ ] Sitio desplegado con cambios
- [ ] GTM Preview mode probado en producción
- [ ] Eventos se disparan correctamente
- [ ] Conversiones registradas en Google Ads (48h)
- [ ] Sin errores en consola del navegador

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa Tag Assistant:** https://tagassistant.google.com/
2. **Consulta la documentación:** https://support.google.com/tagmanager
3. **Verifica consola del navegador** para errores JavaScript

---

## 🎉 ¡Listo para Despegar!

La implementación del código está **completa**. Los próximos pasos son:

1. ✅ **Configurar etiquetas en GTM Dashboard** (usa esta guía)
2. ✅ **Probar con Tag Assistant** en Preview Mode
3. ✅ **Publicar versión** en GTM
4. ✅ **Desplegar sitio** a producción
5. ✅ **Monitorear conversiones** en Google Ads (24-48h)

**¡Éxito con tu implementación!** 🚀
