# AWS Lambda Integration - Guía Completa

## Estado de la Integración

✅ **COMPLETADO** - Las funciones serverless han sido convertidas al formato AWS Lambda y están listas para desplegar.

## Resumen de Cambios

### 1. Estructura de Archivos Actualizada

```
deploymentcelula/
├── amplify/
│   └── functions/
│       ├── chatbot/
│       │   ├── handler.js         ✅ Convertido a Lambda
│       │   └── package.json       ✅ Configurado
│       └── send-email/
│           ├── handler.js         ✅ Convertido a Lambda
│           └── package.json       ✅ Configurado
├── functions/                     ⚠️  Formato Cloudflare (legacy)
│   └── api/
│       ├── chatbot.js
│       └── send-email.js
├── js/
│   ├── chatbot.js                 ✅ Ya apunta a /api/chatbot
│   └── form-handler.js            ✅ Ya apunta a /api/send-email
└── amplify.yml                    ✅ Configurado para Lambda
```

### 2. Funciones Lambda Creadas

#### Chatbot Function (`amplify/functions/chatbot/handler.js`)

**Características:**
- ✅ Handler Lambda: `export const handler = async (event) => {...}`
- ✅ Variables de entorno: `process.env.GEMINI_API_KEY`
- ✅ Manejo CORS completo
- ✅ Parseo de body para Lambda
- ✅ Integración con Google Gemini API
- ✅ Logging detallado para CloudWatch

**Endpoint:** `/api/chatbot`  
**Método:** `POST`  
**Request:**
```json
{
  "history": [
    {
      "role": "user",
      "parts": [{"text": "Hola"}]
    }
  ]
}
```

**Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {"text": "¡Hola! ¿Cómo puedo ayudarte?"}
        ]
      }
    }
  ]
}
```

#### Send-Email Function (`amplify/functions/send-email/handler.js`)

**Características:**
- ✅ Handler Lambda: `export const handler = async (event) => {...}`
- ✅ Variables de entorno: `process.env.RESEND_API_KEY`, `process.env.CONTACT_EMAIL`
- ✅ Manejo CORS completo
- ✅ Integración con Resend API
- ✅ 3 tipos de emails: `chatbot_summary`, `chatbot_lead`, `form_cotizador`
- ✅ HTML templates embebidos
- ✅ Logging detallado

**Endpoint:** `/api/send-email`  
**Método:** `POST`  
**Request:**
```json
{
  "type": "chatbot_lead",
  "leadData": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "5512345678",
    "eventType": "Boda"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email enviado",
  "emailId": "re_abc123..."
}
```

### 3. Cambios Técnicos Realizados

#### De Cloudflare a Lambda

| Aspecto | Cloudflare Pages | AWS Lambda |
|---------|-----------------|------------|
| **Función** | `export async function onRequest(context)` | `export const handler = async (event)` |
| **Env Vars** | `context.env.VAR` | `process.env.VAR` |
| **Request Body** | `await context.request.json()` | `JSON.parse(event.body)` |
| **HTTP Method** | `context.request.method` | `event.httpMethod` |
| **Response** | `new Response(json, {status, headers})` | `{statusCode, headers, body: JSON.stringify()}` |

#### Parseo de Body

```javascript
// Lambda puede recibir body como string o object
const data = typeof event.body === 'string' 
  ? JSON.parse(event.body) 
  : event.body;
```

#### Detección de Método HTTP

```javascript
// Amplify puede usar diferentes formatos
const method = event.httpMethod || event.requestContext?.http?.method;
```

## Configuración Requerida en AWS Amplify

### Variables de Entorno

Configurar en: **AWS Amplify Console > App Settings > Environment Variables**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `tu_api_key_aqui` | API key de Google Gemini para chatbot |
| `RESEND_API_KEY` | `re_xxxxxxxxxx` | API key de Resend para emails |
| `CONTACT_EMAIL` | `contacto@grupomusicalcelula.com` | Email destino para formularios |

### Build Settings

El archivo `amplify.yml` ya está configurado:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - echo "🔧 Building serverless functions..."
        - cd amplify/functions/chatbot && npm install --production && cd ../../..
        - cd amplify/functions/send-email && npm install --production && cd ../../..
        - echo "✅ Functions built successfully"
frontend:
  phases:
    preBuild:
      commands:
        - echo "🔍 Checking environment variables..."
        - echo "GEMINI_API_KEY configured:" ${GEMINI_API_KEY:+YES}
        - echo "RESEND_API_KEY configured:" ${RESEND_API_KEY:+YES}
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

## Pasos para Desplegar

### Opción 1: Deployment Automático (Recomendado)

1. **Verificar que las variables de entorno estén configuradas:**
   ```bash
   # En AWS Amplify Console
   App Settings > Environment variables
   ```

2. **Commit y push:**
   ```bash
   git add .
   git commit -m "feat: Complete AWS Lambda integration"
   git push origin main
   ```

3. **Amplify detectará automáticamente:**
   - Las funciones Lambda en `amplify/functions/`
   - Las rutas `/api/chatbot` y `/api/send-email`
   - Las variables de entorno configuradas

### Opción 2: Deploy Manual con Amplify CLI

```bash
# Instalar Amplify CLI
npm install -g @aws-amplify/cli

