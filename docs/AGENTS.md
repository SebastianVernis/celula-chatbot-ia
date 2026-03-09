# AGENTS.md - Guide for AI Assistants

## Project Overview

**Grupo Musical Versátil La Célula** is a static website for a musical band in Mexico. The site includes:

- Marketing pages (home, services, gallery)
- Blog system
- Contact form with Resend API integration
- AI Chatbot powered by Google Gemini (multi-provider support)
- Quote request system
- Various performance optimizations

The site is deployed on **Vercel**, which handles static site hosting and serverless functions.

## Repository Structure

```
celula-site/
├── index.html, blog.html, cotizador.html, contacto.html  # Main pages
├── post/                 # Blog post files
├── js/                   # JavaScript files (both .js and minified .min.js versions)
├── css/                  # CSS stylesheets
├── api/                  # Serverless function sources
├── assets/               # Images, videos, icons, etc.
├── tools/                # Build and utility scripts
└── docs/                 # Documentation files
```

## Essential Commands

### Development & Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run validation checks
npm run validate

# Run ESLint (with auto-fix)
npm run lint

# Local deployment testing
node test-local-deployment.js

# Test specific components
node test-chatbot-email.js
node test-gemini-api.js
node test-multi-provider.js
```

### Build & Deployment

```bash
# Build the site
npm run build

# Deploy to production
npm run deploy

# Deploy preview version
npm run deploy:preview
```

## Key Technical Details

### Architectural Patterns

- **Modular JavaScript**: ES6+ modules
- **Multi-provider Design**: Supports multiple AI/API providers
- **Serverless Architecture**: Functions deployable across providers
- **Performance-First**: Optimization scripts, minification

### Environment & Compatibility

- **Node Version**: 18.0.0+
- **Module System**: ES Modules (`"type": "module"`)
- **Deployment Platform**: Vercel
- **Supported Browsers**: Modern browsers with ES6+ support

## Coding Conventions

### General Rules
- Follow existing patterns in each module/file
- Prioritize code readability over clever solutions
- Add inline documentation for complex logic
- Use ESLint for style enforcement

### JavaScript Specifics
- Prefer const/let over var
- Use arrow functions for callbacks
- Implement error handling in async functions
- Minimize global scope pollution

### Testing Philosophy
- Test individual components thoroughly
- Mock external services (Gemini, Resend APIs)
- Cover edge cases in API interactions
- Verify both success and failure scenarios

## Critical Configuration Points

### Environment Variables

Required in Vercel/deployment environment:
- `GEMINI_API_KEY`: Google Gemini API key
- `RESEND_API_KEY`: Resend email service key
- `CONTACT_EMAIL`: Target email for form submissions

### Security Considerations
- Never commit API keys or secrets
- Use environment-specific configuration
- Implement rate limiting on API endpoints
- Validate and sanitize all user inputs

## Troubleshooting

### Common Issues
1. Verify API keys are current and have sufficient quota
2. Check network connectivity for external service calls
3. Review Vercel function logs for detailed errors
4. Validate environment variable configurations

### Performance Monitoring
- Use Vercel Analytics for performance insights
- Monitor function cold start times
- Check browser console for JavaScript errors

## Recommended Development Workflow

1. Clone repository
2. Install dependencies with `npm install`
3. Set up local `.env` with required keys
4. Run validation with `npm run validate`
5. Start local development server with `npm run dev`
6. Run tests before committing changes
7. Use ESLint to maintain code quality

## Limitations & Known Constraints

- Functions have timeout limits on Vercel
- API calls may have rate limits
- Browser compatibility depends on ES6+ support
- Performance varies with external API response times

## Future Improvement Areas
- Enhance multi-provider AI strategy
- Implement more comprehensive error logging
- Add more granular performance monitoring
- Expand test coverage for edge cases