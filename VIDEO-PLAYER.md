# Video Player Popup

Dos reproductores de video completamente independientes, uno en cada lado de la pantalla.

## 📋 Características

### ✨ Funcionalidad Principal
- **Dos reproductores separados** - Video 1 en la izquierda, Video 2 en la derecha
- **Completamente independientes** - Cada uno con sus propios controles y estado
- **Loop automático** - Ambos videos se reproducen continuamente
- **Persistencia entre páginas** usando localStorage
- **Sin dependencias externas** - implementación nativa 100%
- **Totalmente responsive** - Se adapta a diferentes tamaños de pantalla
- **Arrastrable** - Cada reproductor se puede mover independientemente
- **Minimizable** - Cada reproductor se minimiza por separado

### 🎮 Controles

#### Controles por Video (Independientes)
- ▶️ **Play/Pause** - Control individual para cada video
- 🔇 **Mute** - Solo un video puede tener audio activo a la vez
- ⛶ **Fullscreen** - Pantalla completa individual
- 📊 **Progress Bar** - Barra de progreso con seek individual
- 🕒 **Time Display** - Tiempo actual y duración de cada video

#### Controles Globales
- 🗕 **Minimize** - Minimizar el reproductor completo
- ✕ **Close** - Cerrar el reproductor

#### Comportamiento de Audio
- Solo un video puede tener audio activo a la vez
- Al reproducir un video, el otro se mutea automáticamente
- Click en mute cambia el audio activo entre videos

### 🎬 Videos

Los videos promocionales están optimizados para web:

#### Video 1
- **Original:** 25MB (MP4, H.264 + AAC)
- **Optimizado:** 18MB (WebM, VP9 + Opus)
- **Reducción:** 28%
- **Resolución:** 848x480
- **Duración:** 2:32

#### Video 2
- **Original:** 11MB (MP4, H.264 + AAC)
- **Optimizado:** 10MB (WebM, VP9 + Opus)
- **Reducción:** 9%
- **Resolución:** 512x288
- **Duración:** 2:32

#### Configuración de Codificación
```bash
# Video codec: VP9
-c:v libvpx-vp9 -b:v 800k -crf 30 -quality good -speed 2 -row-mt 1

# Audio codec: Opus (calidad 100%)
-c:a libopus -b:a 128k -vbr on
```

### 📦 Archivos del Sistema

#### CSS
- `css/video-player-popup.css` (7.34KB)
- `css/video-player-popup.min.css` (5.01KB - 31.7% reducción)

#### JavaScript
- `js/video-player-popup.js` (20.67KB)
- `js/video-player-popup.min.js` (13.46KB - 34.9% reducción)

#### Videos
- `assets/video/Video_Promocional_Grupo_Musical_Celula_1.webm` (18MB)
- `assets/video/Video_Promocional_Grupo_Musical_Celula_2.webm` (10MB)

### 🔧 Integración

El reproductor está integrado en todas las páginas del sitio:

#### Páginas Principales
- ✅ index.html
- ✅ blog.html
- ✅ cotizador.html
- ✅ galeria.html
- ✅ testimonios.html

#### Páginas del Blog
- ✅ post/post-*.html (47 páginas)

#### Páginas de Marketing
- ✅ marketing/bodas.html
- ✅ marketing/xv.html
- ✅ marketing/privada.html

### 🚀 Comportamiento

#### Primera Visita
Al entrar al sitio por primera vez (en cualquier página):
1. Aparecen automáticamente dos reproductores
2. **Reproductor izquierdo:** Esquina inferior izquierda
3. **Reproductor derecho:** Esquina inferior derecha
4. Ambos videos comienzan pausados
5. El video derecho está en mute por defecto

#### Navegación Entre Páginas
Cada reproductor mantiene su propio estado:
- ✅ Tiempo de reproducción individual
- ✅ Estado de play/pause
- ✅ Estado de mute
- ✅ Volumen configurado
- ✅ Posición en pantalla (si fue arrastrado)
- ✅ Estado minimizado/expandido
- ✅ Visibilidad (abierto/cerrado)

#### Reproducción Independiente
- Cada reproductor funciona completamente por separado
- Ambos tienen loop automático activado
- Solo un reproductor puede tener audio a la vez
- Al activar audio en uno, el otro se mutea automáticamente
- Cada uno se puede arrastrar y minimizar individualmente

### 💾 Persistencia de Estado

Cada reproductor guarda su estado independientemente en `localStorage`:

