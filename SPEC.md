# OrderFlow AI — Enhanced Landing Page v2

## 1. Concept & Vision
An Awwwards-worthy cinematic landing page for OrderFlow AI — the voice ordering SaaS for restaurants. The page feels like a premium product launch: dark, immersive, alive with motion. Every scroll is a reveal. Every interaction has weight. The vibe is "Apple keynote meets dark tech startup" — the kind of page that makes you want to call the number.

## 2. Design Language

### Aesthetic Direction
Dark cinematic tech — think Apple Vision Pro launch page meets high-end fintech. Deep void backgrounds with electric orange accents, glassmorphism cards, cinematic scroll-driven reveals. NOT generic startup dark mode — every element has intentional depth and glow.

### Color Palette
```
--void:        #0a0a0f   (background)
--void-light:  #111118   (card backgrounds)
--orange:      #FF6B35   (primary accent)
--orange-glow: #FF8C5A   (hover states)
--purple:      #7C3AED   (secondary accent)
--white:       #FFFFFF   (primary text)
--gray-400:    #9CA3AF   (secondary text)
--gray-600:    #4B5563   (muted text)
--glass:       rgba(255,255,255,0.04) (glassmorphism bg)
--border:      rgba(255,255,255,0.08) (glassmorphism border)
```

### Typography
- **Headlines:** Inter 900 (Black), tight tracking (-0.03em), large scale
- **Body:** Inter 400, relaxed line-height (1.7)
- **Mono/code:** JetBrains Mono for numbers and data
- Scale: Display 80px → H1 56px → H2 40px → H3 28px → Body 18px → Small 14px

### Spatial System
- Base unit: 8px
- Section padding: 120px vertical (mobile: 80px)
- Container max-width: 1280px, centered
- Card border-radius: 16px
- Button border-radius: 12px

### Motion Philosophy
- **Scroll:** Lenis smooth scroll with lerp (0.1) for cinematic inertia
- **Reveals:** Framer Motion — fade + translateY (20px), spring physics (stiffness: 100, damping: 15)
- **Scroll sequences:** GSAP ScrollTrigger with scrub: 1.5 for organic feel
- **Micro-interactions:** React Spring with tension: 200, friction: 20
- **3D:** React Three Fiber particle system, ambient motion
- Duration philosophy: reveals 0.6-0.8s, micro-interactions 0.2-0.3s, never block content

### Visual Assets
- Icons: Lucide React (consistent, clean)
- Images: Custom AI-generated from /assets folder (reuse existing)
- 3D: Three.js particle soundwave in hero
- Decorative: CSS gradient orbs, noise grain overlay, grid patterns

---

## 3. Layout & Structure

### Page Sections (top to bottom)

1. **Navigation** — Fixed, transparent → glass on scroll
2. **Hero** — Full viewport, 3D particles + parallax + animated phone
3. **Trust Bar** — "As seen in" press logos, subtle
4. **Live Demo** — Interactive AI chat simulation
5. **How It Works** — Sticky horizontal scroll narrative (3 panels)
6. **Features** — 8-card asymmetric bento grid, scroll-triggered
7. **Stats** — Animated counters with SVG ring progress
8. **Testimonials** — 3D carousel with drag
9. **Pricing** — 3 cards (Starter $49/mo, Pro $129/mo, Enterprise $299/mo), monthly/annual toggle, 14-day free trial
10. **FAQ** — Accordion, 8 detailed questions
11. **Lead Form** — Glass card, success state
12. **Footer** — 4-column links, social, location

### Responsive Strategy
- Mobile-first (375px base)
- Breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px
- Mobile: stack all layouts, reduce particle count to 500, disable 3D rotation
- Horizontal scroll narrative becomes vertical on mobile

---

## 4. Features & Interactions

### Hero
- **3D Particle Background:** 2000 points forming a soundwave shape, React Three Fiber, animates on load
- **Text Reveal:** "Take Orders" / "While You Sleep" characters animate in with spring stagger
- **Parallax:** 5 depth layers (stars, grid, glow orbs, phone, text) at different scroll speeds
- **Phone Mockup:** Glassmorphism phone showing Sal's Pizza demo conversation, rotates toward cursor
- **Ambient Orb:** Orange/purple gradient orbs float behind content with slow sine wave motion
- **Scroll Indicator:** Animated chevron + ring progress indicator

### Live Demo Section
- Two-column: phone mockup left, chat transcript right
- Typing effect for transcript (30ms per character)
- Animated waveform bars beneath AI responses
- User can TYPE an order in an input field and see AI response animate in
- Order confirmation card bounces in with spring physics
- Glow pulse on active speech bubble

### How It Works (Sticky Horizontal)
- GSAP ScrollTrigger pins section
- 3 panels slide in horizontally as user scrolls vertically
- Each panel: large step number, headline, phone mockup animation, description
- Step 1: Phone ringing → Step 2: AI waveform → Step 3: Kitchen display update
- Connection lines draw via SVG stroke animation

### Feature Cards
- Asymmetric grid (2 large, 6 medium)
- Cards: glass bg, border-white/[0.06], hover lifts + glows orange
- Intersection Observer triggers: opacity 0→1, y 60→0, scale 0.95→1
- Icon does micro-bounce on hover (spring scale 1→1.2→1)
- Images from /assets folder embedded as card backgrounds at low opacity

### Stats Counter
- 4 stats in a row with animated ring SVGs
- useCountUp hook: easeOutExpo curve, 2s duration
- Rings draw from 0 to value using stroke-dashoffset
- Triggers when section enters viewport

