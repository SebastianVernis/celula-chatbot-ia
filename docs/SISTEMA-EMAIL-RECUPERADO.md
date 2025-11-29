# 🔄 Sistema de Email Unificado - Recuperado

**Fecha de recuperación**: 18 de Noviembre de 2025  
**Estado**: ✅ Sistema completamente restaurado

---

## 📋 Resumen

Se ha recuperado e implementado el **Sistema Unificado de Envío de Emails** para el sitio de Grupo Musical La Célula. Este sistema maneja tanto las solicitudes del **chatbot** como del **cotizador** de forma segura y eficiente.

---

## 🎯 Archivos Recuperados/Creados

### 1. **`functions/api/send-email.js`** ✨ NUEVO
Cloudflare Worker que funciona como endpoint unificado para envío de emails.

**Características:**
- ✅ Validación server-side robusta
- ✅ Rate limiting (5 solicitudes/hora por IP)
- ✅ Sanitización contra XSS
- ✅ Soporte para chatbot y cotizador
- ✅ Plantillas HTML profesionales
- ✅ CORS configurado para:
  - `https://grupomusicalcelula.com`
  - `https://www.grupolacelula.com`  
  - `https://grupomusicalcelula.pages.dev`
  - `http://localhost:8788`

### 2. **`js/form-handler.js`** 🔄 ACTUALIZADO
Manejador del formulario de cotización con integración al nuevo endpoint.

**Mejoras:**
- ✅ Envío de email automático
- ✅ Validación en tiempo real
- ✅ Notificaciones visuales animadas
- ✅ Manejo robusto de errores
- ✅ Redirección a WhatsApp
- ✅ Prevención de envíos duplicados

### 3. **`docs/CONFIGURAR-EMAIL-SYSTEM.md`** ✅ EXISTENTE
Guía completa de configuración (ya existía, no requiere cambios).

---

## 🔧 Configuración Requerida

Para poner el sistema en funcionamiento:

### Paso 1: Variables de Entorno en Cloudflare

Ir a: **Cloudflare Dashboard** → **Workers & Pages** → Tu Proyecto → **Settings** → **Environment variables**

Configurar:

```bash
# Variable 1: API Key de Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx  # (Encrypted)

# Variable 2: Email destino
CONTACT_EMAIL=contacto@grupolacelula.com  # (Plain text)
```

### Paso 2: KV Namespace para Rate Limiting

1. Ir a: **Cloudflare Dashboard** → **Workers & Pages** → **KV**
2. **Create a namespace**: `EMAIL_RATE_LIMIT`
3. Ir a: Tu Proyecto → **Settings** → **Functions** → **KV Namespace Bindings**
4. **Add binding**:
   - Variable name: `EMAIL_RATE_LIMIT`
   - KV namespace: Seleccionar `EMAIL_RATE_LIMIT`

### Paso 3: Obtener API Key de Resend

1. Ir a: https://resend.com
2. Crear cuenta o iniciar sesión
3. **API Keys** → **Create API Key**
4. Nombre: `celula-site-production`
5. Copiar la key (solo se muestra una vez)

### Paso 4: Deploy

```bash
git add .
git commit -m "feat: restaurar sistema unificado de emails"
git push origin main
```

Cloudflare Pages desplegará automáticamente.

---

## 📊 Cómo Funciona

### Para el Cotizador:

```
Usuario llena formulario
    ↓
Validación cliente-side
    ↓
POST a /api/send-email
    ↓
Cloudflare Worker valida datos
    ↓
Check rate limiting (KV)
    ↓
Envía email vía Resend
    ↓
Redirige a WhatsApp
    ↓
Usuario recibe confirmación
```

### Para el Chatbot (cuando se implemente):

```
Usuario conversa en chatbot
    ↓
Recopila información
    ↓
POST a /api/send-email
    ↓
Worker procesa y envía resumen
    ↓
Email con conversación completa
```

---

## 🔒 Seguridad Implementada

| Característica | Estado | Descripción |
|---------------|--------|-------------|
| **API Keys protegidas** | ✅ | Nunca expuestas en cliente |
| **Validación server-side** | ✅ | Doble validación (cliente + servidor) |
| **Rate limiting** | ✅ | 5 req/hora por IP con KV |
| **Sanitización XSS** | ✅ | Todos los inputs sanitizados |
| **CORS restrictivo** | ✅ | Solo dominios autorizados |
| **Logging** | ✅ | Logs completos en Cloudflare |

