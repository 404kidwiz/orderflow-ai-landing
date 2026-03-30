# OrderFlow AI - Project Summary (landing-v2)

## Overview
OrderFlow AI is an AI-powered voice ordering system for restaurants. Customers call a dedicated phone number, and an AI agent (powered by Llama 3.3 70B) takes their order naturally — up-selling, handling modifications, and sending orders directly to the kitchen.

## Tech Stack

### Landing Page v2 (2026-03-26)
- **Framework:** Next.js 14.2.21 (downgraded from 15 for R3F compatibility)
- **React:** 18.3.1
- **Animation:** Framer Motion 11.x + GSAP 3.12 + ScrollTrigger
- **Smooth Scroll:** Lenis 1.1.x
- **3D:** React Three Fiber + Drei + Three.js
- **Styling:** CSS Modules + Tailwind CSS 4.x
- **UI Primitives:** Radix UI (Accordion, Toggle, Select, Dialog)

### Operations Dashboard (2026-03-29)
- **Framework:** React + Vite
- **Design System:** Stitch (Editorial Dark-Tech)
- **Status:** **Fully Functional & Connected**
- **Connectivity:** Dynamic data fetching via `apiClient` (30s refresh)
- **Features:** Analytics Hub, Live Orders, Intelligence Feed, Leads Pipeline.

### Backend (Updated)
- **API:** FastAPI (Python)
- **Server:** Running on **Port 8080** (Local Dev)
- **LLM:** Groq (Primary) + OpenRouter + Gemini (Failover)
- **State:** Upstash Redis
- **Database:** Neon PostgreSQL (Prod) / SQLite (Dev)

## Project Structure
```
orderflow-ai/
├── landing-v2/                 # Next.js 14 landing page
├── dashboard/                  # React dashboard (Stitch Redesign)
│   ├── src/
│   │   ├── api/                # apiClient.js (Connected to FastAPI)
│   │   ├── components/         # Modular Stitch Components
│   │   └── pages/              # Demo.jsx (Main Dashboard View)
├── src/                        # Python FastAPI backend
│   ├── app.py                  # FastAPI Entry point
│   ├── database.py             # SQLite/Postgres persistence
│   └── reflexion/              # AI Learning Loop
├── tests/                      # Integration Test Suite
└── PROJECT_SUMMARY.md          # Repo-wide summary
```

## Key Features Implemented

### Operations Dashboard (New)
- **Live Revenue Tracking**: Real-time KPI cards with trend indicators.
- **Interactive Order Board**: Confirm and Complete voice orders with a single click.
- **AI Intelligence Feed**: Automated stock alerts and pattern suggestions from `LearningLoop`.
- **Leads Management**: Centralized inquiry pipeline for catering and events.

### Hero Section (Landing)
- React Three Fiber particle system (2000 particles)
- Scroll-driven text reveal with spring physics
- Floating phone mockup with cursor tracking

### Live Demo Section (Landing)
- Auto-playing message simulation
- Interactive user input (type your own order)
- Animated waveform bars during AI response

## Deployment

### Landing Page (Netlify)
- URL: https://enchanting-sable-bd0c5c.netlify.app
- Build: `pnpm build`

### Dashboard (Stitch)
- Local: `npm run dev` in `/dashboard`
- Production: Pending separate Netlify/Vercel deploy.

### Backend (Railway)
- Local: `python3 -m uvicorn src.app:app --port 8080`
- Production: Railway persistence enabled.

## Next Steps
1. **Production Dashboard Deployment**: Build and deploy the React dashboard.
2. **WebSocket Integration**: Upgrade dashboard from polling to real-time events.
3. **Stripe Billing**: Activate checkout for starter/pro plans.
4. **Twilio Production Switch**: Update Twilio webhook to production Railway URL.

## Files Modified (2026-03-29)
- `dashboard/` - Full Stitch redesign and API integration.
- `src/app.py` - Added stats, intelligence, and leads endpoints.
- `src/database.py` - Expanded schema for leads and stats.
- `PROJECT_SUMMARY.md` - Repo-wide documentation update.