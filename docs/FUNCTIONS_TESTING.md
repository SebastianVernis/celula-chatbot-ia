# Guía de Testing de Funciones Serverless

## Testing Local de las Funciones

### Requisitos
- Node.js 18+
- npm o yarn
- Variables de entorno configuradas

### Configuración Local

1. **Crear archivo `.env` en la raíz del proyecto:**
```bash
# .env (NO COMMITEAR AL REPOSITORIO)
GEMINI_API_KEY=tu_api_key_de_gemini
RESEND_API_KEY=tu_api_key_de_resend
CONTACT_EMAIL=tu_email@example.com
```

2. **Instalar dependencias:**
```bash
cd functions
npm install
```

---

## Testing de la Función Chatbot

### 1. Prueba Manual con cURL

```bash
curl -X POST https://tu-dominio.amplifyapp.com/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "history": [
      {
        "role": "user",
        "parts": [
          {
            "text": "Hola, necesito información sobre sus servicios para una boda"
          }
        ]
      }
    ]
  }'
```

### 2. Prueba desde el Navegador (Console)

```javascript
// Abrir el sitio web y ejecutar en la consola del navegador
fetch('/api/chatbot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hola, ¿cuánto cuesta una serenata?' }]
      }
    ]
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### 3. Respuesta Esperada

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "¡Hola! Claro que sí, con gusto te informo..."
          }
        ]
      }
    }
  ]
}
```

### 4. Errores Comunes

#### Error: "API Key no configurada"
```json
{
  "error": "API Key no configurada. Por favor, configura GEMINI_API_KEY en AWS Amplify Environment Variables."
}
```
**Solución:** Configura la variable `GEMINI_API_KEY` en AWS Amplify Console

#### Error: "Invalid API Key"
```json
{
  "error": "Error al contactar al asistente..."
}
```
**Solución:** Verifica que la API Key de Gemini sea válida

---

## Testing de la Función Send Email

### 1. Prueba de Email de Chatbot

```bash
curl -X POST https://tu-dominio.amplifyapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chatbot_summary",
    "leadData": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "5512345678",
      "eventType": "Boda"
    },
    "conversationData": {
      "conversation_length": 5,
      "full_conversation": "Cliente: Hola\n\nAsistente: ¡Hola! ¿En qué puedo ayudarte?",
      "session_start": "2025-11-29T10:00:00Z"
    }
  }'
```

### 2. Prueba de Email de Cotizador

```bash
curl -X POST https://tu-dominio.amplifyapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "form_cotizador",
    "formData": {
      "nombre": "María García",
      "email": "maria@example.com",
      "telefono": "5598765432",
      "tipoEvento": "XV Años",
      "fechaEvento": "2025-12-15",
      "lugar": "Salón Las Flores",
      "numeroInvitados": "150",
      "paquete": "Event Plus",
      "mensaje": "Necesito más información sobre el paquete"
    }
  }'
```

### 3. Prueba de Lead Capture

```bash
curl -X POST https://tu-dominio.amplifyapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chatbot_lead",
    "leadData": {
      "name": "Carlos López",
      "email": "carlos@example.com",
      "phone": "5587654321",
      "eventType": "Cumpleaños"
    }
  }'
```

### 4. Respuesta Esperada

```json
{
  "success": true,
  "message": "Email enviado",
  "emailId": "12345678-abcd-1234-abcd-1234567890ab"
}
```

### 5. Errores Comunes

#### Error: "Configuración de email no disponible"
```json
{
  "success": false,
  "error": "Configuración de email no disponible..."
}
```
**Solución:** Configura `RESEND_API_KEY` y `CONTACT_EMAIL` en AWS Amplify

#### Error: "Límite de emails alcanzado"
```json
{
  "success": false,
  "error": "Límite de emails alcanzado. Por favor intenta más tarde."
}
```
**Solución:** Espera 1 hora o usa otra IP (rate limiting activo)

---

## Testing desde el Frontend

### Prueba Integrada del Chatbot

1. Ve a tu sitio web
2. Abre el chatbot (botón en la esquina inferior derecha)
3. Envía mensajes de prueba:
   - "Hola"
   - "¿Cuánto cuesta una boda?"
   - "Necesito información sobre paquetes"
4. Completa el formulario de lead capture
5. Verifica que llegue el email a `CONTACT_EMAIL`

### Prueba del Formulario de Cotizador

