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
