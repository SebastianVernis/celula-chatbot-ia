# AGENTS.md - Guide for AI Assistants

## Project Overview

**Grupo Musical Versátil La Célula** is a static website for a professional musical band in Mexico. The site includes:

- Marketing pages (home, services, gallery)
- Blog system with pagination
- Contact form with Resend API integration
- AI Chatbot powered by Google Gemini
- Quote request system (cotizador)
- Various performance optimizations (Core Web Vitals)
- PWA (Progressive Web App) functionality

**Primary deployment platform:** AWS Amplify  
**Legacy platform:** Cloudflare Pages (still supported)

## Essential Commands

### Development

```bash
# Install dependencies (root)
npm install

# Install function dependencies
cd functions && npm install && cd ..

# Run development server (Node.js/Express)
npm run dev
# Server runs on http://localhost:3000
# Dev server proxies API endpoints for local testing

# Legacy development server (Wrangler)
npm run dev:legacy
```

### Build & Validation

```bash
# Full build for production (runs validation first via prebuild hook)
npm run build

# Build optimized for AWS Amplify
npm run build:amplify

# Install function dependencies (runs as part of build)
npm run build:functions

# Validate HTML structure and asset references
npm run validate

# Lint JavaScript with ESLint
npm run lint
```

### Deployment

```bash
# Deploy to AWS Amplify (recommended)
npm run deploy:amplify
# or
npm run deploy

# Deploy to Cloudflare Pages (legacy)
npm run deploy:legacy
```

Deployment is automated via Git:
- **AWS Amplify**: Pushes to `main` branch trigger automatic builds
- **Cloudflare Pages**: Legacy deployment method

### Testing & Optimization

```bash
# Run all tests
npm test

# Test video background paths
npm run test:video-paths

# Validate HTML structure
npm run validate:html
```

## Repository Structure

```
deploymentcelula/
├── index.html              # Main homepage (root level)
├── blog.html               # Blog page
├── cotizador.html          # Quote request page
├── offline.html            # PWA offline page
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── robots.txt              # SEO robots file
├── sitemap.xml             # SEO sitemap
├── _headers                # Custom HTTP headers
│
├── src/                    # Source files (pre-build)
│   ├── html/               # HTML source files
│   ├── css/                # CSS source files
│   ├── js/                 # JavaScript source files
│   └── assets/             # Asset source files
│
├── dist/                   # Built files (generated, gitignored)
│   ├── html/               # Processed HTML
│   ├── css/                # Minified CSS
│   ├── js/                 # Minified JS
│   └── assets/             # Optimized assets
│
├── js/                     # Root-level JavaScript (production)
│   ├── chatbot.js
│   ├── chatbot.min.js
│   ├── form-handler.js
│   ├── form-handler.min.js
│   ├── navigation.js
│   ├── site-functionality.js
│   ├── video-background.js
│   ├── gallery-dynamic.js
│   ├── youtube-carousel.js
│   ├── blog-pagination.js
│   └── optimizations.js
│
├── css/                    # Root-level CSS (production)
│   ├── styles.css
│   └── styles.min.css
│
├── assets/                 # Static assets
│   ├── images/             # Image files
│   ├── video/              # Video files
│   ├── logo/               # Logo files
│   ├── fonts/              # Self-hosted fonts
│   ├── icons/              # Icon files
│   ├── gallery/            # Gallery images
│   ├── equipo/             # Team photos
│   └── data/               # JSON data files
│
├── post/                   # Blog post HTML files
│   ├── post-0.html
│   ├── post-1.html
│   └── ... (up to post-32.html)
│
├── amplify/                # AWS Lambda functions (NEW)
│   └── functions/
│       ├── chatbot/
│       │   ├── handler.js  # Lambda handler for chatbot
│       │   └── package.json
│       └── send-email/
│           ├── handler.js  # Lambda handler for email
│           └── package.json
│
├── functions/              # Cloudflare Pages functions (legacy)
│   ├── api/
│   │   ├── send-email.js   # Email API endpoint
│   │   └── chatbot.js      # Chatbot API endpoint
│   ├── package.json        # Function dependencies
│   └── .wranglerignore
│
├── docs/                   # Documentation
│   ├── AGENTS.md           # This file
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── AMPLIFY_DEPLOYMENT.md
│   ├── CONFIGURACION_SECRETOS_AMPLIFY.md
│   ├── API-EMAIL-DOCUMENTATION.md
│   ├── ESTRUCTURA-DIRECTORIOS.md
│   └── ... (30+ documentation files)
│
├── scripts/                # Shell scripts (currently empty)
├── widgets/                # Third-party widgets
│   └── google-reviews/
│
├── archived/               # Archived old files
├── .wrangler/              # Wrangler cache (gitignored)
│
├── build.js                # Build script (Node.js)
├── dev.js                  # Development server (Node.js)
├── validate.js             # Validation script
├── amplify.yml             # AWS Amplify build config
├── wrangler.toml           # Cloudflare Pages config (legacy)
├── buildspec.yml           # AWS CodeBuild config
├── eslint.config.js        # ESLint configuration
├── package.json            # Project dependencies
└── .gitignore              # Git ignore rules
```

