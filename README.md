# OrderFlow AI

> *"Take Orders While You Sleep"* — AI voice ordering for restaurants.

**Live:** https://82b54aca.orderflow-ai.pages.dev  
**Demo call:** +1 (770) 525-5393

---

## What It Is

OrderFlow AI is a white-label voice ordering SaaS. Customers call a phone number, speak naturally to an AI agent, and place orders — no app, no website, no hold music. The AI up-sells, confirms, and sends an SMS receipt.

**Pricing:** Starter $49/mo · Pro $129/mo · Enterprise $299/mo — all with 14-day free trial

---

## Repo Structure

```
orderflow-ai-landing/        ← CANONICAL HOME (you are here)
├── .stitch/                  # Stitch design package
│   ├── DESIGN.md             # Obsidian Luxe design system
│   ├── FRONTEND-REDESIGN-HANDOFF.md  # Screen mapping + impl guide
│   ├── reference-*.html      # Stitch HTML exports (design source)
│   └── references/           # Product, backend, deployment docs
├── app/                     # Next.js 14 landing page + dashboard
├── components/              # Section components (Hero, HowItWorks, etc.)
└── lib/                     # Animations, smooth scroll, utilities
```

**Related (private, Desktop Vault):**  
`/Users/404kidwiz/Desktop/404kidwiz Vault/404-projects/orderflow-ai/` — full-stack backend + Python API + landing-v2

---

## Stitch Design System

**Stitch Project ID:** `13054754492898134388`  
**Design Direction:** `Obsidian Luxe`

Full design tokens, screen inventory, and implementation guide in [`.stitch/DESIGN.md`](.stitch/DESIGN.md) and [`.stitch/FRONTEND-REDESIGN-HANDOFF.md`](.stitch/FRONTEND-REDESIGN-HANDOFF.md).

### Colors

| Token | Hex | Use |
|---|---|---|
| Smoked Obsidian | `#131313` | Primary background |
| Ember Orange | `#FF4500` | Primary CTA |
| Signal Violet | `#8A2BE2` | AI/Intelligence |
| Warm White | `#E5E2E1` | Main text |

### Typography

- **Headlines:** Noto Serif
- **Body:** Manrope

---

## Quick Start

```bash
# Install
pnpm install

# Dev
pnpm dev

# Build
pnpm build

# Deploy (Cloudflare Pages)
npx wrangler pages deploy .next --project-name=orderflow-ai
```

---

## 6 Screens to Implement (from Stitch)

| Screen | Route | Status |
|---|---|---|
| Cinematic Landing (desktop) | `/` | ⚠️ Needs redesign |
| Cinematic Landing (mobile) | `/` | ⚠️ Needs redesign |
| Operations Dashboard | `/dashboard` | ⚠️ Needs redesign |
| Internal Command Center | `/dashboard/restaurants` | ⚠️ Needs redesign |
| Mobile Ops Dashboard | `/dashboard` (responsive) | ⚠️ Needs redesign |
| Mobile Restaurant Admin | `/dashboard/restaurants` (responsive) | ⚠️ Needs redesign |

See [`.stitch/FRONTEND-REDESIGN-HANDOFF.md`](.stitch/FRONTEND-REDESIGN-HANDOFF.md) for full screen IDs, previews, and build order.

---

## Backend

- **Live API:** https://orderflow-ai.up.railway.app (Railway + FastAPI)
- **Voice:** Twilio — +1 (770) 525-5393
- **Database:** Neon PostgreSQL
- **Session:** Upstash Redis

Full backend setup in [`.stitch/references/DEPLOYMENT.md`](.stitch/references/DEPLOYMENT.md).

---

## GitHub

https://github.com/404kidwiz/orderflow-ai-landing
