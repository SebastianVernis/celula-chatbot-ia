# ✅ Integración de Marketing - Configuración Completada

## 🎯 Cambios Realizados

He agregado los siguientes rewrites al archivo `vercel.json` del proyecto principal:

```json
{
  "source": "/bodas",
  "destination": "https://marketing-celula.vercel.app/bodas"
},
{
  "source": "/xv",
  "destination": "https://marketing-celula.vercel.app/xv"
},
{
  "source": "/privada",
  "destination": "https://marketing-celula.vercel.app/privada"
}
```

## 🚀 Próximos Pasos

### 1. Desplegar el proyecto principal

```bash
cd /home/sebastianvernis/celula-chatbot-ia
vercel --prod
```

### 2. Verificar que todo funciona

Una vez desplegado, verifica estas URLs:

- ✅ `https://grupomusicalcelula.com/bodas`
- ✅ `https://grupomusicalcelula.com/xv`
- ✅ `https://grupomusicalcelula.com/privada`

### 3. Verificar que las rutas existentes siguen funcionando

- ✅ `https://grupomusicalcelula.com/` (index)
- ✅ `https://grupomusicalcelula.com/blog`
- ✅ `https://grupomusicalcelula.com/cotizador`
- ✅ `https://grupomusicalcelula.com/testimonios`
- ✅ `https://grupomusicalcelula.com/post/0` (y otros posts)

## 📊 Cómo Funciona

```
Usuario visita: grupomusicalcelula.com/bodas
                        ↓
Vercel detecta el rewrite
                        ↓
Hace proxy a: marketing-celula.vercel.app/bodas
                        ↓
Usuario ve: Contenido de la página de bodas
URL visible: grupomusicalcelula.com/bodas ✨
```

**Importante:** El usuario NUNCA ve `marketing-celula.vercel.app` en su navegador. Todo aparece como si fuera del dominio principal.

## 🔧 Arquitectura de Microfrontends

```
┌─────────────────────────────────────────────────────────┐
│  grupomusicalcelula.com (Proyecto Principal)            │
│                                                          │
│  Rutas locales:                                         │
│  ├── /                    → index.html                  │
│  ├── /blog                → blog.html                   │
│  ├── /cotizador           → cotizador.html              │
│  ├── /testimonios         → testimonios.html            │
│  ├── /post/:id            → post/post-:id.html          │
│  └── /api/*               → Serverless functions        │
│                                                          │
│  Rutas proxy (Marketing):                               │
│  ├── /bodas      → marketing-celula.vercel.app/bodas    │
│  ├── /xv         → marketing-celula.vercel.app/xv       │
│  └── /privada    → marketing-celula.vercel.app/privada  │
└─────────────────────────────────────────────────────────┘
```

## ✅ Ventajas de esta Configuración

1. **Despliegues Independientes**
   - Puedes actualizar las páginas de marketing sin tocar el proyecto principal
   - Cada proyecto tiene su propio ciclo de desarrollo

2. **URLs Limpias**
   - Todo bajo el mismo dominio `grupomusicalcelula.com`
   - SEO optimizado (no hay subdominios)

3. **Gratis en Vercel**
   - Ambos proyectos entran en el plan Free
   - Sin costos adicionales

4. **Fácil Mantenimiento**
   - Código separado por responsabilidad
   - Más fácil de debuggear

## 🐛 Troubleshooting

### Problema: 404 en las rutas de marketing

**Solución:**
1. Verifica que `marketing-celula.vercel.app` esté desplegado y accesible
2. Prueba acceder directamente a `https://marketing-celula.vercel.app/bodas`
3. Si funciona directamente pero no a través del rewrite, espera unos minutos (propagación de DNS)

### Problema: Assets no cargan (CSS, imágenes)

**Causa:** Los assets del proyecto Marketing usan rutas relativas que no se resuelven correctamente.

**Solución:** Ya está configurado en el proyecto Marketing con rutas absolutas (`/assets/...`, `/css/...`, `/js/...`)

### Problema: Analytics duplicados

**Solución:** Cada proyecto tiene su propio ID de Analytics, así que no hay problema.

## 📝 Mantenimiento Futuro

### Para actualizar las páginas de marketing:

```bash
cd /home/sebastianvernis/MarketingCelula
# Haz tus cambios...
npm run build
vercel --prod
```

**No necesitas redesplegar el proyecto principal** - los cambios se reflejan automáticamente.

### Para actualizar el proyecto principal:

```bash
cd /home/sebastianvernis/celula-chatbot-ia
# Haz tus cambios...
npm run build
vercel --prod
```

## 🎉 ¡Listo!

La configuración está completa. Solo necesitas:

1. Desplegar el proyecto principal: `vercel --prod`
2. Verificar que las URLs funcionen
3. ¡Disfrutar de tu arquitectura de microfrontends!

---

**Fecha de configuración:** $(date)
**Proyecto Marketing:** https://marketing-celula.vercel.app
**Proyecto Principal:** https://grupomusicalcelula.com