## Code Organization

### File Structure Pattern

**Dual-file pattern for JS/CSS:**
- Source files: `filename.js` / `filename.css`
- Minified files: `filename.min.js` / `filename.min.css`
- Both versions exist in production for development flexibility
- HTML files reference `.min.js` and `.min.css` versions

**Build process:**
- Source files live in `src/` directory
- Build script processes and minifies to `dist/`
- Root-level files (`js/`, `css/`) are production files
- Never edit minified files directly

### JavaScript Architecture

All major components are **class-based**:

```javascript
// Pattern used throughout codebase
class ComponentName {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadState();
    }
    
    setupEventListeners() {
        // Event delegation pattern
    }
}
```

**Key JavaScript files:**

1. **`chatbot.js`** (js/chatbot.js):
   - `CelulaChatbotManager` class
   - Manages AI chat interactions with Google Gemini
   - Handles lead capture forms
   - Uses `sessionStorage` for conversation persistence
   - Sends email notifications via `/api/send-email`

2. **`form-handler.js`** (js/form-handler.js):
   - Handles cotizador form submissions
   - Validates form data (email, phone, date)
   - Sends to `/api/send-email` endpoint
   - Redirects to WhatsApp after submission

3. **`navigation.js`**:
   - Mobile menu toggle
   - Active nav link highlighting
   - Scroll behavior

4. **`video-background.js`**:
   - `PersistentVideoBackground` class
   - Manages hero video background across pages
   - Caches video state in `sessionStorage`

5. **`site-functionality.js`**:
   - General site interactions
   - Scroll effects
   - Lazy loading

6. **`gallery-dynamic.js`**:
   - Dynamic gallery loading
   - Image optimization

7. **`youtube-carousel.js`**:
   - YouTube video carousel
   - Lazy loading for embeds

8. **`blog-pagination.js`**:
   - Blog post pagination
   - Loads from `assets/data/blog-posts.json`

9. **`optimizations.js`**:
   - Performance optimizations
   - Lazy loading helpers

### HTML Structure

**HTML files exist at TWO levels:**
1. **Root level:** `index.html`, `blog.html`, `cotizador.html`, `offline.html`
2. **src/html/:** Source HTML files (pre-build)

**Important HTML patterns:**

```html
<!-- All pages include critical CSS inline -->
<style>
    /* Critical above-the-fold CSS */
</style>

<!-- Self-hosted fonts (no external requests) -->
<style>
    @font-face { ... }
</style>

<!-- Async CSS loading -->
<link rel="preload" href="css/styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/styles.min.css"></noscript>

<!-- Deferred script loading -->
<script src="js/script-name.min.js" defer></script>
```

