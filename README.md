# Grupo Musical Versátil La Célula - Sitio Web

Sitio web oficial del Grupo Musical Versátil La Célula, una banda versátil profesional en México.

## 🎵 Características

- **Sitio estático optimizado** con HTML, CSS y JavaScript
- **Blog** con sistema de paginación
- **AI Chatbot** con Google Gemini
- **Sistema de cotizaciones** integrado
- **Galería multimedia** con fotos y videos
- **Formularios de contacto** con Resend API
- **PWA** (Progressive Web App)
- **Optimizado para rendimiento** (Core Web Vitals)

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+
- npm o yarn
- Cuenta en AWS Amplify (o Cloudflare Pages)
- API Keys: Resend (email), Gemini (chatbot)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/celula-site.git
cd celula-site

# Instalar dependencias
npm install

# Instalar dependencias de Functions
cd functions && npm install && cd ..
```

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# El sitio estará disponible en http://localhost:8788
```

### Build y Minificación

```bash
# Minificar todos los archivos JS y CSS
npm run minify

# Optimizar imágenes a WebP
npm run optimize:images

# Optimizar videos
npm run optimize:video
```

### Deploy

```bash
# Deploy a AWS Amplify (recomendado)
npm run deploy:amplify

# Deploy a Cloudflare Pages (legacy)
npm run deploy
```

## 📁 Estructura del Proyecto

```
celula-site/
├── index.html              # Página principal
├── blog.html               # Blog
├── cotizador.html          # Cotizador
├── assets/                 # Imágenes, videos, fuentes, etc.
├── js/                     # JavaScript (source + minified)
├── css/                    # Estilos (source + minified)
├── functions/              # Serverless Functions (API endpoints)
│   └── api/                # API routes
├── post/                   # Artículos del blog
├── docs/                   # Documentación
├── scripts/                # Scripts de utilidad
└── archived/               # Archivos archivados
```

Ver [`docs/ESTRUCTURA-DIRECTORIOS.md`](docs/ESTRUCTURA-DIRECTORIOS.md) para más detalles.

## 📚 Documentación

- [**AGENTS.md**](docs/AGENTS.md) - Guía para AI assistants
- [**AMPLIFY_DEPLOYMENT.md**](docs/AMPLIFY_DEPLOYMENT.md) - Guía de AWS Amplify (Nueva)
- [**SECRETS_MIGRATION.md**](docs/SECRETS_MIGRATION.md) - Migración de secretos
- [**DEPLOY.md**](docs/DEPLOY.md) - Guía de deployment (Legacy)
- [**ESTRUCTURA-DIRECTORIOS.md**](docs/ESTRUCTURA-DIRECTORIOS.md) - Estructura del proyecto
- [**ESTRUCTURA-PROYECTO.md**](docs/ESTRUCTURA-PROYECTO.md) - Documentación técnica
- [**API-EMAIL-DOCUMENTATION.md**](docs/API-EMAIL-DOCUMENTATION.md) - API de email
- [**CLOUDFLARE_PAGES_SETUP.md**](docs/CLOUDFLARE_PAGES_SETUP.md) - Setup de Cloudflare
- [**REPORTE-FINAL-OPTIMIZACIONES.md**](docs/REPORTE-FINAL-OPTIMIZACIONES.md) - Optimizaciones

## 🛠️ Scripts Disponibles

### npm scripts

```bash
npm run dev                 # Servidor de desarrollo
npm run build               # Build para producción (legacy)
npm run build:amplify       # Build optimizado para AWS Amplify
npm run deploy:amplify      # Deploy a AWS Amplify
npm run deploy              # Deploy a Cloudflare Pages (legacy)
npm run minify              # Minificar JS y CSS
npm run lint:js             # Linting JavaScript con ESLint
npm run validate:html       # Validar estructura HTML
npm run test:video-paths    # Probar rutas de video background
npm run optimize:images     # Optimizar imágenes
npm run optimize:video      # Optimizar videos
```

### Bash scripts (en `/scripts/`)

```bash
# Nuevos scripts para AWS Amplify
bash scripts/deploy-amplify.sh          # Despliegue completo a Amplify
bash scripts/build-amplify.sh           # Build optimizado para Amplify
bash scripts/validate-html.sh           # Validación HTML detallada
bash scripts/test-video-paths.sh        # Testing de video background

# Scripts legacy
bash scripts/minify-all.sh              # Minificar todo
bash scripts/convert-images-to-webp.sh  # Convertir imágenes
bash scripts/optimize-video.sh          # Optimizar video
bash scripts/generate-blog-images.sh    # Generar imágenes blog
bash scripts/cleanup.sh                 # Limpiar archivos temporales
bash scripts/cleanup.sh --deep          # Limpieza profunda
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz con:

```env
RESEND_API_KEY=tu_api_key_de_resend
CONTACT_EMAIL=email@ejemplo.com
GEMINI_API_KEY=tu_api_key_de_gemini
```

También configurar en:
- **AWS Amplify**: App settings > Environment variables
- **Cloudflare Pages**: Dashboard > Settings > Environment Variables

### AWS Amplify (Recomendado)

- **Build command**: Automático con `amplify.yml`
- **Build output directory**: `dist`
- **Node version**: 18+
- **Configuration file**: `amplify.yml`

### Cloudflare Pages (Legacy)

- **Build command**: `npm run build`
- **Build output directory**: `.`
- **Node version**: 18+

## 🎨 Personalización

### Agregar un Artículo al Blog

1. Crear archivo en `/post/post-XX.html`
2. Agregar entrada en `assets/data/blog-posts.json`
3. Generar imágenes con `bash scripts/generate-blog-images.sh`

### Modificar Estilos

1. Editar `css/styles.css`
2. Minificar con `npm run minify`
3. Probar con `npm run dev`

### Modificar JavaScript

1. Editar archivos en `/js/` (ej: `chatbot.js`)
2. Minificar con `npm run minify`
3. Probar con `npm run dev`

## 🚦 Testing

```bash
# Testing local con Wrangler
npm run dev

# Testing de API endpoint
curl -X POST http://localhost:8788/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

## 📊 Optimización

El sitio está optimizado para Core Web Vitals:

- ✅ WebP images
- ✅ Responsive images
- ✅ Lazy loading
- ✅ Minified CSS/JS
- ✅ Self-hosted fonts
- ✅ Critical CSS inlining
- ✅ Deferred JS loading

Ver [`docs/REPORTE-FINAL-OPTIMIZACIONES.md`](docs/REPORTE-FINAL-OPTIMIZACIONES.md) para detalles.

## 🔒 Seguridad

- HTTPS-only
- Content Security Policy
- Input sanitization
- Rate limiting en APIs
- Environment variables para secrets
- No credentials en código

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Agregar mejora'`)
4. Push al branch (`git push origin feature/mejora`)
5. Abrir Pull Request

## 📄 Licencia

© 2024 Grupo Musical Versátil La Célula. Todos los derechos reservados.

## 📞 Contacto

- **Web**: https://grupomusicalcelula.pages.dev
- **Email**: contacto@grupomusicalcelula.com
- **WhatsApp**: [Contactar](https://wa.me/...)

---

**Hecho con ❤️ por el equipo de La Célula**
