# AGENTS.md - Guide for AI Assistants

## Project Overview

**Grupo Musical Versátil La Célula** is a static website for a musical band in Mexico. The site includes:

- Marketing pages (home, services, gallery)
- Blog system
- Contact form with Resend API integration
- AI Chatbot powered by Google Gemini
- Quote request system
- Various performance optimizations

The site is deployed on **AWS Amplify**, which handles both the static site hosting and serverless functions.

## Repository Structure

```
celula-site/
├── index.html, blog.html, cotizador.html, contacto.html  # Main pages
├── post/                 # Blog post files (post-0.html through post-32.html)
├── js/                   # JavaScript files (both .js and minified .min.js versions)
├── css/                  # CSS stylesheets
├── assets/               # Images, videos, icons, etc.
├── functions/            # Serverless functions (Amplify Functions)
├── scripts/              # Shell scripts for optimization and maintenance
└── docs/                 # Documentation files
```

## Essential Commands

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Build & Optimization

```bash
# Build the site for Amplify
npm run build

# Minify JS and CSS files
npm run minify

# Optimize images
npm run optimize:images

# Optimize videos
npm run optimize:video
```

### Deployment

Deployment is handled automatically by AWS Amplify upon pushing to the main branch.

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

## AWS Amplify Configuration

The site is deployed on AWS Amplify with the following configuration:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18+

### Environment Variables Required

- `RESEND_API_KEY`: API key for Resend (email service)
- `CONTACT_EMAIL`: Target email for form submissions
- `GEMINI_API_KEY`: API key for Google Gemini (chatbot)

These variables must be configured in the AWS Amplify console.

## Troubleshooting

### Build Failures

1.  Check the Amplify build logs for errors.
2.  Ensure all dependencies are correctly listed in `package.json`.
3.  Verify that the `npm run build` command runs successfully locally.

### Email Not Working

1.  Check that the `RESEND_API_KEY` and `CONTACT_EMAIL` environment variables are set correctly in the Amplify console.
2.  Review the Amplify Function logs for errors.

### Chatbot Issues

1.  Verify the `GEMINI_API_KEY` is set correctly in the Amplify console.
2.  Check for JS console errors in the browser.
3.  Review the Amplify Function logs for the chatbot endpoint.
