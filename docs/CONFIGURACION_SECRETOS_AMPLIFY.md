# 🔐 Configuración de Secretos en AWS Amplify

## Guía Paso a Paso para Configurar Variables de Entorno

Esta guía te ayudará a configurar correctamente las API keys necesarias para que el sitio web de La Célula funcione completamente en AWS Amplify.

---

## 📋 Variables Requeridas

El sitio necesita las siguientes variables de entorno:

| Variable | Propósito | Requerida | Tipo |
|----------|-----------|-----------|------|
| `RESEND_API_KEY` | Envío de emails (formularios, chatbot) | ✅ Sí | Secret |
| `GEMINI_API_KEY` | Chatbot con IA (Google Gemini) | ✅ Sí | Secret |
| `CONTACT_EMAIL` | Email de destino para notificaciones | ⚠️ Opcional | Plain text |

---

## 🚀 Paso 1: Obtener las API Keys

### RESEND_API_KEY

**Resend** es el servicio que usamos para enviar emails desde el formulario de contacto y el chatbot.

1. **Crear cuenta en Resend:**
   - Ir a: https://resend.com/
   - Hacer clic en "Sign Up" o "Get Started"
   - Registrarse con email o GitHub

2. **Obtener API Key:**
   - Una vez dentro del dashboard, ir a: **API Keys**
   - Hacer clic en **"Create API Key"**
   - Nombre sugerido: `celula-site-production`
   - Permisos: **"Sending access"** (Full access)
   - Copiar la key generada (empieza con `re_`)
   - ⚠️ **Importante:** Guardar la key en un lugar seguro, solo se muestra una vez

3. **Verificar dominio (opcional pero recomendado):**
   - Para mejor deliverability, verificar tu dominio
   - Ir a: **Domains** > **Add Domain**
   - Seguir instrucciones para agregar registros DNS

### GEMINI_API_KEY

**Google Gemini** es la IA que alimenta el chatbot del sitio.

1. **Acceder a Google AI Studio:**
   - Ir a: https://makersuite.google.com/app/apikey
   - O buscar: "Google AI Studio API Key"
   - Iniciar sesión con tu cuenta de Google

2. **Crear API Key:**
   - Hacer clic en **"Create API Key"**
   - Seleccionar proyecto de Google Cloud (o crear uno nuevo)
   - Copiar la key generada (empieza con `AIzaSy`)
   - ⚠️ **Importante:** Guardar la key de forma segura

3. **Verificar límites:**
   - Plan gratuito: 60 requests por minuto
   - Para producción, considerar plan de pago si es necesario

---

## 🔧 Paso 2: Configurar en AWS Amplify

### Método Visual (Recomendado)

1. **Acceder a AWS Amplify Console:**
   ```
   https://console.aws.amazon.com/amplify/
   ```

2. **Seleccionar tu aplicación:**
   - En la lista de aplicaciones, hacer clic en tu app
   - Ejemplo: `celula-site` o `grupo-musical-celula`

3. **Ir a Environment Variables:**
   - En el menú lateral izquierdo
   - Hacer clic en: **App settings** > **Environment variables**

4. **Agregar Variables:**

   **Variable 1: RESEND_API_KEY**
   - Hacer clic en **"Add environment variable"**
   - **Variable name:** `RESEND_API_KEY`
   - **Value:** `re_xxxxxxxxxxxxxxxxxxxxx` (tu key de Resend)
   - ✅ Marcar checkbox: **"Secret"**
   - Hacer clic en **"Save"**

   **Variable 2: GEMINI_API_KEY**
   - Hacer clic en **"Add environment variable"**
   - **Variable name:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx` (tu key de Gemini)
   - ✅ Marcar checkbox: **"Secret"**
   - Hacer clic en **"Save"**

   **Variable 3: CONTACT_EMAIL (Opcional)**
   - Hacer clic en **"Add environment variable"**
   - **Variable name:** `CONTACT_EMAIL`
   - **Value:** `tu-email@ejemplo.com`
   - ⬜ No marcar como secret
   - Hacer clic en **"Save"**

5. **Verificar configuración:**
   - Deberías ver las 3 variables listadas
   - Las variables secretas mostrarán: `••••••••••••`
   - Las variables plain text mostrarán el valor completo

### Método CLI (Avanzado)

Si prefieres usar AWS CLI:

```bash
# Instalar AWS CLI si no lo tienes
# https://aws.amazon.com/cli/

# Configurar credenciales
aws configure

# Agregar variables de entorno
aws amplify update-app \
  --app-id <tu-app-id> \
  --environment-variables \
    RESEND_API_KEY=re_xxxxxxxxxxxxx,\
    GEMINI_API_KEY=AIzaSyxxxxxxxxxx,\
    CONTACT_EMAIL=tu-email@ejemplo.com
```

---

## 🔄 Paso 3: Aplicar Cambios

**Importante:** Las variables de entorno solo están disponibles después de un nuevo deploy.

### Opción A: Hacer un Nuevo Commit

```bash
# Hacer cualquier cambio pequeño (ej: actualizar README)
git add .
git commit -m "chore: trigger redeploy for env vars"
git push origin main
```

### Opción B: Redeploy Manual

1. En AWS Amplify Console
2. Ir a tu aplicación
3. En la rama (ej: `main`), hacer clic en el menú de 3 puntos
4. Seleccionar: **"Redeploy this version"**
5. Confirmar

---

## ✅ Paso 4: Verificar que Funciona

### 1. Verificar Build Logs

1. **Ir a Build History:**
   - En Amplify Console > tu app
   - Ver el último build

2. **Revisar logs de Build:**
   - Expandir la fase **"Build"**
   - Buscar estas líneas:
     ```
     RESEND_API_KEY is set: YES
     GEMINI_API_KEY is set: YES
     ```
   - ✅ Si dice "YES", las variables están configuradas correctamente
   - ❌ Si dice "NO", revisar la configuración

### 2. Probar Funcionalidad

**Probar Chatbot:**
1. Ir a tu sitio: `https://tu-app.amplifyapp.com`
2. Abrir el chatbot (botón flotante)
3. Llenar el formulario inicial
4. Enviar un mensaje
5. Verificar que el bot responde