**HTML Validation:**
- DOCTYPE required: `<!DOCTYPE html>`
- Proper semantic structure
- Assets referenced must exist
- Run `npm run validate` before committing

### CSS Structure

**Main stylesheet:** `css/styles.css` (minified to `styles.min.css`)

**CSS organization:**
- Mobile-first responsive design
- BEM-like naming convention
- Extensive use of CSS custom properties (variables)
- Critical CSS extracted and inlined in HTML `<head>`

**Media queries:**
```css
/* Mobile: default */
/* Tablet: min-width: 768px */
/* Desktop: min-width: 1024px */
```

**Key CSS files:**
- `chatbot.css` / `chatbot.min.css` - Chatbot styling (also in js/ folder)

## Serverless Functions (API Endpoints)

### Architecture

Functions use **Cloudflare Pages Functions** API (compatible with AWS Amplify):

```javascript
export async function onRequest(context) {
    // context.request - Incoming request
    // context.env - Environment variables
    // Return Response object
}
```

### Email API (`functions/api/send-email.js`)

**Endpoint:** `POST /api/send-email`

**Purpose:** Sends emails via Resend API

**Request body types:**
1. `type: "chatbot_summary"` - Full chatbot conversation summary
2. `type: "chatbot_lead"` - Simple lead capture
3. `type: "form_cotizador"` - Quote request form

**Environment variables required:**
- `RESEND_API_KEY` - Resend API key
- `CONTACT_EMAIL` - Destination email (default: contacto@grupomusicalcelula.pages.dev)

**Features:**
- CORS handling for OPTIONS preflight
- Rate limiting with KV storage (optional)
- Detailed HTML email templates
- Error logging with detailed context
- Package recommendation logic based on conversation keywords

**Email templates:**
- `createChatbotSummaryEmail()` - Rich HTML with conversation history
- `createCotizadorEmail()` - Quote request details
- `createLeadCaptureEmail()` - Simple lead info

**Testing locally:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"5555555555"}}'
```

### Chatbot API (`functions/api/chatbot.js`)

**Endpoint:** `POST /api/chatbot`

**Purpose:** Proxies requests to Google Gemini API

**Request body:**
```json
{
  "history": [
    {
      "role": "user",
      "parts": [{"text": "mensaje del usuario"}]
    },
    {
      "role": "model",
      "parts": [{"text": "respuesta del bot"}]
    }
  ]
}
```

**Environment variables required:**
- `GEMINI_API_KEY` - Google Gemini API key

**Gemini configuration:**
- Model: `gemini-flash-lite-latest`
- Temperature: 0.7
- Max tokens: 800
- Safety settings: BLOCK_MEDIUM_AND_ABOVE

**Response format:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {"text": "respuesta del bot"}
        ]
      }
    }
  ]
}
```

**Error handling:**
- Returns user-friendly error messages
- Includes WhatsApp fallback contact info
- Logs detailed error context

## Build System

### Build Script (`build.js`)

**Process:**

1. Clean/backup `dist/` directory
2. Create directory structure
3. Copy assets from `src/assets/` to `dist/assets/`
4. Process CSS files:
   - Remove comments
   - Minify (basic whitespace removal)
   - Output to `dist/css/*.min.css`
5. Process JS files:
   - Remove comments (single-line `//` and multi-line `/* */`)
   - Minify (basic whitespace removal)
   - Output to `dist/js/*.min.js`
6. Process HTML files:
   - Update paths to point to `dist/` subdirectories
   - Update references to `.min.css` and `.min.js`
   - Output to `dist/html/`
7. Copy blog posts (`src/html/post/*.html` → `dist/html/post/`)
8. Copy root files (robots.txt, sitemap.xml, manifest.json, _headers, sw.js)
9. Copy main HTML files to dist root

**Note:** Build script uses basic minification. For production, consider using proper minifiers.

**Run build:**
```bash
npm run build
```

### Development Server (`dev.js`)

