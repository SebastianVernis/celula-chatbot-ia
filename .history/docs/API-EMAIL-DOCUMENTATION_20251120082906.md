# Documentación API de Email - Grupo Musical La Célula

## Endpoint Principal

**URL:** `/api/send-email`  
**Método:** `POST`  
**Content-Type:** `application/json`

## Variables de Entorno Requeridas

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=email@destino.com
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxx (solo para chatbot)
```

## Tipos de Email Soportados

### 1. Chatbot Lead Capture (`chatbot_lead`)

Captura inicial del lead cuando el usuario completa el formulario del chatbot.

**Payload:**
```json
{
  "type": "chatbot_lead",
  "leadData": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "5535412631",
    "eventType": "Boda"
  }
}
```

**Usado en:** `js/chatbot.js` → método `handleFormSubmission()`

---

### 2. Chatbot Summary (`chatbot_summary`)

Envía la conversación completa del chatbot con el cliente.

**Payload:**
```json
{
  "type": "chatbot_summary",
  "leadData": {
    "name": "María González",
    "email": "maria@example.com",
    "phone": "5512345678",
    "eventType": "XV Años"
  },
  "conversationData": {
    "full_conversation": "Cliente: Hola, necesito música para mis XV años\n\nAsistente: ¡Hola María! Cuéntame más sobre tu celebración\n\nCliente: Será en diciembre, unos 200 invitados\n\nAsistente: Perfecto, tenemos el paquete ideal para ti",
    "conversation_length": 4,
    "session_start": "2025-11-20T08:00:00.000Z"
  }
}
```

**Características:**
- Incluye la conversación completa en formato texto
- Separa mensajes del Cliente y del Asistente
- Muestra paquete recomendado basado en la conversación
- Enlaces directos a WhatsApp del cliente

**Usado en:** `js/chatbot.js` → método `sendConversationSummary()`

---

### 3. Formulario Cotizador (`form_cotizador`)

Procesa el formulario de cotización del sitio web.

**Payload:**
```json
{
  "type": "form_cotizador",
  "formData": {
    "nombre": "Carlos Ramírez",
    "email": "carlos@example.com",
    "telefono": "5598765432",
    "tipoEvento": "Evento Corporativo",
    "fechaEvento": "2025-12-15",
    "lugar": "Ciudad de México (CDMX)",
    "numeroInvitados": "101-200",
    "paquete": "Por definir",
    "mensaje": "Necesito cotización para evento de fin de año"
  }
}
```

**Campos del formulario HTML:**
- `nombre` - Nombre del cliente (text)
- `email` - Email del cliente (email)
- `telefono` - Teléfono 10 dígitos (tel)
- `evento` - Tipo de evento (select)
- `fecha` - Fecha del evento (date)
- `ubicacion` - Ciudad/ubicación (select)
- `invitados` - Rango de invitados (select): "50-100", "101-200", "201-500", "500+"
- `comentarios` - Comentarios adicionales (textarea, opcional)

**Usado en:** `js/form-handler.js` → maneja formulario en `cotizador.html`

---

## Respuestas de la API

### Éxito (200)
```json
{
  "success": true,
  "message": "Email enviado",
  "emailId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error - Tipo No Reconocido (400)
```json
{
  "success": false,
  "error": "Tipo no reconocido"
}
```

### Error - Configuración (500)
```json
{
  "success": false,
  "error": "Configuración de email no disponible"
}
```

### Error - Rate Limit (429)
```json
{
  "success": false,
  "error": "Límite de emails alcanzado. Por favor intenta más tarde."
}
```

## Rate Limiting

