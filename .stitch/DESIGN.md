# Design System: OrderFlow AI Frontend Redesign
**Stitch Project ID:** `13054754492898134388`
**Design Direction:** `Obsidian Luxe`
**Frontend Scope:** landing experience, restaurant operations dashboard, and restaurant admin/onboarding

## 1. Visual Theme & Atmosphere
OrderFlow AI should not look like a default AI SaaS. The visual system is editorial dark-tech: luxury hospitality meets an AI command center. The mood is smoked, cinematic, exact, and premium. Customer-facing marketing screens should feel persuasive and high-end. Operator screens should feel sharp, glanceable, and quietly powerful.

The core metaphor is a digital maitre d'. That means the interface should feel polished, controlled, and high-trust rather than playful or startup-generic.

## 2. Color Palette & Roles
- **Smoked Obsidian** `#131313`: Primary background and deepest surface.
- **Obsidian Low** `#1C1B1B`: Large section groupings and content bands.
- **Obsidian Mid** `#201F1F`: Default card and panel surface.
- **Obsidian High** `#2A2A2A`: Hover, active, or raised interaction layer.
- **Obsidian Highest** `#353534`: Floating glass panels, overlays, and focused containers.
- **Ember Orange** `#FF4500`: Primary conversion, urgent action, and active operational emphasis.
- **Ember Soft** `#FFB5A0`: Secondary orange tint, ghost highlights, and warm glow support.
- **Signal Violet** `#8A2BE2`: AI state, intelligence moments, insights, and secondary system accents.
- **Signal Violet Soft** `#DCB8FF`: Subtle AI highlight, graph accents, and halo treatments.
- **Readable Warm White** `#E5E2E1`: Main text on dark surfaces.
- **Warm Secondary Text** `#E7BDB2`: Secondary copy and premium metadata.
- **Ghost Outline** `#5D4038`: Low-contrast structural edge when accessibility requires separation.

## 3. Typography Rules
- **Headlines / Editorial moments:** `Noto Serif`
- **Body / Data / Interface:** `Manrope`

Use `Noto Serif` for value propositions, dashboard page titles, and other high-importance headings where the brand should feel premium. Use `Manrope` for tables, cards, labels, forms, analytics, and operational content. Avoid neutral system-font blandness.

## 4. Component Stylings
### Buttons
- Primary CTA uses ember orange and should feel hot, direct, and unmistakable.
- AI-related or intelligence actions can use signal violet.
- Buttons should be slightly rounded, not pill-heavy and not sharp-corporate.
- Always define default, hover, focus, active, disabled, and loading states.

### Cards & Panels
- Prefer tonal separation over border-led composition.
- Use smoked glass or solid dark surfaces depending on information density.
- Landing cards can breathe more and use subtle glass.
- Dashboard and admin cards should stay crisp and operational.

### Inputs & Forms
- Inputs should sit on darker recessed surfaces with clear focus contrast.
- Lead-gen forms should feel premium and sales-ready.
- Admin forms should feel structured, dense, and error-resilient.

### Data Displays
- Charts should be chart-safe, minimal, and legible.
- Status chips should use ember orange for urgency or active ops, green for successful resolution, and violet for AI/system state.
- Transcript snippets and intelligence feeds should read like polished operational notes, not chat bubbles.

## 5. Layout Principles
- No generic centered landing stacks.
- Use asymmetric composition and controlled whitespace on marketing surfaces.
- Use strong multi-pane hierarchy on dashboard and admin surfaces.
- Separate sections using tone, spacing, and depth instead of 1px line grids.
- Landing should feel like one narrative with changing densities.
- Dashboard should feel like a command center.
- Admin should feel like internal control software with premium restraint.

## 6. Motion & Interaction
- Motion should feel intentional and low-noise.
- Landing can use cinematic reveals, scroll rhythm, and subtle AI pulse moments.
- Dashboard motion should be restrained to state change, hover lift, and feed refresh emphasis.
- Mobile flows should prioritize quick scanning and thumb comfort over flourish.
- Respect reduced-motion preferences.

## 7. Non-Negotiables
- No generic SaaS bento wallpaper treatment.
- No pure black or pure white as the dominant feel.
- No emoji-led UI.
- No loud gradients everywhere.
- No divider-heavy admin layouts.
- No visual split between landing and dashboard brands; they must feel like one product family.

## 8. Screen Intent
### Marketing
- **Landing:** sell trust, speed, and restaurant revenue upside in one cinematic system.
- **Mobile Landing:** compress the same pitch into a tighter, thumb-first persuasive journey.

### Restaurant Ops
- **Operations Dashboard:** unify orders, calls, leads, and revenue into one high-trust operator surface.
- **Mobile Operations:** compact manager-on-the-go monitoring with fast status scanning.

### Internal Admin
- **Restaurant Admin / Internal Command Center:** manage restaurant accounts, onboarding, API keys, phone assignment, and activation without looking like a generic back office tool.
- **Mobile Restaurant Admin:** quick internal oversight and onboarding progress on small screens.

## 9. Implementation Notes
- Keep the redesign handoff in the main repo root. Do not treat the nested `landing-v2` repo as the documentation home.
- Port tokens and component choices into `landing-v2` deliberately once implementation begins.
- Preserve backend logic and API flows. This is a frontend redesign and orchestration pass, not a backend rewrite.
- Use the standalone landing repo as a visual/reference input, not the canonical output location.
