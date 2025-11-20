# Critical CSS Implementation Guide

## Objetivo
Extraer e inline el CSS crítico para "above-the-fold" (hero section) para mejorar First Contentful Paint (FCP) en 300-500ms.

---

## 📋 CSS Crítico Identificado

El CSS crítico incluye solo los estilos necesarios para renderizar el hero section:

```css
/* Critical CSS - Inline en <head> */
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    height: 100%;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    background: transparent;
    color: #fff;
    overflow-x: hidden;
}

:root {
    --header-height: 55px;
    --primary-text: #ffffff;
    --secondary-text: #e0e0e0;
    --overlay-bg: rgba(0, 0, 0, 0.4);
    --accent-yellow: #fbe649;
    --font-title: normal normal normal 25px/1.4em 'Lobster', cursive;
}

.site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background: var(--overlay-bg);
    backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-section {
    position: relative;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    background: #000;
}

.hero-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    max-width: 800px;
    text-align: center;
}

.hero-logo {
    width: 390px;
    height: 220px;
    margin-bottom: 20px;
    object-fit: contain;
}

.hero-title {
    font: var(--font-title);
    font-size: 19px;
    margin-bottom: 30px;
    color: var(--primary-text);
}

.social-bar {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.social-icon {
    width: 39px;
    height: 39px;
    transition: transform 0.3s ease;
    color: #ffffff;
}

@media (max-width: 768px) {
    .hero-logo {
        width: 280px;
        height: 158px;
    }
    .hero-title {
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .hero-logo {
        width: 240px;
        height: 135px;
    }
}
</style>
```

---

## 🔧 Implementación en index.html

### **Paso 1: Agregar Critical CSS en `<head>`**

```html
<head>
    <!-- ... meta tags ... -->
    
    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Critical CSS inline -->
    <style>
        /* Pegar aquí el CSS crítico de arriba */
    </style>
    
    <!-- Preload del CSS completo -->
    <link rel="preload" 
          href="css/styles.min.css" 
          as="style" 
          onload="this.onload=null;this.rel='stylesheet'">
    
    <!-- Fallback para navegadores sin JS -->
    <noscript>
        <link rel="stylesheet" href="css/styles.min.css">
    </noscript>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Lobster:wght@400&family=Open+Sans:wght@400;600;700&family=Raleway:wght@400;600&display=swap" rel="stylesheet">
</head>
```

### **Paso 2: Remover el link normal de CSS**

```html
<!-- ANTES: -->
<link rel="stylesheet" href="css/styles.min.css">

<!-- DESPUÉS: Ya está en el paso 1 con preload -->
```

---

## 📊 Beneficios Esperados

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| FCP | 1.4s | 0.9-1.1s | 300-500ms ⚡ |
| LCP | 1.7s | 1.4-1.5s | 200-300ms |
| Render blocking | ~28KB CSS | ~3KB inline | 90% menos bloqueo |

---

## ⚠️ Consideraciones

### **Pros:**
- ✅ Hero renderiza inmediatamente
- ✅ Sin espera de descarga de CSS
- ✅ Mejor FCP y LCP
- ✅ Progressive enhancement

### **Contras:**
- ⚠️ HTML ~3KB más grande
- ⚠️ Duplicación de código (critical + full CSS)
- ⚠️ Mantenimiento: actualizar 2 lugares

### **Recomendación:**
Implementar si FCP > 1.5s en Lighthouse. Si ya está < 1.5s, el beneficio es marginal.

---

## 🛠️ Herramientas para Extraer Critical CSS

### **Opción 1: Critical (npm)**
```bash
npm install -g critical

critical index.html \
  --base ./ \
  --inline \
  --minify \
  --width 1300 \
  --height 900
```

### **Opción 2: Manual**
1. Chrome DevTools > Coverage
2. Cargar página
3. Copiar CSS usado en viewport inicial
4. Minificar

### **Opción 3: Online**
- https://www.sitelocity.com/critical-path-css-generator
- https://jonassebastianohlsson.com/criticalpathcssgenerator/

---

## 📝 Checklist de Implementación

- [ ] Extraer CSS crítico (~3-5KB)
- [ ] Minificar CSS crítico
- [ ] Inline en `<head>`
- [ ] Preload CSS completo
- [ ] Agregar fallback `<noscript>`
- [ ] Verificar que hero renderiza correctamente
- [ ] Medir FCP en Lighthouse
- [ ] Comparar antes/después

---

## 💡 Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Preconnects -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Critical CSS inline (3-5KB) -->
    <style>
        /* CSS crítico aquí */
    </style>
    
    <!-- Preload CSS completo -->
    <link rel="preload" 
          href="css/styles.min.css" 
          as="style" 
          onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="css/styles.min.css"></noscript>
    
    <!-- Resto del head -->
</head>
<body>
    <!-- Contenido -->
</body>
</html>
```

---

## 📈 Prioridad de Implementación

**Alta prioridad si:**
- FCP > 1.5s
- LCP > 2.5s
- PageSpeed Score < 85

**Baja prioridad si:**
- FCP < 1.2s
- LCP < 2.0s
- PageSpeed Score > 90

**Verificar con:**
```bash
lighthouse http://localhost:8080 --only-categories=performance
```

---

**Documento de referencia - Critical CSS**  
**Fecha:** 20/11/2025