1. Ve a `/cotizador.html`
2. Llena todos los campos del formulario
3. Envía el formulario
4. Verifica que:
   - Se muestre mensaje de éxito
   - Llegue el email a `CONTACT_EMAIL`
   - El formato del email sea correcto

---

## Monitoreo en AWS Amplify

### Ver Logs de las Funciones

1. AWS Amplify Console → Tu App
2. **Monitoring** → **Functions**
3. Selecciona la función (`api/chatbot` o `api/send-email`)
4. Haz clic en **View logs**

### Logs a Buscar

#### Chatbot exitoso:
```
🤖 Chatbot API called
📊 History length: 1
🔑 GEMINI_API_KEY available: true
```

#### Email exitoso:
```
📧 Send-email API called
📋 Type: chatbot_summary
🔑 RESEND_API_KEY available: true
📮 Contact email: contacto@grupomusicalcelula.com
```

#### Error típico:
```
❌ GEMINI_API_KEY no configurada en context.env
Available env keys: []
```

---

## Debugging Avanzado

### Agregar Logs Temporales

En `functions/api/chatbot.js`:
```javascript
console.log('🔍 DEBUG - Full context.env:', JSON.stringify(Object.keys(context.env || {})));
console.log('🔍 DEBUG - History:', JSON.stringify(requestData.history));
```

En `functions/api/send-email.js`:
```javascript
console.log('🔍 DEBUG - Request data:', JSON.stringify(data));
console.log('🔍 DEBUG - Resend response:', JSON.stringify(result));
```

### Verificar Variables de Entorno

Crea un endpoint temporal de prueba en `functions/api/test-env.js`:
```javascript
export async function onRequest(context) {
  return new Response(JSON.stringify({
    hasGeminiKey: !!context.env.GEMINI_API_KEY,
    hasResendKey: !!context.env.RESEND_API_KEY,
    contactEmail: context.env.CONTACT_EMAIL || 'NOT_SET',
    availableKeys: Object.keys(context.env || {})
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

**⚠️ IMPORTANTE:** Elimina este archivo después de verificar

---

## Checklist de Testing

### Pre-Deployment
- [ ] Variables de entorno configuradas localmente
- [ ] Funciones probadas localmente
- [ ] Código revisado y sin errores de sintaxis
- [ ] Dependencies actualizadas en `functions/package.json`

### Post-Deployment en AWS
- [ ] Build exitoso sin errores
- [ ] Funciones desplegadas correctamente
- [ ] Variables de entorno configuradas en Amplify Console
- [ ] Chatbot responde correctamente
- [ ] Emails se envían correctamente
- [ ] Logs no muestran errores
- [ ] CORS funciona correctamente
- [ ] Rate limiting funciona (probar 6+ emails rápidos)

### Testing de Carga
- [ ] Probar múltiples requests simultáneos al chatbot
- [ ] Probar formularios con diferentes datos
- [ ] Verificar que los emails tengan el formato correcto
- [ ] Probar desde diferentes navegadores
- [ ] Probar desde móvil

---

## Scripts de Testing Automatizado

Crear archivo `test-functions.sh`:
```bash
#!/bin/bash

DOMAIN="https://tu-dominio.amplifyapp.com"

echo "🧪 Testing Chatbot Function..."
curl -s -X POST $DOMAIN/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","parts":[{"text":"test"}]}]}' \
  | jq

echo "\n📧 Testing Email Function..."
curl -s -X POST $DOMAIN/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"5512345678"}}' \
  | jq

echo "\n✅ Tests completed"
```

Hacer ejecutable:
```bash
chmod +x test-functions.sh
./test-functions.sh
```

---

## Troubleshooting Matrix

| Síntoma | Causa Probable | Solución |
|---------|----------------|----------|
| 404 en `/api/chatbot` | Función no desplegada | Verificar `functions/api/chatbot.js` existe y redesplegar |
| 500 con "API Key no configurada" | Variable no configurada | Configurar en AWS Amplify Console |
| CORS error | Headers incorrectos | Verificar que las funciones tengan headers CORS |
| Email no llega | Resend API key inválida | Verificar key y dominio verificado en Resend |
| Respuesta vacía del chatbot | Gemini API error | Revisar logs de la función en AWS |
| Rate limit 429 | Demasiados requests | Esperar 1 hora o implementar KV storage |

---

## Recursos

- [AWS Amplify Functions Docs](https://docs.amplify.aws/hosting/functions/)
- [Gemini API Testing](https://ai.google.dev/docs)
- [Resend Testing](https://resend.com/docs/send-with-nodejs)
