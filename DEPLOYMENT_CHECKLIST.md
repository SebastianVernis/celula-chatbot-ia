# 🚀 Checklist de Deployment - Grupo Musical La Célula

## Pre-Deployment (Antes de Desplegar)

### 1. Verificación del Código
- [x] Código limpio y sin errores de sintaxis
- [x] Funciones serverless creadas en `functions/api/`
- [x] Dependencies actualizadas en `package.json` y `functions/package.json`
- [x] Configuración de build en `config/amplify.yml`
- [ ] Tests locales ejecutados y pasando

### 2. Obtener API Keys

#### Gemini API Key (Google)
1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Copia la clave (formato: `AIzaSyC...`)
5. Guárdala de forma segura

#### Resend API Key
1. Ve a: https://resend.com
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el dashboard
4. Crea una nueva API Key
5. Copia la clave (formato: `re_...`)
6. Guárdala de forma segura

### 3. Preparar Email de Contacto
- Decide qué email usarás para recibir notificaciones
- Recomendado: `contacto@grupomusicalcelula.com`

---

## Deployment en AWS Amplify

### Paso 1: Conectar el Repositorio

1. Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Haz clic en "New app" → "Host web app"
3. Selecciona tu proveedor de Git (GitHub, GitLab, etc.)
4. Autoriza AWS Amplify a acceder a tu repositorio
5. Selecciona el repositorio y la rama (ej: `main` o `Desplegada`)
6. Haz clic en "Next"

### Paso 2: Configurar el Build

AWS Amplify debería detectar automáticamente tu configuración desde `config/amplify.yml`.

Verifica que la configuración sea:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Build specification file**: Debe apuntar a `config/amplify.yml`

Si no lo detecta, puedes configurarlo manualmente:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

### Paso 3: Configurar Variables de Entorno

**⚠️ CRÍTICO: Sin estas variables, las funciones no funcionarán**

1. En AWS Amplify Console, ve a tu aplicación
2. En el menú lateral, haz clic en **"Environment variables"**
3. Haz clic en **"Manage variables"**
4. Agrega las siguientes variables:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `GEMINI_API_KEY` | Tu API key de Google Gemini | `AIzaSyC...` |
| `RESEND_API_KEY` | Tu API key de Resend | `re_...` |
| `CONTACT_EMAIL` | Email donde recibirás notificaciones | `contacto@grupomusicalcelula.com` |

5. Haz clic en **"Save"**

### Paso 4: Iniciar el Deployment

1. Haz clic en **"Save and deploy"**
2. AWS Amplify comenzará a construir tu aplicación
3. Espera a que termine (puede tomar 5-10 minutos)
4. Verifica que no haya errores en los logs

### Paso 5: Verificar que las Funciones se Desplegaron

En los logs de build, busca:
```
✓ Serverless functions detected:
  - api/chatbot
  - api/send-email
✓ Functions deployed successfully
```

---

## Post-Deployment (Después de Desplegar)

### 1. Verificar el Sitio Web

1. AWS Amplify te dará una URL (ej: `https://main.d1a2b3c4d5e6f7.amplifyapp.com`)
2. Abre esa URL en tu navegador
3. Verifica que:
   - [ ] El sitio carga correctamente
   - [ ] No hay errores en la consola del navegador
   - [ ] Las imágenes se muestran
   - [ ] Los estilos se aplican correctamente

### 2. Probar el Chatbot

1. Abre el chatbot (botón en la esquina inferior derecha)
2. Envía un mensaje de prueba: "Hola"
3. Verifica que:
   - [ ] El chatbot responde
   - [ ] No hay errores en la consola
   - [ ] La respuesta tiene sentido
4. Completa el formulario de lead capture con datos de prueba
5. Verifica que:
   - [ ] El formulario se envía correctamente
   - [ ] Recibes el email en `CONTACT_EMAIL`
   - [ ] El email tiene el formato correcto

### 3. Probar el Formulario de Cotizador

1. Ve a `/cotizador.html`
2. Llena todos los campos con datos de prueba
3. Envía el formulario
4. Verifica que:
   - [ ] Se muestra mensaje de éxito
   - [ ] Recibes el email en `CONTACT_EMAIL`
   - [ ] El email contiene todos los datos del formulario

### 4. Revisar los Logs

1. En AWS Amplify Console, ve a **"Monitoring"** → **"Functions"**
2. Revisa los logs de cada función:
   - `api/chatbot`
   - `api/send-email`
