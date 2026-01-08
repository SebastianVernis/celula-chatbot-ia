#!/usr/bin/env node

// Script para validar sitemaps contra estándares XML y sitemap.org
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const BASE_URL = 'https://www.grupomusicalcelula.com';

// ANSI colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

let hasErrors = false;
let hasWarnings = false;

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateXML(content, filename) {
    log(`\nValidating ${filename}...`, 'blue');
    
    // Check XML declaration
    if (!content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
        log('  ✗ Missing or invalid XML declaration', 'red');
        hasErrors = true;
    } else {
        log('  ✓ Valid XML declaration', 'green');
    }
    
    // Check for proper opening tag
    if (filename.includes('index')) {
        if (!content.includes('<sitemapindex')) {
            log('  ✗ Missing <sitemapindex> opening tag', 'red');
            hasErrors = true;
        } else {
            log('  ✓ Valid <sitemapindex> opening tag', 'green');
        }
    } else {
        if (!content.includes('<urlset')) {
            log('  ✗ Missing <urlset> opening tag', 'red');
            hasErrors = true;
        } else {
            log('  ✓ Valid <urlset> opening tag', 'green');
        }
    }
    
    // Check namespace
    if (!content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        log('  ✗ Missing or invalid namespace', 'red');
        hasErrors = true;
    } else {
        log('  ✓ Valid namespace', 'green');
    }
    
    // Check for closing tag
    if (filename.includes('index')) {
        if (!content.includes('</sitemapindex>')) {
            log('  ✗ Missing </sitemapindex> closing tag', 'red');
            hasErrors = true;
        } else {
            log('  ✓ Valid closing tag', 'green');
        }
    } else {
        if (!content.includes('</urlset>')) {
            log('  ✗ Missing </urlset> closing tag', 'red');
            hasErrors = true;
        } else {
            log('  ✓ Valid closing tag', 'green');
        }
    }
}

function validateURLs(content, filename) {
    log(`\nValidating URLs in ${filename}...`, 'blue');
    
    // Extract all <loc> tags
    const locRegex = /<loc>(.*?)<\/loc>/g;
    const urls = [];
    let match;
    
    while ((match = locRegex.exec(content)) !== null) {
        urls.push(match[1]);
    }
    
    log(`  Found ${urls.length} URLs`, 'blue');
    
    if (urls.length === 0) {
        log('  ⚠ Warning: No URLs found in sitemap', 'yellow');
        hasWarnings = true;
        return;
    }
    
    // Validate each URL
    let validUrls = 0;
    let invalidUrls = 0;
    
    urls.forEach(url => {
        // Check if URL starts with BASE_URL
        if (!url.startsWith(BASE_URL)) {
            log(`  ✗ Invalid URL base: ${url}`, 'red');
            invalidUrls++;
            hasErrors = true;
        } else if (!url.startsWith('https://')) {
            log(`  ✗ URL not using HTTPS: ${url}`, 'red');
            invalidUrls++;
            hasErrors = true;
        } else if (url.includes(' ')) {
            log(`  ✗ URL contains spaces: ${url}`, 'red');
            invalidUrls++;
            hasErrors = true;
        } else if (url.includes('\\')) {
            log(`  ✗ URL contains backslashes: ${url}`, 'red');
            invalidUrls++;
            hasErrors = true;
        } else {
            validUrls++;
        }
    });
    
    log(`  ✓ Valid URLs: ${validUrls}`, 'green');
    if (invalidUrls > 0) {
        log(`  ✗ Invalid URLs: ${invalidUrls}`, 'red');
    }
}

function validateDates(content, filename) {
    log(`\nValidating dates in ${filename}...`, 'blue');
    
    // Extract all <lastmod> tags
    const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/g;
    const dates = [];
    let match;
    
    while ((match = lastmodRegex.exec(content)) !== null) {
        dates.push(match[1]);
    }
    
    if (dates.length === 0) {
        log('  ⚠ Warning: No lastmod dates found', 'yellow');
        hasWarnings = true;
        return;
    }
    
    log(`  Found ${dates.length} dates`, 'blue');
    
    // Validate date format (YYYY-MM-DD or ISO 8601)
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.*)?$/;
    let validDates = 0;
    let invalidDates = 0;
    
    dates.forEach(date => {
        if (dateRegex.test(date)) {
            validDates++;
        } else {
            log(`  ✗ Invalid date format: ${date}`, 'red');
            invalidDates++;
            hasErrors = true;
        }
    });
    
    log(`  ✓ Valid dates: ${validDates}`, 'green');
    if (invalidDates > 0) {
        log(`  ✗ Invalid dates: ${invalidDates}`, 'red');
    }
}

