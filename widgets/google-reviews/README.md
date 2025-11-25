# Widget de Reseñas de Google - Grupo Musical La Célula

Widget de reseñas de Google My Business implementado sin necesidad de Google Cloud Platform.

## 🎯 Características

- ✅ **Sin Google Cloud requerido** - Usa Featurable API (gratis) o datos estáticos
- ✅ **3 Layouts disponibles**: Badge, Carousel, Grid
- ✅ **Responsive** - Funciona en todos los dispositivos
- ✅ **Accesible** - Compatible con lectores de pantalla
- ✅ **Ligero** - ~15KB minificado
- ✅ **Autoplay** configurable para carousel
- ✅ **Fácil de integrar** - Vanilla JavaScript, sin dependencias

## 📦 Instalación

### 1. Copiar archivos

Copia los archivos a tu proyecto:
```
widgets/google-reviews/
├── google-reviews-widget.js
├── google-reviews-widget.css
└── README.md
```

### 2. Incluir en tu HTML

```html
<!-- CSS del widget -->
<link rel="stylesheet" href="widgets/google-reviews/google-reviews-widget.css">

<!-- Contenedor donde se renderizará el widget -->
<div id="google-reviews-container"></div>

<!-- JavaScript del widget -->
<script src="widgets/google-reviews/google-reviews-widget.js"></script>
```

## 🚀 Uso

### Opción 1: Con Featurable (Recomendado - GRATIS)

1. **Regístrate en Featurable**
   - Ve a https://featurable.com
   - Crea una cuenta gratuita
   - Crea un nuevo widget con tu Place ID de Google

2. **Inicializa el widget**

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new GoogleReviewsWidget({
      featurableId: 'TU_FEATURABLE_ID', // Obtén esto de tu cuenta Featurable
      containerId: 'google-reviews-container',
      layout: 'carousel', // 'carousel', 'badge', o 'grid'
      maxReviews: 10,
      autoplay: true,
      autoplaySpeed: 5000 // milisegundos
    });
  });
</script>
```

### Opción 2: Con datos estáticos (Sin API)

Si no quieres usar Featurable, el widget cargará datos estáticos de ejemplo:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new GoogleReviewsWidget({
      containerId: 'google-reviews-container',
      layout: 'carousel'
      // No incluyas featurableId para usar datos estáticos
    });
  });
</script>
```

**Para usar tus reseñas reales:**
1. Edita el método `loadStaticData()` en `google-reviews-widget.js`
2. Reemplaza los datos de ejemplo con tus reseñas reales

## 🎨 Layouts Disponibles

### 1. Carousel (Carrusel)
Muestra una reseña a la vez con navegación

```javascript
layout: 'carousel'
```

### 2. Badge (Insignia)
Muestra un badge compacto con rating promedio

```javascript
layout: 'badge'
```

### 3. Grid (Cuadrícula)
Muestra múltiples reseñas en formato de cuadrícula

```javascript
layout: 'grid'
```

## ⚙️ Opciones de Configuración

```javascript
{
  featurableId: null,        // ID del widget de Featurable (string)
  containerId: 'google-reviews-container', // ID del contenedor (string)
  layout: 'carousel',        // Layout: 'carousel', 'badge', 'grid'
  maxReviews: 10,           // Número máximo de reseñas a mostrar
  autoplay: true,           // Autoplay para carousel (boolean)
  autoplaySpeed: 5000       // Velocidad del autoplay en ms
}
```

## 🎨 Personalización de Estilos

### Colores principales
Edita estas variables en el CSS para personalizar:

```css
/* Cambiar color principal (azul de Google) */
.carousel-btn {
  background: #4285f4; /* Cambiar a tu color */
}

/* Cambiar color de estrellas */
.star {
  color: #fbbc04; /* Cambiar a tu color */
}
```

### CSS Classes disponibles

- `.google-reviews-widget` - Contenedor principal
- `.google-reviews-carousel` - Contenedor del carousel
- `.google-reviews-badge` - Contenedor del badge
- `.google-reviews-grid` - Contenedor de la cuadrícula
- `.review-card` - Tarjeta de reseña individual
- `.carousel-controls` - Controles del carousel
- `.rating-summary` - Resumen de calificación

## 📱 Responsive

El widget es completamente responsive y se adapta a:
- Desktop (>768px)
- Tablet (481px - 768px)
- Mobile (<480px)

## ♿ Accesibilidad

- Compatible con lectores de pantalla
- Navegación por teclado habilitada
- Etiquetas ARIA apropiadas
- Soporte para `prefers-reduced-motion`

## 🔧 API Methods

```javascript
const widget = new GoogleReviewsWidget({ ... });

// Métodos disponibles:
widget.nextSlide();      // Ir a la siguiente reseña (carousel)
widget.prevSlide();      // Ir a la reseña anterior (carousel)
widget.goToSlide(index); // Ir a una reseña específica (carousel)
widget.startAutoplay();  // Iniciar autoplay
widget.stopAutoplay();   // Detener autoplay
widget.destroy();        // Destruir el widget
```

## 📋 Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reseñas - Grupo Musical La Célula</title>
  
  <!-- CSS del widget -->
  <link rel="stylesheet" href="widgets/google-reviews/google-reviews-widget.css">
  
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 2rem;
      background: #f5f5f5;
    }
    
    .reviews-section {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
  </style>
</head>
<body>
  
  <section class="reviews-section">
    <h1>Lo que dicen nuestros clientes</h1>
    
    <!-- Contenedor del widget -->
    <div id="google-reviews-container"></div>
  </section>
  
  <!-- JavaScript del widget -->
  <script src="widgets/google-reviews/google-reviews-widget.css"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      new GoogleReviewsWidget({
        featurableId: 'example', // Reemplaza con tu ID real
        containerId: 'google-reviews-container',
        layout: 'carousel',
        maxReviews: 5,
        autoplay: true,
        autoplaySpeed: 5000
      });
    });
  </script>
</body>
</html>
```

## 🐛 Solución de Problemas

### El widget no aparece
- Verifica que los archivos JS y CSS estén cargados correctamente
- Verifica que el `containerId` coincida con el ID del div
- Revisa la consola del navegador para errores

### Las reseñas no cargan
- Verifica tu `featurableId` es correcto
- Verifica tu conexión a internet
- El widget automáticamente fallback a datos estáticos si Featurable falla

### Estilos no se aplican
- Verifica que el CSS esté incluido antes del JavaScript
- Verifica que no haya conflictos con otros estilos de tu sitio
- Usa especificidad CSS si es necesario

## 📄 Licencia

Este widget fue creado para Grupo Musical Versátil La Célula.
Libre de usar y modificar según necesidades del proyecto.

## 🔗 Enlaces Útiles

- [Featurable](https://featurable.com) - API gratuita de reseñas
- [Google Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) - Encuentra tu Place ID
- [Google My Business](https://business.google.com/) - Administra tu perfil de negocio

## 📞 Soporte

Para soporte o preguntas sobre este widget, contacta al equipo de desarrollo del sitio.
