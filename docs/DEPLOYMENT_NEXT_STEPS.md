# Next Steps for AWS Amplify Deployment

## Current Status

✅ **Completed:**
- Functions converted from Cloudflare Pages format to AWS Lambda format
- New directory structure: `amplify/functions/chatbot/` and `amplify/functions/send-email/`
- Updated `amplify.yml` with backend build configuration
- Created comprehensive migration documentation

⏳ **Pending:**
- Deploy Lambda functions to AWS Amplify
- Configure API routes
- Test in production

## Quick Deployment Options

### Option 1: Manual Deployment via AWS Console (Recommended - Fastest)

This is the quickest way to get the functions working:

1. **Create Lambda Functions Manually:**
   
   **For Chatbot:**
   ```bash
   cd amplify/functions/chatbot
   zip -r chatbot-function.zip .
   ```
   - Go to AWS Lambda Console
   - Create function: `celula-chatbot`
   - Runtime: Node.js 18
   - Upload `chatbot-function.zip`
   - Handler: `handler.handler`
   - Environment variables:
     - `GEMINI_API_KEY` = (your Gemini API key)
   - Timeout: 30 seconds
   - Memory: 256 MB

   **For Send-Email:**
   ```bash
   cd amplify/functions/send-email
   zip -r send-email-function.zip .
   ```
   - Create function: `celula-send-email`
   - Runtime: Node.js 18
   - Upload `send-email-function.zip`
   - Handler: `handler.handler`
   - Environment variables:
     - `RESEND_API_KEY` = (your Resend API key)
     - `CONTACT_EMAIL` = contacto@grupomusicalcelula.com
   - Timeout: 30 seconds
   - Memory: 256 MB

2. **Create API Gateway:**
   - Go to API Gateway Console
   - Create REST API: `celula-api`
   - Create resource: `/api`
   - Under `/api`, create resource: `/chatbot`
   - Add POST method → Integrate with Lambda `celula-chatbot`
   - Enable CORS
   - Create resource: `/send-email`
   - Add POST method → Integrate with Lambda `celula-send-email`
   - Enable CORS
   - Deploy API to stage: `prod`

3. **Update Frontend:**
   - Get API Gateway endpoint URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)
   - Update `js/chatbot.js` and `js/form-handler.js` with new endpoints

### Option 2: Use Amplify Hosting Compute (Simplest - AWS Amplify Feature)

AWS Amplify now has built-in compute support:

1. **Go to Amplify Console:**
   - Your app → Hosting environments
   - Click **"Add compute"**

2. **Add Chatbot Function:**
   - Function name: `chatbot`
   - Path: `/api/chatbot`
   - Upload `amplify/functions/chatbot/handler.js`
   - Set environment variables in Amplify Console

3. **Add Send-Email Function:**
   - Function name: `send-email`
   - Path: `/api/send-email`
   - Upload `amplify/functions/send-email/handler.js`
   - Set environment variables in Amplify Console

4. **Deploy:**
   - Amplify will automatically route `/api/chatbot` and `/api/send-email` to your functions

### Option 3: Keep Functions on Cloudflare (Fastest - No Migration Needed)

Since functions already work on Cloudflare Pages:

1. **Deploy static site on AWS Amplify** (current setup)
2. **Keep functions on Cloudflare Pages**
3. **Update frontend to call Cloudflare endpoints:**
   ```javascript
   // In js/chatbot.js and js/form-handler.js
   const CHATBOT_API = 'https://grupomusicalcelula.com/api/chatbot';
   const EMAIL_API = 'https://grupomusicalcelula.com/api/send-email';
   ```

**Pros:**
- ✅ Functions already work
- ✅ No refactoring needed
- ✅ CORS already configured
- ✅ Secrets already set up
- ✅ Zero downtime

**Cons:**
- ❌ Split infrastructure (Amplify + Cloudflare)
- ❌ Two deployment processes

## Recommended Approach

**For immediate deployment: Option 3 (Hybrid)**

This gets the site live immediately while you work on full Lambda migration:

1. Deploy static site to AWS Amplify
2. Functions stay on Cloudflare Pages
3. No code changes needed
4. Everything works immediately

**For long-term: Option 1 (Manual Lambda)**

Once you're comfortable, migrate to full AWS stack:

1. Create Lambda functions manually
2. Set up API Gateway
3. Test thoroughly
4. Update frontend
5. Monitor CloudWatch logs

## Commands to Deploy Now

### Deploy to AWS Amplify (Static Site Only)

```bash
# Commit Lambda functions
git add amplify/
git add amplify.yml
git add docs/LAMBDA_MIGRATION_GUIDE.md
git add docs/DEPLOYMENT_NEXT_STEPS.md
git commit -m "feat: Convert functions to AWS Lambda format

- Migrate from Cloudflare Pages to AWS Lambda
- Create amplify/functions/chatbot/handler.js
- Create amplify/functions/send-email/handler.js
- Update amplify.yml for Lambda deployment
- Add comprehensive migration documentation"

# Push to trigger Amplify build
git push origin Desplegada
```

### Keep Functions on Cloudflare

```bash
# Deploy to Cloudflare Pages (functions)
npx wrangler pages deploy dist --project-name=celula-site

# Configure secrets (if not already done)
npx wrangler pages secret put GEMINI_API_KEY
npx wrangler pages secret put RESEND_API_KEY
```

## Testing After Deployment

### Test Static Site (Amplify)
Visit: `https://your-app-id.amplifyapp.com`

### Test Functions (Cloudflare)
```bash
# Test chatbot
curl -X POST https://grupomusicalcelula.com/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"history":[{"role":"user","parts":[{"text":"Hola"}]}]}'

# Test email
curl -X POST https://grupomusicalcelula.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"123"}}'
```

## Monitoring

### Check Amplify Build Logs
AWS Amplify Console → Your app → Build logs

### Check Cloudflare Function Logs
Cloudflare Dashboard → Pages → celula-site → Functions

### Check Frontend Errors
Browser DevTools → Console (F12)

## Rollback Plan

If anything breaks:

```bash
# Revert Git changes
git revert HEAD
git push origin Desplegada

# Or redeploy previous version in Amplify Console
# Go to: Deployments → Click on previous successful build → Redeploy
```

## Support Resources

- **Lambda Migration Guide:** `docs/LAMBDA_MIGRATION_GUIDE.md`
- **Amplify Functions Fix:** `docs/AMPLIFY_FUNCTIONS_FIX.md`
- **AWS Secrets Setup:** `docs/AWS_SECRETS_SETUP.md`
- **Functions Testing:** `docs/FUNCTIONS_TESTING.md`

## Decision Time

**Choose one approach and execute:**

1. 🚀 **Option 3 (Hybrid)** - Deploy now, works immediately
2. 🔧 **Option 1 (Full Lambda)** - Takes time, full AWS stack
3. 🌐 **Option 2 (Amplify Compute)** - Simplest if feature available

**My recommendation:** Start with Option 3 (Hybrid), migrate to Option 1 later when ready.
