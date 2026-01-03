# Critical CSS - Grupo Musical La Célula

## CSS Critical para Above-the-Fold

Este CSS debe incluirse inline en el `<head>` para renderizado inmediato del hero section.

```css
/* Critical CSS - Above the Fold */
*{margin:0;padding:0;box-sizing:border-box}
body,html{height:100%;font-family:'Open Sans',Arial,sans-serif;background:#000;color:#fff;overflow-x:hidden}

/* Header */
.site-header{position:fixed;top:0;left:0;right:0;height:55px;background:rgba(0,0,0,.4);backdrop-filter:blur(10px);z-index:10000;display:flex;align-items:center;justify-content:center}
.nav-container{width:100%;max-width:980px;padding:0 20px;display:flex;justify-content:center;position:relative}
.nav-menu{display:flex;list-style:none;gap:40px;align-items:center}
.nav-link{color:#fff;text-decoration:none;font:normal normal bold 15px/1.4em 'Open Sans',sans-serif;padding:10px 15px;border-radius:5px;transition:all .3s ease;display:block}

/* Hero Section */
.hero-section{position:relative;height:100vh;width:100vw;margin:0;padding:0;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;background:url('../assets/gallery/background.webp') center/cover no-repeat,#000;background-attachment:fixed}
.hero-video-container{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;overflow:hidden}
.hero-background-video{position:absolute;top:50%;left:50%;min-width:100%;width:100vw;height:100vh;z-index:1;transform:translate(-50%,-50%);object-fit:cover;will-change:transform}
.hero-video-container .video-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:2;pointer-events:none}
.hero-content{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;max-width:800px;text-align:center}
.hero-logo{width:390px;height:220px;margin-bottom:20px;object-fit:contain}
.hero-title{font:normal normal normal 19px/1.4em 'Lobster',cursive;margin-bottom:30px;color:#fff}
.social-bar{display:flex;gap:10px;justify-content:center;margin-top:20px}
.social-icon{width:39px;height:39px;border-radius:50%;transition:transform .3s ease;filter:brightness(0) invert(1)}

/* Mobile Navigation */
.mobile-menu-toggle{display:none;flex-direction:column;background:transparent;border:none;cursor:pointer;padding:10px;position:absolute;right:20px;top:50%;transform:translateY(-50%);z-index:10001}
.mobile-menu-toggle span{width:25px;height:3px;background:#fff;margin:3px 0;transition:.3s;display:block}

@media (max-width:768px){
  .mobile-menu-toggle{display:flex}
  .nav-menu{position:absolute;top:100%;left:0;right:0;background:rgba(0,0,0,.95);backdrop-filter:blur(10px);flex-direction:column;padding:20px;opacity:0;visibility:hidden;max-height:0;overflow:hidden;transition:all .3s ease;z-index:9999}
  .nav-menu.active{opacity:1;visibility:visible;max-height:500px}
  .hero-logo{width:280px;height:158px}
  .hero-title{font-size:16px}
}

@media (max-width:480px){
  .hero-logo{width:240px;height:135px}
  .hero-background-video{width:100%;height:100%;object-fit:contain}
}
