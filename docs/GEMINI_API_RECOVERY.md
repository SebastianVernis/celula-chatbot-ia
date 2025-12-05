# 🚨 RECUPERACIÓN API GEMINI - ACCIÓN INMEDIATA

## Problema Detectado
**API Key comprometida**: La API key de Gemini fue reportada como filtrada y está bloqueada.

```
Error 403: "Your API key was reported as leaked. Please use another API key."
```

## Pasos de Recuperación Inmediata

### 1. Crear Nueva API Key
1. Ve a https://makersuite.google.com/app/apikey
2. Revoca la API key actual
3. Crea una nueva API key
4. Copia la nueva key

### 2. Actualizar Variables de Entorno

**En Vercel (si es donde está desplegado):**
```bash
vercel env add GEMINI_API_KEY
# Pegar la nueva API key cuando se solicite
```

**En AWS Amplify:**
1. Ve a la consola de AWS Amplify
2. Selecciona tu aplicación
3. Ve a "Environment variables"
4. Actualiza `GEMINI_API_KEY` con el nuevo valor

**En desarrollo local:**
```bash
# Actualizar .env o .env.local
GEMINI_API_KEY=tu_nueva_api_key_aqui
```

### 3. Verificar Funcionamiento
```bash
# Ejecutar test de verificación
node test-gemini-api.js
```

### 4. Redeploy
```bash
# Si estás en Vercel
vercel --prod

# Si estás en otro servicio, hacer push al main branch
git add .
git commit -m "fix: update API key after security incident"
git push origin main
```

## Medidas de Seguridad

### Prevenir Futuras Filtraciones
1. **Nunca** commitear API keys en el código
2. Usar siempre variables de entorno
3. Agregar `.env*` al `.gitignore`
4. Rotar API keys regularmente

### Monitoreo
- Configurar alertas de uso excesivo
- Revisar logs de acceso regularmente
- Implementar rate limiting en la aplicación

## Estado del Chatbot
⚠️ **INACTIVO** hasta que se actualice la API key

## Modelos Disponibles (Confirmados)
- ✅ gemini-2.0-flash-lite
- ✅ gemini-2.0-flash  
- ✅ gemini-2.5-flash
- ✅ gemini-2.5-pro

## Próximos Pasos
1. [ ] Generar nueva API key
2. [ ] Actualizar variables de entorno
3. [ ] Redeplegar aplicación
4. [ ] Verificar funcionamiento del chatbot
5. [ ] Implementar medidas de seguridad adicionales