/**
 * Análisis profundo de clases CSS realmente no usadas
 * Excluye clases creadas dinámicamente por JavaScript
 */

import fs from 'fs';
import { glob } from 'glob';

class DeepCSSAnalyzer {
    constructor() {
        this.dynamicClasses = new Set([
            // Video Player (creadas por video-player-popup.js)
            'video-player-single', 'video-player-left', 'video-player-right',
            'video-player-container', 'video-player-wrapper', 'video-player-element',
            'video-player-overlay', 'video-player-loading', 'video-player-controls',
            'video-spinner', 'video-btn-play-large', 'video-btn-close-compact',
            'hidden', 'visible', 'minimized',
            
            // Lightbox (creadas por galeria-lightbox.js y galeria-carousel.js)
            'gallery-lightbox', 'lightbox-image', 'lightbox-close',
            'lightbox-prev', 'lightbox-next', 'lightbox-caption', 'lightbox-counter',
            'gallery-modal', 'gallery-modal-content', 'gallery-close',
            
            // Chatbot (creadas por chatbot.js)
            'typing-indicator', 'user-message', 'bot-message',
            
            // YouTube Carousel (creadas por youtube-carousel.js)
            'youtube-carousel', 'youtube-carousel-wrapper', 'youtube-video-group',
            'youtube-video', 'lite-youtube', 'youtube-thumbnail', 'youtube-play-btn',
            
            // Blog (creadas por blog-pagination.js)
            'blog-post-card', 'post-content-card',
            
            // Galería (creadas por galeria-carousel.js)
            'gallery-item', 'gallery-image', 'gallery-overlay', 'gallery-text',
            
            // Estados y utilidades dinámicas
            'active', 'loaded', 'flipped', 'no-video-support',
            
            // Video background (creadas por video-background.js)
            'persistent-video-container', 'persistent-video-element',
            'persistent-video-mobile-bg', 'video-overlay'
        ]);

        this.cssClasses = new Set();
        this.usedClasses = new Set();
    }

    async analyze() {
        console.log('🔬 Análisis profundo de clases CSS...\n');

        // 1. Recolectar clases definidas en CSS
        await this.collectCssClasses();

        // 2. Recolectar clases usadas en HTML
        await this.collectUsedClasses();

        // 3. Recolectar clases usadas en JS
        await this.collectJsClasses();

        // 4. Generar reporte
        this.generateReport();
    }

    async collectCssClasses() {
        const cssFiles = await glob('**/*.css', {
            ignore: ['node_modules/**', 'dist/**', '.history/**', 'archived/**', '**/*.min.css'],
            cwd: process.cwd()
        });

        for (const file of cssFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            
            // Extraer selectores de clase (mejorado)
            const classMatches = content.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g);
            for (const match of classMatches) {
                const className = match[1];
                // Filtrar valores que no son clases reales
                if (!className.match(/^\d/) && !className.includes('webp') && !className.includes('woff')) {
                    this.cssClasses.add(className);
                }
            }
        }

        console.log(`📋 ${this.cssClasses.size} clases CSS definidas (filtradas)`);
    }

    async collectUsedClasses() {
        const htmlFiles = await glob('**/*.html', {
            ignore: ['node_modules/**', 'dist/**', '.history/**', 'archived/**'],
            cwd: process.cwd()
        });

        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            
            // Extraer clases del atributo class
            const classMatches = content.matchAll(/class=["']([^"']+)["']/g);
            for (const match of classMatches) {
                const classes = match[1].split(/\s+/);
                classes.forEach(cls => {
                    if (cls.trim()) this.usedClasses.add(cls.trim());
                });
            }
        }

        console.log(`📋 ${this.usedClasses.size} clases usadas en HTML`);
    }

    async collectJsClasses() {
        const jsFiles = await glob('**/*.js', {
            ignore: ['node_modules/**', 'dist/**', '.history/**', 'archived/**', '**/*.min.js', 'tools/**', 'tests/**', 'api/**', 'config/**', 'analyze-unused-code.js', 'deep-analysis-unused.js'],
            cwd: process.cwd()
        });

        for (const file of jsFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            
            // Buscar classList.add, classList.remove, classList.toggle
            const classListMatches = content.matchAll(/classList\.(add|remove|toggle)\s*\(\s*["']([^"']+)["']\s*\)/g);
            for (const match of classListMatches) {
                this.usedClasses.add(match[2]);
            }

            // Buscar className = 'xxx'
            const classNameMatches = content.matchAll(/className\s*=\s*["']([^"']+)["']/g);
            for (const match of classNameMatches) {
                const classes = match[1].split(/\s+/);
                classes.forEach(cls => {
                    if (cls.trim()) this.usedClasses.add(cls.trim());
                });
            }

            // Buscar querySelector('.xxx')
            const querySelectorMatches = content.matchAll(/querySelector(?:All)?\s*\(\s*["']\.([a-zA-Z][a-zA-Z0-9_-]*)["']\s*\)/g);
            for (const match of querySelectorMatches) {
                this.usedClasses.add(match[1]);
            }
        }

        console.log(`📋 ${this.usedClasses.size} clases totales usadas (HTML + JS)\n`);
    }

    generateReport() {
        console.log('=' .repeat(80));
        console.log('📊 REPORTE: CLASES CSS REALMENTE NO USADAS\n');
        console.log('=' .repeat(80));

        // Filtrar clases no usadas, excluyendo las dinámicas
        const unusedClasses = Array.from(this.cssClasses).filter(cls => {
            return !this.usedClasses.has(cls) && !this.dynamicClasses.has(cls);
        });

        console.log(`\n🔴 CLASES CSS EN DESUSO CONFIRMADAS (${unusedClasses.length}):\n`);
        console.log('-'.repeat(80));

        if (unusedClasses.length > 0) {
            // Agrupar por archivo CSS
            this.groupByFile(unusedClasses);
        } else {
            console.log('✅ No se encontraron clases CSS en desuso\n');
        }

        // Mostrar clases dinámicas para referencia
        console.log('\n📌 CLASES DINÁMICAS (creadas por JavaScript):');
        console.log('-'.repeat(80));
        console.log('Estas clases NO aparecen en HTML pero SÍ se usan:\n');
        Array.from(this.dynamicClasses).sort().forEach(cls => {
            console.log(`  ✓ .${cls}`);
        });

        console.log('\n' + '='.repeat(80));
        console.log('✅ Análisis profundo completado\n');
    }

    async groupByFile(unusedClasses) {
        const cssFiles = await glob('**/*.css', {
            ignore: ['node_modules/**', 'dist/**', '.history/**', 'archived/**', '**/*.min.css'],
            cwd: process.cwd()
        });

        const classesByFile = new Map();

        for (const file of cssFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            
            unusedClasses.forEach(cls => {
                const regex = new RegExp(`\\.${cls}(?![a-zA-Z0-9_-])`, 'g');
                if (regex.test(content)) {
                    if (!classesByFile.has(file)) {
                        classesByFile.set(file, []);
                    }
                    classesByFile.get(file).push(cls);
                }
            });
        }

        classesByFile.forEach((classes, file) => {
            console.log(`\n📄 ${file} (${classes.length} clases no usadas):`);
            classes.sort().forEach(cls => {
                console.log(`  • .${cls}`);
            });
        });
    }
}

// Ejecutar análisis
const analyzer = new DeepCSSAnalyzer();
analyzer.analyze().catch(console.error);
