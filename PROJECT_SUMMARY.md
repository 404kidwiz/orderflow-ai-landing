# OrderFlow AI — Project Summary

> **Last Updated:** 2026-03-29
> **Status:** Active development — Stitch redesign in progress

---

## 🎯 What It Is

**OrderFlow AI** is a white-label voice ordering SaaS for restaurants. Customers call a phone number, speak naturally to an AI agent, and place orders — no app, no website, no waiting on hold. The AI handles the full conversation, up-sells, confirms the order, and sends an SMS receipt.

**Tagline:** *"Take Orders While You Sleep"*
**Demo phone:** +1 (770) 525-5393
**Live site:** https://orderflow-ai.pages.dev

---

## 🗂️ Repo Structure

This repo (`orderflow-ai-landing`) is the **canonical home** for OrderFlow AI's public-facing assets.

```
orderflow-ai-landing/           ← YOU ARE HERE
├── .stitch/                   # Stitch design package (source of truth)
│   ├── DESIGN.md              # Obsidian Luxe design system
│   ├── FRONTEND-REDESIGN-HANDOFF.md  # Implementation guide for all screens
│   ├── reference-landing.html       # Stitch landing HTML export
│   ├── reference-landing-page.html # Stitch landing-page HTML export
│   ├── reference-dashboard.html    # Stitch dashboard HTML export
│   └── references/            # Product, deployment, backend docs
├── app/                       # Next.js 14 landing page
│   ├── page.tsx               # Main landing page
│   ├── dashboard/             # Dashboard routes
│   └── components/            # All section components
├── lib/                      # Utilities, animations, smooth scroll
├── dist/                     # Static export output
└── public/                   # Static assets
```

### Related Projects

| Project | Location | Role |
|---|---|---|
| **Main project (private)** | `/Users/404kidwiz/Desktop/404kidwiz Vault/404-projects/orderflow-ai/` | Full-stack source (backend, dashboard, landing-v2) |
| **Python backend** | `main-project/api/` + `main-project/src/` | FastAPI voice AI + Twilio integration |
| **landing-v2** | `main-project/landing-v2/` | Next.js 14 implementation target for Stitch redesign |

---

## 💰 Revenue Model

| Plan | Price | Target |
|---|---|---|
| Starter | $29/mo | Solo restaurants, 1 number, 100 orders/mo |
| Pro | $79/mo | Growing spots, unlimited orders, SMS, analytics |
| Enterprise | Custom | Chains, POS integrations, dedicated support |

**14-day free trial** on all plans. Full refund if OrderFlow doesn't capture 10+ additional orders in 30 days.

**Revenue goal:** $20K MRR by May 2026 | $100K MRR by December 2026

---

## 🏗️ Tech Stack

### Frontend (this repo)
| Layer | Tech |
|---|---|
| Framework | Next.js 14, React 19, TypeScript |
| Styling | Tailwind CSS, CSS Modules |
| Animations | Framer Motion, GSAP + ScrollTrigger, Lenis smooth scroll |
| Icons | Lucide React |
| Deployment | Cloudflare Pages |

### Backend (separate — main project)
| Layer | Tech |
|---|---|
| Framework | Python 3.12 + FastAPI |
| Voice AI | Llama 3.3 70B via Groq + OpenRouter + Gemini fallback |
| Session State | Upstash Redis |
| Database | Neon PostgreSQL |
| Phone | Twilio Voice + Messaging |
| Billing | Stripe (checkout + webhooks + customer portal) |
| Deployment | Railway (persistent server required for Twilio webhook conversations) |

**Why Railway over Vercel/Netlify?**  
Twilio webhook conversations require a persistent server. A single order call = 5-10+ webhook invocations sharing the same conversation memory. Vercel serverless cold-starts destroy that state. Railway gives a persistent Python process.

---

## 📞 Architecture — How a Call Flows

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

## 🎨 Design System — Obsidian Luxe

**Stitch Project ID:** `13054754492898134388`
**Design Direction:** `Obsidian Luxe`

### Color Palette

| Token | Hex | Role |
|---|---|---|
| Smoked Obsidian | `#131313` | Primary background |
| Obsidian Low | `#1C1B1B` | Section groupings |
| Obsidian Mid | `#201F1F` | Card surfaces |
| Obsidian High | `#2A2A2A` | Hover/active states |
| Obsidian Highest | `#353534` | Floating panels |
| Ember Orange | `#FF4500` | Primary CTA, urgent actions |
| Ember Soft | `#FFB5A0` | Secondary accents |
| Signal Violet | `#8A2BE2` | AI/Intelligence moments |
| Signal Violet Soft | `#DCB8FF` | AI highlights |
| Readable Warm White | `#E5E2E1` | Main text |
| Warm Secondary Text | `#E7BDB2` | Secondary copy |
| Ghost Outline | `#5D4038` | Subtle borders |

