# 🚀 Guía de Despliegue en AWS Amplify

Esta guía detalla el proceso de migración y despliegue del sitio web de Grupo Musical La Célula desde Cloudflare Pages hacia AWS Amplify.

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de AWS Amplify](#configuración-de-aws-amplify)
3. [Migración de Secretos](#migración-de-secretos)
4. [Variables de Entorno](#variables-de-entorno)
5. [Proceso de Despliegue](#proceso-de-despliegue)
6. [Validación y Testing](#validación-y-testing)
7. [Troubleshooting](#troubleshooting)

## 🔧 Requisitos Previos

### Software Requerido
- Node.js 18+
- npm 8+
- AWS CLI (opcional)
- Git

### Archivos de Configuración
- `amplify.yml` - Configuración de build
- `buildspec.yml` - Especificaciones de build alternativas
- `package.json` - Scripts npm actualizados

## ⚙️ Configuración de AWS Amplify

### 1. Crear Nueva Aplicación

1. **Acceder a AWS Amplify Console**
   - Ir a: https://console.aws.amazon.com/amplify/
   - Crear nueva aplicación

2. **Conectar Repositorio**
   - Seleccionar proveedor de código (GitHub, GitLab, etc.)
   - Autorizar acceso a AWS Amplify
   - Seleccionar repositorio: `tu-usuario/celula-site`
   - Rama: `main` (o la rama principal)

3. **Configuración de Build**
   - AWS Amplify detectará automáticamente `amplify.yml`
   - Verificar que la configuración sea correcta
   - Node.js versión: 18

### 2. Configuración de Build Settings

```yaml
# amplify.yml ya configurado en el proyecto
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
            - npm run validate:html || echo "HTML validation skipped"
            - npm run lint || echo "Linting skipped"
        build:
          commands:
            - mkdir -p dist
            - cp -r assets css js post functions widgets *.html *.json *.xml *.txt _headers dist/
        postBuild:
          commands:
            - echo "Deployment ready"
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
```

## 🔐 Migración de Secretos

### Secretos Actuales (Cloudflare)
- `RESEND_API_KEY` - Para envío de emails (API de Resend)
- `GEMINI_API_KEY` - Para funcionalidad de chatbot (Google Gemini AI)

### ⚠️ IMPORTANTE: Configuración de Secretos en AWS Amplify

**Las variables de entorno DEBEN configurarse en AWS Amplify Console para que las funciones serverless funcionen correctamente.**

#### Método 1: AWS Amplify Console (Recomendado)

1. **Acceder a Environment Variables**
   - Ir a AWS Amplify Console: https://console.aws.amazon.com/amplify/
   - Seleccionar tu aplicación
   - En el menú lateral: **App settings > Environment variables**

2. **Agregar Variables de Entorno**
   
   Hacer clic en "Add environment variable" y agregar:
   
   | Variable | Valor | Tipo |
   |----------|-------|------|
   | `RESEND_API_KEY` | `re_xxxxxxxxxxxxx` | Secret |
   | `GEMINI_API_KEY` | `AIzaSyxxxxxxxxxx` | Secret |
   | `CONTACT_EMAIL` | `tu-email@ejemplo.com` | Plain text |

3. **Marcar como Secretas**
   - ✅ Activar opción **"Secret"** para `RESEND_API_KEY` y `GEMINI_API_KEY`
   - Esto las encriptará automáticamente
   - Las variables secretas no serán visibles en logs ni en la consola

4. **Aplicar Cambios**
   - Hacer clic en **"Save"**
   - Las variables estarán disponibles en el siguiente build
   - **Importante**: Hacer un nuevo deploy para que las funciones accedan a las variables

5. **Verificar Configuración**
   - En el build log, deberías ver:
     ```
     RESEND_API_KEY is set: YES
     GEMINI_API_KEY is set: YES
     ```
   - Si ves "NO", las variables no están configuradas correctamente

#### Cómo Obtener las API Keys

**RESEND_API_KEY:**
1. Ir a https://resend.com/
2. Crear cuenta o iniciar sesión
3. Ir a "API Keys" en el dashboard
4. Crear nueva API key
5. Copiar la key (empieza con `re_`)

**GEMINI_API_KEY:**
1. Ir a https://makersuite.google.com/app/apikey
2. Iniciar sesión con cuenta de Google
3. Crear nueva API key
4. Copiar la key (empieza con `AIzaSy`)

#### Acceso desde Funciones Serverless

Las funciones en `/functions/api/` acceden a las variables así:

```javascript
// En functions/api/send-email.js y functions/api/chatbot.js
export async function onRequest(context) {
  // Las variables están disponibles en context.env
  const resendApiKey = context.env.RESEND_API_KEY;
  const geminiApiKey = context.env.GEMINI_API_KEY;
  
  if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY no configurada');
    // Retornar error
  }
  
  // Usar las keys...
}
```

**Nota:** Las variables de entorno configuradas en Amplify Console están automáticamente disponibles en `context.env` para las funciones serverless.

#### Método 2: AWS Secrets Manager (Recomendado para producción)
1. **Crear Secretos en AWS Secrets Manager**
   ```bash
   aws secretsmanager create-secret \
     --name "celula-site/resend-api-key" \
     --description "Resend API Key for email functionality" \
     --secret-string "tu-clave-resend"

   aws secretsmanager create-secret \
     --name "celula-site/gemini-api-key" \
     --description "Gemini API Key for chatbot functionality" \
     --secret-string "tu-clave-gemini"
   ```

2. **Configurar IAM Permissions**
   - Amplify necesita permisos para leer secretos
   - Crear policy con acceso a los secretos específicos

3. **Actualizar Functions**
   ```javascript
   // En functions/send-email/index.js y functions/chat/index.js
   import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

   const client = new SecretsManagerClient({ region: "us-east-1" });

   async function getSecret(secretName) {
     try {
       const response = await client.send(
         new GetSecretValueCommand({ SecretId: secretName })
       );
       return response.SecretString;
     } catch (error) {
       console.error("Error retrieving secret:", error);
       throw error;
     }
   }

   // Uso
   const resendApiKey = await getSecret("celula-site/resend-api-key");
   ```

## 🌐 Variables de Entorno

### Variables Requeridas
```env
# APIs
RESEND_API_KEY=tu_clave_resend
GEMINI_API_KEY=tu_clave_gemini

# Configuración del sitio
NODE_ENV=production
SITE_URL=https://tu-dominio.amplifyapp.com

# Opcional: Para debugging
DEBUG=false
```

### Variables Automáticas de Amplify
Amplify proporciona automáticamente:
- `AWS_REGION`
- `AWS_BRANCH`
- `AWS_APP_ID`
- `AWS_COMMIT_ID`

## 🚀 Proceso de Despliegue

### 1. Preparación Local

```bash
# Instalar dependencias
npm install

# Ejecutar validaciones
npm run lint:js
npm run validate:html
npm run test:video-paths

# Build de prueba
npm run build:amplify
```

### 2. Push a Repositorio

```bash
git add .
git commit -m "feat: configuración para AWS Amplify"
git push origin main
```

### 3. Despliegue Automático

- Amplify detectará el push automáticamente
- Iniciará el proceso de build según `amplify.yml`
- Progreso visible en Amplify Console

### 4. Fases del Build

1. **Pre-build**: Instalación de dependencias y validaciones
2. **Build**: Copia de archivos y assets
3. **Post-build**: Validaciones finales
4. **Deploy**: Publicación del sitio

## ✅ Validación y Testing

### Scripts de Validación Disponibles

```bash
# Validar estructura HTML
npm run validate:html

# Linting JavaScript
npm run lint:js

# Probar rutas de video background
npm run test:video-paths

# Build completo con validaciones
npm run build:amplify

# Preparar para despliegue
npm run deploy:amplify
```

### Checklist Post-Despliegue

- [ ] Sitio accesible en URL de Amplify
- [ ] Video background funciona en posts
- [ ] Formulario de contacto envía emails
- [ ] Chatbot responde correctamente
- [ ] Imágenes y videos cargan correctamente
- [ ] Navegación funciona en todas las páginas
- [ ] Sitio es responsive en móvil y desktop

### Verificación de Video Background

1. **Abrir varios posts del blog**
2. **Verificar que se reproduce el video**
3. **Comprobar fallback en dispositivos móviles**
4. **Validar responsive design**

## 🔧 Troubleshooting

### Problema: Build Falla

**Síntomas:**
- Build se detiene en fase preBuild o build
- Errores de dependencias

**Solución:**
```bash
# Verificar logs en Amplify Console
# Revisar que todas las dependencias estén en package.json
# Verificar que los paths en amplify.yml sean correctos

# Probar build localmente
npm run build:amplify
```

### Problema: Video Background No Se Ve en Posts

**Síntomas:**
- Video background funciona en index.html pero no en posts
- Solo se ve imagen de fallback
- Console muestra errores 404 para archivos de video

**Solución:**
1. **Verificar que los archivos de video estén en el build:**
   ```bash
   # Después del build, verificar:
   ls -la dist/assets/video/
   # Debe mostrar: background-1080p.webm, mobile-background.webm
   ```

2. **Verificar rutas relativas en posts:**
   - Los posts están en `/post/` subdirectorio
   - Las rutas deben usar `../` para subir un nivel
   - El script `video-background.js` tiene función `normalizePath()` que maneja esto

3. **Verificar en browser console:**
   - Abrir DevTools (F12)
   - Ir a Console
   - Buscar mensajes: "🎬 Inicializando video background..."
   - Verificar que no haya errores 404

4. **Probar rutas de video:**
   ```bash
   npm run test:video-paths
   ```

### Problema: Chatbot No Responde

**Síntomas:**
- Chatbot se abre pero no responde a mensajes
- Error: "API Key no configurada"
- Console muestra: "GEMINI_API_KEY no configurada"

**Solución:**
1. **Verificar variable de entorno en Amplify:**
   - Ir a: App settings > Environment variables
   - Verificar que `GEMINI_API_KEY` esté configurada
   - Debe estar marcada como "Secret"

2. **Verificar en build logs:**
   ```
   GEMINI_API_KEY is set: YES
   ```
   Si dice "NO", la variable no está configurada

3. **Hacer nuevo deploy:**
   - Después de agregar variables, hacer nuevo deploy
   - Las funciones necesitan reiniciarse para acceder a las nuevas variables

4. **Verificar en browser console:**
   - Abrir DevTools > Console
   - Buscar: "🤖 Chatbot API called"
   - Verificar: "🔑 GEMINI_API_KEY available: true"

### Problema: Emails No Se Envían

**Síntomas:**
- Formulario de contacto no envía emails
- Chatbot no envía resúmenes de conversación
- Error: "Configuración de email no disponible"
- Console muestra: "RESEND_API_KEY no configurada"

**Solución:**
1. **Verificar variable de entorno en Amplify:**
   - Ir a: App settings > Environment variables
   - Verificar que `RESEND_API_KEY` esté configurada
   - Debe estar marcada como "Secret"
   - Formato correcto: `re_xxxxxxxxxxxxx`

2. **Verificar en build logs:**
   ```
   RESEND_API_KEY is set: YES
   ```

3. **Verificar API key en Resend:**
   - Ir a https://resend.com/api-keys
   - Verificar que la key esté activa
   - Verificar límites de envío

4. **Verificar en browser console:**
   - Abrir DevTools > Console
   - Buscar: "📧 Send-email API called"
   - Verificar: "🔑 RESEND_API_KEY available: true"

5. **Probar endpoint directamente:**
   ```bash
   curl -X POST https://tu-app.amplifyapp.com/api/send-email \
     -H "Content-Type: application/json" \
     -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"1234567890"}}'
   ```

### Problema: Functions No Funcionan

**Síntomas:**
- Endpoints /api/* retornan 404 o 500
- Funciones no se ejecutan

**Solución:**
1. **Verificar que las funciones estén en el build:**
   ```bash
   ls -la dist/functions/api/
   # Debe mostrar: send-email.js, chatbot.js
   ```

2. **Verificar redirects en amplify.yml:**
   - Deben estar configurados los redirects para /api/*

3. **Revisar logs de funciones:**
   - En Amplify Console > Monitoring
   - Ver logs de CloudWatch

### Problema: Secretos No Accesibles

**Síntomas:**
- Variables de entorno retornan undefined
- context.env no contiene las variables

**Solución:**
1. **Verificar que las variables estén configuradas:**
   - AWS Amplify Console > Environment variables
   - Deben estar en la rama correcta (main, develop, etc.)

2. **Hacer redeploy:**
   - Las variables solo están disponibles después de un nuevo deploy
   - Ir a: Amplify Console > Redeploy this version

3. **Verificar nombres exactos:**
   - Los nombres deben coincidir exactamente
   - `RESEND_API_KEY` (no `RESEND_KEY` ni `RESEND_API`)
   - `GEMINI_API_KEY` (no `GEMINI_KEY` ni `GOOGLE_API_KEY`)

4. **Verificar en código:**
   ```javascript
   console.log('Available env keys:', Object.keys(context.env || {}));
   ```

## 📊 Monitoreo y Métricas

### Métricas Importantes
- Tiempo de build
- Tamaño de la aplicación
- Performance (Core Web Vitals)
- Uptime

### Herramientas de Monitoreo
- AWS CloudWatch (métricas de Amplify)
- Google PageSpeed Insights
- Lighthouse audits

## 🔄 Actualizaciones Futuras

### Workflow de Desarrollo
1. Desarrollar en rama `develop`
2. Hacer PR a `main`
3. Review y merge
4. Despliegue automático en Amplify

### Rollback
- En caso de problemas, usar feature de rollback en Amplify Console
- Mantener versiones anteriores disponibles

## 📞 Contacto y Soporte

Para dudas sobre el despliegue:
- Documentación AWS Amplify: https://docs.amplify.aws/
- Issues del proyecto: GitHub Issues
- Logs: AWS Amplify Console > Build logs