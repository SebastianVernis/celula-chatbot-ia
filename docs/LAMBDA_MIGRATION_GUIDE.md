# AWS Lambda Migration Guide

## Overview

This guide covers the complete migration from Cloudflare Pages Functions to AWS Lambda for AWS Amplify deployment.

## Changes Made

### 1. Directory Structure

**Old (Cloudflare Pages):**
```
functions/
├── api/
│   ├── chatbot.js      # Cloudflare format
│   └── send-email.js   # Cloudflare format
└── package.json
```

**New (AWS Lambda):**
```
amplify/
└── functions/
    ├── chatbot/
    │   ├── handler.js      # Lambda format
    │   └── package.json
    └── send-email/
        ├── handler.js      # Lambda format
        └── package.json
```

### 2. Code Format Changes

#### Function Signature
**Before (Cloudflare):**
```javascript
export async function onRequest(context) {
  const apiKey = context.env.GEMINI_API_KEY;
  return new Response(JSON.stringify(data), {
    headers: {'Content-Type': 'application/json'}
  });
}
```

**After (Lambda):**
```javascript
export const handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  };
};
```

#### Environment Variables
- **Before:** `context.env.VARIABLE_NAME`
- **After:** `process.env.VARIABLE_NAME`

#### Request Body Parsing
**Before (Cloudflare):**
```javascript
const data = await context.request.json();
```

**After (Lambda):**
```javascript
const data = typeof event.body === 'string' 
  ? JSON.parse(event.body) 
  : event.body;
```

#### HTTP Method Detection
**Before (Cloudflare):**
```javascript
if (context.request.method === "POST")
```

**After (Lambda):**
```javascript
const method = event.httpMethod || event.requestContext?.http?.method;
if (method === "POST")
```

### 3. Response Format

#### Success Response
**Before:**
```javascript
return new Response(JSON.stringify({success: true}), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});
```

**After:**
```javascript
return {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({success: true})
};
```

#### Error Response
**Before:**
```javascript
return new Response(JSON.stringify({error: 'Message'}), {
  status: 500,
  headers: {...}
});
```

**After:**
```javascript
return {
  statusCode: 500,
  headers: {...},
  body: JSON.stringify({error: 'Message'})
};
```

### 4. CORS Handling

Both formats handle CORS similarly, but response structure differs:

**Lambda CORS:**
```javascript
if (event.httpMethod === "OPTIONS") {
  return {
    statusCode: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    },
    body: ""
  };
}
```

## Deployment Steps

### Step 1: Set Up Lambda Functions in Amplify

#### Option A: Using Amplify Console UI

1. **Go to AWS Amplify Console:**
   - Navigate to your app
   - Go to **Hosting > Compute** 
   - Click **Add compute**

2. **Create Chatbot Function:**
   - Function name: `chatbot`
   - Runtime: Node.js 18
   - Handler: `handler.handler`
   - Code: Upload `amplify/functions/chatbot/handler.js`
   - Environment variables:
     - `GEMINI_API_KEY` = (your key)

3. **Create Send-Email Function:**
   - Function name: `send-email`
   - Runtime: Node.js 18
   - Handler: `handler.handler`
   - Code: Upload `amplify/functions/send-email/handler.js`
   - Environment variables:
     - `RESEND_API_KEY` = (your key)
     - `CONTACT_EMAIL` = contacto@grupomusicalcelula.com

4. **Configure API Routes:**
   - Route: `/api/chatbot` → `chatbot` function
   - Route: `/api/send-email` → `send-email` function

#### Option B: Using Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify in project
amplify init

# Add functions
amplify add function
# Follow prompts for chatbot function

amplify add function
# Follow prompts for send-email function

# Push to AWS
amplify push
```

#### Option C: Using AWS Lambda Directly + API Gateway

1. **Create Lambda Functions:**
```bash
# Package chatbot function
cd amplify/functions/chatbot
zip -r chatbot.zip .

# Package send-email function
cd ../send-email
zip -r send-email.zip .
```

2. **Upload to Lambda Console:**
   - Go to AWS Lambda Console
   - Create function `celula-chatbot`
   - Upload `chatbot.zip`
   - Set handler: `handler.handler`
   - Set runtime: Node.js 18
   - Add environment variable: `GEMINI_API_KEY`

   - Create function `celula-send-email`
   - Upload `send-email.zip`
   - Set handler: `handler.handler`
   - Set runtime: Node.js 18
   - Add environment variables: `RESEND_API_KEY`, `CONTACT_EMAIL`

3. **Create API Gateway:**
   - Go to API Gateway Console
   - Create REST API
   - Create resources: `/api/chatbot` and `/api/send-email`
   - Add POST method to each
   - Integrate with corresponding Lambda functions
   - Enable CORS
   - Deploy API

4. **Update Frontend:**
   - Change API endpoints in frontend code to API Gateway URLs

### Step 2: Configure Environment Variables

In AWS Amplify Console:
1. Go to **App settings > Environment variables**
2. Add variables:
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
3. These will be available as `process.env.*` in Lambda functions

### Step 3: Update amplify.yml

The `amplify.yml` has been updated to build Lambda functions:

```yaml
backend:
  phases:
    build:
      commands:
        - cd amplify/functions/chatbot && npm install --production
        - cd amplify/functions/send-email && npm install --production
