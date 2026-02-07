/**
 * Análisis de código en desuso - Grupo Musical La Célula
 * Identifica estilos CSS, scripts JS y funciones que no se utilizan
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

class UnusedCodeAnalyzer {
    constructor() {
        this.htmlFiles = [];
        this.cssFiles = [];
        this.jsFiles = [];
        this.cssClasses = new Set();
        this.cssIds = new Set();
        this.usedClasses = new Set();
        this.usedIds = new Set();
        this.jsReferences = new Set();
        this.usedJsFiles = new Set();
        this.cssReferences = new Set();
        this.usedCssFiles = new Set();
        this.jsFunctions = new Map();
        this.usedFunctions = new Set();
    }

    async analyze() {
        console.log('🔍 Iniciando análisis de código en desuso...\n');

        // 1. Recolectar archivos
        await this.collectFiles();

        // 2. Analizar archivos HTML
        await this.analyzeHtmlFiles();

        // 3. Analizar archivos CSS
        await this.analyzeCssFiles();

        // 4. Analizar archivos JavaScript
        await this.analyzeJsFiles();

        // 5. Generar reporte
        this.generateReport();
    }

    async collectFiles() {
        console.log('📂 Recolectando archivos...');

        // HTML files (excluir dist, .history, node_modules)
        this.htmlFiles = await glob('**/*.html', {
            ignore: ['node_modules/**', 'dist/**', '.history/**', 'archived/**'],
            cwd: process.cwd()
        });

        // CSS files
        this.cssFiles = await glob('**/*.css', {
            ignore: ['node_modules/**', 'dist/**', '.history/**', 'archived/**', '**/*.min.css'],
            cwd: process.cwd()
        });

        // JS files
        this.jsFiles = await glob('**/*.js', {
            ignore: ['node_modules/**', 'dist/**', '.history/**', 'archived/**', '**/*.min.js', 'tools/**', 'tests/**', 'api/**', 'config/**', 'analyze-unused-code.js'],
            cwd: process.cwd()
        });

        console.log(`  ✓ ${this.htmlFiles.length} archivos HTML`);
        console.log(`  ✓ ${this.cssFiles.length} archivos CSS`);
        console.log(`  ✓ ${this.jsFiles.length} archivos JS\n`);
    }

    async analyzeHtmlFiles() {
        console.log('🔎 Analizando archivos HTML...');

        for (const file of this.htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');

            // Extraer clases usadas
            const classMatches = content.matchAll(/class=["']([^"']+)["']/g);
            for (const match of classMatches) {
                const classes = match[1].split(/\s+/);
                classes.forEach(cls => {
                    if (cls.trim()) this.usedClasses.add(cls.trim());
                });
            }

            // Extraer IDs usados
            const idMatches = content.matchAll(/id=["']([^"']+)["']/g);
            for (const match of idMatches) {
                this.usedIds.add(match[1]);
            }

            // Extraer referencias a archivos JS
            const jsMatches = content.matchAll(/src=["']([^"']+\.js)["']/g);
            for (const match of jsMatches) {
                const jsPath = match[1].replace(/^\.\.\//, '').replace(/^\//, '');
                this.usedJsFiles.add(jsPath);
            }

            // Extraer referencias a archivos CSS
            const cssMatches = content.matchAll(/href=["']([^"']+\.css)["']/g);
            for (const match of cssMatches) {
                const cssPath = match[1].replace(/^\.\.\//, '').replace(/^\//, '');
                this.usedCssFiles.add(cssPath);
            }

            // Extraer llamadas a funciones JS
            const functionCalls = content.matchAll(/(\w+)\s*\(/g);
            for (const match of functionCalls) {
                this.usedFunctions.add(match[1]);
            }
        }

        console.log(`  ✓ ${this.usedClasses.size} clases CSS únicas encontradas`);
        console.log(`  ✓ ${this.usedIds.size} IDs únicos encontrados`);
        console.log(`  ✓ ${this.usedJsFiles.size} archivos JS referenciados`);
        console.log(`  ✓ ${this.usedCssFiles.size} archivos CSS referenciados\n`);
    }

    async analyzeCssFiles() {
        console.log('🎨 Analizando archivos CSS...');

        for (const file of this.cssFiles) {
            const content = fs.readFileSync(file, 'utf-8');

            // Extraer selectores de clase
            const classSelectors = content.matchAll(/\.([a-zA-Z0-9_-]+)/g);
            for (const match of classSelectors) {
                this.cssClasses.add(match[1]);
            }

            // Extraer selectores de ID
            const idSelectors = content.matchAll(/#([a-zA-Z0-9_-]+)/g);
            for (const match of idSelectors) {
                this.cssIds.add(match[1]);
            }
        }

        console.log(`  ✓ ${this.cssClasses.size} clases CSS definidas`);
        console.log(`  ✓ ${this.cssIds.size} IDs CSS definidos\n`);
    }

    async analyzeJsFiles() {
        console.log('⚙️ Analizando archivos JavaScript...');

        for (const file of this.jsFiles) {
            const content = fs.readFileSync(file, 'utf-8');

            // Extraer definiciones de funciones
            const functionDefs = content.matchAll(/function\s+(\w+)\s*\(/g);
            for (const match of functionDefs) {
                if (!this.jsFunctions.has(file)) {
                    this.jsFunctions.set(file, new Set());
                }
                this.jsFunctions.get(file).add(match[1]);
            }

            // Extraer funciones de flecha asignadas
            const arrowFunctions = content.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>/g);
            for (const match of arrowFunctions) {
                if (!this.jsFunctions.has(file)) {
                    this.jsFunctions.set(file, new Set());
                }
                this.jsFunctions.get(file).add(match[1]);
            }

            // Extraer métodos de clase
            const classMethods = content.matchAll(/(?:async\s+)?(\w+)\s*\([^)]*\)\s*{/g);
            for (const match of classMethods) {
                if (!['if', 'for', 'while', 'switch', 'catch'].includes(match[1])) {
                    if (!this.jsFunctions.has(file)) {
                        this.jsFunctions.set(file, new Set());
                    }
                    this.jsFunctions.get(file).add(match[1]);
                }
            }
        }

        let totalFunctions = 0;
        this.jsFunctions.forEach(funcs => totalFunctions += funcs.size);
        console.log(`  ✓ ${totalFunctions} funciones JavaScript encontradas\n`);
    }

    generateReport() {
        console.log('📊 REPORTE DE ANÁLISIS DE CÓDIGO EN DESUSO\n');
        console.log('='.repeat(80));

        // 1. Clases CSS no usadas
        const unusedClasses = Array.from(this.cssClasses).filter(cls => !this.usedClasses.has(cls));
        console.log('\n📌 CLASES CSS NO USADAS (' + unusedClasses.length + ' encontradas):');
        console.log('-'.repeat(80));
        if (unusedClasses.length > 0) {
            unusedClasses.sort().forEach(cls => {
                console.log(`  • .${cls}`);
            });
        } else {
            console.log('  ✓ Todas las clases CSS están en uso');
        }

        // 2. IDs CSS no usados
        const unusedIds = Array.from(this.cssIds).filter(id => !this.usedIds.has(id));
        console.log('\n📌 IDS CSS NO USADOS (' + unusedIds.length + ' encontrados):');
        console.log('-'.repeat(80));
        if (unusedIds.length > 0) {
            unusedIds.sort().forEach(id => {
                console.log(`  • #${id}`);
            });
        } else {
            console.log('  ✓ Todos los IDs CSS están en uso');
        }

        // 3. Archivos JS no referenciados
        const allJsFiles = this.jsFiles.map(f => f.replace(/\\/g, '/'));
        const unusedJsFiles = allJsFiles.filter(file => {
            const fileName = path.basename(file);
            const fileNameMin = fileName.replace('.js', '.min.js');
            
            // Verificar si el archivo o su versión minificada está referenciado
            let isUsed = false;
            this.usedJsFiles.forEach(usedFile => {
                if (usedFile.includes(fileName) || usedFile.includes(fileNameMin)) {
                    isUsed = true;
                }
            });
            return !isUsed;
        });

        console.log('\n📌 ARCHIVOS JAVASCRIPT NO REFERENCIADOS (' + unusedJsFiles.length + ' encontrados):');
        console.log('-'.repeat(80));
        if (unusedJsFiles.length > 0) {
            unusedJsFiles.sort().forEach(file => {
                console.log(`  • ${file}`);
            });
        } else {
            console.log('  ✓ Todos los archivos JS están referenciados');
        }

        // 4. Archivos CSS no referenciados
        const allCssFiles = this.cssFiles.map(f => f.replace(/\\/g, '/'));
        const unusedCssFiles = allCssFiles.filter(file => {
            const fileName = path.basename(file);
            const fileNameMin = fileName.replace('.css', '.min.css');
            
            // Verificar si el archivo o su versión minificada está referenciado
            let isUsed = false;
            this.usedCssFiles.forEach(usedFile => {
                if (usedFile.includes(fileName) || usedFile.includes(fileNameMin)) {
                    isUsed = true;
                }
            });
            return !isUsed;
        });

        console.log('\n📌 ARCHIVOS CSS NO REFERENCIADOS (' + unusedCssFiles.length + ' encontrados):');
        console.log('-'.repeat(80));
        if (unusedCssFiles.length > 0) {
            unusedCssFiles.sort().forEach(file => {
                console.log(`  • ${file}`);
            });
        } else {
            console.log('  ✓ Todos los archivos CSS están referenciados');
        }

        // 5. Funciones JavaScript potencialmente no usadas
        console.log('\n📌 FUNCIONES JAVASCRIPT DEFINIDAS POR ARCHIVO:');
        console.log('-'.repeat(80));
        this.jsFunctions.forEach((funcs, file) => {
            console.log(`\n  📄 ${file}:`);
            Array.from(funcs).sort().forEach(func => {
                const isUsed = this.usedFunctions.has(func);
                const status = isUsed ? '✓' : '⚠️';
                console.log(`    ${status} ${func}()`);
            });
        });

        // 6. Resumen de archivos duplicados (source vs minified)
        console.log('\n📌 ARCHIVOS DUPLICADOS (SOURCE + MINIFIED):');
        console.log('-'.repeat(80));
        const sourceFiles = this.jsFiles.filter(f => !f.includes('.min.js'));
        sourceFiles.forEach(file => {
            const minFile = file.replace('.js', '.min.js');
            if (fs.existsSync(minFile)) {
                console.log(`  • ${file}`);
                console.log(`    → ${minFile}`);
            }
        });

        // 7. Archivos de prueba
        console.log('\n📌 ARCHIVOS DE PRUEBA/TESTING:');
        console.log('-'.repeat(80));
        const testFiles = this.htmlFiles.filter(f => f.includes('test-'));
        if (testFiles.length > 0) {
            testFiles.forEach(file => {
                console.log(`  • ${file}`);
            });
        } else {
            console.log('  ✓ No se encontraron archivos de prueba en la raíz');
        }

        // 8. Estilos inline duplicados
        console.log('\n📌 ESTILOS INLINE EN HTML (potencialmente duplicados):');
        console.log('-'.repeat(80));
        this.htmlFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8');
            const styleBlocks = content.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
            if (styleBlocks && styleBlocks.length > 0) {
                console.log(`  • ${file}: ${styleBlocks.length} bloques <style>`);
            }
        });

        console.log('\n' + '='.repeat(80));
        console.log('✅ Análisis completado\n');
    }
}

// Ejecutar análisis
const analyzer = new UnusedCodeAnalyzer();
analyzer.analyze().catch(console.error);
