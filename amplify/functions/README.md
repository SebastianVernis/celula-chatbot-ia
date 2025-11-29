# AWS Lambda Functions

This directory contains AWS Lambda functions for Grupo Musical La Célula.

## Functions

### 1. chatbot/
Google Gemini AI powered chatbot

**Handler:** `handler.handler`  
**Runtime:** Node.js 18  
**Timeout:** 30 seconds  
**Memory:** 256 MB  
**Environment Variables:**
- `GEMINI_API_KEY` (required)

**Endpoint:** `/api/chatbot`  
**Method:** POST

### 2. send-email/
Resend API powered email delivery

**Handler:** `handler.handler`  
**Runtime:** Node.js 18  
**Timeout:** 30 seconds  
**Memory:** 256 MB  
**Environment Variables:**
- `RESEND_API_KEY` (required)
- `CONTACT_EMAIL` (required)

**Endpoint:** `/api/send-email`  
**Method:** POST

## Deployment

### Create Deployment Packages

```bash
# Chatbot
cd chatbot
npm install --production
zip -r ../chatbot-function.zip .

# Send Email
cd ../send-email
npm install --production
zip -r ../send-email-function.zip .
```

### Upload to AWS Lambda

1. Go to AWS Lambda Console
2. Create function with Node.js 18 runtime
3. Upload ZIP file
4. Set handler to `handler.handler`
5. Configure environment variables
6. Set timeout to 30 seconds
7. Set memory to 256 MB

### Connect to API Gateway

1. Create REST API in API Gateway
2. Create resources: `/api/chatbot` and `/api/send-email`
3. Add POST methods
4. Integrate with Lambda functions
5. Enable CORS
6. Deploy to stage

## Testing Locally

```bash
# Install dependencies
cd chatbot && npm install

# Run handler (requires env vars)
export GEMINI_API_KEY=your-key
node -e "
const {handler} = require('./handler.js');
handler({
  httpMethod: 'POST',
  body: JSON.stringify({
    history: [{role: 'user', parts: [{text: 'test'}]}]
  })
}).then(console.log);
"
```

## Format

These functions use AWS Lambda format:

```javascript
export const handler = async (event) => {
  // event.httpMethod
  // event.body
  // process.env.VAR
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  };
};
```

## Documentation

See `../../docs/` for complete documentation:
- `LAMBDA_MIGRATION_GUIDE.md` - Migration guide
- `DEPLOYMENT_NEXT_STEPS.md` - Deployment options
- `AWS_SECRETS_SETUP.md` - Environment variable setup
