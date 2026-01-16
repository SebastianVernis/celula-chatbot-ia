# Video Player Popup

Reproductor de video persistente estilo video.js sin dependencias externas.

## 📋 Características

### ✨ Funcionalidad Principal
- **Reproductor popup flotante** con diseño moderno estilo video.js
- **Persistencia entre páginas** usando localStorage
- **Auto-reproducción en loop** de 2 videos promocionales
- **Sin dependencias externas** - implementación nativa
- **Totalmente responsive** - adaptado a móviles y tablets
- **Arrastrable** - posiciona el reproductor donde quieras
- **Minimizable** - reduce el reproductor sin cerrar

### 🎮 Controles

#### Controles de Video
- ▶️ **Play/Pause** - Reproducir o pausar el video actual
- ⏭️ **Next** - Saltar al siguiente video en la playlist
- 🔊 **Volume** - Control de volumen con slider
- 🔇 **Mute** - Silenciar/activar sonido
- ⛶ **Fullscreen** - Pantalla completa
- 🗕 **Minimize** - Minimizar el reproductor
- ✕ **Close** - Cerrar el reproductor

#### Barra de Progreso
- **Click** en la barra para saltar a cualquier momento
- **Indicador visual** del tiempo reproducido
- **Buffer indicator** muestra el contenido precargado
- **Time display** muestra tiempo actual y duración total

#### Playlist
- **2 videos promocionales** en loop automático
- **Click** en cualquier video para reproducirlo
- **Indicador visual** del video activo

### ⌨️ Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| `Espacio` o `K` | Play/Pausa |
| `←` | Retroceder 5 segundos |
| `→` | Avanzar 5 segundos |
| `↑` | Subir volumen |
| `↓` | Bajar volumen |
| `M` | Silenciar/Activar |
| `F` | Pantalla completa |
| `N` | Siguiente video |

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
- `css/video-player-popup.css` (10.54KB)
- `css/video-player-popup.min.css` (7.57KB - 28.2% reducción)

#### JavaScript
- `js/video-player-popup.js` (24.81KB)
- `js/video-player-popup.min.js` (16.38KB - 34.0% reducción)

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
Al entrar al sitio por primera vez (en cualquier página), el reproductor:
1. Se muestra automáticamente en la esquina inferior derecha
2. Comienza con el primer video pausado
3. El usuario puede hacer click para reproducir

#### Navegación Entre Páginas
El reproductor mantiene su estado:
- ✅ Posición en el video actual
- ✅ Volumen configurado
- ✅ Estado de reproducción (play/pause)
- ✅ Video actual de la playlist
- ✅ Posición del popup (si fue arrastrado)
- ✅ Estado minimizado/expandido
- ✅ Visibilidad (abierto/cerrado)

#### Auto-reproducción en Loop
- Al finalizar un video, pasa automáticamente al siguiente
- Al finalizar el último video, vuelve al primero
- Loop infinito sin interrupciones

### 💾 Persistencia de Estado

El reproductor usa `localStorage` para guardar:

```javascript
{
  currentVideoIndex: 0,      // Índice del video actual
  currentTime: 45.2,         // Tiempo de reproducción
  volume: 0.7,               // Nivel de volumen (0-1)
  isPlaying: true,           // Estado de reproducción
  isMinimized: false,        // Estado minimizado
  isHidden: false,           // Visibilidad
  position: {                // Posición del popup
    left: '20px',
    top: '20px'
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
- **Desktop:** 480px de ancho
- **Tablet:** calc(100vw - 20px)
- **Mobile:** 100vw (pantalla completa en el bottom)

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

### 🔄 Actualización Futura

Para agregar más videos a la playlist:

```javascript
// En js/video-player-popup.js, línea 9-18
const VIDEO_SOURCES = [
    {
        src: '/assets/video/Video_Promocional_Grupo_Musical_Celula_1.webm',
        type: 'video/webm',
        title: 'Video Promocional - Parte 1'
    },
    {
        src: '/assets/video/Video_Promocional_Grupo_Musical_Celula_2.webm',
        type: 'video/webm',
        title: 'Video Promocional - Parte 2'
    },
    // Agregar nuevos videos aquí
    {
        src: '/assets/video/nuevo_video.webm',
        type: 'video/webm',
        title: 'Nuevo Video'
    }
];
```

### 📊 Métricas de Performance

- **Carga inicial:** ~24KB (CSS + JS minificados)
- **Video streaming:** Progressive loading (no carga todo el video de golpe)
- **Memory footprint:** ~50MB durante reproducción
- **CPU usage:** Bajo (gracias a VP9 hardware acceleration)

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
