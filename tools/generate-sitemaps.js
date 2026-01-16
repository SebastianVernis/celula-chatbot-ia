#!/usr/bin/env node

// Script para generar sitemaps unificados y complementarios para el proyecto celula-chatbot-ia
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// Directorios y configuración
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const OUTPUT_DIR = path.join(__dirname, '../dist');
const BASE_URL = 'https://www.grupomusicalcelula.com';

// Función para obtener la fecha de modificación de un archivo
function getLastMod(filePath) {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
}

// Función para generar un sitemap estándar
function generateSitemap(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
        xml += `  <url>\n`;
        xml += `    <loc>${url.loc}</loc>\n`;
        if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        if (url.changefreq) xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        if (url.priority) xml += `    <priority>${url.priority}</priority>\n`;
        xml += `  </url>\n`;
    });
    
    xml += '</urlset>';
    return xml;
}

// Función para generar un sitemap de imágenes
function generateImageSitemap(images) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    images.forEach(img => {
        xml += `  <url>\n`;
        xml += `    <loc>${img.pageUrl}</loc>\n`;
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${img.imgUrl}</image:loc>\n`;
        if (img.caption) xml += `      <image:caption><![CDATA[${img.caption}]]></image:caption>\n`;
        xml += `    </image:image>\n`;
        xml += `  </url>\n`;
    });
    
    xml += '</urlset>';
    return xml;
}

// Función para generar un sitemap de videos
function generateVideoSitemap(videos) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';
    
    videos.forEach(video => {
        xml += `  <url>\n`;
        xml += `    <loc>${video.pageUrl}</loc>\n`;
        xml += `    <video:video>\n`;
        xml += `      <video:thumbnail_loc>${video.thumbnail}</video:thumbnail_loc>\n`;
        xml += `      <video:title><![CDATA[${video.title}]]></video:title>\n`;
        xml += `      <video:description><![CDATA[${video.description}]]></video:description>\n`;
        xml += `      <video:content_loc>${video.content_loc}</video:content_loc>\n`;
        xml += `    </video:video>\n`;
        xml += `  </url>\n`;
    });
    
    xml += '</urlset>';
    return xml;
}

// Función para generar un sitemap index
function generateSitemapIndex(sitemaps) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    sitemaps.forEach(sitemap => {
        xml += `  <sitemap>\n`;
        xml += `    <loc>${sitemap.loc}</loc>\n`;
        if (sitemap.lastmod) xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
        xml += `  </sitemap>\n`;
    });
    
    xml += '</sitemapindex>';
    return xml;
}

// Obtener todos los archivos HTML
const htmlFiles = globSync('**/*.html', { 
    cwd: DIST_DIR, 
    absolute: true,
    ignore: ['**/node_modules/**', '**/test-*.html', '**/.git/**']
});

// Generar URLs para el sitemap principal
const mainUrls = htmlFiles
    .filter(file => {
        const relPath = path.relative(DIST_DIR, file);
        // Excluir node_modules, archivos de test y archivos ocultos
        return !relPath.includes('node_modules') && 
               !relPath.includes('test-') &&
               !relPath.startsWith('.');
    })
    .map(file => {
        const relPath = path.relative(DIST_DIR, file);
        const urlPath = relPath.replace(/\\/g, '/'); // Asegurar que las rutas usen / en lugar de \
        const fullUrl = urlPath === 'index.html' 
            ? BASE_URL 
            : `${BASE_URL}/${urlPath}`;
        
        let changefreq = 'monthly';
        let priority = 0.7;
        
        // Asignar prioridades y frecuencias según la importancia
        if (urlPath === 'index.html') {
            changefreq = 'weekly';
            priority = 1.0;
        } else if (urlPath === 'blog.html') {
            changefreq = 'weekly';
            priority = 0.9;
        } else if (urlPath === 'cotizador.html' || urlPath === 'galeria.html' || urlPath === 'testimonios.html') {
            changefreq = 'monthly';
            priority = 0.9;
        } else if (urlPath.startsWith('marketing/')) {
            changefreq = 'monthly';
            priority = 0.8;
        } else if (urlPath.startsWith('post/')) {
            changefreq = 'monthly';
            priority = 0.7;
        }
        
        return {
            loc: fullUrl,
            lastmod: getLastMod(file),
            changefreq,
            priority
        };
    });

// Obtener archivos CSS
const cssFiles = globSync('**/*.css', { 
    cwd: DIST_DIR, 
    absolute: true,
    ignore: ['**/node_modules/**']
});
const cssUrls = cssFiles
    .filter(file => !path.relative(DIST_DIR, file).includes('node_modules'))
    .map(file => {
        const relPath = path.relative(DIST_DIR, file);
        const urlPath = relPath.replace(/\\/g, '/');
        return {
            loc: `${BASE_URL}/${urlPath}`,
            lastmod: getLastMod(file)
        };
    });

// Obtener archivos JS
const jsFiles = globSync('**/*.js', { 
    cwd: DIST_DIR, 
    absolute: true,
    ignore: ['**/node_modules/**']
});
const jsUrls = jsFiles
    .filter(file => !path.relative(DIST_DIR, file).includes('node_modules'))
    .map(file => {
        const relPath = path.relative(DIST_DIR, file);
        const urlPath = relPath.replace(/\\/g, '/');
        return {
            loc: `${BASE_URL}/${urlPath}`,
            lastmod: getLastMod(file)
        };
    });

// Obtener archivos de imagen
const imageFiles = globSync('**/*.{jpg,jpeg,png,webp,gif}', { 
    cwd: DIST_DIR, 
    absolute: true,
    ignore: ['**/node_modules/**']
});
const imageUrls = imageFiles
    .filter(file => !path.relative(DIST_DIR, file).includes('node_modules'))
    .map(file => {
        const relPath = path.relative(DIST_DIR, file);
        const urlPath = relPath.replace(/\\/g, '/').replace(/ /g, '%20'); // URL encode spaces
        return {
            loc: `${BASE_URL}/${urlPath}`,
            lastmod: getLastMod(file)
        };
    });

// Obtener archivos de video
const videoFiles = globSync('**/*.{mp4,webm,ogg,mov,avi}', { 
    cwd: DIST_DIR, 
    absolute: true,
    ignore: ['**/node_modules/**']
});
const videoUrls = videoFiles
    .filter(file => !path.relative(DIST_DIR, file).includes('node_modules'))
    .map(file => {
        const relPath = path.relative(DIST_DIR, file);
        const urlPath = relPath.replace(/\\/g, '/').replace(/ /g, '%20'); // URL encode spaces
        return {
            loc: `${BASE_URL}/${urlPath}`,
            lastmod: getLastMod(file)
        };
    });

// Función para escribir archivos con manejo de errores
function safeWriteFile(filePath, content, fileName) {
    try {
        fs.writeFileSync(filePath, content, { mode: 0o644 });
        console.log(`  ✓ ${fileName} generated successfully`);
    } catch (error) {
        console.error(`  ✗ Failed to write ${fileName}:`, error.message);
        throw new Error(`Sitemap generation failed for ${fileName}: ${error.message}`);
    }
}

// Crear sitemap principal (HTML)
const mainSitemap = generateSitemap(mainUrls);
safeWriteFile(path.join(OUTPUT_DIR, 'sitemap-main.xml'), mainSitemap, 'sitemap-main.xml');

// Crear sitemap de CSS
const cssSitemap = generateSitemap(cssUrls);
safeWriteFile(path.join(OUTPUT_DIR, 'sitemap-styles.xml'), cssSitemap, 'sitemap-styles.xml');

// Crear sitemap de JS
const jsSitemap = generateSitemap(jsUrls);
safeWriteFile(path.join(OUTPUT_DIR, 'sitemap-scripts.xml'), jsSitemap, 'sitemap-scripts.xml');

// Crear sitemap de imágenes
const imageSitemap = generateSitemap(imageUrls);
safeWriteFile(path.join(OUTPUT_DIR, 'sitemap-images.xml'), imageSitemap, 'sitemap-images.xml');

// Crear sitemap de videos
const videoSitemap = generateSitemap(videoUrls);
safeWriteFile(path.join(OUTPUT_DIR, 'sitemap-videos.xml'), videoSitemap, 'sitemap-videos.xml');

// Crear sitemap index
const sitemapIndex = generateSitemapIndex([
    { loc: `${BASE_URL}/sitemap-main.xml`, lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${BASE_URL}/sitemap-styles.xml`, lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${BASE_URL}/sitemap-scripts.xml`, lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${BASE_URL}/sitemap-images.xml`, lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${BASE_URL}/sitemap-videos.xml`, lastmod: new Date().toISOString().split('T')[0] }
]);
safeWriteFile(path.join(OUTPUT_DIR, 'sitemap-index.xml'), sitemapIndex, 'sitemap-index.xml');

// Crear sitemap principal combinado (solo HTML para SEO)
const combinedSitemap = generateSitemap(mainUrls);
safeWriteFile(path.join(OUTPUT_DIR, 'sitemap.xml'), combinedSitemap, 'sitemap.xml');

console.log('\n✅ All sitemaps generated successfully:');
console.log('- sitemap.xml (HTML pages only - SEO focused)');
console.log('- sitemap-main.xml (HTML pages)');
console.log('- sitemap-styles.xml (CSS files)');
console.log('- sitemap-scripts.xml (JS files)');
console.log('- sitemap-images.xml (Image files)');
console.log('- sitemap-videos.xml (Video files)');
console.log('- sitemap-index.xml (Index file)');