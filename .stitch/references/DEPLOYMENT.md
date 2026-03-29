# OrderFlow AI — Backend Deployment Guide

## Stack
| Service | Purpose | Cost |
|---------|---------|------|
| Railway | Persistent Python server (Twilio webhooks) | Free tier (3 months) → $5/mo |
| Neon | PostgreSQL database (serverless) | Free tier (3GB) |
| Upstash Redis | Conversation state between webhook calls | Free tier (10K ops/day) |
| Twilio | Voice + SMS | Pay-as-you-go (~$0.01/min voice) |

---

## Step 1 — Create Accounts (10 minutes)

### Neon (Database)
1. Go to https://neon.tech → Sign up (GitHub is fastest)
2. Create a new project:
   - Name: `orderflow`
   - Region: `US East` (closest to Twilio)
3. Copy the **Connection string** — looks like:
   ```
   postgresql://user:password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Upstash Redis (Session State)
1. Go to https://upstash.com → Sign up (GitHub)
2. Create a database:
   - Name: `orderflow-sessions`
   - Region: `US East`
3. Go to **Rest API** tab
4. Copy the **URL** and **Token** (NOT the same thing)

### Railway (Server)
1. Go to https://railway.app → Sign up (GitHub)
2. **Important:** During signup, use the **Starter plan** ($5 credit for first 60 days)
3. After signup, you get 3 months free on the hobby plan

---

## Step 2 — Push Project to GitHub

Railway deploys from GitHub repos.

```bash
cd ~/Desktop/404kidwiz\ Vault/404-projects/orderflow-ai

# Initialize git (if not already)
git init
git add .
git commit -m "OrderFlow AI v1.0 — ready for Railway deploy"

# Create a new GitHub repo at https://github.com/new
# Name it: orderflow-ai
git remote add origin https://github.com/YOUR_USERNAME/orderflow-ai.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy to Railway

1. Open https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select the `orderflow-ai` repo
4. Railway auto-detects Python — it will use `requirements.txt`
5. Go to **Variables** tab and add these (get values from your `.env` file):

```
ENVIRONMENT=production
SERVER_URL=https://orderflow-ai.up.railway.app   # ← update after first deploy
RESTAURANT_ID=sample

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# LLM Providers
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx

# Neon
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx==
```

6. Click **Deploy** — first deploy takes ~3 minutes
7. After deploy, Railway shows your URL: `https://orderflow-ai.railway.app`
8. Copy that URL — you'll need it for Step 4

---

## Step 4 — Wire Up Twilio Webhook

1. Go to https://console.twilio.com → **Voice** → **Manage numbers**
2. Click your `+1 (770) 525-5393` number
3. Under **Voice & Fax**:
   - **Accept incoming:** Voice calls
   - **Configure webhook:**
     - Primary: `https://YOUR_RAILWAY_URL/api/voice/webhook`
     - Fallback: `https://YOUR_RAILWAY_URL/api/voice/webhook`
     - Method: `POST`
     - Timeout: `30` seconds
     - Status callback: `https://YOUR_RAILWAY_URL/api/voice/status`
4. Save

> ⚠️ **Important:** Your Railway app URL will look like `https://orderflow-ai.railway.app`. After first deploy, update `SERVER_URL` in Railway variables to match, then redeploy.

---

## Step 5 — Verify Everything is Working

### Test the health endpoint:
```bash
curl https://YOUR_RAILWAY_URL/health
```
Expected response:
```json
{"status": "healthy", "restaurant": "Pizza Palace"}
```

### Test the voice webhook (simulate Twilio):
```bash
curl -X POST https://YOUR_RAILWAY_URL/api/voice/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=CAtest123&From=+17701234567&To=+17705255393&CallStatus=ringing"
```

### Test a real call:
Call `+1 (770) 525-5393` from your phone. You should hear the AI greeting.

---

## Step 6 — Connect Frontend to New Backend

Update the landing page to point to your new backend:

In `/api/index.py`, the `SERVER_URL` is loaded from environment. Update it in Railway variables to your actual Railway URL.

For the landing page lead form to work, make sure the form action points to your Railway URL.

---

## Troubleshooting

### Railway deploy fails on `gunicorn not found`
Make sure `requirements.txt` includes `gunicorn>=21.0.0` — it should already be there.

### Twilio webhook returns 400 or 403
- Check the webhook URL is exactly `https://YOUR_RAILWAY_URL/api/voice/webhook` (no trailing slash)
- Make sure Twilio can reach your app (no firewall, Railway plan is active)
- Check Railway logs: click on the deployment → **Logs**

### LLM not responding
- Verify `GROQ_API_KEY` is set correctly in Railway variables
- Check Railway logs for provider errors
- The system has a keyword fallback that always works — if LLM fails, it degrades gracefully

### Redis session errors
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are both set
- If Redis is unavailable, the app falls back to in-memory storage (works for testing, not for production)

### Database connection fails
- Make sure `DATABASE_URL` has `?sslmode=require` at the end
- Neon requires SSL connections — the `sslmode=require` parameter is critical

---

## Scaling Notes

### Free Tier Limits
| Service | Limit | What to watch |
|---------|-------|---------------|
| Railway | 500 hours/month | Auto-sleeps after 5 min inactivity |
| Neon | 3GB storage | Monitor storage usage |
| Upstash | 10K commands/day | Heavy usage = slow responses |
| Twilio | Pay-as-you-go | ~$0.01/min voice, $0.0075/SMS |

### Upgrading
- Railway: upgrade to $5/mo starter plan for no sleep + more CPU
- Neon: scale to paid tier when approaching storage limit
- Twilio: apply for enterprise pricing at scale

---

## Architecture Notes

```
Customer calls +1 (770) 525-5393
           │
           ▼
    Twilio Voice API
           │
           ▼  POST /api/voice/webhook
    Railway (FastAPI)
           │
           ├──→ LLM Router (Groq → OpenRouter → Gemini → keyword fallback)
           │         │
           │         ▼
           │    OrderFlow AI brain (Llama 3.3 70B)
           │
           ├──→ Redis (Upstash) — session state, conversation memory
           │
           ├──→ PostgreSQL (Neon) — orders, call logs, analytics
           │
           └──→ Twilio SMS — order confirmation to customer
```

---

## Updating the App

```bash
# Make changes locally
git add .
git commit -m "Your change description"
git push

# Railway auto-deploys on push to main
# Watch: Railway Dashboard → Deployment → Logs
```

---

##.env vs Railway Variables

Railway stores variables in the dashboard — **not in `.env`**. Keep `.env` for local development only.

For local testing:
```bash
cp .env.example .env
# Fill in your values
uvicorn api.index:app --reload --port 8000
```
