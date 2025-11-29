# ✅ AWS Lambda Integration - LISTO PARA DEPLOYMENT

## Estado Actual

**🎉 LA INTEGRACIÓN AWS LAMBDA ESTÁ COMPLETA Y LISTA PARA DESPLEGAR**

## ¿Qué se ha completado?

### 1. ✅ Funciones Lambda Creadas

**Ubicación:** `amplify/functions/`

- **chatbot/handler.js**
  - Convertido de formato Cloudflare a Lambda
  - Handler: `export const handler = async (event)`
  - Variables de entorno: `process.env.GEMINI_API_KEY`
  - CORS configurado
  - Logging detallado para CloudWatch
  
- **send-email/handler.js**
  - Convertido de formato Cloudflare a Lambda
  - Handler: `export const handler = async (event)`
  - Variables de entorno: `process.env.RESEND_API_KEY`, `process.env.CONTACT_EMAIL`
  - CORS configurado
  - 3 tipos de emails soportados

### 2. ✅ Configuración de Build

**amplify.yml actualizado:**
```yaml
backend:
  phases:
    build:
      commands:
        - cd amplify/functions/chatbot && npm install --production
        - cd amplify/functions/send-email && npm install --production
```

### 3. ✅ Frontend Configurado

El código JavaScript ya apunta a las rutas correctas:
- `/api/chatbot` → Lambda chatbot
- `/api/send-email` → Lambda send-email

**Archivos verificados:**
- `js/chatbot.js` ✅
- `js/form-handler.js` ✅

### 4. ✅ Documentación Completa

**Guías creadas:**
- `docs/AWS_LAMBDA_INTEGRATION_COMPLETE.md` - Guía completa de integración
- `docs/LAMBDA_MIGRATION_GUIDE.md` - Guía detallada de migración
- `docs/AGENTS.md` - Actualizado con información de Lambda

## Próximos Pasos (EN ORDEN)

### Paso 1: Configurar Variables de Entorno en AWS Amplify

1. **Ir a AWS Amplify Console:**
   - https://console.aws.amazon.com/amplify/
   - Seleccionar tu aplicación

2. **Navegar a Environment variables:**
   - App Settings > Environment variables
   - Click "Manage variables"

3. **Agregar las siguientes variables:**

   | Variable | Valor | Dónde obtenerla |
   |----------|-------|-----------------|
   | `GEMINI_API_KEY` | tu_api_key | https://makersuite.google.com/app/apikey |
   | `RESEND_API_KEY` | re_xxxxxxxxxx | https://resend.com/api-keys |
   | `CONTACT_EMAIL` | contacto@grupomusicalcelula.com | Tu email de contacto |

4. **Guardar cambios**

### Paso 2: Deploy a AWS Amplify

```bash
# Opción A: Commit y push (deployment automático)
git add .
git commit -m "feat: Complete AWS Lambda integration for chatbot and email"
git push origin main

# AWS Amplify detectará el push y desplegará automáticamente
```

### Paso 3: Verificar Deployment

1. **Esperar a que termine el build en Amplify Console**
   - Frontend build
   - Backend build (Lambda functions)
   - Deploy

2. **Verificar funciones en Amplify Console:**
   - Ir a: Hosting > Compute
   - Deberías ver:
     - `chatbot` function
     - `send-email` function

3. **Verificar logs:**
   - Build logs: Buscar "✅ Functions built successfully"
   - Pre-build logs: Verificar que las variables están configuradas:
     ```
     GEMINI_API_KEY configured: YES
     RESEND_API_KEY configured: YES
     CONTACT_EMAIL: contacto@grupomusicalcelula.com
     ```

### Paso 4: Testing en Producción

#### Test Chatbot

```bash
# Reemplazar YOUR_APP_URL con tu URL de Amplify
curl -X POST https://YOUR_APP_URL.amplifyapp.com/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "history": [
      {
        "role": "user",
        "parts": [{"text": "Hola, necesito información"}]
      }
    ]
  }'
```

**Respuesta esperada:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{"text": "¡Hola! Claro, con gusto..."}]
    }
  }]
}
```

#### Test Email

```bash
curl -X POST https://YOUR_APP_URL.amplifyapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chatbot_lead",
    "leadData": {
      "name": "Prueba",
      "email": "test@example.com",
      "phone": "5512345678",
      "eventType": "Prueba"
    }
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Email enviado",
  "emailId": "re_abc123..."
}
```

#### Test desde el sitio web

1. Abrir: `https://YOUR_APP_URL.amplifyapp.com`
2. Click en botón del chatbot
3. Escribir mensaje y verificar respuesta
4. Llenar formulario de lead capture
5. Verificar que llega el email

