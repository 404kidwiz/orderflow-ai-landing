# OrderFlow AI — Backend Setup: Step-by-Step Guide

**Time to complete:** 15-20 minutes  
**Cost:** $0 (all free tiers)

---

## STEP 1 — Neon (Database)

**What it does:** Stores your orders, call logs, restaurant configs, and analytics. PostgreSQL.

### 1.1 — Create Account
1. Go to https://neon.tech
2. Click **"Sign Up"** → choose **"GitHub"** (fastest, no new password to remember)
3. Authorize Neon to access your GitHub account
4. You'll land on the Neon dashboard

### 1.2 — Create a Project
1. Click the **"New Project"** button (orange, top-right)
2. Fill in:
   - **Project name:** `orderflow`
   - **Region:** `US East` ← critical — Twilio webhooks need low latency
   - **Database name:** `orderflow`
3. Click **"Create Project"**

### 1.3 — Copy Your Connection String
1. After project is created, you'll see a modal titled **"Connection Details"**
2. Under **"Connection string"**, click the **copy button** — it looks like two overlapping squares
3. The string looks like:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Paste this somewhere safe** — you'll paste it into Railway in Step 3
5. Click **"Done"**

> ⚠️ The password in that connection string is your database password. Don't share it. It's safe to put in Railway's environment variables (they're encrypted).

### 1.4 — Verify It Works (optional)
1. In Neon dashboard, click **"SQL Editor"** in the left sidebar
2. Paste and run:
   ```sql
   SELECT version();
   ```
3. You should see PostgreSQL version info returned. You're connected.

---

## STEP 2 — Upstash (Redis)

**What it does:** Stores conversation memory between Twilio webhook calls. Critical for the AI to remember what was said 30 seconds ago during an order.

### 2.1 — Create Account
1. Go to https://upstash.com
2. Click **"Sign Up"** → choose **"GitHub"**
3. Authorize the app

### 2.2 — Create a Redis Database
1. Click **"Create Database"**
2. Fill in:
   - **Name:** `orderflow-sessions`
   - **Region:** `US East (Virginia)` ← closest to Twilio + Railway
   - **Plan:** `Free` (10,000 commands/day — plenty for a demo)
3. Click **"Create"**
4. Wait ~10 seconds for it to provision

### 2.3 — Copy Your REST API Credentials
1. You're now on the database **"Overview"** page
2. Scroll down to the **"REST API"** section
3. You'll see two values you need to copy:

   **UPSTASH_REDIS_REST_URL:**
   - Look for the **"URL"** field
   - It looks like: `https://quiet-capybara-12345.upstash.io`
   - Click the **copy button** next to it

   **UPSTASH_REDIS_REST_TOKEN:**
   - Next to it is the **"Token"** field
   - It looks like: `AAAxxxxxxxxxxxxxxxxxxxxx`
   - Click the **copy button** next to it

4. Paste both somewhere safe. You'll need them for Railway.

> 💡 Both values are in the same section — make sure you copy both, they're different fields.

---

## STEP 3 — Railway (Server)

**What it does:** Runs your Python backend 24/7. Twilio sends webhook requests here. This is what makes OrderFlow actually work.

### 3.1 — Create Account
1. Go to https://railway.app
2. Click **"Sign Up"** → choose **"GitHub"**
3. Authorize the app
4. You get **$5 free credit** on the starter plan — no credit card needed to start

### 3.2 — Deploy from GitHub
1. Click **"New Project"** (orange button, top-right)
2. Choose **"Deploy from GitHub repo"**
3. If Railway asks for GitHub permissions, click **"Authorize"**
4. Find and select the **`orderflow-ai`** repo from the list
5. Railway will auto-detect it's a Python app — it shows:
   ```
   Detected: Python
   Start Command: pip install -r requirements.txt
   ```
   This is correct. Click **"Deploy"** — but we're not done.

### 3.3 — Add Environment Variables
1. Click on your new deployment (the one that just started)
2. Go to the **"Variables"** tab
3. Click **"New Variable"** and add each of these — paste the values you saved from Steps 1 and 2:

   **Server config:**
   ```
   ENVIRONMENT = production
   SERVER_URL = https://orderflow-ai.railway.app
   RESTAURANT_ID = sample
   ```

   **Twilio (from your .env file):**
   ```
   TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN = xxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER = +1XXXXXXXXXX
   ```

   **LLM Providers (from your .env file):**
   ```
   GROQ_API_KEY = gsk_xxxxxxxxxxxxxxxxxxxxxxxxx
   OPENROUTER_API_KEY = sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   GEMINI_API_KEY = AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   **Neon database (from Step 1):**
   ```
   DATABASE_URL = postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

   **Upstash Redis (from Step 2):**
   ```
   UPSTASH_REDIS_REST_URL = https://quiet-capybara-12345.upstash.io
   UPSTASH_REDIS_REST_TOKEN = AAAxxxxxxxxxxxxxxxxxxxxx
   ```

   **Stripe (optional — leave blank for now):**
   ```
   STRIPE_SECRET_KEY = sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxxxxx
   ```