3. Busca posibles errores o warnings
4. Verifica que los logs muestren:
   ```
   🤖 Chatbot API called
   🔑 GEMINI_API_KEY available: true
   📧 Send-email API called
   🔑 RESEND_API_KEY available: true
   ```

### 5. Testing de Carga

Prueba enviando múltiples requests:
- [ ] Enviar 3-4 mensajes al chatbot rápidamente
- [ ] Enviar 2-3 formularios de cotización
- [ ] Verificar que todos se procesen correctamente
- [ ] Probar el rate limiting (intentar enviar 6+ emails rápido → debe bloquear)

---

## Configuración de Dominio Personalizado (Opcional)

### Si tienes un dominio propio:

1. En AWS Amplify Console, ve a **"Domain management"**
2. Haz clic en **"Add domain"**
3. Ingresa tu dominio (ej: `grupomusicalcelula.com`)
4. Sigue las instrucciones para configurar los DNS records
5. Espera a que el certificado SSL se active (puede tomar hasta 24 horas)

---

## Troubleshooting Común

### ❌ Error: "API Key no configurada"

**Síntoma:** El chatbot no responde o muestra un mensaje de error

**Solución:**
1. Ve a AWS Amplify Console → Environment variables
2. Verifica que `GEMINI_API_KEY` esté configurada
3. Asegúrate de que la variable tenga el nombre exacto (case-sensitive)
4. Redesplega: Deployments → Redeploy this version

### ❌ Error: "Configuración de email no disponible"

**Síntoma:** Los formularios no envían emails

**Solución:**
1. Ve a AWS Amplify Console → Environment variables
2. Verifica que `RESEND_API_KEY` y `CONTACT_EMAIL` estén configuradas
3. Verifica que la API key de Resend sea válida
4. Redesplega la aplicación

### ❌ Error: 404 en `/api/chatbot` o `/api/send-email`

**Síntoma:** Error 404 al llamar a las funciones

**Solución:**
1. Verifica que los archivos estén en `functions/api/chatbot.js` y `functions/api/send-email.js`
2. Revisa los logs de build para ver si las funciones se desplegaron
3. Asegúrate de que los archivos se llamen exactamente `chatbot.js` y `send-email.js`
4. Redesplega la aplicación

### ❌ Build Failed

**Síntoma:** El build falla en AWS Amplify

**Solución:**
1. Revisa los logs de build completos
2. Verifica que `npm run build` funcione localmente
3. Asegúrate de que todas las dependencias estén en `package.json`
4. Verifica que no haya errores de sintaxis en el código

---

## Monitoreo Continuo

### Configurar Alertas (Opcional)

1. En AWS Amplify Console, ve a **"Monitoring"**
2. Configura alertas para:
   - Build failures
   - Function errors
   - High latency

### Revisar Logs Regularmente

- Revisa los logs semanalmente
- Busca patrones de errores
- Monitorea el uso de las API keys
- Verifica que los emails lleguen correctamente

---

## Comandos Útiles

### Redesplegar después de cambios
```bash
git add .
git commit -m "Update configuration"
git push origin main
```

### Probar funciones con cURL
```bash
# Probar chatbot
curl -X POST https://tu-dominio.amplifyapp.com/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","parts":[{"text":"Hola"}]}]}'

# Probar email
curl -X POST https://tu-dominio.amplifyapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"5512345678"}}'
```

---

## Recursos Adicionales

- **Documentación completa:** `docs/AWS_SECRETS_SETUP.md`
- **Guía de testing:** `docs/FUNCTIONS_TESTING.md`
- **Guía para AI Assistants:** `AGENTS.md`
- **AWS Amplify Docs:** https://docs.amplify.aws/hosting/
- **Gemini API Docs:** https://ai.google.dev/docs
- **Resend Docs:** https://resend.com/docs

---

## ✅ Deployment Completado

Si todos los checkboxes están marcados, tu sitio está listo para producción:

- [x] Código desplegado en AWS Amplify
- [ ] Variables de entorno configuradas
- [ ] Chatbot funcionando correctamente
- [ ] Sistema de emails funcionando
- [ ] Logs sin errores
- [ ] Tests de carga pasados
- [ ] Dominio configurado (opcional)
- [ ] Monitoreo activo

🎉 **¡Felicidades! Tu sitio está en producción.**

---

## Soporte

Para problemas o preguntas:
1. Revisa los logs en AWS Amplify Console
2. Consulta `docs/FUNCTIONS_TESTING.md`
3. Consulta `docs/AWS_SECRETS_SETUP.md`
4. Revisa los errores en la consola del navegador (F12)
