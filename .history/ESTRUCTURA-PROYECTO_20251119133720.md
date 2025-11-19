# Estructura del Proyecto - Grupo Musical La Célula

## 📁 Organización Final del Proyecto

### Raíz del Proyecto (Archivos Esenciales)
```
celula-site/
├── index.html              # Página principal
├── blog.html              # Página del blog
├── cotizador.html         # Formulario de cotización
├── contacto.html          # Página de contacto
├── manifest.json          # PWA manifest
├── robots.txt             # SEO - robots
├── sitemap.xml            # SEO - sitemap
├── sw.js                  # Service Worker (PWA)
├── package.json           # Dependencias npm (incluye Resend)
├── .npmrc                 # Configuración npm para Cloudflare
├── wrangler.toml          # Configuración Cloudflare Workers/Pages
├── .gitignore             # Archivos a ignorar en git
├── README.md              # Documentación principal
├── DEPLOY.md              # Guía de despliegue
├── FUSION-SUMMARY.md      # Resumen de fusión del proyecto
└── ESTRUCTURA-PROYECTO.md # Este archivo
```

### 📂 Directorios Organizados

#### `/archived/` - Archivos Archivados
```
archived/
├── old-scripts/
│   └── generate_blog_images.sh  # Script obsoleto
└── old-html/
    └── cotizador-clean.html      # HTML obsoleto
```

#### `/assets/` - Recursos Estáticos
```
assets/
├── data/
│   ├── blog-posts.json
│   └── youtube-videos.json
├── equipo/              # Fotos del equipo
├── gallery/             # Galería de imágenes (banda-1.webp a banda-51.webp)
├── icons/               # Iconos sociales (whatsapp, facebook, youtube, twitter)
├── images/              # Imágenes generales
├── logo/                # Logos y variantes
├── video/               # Videos de fondo
└── Viejas-Fotos/        # Archivo de fotos antiguas
```

#### `/css/` - Estilos
```
css/
├── styles.css          # Estilos sin minificar
└── styles.min.css      # Estilos minificados (producción)
```

#### `/js/` - Scripts JavaScript
```
js/
├── chatbot.js              # Lógica del chatbot IA
├── chatbot.min.js          # Versión minificada
├── chatbot.css             # Estilos del chatbot
├── chatbot.min.css         # Estilos minificados
├── blog-pagination.js      # Sistema de paginación del blog
├── blog-pagination.min.js  # Versión minificada
├── form-handler.js         # Manejo de formularios
├── form-handler.min.js     # Versión minificada
├── gallery-dynamic.js      # Galería dinámica
├── gallery-dynamic.min.js  # Versión minificada
├── navigation.js           # Sistema de navegación
├── navigation.min.js       # Versión minificada
├── optimizations.js        # Optimizaciones de rendimiento
├── optimizations.min.js    # Versión minificada
├── site-functionality.js   # Funcionalidad general
├── site-functionality.min.js # Versión minificada
├── video-background.js     # Video de fondo persistente
├── video-background.min.js # Versión minificada
├── youtube-carousel.js     # Carrusel de videos
├── youtube-carousel.min.js # Versión minificada
└── assets/
    └── images/            # Imágenes para JS
```

#### `/public/forms/` - Scripts de Formularios
```
public/forms/
├── web3forms.js             # Integración Web3Forms general
├── web3forms-chatbot.js     # Web3Forms para chatbot
└── web3forms-cotizador.js   # Web3Forms para cotizador
```

#### `/functions/api/` - Cloudflare Functions
```
functions/api/
├── send-email.js    # API principal de envío de emails (usa Resend)
├── chatbot.js       # API del chatbot con IA (Gemini)
└── email.js         # API legacy (backup)
```

#### `/scripts/` - Scripts de Utilidades
```
scripts/
├── convert-images-to-webp.sh        # Conversión de imágenes
├── generate-responsive-videos.sh    # Generación de videos
├── minify-all.sh                    # Minificación completa
├── minify-css.sh                    # Minificación CSS
├── minify-js.sh                     # Minificación JS
├── optimize-video.sh                # Optimización de videos
├── update-blog-images.sh            # Actualización de imágenes del blog
├── update-image-references.sh       # Actualización de referencias
└── update-minified-references.sh    # Actualización de refs minificadas
```

