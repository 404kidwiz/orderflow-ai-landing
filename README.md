# OrderFlow AI — AI Employee Staffing Platform

**Live:** https://orderflow-ai.pages.dev

Build and delegate to AI Employees — scalable workforce for your business at $997/month.

---

## Screens

| Route | Screen |
|---|---|
| `/` | Landing page — Hero, How It Works, Features, Testimonials, Pricing, FAQ, CTA |
| `/dashboard` | Lead dashboard (authenticated) |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Design | Stitch "Obsidian Luxe" Design System |
| Deployment | Cloudflare Pages |

---

## Stitch Design System

**Stitch Project ID:** `13054754492898134388`
**Design Direction:** `Obsidian Luxe`

All design files are in `.stitch/`:

```
.stitch/
├── DESIGN.md                    # Full design tokens + specs
├── reference-landing.html       # Landing page (Stitch export)
├── reference-landing-v2.html    # Landing v2 (Stitch export)
├── reference-dashboard.html    # Dashboard (Stitch export)
└── references/                  # Implementation docs
```

### Colors (Obsidian Luxe)

| Token | Hex | Role |
|---|---|---|
| Smoked Obsidian | `#131313` | Primary background |
| Obsidian Mid | `#201F1F` | Card surfaces |
| Ember Orange | `#FF4500` | Primary CTA |
| Signal Violet | `#8A2BE2` | AI/Intelligence |
| Warm White | `#E5E2E1` | Main text |

### Typography

- **Headlines:** Noto Serif (premium, editorial)
- **Body:** Manrope (data, interface)

---

## Getting Started

```bash
# Install
pnpm install

# Build
pnpm build

# Dev
pnpm dev

# Deploy
npx wrangler pages deploy .next --project-name=orderflow-ai
```

---

## Features

- 🎯 Full-funnel landing page
- 📋 Lead capture with CTA
- 💬 FAQ accordion with smooth animations
- ⭐ Social proof + testimonials
- 📱 Fully responsive
- ✨ Scroll-triggered animations
- 🎨 Gradient CTAs with hover effects

---

## Repo

https://github.com/404kidwiz/orderflow-ai-landing
