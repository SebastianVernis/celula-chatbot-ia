#!/usr/bin/env node

// Script para generar archivos meta automáticamente (manifest.json, robots.txt, llms.txt)
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const BASE_URL = 'https://www.grupomusicalcelula.com';

// Función para generar manifest.json
function generateManifest() {
    const manifest = {
        name: "Grupo Musical Versátil La Célula",
        short_name: "La Célula",
        description: "Música profesional para bodas, fiestas y eventos corporativos en Ciudad de México",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        orientation: "portrait-primary",
        icons: [
            {
                src: "assets/logo/logo.webp",
                sizes: "192x192",
                type: "image/webp",
                purpose: "any maskable"
            },
            {
                src: "assets/logo/logo.webp",
                sizes: "512x512",
                type: "image/webp",
                purpose: "any maskable"
            }
        ],
        categories: [
            "music",
            "entertainment",
            "events"
        ],
        lang: "es-MX",
        dir: "ltr",
        scope: "/",
        screenshots: [
            {
                src: "assets/gallery/banda-1.webp",
                sizes: "1280x720",
                type: "image/webp"
            },
            {
                src: "assets/blog/evento-1.webp",
                sizes: "1280x720",
                type: "image/webp"
            }
        ],
        shortcuts: [
            {
                name: "Cotizador",
                short_name: "Cotizar",
                description: "Cotiza tu evento",
                url: "/cotizador.html",
                icons: [
                    {
                        src: "assets/logo/logo.webp",
                        sizes: "96x96"
                    }
                ]
            },
            {
                name: "Blog",
                short_name: "Blog",
                description: "Lee nuestro blog",
                url: "/blog.html",
                icons: [
                    {
                        src: "assets/logo/logo.webp",
                        sizes: "96x96"
                    }
                ]
            },
            {
                name: "Galería",
                short_name: "Galería",
                description: "Ve nuestras fotos",
                url: "/galeria.html",
                icons: [
                    {
                        src: "assets/logo/logo.webp",
                        sizes: "96x96"
                    }
                ]
            }
        ]
    };

    const manifestPath = path.join(DIST_DIR, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), { mode: 0o644 });
    console.log('  ✓ manifest.json generated');
}

// Función para generar robots.txt
function generateRobots() {
    const robots = `# robots.txt para Grupo Musical La Célula
# Generated automatically on ${new Date().toISOString()}

User-agent: *

# Allow crawling of important resources
Allow: /css/
Allow: /js/
Allow: /assets/
Allow: /post/
Allow: /marketing/

# Disallow temporary and development files
Disallow: /test-*.html
Disallow: /*.sh
Disallow: /*.py
Disallow: /*.md
Disallow: /.git/
Disallow: /.blackbox/
Disallow: /node_modules/
Disallow: /tools/
Disallow: /tests/
Disallow: /api/
Disallow: /functions/

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-index.xml

# Crawl-delay for polite bots
Crawl-delay: 1
`;

    const robotsPath = path.join(DIST_DIR, 'robots.txt');
    fs.writeFileSync(robotsPath, robots, { mode: 0o644 });
    console.log('  ✓ robots.txt generated');
}

// Función para generar llms.txt
function generateLLMsTxt() {
    // Obtener todas las páginas HTML
    const htmlFiles = globSync('**/*.html', { cwd: DIST_DIR, absolute: false });
    
    // Obtener posts del blog
    const blogPosts = htmlFiles.filter(file => file.startsWith('post/'));
    
    const llmsTxt = `# Grupo Musical Versátil La Célula - LLMs Information
# Generated automatically on ${new Date().toISOString()}
# This file provides structured information for Large Language Models

## About Us
Name: Grupo Musical Versátil La Célula
Type: Professional Musical Group
Location: Ciudad de México, México
Services: Música en vivo para bodas, XV años, eventos corporativos, fiestas
Website: ${BASE_URL}

## Main Pages
- Home: ${BASE_URL}/
- Blog: ${BASE_URL}/blog.html
- Cotizador: ${BASE_URL}/cotizador.html
- Galería: ${BASE_URL}/galeria.html
- Testimonios: ${BASE_URL}/testimonios.html

## Blog Posts (${blogPosts.length} articles)
${blogPosts.map(post => `- ${BASE_URL}/${post}`).join('\n')}

## Services
- Música para bodas
- Música para XV años
- Música para eventos corporativos
- Música para fiestas privadas
- Serenatas
- Shows en vivo

## Contact
- WhatsApp: Available on website
- Email: Available via contact form
- Location: Ciudad de México

## Technical Information
- Platform: Static HTML with JavaScript
- Hosting: Vercel/AWS Amplify
- Features: Progressive Web App (PWA), AI Chatbot, Real-time quotes
- Languages: Spanish (es-MX)

## SEO Keywords
grupo musical cdmx, música para bodas, grupo versatil, música en vivo, 
eventos cdmx, serenatas cdmx, banda para fiestas, música profesional

## Social Media
Find us on social media platforms for latest updates and performances.

## Updates
This file is automatically generated during build process.
Last generated: ${new Date().toISOString()}

---
For more information, visit ${BASE_URL}
`;

    const llmsPath = path.join(DIST_DIR, 'llms.txt');
    fs.writeFileSync(llmsPath, llmsTxt, { mode: 0o644 });
    console.log('  ✓ llms.txt generated');
}

// Función para generar humans.txt
function generateHumans() {
    const humans = `/* TEAM */
Developer: Celula Development Team
Site: ${BASE_URL}
Location: Ciudad de México, México

/* THANKS */
Technologies: Node.js, Vercel, AWS Amplify, Google Generative AI
Design: Custom responsive design
Performance: Optimized for Core Web Vitals

/* SITE */
Last update: ${new Date().toISOString()}
Language: Español / Spanish
Doctype: HTML5
IDE: Visual Studio Code
Standards: W3C, Accessibility WCAG 2.1
Components: PWA, AI Chatbot, Dynamic Gallery, Blog System
`;

    const humansPath = path.join(DIST_DIR, 'humans.txt');
    fs.writeFileSync(humansPath, humans, { mode: 0o644 });
    console.log('  ✓ humans.txt generated');
}

// Función para generar security.txt
function generateSecurity() {
    const security = `Contact: ${BASE_URL}/cotizador.html
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Preferred-Languages: es, en
Canonical: ${BASE_URL}/.well-known/security.txt
`;

    const wellKnownDir = path.join(DIST_DIR, '.well-known');
    if (!fs.existsSync(wellKnownDir)) {
        fs.mkdirSync(wellKnownDir, { recursive: true, mode: 0o755 });
    }

    const securityPath = path.join(wellKnownDir, 'security.txt');
    fs.writeFileSync(securityPath, security, { mode: 0o644 });
    console.log('  ✓ security.txt generated');
}

// Ejecutar todas las generaciones
console.log('Generating meta files...\n');

try {
    generateManifest();
    generateRobots();
    generateLLMsTxt();
    generateHumans();
    generateSecurity();
    
    console.log('\n✅ All meta files generated successfully!');
} catch (error) {
    console.error('\n❌ Error generating meta files:', error);
    process.exit(1);
}
