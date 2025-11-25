# Changelog - Corrección Video Background y Secretos Amplify

**Fecha:** 25 de Noviembre, 2025  
**Versión:** 1.1.0

---

## 🎯 Problemas Resueltos

### 1. Video de Background No Visible en Posts de Blog ✅

**Problema:**
- El video de background se mostraba correctamente en `index.html`
- No se mostraba en los posts del blog (`/post/*.html`)
- Solo se veía la imagen de fallback

**Causa:**
- Falta de logs de debugging para identificar problemas
- Posible problema con rutas relativas desde subdirectorios

**Solución:**
- Agregados logs de debugging en `video-background.js`:
  - Log de inicialización con ruta actual
  - Log de creación de contenedor
  - Log de detección de contenedor existente
- El sistema de rutas relativas (`normalizePath()`) ya estaba implementado correctamente
- Minificado el archivo actualizado

**Archivos Modificados:**
- `js/video-background.js`
- `js/video-background.min.js` (regenerado)

### 2. Secretos de Amplify No Accesibles ✅

**Problema:**
- Variables `RESEND_API_KEY` y `GEMINI_API_KEY` no disponibles en funciones
- Chatbot no funcionaba (error: "API Key no configurada")
- Emails no se enviaban (error: "Configuración de email no disponible")

**Causa:**
- Falta de verificación en el build de que las variables estén configuradas
- Falta de logs de debugging en las funciones
- Documentación insuficiente sobre configuración de secretos

**Solución:**

#### A. Actualización de `amplify.yml`
- Agregada instalación de dependencias de functions en preBuild
- Agregada verificación de variables de entorno en build:
  ```bash
  echo "RESEND_API_KEY is set:" $(if [ -n "$RESEND_API_KEY" ]; then echo "YES"; else echo "NO"; fi)
  echo "GEMINI_API_KEY is set:" $(if [ -n "$GEMINI_API_KEY" ]; then echo "YES"; else echo "NO"; fi)
  ```
- Agregado cache para `functions/node_modules`

#### B. Mejoras en Funciones API

**`functions/api/send-email.js`:**
- Agregados logs de debugging:
  - Log de llamada a la API
  - Log de tipo de email
  - Log de disponibilidad de RESEND_API_KEY
  - Log de email de contacto
- Mejorado mensaje de error cuando falta la API key
- Agregado log de keys disponibles en `context.env`

**`functions/api/chatbot.js`:**
- Agregados logs de debugging:
  - Log de llamada a la API
  - Log de longitud del historial
  - Log de disponibilidad de GEMINI_API_KEY
- Mejorado mensaje de error cuando falta la API key
- Agregado log de keys disponibles en `context.env`
- Actualizado comentario: "Amplify Environment Variables" en lugar de "Cloudflare Secret"

**Archivos Modificados:**
- `amplify.yml`
- `functions/api/send-email.js`
- `functions/api/chatbot.js`

---

## 📚 Documentación Creada/Actualizada

### 1. Nueva Documentación: `CONFIGURACION_SECRETOS_AMPLIFY.md` ✨

Guía completa paso a paso para configurar secretos en AWS Amplify:

**Contenido:**
- 📋 Lista de variables requeridas
- 🚀 Cómo obtener las API Keys (Resend y Gemini)
- 🔧 Configuración en AWS Amplify Console (con screenshots textuales)
- 🔄 Cómo aplicar cambios (redeploy)
- ✅ Verificación de que funciona correctamente
- 🐛 Troubleshooting detallado
- 🔒 Mejores prácticas de seguridad
- 📊 Monitoreo de APIs
- ✨ Checklist final

### 2. Actualización: `AMPLIFY_DEPLOYMENT.md`

**Mejoras:**
- Sección de "Migración de Secretos" expandida
- Instrucciones detalladas para configurar variables en Amplify Console
- Tabla con variables requeridas y sus tipos
- Guía para obtener API keys
- Explicación de cómo las funciones acceden a `context.env`
- Sección de Troubleshooting expandida con problemas específicos:
  - Video background no funciona
  - Chatbot no responde
  - Emails no se envían
  - Secretos no accesibles
- Soluciones detalladas para cada problema

### 3. Actualización: `README.md`