#### `/docs/` - Documentación Técnica
```
docs/
├── CONFIGURAR-EMAIL-SYSTEM.md
├── EMAIL-API.md
├── SISTEMA-EMAIL-RECUPERADO.md
└── TODO-RESTAURACION-COMPLETA.md
```

#### `/post/` - Posts del Blog
```
post/
├── post-0.html a post-32.html    # 33 posts del blog
└── img/blog/                      # Imágenes de posts
```

## 🔧 Configuración de Dependencias

### package.json
```json
{
  "dependencies": {
    "resend": "^4.0.0"      // Para envío de emails
  },
  "devDependencies": {
    "wrangler": "^3.80.0"   // CLI de Cloudflare
  }
}
```

### Importación de Resend
La librería Resend se importa automáticamente en las Cloudflare Functions:

```javascript
// En functions/api/send-email.js
import { Resend } from 'resend';
```

Cloudflare Pages automáticamente:
1. Lee `package.json` durante el build
2. Ejecuta `npm install`
3. Instala `resend` y sus dependencias
4. Las hace disponibles para las Functions

## 📝 Archivos Clave Actualizados

### HTML Files (Referencias actualizadas)
- ✅ `index.html` - Scripts apuntan a `/js/` y `/public/forms/`
- ✅ `blog.html` - Scripts apuntan a `/js/` y `/public/forms/`
- ✅ `cotizador.html` - Scripts apuntan a `/js/` y `/public/forms/`

### Rutas de Scripts en HTML
```html
<!-- Antes -->
<script src="chatbot.js"></script>
<script src="web3forms-chatbot.js"></script>

<!-- Después -->
<script src="js/chatbot.js"></script>
<script src="public/forms/web3forms-chatbot.js"></script>
```

## 🚀 Scripts NPM Disponibles

```bash
npm run dev          # Servidor de desarrollo local
npm run deploy       # Despliegue a Cloudflare Pages
npm run build        # Ejecuta minificación
npm run minify       # Minifica todos los assets
npm run optimize:images   # Optimiza imágenes
npm run optimize:video    # Optimiza videos
```

## 🔐 Variables de Entorno Necesarias

Para Cloudflare Pages:
- `RESEND_API_KEY` - API key de Resend
- `CONTACT_EMAIL` - Email de contacto
- `GEMINI_API_KEY` - API key de Google Gemini
- `ENVIRONMENT` - "production"
- `EMAIL_RATE_LIMIT` - KV Namespace para rate limiting

## ✨ Características Implementadas

### ✅ Organización
- Raíz limpia con solo archivos esenciales
- Scripts organizados en `/js/`
- Formularios web en `/public/forms/`
- Archivos obsoletos en `/archived/`

### ✅ Dependencias
- `package.json` con Resend configurado
- `.npmrc` para compatibilidad con Cloudflare
- Import automático en Functions

### ✅ Documentación
- `DEPLOY.md` - Guía de despliegue
- `README.md` - Documentación general
- `ESTRUCTURA-PROYECTO.md` - Este archivo

### ✅ Configuración
- `.gitignore` actualizado
- Referencias de rutas corregidas
- Wrangler.toml configurado

## 🎯 Próximos Pasos

1. Hacer commit de los cambios
2. Push a GitHub
3. Configurar Cloudflare Pages
4. Agregar variables de entorno
5. Probar el despliegue

## 📊 Estadísticas del Proyecto

- **Archivos HTML**: 4 principales + 33 posts de blog
- **Scripts JS**: 16 archivos (8 originales + 8 minificados)
- **Imágenes**: 51+ en galería
- **APIs**: 3 endpoints de Cloudflare Functions
- **Dependencias**: 2 (resend + wrangler)

## 🔍 Verificación Post-Organización

```bash
# Verificar estructura
tree -L 2 -I 'node_modules|.git|.yoyo|post'

# Verificar dependencias
cat package.json

# Verificar referencias
grep -r "chatbot.js" *.html
grep -r "web3forms" *.html
```

---

**Última actualización**: 19 de noviembre de 2025