**Express server** with:
- Static file serving from `src/` directories
- API endpoint proxies for local development
- CORS enabled
- Routes for all pages (index, blog, cotizador, posts)

**API proxies:**
- `/api/send-email` - Logs request and returns mock success
- `/api/chatbot` - Proxies to real Gemini API (requires `GEMINI_API_KEY` env var)

**Port:** 3000 (configurable via `PORT` env var)

**Routes:**
- `/` → `src/html/index.html`
- `/blog` → `src/html/blog.html`
- `/cotizador` → `src/html/cotizador.html`
- `/post/:id` → `src/html/post/post-{id}.html`
- Static assets: `/assets/*`, `/css/*`, `/js/*`

### Validation Script (`validate.js`)

**Checks:**

1. **HTML files** (`src/html/*.html`):
   - Missing CSS references
   - Missing JS references
   - Missing DOCTYPE
   - Missing `<html>` tag

2. **CSS files** (`src/css/*.css`):
   - Missing assets referenced in `url()`

3. **JS files** (`src/js/*.js`):
   - Mismatched braces (basic syntax check)

**Output:**
- Errors: Critical issues (exit code 1)
- Warnings: Non-critical issues (exit code 0)

**Run validation:**
```bash
npm run validate
```

**Validation runs automatically before build** via `prebuild` hook.

## Deployment

### AWS Amplify (Primary/Recommended)

**Configuration file:** `amplify.yml`

**Build process:**
```yaml
preBuild:
  - npm ci
build:
  - npm run build
postBuild:
  - ls -la dist/
artifacts:
  baseDirectory: dist
  files: '**/*'
```

**Environment Variables (REQUIRED):**

Configure in AWS Amplify Console → App settings → Environment variables:

1. **`RESEND_API_KEY`** (mark as Secret)
   - Get from: https://resend.com/api-keys
   - Used by: Email API

2. **`GEMINI_API_KEY`** (mark as Secret)
   - Get from: https://makersuite.google.com/app/apikey
   - Used by: Chatbot API

3. **`CONTACT_EMAIL`**
   - Destination email for form submissions
   - Default: contacto@grupomusicalcelula.pages.dev

**Custom headers** (defined in amplify.yml):
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Cache-Control for assets (1 year for immutable assets)
- Cache-Control for HTML (1 hour)

**Redirects:**
- `/blog` → `/blog.html` (301)
- `/cotizador` → `/cotizador.html` (301)

**Deployment trigger:**
- Push to `main` branch
- Automatic build and deploy
- Preview environments for PRs

**Node version:** 18+

### Cloudflare Pages (Legacy)

**Configuration file:** `wrangler.toml`

**Build command:** `npm run build`  
**Build output:** `.` (root directory)

**Environment variables:** Set in Cloudflare Dashboard → Settings → Environment Variables

**Functions:** Located in `functions/api/`

**Deployment:** Via Wrangler CLI or Git integration

## Code Conventions

### JavaScript

**Style:**
- ES6+ syntax (modules, classes, arrow functions)
- 4-space indentation (enforced by ESLint)
- Single quotes for strings
- Semicolons required
- `const` preferred over `let`, never `var`

**ESLint configuration** (`eslint.config.js`):
- ECMAScript 2021
- Module type
- Browser and Node.js globals defined
- Strict rules: `no-undef` (error), `no-unused-vars` (warn)
- Style rules: 4-space indent, single quotes, semicolons required

**Naming:**
- Classes: PascalCase (`CelulaChatbotManager`)
- Functions: camelCase (`setupEventListeners`)
- Constants: UPPER_SNAKE_CASE (rare, mostly use const)
- Private methods: prefix with `_` (convention, not enforced)

**Comments:**
- JSDoc-style for classes and public methods
- Inline comments for complex logic only
- NO comments that just restate the code

**Event handling:**
- Event delegation pattern preferred
- Use `addEventListener`, never inline handlers
- Clean up listeners if component is destroyed

