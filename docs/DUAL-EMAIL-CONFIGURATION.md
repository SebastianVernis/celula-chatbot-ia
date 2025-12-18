# Configuración de Email Dual

## Descripción

El sistema de envío de emails ahora soporta **dos destinos simultáneos**, cada uno con su propia API Key de Resend y email de contacto.

## Variables de Entorno Requeridas

### Configuración 1 (Destino Principal)
- `RESEND_API_KEY_1`: API Key de Resend para el primer destino
- `CONTACT_EMAIL_1`: Email de destino para recibir los mensajes

### Configuración 2 (Destino Secundario)
- `RESEND_API_KEY_2`: API Key de Resend para el segundo destino  
- `CONTACT_EMAIL_2`: Email de destino para recibir los mensajes

### Nota Importante
- **Al menos una configuración completa** (API Key + Email) debe estar presente
- Si ambas configuraciones están completas, los emails se enviarán a **ambos destinos de forma paralela**
- Si solo una configuración está completa, se enviará únicamente a ese destino

## Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega las siguientes variables:

```
RESEND_API_KEY_1=re_xxxxx... (marcar como Secret)
CONTACT_EMAIL_1=contacto@lacelula.com

RESEND_API_KEY_2=re_yyyyy... (marcar como Secret)
CONTACT_EMAIL_2=otro@ejemplo.com
```

4. Guarda y redeploy

## Funcionamiento

Cuando se envía un email desde el chatbot o formulario:

1. El handler valida que al menos una configuración esté completa
2. Crea instancias de Resend para cada configuración válida
3. Envía el email en paralelo a todos los destinos configurados
4. Retorna un resumen del resultado:
   - `success`: `true` si al menos un envío fue exitoso
   - `allSuccess`: `true` solo si todos los envíos fueron exitosos
   - `results`: Array con el detalle de cada envío

## Respuesta de la API

### Éxito Total
```json
{
  "success": true,
  "allSuccess": true,
  "results": [
    { "success": true, "emailId": "abc123", "destination": 1 },
    { "success": true, "emailId": "def456", "destination": 2 }
  ]
}
```

### Éxito Parcial
```json
{
  "success": true,
  "allSuccess": false,
  "results": [
    { "success": true, "emailId": "abc123", "destination": 1 },
    { "success": false, "error": "Invalid API key", "destination": 2 }
  ]
}
```

### Error Total
```json
{
  "success": false,
  "allSuccess": false,
  "results": [
    { "success": false, "error": "Invalid API key", "destination": 1 },
    { "success": false, "error": "Invalid API key", "destination": 2 }
  ]
}
```

## Casos de Uso

### Caso 1: Enviar solo a un destino
Configura solo `RESEND_API_KEY_1` y `CONTACT_EMAIL_1`

### Caso 2: Enviar a dos destinos con diferentes cuentas de Resend
Configura ambas configuraciones con sus respectivas API Keys

### Caso 3: Enviar a dos destinos con la misma cuenta de Resend
Puedes usar la misma API Key en ambas configuraciones, pero diferentes emails de destino

## Migración desde Variables Antiguas

Si estabas usando las variables antiguas:
- `RESEND_API_KEY` → `RESEND_API_KEY_1`
- `CONTACT_EMAIL` → `CONTACT_EMAIL_1`

Simplemente renombra las variables en tu configuración de Vercel.

## Testing Local

Crea un archivo `.env` con tus configuraciones:

```bash
# .env
RESEND_API_KEY_1=re_tu_key_real_1
CONTACT_EMAIL_1=test1@ejemplo.com

RESEND_API_KEY_2=re_tu_key_real_2
CONTACT_EMAIL_2=test2@ejemplo.com

GEMINI_API_KEY=tu_gemini_key
```

Y ejecuta:
```bash
npm run dev
```

## Troubleshooting

### Error: "Configuration error"
- Verifica que al menos una configuración completa esté presente
- Asegúrate que las variables estén marcadas como Secret en Vercel

### Solo un email se envía exitosamente
- Revisa los logs de la respuesta para ver qué destino falló
- Verifica que ambas API Keys sean válidas
- Confirma que ambos emails de destino existan

### Emails se envían duplicados
- Esto es el comportamiento esperado si ambas configuraciones están completas
- Si solo quieres un destino, deja la segunda configuración vacía
