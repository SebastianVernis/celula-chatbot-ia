#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Project root is parent of tools directory
const PROJECT_ROOT = resolve(__dirname, '..');
const SRC_DIR = resolve(PROJECT_ROOT, 'src');
const DIST_DIR = resolve(PROJECT_ROOT, 'dist');

console.log('🏗️  Building celula-site...\n');

// Clean dist directory
if (existsSync(DIST_DIR)) {
  console.log('🧹 Cleaning dist directory...');
  cpSync(DIST_DIR, DIST_DIR + '_backup', { recursive: true, force: true });
}

// Create dist structure
mkdirSync(DIST_DIR, { recursive: true });
['html', 'css', 'js', 'assets'].forEach(dir => {
  mkdirSync(join(DIST_DIR, dir), { recursive: true });
});

// Copy assets
console.log('📦 Copying assets...');
const assetsDirs = readdirSync(join(SRC_DIR, 'assets'), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

assetsDirs.forEach(dir => {
  const srcPath = join(SRC_DIR, 'assets', dir);
  const destPath = join(DIST_DIR, 'assets', dir);
  cpSync(srcPath, destPath, { recursive: true });
  console.log(`  ✓ ${dir}`);
});

// Process CSS files
console.log('\n🎨 Processing CSS...');
const cssFiles = readdirSync(join(SRC_DIR, 'css'))
  .filter(f => f.endsWith('.css') && !f.endsWith('.min.css'));

cssFiles.forEach(file => {
  const content = readFileSync(join(SRC_DIR, 'css', file), 'utf8');
  // Basic minification: remove comments and extra whitespace
  const minified = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();
  
  const outFile = file.replace('.css', '.min.css');
  writeFileSync(join(DIST_DIR, 'css', outFile), minified);
  console.log(`  ✓ ${file} → ${outFile}`);
});

// Process JS files
console.log('\n⚙️  Processing JavaScript...');
const jsFiles = readdirSync(join(SRC_DIR, 'js'))
  .filter(f => f.endsWith('.js') && !f.endsWith('.min.js'));

jsFiles.forEach(file => {
  const content = readFileSync(join(SRC_DIR, 'js', file), 'utf8');
  // Basic minification: remove comments and extra whitespace
  const minified = content
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const outFile = file.replace('.js', '.min.js');
  writeFileSync(join(DIST_DIR, 'js', outFile), minified);
  console.log(`  ✓ ${file} → ${outFile}`);
});

// Process HTML files
console.log('\n📄 Processing HTML...');

function updateHTMLPaths(content) {
  return content
    // Update CSS paths
    .replace(/href=["']css\//g, 'href="dist/css/')
    .replace(/href=["']\.\.\/css\//g, 'href="../dist/css/')
    // Update JS paths
    .replace(/src=["']js\//g, 'src="dist/js/')
    .replace(/src=["']\.\.\/js\//g, 'src="../dist/js/')
    // Update assets paths
    .replace(/src=["']assets\//g, 'src="dist/assets/')
    .replace(/src=["']\.\.\/assets\//g, 'src="../dist/assets/')
    .replace(/href=["']assets\//g, 'href="dist/assets/')
    .replace(/href=["']\.\.\/assets\//g, 'href="../dist/assets/')
    // Update to minified versions
    .replace(/\.css"/g, '.min.css"')
    .replace(/\.js"/g, '.min.js"');
}

const htmlFiles = readdirSync(join(SRC_DIR, 'html'))
  .filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const content = readFileSync(join(SRC_DIR, 'html', file), 'utf8');
  const updated = updateHTMLPaths(content);
  writeFileSync(join(DIST_DIR, 'html', file), updated);
  console.log(`  ✓ ${file}`);
});

// Process post directory
const postDir = join(SRC_DIR, 'html', 'post');
if (existsSync(postDir)) {
  mkdirSync(join(DIST_DIR, 'html', 'post'), { recursive: true });
  const postFiles = readdirSync(postDir).filter(f => f.endsWith('.html'));
  
  postFiles.forEach(file => {
    const content = readFileSync(join(postDir, file), 'utf8');
    const updated = updateHTMLPaths(content);
    writeFileSync(join(DIST_DIR, 'html', 'post', file), updated);
  });
  console.log(`  ✓ post/ (${postFiles.length} files)`);
}

// Copy root files from public/pwa
console.log('\n📋 Copying PWA files...');
['robots.txt', 'sitemap.xml', 'manifest.json', '_headers', 'sw.js', 'offline.html'].forEach(file => {
  const srcPath = join(PROJECT_ROOT, 'public/pwa', file);
  if (existsSync(srcPath)) {
    cpSync(srcPath, join(DIST_DIR, file));
    console.log(`  ✓ ${file}`);
  }
});

// Copy main HTML files from public/html to root of dist
console.log('\n📄 Copying main HTML files...');
['index.html', 'blog.html', 'cotizador.html'].forEach(file => {
  const srcPath = join(PROJECT_ROOT, 'public/html', file);
  if (existsSync(srcPath)) {
    cpSync(srcPath, join(DIST_DIR, file));
    console.log(`  ✓ ${file} → dist/${file}`);
  }
});

// Copy blog posts from public/post to dist/post
const postDir = join(PROJECT_ROOT, 'public/post');
if (existsSync(postDir)) {
  const distPostDir = join(DIST_DIR, 'post');
  mkdirSync(distPostDir, { recursive: true });
  const postFiles = readdirSync(postDir).filter(f => f.endsWith('.html'));
  
  postFiles.forEach(file => {
    cpSync(join(postDir, file), join(distPostDir, file));
  });
  console.log(`  ✓ post/ (${postFiles.length} files)`);
}

console.log('\n✅ Build completed successfully!\n');
console.log(`📦 Output: ${DIST_DIR}`);
