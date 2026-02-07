# 🎯 QWEN.md - celula-chatbot-ia

## 📋 Información General

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | celula-chatbot-ia |
| **Versión** | 3.0.0 |
| **Estado** | ✅ PRODUCCIÓN |
| **Tipo** | Sitio Web Estático + Serverless |
| **Categoría** | Sitio Web Profesional - Banda Musical |
| **Fecha de Análisis** | 2026-01-09 |

---

## 🎯 Propósito del Proyecto

Sitio web profesional para grupo musical "Célula" con blog, galería multimedia, sistema de cotizaciones y chatbot con inteligencia artificial. Diseñado para promocionar la banda, gestionar eventos y facilitar contrataciones.

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- HTML5/CSS3/JavaScript (Vanilla)
- Responsive Design
- PWA (Progressive Web App)
- Optimización SEO

**Backend:**
- Vercel Serverless Functions
- Node.js runtime
- API REST

**APIs Integradas:**
- Google Gemini AI (Chatbot)
- Resend API (Email/Formularios)
- YouTube API (Videos)
- Instagram API (Feed social)

**Deployment:**
- AWS Amplify (recomendado)
- Cloudflare Pages (legacy)
- Vercel (serverless functions)

---

## ✨ Características Principales

### 1. Sitio Estático Optimizado
- Carga ultra-rápida (<1s)
- SEO optimizado
- Responsive design
- Lazy loading de imágenes

### 2. Blog con Paginación
- Sistema de posts
- Categorías y tags
- Búsqueda de contenido
- Paginación automática
- RSS feed

### 3. AI Chatbot (Google Gemini)
- Respuestas inteligentes
- Información sobre la banda
- Disponibilidad de fechas
- Preguntas frecuentes
- Contexto conversacional

### 4. Sistema de Cotizaciones
- Formulario inteligente
- Cálculo automático de precios
- Envío por email
- Seguimiento de solicitudes

### 5. Galería Multimedia
- Fotos profesionales
- Videos de YouTube
- Audio samples
- Lightbox integrado

### 6. Formularios con Resend API
- Contacto general
- Solicitud de cotización
- Newsletter
- Confirmaciones automáticas

### 7. PWA Features
- Instalable
- Offline básico
- Notificaciones (futuro)
- App-like experience

---

## 📂 Estructura del Proyecto

```
celula-chatbot-ia/
├── api/
│   ├── chatbot.js             # Endpoint chatbot Gemini
│   ├── chatbot-gemini-backup.js
│   ├── chatbot-multi-provider.js
│   └── send-email.js          # Endpoint email Resend
├── public/
│   ├── css/
│   │   ├── main.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── chatbot.js
│   │   └── gallery.js
│   ├── images/
│   ├── videos/
│   └── audio/
├── blog/
│   ├── posts/                 # Posts en Markdown
│   └── index.html
├── docs/
│   └── README.md
├── tests/
│   └── README.md
├── .vercel/                   # Configuración Vercel
├── vercel.json
└── package.json
```

---

## 🚀 Deployment

### Plataforma Recomendada: AWS Amplify
```bash
# Build settings
Build command: npm run build
Output directory: public
```

### Alternativa: Cloudflare Pages (Legacy)
```bash
# Build settings
Build command: npm run build
Output directory: public
```

### Serverless Functions: Vercel
```json
{
  "functions": {
    "api/chatbot.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

## 🔧 Configuración Requerida

### Variables de Entorno

```bash
# Google Gemini AI
GEMINI_API_KEY="tu_key_aqui"

# Resend API (Email)
RESEND_API_KEY="tu_key_aqui"
RESEND_FROM_EMAIL="banda@celula.com"

# YouTube API (Opcional)
YOUTUBE_API_KEY="tu_key_aqui"

# Instagram API (Opcional)
INSTAGRAM_ACCESS_TOKEN="tu_token_aqui"

# Site Configuration
SITE_URL="https://celula.com"
CONTACT_EMAIL="contacto@celula.com"
```

---

## 📊 Métricas del Proyecto

### Performance
- **Lighthouse Score:** 95+
- **First Load:** <1s
- **Time to Interactive:** <2s
- **Bundle Size:** <300KB

### SEO
- **SEO Score:** 100
- **Meta tags:** Completos
- **Structured data:** ✅
- **Sitemap:** ✅

### Engagement
- **Chatbot Interactions:** (tracking)
- **Cotizaciones:** (tracking)
- **Newsletter Signups:** (tracking)

---

## 🎮 Funcionalidades Principales

### Para Visitantes
1. **Explorar Banda**
   - Biografía
   - Integrantes
   - Repertorio
   - Videos y fotos

2. **Solicitar Cotización**
   - Formulario inteligente
   - Cálculo automático
   - Respuesta rápida

3. **Chatbot IA**
   - Preguntas sobre la banda
   - Disponibilidad
   - Precios
   - Información general

4. **Blog**
   - Noticias de la banda
   - Eventos pasados
   - Artículos musicales

### Para Administradores
- Gestión de contenido (CMS básico)
- Respuesta a cotizaciones
- Actualización de calendario
- Estadísticas de visitas

---

## 📚 Documentación Disponible

### Técnica
- [README.md](docs/README.md) - Documentación principal
- [Tests](tests/README.md) - Guía de testing
- API documentation (inline)

### Usuario
- Guía de uso del sitio
- FAQ
- Términos y condiciones

---

## 🔗 Enlaces y Recursos

- **Producción:** (URL del sitio)
- **AWS Amplify:** (Dashboard)
- **Vercel Functions:** (Dashboard)
- **Repositorio:** (Local)

---

## ⚠️ Notas Importantes

### Dependencias Críticas
- Gemini API key (chatbot)
- Resend API key (emails)
- Vercel account (serverless functions)
- AWS Amplify / Cloudflare Pages (hosting)

### Limitaciones
- Gemini API rate limits
- Resend email limits (plan gratuito)
- Vercel function timeout (10s)

### Mantenimiento
- Actualizar contenido del blog regularmente
- Revisar calendario de eventos
- Monitorear chatbot responses
- Backup de contenido

---

## 🎯 Estado del Proyecto

| Aspecto | Estado | Notas |
|---------|--------|-------|
| **Desarrollo** | ✅ Completo | v3.0.0 estable |
| **Testing** | ⚠️ Básico | Requiere más tests |
| **Documentación** | ✅ Completa | README detallado |
| **Producción** | ✅ Ready | Desplegado |
| **Mantenimiento** | 🟢 Activo | Cliente activo |

---

## 🔄 Relación con Otros Proyectos

**Proyectos Relacionados:** Ninguno (único en el portfolio)

**Tecnologías Compartidas:**
- Gemini AI (con Bet-Copilot, inversion)
- Serverless Functions (con CVChispart)
- Cloudflare Pages (con DefiendeteMX, DragNDrop)
- Resend API (único)

**Diferenciadores:**
- Único sitio web de banda musical
- Único con sistema de cotizaciones
- Único con blog integrado
- Único con galería multimedia completa

---

## 📈 Próximos Pasos / Roadmap

- [ ] CMS completo para administración
- [ ] Sistema de reservas online
- [ ] Integración con calendario Google
- [ ] Pagos online (Stripe/PayPal)
- [ ] Área de miembros
- [ ] Streaming de eventos en vivo
- [ ] Tienda de merchandise
- [ ] App móvil nativa
- [ ] Integración con Spotify/Apple Music
- [ ] Analytics avanzado

---

**Última Actualización:** 2026-01-09  
**Analizado por:** Blackbox AI  
**Versión QWEN:** 1.0
