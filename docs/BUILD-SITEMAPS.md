# Build Process - Sitemap & Meta Files Generation

## Overview

The build process automatically generates all sitemaps and meta files during `npm run build`.

## Generated Files

### Sitemaps (7 files)
- `sitemap.xml` - Combined sitemap (all resources)
- `sitemap-index.xml` - Sitemap index file
- `sitemap-main.xml` - HTML pages only
- `sitemap-styles.xml` - CSS files
- `sitemap-scripts.xml` - JavaScript files
- `sitemap-images.xml` - Image files
- `sitemap-videos.xml` - Video files

### Meta Files (5 files)
- `manifest.json` - PWA manifest
- `robots.txt` - Search engine directives
- `llms.txt` - LLM/AI indexing information
- `humans.txt` - Development credits
- `.well-known/security.txt` - Security contact info

## Build Commands

```bash
# Full build (validates, minifies, builds, generates sitemaps & meta files)
npm run build

# Test sitemap generation
npm run test:build

# Validate generated sitemaps
node tools/validate-sitemap.js
```

## Build Steps

1. **Prebuild**: `npm run validate && npm run minify`
2. **Build**: `node tools/build.js`
   - Clean dist directory
   - Copy HTML, CSS, JS, assets
   - Copy static files
   - **Generate sitemaps** (tools/generate-sitemaps.js)
   - **Generate meta files** (tools/generate-meta-files.js)
3. **Validation**: All sitemaps validated against sitemap.org standards

## Scripts

### `tools/generate-sitemaps.js`
Generates all sitemap files by:
- Scanning dist directory for HTML, CSS, JS, images, videos
- Creating proper XML structure with namespaces
- URL encoding spaces and special characters
- Setting priorities and changefreq for HTML pages
- Adding lastmod dates from file modification times

### `tools/generate-meta-files.js`
Generates meta files:
- **manifest.json**: PWA configuration with icons, shortcuts
- **robots.txt**: Crawling directives and sitemap references
- **llms.txt**: Structured information for AI/LLMs
- **humans.txt**: Development team credits
- **security.txt**: Security contact information

### `tools/validate-sitemap.js`
Validates sitemaps against standards:
- XML declaration and structure
- Proper namespaces
- Valid URLs (HTTPS, no spaces)
- Date format (ISO 8601)
- Priority values (0.0-1.0)
- File size limits (<50MB)
- URL count limits (<50,000)

### `tools/test-build-sitemaps.js`
Integration test that:
- Creates clean build
- Verifies all files are generated
- Validates sitemap content
- Checks timestamps are updated

## Troubleshooting

### Permission Errors

If you see:
```
❌ Error: No write permissions to dist directory
```

**Solution**:
```bash
sudo chown -R $USER:$USER dist/
```

### Validation Errors

Run validation manually:
```bash
node tools/validate-sitemap.js
```

Common issues:
- **URLs with spaces**: Fixed automatically with URL encoding
- **Invalid dates**: Check file modification times
- **Missing namespaces**: Check sitemap generation script

## Standards Compliance

All sitemaps comply with:
- [Sitemaps.org Protocol](https://www.sitemaps.org/protocol.html)
- XML 1.0 specification
- UTF-8 encoding
- HTTPS URLs only
- Proper URL encoding

## CI/CD Integration

The build process is CI/CD ready:
- Exit code 0 on success
- Exit code 1 on validation failure
- Clear error messages
- No manual intervention required

## Files Modified

- `tools/build.js` - Added sitemap & meta generation steps
- `tools/generate-sitemaps.js` - New: Sitemap generation
- `tools/generate-meta-files.js` - New: Meta files generation
- `tools/validate-sitemap.js` - New: Sitemap validation
- `tools/test-build-sitemaps.js` - New: Build integration test
- `package.json` - Added test:build script

## Quality Assurance

✅ All sitemaps validated against sitemap.org standards  
✅ URL encoding for special characters  
✅ Proper XML structure and namespaces  
✅ File size and URL count within limits  
✅ Automated generation during build  
✅ Integration tests included  

---

Last updated: January 5, 2026
