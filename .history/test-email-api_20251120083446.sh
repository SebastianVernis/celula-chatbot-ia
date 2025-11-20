#!/bin/bash

# Script de prueba para la API de envío de emails
# Este script valida los 3 endpoints con payloads reales

echo "🧪 Testing Email API Endpoints"
echo "================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base (cambiar según entorno)
BASE_URL="http://localhost:8788"
# Para producción usar: BASE_URL="https://grupomusicalcelula.pages.dev"

echo "📍 URL Base: $BASE_URL"
echo ""

# Test 1: Chatbot Lead
echo "========================================="
echo "Test 1: Chatbot Lead Capture"
echo "========================================="

CHATBOT_LEAD_PAYLOAD='{
  "type": "chatbot_lead",
  "leadData": {
    "name": "Juan Pérez Test",
    "email": "test@example.com",
    "phone": "5535412631",
    "eventType": "Boda"
  }
}'

echo "📤 Payload:"
echo "$CHATBOT_LEAD_PAYLOAD" | jq .
echo ""

echo "🔄 Enviando request..."
RESPONSE_1=$(curl -s -X POST "$BASE_URL/api/send-email" \
  -H "Content-Type: application/json" \
  -d "$CHATBOT_LEAD_PAYLOAD")

echo "📥 Response:"
echo "$RESPONSE_1" | jq .
echo ""

if echo "$RESPONSE_1" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Test 1 PASSED${NC}"
else
  echo -e "${RED}❌ Test 1 FAILED${NC}"
fi

echo ""
echo ""

# Test 2: Chatbot Summary (Conversación Completa)
echo "========================================="
echo "Test 2: Chatbot Conversation Summary"
echo "========================================="

CHATBOT_SUMMARY_PAYLOAD='{
  "type": "chatbot_summary",
  "leadData": {
    "name": "María González Test",
    "email": "maria@example.com",
    "phone": "5512345678",
    "eventType": "XV Años"
  },
  "conversationData": {
    "full_conversation": "Cliente: Hola, necesito música para mis XV años\n\nAsistente: ¡Hola María! Cuéntame más sobre tu celebración\n\nCliente: Será en diciembre, unos 200 invitados\n\nAsistente: Perfecto, tenemos el paquete ideal para ti",
    "conversation_length": 4,
    "session_start": "2025-11-20T08:00:00.000Z"
  }
}'

echo "📤 Payload:"
echo "$CHATBOT_SUMMARY_PAYLOAD" | jq .
echo ""

echo "🔄 Enviando request..."
RESPONSE_2=$(curl -s -X POST "$BASE_URL/api/send-email" \
  -H "Content-Type: application/json" \
  -d "$CHATBOT_SUMMARY_PAYLOAD")

echo "📥 Response:"
echo "$RESPONSE_2" | jq .
echo ""

if echo "$RESPONSE_2" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Test 2 PASSED${NC}"
else
  echo -e "${RED}❌ Test 2 FAILED${NC}"
fi

echo ""
echo ""

sleep 5

# Test 3: Formulario Cotizador
echo "========================================="
echo "Test 3: Cotizador Form Submission"
echo "========================================="

FORM_COTIZADOR_PAYLOAD='{
  "type": "form_cotizador",
  "formData": {
    "nombre": "Carlos Ramírez Test",
    "email": "carlos@example.com",
    "telefono": "5598765432",
    "tipoEvento": "Evento Corporativo",
    "fechaEvento": "2025-12-15",
    "lugar": "Ciudad de México (CDMX)",
    "numeroInvitados": "101-200",
    "paquete": "Por definir",
    "mensaje": "Necesito cotización para evento de fin de año corporativo"
  }
}'

echo "📤 Payload:"
echo "$FORM_COTIZADOR_PAYLOAD" | jq .
echo ""

echo "🔄 Enviando request..."
RESPONSE_3=$(curl -s -X POST "$BASE_URL/api/send-email" \
  -H "Content-Type: application/json" \
  -d "$FORM_COTIZADOR_PAYLOAD")

echo "📥 Response:"
echo "$RESPONSE_3" | jq .
echo ""

if echo "$RESPONSE_3" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Test 3 PASSED${NC}"
else
  echo -e "${RED}❌ Test 3 FAILED${NC}"
fi

echo ""
echo ""

# Test 4: Tipo Inválido (debe fallar)
echo "========================================="
echo "Test 4: Invalid Type (Should Fail)"
echo "========================================="

INVALID_PAYLOAD='{
  "type": "tipo_invalido",
  "data": {}
}'

echo "📤 Payload:"
echo "$INVALID_PAYLOAD" | jq .
echo ""

echo "🔄 Enviando request..."
RESPONSE_4=$(curl -s -X POST "$BASE_URL/api/send-email" \
  -H "Content-Type: application/json" \
  -d "$INVALID_PAYLOAD")

echo "📥 Response:"
echo "$RESPONSE_4" | jq .
echo ""

if echo "$RESPONSE_4" | jq -e '.success == false and .error == "Tipo no reconocido"' > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Test 4 PASSED (Error esperado)${NC}"
else
  echo -e "${RED}❌ Test 4 FAILED${NC}"
fi

echo ""
echo ""

# Resumen
echo "========================================="
echo "📊 RESUMEN DE PRUEBAS"
echo "========================================="
echo ""
echo "Endpoints probados:"
echo "  1. POST /api/send-email (type: chatbot_lead)"
echo "  2. POST /api/send-email (type: chatbot_summary)"
echo "  3. POST /api/send-email (type: form_cotizador)"
echo "  4. POST /api/send-email (type: invalido)"
echo ""
echo "⚠️  NOTA: Estas pruebas requieren que el servidor esté corriendo"
echo "   con 'npm run dev' o que se ejecuten contra producción."
echo ""
echo "📝 Para ejecutar contra producción:"
echo "   Editar BASE_URL='https://grupomusicalcelula.pages.dev'"
echo ""
