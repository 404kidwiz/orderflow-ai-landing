# OrderFlow AI — Project Summary

**Last Updated:** 2026-03-29

---

## Live Deployment
- **Landing Page:** https://orderflow-ai.pages.dev
- **Repo:** https://github.com/404kidwiz/orderflow-ai-landing

---

## Stitch Design Source

**Stitch Project ID:** `13054754492898134388`
**Design Direction:** `Obsidian Luxe`

All Stitch design files are stored in `.stitch/`:

```
.stitch/
├── DESIGN.md                    # Full design system spec
├── reference-landing.html       # Stitch HTML export (landing)
├── reference-landing-v2.html    # Stitch HTML export (landing v2)
├── reference-dashboard.html     # Stitch HTML export (dashboard)
└── references/
    ├── BACKEND_SETUP_GUIDE.md   # Backend architecture docs
    ├── DEPLOYMENT.md            # Deployment instructions
    ├── PRODUCT.md               # Product specs
    └── PRD_IMPLEMENTATION_PLAN.md  # Implementation roadmap
```

### Obsidian Luxe Design System

| Token | Hex | Use |
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

**Typography:**
- Headlines: `Noto Serif` (premium, editorial)
- Body: `Manrope` (data, interface)

---

## What It Is

OrderFlow AI is an AI Employee Staffing platform — a SaaS landing page that sells AI workers ("AI Employees") to businesses at $997/month. The landing page follows a full-funnel strategy: social proof → process → features → pricing → FAQ → lead capture.

**Target customer:** Home services (HVAC/Plumbing/Electricians), Real Estate Agents, Law Firms, Financial Advisors
**Core pitch:** "Build & Delegate to AI Employees" — scalable workforce without hiring overhead
**Revenue goal:** $20K/month by May 2026 | $100K/month by December 2026

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Animations | Framer Motion — scroll-triggered, staggered, morphing |
| Deployment | Cloudflare Pages |
| Forms | Lead capture via API |
| Design | Stitch "OrderFlow AI Design System v1.0" |

---

## Screens / Sections

| Section | Description |
|---|---|
| **AnimatedNavbar** | Sticky, scrolls to solid, blur backdrop, logo + links + "Get Started" CTA |
| **Hero** | "Build & Delegate to AI Employees" headline, subtext, 3-step snippet, dual CTAs, floating AI dashboard preview |
| **LogoMarquee** | Scrolling logos: Stripe, Linear, Notion, Vercel, Shopify, Airbnb, Uber, DoorDash |
| **SocialProof** | "Trusted by 500+ Businesses", testimonial cards with avatar, rating, quote |
| **HowItWorks** | 6-step horizontal scroll or numbered grid: Hire → Onboard → Delegate → AI Works → Review → Scale |
| **Features** | 3-column grid, icon + title + description, hover lift effect |
| **FAQ** | Accordion, 5 questions, smooth expand/collapse |
| **CTA** | Full-width gradient banner, "Ready to Scale?" headline, email input + button |
| **Footer** | Logo, tagline, copyright |

---

## Design System — "OrderFlow AI v1.0"

### Colors
| Token | Hex | Use |
|---|---|---|
| Deep Indigo | `#0B0B1A` | Background |
| Electric Purple | `#8B5CF6` | Primary CTA, accents |
| Mint Green | `#10B981` | Success, highlights |
| Pure White | `#FFFFFF` | Text, surfaces |
| Amber Gold | `#F59E0B` | Ratings, badges |
| Coral Red | `#EF4444` | Errors, urgency |
| Light Gray | `#F3F4F6` | Secondary backgrounds |

### Typography
- **Headings:** Outfit (Google Fonts) — geometric, modern
- **Body:** DM Sans (Google Fonts) — clean, readable

### Buttons
- Gradient: `linear-gradient(135deg, #8B5CF6, #6366F1)`
- Rounded: `rounded-full`
- Hover: scale up slightly, shadow deepens
- Transitions: 300ms ease

### Animations
- **Scroll reveals:** opacity 0→1, y 20→0, 600ms ease-out, staggered 100ms
- **Hover lifts:** y -4px, shadow increase
- **Logo marquee:** continuous horizontal scroll, 30s linear
- **FAQ accordion:** height auto transition, 300ms ease
- **CTA gradient:** background-position shift on hover

---

## Stitch Design Source

The Stitch design spec is in `.stitch/DESIGN.md` with full color tokens, typography rules, component specs, animation timings, and layout measurements.

```
Asset locations:
.stitch/DESIGN.md                              — Full design spec
.stitch/references/tool-schemas.md             — Component/feature definitions
.stitch/references/design-mappings.md          — Screen-to-component mapping
.stitch/references/chatbot-wf-screenshots/     — Stitch UI screenshots
```

---

## Git History (recent)

| Commit | Description |
|---|---|
| `b9a3e0d` | feat: redesign Hero, Features, Pricing, Testimonials, Calendly modal, TrustBar |
| `f73a291` | chore: deps upgrade next@14.2.15 react@19 |
| `7da3f1e` | feat: add Calendly demo booking modal + Book a Demo button |
| `9c4f2a1` | feat: FAQ accordion with smooth open/close animations |
| `3e7eb10` | feat: initial full-stack Next.js 14 landing + dashboard |

---

## Deployment

```bash
cd /Users/404kidwiz/projects/orderflow-ai-landing

# Build
pnpm build

# Deploy
npx wrangler pages deploy .next --project-name=orderflow-ai
```

---

## 13 Revenue Plays (404 Technologies)

1. AI Employee Staffing Model ($997/mo per AI worker, $800 profit)
2. AI Phone Agent Implementation ($997 setup + $497/mo management)
3. Web Design Arbitrage ($1,500/site, $18K/mo potential)
4. LinkedIn Profile Pipeline ($197-997/profile)
5. Podcast Production Pipeline ($300-500/episode)
6. AI Recruiter ($500-2K/placement)
7. AI Grant Writer ($500-1,500/grant application)
8. AI Form Filler for Law Firms ($297-997/document)
9. AI Course Creator ($2-5K/course)
10. Local Business Review Manager ($297-497/mo per location)
11. Fiverr Gigs (Audio stems, Lead scrape, UI prototypes)
12. Local SEO Autopilot ($1K/mo retainer)
13. Micro-SaaS Flipper ($2-10K per flip)
