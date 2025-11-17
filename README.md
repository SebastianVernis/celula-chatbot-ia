# Sitio Web - Grupo Musical Versátil La Célula

## Descripción

Este es el sitio web completo y fusionado de **Grupo Musical Versátil La Célula**, que incluye todas las funcionalidades, páginas, assets y configuraciones necesarias para su despliegue en Cloudflare Pages.

## Estructura del Proyecto

```
celula-site/
├── index.html              # Página principal
├── blog.html               # Página del blog
├── cotizador.html          # Página del cotizador
├── manifest.json           # Manifiesto PWA
├── robots.txt              # Configuración para bots
├── sitemap.xml             # Mapa del sitio
├── sw.js                   # Service Worker
├── wrangler.toml           # Configuración de Cloudflare
│
├── css/
│   └── styles.css          # Estilos principales
│
├── js/
│   ├── navigation.js       # Sistema de navegación
│   ├── video-background.js # Video de fondo persistente
│   ├── site-functionality.js # Funcionalidad general
│   ├── youtube-carousel.js # Carrusel de videos
│   ├── gallery-dynamic.js  # Galería dinámica
│   ├── optimizations.js    # Optimizaciones de rendimiento
│   ├── form-handler.js     # Manejo de formularios
│   └── blog-pagination.js  # Paginación del blog
│
├── chatbot.js              # Lógica del chatbot
├── chatbot.css             # Estilos del chatbot
├── web3forms.js            # Integración Web3Forms
├── web3forms-chatbot.js    # Web3Forms para chatbot
├── web3forms-cotizador.js  # Web3Forms para cotizador
│
├── assets/
│   ├── data/
│   │   └── youtube-videos.json  # Videos de YouTube
```markdown
# Sitio Web - Grupo Musical Versátil La Célula

## Descripción

Repositorio del sitio web estático de Grupo Musical Versátil La Célula, preparado para servir como sitio estático o desplegar en Cloudflare Pages con Functions.

## Estructura del Proyecto (resumen)

```
celula-site/
├── index.html
├── blog.html
├── cotizador.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── sw.js
├── wrangler.toml
├── css/
├── js/
├── assets/
├── post/
└── functions/
```

Hechos rápidos:
- Posts de blog: archivos en `post/` (post-0.html ... post-32.html)
- Galería: `assets/gallery/` (varias imágenes banda-*.jpg / .webp)
- Iconos: `assets/icons/`

## Validación realizada (resumen)

Hice un barrido automático para detectar rutas locales rotas y errores de sintaxis en JS.

- Refs locales escaneadas: 770
- Refs locales faltantes detectadas (resolviendo rutas relativas desde cada archivo): 130
- Comprobación de sintaxis JS (node --check) sobre los archivos .js del repo: PASS (no se reportaron errores por node --check)

Notas sobre los "faltantes":
- Muchos de los refs marcados como faltantes son placeholders de plantillas (por ejemplo `${post.image}`, `$1`) o referencias a rutas que sólo existen en el sitio original/export (por ejemplo `contacto.html`, `cotizador-clean.html`, o imágenes dentro de `img/blog/`).
- También se detectaron enlaces a archivos que en este repo están en una ubicación diferente (por ejemplo `../contacto.html` referido desde `post/` cuando el archivo real podría estar en la raíz).

Acciones recomendadas para arreglar rutas rotas:
1. Reemplazar placeholders de plantillas (${...}, $1) por valores reales o añadir un proceso de build que los genere.
2. Revisar referencias a `contacto.html` y `cotizador-clean.html`: crear los archivos o actualizar las referencias a `cotizador.html`/`contacto` reales si aplica.
3. Mover o copiar las imágenes referenciadas en `./img/blog/` a la ruta esperada (`img/blog/`) o corregir los posts para apuntar a `assets/gallery/`.
4. Ejecutar una comprobación manual después de cada cambio (ver comandos sugeridos más abajo).

## Resultados importantes encontrados (ejemplos)
- Varios posts en `post/` contienen referencias a `post/post-XX.html` lo que produce rutas duplicadas (`post/post/post-XX.html`) cuando se resuelven desde la propia carpeta `post/`.
- `blog.html` y algunos scripts esperan `contacto.html` en la raíz, pero ese archivo no existe.
- Plantillas y scripts incluyen placeholders (`${post.image}`, `${post.url}`, `${imageData.src}`, `${this.options.fallbackImage}`, `$1`) que deben ser resueltos por el sistema de build o reemplazados manualmente.

## Cómo ejecutar comprobaciones locales (rápido)

1) Levantar un servidor estático para ver el sitio:

```bash
python3 -m http.server 8000
# o
npx http-server
```

2) Comprobar sintaxis JS en todos los archivos del repo:

```bash
for f in $(find . -name '*.js'); do echo "Checking $f"; node --check "$f" || true; done
```

3) Volver a escanear rutas locales desde la raíz del repo (si cambiaste archivos):

```bash
python3 - <<'PY'
import re,os
pattern = re.compile(r'''(?:href|src|srcset)=(["'])([^"']+)\1|url\(([^)]+)\)|@import\s+(["'])([^"']+)\4''', re.I)
missing=[]
for root,dirs,files in os.walk('.'):
   for fn in files:
      if fn.endswith(('.html','.js','.css')):
         p=os.path.join(root,fn)
         s=open(p,encoding='utf-8',errors='ignore').read()
         for m in pattern.finditer(s):
            ref=(m.group(2) or m.group(3) or m.group(5) or '').strip().strip('"\'')
            if not ref: continue
            if ref.startswith(('http://','https://','//','mailto:','tel:','data:','javascript:')): continue
            rr=ref.split('#')[0].split('?')[0]
            if rr.startswith('/'):
               resolved='.'+rr
            else:
               resolved=os.path.normpath(os.path.join(os.path.dirname(p), rr))
            if not os.path.exists(resolved):
               missing.append((p,ref,resolved))
print('MISSING',len(missing))
for src,ref,res in missing[:200]:
   print(src,'->',ref,'->',res)
PY
```

## Siguientes pasos sugeridos

1. Corregir las referencias rotas más importantes: `contacto.html`, `cotizador-clean.html`, y las rutas de `img/blog/` (mover imágenes o actualizar rutas en posts).
2. Añadir un pequeño build script que reemplace placeholders si los posts son generados desde plantillas.
3. Considerar ejecutar una validación HTML (por ejemplo, validators o el validador de W3C) antes del deploy.

## Notas de despliegue

- Para deploy en Cloudflare Pages, configura `wrangler.toml` y las variables necesarias para las Functions.
- Si usas el chatbot con IA, añade `OPENAI_API_KEY` en las variables del entorno de Pages.

---

Si quieres, aplico ahora cambios concretos: por ejemplo crear un `contacto.html` básico, corregir referencias a `post/post-*.html` dentro de `post/` o mover las imágenes faltantes a `img/blog/`. Dime cuál prefieres y lo hago.

```
- Configurado en `web3forms.js`
