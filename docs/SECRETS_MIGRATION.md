# 🔐 Guía de Migración de Secretos a AWS Amplify

Esta guía detalla el proceso de migración de secretos y variables de entorno desde Cloudflare Pages hacia AWS Amplify.

## 📋 Secretos Actuales

### Variables en Cloudflare Pages
```
RESEND_API_KEY - Clave API de Resend para envío de emails
GEMINI_API_KEY - Clave API de Google Gemini para chatbot
```

## 🎯 Opciones de Migración

### Opción 1: Environment Variables en Amplify (Recomendado para desarrollo)

#### Pasos:
1. **Acceder a AWS Amplify Console**
   - Ir a tu aplicación en Amplify
   - Navegar a: `App settings > Environment variables`

2. **Agregar Variables**
   ```
   Variable name: RESEND_API_KEY
   Value: [tu-clave-resend]
   ☑️ Secret (marcar como secreto)

   Variable name: GEMINI_API_KEY
   Value: [tu-clave-gemini]
   ☑️ Secret (marcar como secreto)
   ```

3. **Guardar y Redeploy**
   - Hacer click en "Save"
   - Redeploy la aplicación

#### ✅ Ventajas:
- Fácil configuración
- Integración automática con build process
- Encriptación automática cuando se marca como "Secret"

#### ⚠️ Desventajas:
- Menos control granular de permisos
- Visible en logs de build (si no se marca como secret)

### Opción 2: AWS Secrets Manager (Recomendado para producción)

#### Pasos:

1. **Instalar AWS SDK**
   ```bash
   npm install @aws-sdk/client-secrets-manager
   ```

2. **Crear Secretos en AWS Secrets Manager**

   **Via AWS CLI:**
   ```bash
   # Crear secreto para Resend API Key
   aws secretsmanager create-secret \
     --name "celula-site/resend-api-key" \
     --description "Resend API Key for email functionality" \
     --secret-string "tu-clave-resend-actual" \
     --region us-east-1

   # Crear secreto para Gemini API Key
   aws secretsmanager create-secret \
     --name "celula-site/gemini-api-key" \
     --description "Gemini API Key for chatbot functionality" \
     --secret-string "tu-clave-gemini-actual" \
     --region us-east-1
   ```

   **Via AWS Console:**
   - Ir a AWS Secrets Manager Console
   - Create Secret > Other type of secret
   - Plaintext: `tu-clave-api`
   - Secret name: `celula-site/resend-api-key`
   - Repetir para Gemini API Key

