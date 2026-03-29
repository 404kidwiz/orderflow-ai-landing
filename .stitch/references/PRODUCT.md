# OrderFlow AI — Product Plan

## One-Liner
AI voice ordering system that answers your phone, takes orders, and sends them to the kitchen — so you never miss a call.

## The Problem
- Restaurants lose 20-30% of phone orders (busy lines, can't hear, slow response)
- Staff juggling phones + in-store customers = errors
- Hiring dedicated phone order taker = $15-20/hr they can't afford

## The Solution
OrderFlow AI answers calls 24/7, takes orders naturally via voice, confirms details, and sends directly to kitchen POS/display.

## Pricing
- **Starter:** $299/month (up to 500 orders)
- **Pro:** $599/month (up to 2000 orders)
- **Enterprise:** Custom (unlimited + integrations)
- **Per-order option:** $0.75/order if they prefer pay-as-you-go

## Target Customers
1. **Pizzerias** — High phone order volume
2. **Chinese/Asian restaurants** — Takeout-heavy
3. **Local burger/sandwich shops** — Busy lunch rushes
4. **Food trucks** — Can't afford extra staff
5. **Small chains (2-5 locations)** — Want consistency

## Key Features (MVP)
- [ ] Voice ordering via phone (Twilio integration)
- [ ] Customizable menu per restaurant
- [ ] Real-time order display (kitchen dashboard)
- [ ] Order confirmation + estimated time
- [ ] SMS confirmation to customer
- [ ] Analytics dashboard (orders, peak times, popular items)

## Tech Stack
- **Backend:** Python/FastAPI (existing)
- **Frontend:** HTML/CSS/JS (existing kiosk + dashboard)
- **Voice:** OpenAI Whisper + TTS
- **Phone:** Twilio (incoming calls)
- **Database:** SQLite (simple) or Supabase (cloud)
- **Deploy:** Railway/Render (one-click)

## Revenue Target
- 10 restaurants @ $400/month avg = $4K MRR
- 50 restaurants = $20K MRR
- 100 restaurants = $40K MRR (hitting $50K/month goal)

## Timeline
- Week 1: White-label + Twilio integration
- Week 2: Deploy + onboard 2-3 beta restaurants
- Week 3: Case study + marketing site
- Week 4: Scale outreach + sales
