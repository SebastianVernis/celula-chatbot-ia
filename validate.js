#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Validating project structure...\n');

let errors = 0;
let warnings = 0;

// Check HTML files
console.log('📄 Checking HTML files...');
const htmlDir = join(__dirname, 'src/html');
const htmlFiles = readdirSync(htmlDir)
  .filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const content = readFileSync(join(htmlDir, file), 'utf8');
  
  // Check for missing assets
  const cssRefs = content.match(/href=["']([^"']*\.css)["']/g) || [];
  const jsRefs = content.match(/src=["']([^"']*\.js)["']/g) || [];
  const imgRefs = content.match(/src=["']([^"']*\.(jpg|jpeg|png|webp|svg))["']/gi) || [];
  
  cssRefs.forEach(ref => {
    const path = ref.match(/href=["']([^"']*)["']/)[1];
    if (path.startsWith('css/')) {
      const fullPath = join(__dirname, 'src', path);
      if (!existsSync(fullPath)) {
        console.log(`  ❌ ${file}: Missing CSS - ${path}`);
        errors++;
      }
    }
  });
  
  jsRefs.forEach(ref => {
    const path = ref.match(/src=["']([^"']*)["']/)[1];
    if (path.startsWith('js/') && !path.includes('http')) {
      const fullPath = join(__dirname, 'src', path);
      if (!existsSync(fullPath)) {
        console.log(`  ❌ ${file}: Missing JS - ${path}`);
        errors++;
      }
    }
  });
  
  // Check for common HTML issues
  if (!content.includes('<!DOCTYPE html>')) {
    console.log(`  ⚠️  ${file}: Missing DOCTYPE`);
    warnings++;
  }
  
  if (!content.includes('<html')) {
    console.log(`  ❌ ${file}: Missing <html> tag`);
    errors++;
  }
  
  console.log(`  ✓ ${file}`);
});

// Check CSS files
console.log('\n🎨 Checking CSS files...');
const cssDir = join(__dirname, 'src/css');
const cssFiles = readdirSync(cssDir)
  .filter(f => f.endsWith('.css') && !f.endsWith('.min.css'));

cssFiles.forEach(file => {
  const content = readFileSync(join(cssDir, file), 'utf8');
  
  // Check for common CSS issues
  const urlRefs = content.match(/url\(["']?([^"')]+)["']?\)/g) || [];
  
  urlRefs.forEach(ref => {
    const path = ref.match(/url\(["']?([^"')]+)["']?\)/)[1];
    if (path.startsWith('../assets/') || path.startsWith('assets/')) {
      const cleanPath = path.replace('../', '');
      const fullPath = join(__dirname, 'src', cleanPath);
      if (!existsSync(fullPath)) {
        console.log(`  ⚠️  ${file}: Referenced asset not found - ${path}`);
        warnings++;
      }
    }
  });
  
  console.log(`  ✓ ${file}`);
});

// Check JS files
console.log('\n⚙️  Checking JS files...');
const jsDir = join(__dirname, 'src/js');
const jsFiles = readdirSync(jsDir)
  .filter(f => f.endsWith('.js') && !f.endsWith('.min.js'));

jsFiles.forEach(file => {
  const content = readFileSync(join(jsDir, file), 'utf8');
  
  // Check for basic syntax errors (very basic)
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    console.log(`  ⚠️  ${file}: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
    warnings++;
  }
  
  console.log(`  ✓ ${file}`);
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Validation Summary:');
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.log('\n❌ Validation failed!');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n⚠️  Validation passed with warnings');
} else {
  console.log('\n✅ All validations passed!');
}
