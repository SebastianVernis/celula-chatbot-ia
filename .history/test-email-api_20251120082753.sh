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
