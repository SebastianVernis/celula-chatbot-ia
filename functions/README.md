# Serverless Functions - Grupo Musical La Célula

Este directorio contiene las funciones serverless que se ejecutan en AWS Amplify.

## Estructura

```
functions/
├── api/
│   ├── chatbot.js         # Endpoint del chatbot con Google Gemini AI
│   └── send-email.js      # Endpoint para envío de emails con Resend
├── package.json           # Dependencies de las funciones
├── package-lock.json
└── README.md             # Este archivo
```

## Funciones Disponibles

### 1. `/api/chatbot` - Chatbot con IA

**Archivo:** `api/chatbot.js`

**Descripción:** Maneja las conversaciones del chatbot usando Google Gemini AI.

**Método:** `POST`

**Request Body:**
```json
{
  "history": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Hola, necesito información sobre sus servicios"
        }
      ]
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
          {
            "text": "¡Hola! Claro que sí..."
          }
        ]
      }
    }
  ]
}
```

**Variables de Entorno Requeridas:**
- `GEMINI_API_KEY`: API key de Google Gemini

**Características:**
- ✅ Conversaciones contextuales
- ✅ Manejo de errores robusto
- ✅ CORS configurado
- ✅ Logging detallado
- ✅ Respuestas en español

---

### 2. `/api/send-email` - Sistema de Emails

**Archivo:** `api/send-email.js`

**Descripción:** Envía emails usando Resend API. Soporta múltiples tipos de notificaciones.

**Método:** `POST`

**Tipos de Email Soportados:**

#### a) Resumen de Chatbot (`chatbot_summary`)
```json
{
  "type": "chatbot_summary",
  "leadData": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "5512345678",
    "eventType": "Boda"
  },
  "conversationData": {
    "conversation_length": 5,
    "full_conversation": "Cliente: Hola\n\nAsistente: ¡Hola!...",
    "session_start": "2025-11-29T10:00:00Z"
  }
}
```

#### b) Captura de Lead (`chatbot_lead`)
```json
{
  "type": "chatbot_lead",
  "leadData": {
    "name": "María García",
    "email": "maria@example.com",
    "phone": "5598765432",
    "eventType": "XV Años"
  }
}
```

#### c) Formulario de Cotización (`form_cotizador`)
```json
{
  "type": "form_cotizador",
  "formData": {
    "nombre": "Carlos López",
    "email": "carlos@example.com",
    "telefono": "5587654321",
    "tipoEvento": "Cumpleaños",
    "fechaEvento": "2025-12-15",
    "lugar": "Casa particular",
    "numeroInvitados": "50",
    "paquete": "Party",
    "mensaje": "Necesito más información"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email enviado",
  "emailId": "12345678-abcd-1234-abcd-1234567890ab"
}
```

**Variables de Entorno Requeridas:**
- `RESEND_API_KEY`: API key de Resend
- `CONTACT_EMAIL`: Email de destino para las notificaciones

**Características:**
- ✅ Múltiples tipos de email
- ✅ Templates HTML responsivos
- ✅ Rate limiting (5 emails/hora por IP)
- ✅ CORS configurado
- ✅ Validación de datos
- ✅ Recomendación automática de paquetes
- ✅ Formato profesional con emojis

---

## Dependencies

```json
{
  "resend": "^4.0.0"
}
```

## Instalación Local

```bash
cd functions
npm install
```

## Variables de Entorno

Las funciones acceden a las variables de entorno a través de `context.env`:

```javascript
const apiKey = context.env.GEMINI_API_KEY;
const resendKey = context.env.RESEND_API_KEY;
const contactEmail = context.env.CONTACT_EMAIL;
```

**⚠️ Configuración en AWS Amplify:**

Estas variables deben configurarse en AWS Amplify Console:
1. Ve a tu aplicación en AWS Amplify
2. Environment variables → Manage variables
3. Agrega:
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`

Ver `docs/AWS_SECRETS_SETUP.md` para instrucciones detalladas.

## Testing

### Probar localmente con curl:

**Chatbot:**
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","parts":[{"text":"Hola"}]}]}'
```

**Email:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"123"}}'
```

### Probar en producción:

Reemplaza `localhost:3000` con tu dominio de Amplify:
```bash
curl -X POST https://tu-app.amplifyapp.com/api/chatbot ...
```

Ver `docs/FUNCTIONS_TESTING.md` para guía completa de testing.

## Arquitectura

```
Frontend (Browser)
    ↓
    ↓ HTTPS POST /api/chatbot
    ↓
AWS Amplify Function (chatbot.js)
    ├─ Valida request
    ├─ Lee context.env.GEMINI_API_KEY
    ├─ Llama a Google Gemini API
    └─ Retorna respuesta

Frontend (Browser)
    ↓
    ↓ HTTPS POST /api/send-email
    ↓
AWS Amplify Function (send-email.js)
    ├─ Valida request y tipo
    ├─ Lee context.env.RESEND_API_KEY
    ├─ Lee context.env.CONTACT_EMAIL
    ├─ Genera HTML del email
    ├─ Llama a Resend API
    └─ Retorna resultado
```

## Seguridad

### Implementado:
- ✅ CORS configurado adecuadamente
- ✅ Validación de request body
- ✅ Rate limiting en emails (5/hora por IP)
- ✅ API keys en variables de entorno (no en código)
- ✅ Manejo seguro de errores sin exponer información sensible
- ✅ HTTPS obligatorio

### Mejores Prácticas:
- ⚠️ No commitear API keys al repositorio
- ⚠️ Rotar las API keys periódicamente
- ⚠️ Monitorear el uso de las APIs
- ⚠️ Revisar logs regularmente

## Logging

Ambas funciones tienen logging detallado:

```javascript
console.log('🤖 Chatbot API called');
console.log('📊 History length:', requestData?.history?.length);
console.log('🔑 GEMINI_API_KEY available:', !!apiKey);
```

Los logs están disponibles en:
**AWS Amplify Console → Monitoring → Functions → Logs**

## Troubleshooting

### Error: "API Key no configurada"
**Causa:** Variable de entorno no configurada en AWS Amplify  
**Solución:** Configurar la variable en AWS Amplify Console y redesplegar

### Error: 404 Not Found
**Causa:** Función no desplegada o ruta incorrecta  
**Solución:** Verificar que los archivos estén en `functions/api/` y redesplegar

### Error: CORS
**Causa:** Headers CORS mal configurados o request desde dominio no permitido  
**Solución:** Verificar headers en las funciones (ya están configurados para `*`)

### Error: Rate Limit (429)
**Causa:** Demasiadas requests desde la misma IP  
**Solución:** Esperar 1 hora o usar otra IP

Ver `docs/FUNCTIONS_TESTING.md` para más troubleshooting.

## Monitoreo

### Métricas a monitorear:
- Número de invocaciones
- Duración de ejecución
- Errores (4xx, 5xx)
- Uso de API quotas (Gemini, Resend)

### Alertas recomendadas:
- Error rate > 5%
- Latencia > 3 segundos
- API quota > 80%

## Mantenimiento

### Actualizaciones de Dependencies:
```bash
cd functions
npm update
npm audit fix
```

### Rotación de API Keys:
1. Generar nuevas keys en los servicios
2. Actualizar en AWS Amplify Console
3. Redesplegar
4. Verificar que funcione
5. Revocar keys antiguas

## Recursos

- [AWS Amplify Functions](https://docs.amplify.aws/hosting/functions/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Resend API](https://resend.com/docs)
- Documentación del proyecto: `../docs/`
