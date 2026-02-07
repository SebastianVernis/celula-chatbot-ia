# Estructura del Proyecto - Celula Site v2.0

## 🎯 Filosofía de Organización

**Separación clara entre fuente y distribución:**
- `src/` - Código fuente editable
- `dist/` - Build optimizado (generado automáticamente)
- `archived/` - Scripts y archivos históricos

## 📁 Estructura de Directorios

```
celula-site/
│
├── src/                          # 📝 CÓDIGO FUENTE
│   ├── html/                     # Archivos HTML
│   │   ├── index.html           # Página principal
│   │   ├── blog.html            # Blog
│   │   ├── cotizador.html       # Cotizador
│   │   ├── offline.html         # Página offline (PWA)
│   │   └── post/                # Posts del blog
│   │       ├── post-0.html
│   │       ├── post-1.html
│   │       └── ... (31 posts)
│   │
│   ├── css/                      # Hojas de estilo
│   │   └── styles.css           # Estilos principales (NO editar .min.css)
│   │
│   ├── js/                       # JavaScript
│   │   ├── blog-pagination.js   # Paginación del blog
│   │   ├── chatbot.js           # AI Chatbot
│   │   ├── form-handler.js      # Manejo de formularios
│   │   ├── gallery-dynamic.js   # Galería dinámica
│   │   ├── navigation.js        # Navegación
│   │   ├── optimizations.js     # Optimizaciones de performance
│   │   ├── site-functionality.js # Funcionalidad general
│   │   ├── video-background.js  # Video de fondo
│   │   └── youtube-carousel.js  # Carrusel de YouTube
│   │
│   └── assets/                   # Recursos estáticos
│       ├── images/              # Imágenes generales
│       ├── gallery/             # Fotos de la banda
│       ├── video/               # Videos
│       ├── fonts/               # Fuentes web
│       ├── icons/               # Iconos
│       ├── logo/                # Logos
│       ├── equipo/              # Fotos del equipo
│       ├── data/                # Datos JSON
│       └── Viejas-Fotos/        # Archivo de fotos antiguas
│
├── dist/                         # 🏗️ BUILD OUTPUT (generado)
│   ├── html/                     # HTML procesado
│   ├── css/                      # CSS minificado
│   ├── js/                       # JS minificado
│   ├── assets/                   # Assets copiados
│   ├── index.html               # HTMLs principales en raíz
│   ├── blog.html
│   ├── cotizador.html
│   ├── offline.html
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.json
│   ├── sw.js
│   └── _headers
│
├── functions/                    # ⚡ SERVERLESS FUNCTIONS
│   ├── api/
│   │   ├── send-email.js        # Endpoint de email
│   │   └── chatbot.js           # Endpoint de chatbot
│   ├── package.json
│   └── node_modules/
│
├── archived/                     # 📦 ARCHIVOS HISTÓRICOS
│   ├── scripts/                 # Scripts bash antiguos
│   │   ├── minify-all.sh
│   │   ├── optimize-images.sh
│   │   └── ... (otros scripts)
│   ├── tests/                   # Tests eliminados
│   └── .history/                # Historial de VSCode
│
├── docs/                         # 📚 DOCUMENTACIÓN
│   ├── AMPLIFY_DEPLOYMENT.md
│   ├── API-EMAIL-DOCUMENTATION.md
│   ├── ESTRUCTURA-DIRECTORIOS.md
│   └── ... (otros docs)
│
├── widgets/                      # 🔧 WIDGETS EXTERNOS
│   └── google-reviews/
│
├── build.js                      # 🏗️ Script de build (Node.js)
├── dev.js                        # 🚀 Servidor de desarrollo
├── validate.js                   # ✅ Validador de proyecto
│
├── package.json                  # Dependencias y scripts
├── amplify.yml                   # Config de AWS Amplify
├── buildspec.yml                 # AWS CodeBuild (legacy)
├── wrangler.toml                 # Cloudflare (legacy)
│
├── robots.txt                    # SEO
├── sitemap.xml                   # SEO
├── manifest.json                 # PWA
├── sw.js                         # Service Worker
├── _headers                      # Headers HTTP
│
├── .gitignore
├── README.md
├── STRUCTURE.md                  # Este archivo
└── AGENTS.md                     # Guía para AI

```

## 🔄 Flujo de Trabajo

### Desarrollo

1. **Editar archivos fuente** en `src/`
2. **Ejecutar servidor de desarrollo**: `npm run dev`
3. **Ver cambios** en `http://localhost:3000`