### Typography
- **Headlines / Editorial:** `Noto Serif` — premium, editorial feel
- **Body / Data / Interface:** `Manrope` — clean, modern, data-friendly

### Motion
- Landing: cinematic reveals, scroll rhythm, AI pulse moments
- Dashboard: restrained — state changes, hover lifts, feed refresh emphasis
- Mobile: quick scanning, thumb comfort over flourish

---

## 🖥️ Stitch Screen Inventory

### Desktop (3 screens)

| Label | Stitch Title | Screen ID | Target |
|---|---|---|---|
| `D1B` | OrderFlow AI - Cinematic Landing Page | `5204a2639a694f3e9873cc996d3a0377` | `app/page.tsx` (preferred) |
| `D2` | OrderFlow AI - Operations Dashboard | `b149ed5e24bd44baae1d979eb223d97a` | `app/dashboard/page.tsx` |
| `D3` | Internal Command Center | `22b1dd05436642f98f3ceea12eb38e5a` | `app/dashboard/restaurants/page.tsx` |

### Mobile (3 screens)

| Label | Stitch Title | Screen ID | Target |
|---|---|---|---|
| `M1B` | OrderFlow AI - Mobile Cinematic Landing | `fbe3f7785ff2497e88fb42406510c40a` | Responsive `app/page.tsx` (preferred) |
| `M2` | Mobile Operations Dashboard | `8b4d5621dd2848edb71cdf7bb6b2966c` | Responsive `app/dashboard/page.tsx` |
| `M3` | Mobile Restaurant Admin | `1c683f2beb814173aac5a511b1dbb3e4` | Responsive `app/dashboard/restaurants/page.tsx` |

### Implementation Order
1. Tokenize design system from `.stitch/DESIGN.md`
2. Rebuild landing in `app/page.tsx` against `D1B` + `M1B`
3. Rework dashboard around `D2` + `M2` with stronger hierarchy
4. Rebuild restaurant admin against `D3` + `M3`
5. Normalize shared components (nav, cards, buttons, forms, status chips)

---

## 📁 Stitch Design Assets

```
.stitch/
├── DESIGN.md                    # Full design tokens + specs (5.6KB)
├── FRONTEND-REDESIGN-HANDOFF.md  # Screen mapping + implementation guide
├── reference-landing.html       # Stitch HTML export — landing (66KB)
├── reference-landing-page.html   # Stitch HTML export — landing-page (54KB)
├── reference-dashboard.html      # Stitch HTML export — dashboard
└── references/
    ├── BACKEND_SETUP_GUIDE.md    # Backend architecture (Neon, Upstash, Railway)
    ├── DEPLOYMENT.md             # Railway + Twilio deployment walkthrough
    ├── PRODUCT.md                # Product plan, pricing, target customers
    ├── PRD_IMPLEMENTATION_PLAN.md # Roadmap + implementation milestones
    └── TARGET_RESTAURANTS.md      # Ideal customer profiles
```

---

## 🚀 Deployment

### Frontend (this repo)
```bash
cd /Users/404kidwiz/projects/orderflow-ai-landing

pnpm build
npx wrangler pages deploy .next --project-name=orderflow-ai
```

### Backend (main project → Railway)
```bash
# Push to GitHub first
cd "/Users/404kidwiz/Desktop/404kidwiz Vault/404-projects/orderflow-ai"
git push origin main
# Railway auto-deploys on push
```

### Key env vars (Railway)
```
ENVIRONMENT=production
SERVER_URL=https://orderflow-ai.up.railway.app
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxx
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx==
```

---

## 📌 Current Implementation Status

| Surface | Status | Notes |
|---|---|---|
| Landing page (current) | ✅ Live | `orderflow-ai.pages.dev` — needs Obsidian Luxe redesign |
| Dashboard | ⚠️ Partial | Functional but stale design |
| Backend API | ✅ Deployed | Railway — active |
| Twilio voice | ✅ Live | +1 (770) 525-5393 answers calls |
| Stitch redesign | 📋 In progress | D1B/M1B preferred landing direction |
| landing-v2 | 📍 In main project | Next.js 14 implementation target |

---

## 🔑 Key Decisions on File Structure

- **This repo** = canonical public home (landing page + Stitch designs + docs)
- **Main project** (`Vault/404-projects/orderflow-ai/`) = private development repo with full backend + Python + landing-v2
- **Do not treat `landing-v2`** as the canonical output location — it's a nested Next.js inside the main project
- **When Stitch redesign is implemented**, update `app/page.tsx` and `app/dashboard/` in THIS repo

---

## 📞 Support / Debug

- **Twilio console:** https://console.twilio.com
- **Railway dashboard:** https://railway.app
- **Neon console:** https://neon.tech
- **Upstash console:** https://upstash.com
- **Live demo call:** +1 (770) 525-5393

---

*This document is the single source of truth for OrderFlow AI's current state. Update it whenever the architecture, tech stack, or deployment changes.*