# Inicializar
amplify init

# Agregar funciones
amplify add function
# Seleccionar: chatbot
# Runtime: NodeJS
# Handler: handler.handler

amplify add function
# Seleccionar: send-email
# Runtime: NodeJS
# Handler: handler.handler

# Desplegar
amplify push
```

### Opción 3: Lambda + API Gateway Manual

Ver guía detallada en: `docs/LAMBDA_MIGRATION_GUIDE.md` sección "Option C"

## Testing en Producción

### 1. Test Chatbot

```bash
# Reemplazar YOUR_APP_URL con tu URL de Amplify
curl -X POST https://YOUR_APP_URL.amplifyapp.com/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "history": [
      {
        "role": "user",
        "parts": [{"text": "Hola, necesito información sobre sus servicios"}]
      }
    ]
  }'
```

**Respuesta esperada:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {"text": "¡Hola! Claro, con gusto..."}
        ]
      }
    }
  ]
}
```

### 2. Test Email

```bash
curl -X POST https://YOUR_APP_URL.amplifyapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chatbot_lead",
    "leadData": {
      "name": "Prueba Testing",
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

### 3. Test desde el Sitio Web

1. Abrir el sitio: `https://YOUR_APP_URL.amplifyapp.com`
2. Hacer clic en el botón del chatbot
3. Escribir un mensaje
4. Verificar que el bot responde
5. Llenar el formulario de contacto (Lead Capture)
6. Verificar que llega el email

## Monitoreo

### CloudWatch Logs

Ver logs en tiempo real:

1. AWS Console → CloudWatch → Log Groups
2. Buscar:
   - `/aws/lambda/chatbot-XXXXX`
   - `/aws/lambda/send-email-XXXXX`
3. Ver streams de log recientes

### Métricas Clave

Monitorear en CloudWatch:
- **Invocations**: Número de llamadas
- **Errors**: Errores 5xx
- **Duration**: Tiempo de ejecución
- **Throttles**: Solicitudes limitadas

### Logs de Ejemplo

**Chatbot exitoso:**
```
🤖 Lambda Chatbot called
📊 History length: 3
🔑 GEMINI_API_KEY available: true
Response returned successfully
```

**Email exitoso:**
```
📧 Lambda Send-email called
📋 Type: chatbot_lead
🔑 RESEND_API_KEY available: true
📮 Contact email: contacto@grupomusicalcelula.com
Email sent successfully: re_abc123...
```

## Troubleshooting

### Error: Function not found (404)

**Causa:** Amplify no detectó las funciones Lambda  
**Solución:**
1. Verificar estructura: `amplify/functions/FUNCTION_NAME/handler.js`
2. Verificar `amplify.yml` tiene comandos de build backend
3. Redeploy: `git commit --allow-empty -m "Redeploy" && git push`
4. Verificar en Console: Hosting > Compute

### Error: Environment variable not set

**Causa:** Variables no configuradas en Amplify  
**Solución:**
1. AWS Amplify Console > App Settings > Environment variables
2. Agregar: `GEMINI_API_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`
3. Redeploy la app

### Error: CORS

**Causa:** Headers CORS incorrectos  
**Solución:**
Ya implementado en handlers:
```javascript
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Error: Parse error

**Causa:** Body mal parseado  
**Solución:**
Ya implementado:
```javascript
const data = typeof event.body === 'string' 
  ? JSON.parse(event.body) 
  : event.body;