```javascript
{
  left: {
    currentTime: 45.2,       // Tiempo de reproducción
    volume: 0.7,             // Volumen (0-1)
    muted: false,            // Estado de mute
    playing: true,           // Reproduciendo o pausado
    minimized: false,        // Minimizado
    hidden: false,           // Visible u oculto
    position: {              // Posición en pantalla
      left: '20px',
      top: 'auto',
      right: 'auto',
      bottom: '20px'
    }
  },
  right: {
    currentTime: 23.5,
    volume: 0.7,
    muted: true,             // Derecho empieza en mute
    playing: false,
    minimized: false,
    hidden: false,
    position: {
      left: 'auto',
      top: 'auto',
      right: '20px',
      bottom: '20px'
    }
  }
}
```

### 🎨 Diseño

#### Paleta de Colores
- **Fondo:** Gradiente oscuro (#1a1a1a → #0a0a0a)
- **Controles:** rgba(0, 0, 0, 0.9)
- **Acento:** #e74c3c (rojo - matching brand)
- **Texto:** #ffffff con transparencias

#### Responsive Breakpoints
- **Desktop (>1024px):** 360px por reproductor
- **Laptop (≤1024px):** 320px por reproductor
- **Tablet (≤768px):** 280px por reproductor
- **Mobile (≤480px):** calc(50vw - 10px) cada uno

#### Animaciones
- Entrada: slideInUp (0.3s ease)
- Transiciones: opacity, transform (0.3s ease)
- Hover effects en todos los controles

### 🧪 Testing

Archivo de prueba incluido: `test-video-player.html`

```bash
# Abrir en navegador para probar
open test-video-player.html

# O con servidor local
npx http-server -p 8080
```

### 🔍 Validación

El reproductor incluye:
- ✅ ARIA labels para accesibilidad
- ✅ Manejo de errores de video
- ✅ Fallback si el formato no es soportado
- ✅ Loading spinner durante buffering
- ✅ Gestión de memoria (cleanup on page unload)

### 🐛 Troubleshooting

#### El reproductor no aparece
- Verificar que los archivos CSS y JS estén cargados
- Revisar consola del navegador por errores
- Verificar que los videos existan en `/assets/video/`

#### Videos no se reproducen
- Verificar que el navegador soporte WebM/VP9
- Revisar permisos del servidor web
- Verificar las rutas de los videos

#### Estado no se persiste
- Verificar que localStorage esté habilitado
- Limpiar localStorage: `localStorage.removeItem('celula_video_player_state')`
- Revisar consola por errores de parseo

### 📱 Compatibilidad

#### Navegadores Soportados
- ✅ Chrome 29+
- ✅ Firefox 28+
- ✅ Safari 14.1+
- ✅ Edge 14+
- ✅ Opera 16+

#### Formatos de Video
- **Principal:** WebM (VP9 + Opus)
- **Fallback:** MP4 disponible si es necesario

### 🔄 Cambiar Videos

Para cambiar los videos mostrados:

```javascript
// En js/video-player-popup.js, modificar VIDEO_SOURCES
const VIDEO_SOURCES = [
    {
        src: `${basePath}assets/video/nuevo_video_1.webm`,
        type: 'video/webm',
        title: 'Nuevo Video Izquierdo'
    },
    {
        src: `${basePath}assets/video/nuevo_video_2.webm`,
        type: 'video/webm',
        title: 'Nuevo Video Derecho'
    }
];
```

**Nota:** El reproductor está diseñado para exactamente 2 videos (izquierdo y derecho).

### 📊 Métricas de Performance

- **Carga inicial:** ~18.5KB (CSS + JS minificados)
- **Video streaming:** Progressive loading (no carga todo el video de golpe)
- **Memory footprint:** ~100MB durante reproducción dual
- **CPU usage:** Bajo (gracias a VP9 hardware acceleration)
- **Layout:** Posicionamiento absoluto independiente (sin grid)

### 🎯 SEO & Analytics

El reproductor incluye tracking potencial para:
- Video views
- Completion rate
- User engagement
- Time watched

Integración sugerida con GTM para métricas más detalladas.

---

## 🚀 Deployment

Los archivos ya están integrados en el build automático:

```bash
npm run build
```

Esto generará:
- `dist/css/video-player-popup.min.css`
- `dist/js/video-player-popup.min.js`
- `dist/assets/video/*.webm`

Y actualizará todas las páginas HTML con las referencias correctas.