### Paso 5: Monitoreo

#### CloudWatch Logs

```bash
# Ver logs en tiempo real (requiere AWS CLI)
aws logs tail /aws/lambda/chatbot --follow
aws logs tail /aws/lambda/send-email --follow
```

**O desde la consola:**
1. AWS Console → CloudWatch → Log groups
2. Buscar: `/aws/lambda/chatbot-XXXXX`
3. Ver streams recientes

#### Métricas

Monitorear en CloudWatch:
- **Invocations**: Número de llamadas
- **Errors**: Errores 5xx
- **Duration**: Tiempo de ejecución
- **Throttles**: Rate limiting

## Troubleshooting

### Si las funciones devuelven 404

**Solución:**
1. Verificar en Amplify Console > Hosting > Compute
2. Si no aparecen las funciones:
   - Verificar estructura: `amplify/functions/FUNCTION_NAME/handler.js`
   - Redeploy: `git commit --allow-empty -m "Redeploy" && git push`

### Si las variables de entorno no están disponibles

**Solución:**
1. AWS Amplify Console > App Settings > Environment variables
2. Verificar que estén configuradas correctamente
3. Redeploy la aplicación

### Si hay errores de CORS

**Solución:**
Ya está implementado en los handlers. Si persiste:
1. Verificar logs de CloudWatch
2. Asegurar que el OPTIONS method está manejado
3. Verificar headers: `Access-Control-Allow-Origin: *`

## Rollback Plan

Si algo falla crítico, puedes volver a Cloudflare Pages:

```bash
# 1. Deploy a Cloudflare
cd /home/sebastianvernis/Proyectos/deploymentcelula
npx wrangler pages deploy dist --project-name=celula-site

# 2. Configurar secrets
npx wrangler pages secret put GEMINI_API_KEY
npx wrangler pages secret put RESEND_API_KEY

# 3. Verificar
curl https://celula-site.pages.dev/api/chatbot -X POST \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","parts":[{"text":"test"}]}]}'
```

## Recursos

### Documentación del Proyecto
- **Guía completa:** `docs/AWS_LAMBDA_INTEGRATION_COMPLETE.md`
- **Guía de migración:** `docs/LAMBDA_MIGRATION_GUIDE.md`
- **Testing:** `docs/FUNCTIONS_TESTING.md`
- **Secrets:** `docs/AWS_SECRETS_SETUP.md`

### APIs Utilizadas
- **Google Gemini:** https://ai.google.dev/docs
- **Resend API:** https://resend.com/docs/api-reference/introduction

### AWS Documentation
- **Lambda Node.js:** https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html
- **Amplify Hosting:** https://docs.amplify.aws/hosting/
- **CloudWatch Logs:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/

## Checklist de Deployment

- [ ] Variables de entorno configuradas en Amplify Console
  - [ ] GEMINI_API_KEY
  - [ ] RESEND_API_KEY
  - [ ] CONTACT_EMAIL
- [ ] Code commiteado y pusheado a repositorio
- [ ] Build exitoso en Amplify Console
- [ ] Funciones desplegadas (verificar en Hosting > Compute)
- [ ] Test chatbot endpoint ✅
- [ ] Test send-email endpoint ✅
- [ ] Test desde sitio web ✅
- [ ] CloudWatch logs verificados ✅
- [ ] Monitoreo configurado (primeras 24 horas) ✅

## Costos Estimados

**AWS Lambda Free Tier (12 meses):**
- 1M requests/mes GRATIS
- 400,000 GB-segundos GRATIS

**Para tráfico típico (1000-10000 requests/día):**
- **Costo: $0.00** (dentro del free tier)

**Para tráfico alto (100,000 requests/día):**
- **Costo: ~$0.40/mes**

## Soporte

Si encuentras algún problema:
1. Revisar logs de CloudWatch
2. Verificar configuración en Amplify Console
3. Consultar troubleshooting en `docs/AWS_LAMBDA_INTEGRATION_COMPLETE.md`
4. Revisar `docs/LAMBDA_MIGRATION_GUIDE.md`

---

**Fecha:** 2025-01-29  
**Estado:** ✅ LISTO PARA DEPLOYMENT  
**Próximo paso:** Configurar variables de entorno en AWS Amplify Console

**¡TODO ESTÁ LISTO! Solo falta configurar las variables de entorno y hacer push al repositorio.**
