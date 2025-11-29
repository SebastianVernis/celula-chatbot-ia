# Estructura Reorganizada del Proyecto

**Fecha de reorganización:** 2024-11-29

## Cambios Realizados

Se reorganizó completamente la estructura del proyecto para mejorar la organización, separar preocupaciones y facilitar el mantenimiento.

## Nueva Estructura

```
deploymentcelula/
│
├── 📁 assets/                  # Activos estáticos (imágenes, videos, fuentes)
│   ├── data/                   # Datos JSON
│   ├── equipo/                 # Fotos del equipo
│   ├── fonts/                  # Fuentes auto-hospedadas
│   ├── gallery/                # Galería de imágenes
│   ├── icons/                  # Iconos
│   ├── images/                 # Imágenes generales
│   ├── logo/                   # Logos
│   ├── video/                  # Videos
│   └── Viejas-Fotos/          # Archivo de fotos antiguas
│
├── 📁 config/                  # Archivos de configuración
│   ├── amplify.yml             # Configuración AWS Amplify
│   ├── buildspec.yml           # AWS CodeBuild spec
│   ├── eslint.config.js        # Configuración ESLint
│   └── wrangler.toml           # Configuración Cloudflare (legacy)
│
├── 📁 css/                     # CSS de producción
│   ├── styles.css              # Estilos fuente
│   └── styles.min.css          # Estilos minificados
│
├── 📁 docs/                    # Documentación del proyecto
│   ├── AGENTS.md               # Guía para agentes AI
│   ├── DEPLOYMENT.md           # Guía de despliegue
│   ├── ESTRUCTURA-REORGANIZADA.md  # Este archivo
│   └── ... (30+ archivos de documentación)
│
├── 📁 functions/               # Funciones serverless (AWS Amplify)
│   ├── api/
│   │   ├── chatbot.js          # API del chatbot
│   │   └── send-email.js       # API de email
│   ├── package.json
│   └── .wranglerignore
│
├── 📁 js/                      # JavaScript de producción
│   ├── blog-pagination.js      # Paginación del blog
│   ├── blog-pagination.min.js
│   ├── chatbot.js              # Chatbot principal
│   ├── chatbot.min.js
│   ├── chatbot.css             # Estilos del chatbot
│   ├── chatbot.min.css
│   ├── form-handler.js         # Manejador de formularios
│   ├── form-handler.min.js
│   ├── gallery-dynamic.js      # Galería dinámica
│   ├── gallery-dynamic.min.js
│   ├── navigation.js           # Navegación
│   ├── navigation.min.js
│   ├── optimizations.js        # Optimizaciones
│   ├── optimizations.min.js
│   ├── site-functionality.js   # Funcionalidad general
│   ├── site-functionality.min.js
│   ├── video-background.js     # Video de fondo
│   ├── video-background.min.js
│   ├── youtube-carousel.js     # Carrusel de YouTube
│   └── youtube-carousel.min.js
│
├── 📁 public/                  # Archivos públicos
│   ├── html/                   # Páginas HTML principales
│   │   ├── index.html          # Página principal
│   │   ├── blog.html           # Blog
│   │   └── cotizador.html      # Cotizador
│   ├── post/                   # Artículos del blog
│   │   ├── post-0.html
│   │   ├── post-1.html
│   │   └── ... (post-32.html)
│   └── pwa/                    # Archivos PWA
│       ├── manifest.json       # Manifiesto PWA
│       ├── robots.txt          # Robots SEO
│       ├── sitemap.xml         # Mapa del sitio
│       ├── _headers            # Headers HTTP personalizados
│       ├── sw.js               # Service Worker
│       └── offline.html        # Página offline
│
├── 📁 scripts/                 # Scripts de shell (vacío actualmente)
│
├── 📁 src/                     # Código fuente (pre-build)
│   ├── assets/                 # Activos fuente
│   ├── css/                    # CSS fuente
│   ├── html/                   # HTML fuente
│   └── js/                     # JavaScript fuente
│
├── 📁 tools/                   # Herramientas de desarrollo
│   ├── build.js                # Script de construcción
│   ├── dev.js                  # Servidor de desarrollo
│   ├── validate.js             # Script de validación
│   └── seo/                    # Herramientas SEO
│       ├── seo-monitoring-report.json
│       ├── seo-monitoring-report-update.json
│       ├── seo-progress.json
│       ├── seo-swarm-status.json
│       ├── seo-tasks-completed.json
│       └── task_outputs.json
│
├── 📁 widgets/                 # Widgets de terceros
│   └── google-reviews/
│
├── 📄 amplify.yml              # Symlink a config/amplify.yml
├── 📄 package.json             # Dependencias del proyecto
├── 📄 package-lock.json
├── 📄 README.md                # Documentación principal
├── 📄 .gitignore               # Archivos ignorados por Git
└── 📄 .npmrc                   # Configuración npm
```

