# 📊 Guía de Instalación de Google Analytics 4 (GA4)

## 🎯 Pasos para Configurar Google Analytics

### 1. Crear una Cuenta de Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Empezar a medir"** o **"Administrar"** > **"Crear cuenta"**
4. Completa los datos:
   - **Nombre de la cuenta**: Grupo Musical La Célula
   - **Configuración de uso compartido de datos**: Selecciona las opciones que prefieras
5. Haz clic en **"Siguiente"**

### 2. Configurar una Propiedad

1. **Nombre de la propiedad**: Sitio Web La Célula
2. **Zona horaria**: (GMT-06:00) Ciudad de México
3. **Moneda**: Peso mexicano (MXN)
4. Haz clic en **"Siguiente"**

### 3. Información sobre tu Empresa

1. **Sector**: Artes y entretenimiento
2. **Tamaño de la empresa**: Pequeña (1-10 empleados)
3. **Uso previsto**: Selecciona las opciones relevantes
4. Haz clic en **"Crear"**
5. Acepta los términos de servicio

### 4. Configurar Flujo de Datos Web

1. Selecciona **"Web"** como plataforma
2. Completa los datos:
   - **URL del sitio web**: https://www.grupomusicalcelula.com
   - **Nombre del flujo**: Sitio Web Principal
3. Haz clic en **"Crear flujo"**

### 5. Obtener el ID de Medición

Después de crear el flujo, verás tu **ID de medición** (formato: `G-XXXXXXXXXX`)

**¡IMPORTANTE!** Guarda este ID, lo necesitarás para el siguiente paso.

---

## 🔧 Instalación en tu Sitio Web

### Opción 1: Instalación Manual (Recomendada)

Una vez que tengas tu **ID de medición** (G-XXXXXXXXXX), agrega el siguiente código en **TODOS** tus archivos HTML, justo antes de la etiqueta `</head>`:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**⚠️ IMPORTANTE:** Reemplaza `G-XXXXXXXXXX` con tu ID de medición real.

### Archivos que debes actualizar:

- ✅ `index.html`
- ✅ `blog.html`
- ✅ `cotizador.html`
- ✅ Todos los archivos en `post/*.html` (31 archivos)

### Opción 2: Instalación Automatizada con Script

Puedes usar este comando para agregar Google Analytics a todos los archivos HTML automáticamente:

```bash
# Reemplaza G-XXXXXXXXXX con tu ID real
GA_ID="G-XXXXXXXXXX"

# Agregar a archivos principales
for file in index.html blog.html cotizador.html; do
  sed -i "/<\/head>/i\    <!-- Google Analytics 4 -->\n    <script async src=\"https://www.googletagmanager.com/gtag/js?id=$GA_ID\"><\/script>\n    <script>\n      window.dataLayer = window.dataLayer || [];\n      function gtag(){dataLayer.push(arguments);}\n      gtag('js', new Date());\n      gtag('config', '$GA_ID');\n    <\/script>\n" "$file"
  echo "✓ Actualizado: $file"
done

# Agregar a posts del blog
for file in post/*.html; do
  sed -i "/<\/head>/i\    <!-- Google Analytics 4 -->\n    <script async src=\"https://www.googletagmanager.com/gtag/js?id=$GA_ID\"><\/script>\n    <script>\n      window.dataLayer = window.dataLayer || [];\n      function gtag(){dataLayer.push(arguments);}\n      gtag('js', new Date());\n      gtag('config', '$GA_ID');\n    <\/script>\n" "$file"
  echo "✓ Actualizado: $file"
done
```

---

## ✅ Verificar la Instalación

### 1. Verificación en Tiempo Real

1. Ve a tu cuenta de Google Analytics
2. En el menú izquierdo, selecciona **"Informes"** > **"Tiempo real"**
3. Abre tu sitio web en otra pestaña
4. Deberías ver tu visita en el informe de tiempo real

### 2. Verificación con Google Tag Assistant