function validatePriorities(content, filename) {
    log(`\nValidating priorities in ${filename}...`, 'blue');
    
    // Extract all <priority> tags
    const priorityRegex = /<priority>(.*?)<\/priority>/g;
    const priorities = [];
    let match;
    
    while ((match = priorityRegex.exec(content)) !== null) {
        priorities.push(match[1]);
    }
    
    if (priorities.length === 0) {
        log('  ⚠ No priorities found (optional)', 'yellow');
        return;
    }
    
    log(`  Found ${priorities.length} priorities`, 'blue');
    
    // Validate priority values (0.0 to 1.0)
    let validPriorities = 0;
    let invalidPriorities = 0;
    
    priorities.forEach(priority => {
        const val = parseFloat(priority);
        if (isNaN(val) || val < 0.0 || val > 1.0) {
            log(`  ✗ Invalid priority value: ${priority}`, 'red');
            invalidPriorities++;
            hasErrors = true;
        } else {
            validPriorities++;
        }
    });
    
    log(`  ✓ Valid priorities: ${validPriorities}`, 'green');
    if (invalidPriorities > 0) {
        log(`  ✗ Invalid priorities: ${invalidPriorities}`, 'red');
    }
}

function validateFileSize(filepath, filename) {
    log(`\nValidating file size for ${filename}...`, 'blue');
    
    const stats = fs.statSync(filepath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    // Sitemap files should be under 50MB (uncompressed)
    if (fileSizeMB > 50) {
        log(`  ✗ File size too large: ${fileSizeMB.toFixed(2)}MB (max 50MB)`, 'red');
        hasErrors = true;
    } else if (fileSizeMB > 10) {
        log(`  ⚠ Warning: File size is large: ${fileSizeMB.toFixed(2)}MB`, 'yellow');
        hasWarnings = true;
    } else {
        log(`  ✓ File size OK: ${fileSizeMB.toFixed(2)}MB`, 'green');
    }
    
    // Check URL count (max 50,000 per sitemap)
    const content = fs.readFileSync(filepath, 'utf8');
    const urlCount = (content.match(/<loc>/g) || []).length;
    
    if (urlCount > 50000) {
        log(`  ✗ Too many URLs: ${urlCount} (max 50,000)`, 'red');
        hasErrors = true;
    } else {
        log(`  ✓ URL count OK: ${urlCount}`, 'green');
    }
}

// Main validation
console.log('\n🔍 Starting sitemap validation...\n');
log('='.repeat(60), 'blue');

const sitemapFiles = [
    'sitemap.xml',
    'sitemap-index.xml',
    'sitemap-main.xml',
    'sitemap-styles.xml',
    'sitemap-scripts.xml',
    'sitemap-images.xml',
    'sitemap-videos.xml'
];

sitemapFiles.forEach(filename => {
    const filepath = path.join(DIST_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
        log(`\n⚠ Warning: ${filename} not found`, 'yellow');
        hasWarnings = true;
        return;
    }
    
    const content = fs.readFileSync(filepath, 'utf8');
    
    log(`\n${'='.repeat(60)}`, 'blue');
    log(`Validating: ${filename}`, 'blue');
    log('='.repeat(60), 'blue');
    
    validateXML(content, filename);
    validateURLs(content, filename);
    validateDates(content, filename);
    validatePriorities(content, filename);
    validateFileSize(filepath, filename);
});

// Final summary
log(`\n${'='.repeat(60)}`, 'blue');
log('Validation Summary', 'blue');
log('='.repeat(60), 'blue');

if (hasErrors) {
    log('\n❌ Validation FAILED - Errors found', 'red');
    process.exit(1);
} else if (hasWarnings) {
    log('\n⚠️  Validation PASSED with warnings', 'yellow');
    process.exit(0);
} else {
    log('\n✅ Validation PASSED - All checks successful!', 'green');
    process.exit(0);
}
