# Configuración de Secretos en AWS Amplify

## Variables de Entorno Requeridas

Para que las funciones serverless funcionen correctamente, necesitas configurar las siguientes variables de entorno en AWS Amplify:

### 1. GEMINI_API_KEY
**Función:** Chatbot AI  
**Ubicación:** `functions/api/chatbot.js`  
**Descripción:** API Key de Google Gemini para el chatbot inteligente

**Cómo obtenerla:**
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Copia la clave generada

### 2. RESEND_API_KEY
**Función:** Sistema de emails  
**Ubicación:** `functions/api/send-email.js`  
**Descripción:** API Key de Resend para envío de emails

**Cómo obtenerla:**
1. Ve a [Resend](https://resend.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el dashboard
4. Crea una nueva API Key
5. Copia la clave generada

### 3. CONTACT_EMAIL
**Función:** Sistema de emails  
**Ubicación:** `functions/api/send-email.js`  
**Descripción:** Email de destino para recibir las notificaciones

**Valor sugerido:** `contacto@grupomusicalcelula.com`

---

## Configuración en AWS Amplify Console

### Paso 1: Acceder a la configuración
1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Selecciona tu aplicación
3. En el menú lateral, haz clic en **"Environment variables"** o **"Variables de entorno"**

### Paso 2: Agregar las variables
1. Haz clic en **"Manage variables"** o **"Administrar variables"**
2. Para cada variable, haz clic en **"Add variable"** o **"Agregar variable"**
3. Ingresa los datos:
   - **Variable name:** Nombre exacto (ej: `GEMINI_API_KEY`)
   - **Value:** El valor de la clave (ej: `AIzaSyC...`)
4. Haz clic en **"Save"** o **"Guardar"**

### Paso 3: Variables a configurar

| Variable Name | Type | Example | Required |
|--------------|------|---------|----------|
| `GEMINI_API_KEY` | Secret | `AIzaSyC...` | ✅ Yes |
| `RESEND_API_KEY` | Secret | `re_...` | ✅ Yes |
| `CONTACT_EMAIL` | String | `contacto@grupomusicalcelula.com` | ✅ Yes |

### Paso 4: Redesplegar
Después de agregar las variables:
1. Ve a la pestaña **"Deployments"**
2. Haz clic en **"Redeploy this version"** en el último deployment
3. O simplemente haz un nuevo commit y push a tu rama principal

---

## Verificación

### 1. Verificar que las funciones se desplegaron
```bash
# En la consola de Amplify, revisa los logs de build
# Busca líneas como:
✓ Function api/chatbot deployed
✓ Function api/send-email deployed
```

### 2. Probar el chatbot
1. Ve a tu sitio web
2. Abre el chatbot
3. Envía un mensaje de prueba
4. Deberías recibir una respuesta del asistente

### 3. Probar el sistema de emails
1. Ve al formulario de contacto o cotizador
2. Llena los campos y envía
3. Revisa tu email configurado en `CONTACT_EMAIL`
4. Deberías recibir la notificación

### 4. Revisar logs de errores
En AWS Amplify Console:
1. Ve a **"Monitoring"** → **"Functions"**
2. Selecciona la función a revisar
3. Ve a **"Logs"** para ver errores detallados

---

## Solución de Problemas

### Error: "API Key no configurada"
**Síntoma:** El chatbot no responde o muestra un mensaje de error sobre API Key

**Solución:**
1. Verifica que `GEMINI_API_KEY` esté configurada en AWS Amplify
2. Asegúrate de que la variable tenga el nombre exacto (case-sensitive)
3. Redesplega la aplicación después de configurar la variable

### Error: "Configuración de email no disponible"
**Síntoma:** Los formularios no envían emails

**Solución:**
1. Verifica que `RESEND_API_KEY` y `CONTACT_EMAIL` estén configuradas
2. Comprueba que el email de Resend esté verificado
3. Revisa los logs de la función en AWS Amplify

### Error: "CORS" en las funciones
**Síntoma:** Error de CORS en la consola del navegador

**Solución:**
Las funciones ya tienen configuración CORS. Si persiste:
1. Verifica que las rutas de las funciones sean correctas
2. Comprueba que uses el dominio correcto (no localhost)
3. Revisa que las funciones estén desplegadas correctamente

### La función no se encuentra (404)
**Síntoma:** Error 404 al llamar a `/api/chatbot` o `/api/send-email`

**Solución:**
1. Verifica que las funciones estén en `functions/api/`
2. Asegúrate de que el archivo se llame exactamente `chatbot.js` o `send-email.js`
3. Redesplega la aplicación
4. Verifica en los logs de build que las funciones se hayan detectado

---

## Seguridad

### ⚠️ Importante
- **NUNCA** commits las API keys al repositorio
- **NUNCA** expongas las variables de entorno en el código del frontend
- Usa siempre las funciones serverless para manejar las API keys
- Rota las API keys periódicamente

### Rotación de claves
Si necesitas cambiar una API key:
1. Genera una nueva clave en el servicio correspondiente
2. Actualiza la variable en AWS Amplify Console
3. Redesplega la aplicación
4. Revoca la clave antigua solo después de confirmar que la nueva funciona

---

## Arquitectura de Funciones

```
Frontend (Navegador)
    ↓
    ↓ HTTPS Request
    ↓
AWS Amplify Functions (Serverless)
    ├─ /api/chatbot
    │   ├─ Lee context.env.GEMINI_API_KEY
    │   └─ Llama a Google Gemini API
    │
    └─ /api/send-email
        ├─ Lee context.env.RESEND_API_KEY
        ├─ Lee context.env.CONTACT_EMAIL
        └─ Llama a Resend API
```

### Flujo de Datos

**Chatbot:**
```
Usuario → chatbot.js (frontend) → /api/chatbot (función) → Gemini API → Respuesta
```

**Email:**
```
Usuario → formulario (frontend) → /api/send-email (función) → Resend API → Email
```

---

## Recursos Adicionales

- [AWS Amplify Functions Documentation](https://docs.amplify.aws/hosting/functions/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Resend API Documentation](https://resend.com/docs)

---

## Checklist de Deployment

- [ ] Variables de entorno configuradas en AWS Amplify Console
- [ ] API Keys válidas y activas
- [ ] Email de contacto verificado en Resend
- [ ] Aplicación redesplegada después de configurar variables
- [ ] Chatbot probado y funcionando
- [ ] Sistema de emails probado y funcionando
- [ ] Logs revisados para confirmar que no hay errores
- [ ] Dominios y CORS configurados correctamente
