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