3. **Configurar Permisos IAM**

   **Crear Policy para Amplify:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "secretsmanager:GetSecretValue"
         ],
         "Resource": [
           "arn:aws:secretsmanager:us-east-1:TU-ACCOUNT-ID:secret:celula-site/resend-api-key*",
           "arn:aws:secretsmanager:us-east-1:TU-ACCOUNT-ID:secret:celula-site/gemini-api-key*"
         ]
       }
     ]
   }
   ```

4. **Actualizar Código de Functions**

   **functions/send-email/index.js:**
   ```javascript
   import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

   const secretsClient = new SecretsManagerClient({ region: "us-east-1" });

   async function getSecret(secretName) {
     try {
       const response = await secretsClient.send(
         new GetSecretValueCommand({
           SecretId: secretName
         })
       );
       return response.SecretString;
     } catch (error) {
       console.error(`Error retrieving secret ${secretName}:`, error);
       throw error;
     }
   }

   export async function handler(event, context) {
     try {
       // Obtener API key de forma segura
       const resendApiKey = await getSecret("celula-site/resend-api-key");

       // Tu código existente aquí...
       // Usar resendApiKey en lugar de process.env.RESEND_API_KEY

     } catch (error) {
       console.error('Error:', error);
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'Internal server error' })
       };
     }
   }
   ```

   **functions/chat/index.js:**
   ```javascript
   import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

   const secretsClient = new SecretsManagerClient({ region: "us-east-1" });

   async function getSecret(secretName) {
     try {
       const response = await secretsClient.send(
         new GetSecretValueCommand({
           SecretId: secretName
         })
       );
       return response.SecretString;
     } catch (error) {
       console.error(`Error retrieving secret ${secretName}:`, error);
       throw error;
     }
   }

   export async function handler(event, context) {
     try {
       // Obtener API key de forma segura
       const geminiApiKey = await getSecret("celula-site/gemini-api-key");

       // Tu código existente aquí...
       // Usar geminiApiKey en lugar de process.env.GEMINI_API_KEY

     } catch (error) {
       console.error('Error:', error);
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'Internal server error' })
       };
     }
   }
   ```

#### ✅ Ventajas:
- Máxima seguridad
- Control granular de permisos
- Rotación automática de claves
- Auditoría completa
- Separación de secretos por entorno

#### ⚠️ Desventajas:
- Configuración más compleja
- Latencia adicional en llamadas
- Costos adicionales de AWS Secrets Manager

## 🔄 Enfoque Híbrido (Recomendado)

### Para Desarrollo
- Usar Environment Variables en Amplify
- Marcadas como "Secret"
- Fácil desarrollo y debugging

### Para Producción
- Usar AWS Secrets Manager
- Máxima seguridad
- Rotación automática

## 📝 Implementación Paso a Paso

### Fase 1: Configuración Básica con Environment Variables

1. **En AWS Amplify Console:**
   ```
   RESEND_API_KEY = [valor-desde-cloudflare]
   GEMINI_API_KEY = [valor-desde-cloudflare]
   ```

2. **Verificar en Functions:**
   ```javascript
   // Ambas functions siguen funcionando con process.env
   const resendApiKey = process.env.RESEND_API_KEY;
   const geminiApiKey = process.env.GEMINI_API_KEY;
   ```

### Fase 2: Migración a Secrets Manager (Opcional)

1. **Crear script de migración:**
   ```javascript
   // scripts/migrate-secrets.js
   import { SecretsManagerClient, CreateSecretCommand } from "@aws-sdk/client-secrets-manager";

   const client = new SecretsManagerClient({ region: "us-east-1" });

   async function migrateSecrets() {
     const secrets = [
       {
         Name: "celula-site/resend-api-key",
         SecretString: process.env.RESEND_API_KEY,
         Description: "Resend API Key for email functionality"
       },
       {
         Name: "celula-site/gemini-api-key",
         SecretString: process.env.GEMINI_API_KEY,
         Description: "Gemini API Key for chatbot functionality"
       }
     ];

     for (const secret of secrets) {
       try {
         await client.send(new CreateSecretCommand(secret));
         console.log(`✅ Created secret: ${secret.Name}`);
       } catch (error) {
         console.error(`❌ Error creating secret ${secret.Name}:`, error);
       }
     }
   }

   migrateSecrets();
   ```

2. **Ejecutar migración:**
   ```bash
   node scripts/migrate-secrets.js
   ```

## 🧪 Testing y Validación

### Script de Validación
```javascript
// scripts/test-secrets.js
async function testSecrets() {
  console.log("🔍 Testing secrets access...");

  // Método 1: Environment Variables
  const resendFromEnv = process.env.RESEND_API_KEY;
  const geminiFromEnv = process.env.GEMINI_API_KEY;

  console.log(`RESEND_API_KEY: ${resendFromEnv ? '✅ Present' : '❌ Missing'}`);
  console.log(`GEMINI_API_KEY: ${geminiFromEnv ? '✅ Present' : '❌ Missing'}`);

  // Método 2: Secrets Manager (si implementado)
  if (process.env.USE_SECRETS_MANAGER === 'true') {
    try {
      const resendFromSM = await getSecret("celula-site/resend-api-key");
      const geminiFromSM = await getSecret("celula-site/gemini-api-key");

      console.log(`Secrets Manager - Resend: ${resendFromSM ? '✅ Present' : '❌ Missing'}`);
      console.log(`Secrets Manager - Gemini: ${geminiFromSM ? '✅ Present' : '❌ Missing'}`);
    } catch (error) {
      console.error('❌ Secrets Manager error:', error);
    }
  }
}

testSecrets();
```

## 🛡️ Mejores Prácticas de Seguridad

### 1. Principio de Menor Privilegio
- Solo dar permisos necesarios a cada function
- Usar policies específicas por recurso

### 2. Rotación de Claves
```javascript
// Implementar rotación automática
const rotationConfig = {
  automaticRotation: true,
  rotationInterval: 90, // días
  rotationLambda: 'rotation-function-arn'
};
```

### 3. Monitoreo y Auditoría
```javascript
// CloudWatch logs para acceso a secretos
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

function auditSecretAccess(secretName, action) {
  console.log(`🔍 SECRET_ACCESS: ${secretName} - ${action} - ${new Date().toISOString()}`);
}
```

### 4. Fallback Strategies
```javascript
// Implementar fallback para alta disponibilidad
async function getSecretWithFallback(secretName, envVarName) {
  try {
    // Intentar Secrets Manager primero
    return await getSecret(secretName);
  } catch (error) {
    console.warn(`Fallback to environment variable for ${secretName}`);
    return process.env[envVarName];
  }
}
```

## 📊 Comparación de Costos

### Environment Variables
- **Costo:** Incluido en Amplify
- **Uso:** Ilimitado

### AWS Secrets Manager
- **Costo por secreto:** $0.40/mes
- **Costo por 10,000 API calls:** $0.05
- **Total estimado:** ~$1/mes para 2 secretos

## 🔧 Troubleshooting

### Error: Secrets Manager Access Denied
**Solución:**
1. Verificar IAM permissions
2. Comprobar región del secreto
3. Validar ARN del secreto

### Error: Environment Variables No Disponibles
**Solución:**
1. Verificar que estén configuradas en Amplify Console
2. Redeploy la aplicación
3. Revisar logs de build

### Error: Function Timeout
**Solución:**
1. Incrementar timeout de Lambda function
2. Optimizar llamadas a Secrets Manager
3. Implementar caching de secretos

## ✅ Checklist de Migración

- [ ] Identificar secretos actuales en Cloudflare
- [ ] Decidir método de migración (Env Vars vs Secrets Manager)
- [ ] Configurar secretos en AWS Amplify
- [ ] Actualizar código de functions (si es necesario)
- [ ] Configurar permisos IAM (si usa Secrets Manager)
- [ ] Hacer deploy y testing
- [ ] Validar funcionamiento de email y chatbot
- [ ] Documentar proceso y credenciales
- [ ] Desactivar secretos en Cloudflare (después de validación)