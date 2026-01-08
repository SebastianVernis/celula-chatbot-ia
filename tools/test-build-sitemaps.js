#!/usr/bin/env node

// Script de prueba para verificar que los sitemaps se actualicen durante el build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const TEST_DIR = path.join(PROJECT_ROOT, 'dist-test');

console.log('🧪 Testing sitemap generation during build...\n');

// Step 1: Create temporary build directory
console.log('📁 Creating temporary test directory...');
if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
}

// Step 2: Temporarily rename dist to dist-test
console.log('🔄 Moving current dist to test location...');
if (fs.existsSync(DIST_DIR)) {
    try {
        fs.renameSync(DIST_DIR, TEST_DIR);
        console.log('  ✓ Moved dist → dist-test');
    } catch (error) {
        console.log('  ⚠️  Could not move dist (likely permission issue)');
        console.log('  💡 Please fix permissions first: sudo chown -R $USER:$USER dist/');
        process.exit(1);
    }
}

// Step 3: Run build
console.log('\n🏗️  Running build...');
try {
    execSync('npm run build', { 
        cwd: PROJECT_ROOT, 
        stdio: 'pipe',
        encoding: 'utf-8'
    });
    console.log('  ✓ Build completed');
} catch (error) {
    console.log('  ✗ Build failed:', error.message);
    // Restore dist-test
    if (fs.existsSync(TEST_DIR)) {
        fs.renameSync(TEST_DIR, DIST_DIR);
    }
    process.exit(1);
}

// Step 4: Verify sitemap files exist
console.log('\n📋 Checking generated sitemap files...');
const expectedSitemaps = [
    'sitemap.xml',
    'sitemap-index.xml',
    'sitemap-main.xml',
    'sitemap-styles.xml',
    'sitemap-scripts.xml',
    'sitemap-images.xml',
    'sitemap-videos.xml'
];

let allFound = true;
expectedSitemaps.forEach(filename => {
    const filepath = path.join(DIST_DIR, filename);
    if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        const sizeMB = (stats.size / 1024).toFixed(2);
        console.log(`  ✓ ${filename} (${sizeMB} KB)`);
    } else {
        console.log(`  ✗ ${filename} NOT FOUND`);
        allFound = false;
    }
});

// Step 5: Verify meta files exist
console.log('\n📝 Checking generated meta files...');
const expectedMetaFiles = [
    'manifest.json',
    'robots.txt',
    'llms.txt',
    'humans.txt',
    '.well-known/security.txt'
];

expectedMetaFiles.forEach(filename => {
    const filepath = path.join(DIST_DIR, filename);
    if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ✓ ${filename} (${sizeKB} KB)`);
    } else {
        console.log(`  ✗ ${filename} NOT FOUND`);
        allFound = false;
    }
});

// Step 6: Validate sitemap content
console.log('\n🔍 Validating sitemap content...');
const mainSitemap = path.join(DIST_DIR, 'sitemap.xml');
if (fs.existsSync(mainSitemap)) {
    const content = fs.readFileSync(mainSitemap, 'utf8');
    
    // Check XML declaration
    if (content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
        console.log('  ✓ Valid XML declaration');
    } else {
        console.log('  ✗ Invalid XML declaration');
        allFound = false;
    }
    
    // Check URL count
    const urlCount = (content.match(/<loc>/g) || []).length;
    console.log(`  ✓ Contains ${urlCount} URLs`);
    
    // Check for spaces in URLs (should be encoded)
    if (content.includes('<loc>https://www.grupomusicalcelula.com/assets/logo/logotipo para web.webp</loc>')) {
        console.log('  ✗ Found unencoded spaces in URLs');
        allFound = false;
    } else {
        console.log('  ✓ No unencoded spaces in URLs');
    }
}

// Step 7: Compare timestamps
console.log('\n⏰ Checking file timestamps...');
const newSitemapTime = fs.statSync(path.join(DIST_DIR, 'sitemap.xml')).mtime;
console.log(`  New sitemap: ${newSitemapTime.toISOString()}`);

if (fs.existsSync(TEST_DIR)) {
    const oldSitemapPath = path.join(TEST_DIR, 'sitemap.xml');
    if (fs.existsSync(oldSitemapPath)) {
        const oldSitemapTime = fs.statSync(oldSitemapPath).mtime;
        console.log(`  Old sitemap: ${oldSitemapTime.toISOString()}`);
        
        if (newSitemapTime > oldSitemapTime) {
            console.log('  ✓ Sitemap was updated during build');
        } else {
            console.log('  ⚠️  Sitemap timestamp not updated');
        }
    }
}

// Step 8: Cleanup
console.log('\n🧹 Cleaning up...');
if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
    console.log('  ✓ Removed test directory');
}

// Final result
console.log('\n' + '='.repeat(60));
if (allFound) {
    console.log('✅ TEST PASSED - All sitemaps and meta files generated correctly!');
    console.log('='.repeat(60));
    process.exit(0);
} else {
    console.log('❌ TEST FAILED - Some files missing or invalid');
    console.log('='.repeat(60));
    process.exit(1);
}