---

## 📝 Schemas de Validación

### Cotizador:

```typescript
{
  type: "cotizador",
  name: string,           // 2-100 caracteres
  email: string,          // Email válido
  phone: string,          // 10 dígitos (requerido)
  eventType: string,      // Mínimo 2 caracteres
  eventDate: string,      // Fecha ISO futura
  guestCount: number,     // 1-1000
  location: string,       // Mínimo 3 caracteres
  additionalDetails?: string  // Opcional
}
```

### Chatbot (para cuando se implemente):

```typescript
{
  type: "chatbot",
  name: string,           // 2-100 caracteres
  email: string,          // Email válido
  phone?: string,         // 10 dígitos (opcional)
  message: string         // 10-1000 caracteres
}
```

---

## 🧪 Testing

### Test Local:

```bash
# Iniciar servidor local
wrangler pages dev .

# En el navegador:
http://localhost:8788/cotizador.html
```

### Test en Desarrollo (Cloudflare Pages):

```
https://grupomusicalcelula.pages.dev/cotizador.html
```

### Test en Producción:

```
https://grupomusicalcelula.com/cotizador.html
```

---

## ✅ Checklist de Verificación

Antes de considerar completo:

- [ ] Variables de entorno configuradas en Cloudflare
  - [ ] `RESEND_API_KEY`
  - [ ] `CONTACT_EMAIL`
- [ ] KV Namespace creado y vinculado
  - [ ] Namespace `EMAIL_RATE_LIMIT` creado
  - [ ] Binding configurado en el proyecto
- [ ] Código desplegado
  - [ ] `functions/api/send-email.js` desplegado
  - [ ] `js/form-handler.js` actualizado
- [ ] Testing realizado
  - [ ] Formulario envía correctamente
  - [ ] Email llega a destino
  - [ ] Rate limiting funciona
  - [ ] WhatsApp se abre correctamente
- [ ] Dominio verificado en Resend (recomendado)

---

## 📚 Documentación Adicional

- **`docs/CONFIGURAR-EMAIL-SYSTEM.md`** - Guía detallada de configuración
- **`docs/EMAIL-API.md`** - Documentación técnica de la API (por recrear si necesario)

---

## 🐛 Troubleshooting

### Error: "Configuración del servidor incompleta"

**Solución**: Verificar que `RESEND_API_KEY` y `CONTACT_EMAIL` estén configurados en Cloudflare Dashboard.

### Error: "KV namespace no configurado"

**Solución**: El sistema funcionará pero sin rate limiting. Crear y vincular el KV namespace.

### Emails no llegan

**Soluciones**:
1. Verificar carpeta de spam
2. Confirmar API key de Resend
3. Revisar logs en Cloudflare Dashboard
4. Verificar `CONTACT_EMAIL` es correcto

### CORS error

**Solución**: Verificar que el dominio desde donde se hace la solicitud esté en `ALLOWED_ORIGINS` en el worker.

---

## 🔄 Próximos Pasos

1. **Implementar chatbot** (si aún no existe)
   - Actualizar para usar `/api/send-email`
   - Configurar tipo: `chatbot`

2. **Verificar dominio en Resend**
   - Evita que emails caigan en spam
   - Mejora tasa de entrega

3. **Monitorear sistema**
   - Revisar logs regularmente
   - Verificar tasa de éxito de envíos

4. **Ajustar rate limiting** si necesario
   - Modificar `MAX_REQUESTS` en config
   - Ajustar `WINDOW_HOURS`

---

## 📞 Soporte

Si necesitas ayuda:

1. Revisar esta documentación
2. Consultar `docs/CONFIGURAR-EMAIL-SYSTEM.md`
3. Verificar logs en Cloudflare Dashboard
4. Revisar consola del navegador para errores

---

## 📈 Estado del Proyecto

**Versión**: 1.0.0 (Recuperado)  
**Última actualización**: 18 de Noviembre de 2025  
**Estado**: ✅ **LISTO PARA DEPLOY**

### Archivos Core:
- ✅ `functions/api/send-email.js` - Endpoint unificado
- ✅ `js/form-handler.js` - Handler del cotizador
- ⏳ `js/chatbot.js` - Por actualizar cuando esté disponible

### Configuración Pendiente:
- ⚠️ Variables de entorno en Cloudflare
- ⚠️ KV Namespace
- ⚠️ API Key de Resend

---

**¡Sistema restaurado y listo para configuración final!** 🚀
