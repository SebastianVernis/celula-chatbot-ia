#!/bin/bash

# Script de verificación para AWS Lambda Integration
# Verifica que todos los archivos necesarios estén en su lugar

echo "🔍 Verificando integración AWS Lambda..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
    else
        echo -e "${RED}❌${NC} $1 - NOT FOUND"
        ((errors++))
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
    else
        echo -e "${RED}❌${NC} $1/ - NOT FOUND"
        ((errors++))
    fi
}

# Function to check file content
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $1 contains: $2"
    else
        echo -e "${YELLOW}⚠️${NC}  $1 might be missing: $2"
        ((warnings++))
    fi
}

echo "📂 Verificando estructura de directorios..."
check_dir "amplify"
check_dir "amplify/functions"
check_dir "amplify/functions/chatbot"
check_dir "amplify/functions/send-email"
echo ""

echo "📄 Verificando archivos Lambda..."
check_file "amplify/functions/chatbot/handler.js"
check_file "amplify/functions/chatbot/package.json"
check_file "amplify/functions/send-email/handler.js"
check_file "amplify/functions/send-email/package.json"
echo ""

echo "🔧 Verificando configuración..."
check_file "amplify.yml"
check_content "amplify.yml" "amplify/functions/chatbot"
check_content "amplify.yml" "amplify/functions/send-email"
echo ""

echo "💻 Verificando código Lambda..."
check_content "amplify/functions/chatbot/handler.js" "export const handler"
check_content "amplify/functions/chatbot/handler.js" "process.env.GEMINI_API_KEY"
check_content "amplify/functions/send-email/handler.js" "export const handler"
check_content "amplify/functions/send-email/handler.js" "process.env.RESEND_API_KEY"
echo ""

echo "🎯 Verificando frontend..."
check_file "js/chatbot.js"
check_file "js/form-handler.js"
check_content "js/chatbot.js" "/api/chatbot"
check_content "js/form-handler.js" "/api/send-email"
echo ""

echo "📚 Verificando documentación..."
check_file "docs/AWS_LAMBDA_INTEGRATION_COMPLETE.md"
check_file "docs/LAMBDA_MIGRATION_GUIDE.md"
check_file "AWS_LAMBDA_READY.md"
echo ""

echo "═══════════════════════════════════════════════════════"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ VERIFICACIÓN EXITOSA${NC}"
    echo "Todo está listo para desplegar a AWS Amplify"
    echo ""
    echo "Próximos pasos:"
    echo "1. Configurar variables de entorno en AWS Amplify Console"
    echo "2. git add . && git commit -m 'feat: AWS Lambda integration'"
    echo "3. git push origin main"
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  VERIFICACIÓN COMPLETADA CON ADVERTENCIAS${NC}"
    echo "Advertencias: $warnings"
    echo "Puedes continuar, pero revisa las advertencias arriba"
else
    echo -e "${RED}❌ VERIFICACIÓN FALLIDA${NC}"
    echo "Errores: $errors"
    echo "Advertencias: $warnings"
    echo ""
    echo "Por favor corrige los errores antes de desplegar"
    exit 1
fi
echo "═══════════════════════════════════════════════════════"