4. After adding all variables, click **"Deploy"** again (top-right corner) to trigger a fresh deploy with the new variables

### 3.4 — Wait for Deploy + Copy Your URL
1. The deploy takes 2-4 minutes (first deploy is the slowest)
2. You'll see **"Building..."** then **"Deploying..."** then **"Live"**
3. At the top of the deployment page, you'll see your URL:
   ```
   https://orderflow-ai.railway.app
   ```
   (The actual subdomain is randomly assigned — it might look different)
4. Copy this URL. You'll need it for Step 4.

### 3.5 — Update SERVER_URL and Redeploy
1. Go back to **Variables** tab
2. Find `SERVER_URL` and make sure it matches your actual Railway URL exactly
3. Click **"Deploy"** again to update it
4. Wait for "Live" status

### 3.6 — Verify the Backend is Working
Open your Railway URL in a browser:

```
https://YOUR-RAILWAY-URL/health
```

You should see:
```json
{"status": "healthy", "restaurant": "Pizza Palace", "restaurant_id": "sample"}
```

If you see this — your backend is live. 🎉

---

## STEP 4 — Twilio Webhook Configuration

**What it does:** Tells Twilio where to send call events. We point it at your new Railway server.

### 4.1 — Log into Twilio Console
1. Go to https://console.twilio.com
2. In the left sidebar, click **"Voice"** under "Developer Tools"
3. Click **"Manage Numbers"** in the sub-menu
4. Click on your number: **`+1 (770) 525-5393`**

### 4.2 — Configure the Voice Webhook
Scroll down to the **"Voice & Fax"** section. You need to fill in:

| Field | Value |
|-------|-------|
| **Accept incoming** | Voice calls |
| **Configure webhook — Primary** | `https://YOUR-RAILWAY-URL/api/voice/webhook` |
| **Configure webhook — Fallback** | `https://YOUR-RAILWAY-URL/api/voice/webhook` |
| **HTTP Method** | POST |
| **Request URL Timeout** | `30` |
| **Status Callback URL** | `https://YOUR-RAILWAY-URL/api/voice/status` |
| **Status Callback Method** | POST |

> ⚠️ Replace `YOUR-RAILWAY-URL` with your actual Railway URL from Step 3.4. Example:
> - Correct: `https://orderflow-ai.railway.app/api/voice/webhook`
> - Wrong: `https://orderflow-ai.railway.app/api/voice/webhook/` (no trailing slash!)

### 4.3 — Save
1. Scroll to the bottom and click **"Save"**
2. Wait 10 seconds

### 4.4 — Test It
**Call +1 (770) 525-5393 from your phone.**

If everything is working:
- You'll hear the AI greeting: *"Thanks for calling Sal's Pizza! What can I get started for you today?"*
- If the AI doesn't respond, check Railway logs (click deployment → Logs tab)

---

## STEP 5 — Connect the Landing Page

The landing page is already live at https://enchanting-sable-bd0c5c.netlify.app

The lead form on the page posts to `/api/lead`. For the form to work properly, we need to update the landing page's API endpoint to point at your Railway backend. 

Add this to the landing page `<head>` (I'll do this automatically after you confirm Railway is live):

```html
<script>
  window.ORDERFLOW_API_URL = "https://YOUR-RAILWAY-URL";
</script>
```

And update the form action to use that URL. I'll handle this once Railway is confirmed.

---

## Troubleshooting

### "Connection refused" in Railway logs
- Check that all env vars are set correctly in Railway Variables tab
- Make sure the port is set to `8000` in Railway (Railway auto-sets `$PORT`)

### "Database does not exist" error
- Make sure `DATABASE_URL` has `?sslmode=require` at the END of the connection string
- Neon requires SSL connections

### "Redis connection failed"
- Make sure BOTH `UPSTASH_REDIS_REST_URL` AND `UPSTASH_REDIS_REST_TOKEN` are set
- If Redis is truly down, the app falls back to in-memory storage (works for testing, not production)

### Twilio webhook 400/403 error
- Check the webhook URL has no trailing slash
- Make sure the URL is `https://` not `http://`
- In Railway, check the deployment logs for any startup errors

### No sound when calling
- Check Railway logs for LLM errors
- Make sure `GROQ_API_KEY` is valid
- The system has a keyword fallback that always responds — if LLM fails you still hear something

---

## What You Should See When Everything Works

| Test | How | Expected Result |
|------|-----|----------------|
| Health check | `https://YOUR-RAILWAY-URL/health` | `{"status": "healthy"}` |
| Menu endpoint | `https://YOUR-RAILWAY-URL/api/menu` | Full JSON menu |
| Real phone call | Call +1 (770) 525-5393 | AI voice greeting + conversation |

---

## Estimated Costs (when free tiers expire)

| Service | Free Tier Ends | After |
|---------|---------------|-------|
| Railway | 3 months | $5/month |
| Neon | 3 months | ~$5/month |
| Upstash | Never (free tier permanent) | $0 |
| Twilio | Pay-as-you-go | ~$0.01/min voice |

**Total estimated cost after free tiers:** ~$10/month for a low-traffic demo.
