# AGENTS.md - Guide for AI Assistants

## Project Overview

**Grupo Musical Versátil La Célula** is a static website for a musical band in Mexico. The site includes:

- Marketing pages (home, services, gallery)
- Blog system
- Contact form with Resend API integration
- AI Chatbot powered by Google Gemini
- Quote request system
- Various performance optimizations

The site is deployed on Cloudflare Pages, which handles both the static site hosting and serverless functions.

## Repository Structure

```
celula-site/
├── index.html, blog.html, cotizador.html, contacto.html  # Main pages
├── post/                 # Blog post files (post-0.html through post-32.html)
├── js/                   # JavaScript files (both .js and minified .min.js versions)
├── css/                  # CSS stylesheets
├── assets/               # Images, videos, icons, etc.
├── functions/            # Cloudflare Pages Functions (serverless)
├── scripts/              # Shell scripts for optimization and maintenance
├── docs/                 # Documentation files
└── public/forms/         # Form handling scripts
```

## Essential Commands

### Development

```bash
# Install dependencies
npm install

# Run development server with Cloudflare Functions support
npm run dev  # Starts server at http://localhost:8788
```

### Build & Optimization

```bash
# Install Function dependencies
npm run build  # Runs: cd functions && npm install && cd ..

# Minify JS and CSS files
npm run minify  # Runs: bash scripts/minify-all.sh

# Optimize images
npm run optimize:images  # Runs: bash scripts/convert-images-to-webp.sh

# Optimize videos
npm run optimize:video  # Runs: bash scripts/optimize-video.sh
```

### Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy  # Runs: wrangler pages deploy .
```

## Code Conventions

### JavaScript

- Each JS file has a corresponding minified version (e.g., `chatbot.js` and `chatbot.min.js`)
- Class-based architecture for major components
- Event delegation pattern for UI interactions
- ES6+ syntax (uses modern JavaScript features)
- Inline documentation with JSDoc-style comments

### HTML

- HTML5 semantic elements (`<header>`, `<main>`, `<footer>`, etc.)
- Responsive design with mobile-first approach
- Performance optimizations (lazy loading, deferred scripts)
- Schema.org structured data for SEO

### CSS

- BEM-like naming convention for CSS classes
- Mobile-first responsive design using media queries
- Critical CSS for above-the-fold content
- Optimization for Core Web Vitals

## Key Subsystems

### 1. AI Chatbot

The chatbot functionality is implemented in `js/chatbot.js` and `functions/api/chatbot.js`. It uses:
- Google Gemini API (requires API key)
- Stateful conversation memory
- Lead capture form
- Email notifications via Resend API

### 2. Email System

Email functionality is handled by:
- `functions/api/send-email.js` - Main API endpoint
- Resend.com API integration
- Form validation and rate limiting
- Security measures against spam

### 3. Blog System

The blog system consists of:
- Individual HTML files in `/post/` directory
- JSON data store in `assets/data/blog-posts.json`
- Pagination handled by `js/blog-pagination.js`
- Image optimization workflows in `scripts/`

### 4. Media Gallery

The gallery system includes:
- Dynamic image loading via `js/gallery-dynamic.js`
- YouTube video carousel via `js/youtube-carousel.js`
- Optimized WebP images in `assets/gallery/`
- Responsive sizing based on device

## Cloudflare Pages Configuration

The site is deployed on Cloudflare Pages with the following configuration:

- **Build command**: `npm run build`
- **Build output directory**: `.` (current directory)
- **Node version**: 18+
- **Functions directory**: `functions/`

### Environment Variables Required

- `RESEND_API_KEY`: API key for Resend (email service)
- `CONTACT_EMAIL`: Target email for form submissions
- `GEMINI_API_KEY`: API key for Google Gemini (chatbot)

## Common Tasks

### Adding a New Blog Post

1. Create a new file in `/post/` directory following the naming pattern (`post-XX.html`)
2. Add entry to `assets/data/blog-posts.json`
3. Create optimized images using `scripts/generate-blog-images.sh`
4. Update any references if needed

### Updating JS/CSS

1. Make changes to the source files (e.g., `js/chatbot.js` or `css/styles.css`)
2. Run `npm run minify` to generate minified versions
3. Verify changes work correctly using `npm run dev`

### Deploying Updates

1. Commit your changes to git
2. Run `npm run deploy` to deploy to Cloudflare Pages
3. Verify the deployment in Cloudflare Pages dashboard

## Performance Optimization

The site implements various performance optimizations:

- WebP image format for smaller file sizes
- Responsive images with multiple resolution variants
- Video optimizations (multiple qualities, WebM format)
- Critical CSS inlining for faster first contentful paint
- Deferred loading of non-critical JavaScript
- Font optimizations (self-hosting, subset loading)

## Troubleshooting

### Email Not Working

1. Check Resend API key in environment variables
2. Verify `CONTACT_EMAIL` is set correctly
3. Look for errors in Function logs in Cloudflare Dashboard
4. Check rate limiting restrictions

### Chatbot Issues

1. Verify Gemini API key is set correctly
2. Check for JS console errors
3. Review chatbot initialization in `js/chatbot.js`
4. Verify chatbot API endpoint is working

### CSS/JS Not Updating

1. Make sure you've minified the files after changes
2. Verify the HTML is referencing the correct files
3. Clear browser cache and CDN cache if needed

## Documentation Resources

Refer to these files for more detailed documentation:

- `docs/DEPLOY.md`: Detailed deployment guide
- `docs/ESTRUCTURA-PROYECTO.md`: Project structure documentation
- `docs/REPORTE-FINAL-OPTIMIZACIONES.md`: Performance optimization report
- `CLOUDFLARE_PAGES_SETUP.md`: Cloudflare Pages setup details

## Scripts Reference

The `/scripts/` directory contains various bash scripts for maintenance:

- `minify-all.sh`: Minifies all JS and CSS files
- `convert-images-to-webp.sh`: Converts images to WebP format
- `optimize-video.sh`: Optimizes video files
- `download-fonts.sh`: Downloads and optimizes fonts for self-hosting
- `generate-blog-images.sh`: Generates optimized images for blog posts
- `update-minified-references.sh`: Updates HTML to reference minified files

## Testing Strategy

- Manual testing for UI/UX flow
- Local testing with Wrangler CLI for Cloudflare Functions
- Lighthouse audits for performance metrics
- Mobile responsiveness testing across devices
- Cross-browser compatibility testing

## Security Considerations

- Form validation to prevent abuse
- Rate limiting on API endpoints
- Input sanitization to prevent XSS
- Content Security Policy implementation
- HTTPS-only with modern TLS

---

This document is intended to help AI assistants understand and work with the Grupo Musical Versátil La Célula website codebase. Always verify configurations and keep this document updated as the project evolves.