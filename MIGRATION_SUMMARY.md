# AWS Lambda Migration - Summary

## ✅ What Was Done

### 1. Full Function Conversion
- **chatbot.js**: Converted from Cloudflare Pages `onRequest` to AWS Lambda `handler`
- **send-email.js**: Converted from Cloudflare Pages `onRequest` to AWS Lambda `handler`

### 2. Key Changes

| Aspect | Cloudflare Format | AWS Lambda Format |
|--------|------------------|-------------------|
| **Export** | `export async function onRequest(context)` | `export const handler = async (event)` |
| **Env Vars** | `context.env.VAR` | `process.env.VAR` |
| **Request Body** | `await context.request.json()` | `JSON.parse(event.body)` |
| **HTTP Method** | `context.request.method` | `event.httpMethod` |
| **Response** | `new Response(data, {status, headers})` | `{statusCode, headers, body}` |

### 3. New Directory Structure

```
amplify/
└── functions/
    ├── chatbot/
    │   ├── handler.js      ✅ Lambda format
    │   └── package.json
    └── send-email/
        ├── handler.js      ✅ Lambda format
        └── package.json
```

### 4. Configuration Updates
- ✅ `amplify.yml` - Root config for backend build
- ✅ `config/amplify.yml` - Updated with Lambda build commands
- ✅ `AGENTS.md` - Added critical warning about function format

### 5. Documentation Created
- ✅ `docs/LAMBDA_MIGRATION_GUIDE.md` - Complete 250+ line guide
- ✅ `docs/AMPLIFY_FUNCTIONS_FIX.md` - Problem analysis
- ✅ `docs/DEPLOYMENT_NEXT_STEPS.md` - 3 deployment options

## 🎯 Current Status

**Code:** ✅ Complete - Functions fully converted to Lambda format  
**Tests:** ⏳ Pending - Need to test in AWS environment  
**Deployment:** ⏳ Pending - Ready to deploy  
**Production:** ⏳ Pending - Awaiting deployment decision

## 📋 Next Actions Required

### Option A: Full AWS Lambda Deployment (Recommended for Learning)

1. **Create Lambda Functions:**
   ```bash
   cd amplify/functions/chatbot && zip -r chatbot.zip .
   cd ../send-email && zip -r send-email.zip .
   ```

2. **Upload to AWS Lambda Console:**
   - Create `celula-chatbot` function (Node.js 18)
   - Create `celula-send-email` function (Node.js 18)
   - Set environment variables in each

3. **Create API Gateway:**
   - REST API: `celula-api`
   - Routes: `/api/chatbot`, `/api/send-email`
   - Deploy to `prod` stage

4. **Update Frontend:**
   - Change API endpoints in `js/chatbot.js`
   - Change API endpoints in `js/form-handler.js`

**Time:** ~30 minutes  
**Difficulty:** Medium  
**Cost:** Free tier (1M requests/month)

### Option B: Hybrid Deployment (Recommended for Speed)

1. **AWS Amplify:** Static site only
2. **Cloudflare Pages:** Keep functions there (already working)
3. **Frontend:** No changes needed (already points to correct endpoints)

**Time:** ~5 minutes (just push to git)  
**Difficulty:** Easy  
**Cost:** Both free tiers

### Option C: Amplify Hosting Compute

1. **Go to Amplify Console**
2. **Add Compute** → Upload function handlers
3. **Configure routes:** `/api/chatbot`, `/api/send-email`
4. **Set environment variables**

**Time:** ~15 minutes  
**Difficulty:** Easy  
**Cost:** Free tier

## 🚀 Quick Deploy Commands

### Deploy Static Site (Works Now)
```bash
git push origin Desplegada
```
This will trigger AWS Amplify build.

### Deploy Functions to Cloudflare (If keeping hybrid)
```bash
npx wrangler pages deploy dist --project-name=celula-site
```

## ⚠️ Important Notes

1. **Environment Variables Must Be Set:**
   - AWS: Set in Amplify Console → Environment variables
   - Lambda: Set in each function's configuration
   - Values needed:
     - `GEMINI_API_KEY`
     - `RESEND_API_KEY`
     - `CONTACT_EMAIL`

2. **API Endpoints Will Change:**
   - Current (Cloudflare): `https://celula-site.pages.dev/api/*`
   - New (API Gateway): `https://[id].execute-api.[region].amazonaws.com/prod/api/*`
   - New (Amplify Compute): `https://[app-id].amplifyapp.com/api/*`

3. **Test Before Going Live:**
   ```bash
   # Test chatbot
   curl -X POST [ENDPOINT]/api/chatbot \
     -H "Content-Type: application/json" \
     -d '{"history":[{"role":"user","parts":[{"text":"test"}]}]}'
   
   # Test email
   curl -X POST [ENDPOINT]/api/send-email \
     -H "Content-Type: application/json" \
     -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"123"}}'
   ```

## 📊 Migration Progress

- [x] Analyze Cloudflare vs Lambda differences
- [x] Convert chatbot function to Lambda format
- [x] Convert send-email function to Lambda format
- [x] Create Lambda package.json files
- [x] Update amplify.yml configuration
- [x] Write comprehensive documentation
- [x] Commit changes to git
- [ ] Deploy Lambda functions to AWS
- [ ] Create API Gateway routes
- [ ] Test functions in production
- [ ] Update frontend API endpoints
- [ ] Monitor CloudWatch logs
- [ ] Set up CloudWatch alarms

## 📚 Documentation Index

1. **LAMBDA_MIGRATION_GUIDE.md** - Start here for full migration
2. **AMPLIFY_FUNCTIONS_FIX.md** - Understand the problem
3. **DEPLOYMENT_NEXT_STEPS.md** - Choose deployment approach
4. **AWS_SECRETS_SETUP.md** - Configure environment variables
5. **FUNCTIONS_TESTING.md** - Test functions thoroughly

## 🔗 Quick Links

- **Git Commit:** `69b0056` - "Migrate serverless functions to AWS Lambda format"
- **Branch:** `Desplegada`
- **Files Changed:** 10 files, 1513 insertions(+)
- **New Files:** 8
- **Modified Files:** 2

## 🎓 What You Learned

- Differences between Cloudflare Pages Functions and AWS Lambda
- How to convert Web Standard Response to Lambda response format
- How environment variables work in different platforms
- API Gateway basics
- Lambda function configuration
- Hybrid cloud architecture (multi-cloud deployment)

## 💡 Recommendation

**Start with Option B (Hybrid):**
1. Push to git → triggers Amplify build
2. Static site deploys to Amplify
3. Functions stay on Cloudflare (already working)
4. Test everything works
5. Later, migrate to full Lambda (Option A) when comfortable

**Why?**
- ✅ Zero downtime
- ✅ Works immediately
- ✅ No risk
- ✅ Can migrate functions later
- ✅ Learn AWS Lambda at your own pace

## 📞 Support

If you need help:
1. Check the documentation in `docs/`
2. Review CloudWatch logs (for Lambda issues)
3. Check browser console (for frontend issues)
4. Review Amplify build logs (for deployment issues)

---

**Ready to deploy?** Choose your option above and follow the steps!