### Build

1. **Validar proyecto**: `npm run validate`
2. **Build**: `npm run build`
3. **Output** generado en `dist/`

### Deploy

1. **Push a Git**
2. **AWS Amplify** lee `amplify.yml`
3. **Ejecuta** `npm run build`
4. **Despliega** desde `dist/`

## 📝 Reglas de Edición

### ✅ QUÉ EDITAR

- Archivos en `src/html/`, `src/css/`, `src/js/`
- Archivos de configuración raíz
- Documentación en `docs/`
- Serverless functions en `functions/api/`

### ❌ NO EDITAR

- Archivos en `dist/` (se regeneran en cada build)
- Archivos `.min.css` o `.min.js` (se generan automáticamente)
- Archivos en `archived/` (solo consulta)
- `node_modules/`

## 🛠️ Comandos y Sus Efectos

| Comando | Input | Output | Descripción |
|---------|-------|--------|-------------|
| `npm run dev` | `src/` | - | Servidor de desarrollo en puerto 3000 |
| `npm run validate` | `src/` | Reporte | Valida referencias y sintaxis |
| `npm run build` | `src/` | `dist/` | Build completo optimizado |
| `npm run lint` | `src/js/` | - | Linting de JavaScript |

## 📦 Assets y Referencias

### En HTML Source (src/html/)

```html
<!-- CSS -->
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="../css/styles.css">  <!-- desde post/ -->

<!-- JS -->
<script src="js/navigation.js"></script>
<script src="../js/navigation.js"></script>  <!-- desde post/ -->

<!-- Assets -->
<img src="assets/gallery/foto.webp">
<img src="../assets/gallery/foto.webp">  <!-- desde post/ -->
```

### Después del Build (dist/html/)

El build actualiza automáticamente las rutas:

```html
<!-- CSS minificado -->
<link rel="stylesheet" href="dist/css/styles.min.css">

<!-- JS minificado -->
<script src="dist/js/navigation.min.js"></script>

<!-- Assets -->
<img src="dist/assets/gallery/foto.webp">
```

## 🎨 Sistema de Minificación

### Automático durante Build

1. **CSS**: `styles.css` → `styles.min.css`
   - Elimina comentarios
   - Elimina espacios
   - Combina selectores

2. **JS**: `archivo.js` → `archivo.min.js`
   - Elimina comentarios
   - Elimina espacios innecesarios
   - Mantiene funcionalidad

3. **HTML**: Actualiza referencias a versiones minificadas

## 🚀 Deploy a AWS Amplify

### Archivos Clave

- `amplify.yml` - Configuración de build
- `dist/` - Directorio de salida
- Variables de entorno en Amplify Console

### Proceso

1. Amplify detecta push
2. Ejecuta `npm ci`
3. Ejecuta `npm run build`
4. Despliega contenido de `dist/`
5. Aplica headers de `_headers`

## 📊 Optimizaciones Implementadas

### Performance

- ✅ CSS y JS minificados
- ✅ Imágenes en WebP
- ✅ Lazy loading
- ✅ Cache headers
- ✅ Preload crítico

### SEO

- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Meta tags
- ✅ Schema.org markup
- ✅ Canonical URLs

### PWA

- ✅ manifest.json
- ✅ Service Worker
- ✅ Offline page
- ✅ App icons

## 🔍 Validación

El comando `npm run validate` verifica:

- Referencias CSS válidas
- Referencias JS válidas
- Referencias de imágenes
- Sintaxis HTML básica
- Estructura del proyecto

## 📈 Tamaño del Proyecto

```
src/        ~5MB   (fuentes, no minificado)
dist/       ~50MB  (con assets)
assets/     ~45MB  (imágenes, videos, fuentes)
```

## 🔄 Migración desde v1.0

### Cambios Principales

1. **Estructura reorganizada**: Todo el código fuente en `src/`
2. **Build en Node.js**: Ya no depende de scripts bash
3. **Validación automática**: Pre-build validation
4. **Scripts archivados**: Movidos a `archived/scripts/`
5. **Tests eliminados**: Removidos archivos de testing

### Compatibilidad

- ✅ AWS Amplify
- ✅ Cloudflare Pages (legacy con ajustes)
- ✅ Cualquier host estático

---

**Versión**: 2.0.0  
**Última actualización**: 2025  
**Arquitectura**: Static Site + Serverless Functions
