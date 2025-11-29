# Implementation Checklist - AWS Lambda Deployment

## ✅ Phase 1: Code Migration (COMPLETED)

- [x] Convert chatbot.js to Lambda format
- [x] Convert send-email.js to Lambda format
- [x] Create amplify/functions directory structure
- [x] Update amplify.yml configuration
- [x] Write comprehensive documentation
- [x] Commit and push to GitHub

**Result:** All code is ready for AWS Lambda deployment.

---

## 🔄 Phase 2: AWS Deployment (NEXT STEPS)

### Option A: Manual Lambda + API Gateway

#### Step 1: Create Lambda Functions

- [ ] **Chatbot Function:**
  ```bash
  cd amplify/functions/chatbot
  npm install --production
  zip -r chatbot-function.zip .
  ```
  - [ ] Go to AWS Lambda Console
  - [ ] Create function: `celula-chatbot`
  - [ ] Upload ZIP
  - [ ] Set handler: `handler.handler`
  - [ ] Set runtime: Node.js 18
  - [ ] Add env var: `GEMINI_API_KEY`
  - [ ] Set timeout: 30 seconds
  - [ ] Set memory: 256 MB

- [ ] **Send-Email Function:**
  ```bash
  cd amplify/functions/send-email
  npm install --production
  zip -r send-email-function.zip .
  ```
  - [ ] Create function: `celula-send-email`
  - [ ] Upload ZIP
  - [ ] Set handler: `handler.handler`
  - [ ] Set runtime: Node.js 18
  - [ ] Add env vars: `RESEND_API_KEY`, `CONTACT_EMAIL`
  - [ ] Set timeout: 30 seconds
  - [ ] Set memory: 256 MB

#### Step 2: Create API Gateway

- [ ] Go to API Gateway Console
- [ ] Create REST API: `celula-api`
- [ ] Create resource: `/api`
- [ ] Create sub-resource: `/api/chatbot`
  - [ ] Add POST method
  - [ ] Integration: Lambda `celula-chatbot`
  - [ ] Enable CORS
- [ ] Create sub-resource: `/api/send-email`
  - [ ] Add POST method
  - [ ] Integration: Lambda `celula-send-email`
  - [ ] Enable CORS
- [ ] Deploy API to stage: `prod`
- [ ] Note API Gateway URL

#### Step 3: Update Frontend

- [ ] Edit `js/chatbot.js`:
  ```javascript
  const API_URL = 'https://[api-id].execute-api.[region].amazonaws.com/prod/api/chatbot';
  ```
- [ ] Edit `js/form-handler.js`:
  ```javascript
  const API_URL = 'https://[api-id].execute-api.[region].amazonaws.com/prod/api/send-email';
  ```
- [ ] Commit and push changes
- [ ] Wait for Amplify to rebuild

#### Step 4: Test in Production

- [ ] Test chatbot:
  ```bash
  curl -X POST [API_URL]/api/chatbot \
    -H "Content-Type: application/json" \
    -d '{"history":[{"role":"user","parts":[{"text":"Hola"}]}]}'
  ```
- [ ] Test send-email:
  ```bash
  curl -X POST [API_URL]/api/send-email \
    -H "Content-Type: application/json" \
    -d '{"type":"chatbot_lead","leadData":{"name":"Test","email":"test@test.com","phone":"123"}}'
  ```
- [ ] Open website and test chatbot UI
- [ ] Fill contact form and verify email delivery
- [ ] Check CloudWatch logs for errors

---

### Option B: Hybrid Deployment (FASTEST)

- [ ] **Deploy static site to Amplify** (already done - just push)
- [ ] **Keep functions on Cloudflare Pages:**
  ```bash
  npx wrangler pages deploy dist --project-name=celula-site
  ```
- [ ] **No code changes needed** - functions already point to Cloudflare
- [ ] **Test everything works:**
  - [ ] Visit Amplify URL
  - [ ] Test chatbot
  - [ ] Test contact form
  - [ ] Verify emails arrive

---

### Option C: Amplify Hosting Compute

- [ ] Go to AWS Amplify Console
- [ ] Navigate to your app
- [ ] Click **"Hosting" → "Compute"**
- [ ] Click **"Add compute"**
- [ ] **Add Chatbot:**
  - [ ] Function name: `chatbot`
  - [ ] Path: `/api/chatbot`
  - [ ] Upload: `amplify/functions/chatbot/handler.js`
  - [ ] Environment: `GEMINI_API_KEY`
- [ ] **Add Send-Email:**
  - [ ] Function name: `send-email`
  - [ ] Path: `/api/send-email`
  - [ ] Upload: `amplify/functions/send-email/handler.js`
  - [ ] Environment: `RESEND_API_KEY`, `CONTACT_EMAIL`
- [ ] Deploy
- [ ] Test endpoints

---

## 📊 Phase 3: Monitoring & Optimization

- [ ] **Set up CloudWatch Alarms:**
  - [ ] Error rate > 5%
  - [ ] Duration > 25 seconds
  - [ ] Throttled requests > 0

- [ ] **Monitor Metrics:**
  - [ ] Invocation count
  - [ ] Error count
  - [ ] Duration average
  - [ ] Cost tracking

- [ ] **Optimize Performance:**
  - [ ] Review CloudWatch Insights
  - [ ] Optimize cold start times
  - [ ] Consider provisioned concurrency if needed
  - [ ] Cache common Gemini responses

---

## 🎯 Current Recommended Path

✅ **Immediate:** Option B (Hybrid)
- Deploy static site to Amplify: **DONE** (just pushed)
- Functions stay on Cloudflare: **Working**
- Zero configuration needed: **Ready to go**

⏳ **Later:** Migrate to Option A (Full Lambda)
- When you want full AWS integration
- For learning AWS Lambda deeply
- To consolidate infrastructure

---

## 📞 Get Help

If stuck:
1. **Documentation:** Check `docs/LAMBDA_MIGRATION_GUIDE.md`
2. **Logs:** AWS CloudWatch → Log groups → `/aws/lambda/[function-name]`
3. **Build:** AWS Amplify Console → Build logs
4. **Frontend:** Browser DevTools → Console (F12)

---

## 🎉 Success Criteria

Site is fully deployed when:
- [x] Code pushed to GitHub
- [ ] AWS Amplify build succeeds
- [ ] Static site loads at Amplify URL
- [ ] Chatbot responds to messages
- [ ] Contact form sends emails
- [ ] No errors in browser console
- [ ] No errors in CloudWatch logs

---

**Next Action:** Choose Option B (Hybrid) and verify everything works, OR proceed with Option A for full Lambda deployment.