**State management:**
- `sessionStorage` for temporary state (chatbot, video)
- `localStorage` for persistent state (none currently)
- State saved/loaded in init lifecycle

**API calls:**
- Use `fetch()` API
- Always handle errors with try/catch
- Show user-friendly error messages
- Log detailed errors to console

### HTML

**Semantic HTML5:**
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Proper heading hierarchy (h1 → h2 → h3)
- `<button>` for actions, `<a>` for navigation

**Accessibility:**
- `alt` text on all images
- `aria-label` on icon buttons
- Semantic form labels
- Keyboard navigation support

**Performance optimizations:**
- Critical CSS inlined in `<head>`
- Async/deferred script loading
- Lazy loading for images and iframes
- Preload for critical resources
- Preconnect for external domains

**SEO:**
- Meta descriptions on all pages
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Structured data (Schema.org)
- Sitemap and robots.txt

### CSS

**Naming convention:** BEM-like
```css
.component-name { }
.component-name__element { }
.component-name--modifier { }
```

**Organization:**
```css
/* 1. Base/Reset */
/* 2. Typography */
/* 3. Layout */
/* 4. Components */
/* 5. Utilities */
/* 6. Media Queries */
```

**Mobile-first:**
```css
/* Mobile (default) */
.element { }

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

**Colors:**
- Primary: #000 (black)
- Accent: #3D9BE9 (blue)
- Background: #000
- Text: #fff
- Gray scale for secondary elements

**Fonts:**
- Primary: 'Open Sans' (self-hosted)
- Heading: 'Lobster' (self-hosted)
- Secondary: 'Raleway' (self-hosted)

## Testing

### Manual Testing Checklist

**Before deployment:**

1. Run validation: `npm run validate`
2. Run linter: `npm run lint`
3. Test locally: `npm run dev`
4. Test all pages:
   - Homepage (`/`)
   - Blog (`/blog.html`)
   - Cotizador (`/cotizador.html`)
   - Sample blog post (`/post/post-1.html`)
5. Test chatbot:
   - Open chatbot
   - Fill lead form
   - Send messages
   - Check email sent
6. Test cotizador form:
   - Fill all fields
   - Submit form
   - Check email sent
   - Check WhatsApp redirect
7. Test mobile menu
8. Test video background (should persist across pages)

**Cross-browser testing:**
- Chrome (primary)
- Firefox
- Safari
- Edge
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### API Testing

**Email API:**
```bash
# Test chatbot lead capture
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"chatbot_lead","leadData":{"name":"Test User","email":"test@example.com","phone":"5555555555","eventType":"Boda"}}'

# Test cotizador form
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"form_cotizador","formData":{"nombre":"Test","email":"test@test.com","telefono":"5555555555","tipoEvento":"Boda","fechaEvento":"2024-12-31","lugar":"CDMX","numeroInvitados":"100","paquete":"Event Plus","mensaje":"Test"}}'
```

**Chatbot API:**
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","parts":[{"text":"Hola"}]}]}'
```

## Common Gotchas & Important Notes

### 1. Dual File System

**CRITICAL:** The codebase has files at TWO levels:
- **Root level** (`/js/`, `/css/`, `index.html`): Production files
- **`src/` level** (`/src/js/`, `/src/css/`, `/src/html/`): Source files

**When editing:**
- Edit source files in `src/`
- Run `npm run build` to regenerate production files
- Never manually edit minified `.min.js` or `.min.css` files

### 2. Environment Variables Are Critical

**Without proper environment variables, the site will NOT work fully:**
- Chatbot will fail without `GEMINI_API_KEY`
- Emails won't send without `RESEND_API_KEY`

**Always configure in:**
- AWS Amplify Console (production)
- `.env` file (local development)

### 3. Chatbot State Management

**Uses `sessionStorage`, not `localStorage`:**
- Conversation persists during browser session only
- Closes tab = conversation lost
- This is intentional to avoid stale conversations