### Testimonials Carousel
- 3D perspective (rotateY based on card index)
- Auto-advances every 5 seconds with spring interpolation
- Drag to swipe with @use-gesture/react (momentum + bounds)
- Active card: scale 1, orange glow border, full opacity
- Inactive cards: scale 0.9, no glow, opacity 0.5

### Pricing
- Monthly/Annual toggle (Framer Motion layout animation)
- Annual shows 20% discount badge
- Pro card: scale 1.03, orange border glow, "Most Popular" badge
- Hover: translateY -4px, shadow increases
- Feature list with animated checkmarks

### FAQ Accordion
- 8 items, smooth height animation (Framer Motion layout)
- Orange accent on active item
- One open at a time

### Lead Form
- Fields: Name, Restaurant Name, Phone, Email, Locations (select)
- Animated label (floats up on focus)
- Submit button with loading state (spinner)
- Success: checkmark draws in via SVG stroke animation + message

---

## 5. Component Inventory

### NavBar
- States: transparent (load), glass (scrolled), mobile-open
- Logo: SVG soundwave icon + "OrderFlow" text
- Links: Features, Demo, Pricing
- CTA: "Start Free Trial" — orange gradient button
- Mobile: hamburger → full-screen overlay with staggered link reveal

### HeroSection
- Full viewport height (100vh, min-height: 700px)
- Contains: Canvas3D (particles), TextReveal, PhoneMockup3D, AmbientOrbs, ScrollIndicator

### Canvas3D (React Three Fiber)
- 2000 points, BufferGeometry
- Points material with orange color, size 0.05
- On load: points form soundwave shape, then scatter on scroll
- No orbit controls (static camera)

### PhoneMockup
- CSS glass card shaped like phone (390px × 844px ratio)
- Animated waveform bars inside
- Cursor-tracking rotation (React Spring, max 5deg)
- Shows AI conversation transcript

### TypingText
- Characters revealed one by one via Framer Motion stagger
- Blinking cursor at end while typing

### WaveformBars
- 12 bars, random heights, CSS keyframe animation
- Orange gradient color
- Animates when AI is "speaking"

### HowItWorks (Sticky Horizontal)
- GSAP ScrollTrigger container
- 3 Panel components, each 100vw wide
- SVG connecting lines with stroke-dasharray animation

### FeatureCard
- Glass background with image watermark
- Icon (Lucide), title, description
- States: default, hovered (lift + glow), tapped (scale 0.98)

### StatsRing
- SVG circle with stroke-dashoffset animation
- Number counter inside
- Label below

### TestimonialCarousel
- 3D CSS transform perspective container
- Card components with quote, author, stars
- Drag gesture handler

### PricingCard
- Glass background, feature list, CTA button
- States: default, highlighted (Pro), hovered

### FAQAccordion
- Item component with question + animated answer
- Orange left border on active item

### LeadForm
- Floating label inputs
- Animated submit button
- Success overlay with SVG checkmark

---

## 6. Technical Approach

### Framework
- **Next.js 15** with App Router (React 19, TypeScript)
- Single page (`app/page.tsx`) — no routing needed
- `"use client"` on all components (pure frontend)

### Key Libraries
```json
{
  "framer-motion": "^11.0.0",
  "gsap": "^3.12.0",
  "@gsap/react": "^2.1.0",
  "lenis": "^1.1.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0",
  "three": "^0.160.0",
  "@react-spring/web": "^9.7.0",
  "@use-gesture/react": "^10.3.0",
  "lucide-react": "^0.300.0",
  "@radix-ui/react-accordion": "^1.2.0",
  "@radix-ui/react-toggle": "^1.1.0",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0",
  "clsx": "^2.1.0"
}
```

### Architecture
```
app/
  layout.tsx       — Root layout, fonts, metadata
  page.tsx        — Main page, section assembly
  page.module.css — Section-specific styles (CSS modules)
components/
  NavBar.tsx
  Hero/
    index.tsx
    Canvas3D.tsx
    PhoneMockup.tsx
    AmbientOrbs.tsx
    ScrollIndicator.tsx
  LiveDemo/
    index.tsx
    TypingText.tsx
    WaveformBars.tsx
    DemoInput.tsx
  HowItWorks/
    index.tsx
    Panel.tsx
  Features/
    index.tsx
    FeatureCard.tsx
  Stats/
    index.tsx
    StatsRing.tsx
    useCountUp.ts
  Testimonials/
    index.tsx
    Carousel.tsx
  Pricing/
    index.tsx
    PricingCard.tsx
  FAQ/
    index.tsx
    AccordionItem.tsx
  LeadForm/
    index.tsx
  Footer/
    index.tsx
lib/
  smooth-scroll.ts  — Lenis initialization
  scroll-animations.ts — GSAP ScrollTrigger setup
  animations.ts     — Shared Framer Motion variants
styles/
  globals.css       — Tailwind base + CSS variables
```

### Performance
- Particle count: 2000 desktop, 500 mobile (detect via `navigator.maxTouchPoints`)
- GSAP ScrollTrigger cleanup in `useEffect` return
- Lenis destroyed on unmount
- Images: use `next/image` with priority on hero
- Font: Inter from `next/font/google` (self-hosted, no FOUT)

### Assets
- All images from `../assets/` (relative path from project root)
- Reuse: hero-banner-restaurant.png, phone-ai-ordering.png, kitchen-display-mockup.png, ai-voice-brain.png