```

### Error: Timeout

**Causa:** Función tarda más de 3 segundos  
**Solución:**
1. AWS Lambda Console > Configuration > General
2. Aumentar Timeout a 30 segundos
3. Memory: Mantener en 256 MB

## Seguridad

### Variables de Entorno

✅ Las API keys están en variables de entorno (no en código)  
✅ No se loggean valores sensibles  
✅ Acceso vía `process.env` protegido

### CORS

✅ Configurado para permitir requests desde cualquier origen  
⚠️ Para producción, considera restringir a tu dominio:
```javascript
"Access-Control-Allow-Origin": "https://tudominio.com"
```

### Rate Limiting

⚠️ **Pendiente:** Implementar rate limiting en Lambda

Opciones:
1. AWS WAF (Web Application Firewall)
2. API Gateway throttling
3. Lambda + DynamoDB para tracking

## Costos Estimados

### Lambda Pricing

**Free Tier (12 meses):**
- 1M requests/mes gratis
- 400,000 GB-segundos gratis

**Después del Free Tier:**
- $0.20 por 1M requests
- $0.0000166667 por GB-segundo

**Estimación para tráfico bajo (1000 requests/día):**
- 30,000 requests/mes
- Costo: **$0.00** (dentro del free tier)

**Estimación para tráfico medio (10,000 requests/día):**
- 300,000 requests/mes
- Costo: **$0.00** (dentro del free tier)

**Estimación para tráfico alto (100,000 requests/día):**
- 3M requests/mes
- Costo: ~**$0.40/mes** ($0.20 × 2M extra)

### Resend Pricing

**Free Tier:**
- 3,000 emails/mes gratis
- Emails adicionales: $1 por 1,000 emails

## Optimizaciones Futuras

### 1. Caching
- [ ] Implementar cache para respuestas comunes del chatbot
- [ ] Usar ElastiCache o DynamoDB

### 2. Cold Start
- [ ] Implementar Provisioned Concurrency para funciones críticas
- [ ] Optimizar tamaño de bundle

### 3. Monitoring
- [ ] Configurar CloudWatch Alarms
- [ ] Integrar con SNS para alertas
- [ ] Dashboard personalizado

### 4. Performance
- [ ] Optimizar memory allocation
- [ ] Usar Lambda Power Tuning
- [ ] Implementar tracing con X-Ray

## Checklist de Deployment

### Pre-deployment
- [x] Funciones convertidas a formato Lambda
- [x] package.json configurado para cada función
- [x] amplify.yml actualizado con build commands
- [x] Frontend apunta a rutas correctas (`/api/*`)
- [x] Documentación completa

### Deployment
- [ ] Variables de entorno configuradas en Amplify Console
- [ ] Code pushed a repositorio
- [ ] Build exitoso en Amplify
- [ ] Funciones desplegadas correctamente

### Post-deployment
- [ ] Test chatbot endpoint
- [ ] Test send-email endpoint
- [ ] Test desde sitio web
- [ ] Verificar logs en CloudWatch
- [ ] Monitorear métricas primeras 24 horas
- [ ] Configurar alertas CloudWatch

## Rollback

Si algo falla, puedes volver a Cloudflare Pages:

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

### Documentación Oficial
- [AWS Lambda Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)
- [AWS Amplify Hosting](https://docs.amplify.aws/hosting/)
- [API Gateway + Lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)
- [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/)

### Guías del Proyecto
- `docs/LAMBDA_MIGRATION_GUIDE.md` - Guía detallada de migración
- `docs/FUNCTIONS_TESTING.md` - Testing comprehensivo
- `docs/AWS_SECRETS_SETUP.md` - Configuración de variables
- `docs/AMPLIFY_FUNCTIONS_FIX.md` - Solución de problemas

### APIs Utilizadas
- [Google Gemini API](https://ai.google.dev/docs)
- [Resend API](https://resend.com/docs/api-reference/introduction)

## Soporte

### Logs y Debugging

Ver logs en tiempo real:
```bash
# AWS CLI
aws logs tail /aws/lambda/chatbot --follow
aws logs tail /aws/lambda/send-email --follow
```

### Contacto

Si hay problemas durante el deployment:
1. Revisar CloudWatch Logs
2. Verificar configuración en Amplify Console
3. Consultar troubleshooting en esta guía
4. Revisar documentación en `docs/`

---

**Última actualización:** 2025-01-29  
**Estado:** ✅ Listo para deployment  
**Próximo paso:** Configurar variables de entorno en AWS Amplify Console y hacer push a repositorio