**Lead form data:**
- Pre-filled if user already provided info
- Stored in `celulaChatbotState` key

### 4. Video Background Persistence

**Video state cached across page navigation:**
- Uses `sessionStorage` for current playback position
- Video continues from same position on page changes
- Key: `videoBackgroundState`

### 5. Build System Limitations

**Current build script is BASIC:**
- Simple regex-based minification
- No bundling
- No tree-shaking
- No transpilation (assumes modern browsers)

**For better optimization, consider:**
- Terser for JS minification
- cssnano for CSS minification
- PostCSS for CSS processing
- Webpack or Rollup for bundling

### 6. API Endpoint Paths

**Different in development vs production:**

**Development (`npm run dev`):**
```javascript
fetch('/api/send-email', { ... })  // Proxied by Express
```

**Production (Amplify/Cloudflare):**
```javascript
fetch('/api/send-email', { ... })  // Handled by serverless functions
```

**Path must be `/api/` prefix** - hardcoded in function structure.

### 7. Form Submissions Flow

**Cotizador form:**
1. Validate form data
2. Send to `/api/send-email`
3. Show notification
4. Redirect to WhatsApp (always, even if email succeeds)
5. Reset form

**Chatbot form:**
1. Capture lead data
2. Continue conversation
3. Send summary email when conversation ends
4. Email includes full conversation history

### 8. Blog Post Numbering

**Blog posts are numbered sequentially:**
- `post-0.html`, `post-1.html`, ... `post-32.html`
- Gaps in numbering are OK (some posts deleted)
- Metadata in `assets/data/blog-posts.json` (if exists)

**To add new blog post:**
1. Create `post/post-{N}.html`
2. Update `assets/data/blog-posts.json` (if exists)
3. Generate images with scripts (if needed)

### 9. Git Workflow

**Branching:**
- `main` branch: Production (triggers Amplify deployment)
- Feature branches: Use descriptive names
- PRs: Create for any changes

**Commit messages:**
- Conventional Commits style preferred
- Examples:
  - `feat(chatbot): add lead capture form`
  - `fix(email): correct template formatting`
  - `docs: update AGENTS.md`
  - `chore: update dependencies`

### 10. Assets Organization

**Asset paths are CRITICAL:**
- All assets in `assets/` directory
- Subdirectories: `images/`, `video/`, `fonts/`, `logo/`, etc.
- Reference in HTML/CSS as: `assets/images/file.webp`
- Validation script checks for missing assets

**Image formats:**
- Prefer WebP for all images
- Provide fallbacks for older browsers if needed
- Use responsive images with `srcset`

**Font files:**
- Self-hosted in `assets/fonts/`
- WOFF2 format only (modern browser support)
- Font-display: swap (for performance)

### 11. PWA Functionality

**Service Worker:** `sw.js` in root

**Manifest:** `manifest.json` in root

**Offline page:** `offline.html`

**Features:**
- Cache static assets
- Offline fallback page
- Install prompt (optional)

**Testing PWA:**
- Chrome DevTools → Application → Service Workers
- Test offline mode
- Test installation

### 12. Critical CSS

**Critical CSS is inlined in HTML `<head>`:**
- Above-the-fold styles only
- Extracted manually (no automated extraction currently)
- Improves First Contentful Paint (FCP)