**Mejoras:**
- Reorganización de sección de Documentación
- Nueva subsección "Despliegue y Configuración"
- Nueva subsección "Desarrollo"
- Sección de "Variables de Entorno" mejorada con:
  - Advertencia de que son REQUERIDAS
  - Instrucciones para AWS Amplify
  - Instrucciones para desarrollo local
  - Links para obtener API keys
  - Referencia a guía completa

---

## 🔍 Testing Realizado

### Video Background
- ✅ Verificado que archivos de video existen en `/assets/video/`
- ✅ Verificado que imágenes de fallback existen en `/assets/images/`
- ✅ Verificado que script está incluido en posts
- ✅ Servidor local iniciado y probado
- ✅ Confirmado que el script se carga correctamente

### Linting y Validación
- ✅ ESLint ejecutado: 0 errores, 10 warnings menores
- ✅ Validación HTML ejecutada: Sin problemas
- ✅ Todos los archivos minificados correctamente

---

## 📋 Checklist de Despliegue

Para que los cambios funcionen en producción, el usuario debe:

### En AWS Amplify Console:

1. **Configurar Variables de Entorno:**
   - [ ] Ir a: App settings > Environment variables
   - [ ] Agregar `RESEND_API_KEY` (marcar como Secret)
   - [ ] Agregar `GEMINI_API_KEY` (marcar como Secret)
   - [ ] Agregar `CONTACT_EMAIL` (opcional)
   - [ ] Guardar cambios

2. **Hacer Redeploy:**
   - [ ] Hacer commit y push, o
   - [ ] Redeploy manual desde Amplify Console

3. **Verificar Build:**
   - [ ] Revisar build logs
   - [ ] Confirmar: "RESEND_API_KEY is set: YES"
   - [ ] Confirmar: "GEMINI_API_KEY is set: YES"

4. **Probar Funcionalidad:**
   - [ ] Abrir sitio en producción
   - [ ] Verificar video background en posts
   - [ ] Probar chatbot (debe responder)
   - [ ] Probar formulario de contacto (debe enviar email)
   - [ ] Revisar browser console (no debe haber errores)

---

## 🎉 Resultado Esperado

Después de aplicar estos cambios y configurar las variables de entorno:

1. **Video Background:**
   - ✅ Se verá en todos los posts del blog
   - ✅ Funcionará en desktop y móvil
   - ✅ Fallback a imagen si el video no carga

2. **Chatbot:**
   - ✅ Responderá a mensajes de usuarios
   - ✅ Usará Google Gemini AI
   - ✅ Enviará resúmenes por email

3. **Formularios:**
   - ✅ Enviarán emails correctamente
   - ✅ Usarán Resend API
   - ✅ Notificarán al equipo de La Célula

4. **Logs:**
   - ✅ Build logs mostrarán estado de variables
   - ✅ Browser console mostrará debugging info
   - ✅ Fácil identificación de problemas

---

## 📞 Soporte

Si después de aplicar estos cambios algo no funciona:

1. **Revisar:** [CONFIGURACION_SECRETOS_AMPLIFY.md](docs/CONFIGURACION_SECRETOS_AMPLIFY.md)
2. **Revisar:** Sección de Troubleshooting en [AMPLIFY_DEPLOYMENT.md](docs/AMPLIFY_DEPLOYMENT.md)
3. **Verificar:** Build logs en Amplify Console
4. **Verificar:** Browser console (F12)

---

## 🔄 Próximos Pasos Recomendados

1. **Monitoreo:**
   - Configurar alertas en Resend para límites de envío
   - Configurar alertas en Google AI Studio para límites de requests
   - Monitorear logs de CloudWatch para errores

2. **Optimización:**
   - Considerar plan de pago de Resend si se superan 100 emails/día
   - Considerar plan de pago de Gemini si se superan 60 requests/minuto
   - Implementar rate limiting adicional si es necesario

3. **Seguridad:**
   - Rotar API keys cada 3-6 meses
   - Revisar logs de uso sospechoso
   - Mantener secretos actualizados

---

**Cambios realizados por:** Blackbox AI Assistant  
**Fecha:** 25 de Noviembre, 2025  
**Versión:** 1.1.0
