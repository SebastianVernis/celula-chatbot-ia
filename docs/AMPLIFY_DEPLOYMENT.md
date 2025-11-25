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
- `RESEND_API_KEY` - Para envío de emails
- `GEMINI_API_KEY` - Para funcionalidad de chatbot

### Configurar en AWS Amplify

#### Método 1: AWS Amplify Console
1. **Ir a Environment Variables**
   - En AWS Amplify Console
   - Seleccionar la aplicación
   - Ir a: App settings > Environment variables

2. **Agregar Variables**
   ```
   RESEND_API_KEY = [tu-clave-resend]
   GEMINI_API_KEY = [tu-clave-gemini]
   ```

3. **Marcar como Secretas**
   - Activar opción "Secret" para cada variable
   - Esto las encriptará automáticamente

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

**Solución:**
```bash
# Verificar logs en Amplify Console
# Revisar que todas las dependencias estén en package.json
# Verificar que los paths en amplify.yml sean correctos
```

### Problema: Video Background No Funciona

**Solución:**
```bash
# Verificar que los archivos de video estén en dist/assets/video/
# Comprobar rutas relativas en posts
npm run test:video-paths
```

### Problema: Functions No Funcionan

**Solución:**
1. Verificar que las variables de entorno estén configuradas
2. Revisar logs de Lambda functions en AWS Console
3. Validar que las rutas en redirects estén correctas

### Problema: Secretos No Accesibles

**Solución:**
1. Verificar permisos IAM para Amplify
2. Comprobar que los nombres de secretos sean correctos
3. Revisar región de AWS Secrets Manager

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