**Full CSS loaded asynchronously:**
```html
<link rel="preload" href="css/styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### 13. SEO Configuration

**Sitemap:** `sitemap.xml` - Update when adding pages

**Robots.txt:** `robots.txt` - Standard configuration

**Structured data:** Embedded in HTML (Schema.org)

**Meta tags:** Each page has unique title, description, OG tags

### 14. Performance Targets

**Core Web Vitals goals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Strategies:**
- Lazy loading images
- Deferred/async scripts
- Critical CSS inline
- Self-hosted fonts
- Optimized images (WebP)
- Video optimization
- Minified assets

### 15. CORS Handling

**Functions handle CORS:**
```javascript
// Preflight OPTIONS request
if (context.request.method === "OPTIONS") {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 204
    });
}
```

**All API responses include CORS headers.**

## Troubleshooting

### Build Failures

**Check:**
1. Run `npm run validate` - look for errors
2. Check for missing files referenced in HTML/CSS
3. Verify all dependencies installed (`npm install`)
4. Check Node version (must be 18+)
5. Review build logs in Amplify Console

**Common causes:**
- Missing DOCTYPE in HTML
- Broken asset references
- Syntax errors in JS/CSS
- Missing dependencies

### Email Not Working

**Check:**
1. Environment variables set correctly:
   - `RESEND_API_KEY` configured
   - `CONTACT_EMAIL` configured
2. Check Amplify Function logs (Monitoring → Logs)
3. Verify Resend API key is valid
4. Check Resend dashboard for delivery status
5. Test with curl (see API Testing section)

**Common causes:**
- Missing API key
- Invalid API key
- Email address not verified in Resend
- Rate limiting triggered

### Chatbot Not Working

**Check:**
1. `GEMINI_API_KEY` set correctly
2. Browser console for JavaScript errors
3. Network tab for API call status
4. Amplify Function logs
5. Gemini API quota/limits

**Common causes:**
- Missing API key
- Invalid API key
- Gemini API quota exceeded
- CORS issues
- JavaScript errors preventing initialization

### Local Development Issues

**Server won't start:**
- Check port 3000 not already in use
- Run `npm install` to ensure dependencies
- Check Node version (must be 18+)

**APIs not working locally:**
- Check `.env` file exists with API keys
- Verify dev.js loads environment variables
- Check console for errors

**Assets not loading:**
- Ensure files exist in `src/` directories
- Check file paths in HTML
- Verify Express static routes in dev.js

### Video Background Not Working

**Check:**
1. Video file exists: `assets/video/background.webm` (or .mp4)
2. Browser console for errors
3. Video format supported by browser
4. `video-background.js` loaded correctly
5. Check sessionStorage for cached state

**Common causes:**
- Missing video file
- Incorrect video path
- Browser doesn't support WebM
- JavaScript not loaded/initialized

### Form Submission Issues

**Check:**
1. Network tab for API call
2. Console for validation errors
3. API response status and body
4. Environment variables configured
5. CORS headers present

**Common causes:**
- Invalid email format
- Invalid phone number (must be 10 digits)
- Past event date
- Missing required fields
- API endpoint not available

## Performance Optimization Checklist

**Already implemented:**
- ✅ WebP images
- ✅ Responsive images with srcset
- ✅ Lazy loading (images, iframes)
- ✅ Minified CSS/JS
- ✅ Self-hosted fonts
- ✅ Critical CSS inline
- ✅ Async CSS loading
- ✅ Deferred script loading
- ✅ Video optimization
- ✅ Asset preloading
- ✅ Preconnect to external domains
- ✅ Service Worker caching
- ✅ HTTP/2 Server Push headers

**Future improvements:**
- Modern build tool (Webpack/Rollup/Vite)
- Better minification (Terser, cssnano)
- Bundle splitting
- Tree-shaking
- Image CDN
- Further video compression
- HTTP/3 support

## Security Considerations

**Already implemented:**
- ✅ HTTPS only
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Input validation (email, phone, dates)
- ✅ Rate limiting (optional with KV)
- ✅ Environment variables for secrets
- ✅ No credentials in code
- ✅ CORS properly configured
- ✅ Gemini API safety settings

**Best practices:**
- Never commit `.env` files
- Mark sensitive variables as Secret in Amplify
- Sanitize user input before display
- Validate all form inputs
- Use HTTPS for all external requests

## Documentation

**Comprehensive docs in `docs/` folder:**

### Deployment
- `DEPLOYMENT.md` - Main deployment guide (AWS Amplify)
- `AMPLIFY_DEPLOYMENT.md` - Detailed Amplify setup (legacy)
- `CLOUDFLARE_PAGES_SETUP.md` - Cloudflare setup (legacy)
- `CONFIGURACION_SECRETOS_AMPLIFY.md` - Environment variables setup
- `SECRETS_MIGRATION.md` - Migrating secrets between platforms

### Development
- `ESTRUCTURA-DIRECTORIOS.md` - Directory structure details
- `ESTRUCTURA-PROYECTO.md` - Technical project structure
- `API-EMAIL-DOCUMENTATION.md` - Email API documentation
- `INDICE-DOCUMENTACION.md` - Documentation index

### Features
- `SOLUCION_CHATBOT.md` - Chatbot implementation details
- `GENERACION-IMAGENES-BLOG.md` - Blog image generation
- `INDICE-ARTICULOS-BLOG.md` - Blog article index
- `SERVICIOS-GRUPO-CELULA.md` - Band services description

### Optimization
- `REPORTE-FINAL-OPTIMIZACIONES.md` - Final optimization report
- `OPTIMIZACIONES-COMPLETADAS-FINAL.md` - Completed optimizations
- `OPTIMIZACIONES-FINALES-IMPLEMENTACION.md` - Implementation details
- `LIGHTHOUSE-AUDIT-RESULTADOS.md` - Lighthouse audit results
- `CRITICAL-CSS-IMPLEMENTATION.md` - Critical CSS guide
- `SELF-HOST-FONTS-GUIDE.md` - Font self-hosting guide

### Maintenance
- `MANTENIMIENTO.md` - Maintenance guide
- `ORGANIZACION-COMPLETADA.md` - Organization notes
- `FIXES-Y-OPTIMIZACIONES-COMPLETADAS.md` - Fixes completed

## Quick Reference

### Most Used Commands

```bash
# Development
npm run dev                    # Start dev server

