# OrderFlow AI - Project Summary

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
- **Gestures:** @use-gesture/react

### Backend (Reference)
- **API:** FastAPI (Python)
- **LLM:** Llama 3.3 70B via OpenRouter
- **Session:** Upstash Redis
- **Database:** Neon PostgreSQL (planned)
- **Voice:** Twilio

## Project Structure
```
orderflow-ai/
├── landing-v2/                 # Next.js 14 landing page
│   ├── app/
│   │   ├── globals.css        # Global styles + CSS variables
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/
│   │   ├── NavBar/            # Fixed navigation with mobile menu
│   │   ├── Hero.tsx           # 3D particle background + scroll animations
│   │   ├── TrustBar.tsx       # Logo marquee
│   │   ├── LiveDemo.tsx       # Interactive chat simulation
│   │   ├── HowItWorks.tsx     # Horizontal scroll narrative
│   │   ├── Features.tsx       # Scroll-triggered staggered grid
│   │   ├── Stats.tsx          # Count-up rings with animated arcs
│   │   ├── Testimonials.tsx   # 3D carousel with drag
│   │   ├── Pricing.tsx        # 3-tier pricing with toggle
│   │   ├── FAQ.tsx            # Radix accordion
│   │   ├── LeadForm.tsx       # Contact form with validation
│   │   └── Footer.tsx         # Links + social
│   ├── lib/
│   │   ├── smooth-scroll.ts   # Lenis initialization
│   │   ├── scroll-animations.ts # GSAP + ScrollTrigger setup
│   │   ├── animations.ts      # Framer Motion variants
│   │   └── three-jsx.d.ts     # R3F type declarations
│   └── netlify.toml           # Netlify config with Next.js plugin
├── src/                       # Python FastAPI backend
│   ├── api/                   # FastAPI routes
│   ├── llm/                   # LLM providers + router
│   ├── session.py             # Redis session manager
│   ├── config.py              # Restaurant configuration
│   └── main.py                # Entry point
├── assets/                    # AI-generated images
└── BACKEND_SETUP_GUIDE.md     # Deployment instructions
```

## Key Features Implemented

### Hero Section
- React Three Fiber particle system (2000 particles on desktop, 500 on mobile)
- Scroll-driven text reveal with spring physics
- Parallax depth layers via GSAP ScrollTrigger
- Floating phone mockup with cursor tracking
- Ambient glow following cursor position
- Animated scroll indicator with progress ring

### Live Demo Section
- Auto-playing message simulation
- Interactive user input (type your own order)
- Typing indicator with typewriter effect
- Animated waveform bars during AI response
- Order confirmation card with spring bounce

### How It Works
- Sticky horizontal scroll narrative
- Three panels: Customer Calls → AI Takes Order → Kitchen Gets It
- SVG connection line animations

### Features Grid
- Scroll-triggered staggered entrance
- Hover lift + glow bar animation
- 8 feature cards in responsive grid

### Stats Section
- Custom count-up hook with easeOutExpo
- SVG ring/arc animation
- 4 stats: 500+ Restaurants, 3M+ Orders, 99.7% Uptime, 23% Avg Increase

### Testimonials
- 3D carousel with perspective
- Auto-rotate every 5 seconds
- Drag/swipe with momentum
- Active card scaling + orange glow

### Pricing
- Monthly/Annual toggle with discount
- 3 tiers: Starter ($97), Growth ($197), Enterprise ($497)
- Popular badge on Growth plan

### FAQ
- Radix UI Accordion
- Smooth expand/collapse animations

### Lead Form
- Input fields: Name, Email, Phone, Restaurant (optional)
- Form validation
- Loading state + success animation

## Design System

### Colors
```css
--void: #0a0a0f;           /* Background */
--void-light: #111118;     /* Card backgrounds */
--orange: #FF6B35;         /* Primary accent */
--orange-glow: #FF8C5A;    /* Gradient accent */
--purple: #7C3AED;         /* Secondary accent */
--white: #FFFFFF;          /* Primary text */
--gray-400: #9CA3AF;       /* Secondary text */
--gray-600: #4B5563;       /* Tertiary text */
--glass: rgba(255,255,255,0.04);
--border: rgba(255,255,255,0.08);
--border-hover: rgba(255,255,255,0.12);
```

### Typography
- **Headings:** Inter (900 weight)
- **Body:** Inter (400, 500, 600 weights)
- **Monospace:** JetBrains Mono (for stats)

### Spacing
- Base unit: 4px
- Section padding: 120px (80px on mobile)
- Card padding: 32px
- Grid gap: 20px

### Animations
- Primary spring: `{ stiffness: 100, damping: 15 }`
- Reveal duration: 0.6s
- Micro-interactions: 0.2-0.3s
- Stagger delay: 0.07-0.12s between items

## Deployment

### Landing Page (Netlify)
- URL: https://enchanting-sable-bd0c5c.netlify.app (existing)
- Config: `netlify.toml` with `@netlify/plugin-nextjs`
- Build: `pnpm build`
- Publish: `.next`

### Backend (Railway) - Pending
- Requires: Railway account, Upstash Redis, Neon PostgreSQL
- See: `BACKEND_SETUP_GUIDE.md`

## Known Issues
- React 19 incompatibility with R3F/Framer Motion → using React 18.3.1
- Next.js 15 build fails with static generation → using Next.js 14.2.21

## Next Steps
1. Deploy Next.js 14 build to Netlify
2. Connect Railway backend with credentials
3. Set up Twilio webhook to new backend
4. Test live demo phone number

## Files Modified (2026-03-26)
- All components rewritten with full animations
- CSS Modules for each component
- Lenis smooth scroll integration
- GSAP ScrollTrigger for scroll-driven effects
- React Three Fiber for 3D hero background