1. Instala la extensión [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visita tu sitio web
3. Haz clic en el icono de Tag Assistant
4. Verifica que aparezca tu etiqueta de Google Analytics en verde

### 3. Verificación con DevTools

1. Abre tu sitio web
2. Presiona `F12` para abrir las herramientas de desarrollo
3. Ve a la pestaña **"Network"** (Red)
4. Recarga la página
5. Busca peticiones a `google-analytics.com` o `gtag/js`

---

## 📈 Configuraciones Adicionales Recomendadas

### 1. Configurar Eventos Personalizados

Para rastrear interacciones específicas (clics en botones, envío de formularios, etc.):

```javascript
// Ejemplo: Rastrear clic en botón de cotización
document.querySelector('.btn-cotizar').addEventListener('click', function() {
  gtag('event', 'click_cotizacion', {
    'event_category': 'engagement',
    'event_label': 'Botón Cotizar'
  });
});

// Ejemplo: Rastrear envío de formulario
document.querySelector('#cotizador-form').addEventListener('submit', function() {
  gtag('event', 'form_submit', {
    'event_category': 'conversion',
    'event_label': 'Formulario Cotizador'
  });
});
```

### 2. Configurar Conversiones

1. En Google Analytics, ve a **"Administrar"** > **"Eventos"**
2. Marca los eventos importantes como **"Conversiones"**
3. Ejemplos de conversiones:
   - Envío de formulario de cotización
   - Clic en WhatsApp
   - Reproducción de videos
   - Tiempo en página > 3 minutos

### 3. Vincular con Google Search Console

1. Ve a **"Administrar"** > **"Vínculos de Search Console"**
2. Haz clic en **"Vincular"**
3. Selecciona tu propiedad de Search Console
4. Confirma el vínculo

---

## 🎯 Métricas Importantes a Monitorear

### Métricas Clave:
- **Usuarios activos**: Visitantes únicos
- **Sesiones**: Número total de visitas
- **Tasa de rebote**: Porcentaje de visitantes que abandonan sin interactuar
- **Duración promedio de sesión**: Tiempo que pasan en el sitio
- **Páginas por sesión**: Número de páginas vistas por visita

### Eventos Importantes:
- Clics en botones de cotización
- Envíos de formularios
- Clics en redes sociales
- Reproducciones de videos
- Descargas de archivos

### Conversiones:
- Formularios completados
- Clics en WhatsApp
- Llamadas telefónicas
- Solicitudes de cotización

---

## 🔒 Privacidad y GDPR

### Anonimizar IPs (Recomendado)

Agrega esta configuración para cumplir con GDPR:

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true
});
```

### Banner de Cookies (Opcional pero Recomendado)

Considera agregar un banner de consentimiento de cookies para cumplir con regulaciones:

```html
<!-- Ejemplo básico de banner de cookies -->
<div id="cookie-banner" style="position: fixed; bottom: 0; width: 100%; background: #000; color: #fff; padding: 20px; text-align: center; z-index: 9999;">
  <p>Este sitio utiliza cookies para mejorar tu experiencia. 
    <button onclick="acceptCookies()" style="margin-left: 10px; padding: 10px 20px; background: #3D9BE9; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Aceptar</button>
  </p>
</div>

<script>
function acceptCookies() {
  document.getElementById('cookie-banner').style.display = 'none';
  localStorage.setItem('cookiesAccepted', 'true');
  // Inicializar Google Analytics aquí
}

// Verificar si ya aceptó cookies
if (localStorage.getItem('cookiesAccepted') === 'true') {
  document.getElementById('cookie-banner').style.display = 'none';
}
</script>
```

---

## 📞 Soporte y Recursos

### Recursos Oficiales:
- [Centro de Ayuda de Google Analytics](https://support.google.com/analytics)
- [Academia de Google Analytics](https://analytics.google.com/analytics/academy/)
- [Documentación de GA4](https://developers.google.com/analytics/devguides/collection/ga4)

### Problemas Comunes:

**No veo datos en tiempo real:**
- Verifica que el ID de medición sea correcto
- Asegúrate de que no tengas bloqueadores de anuncios activos
- Revisa la consola del navegador en busca de errores

**Los datos tardan en aparecer:**
- Los informes estándar pueden tardar 24-48 horas en procesarse
- Usa el informe de "Tiempo real" para verificación inmediata

**Datos duplicados:**
- Verifica que no hayas instalado el código dos veces
- Revisa que no tengas múltiples propiedades rastreando el mismo sitio

---

## ✨ Resumen de Instalación

1. ✅ Crear cuenta en Google Analytics
2. ✅ Obtener ID de medición (G-XXXXXXXXXX)
3. ✅ Agregar código de seguimiento a todos los archivos HTML
4. ✅ Verificar instalación en tiempo real
5. ✅ Configurar eventos y conversiones personalizadas
6. ✅ Vincular con Google Search Console
7. ✅ Monitorear métricas regularmente

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0  
**Contacto**: Para soporte técnico, consulta la documentación oficial de Google Analytics
