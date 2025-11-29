# AWS Amplify Functions - Problema y Solución

## Problema Detectado

Las funciones serverless no se están desplegando correctamente en AWS Amplify porque:

1. **SSM Secrets Setup Failure**: El log muestra `[WARNING]: !Failed to set up process.env.secrets`
2. **404 Error**: Las funciones retornan 404 Not Found
3. **Formato incorrecto**: AWS Amplify espera un formato diferente al de Cloudflare Pages

## Diferencias: Cloudflare Pages vs AWS Amplify

### Cloudflare Pages Functions
```javascript
// functions/api/chatbot.js
export async function onRequest(context) {
  const apiKey = context.env.GEMINI_API_KEY;
  return new Response(JSON.stringify({data}), {
    headers: {'Content-Type': 'application/json'}
  });
}
```

### AWS Amplify Functions
AWS Amplify puede usar dos formatos:

#### Opción 1: AWS Lambda Handler (Recomendado)
```javascript
// amplify/functions/api/chatbot/handler.js
export const handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({data})
  };
};
```

#### Opción 2: Amplify Function Format
```javascript
// amplify/functions/api/chatbot/index.js
export default async function handler(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  // Same return format as Lambda
}
```

## Estructura de Directorios Correcta

### Estructura Actual (Incorrecta para Amplify)
```
functions/
├── api/
│   ├── chatbot.js
│   └── send-email.js
└── package.json
```

### Estructura Requerida para AWS Amplify
```
amplify/
├── functions/
│   ├── chatbot/
│   │   ├── handler.js         # Handler principal
│   │   ├── package.json       # Dependencies específicas
│   │   └── resource.ts        # Configuración (opcional)
│   └── send-email/
│       ├── handler.js
│       ├── package.json
│       └── resource.ts
└── backend.ts                  # Configuración de backend
```

**O más simple:**
```
amplify/
└── functions/
    ├── chatbot.js            # Exporta handler
    └── send-email.js         # Exporta handler
```

## Solución Propuesta

### Opción A: Migrar a formato AWS Amplify (Mejor para integración completa)

1. **Crear estructura Amplify:**
```bash
mkdir -p amplify/functions/chatbot
mkdir -p amplify/functions/send-email
```

2. **Convertir funciones al formato Lambda:**
- Cambiar `export async function onRequest(context)` → `export const handler = async (event)`
- Cambiar `context.env.VAR` → `process.env.VAR`
- Cambiar Response → objeto con statusCode, headers, body

3. **Configurar en amplify.yml:**
```yaml
backend:
  phases:
    build:
      commands:
        - npm ci --prefix amplify/functions/chatbot
        - npm ci --prefix amplify/functions/send-email
```

### Opción B: Usar API Gateway + Lambda directo (Más flexible)

1. **Crear Lambda functions en AWS:**
   - Crear función `celula-chatbot`
   - Crear función `celula-send-email`
   
2. **Configurar API Gateway:**
   - Crear API REST
   - Rutas: `/api/chatbot` → Lambda chatbot
   - Rutas: `/api/send-email` → Lambda send-email

3. **Actualizar frontend:**
   - Cambiar URLs de API a API Gateway endpoint

### Opción C: Mantener Cloudflare Pages Functions (Más rápido)

Mantener el deployment original en Cloudflare Pages que funcionaba correctamente:

1. **Revertir a Cloudflare Pages:**
   - Re-deploy en Cloudflare Pages
   - Funciones ya funcionan correctamente allí
   
2. **AWS Amplify solo para hosting estático:**
   - Desplegar solo archivos HTML/CSS/JS en Amplify
   - API calls apuntan a Cloudflare Pages Functions

## Variables de Entorno en AWS Amplify

### Problema Actual
```
[WARNING]: !Failed to set up process.env.secrets
```

Esto indica que las variables no están configuradas correctamente en SSM Parameter Store.

### Solución

#### 1. Configurar en Amplify Console (Recomendado)
```
AWS Amplify Console
→ Tu aplicación
→ Environment variables
→ Manage variables
→ Add variable:
   - GEMINI_API_KEY
   - RESEND_API_KEY  
   - CONTACT_EMAIL
```

#### 2. Verificar en Build
En `amplify.yml`:
```yaml
frontend:
  phases:
    preBuild:
      commands:
        - echo "GEMINI_API_KEY configured:" ${GEMINI_API_KEY:+YES}
        - echo "RESEND_API_KEY configured:" ${RESEND_API_KEY:+YES}
```

#### 3. Acceso en Funciones Lambda
```javascript
// En handler.js
export const handler = async (event) => {
  // Variables disponibles en process.env
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'GEMINI_API_KEY not configured'
      })
    };
  }
  
  // Usar apiKey...
};
```

## Recomendación Final

### Opción Recomendada: Volver a Cloudflare Pages

**Razones:**
1. ✅ Las funciones ya funcionan perfectamente en Cloudflare
2. ✅ No requiere refactorización de código
3. ✅ Deployment más simple
4. ✅ Variables de entorno ya configuradas
5. ✅ CORS ya configurado
6. ✅ Más económico (plan gratuito generoso)

**Si necesitas usar AWS Amplify:**
- Usa Amplify solo para hosting estático
- Mantén las funciones en Cloudflare Pages
- Actualiza las URLs de API en el frontend para apuntar a Cloudflare

### Pasos para volver a Cloudflare Pages:

1. **Re-deploy en Cloudflare:**
```bash
cd /home/sebastianvernis/Proyectos/deploymentcelula
npx wrangler pages deploy dist --project-name=celula-site
```

2. **Configurar variables en Cloudflare:**
```bash
npx wrangler pages secret put GEMINI_API_KEY
npx wrangler pages secret put RESEND_API_KEY
```

3. **Verificar funciones:**
```bash
curl https://celula-site.pages.dev/api/chatbot -X POST \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","parts":[{"text":"test"}]}]}'
```

## Referencias

- [AWS Amplify Functions](https://docs.amplify.aws/gen2/build-a-backend/functions/)
- [AWS Lambda Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Diferencias Cloudflare vs Lambda](https://developers.cloudflare.com/pages/functions/api-reference/)