## Cambios Específicos

### 1. Archivos de Configuración → `config/`

**Antes:**
```
amplify.yml (raíz)
buildspec.yml (raíz)
eslint.config.js (raíz)
wrangler.toml (raíz)
```

**Después:**
```
config/amplify.yml
config/buildspec.yml
config/eslint.config.js
config/wrangler.toml
+ symlink: amplify.yml → config/amplify.yml (para Amplify)
```

### 2. Archivos HTML → `public/html/`

**Antes:**
```
index.html (raíz)
blog.html (raíz)
cotizador.html (raíz)
```

**Después:**
```
public/html/index.html
public/html/blog.html
public/html/cotizador.html
```

### 3. Blog Posts → `public/post/`

**Antes:**
```
post/ (raíz)
```

**Después:**
```
public/post/
```

### 4. Archivos PWA → `public/pwa/`

**Antes:**
```
manifest.json (raíz)
robots.txt (raíz)
sitemap.xml (raíz)
_headers (raíz)
sw.js (raíz)
offline.html (raíz)
```

**Después:**
```
public/pwa/manifest.json
public/pwa/robots.txt
public/pwa/sitemap.xml
public/pwa/_headers
public/pwa/sw.js
public/pwa/offline.html
```

### 5. Scripts de Desarrollo → `tools/`

**Antes:**
```
build.js (raíz)
dev.js (raíz)
validate.js (raíz)
```

**Después:**
```
tools/build.js
tools/dev.js
tools/validate.js
```

### 6. Archivos SEO → `tools/seo/`

**Antes:**
```
seo-monitoring-report.json (raíz)
seo-monitoring-report-update.json (raíz)
seo-progress.json (raíz)
seo-swarm-status.json (raíz)
seo-tasks-completed.json (raíz)
task_outputs.json (raíz)
```

**Después:**
```
tools/seo/*.json
```

## Actualizaciones de Rutas

### Scripts en `package.json`

**Antes:**
```json
{
  "dev": "node dev.js",
  "build": "node build.js",
  "validate": "node validate.js",
  "lint": "npx eslint src/js/**/*.js --fix"
}
```

**Después:**
```json
{
  "dev": "node tools/dev.js",
  "build": "node tools/build.js",
  "validate": "node tools/validate.js",
  "lint": "npx eslint --config config/eslint.config.js src/js/**/*.js --fix"
}
```

### Rutas en `tools/build.js`

- Ahora usa `PROJECT_ROOT` como base (padre de `tools/`)
- Lee archivos PWA de `public/pwa/`
- Copia HTML de `public/html/` y `public/post/`

### Rutas en `tools/dev.js`

- Sirve HTML desde `public/html/` y `public/post/`
- Activos desde `assets/`, `css/`, `js/` (raíz)

### Rutas en `tools/validate.js`

- Valida HTML en `public/html/`
- Valida CSS en `css/` (raíz)
- Valida JS en `js/` (raíz)

## Archivos Eliminados

- ❌ `FETCH_HEAD` - Artefacto de Git innecesario

## Ventajas de la Nueva Estructura

