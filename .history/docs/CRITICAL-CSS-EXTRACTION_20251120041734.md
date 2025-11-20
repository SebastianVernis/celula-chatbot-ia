# Critical CSS - Grupo Musical La Célula

## CSS Critical para Above-the-Fold

Este CSS debe incluirse inline en el `<head>` para renderizado inmediato del hero section.

```css
/* Critical CSS - Above the Fold */
*{margin:0;padding:0;box-sizing:border-box}
body,html{height:100%;font-family:'Open Sans',Arial,sans-serif;background:#000;color:#fff;overflow-x:hidden}

/* Header */
.site-header{position:fixed;top:0;left:0;right:0;height:55px;background:rgba(0,0,0,.4);backdrop-filter:blur(10px);z-index:10000;display:flex;align-items:center;justify-content:center}
