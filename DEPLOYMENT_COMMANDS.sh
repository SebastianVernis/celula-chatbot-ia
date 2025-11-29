#!/bin/bash
#
# AWS Lambda Integration - Deployment Commands
# Este script contiene todos los comandos necesarios para el deployment
#

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║            AWS LAMBDA DEPLOYMENT - COMANDOS EXACTOS                  ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 1: Verificar Integración${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Ejecutar script de verificación:"
echo -e "${YELLOW}$ ./verify-lambda-integration.sh${NC}"
echo ""
echo "Resultado esperado: ✅ VERIFICACIÓN EXITOSA"
echo ""
read -p "Presiona ENTER cuando hayas verificado..."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 2: Configurar Variables de Entorno en AWS Amplify${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. Ir a: https://console.aws.amazon.com/amplify/"
echo "2. Seleccionar tu aplicación"
echo "3. Navegar a: App Settings > Environment variables"
echo "4. Click en: Manage variables"
echo "5. Agregar las siguientes variables:"
echo ""
echo -e "   ${YELLOW}GEMINI_API_KEY${NC} = tu_api_key_aqui"
echo "   Obtener en: https://makersuite.google.com/app/apikey"
echo ""
echo -e "   ${YELLOW}RESEND_API_KEY${NC} = re_xxxxxxxxxx"
echo "   Obtener en: https://resend.com/api-keys"
echo ""
echo -e "   ${YELLOW}CONTACT_EMAIL${NC} = contacto@grupomusicalcelula.com"
echo ""
echo "6. Guardar cambios"
echo ""
read -p "Presiona ENTER cuando hayas configurado las variables..."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 3: Commit y Push a Repositorio${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Ejecutar los siguientes comandos:"
echo ""
echo -e "${YELLOW}# Ver cambios${NC}"
echo "$ git status"
echo ""
echo -e "${YELLOW}# Agregar todos los archivos${NC}"
echo "$ git add ."
echo ""
echo -e "${YELLOW}# Commit con mensaje descriptivo${NC}"
echo "$ git commit -m \"feat: Complete AWS Lambda integration for serverless functions\""
echo ""
echo -e "${YELLOW}# Push a repositorio (branch actual)${NC}"
echo "$ git push origin $(git branch --show-current)"
echo ""
read -p "¿Quieres ejecutar estos comandos ahora? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "Ejecutando comandos de Git..."
    echo ""
    
    echo "$ git status"
    git status
    echo ""
    
    echo "$ git add ."
    git add .
    echo ""
    
    echo "$ git status (después de add)"
    git status
    echo ""
    
    read -p "¿Continuar con commit? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo "$ git commit -m \"feat: Complete AWS Lambda integration for serverless functions\""
        git commit -m "feat: Complete AWS Lambda integration for serverless functions"
        echo ""
        
        BRANCH=$(git branch --show-current)
        echo "Branch actual: $BRANCH"
        
        read -p "¿Hacer push a origin/$BRANCH? (y/n): " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]
        then
            echo "$ git push origin $BRANCH"
            git push origin $BRANCH
            echo ""
            echo -e "${GREEN}✅ Push exitoso!${NC}"
        else
            echo -e "${YELLOW}⚠️  Push cancelado. Ejecuta manualmente:${NC}"
            echo "$ git push origin $BRANCH"
        fi
    else
        echo -e "${YELLOW}⚠️  Commit cancelado.${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Comandos no ejecutados. Ejecuta manualmente:${NC}"
    echo ""
    echo "$ git add ."
    echo "$ git commit -m \"feat: Complete AWS Lambda integration for serverless functions\""
    echo "$ git push origin $(git branch --show-current)"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 4: Monitorear Deployment en AWS Amplify${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. Ir a: https://console.aws.amazon.com/amplify/"
echo "2. Seleccionar tu aplicación"
echo "3. Ver el build en progreso"
echo ""
echo "Buscar en los logs:"
echo "  - '🔧 Building serverless functions...'"
echo "  - '✅ Functions built successfully'"
echo "  - 'GEMINI_API_KEY configured: YES'"
echo "  - 'RESEND_API_KEY configured: YES'"
echo ""
echo "Tiempo estimado: 5-8 minutos"
echo ""
read -p "Presiona ENTER para continuar..."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 5: Verificar Funciones Desplegadas${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. En AWS Amplify Console"
echo "2. Ir a: Hosting > Compute"
echo "3. Verificar que aparecen:"
echo "   - chatbot function"
echo "   - send-email function"
echo ""
read -p "Presiona ENTER para continuar..."

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 6: Testing en Producción${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Obtener tu URL de Amplify:"
echo "  https://[tu-app-id].amplifyapp.com"
echo ""
read -p "Ingresa tu URL de Amplify (sin https://): " AMPLIFY_URL

if [ ! -z "$AMPLIFY_URL" ]; then
    echo ""
    echo -e "${YELLOW}# Test Chatbot${NC}"
    echo "curl -X POST https://$AMPLIFY_URL/api/chatbot \"
    echo "  -H \"Content-Type: application/json\" \"
    echo "  -d '{\"history\":[{\"role\":\"user\",\"parts\":[{\"text\":\"Hola\"}]}]}'"
    echo ""
    
    read -p "¿Ejecutar test chatbot? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        curl -X POST "https://$AMPLIFY_URL/api/chatbot" \
          -H "Content-Type: application/json" \
          -d '{"history":[{"role":"user","parts":[{"text":"Hola"}]}]}'
        echo ""
    fi
    
    echo ""
    echo -e "${YELLOW}# Test Email${NC}"
    echo "curl -X POST https://$AMPLIFY_URL/api/send-email \"
    echo "  -H \"Content-Type: application/json\" \"
    echo "  -d '{\"type\":\"chatbot_lead\",\"leadData\":{\"name\":\"Test\",\"email\":\"test@test.com\",\"phone\":\"123\"}}'"
    echo ""
    
    read -p "¿Ejecutar test email? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        curl -X POST "https://$AMPLIFY_URL/api/send-email" \
          -H "Content-Type: application/json" \
          -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"123"}}'
        echo ""
    fi
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PASO 7: Verificar CloudWatch Logs${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Ver logs en AWS Console:"
echo "1. Ir a: https://console.aws.amazon.com/cloudwatch/"
echo "2. Click en: Logs > Log groups"
echo "3. Buscar:"
echo "   - /aws/lambda/chatbot"
echo "   - /aws/lambda/send-email"
echo ""
echo "O con AWS CLI:"
echo "$ aws logs tail /aws/lambda/chatbot --follow"
echo "$ aws logs tail /aws/lambda/send-email --follow"
echo ""

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║                     ✅ DEPLOYMENT COMPLETADO                         ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Próximos pasos:"
echo "  1. Monitorear logs las primeras 24 horas"
echo "  2. Probar el chatbot desde el sitio web"
echo "  3. Probar el formulario de contacto"
echo "  4. Configurar alertas en CloudWatch (opcional)"
echo ""
echo "Documentación completa:"
echo "  - AWS_LAMBDA_READY.md"
echo "  - docs/AWS_LAMBDA_INTEGRATION_COMPLETE.md"
echo "  - RESUMEN_INTEGRACION_AWS.md"
echo ""
echo -e "${GREEN}¡Deployment exitoso!${NC}"
echo ""