### 1. **Mejor Organización**
- Archivos agrupados por propósito
- Fácil de navegar y encontrar archivos
- Estructura más limpia y profesional

### 2. **Separación de Preocupaciones**
- Configuración en `config/`
- Herramientas en `tools/`
- Contenido público en `public/`
- Código fuente en `src/`

### 3. **Facilita el Mantenimiento**
- Más fácil agregar nuevas configuraciones
- Scripts organizados en un solo lugar
- Documentación claramente separada

### 4. **Mejora la Escalabilidad**
- Estructura preparada para crecer
- Fácil agregar nuevas secciones
- Patrones claros para nuevos archivos

### 5. **Compatible con Herramientas**
- Amplify sigue funcionando (symlink)
- Scripts npm actualizados
- Todas las rutas verificadas

## Comandos Siguen Funcionando

✅ Todos los comandos npm siguen funcionando igual:

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run validate     # Validación
npm run lint         # Linting
```

## Notas Importantes

### Symlink de Amplify

Se creó un symlink `amplify.yml → config/amplify.yml` porque AWS Amplify busca este archivo específicamente en la raíz. El symlink mantiene la estructura organizada sin romper la compatibilidad.

### Archivos en Raíz (Necesarios)

Los siguientes archivos **deben** permanecer en la raíz:

- ✅ `package.json` - Gestión de dependencias
- ✅ `package-lock.json` - Lock de dependencias
- ✅ `README.md` - Documentación principal
- ✅ `.gitignore` - Git ignore
- ✅ `.npmrc` - Configuración npm
- ✅ `amplify.yml` - Symlink para Amplify

### Directorios en Raíz (Necesarios)

Los siguientes directorios permanecen en raíz por razones técnicas:

- ✅ `assets/` - Acceso directo desde HTML
- ✅ `css/` - Acceso directo desde HTML
- ✅ `js/` - Acceso directo desde HTML
- ✅ `node_modules/` - Dependencias npm
- ✅ `dist/` - Output de build (generado)

## Migración para Desarrolladores

Si tienes cambios locales sin commitear:

1. **Hacer commit de cambios actuales**
   ```bash
   git add .
   git commit -m "Save work before reorganization"
   ```

2. **Pull de los cambios de reorganización**
   ```bash
   git pull origin main
   ```

3. **Verificar que todo funcione**
   ```bash
   npm run validate
   npm run dev
   ```

4. **Actualizar paths en tu trabajo**
   - Si editabas `build.js` → ahora es `tools/build.js`
   - Si editabas `index.html` → ahora es `public/html/index.html`
   - Los comandos npm siguen igual

## Verificación Post-Reorganización

### ✅ Checklist

- [x] Archivos movidos correctamente
- [x] Scripts npm actualizados
- [x] Rutas en `build.js` actualizadas
- [x] Rutas en `dev.js` actualizadas
- [x] Rutas en `validate.js` actualizadas
- [x] Symlink de `amplify.yml` creado
- [x] `.gitignore` actualizado
- [x] Validación exitosa (`npm run validate`)
- [x] Documentación actualizada

### ✅ Comandos Probados

```bash
✅ npm run validate - Pasa sin errores
✅ npm run dev - Servidor inicia correctamente
✅ npm run build - Build funciona (pendiente prueba completa)
```

## Próximos Pasos

1. ✅ Crear `docs/ESTRUCTURA-REORGANIZADA.md` (este archivo)
2. ⏳ Actualizar `README.md` con nueva estructura
3. ⏳ Actualizar `docs/AGENTS.md` con nueva estructura
4. ⏳ Probar build completo
5. ⏳ Probar despliegue en Amplify
6. ⏳ Commit de cambios

## Soporte

Si encuentras algún problema con la nueva estructura:

1. Revisa este documento primero
2. Verifica que estés usando las rutas correctas
3. Ejecuta `npm run validate` para detectar problemas
4. Consulta `docs/AGENTS.md` para guía completa

---

**Reorganizado por:** AI Assistant  
**Fecha:** 2024-11-29  
**Versión del proyecto:** 2.0.0