```

### Step 4: Deploy

```bash
# Commit changes
git add .
git commit -m "Migrate to AWS Lambda functions"
git push origin main
```

Amplify will automatically detect and deploy the Lambda functions.

## Testing

### Test Chatbot Function

```bash
curl -X POST https://your-app.amplifyapp.com/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "history": [
      {
        "role": "user",
        "parts": [{"text": "Hola"}]
      }
    ]
  }'
```

Expected response:
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {"text": "¡Hola! ¿En qué puedo ayudarte?"}
        ]
      }
    }
  ]
}
```

### Test Send-Email Function

```bash
curl -X POST https://your-app.amplifyapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chatbot_lead",
    "leadData": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "1234567890",
      "eventType": "Prueba"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email enviado",
  "emailId": "..."
}
```

## Troubleshooting

### Functions Return 404

**Cause:** Functions not properly configured in Amplify  
**Solution:**
1. Check that functions are in `amplify/functions/` directory
2. Verify `amplify.yml` has backend build commands
3. Check Amplify Console > Hosting > Compute for function status
4. Redeploy application

### Environment Variables Not Available

**Cause:** Variables not configured in Amplify Console  
**Solution:**
1. Go to App settings > Environment variables
2. Add all required variables
3. Redeploy application
4. Check logs: `console.log('Env keys:', Object.keys(process.env))`

### CORS Errors

**Cause:** Missing CORS headers or wrong configuration  
**Solution:**
1. Verify CORS headers in handler responses
2. Ensure OPTIONS method returns correct headers
3. Check that `Access-Control-Allow-Origin: *` is set

### Lambda Timeout

**Cause:** Function execution exceeds timeout limit  
**Solution:**
1. Increase timeout in Lambda configuration (default: 3s, max: 900s)
2. Optimize code for faster execution
3. Check Gemini/Resend API response times

### Parse Errors

**Cause:** Request body not properly parsed  
**Solution:**
```javascript
// Always handle both string and object
const data = typeof event.body === 'string' 
  ? JSON.parse(event.body) 
  : event.body;
```

## Rollback Plan

If Lambda migration fails, you can quickly rollback to Cloudflare Pages:

1. **Revert to Cloudflare deployment:**
```bash
cd /home/sebastianvernis/Proyectos/deploymentcelula
npx wrangler pages deploy dist --project-name=celula-site
```

2. **Configure secrets in Cloudflare:**
```bash
npx wrangler pages secret put GEMINI_API_KEY
npx wrangler pages secret put RESEND_API_KEY
```

3. **Update frontend API URLs** (if changed)

## Monitoring

### CloudWatch Logs

View Lambda function logs:
1. AWS Console → CloudWatch → Log groups
2. Find `/aws/lambda/chatbot` and `/aws/lambda/send-email`
3. View real-time logs for debugging

### Key Metrics

Monitor:
- Invocation count
- Error rate
- Duration
- Throttles
- Concurrent executions

### Alerts

Set up CloudWatch alarms for:
- Error rate > 5%
- Duration > 25 seconds
- Throttled requests > 0

## Cost Optimization

### Lambda Pricing

- First 1M requests/month: FREE
- $0.20 per 1M requests after that
- $0.0000166667 per GB-second

### Recommendations

1. **Reduce memory if possible** (current: 256MB)
2. **Cache Gemini responses** for common queries
3. **Implement connection pooling** for Resend API
4. **Use Lambda power tuning** for optimal configuration

## Next Steps

1. ✅ Migrate functions to Lambda format (DONE)
2. ⏳ Deploy to AWS Amplify
3. ⏳ Test both functions in production
4. ⏳ Monitor for 24 hours
5. ⏳ Optimize based on CloudWatch metrics
6. ⏳ Set up CloudWatch alarms
7. ⏳ Document production endpoints

## Resources

- [AWS Lambda Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)
- [AWS Amplify Functions](https://docs.amplify.aws/hosting/functions/)
- [API Gateway + Lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)
- [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/)