# Build
npm run build                  # Build for production
npm run validate               # Validate project

# Deploy
git push origin main           # Triggers Amplify deployment

# Lint
npm run lint                   # ESLint check
```

### Most Edited Files

```
src/html/index.html            # Homepage
src/html/blog.html             # Blog page
src/html/cotizador.html        # Quote page
src/css/styles.css             # Main stylesheet
src/js/chatbot.js              # Chatbot logic
src/js/form-handler.js         # Form handling
functions/api/send-email.js    # Email API
functions/api/chatbot.js       # Chatbot API
```

### Key URLs (Production)

```
https://grupomusicalcelula.pages.dev/          # Homepage
https://grupomusicalcelula.pages.dev/blog.html # Blog
https://grupomusicalcelula.pages.dev/cotizador.html # Cotizador
```

### Key URLs (Development)

```
http://localhost:3000/          # Homepage
http://localhost:3000/blog.html # Blog
http://localhost:3000/cotizador.html # Cotizador
```

### Environment Variables Summary

```
RESEND_API_KEY=re_xxxxx          # Email API key
GEMINI_API_KEY=AIzaSyxxxxx       # Chatbot API key
CONTACT_EMAIL=email@example.com  # Destination email
```

---

## Final Notes for AI Assistants

1. **Always validate before committing:** Run `npm run validate` and `npm run lint`

2. **Test locally first:** Use `npm run dev` to test changes before deploying

3. **Respect the dual-file system:** Edit source files in `src/`, then build

4. **Check environment variables:** Many issues are due to missing API keys

5. **Maintain existing patterns:** Follow the established class-based architecture

6. **Update documentation:** If you make significant changes, update relevant docs

7. **Test cross-browser:** Don't assume Chrome behavior is universal

8. **Consider mobile-first:** Most users access via mobile devices

9. **Optimize for performance:** Core Web Vitals are critical for SEO

10. **Security first:** Never commit secrets, always validate input

**This is a production site for a real business. Changes should be tested thoroughly.**

---

**Last updated:** 2024-11-29  
**Project version:** 2.0.0  
**Maintained by:** Grupo Musical Versátil La Célula