**Probar Formulario de Contacto:**
1. Ir a la página de cotizador
2. Llenar el formulario
3. Enviar
4. Verificar que recibes el email

### 3. Verificar en Browser Console

1. **Abrir DevTools:**
   - Presionar `F12` o `Ctrl+Shift+I` (Windows/Linux)
   - Presionar `Cmd+Option+I` (Mac)

2. **Ir a Console:**
   - Buscar mensajes del chatbot:
     ```
     🤖 Chatbot API called
     🔑 GEMINI_API_KEY available: true
     ```
   - Buscar mensajes de email:
     ```
     📧 Send-email API called
     🔑 RESEND_API_KEY available: true
     ```

3. **Si ves errores:**
   - `GEMINI_API_KEY no configurada` → Revisar configuración en Amplify
   - `RESEND_API_KEY no configurada` → Revisar configuración en Amplify
   - `404 Not Found` → Problema con las funciones, revisar build

---

## 🐛 Troubleshooting

### Problema: "API Key no configurada"

**Causa:** Las variables no están disponibles en las funciones.

**Solución:**
1. Verificar que las variables estén en: App settings > Environment variables
2. Verificar que los nombres sean exactos: `RESEND_API_KEY`, `GEMINI_API_KEY`
3. Hacer un redeploy
4. Esperar a que el build termine completamente

### Problema: "Error al enviar email"

**Posibles causas:**
1. **API Key inválida:**
   - Verificar que la key de Resend sea correcta
   - Verificar que no tenga espacios al inicio/final
   - Verificar que la key esté activa en Resend dashboard

2. **Límite de envío alcanzado:**
   - Plan gratuito de Resend: 100 emails/día
   - Verificar uso en Resend dashboard

3. **Dominio no verificado:**
   - Resend requiere verificación de dominio para mejor deliverability
   - Verificar dominio en Resend dashboard

### Problema: "Chatbot no responde"

**Posibles causas:**
1. **API Key inválida:**
   - Verificar que la key de Gemini sea correcta
   - Verificar que la key esté activa en Google AI Studio

2. **Límite de requests alcanzado:**
   - Plan gratuito: 60 requests/minuto
   - Verificar uso en Google AI Studio

3. **Región no soportada:**
   - Gemini no está disponible en todos los países
   - Verificar disponibilidad en tu región

### Problema: Variables no aparecen en context.env

**Causa:** Las variables solo están disponibles después del deploy.

**Solución:**
1. Hacer un nuevo deploy (commit o redeploy manual)
2. Esperar a que el build termine
3. Las funciones se reiniciarán automáticamente con las nuevas variables

---

## 🔒 Mejores Prácticas de Seguridad

### ✅ Hacer:
- ✅ Marcar API keys como "Secret" en Amplify
- ✅ Rotar keys periódicamente (cada 3-6 meses)
- ✅ Usar diferentes keys para desarrollo y producción
- ✅ Monitorear uso de APIs en los dashboards
- ✅ Configurar alertas de uso excesivo

### ❌ No Hacer:
- ❌ Nunca commitear API keys en el código
- ❌ Nunca compartir keys en Slack, email, etc.
- ❌ Nunca usar la misma key en múltiples proyectos
- ❌ Nunca exponer keys en el frontend (solo en funciones serverless)

---

## 📊 Monitoreo

### Resend Dashboard
- URL: https://resend.com/emails
- Monitorear:
  - Emails enviados
  - Tasa de entrega
  - Errores

### Google AI Studio
- URL: https://makersuite.google.com/
- Monitorear:
  - Requests por día
  - Latencia
  - Errores

### AWS Amplify
- Monitorear:
  - Build logs
  - Function logs (CloudWatch)
  - Errores en tiempo real

---

## 📞 Soporte

Si tienes problemas:

1. **Revisar esta guía completa**
2. **Revisar logs en Amplify Console**
3. **Revisar browser console (F12)**
4. **Consultar documentación:**
   - Resend: https://resend.com/docs
   - Gemini: https://ai.google.dev/docs
   - Amplify: https://docs.amplify.aws/

---

## ✨ Checklist Final

Antes de considerar la configuración completa:

- [ ] RESEND_API_KEY configurada en Amplify
- [ ] GEMINI_API_KEY configurada en Amplify
- [ ] Ambas marcadas como "Secret"
- [ ] Nuevo deploy realizado
- [ ] Build completado exitosamente
- [ ] Build logs muestran "YES" para ambas keys
- [ ] Chatbot responde correctamente
- [ ] Formulario de contacto envía emails
- [ ] No hay errores en browser console
- [ ] Emails llegan correctamente
- [ ] Monitoreo configurado en Resend y Gemini

---

**¡Listo!** Tu sitio ahora debería funcionar completamente con todas las funcionalidades habilitadas. 🎉
