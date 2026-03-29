# OrderFlow AI — Product Requirements Document & Implementation Plan

**Version:** 2.1
**Date:** March 24, 2026 (Updated)
**Author:** CoolVibeCoding + Claude
**Target Launch:** April 7, 2026 (14-day sprint)
**First Restaurant Deployment:** Buford / Greater Atlanta Area

---

## Implementation Status Dashboard

> **Last updated:** March 24, 2026 — End of Day 1

### Overall Progress: ~35% Complete

| Area | Status | Progress |
|------|--------|----------|
| LLM Integration (Providers + Router + Prompts + Extractor) | DONE | 100% |
| Voice Processor Rewrite (ConversationManager + State Machine) | DONE | 100% |
| Session Management (Upstash Redis + InMemory fallback) | DONE | 100% |
| Voice Webhooks (incoming, process, no-input, transfer, status) | DONE | 100% |
| Test Suite (unit + integration, 55+ test cases) | DONE | 100% |
| Config & DevX (.env.example, requirements, pytest.ini) | DONE | 100% |
| Landing Page (Awwwards-tier React build) | NOT STARTED | 0% |
| Admin Dashboard | NOT STARTED | 0% |
| Authentication (Supabase Auth) | NOT STARTED | 0% |
| Onboarding Wizard | NOT STARTED | 0% |
| Menu Editor UI | NOT STARTED | 0% |
| Analytics Dashboard | NOT STARTED | 0% |
| CI/CD Pipeline | NOT STARTED | 0% |
| Production Deployment | NOT STARTED | 0% |

### What Was Built (Completed)

**1. LLM Provider Abstraction (`src/llm/providers.py` — 13KB)**
- Four provider implementations: `GroqProvider` (Llama 3.3 70B, free), `OpenRouterProvider` (free), `GeminiProvider` (Flash 2.0, free), `KeywordFallbackProvider` (no API)
- All use REST via httpx — zero SDK dependencies, serverless-safe
- Shared `LLMResponse` dataclass with text, order_action, provider, latency_ms, model, token counts
- Structured output parsing from multiple formats (```json blocks, `<order>` tags, raw JSON)
- **Cost: $0/month** on free tiers (Groq 30 RPM, OpenRouter free models, Gemini Flash free tier)

**2. LLM Router with Failover (`src/llm/router.py` — 5.6KB)**
- Automatic provider failover: Groq → OpenRouter → Gemini → Keyword Fallback
- Exponential backoff cooldown per provider (60s base, up to 10 min)
- Failure tracking with `_failure_counts` and `_last_failure_time`
- `get_provider_status()` for admin dashboard health monitoring
- Module-level singleton via `get_router()`

**3. System Prompt Builder (`src/llm/prompts.py` — 9.8KB)**
- Context-aware prompts from restaurant JSON config
- Sections: identity/personality, full menu with sizes/aliases, ordering rules (tax, delivery, min order), response format (SPOKEN + ORDER_UPDATE JSON), current state, customer history, upsell hints
- Separate closed-state prompt (brief, no ordering)
- Smart upsell detection: missing drinks/desserts in current order

**4. Order Extractor (`src/llm/order_extractor.py` — 11KB)**
- Parses LLM responses into `(spoken_text, OrderAction)` tuples
- Menu index with name + alias lookup for validation
- Three extraction strategies: code block, ORDER_UPDATE tag, raw JSON
- Fuzzy matching for unrecognized items with price correction from menu
- `calculate_order_total()` and `format_order_for_speech()` for TTS

**5. Voice Processor Rewrite (`src/voice_processor.py` — 16KB)**
- `CallState` enum: GREETING, ORDERING, CLARIFYING, CONFIRMING, COMPLETE, TRANSFER, CLOSED
- `ConversationManager`: per-call state machine with full LLM integration
- `process_input()` → `(spoken_text, should_hangup)`: main entry point
- Item management: add/remove/modify with duplicate merging
- Speech failure handling: re-prompt up to 3x, then transfer
- Business hours checking with timezone support
- Full Redis serialization via `to_dict()` / `from_dict()`
- MAX_TURNS = 20, MAX_FAILURES = 3

**6. Session Manager (`src/session.py` — 8.1KB)**
- `UpstashRedisBackend`: REST-based (no TCP), serverless-safe
- `InMemoryBackend`: dict-based fallback for local dev/testing
- `SessionManager`: high-level API — `save()`, `load()`, `delete()`
- Key format: `call:{call_sid}`, TTL: 1800s (30 min)
- JSON serialization, module-level singleton

**7. Voice Webhooks (`api/voice.py` — 19KB)**
- 5 endpoints: `/incoming`, `/process`, `/no-input`, `/transfer`, `/status`
- Full session lifecycle: create → load → update → finalize → cleanup
- TwiML builders: `twiml_gather()`, `twiml_hangup()`, `twiml_transfer()`
- SMS confirmation via direct Twilio REST API (httpx, no SDK)
- Background Reflexion evaluation on call complete
- Speech hints from menu item names for Twilio STT accuracy

**8. Test Suite (55+ tests)**
- `tests/conftest.py`: Shared fixtures (restaurant_config, menu_config, mock_llm_response, memory_session)
- `tests/unit/test_order_extractor.py`: 15 tests — spoken extraction, order actions, item validation, totals, speech formatting
- `tests/unit/test_voice_processor.py`: 13 tests — init, serialization, items, actions, failures, finalization, LLM integration
- `tests/unit/test_llm_providers.py`: 12 tests — availability, keyword fallback, router failover, JSON extraction
- `tests/unit/test_session_manager.py`: 7 tests — CRUD, overwrite, complex data, concurrency
- `tests/integration/test_voice_flow.py`: 8 tests — full HTTP cycle with mocked LLM

**9. Configuration Updates**
- `requirements.txt`: Lean deps, no LLM SDKs (all REST via httpx)
- `requirements-dev.txt`: pytest, pytest-asyncio, pytest-cov, ruff, black
- `.env.example`: Documents all 3 free LLM keys + Upstash Redis + upgrade path
- `pytest.ini`: asyncio_mode=auto, testpaths=tests

### What Still Needs Building (Remaining)

**Priority 1 — Must Have for Launch (Sprint Days 2-7)**
- [ ] Awwwards-tier Landing Page (React/JSX with Framer Motion, dark tech design)
- [ ] Remove old inline voice endpoints from `api/index.py` (cleanup)
- [ ] Supabase Auth integration (email/password + magic link)
- [ ] Basic admin dashboard (login, order stats, menu view)
- [ ] CI/CD pipeline (GitHub Actions: test → deploy)

**Priority 2 — Should Have for Launch (Sprint Days 8-12)**
- [ ] Menu Editor UI (visual CRUD, category management, drag reorder)
- [ ] Onboarding wizard (restaurant info → menu setup → plan selection)
- [ ] Call analytics page (call log table, conversion funnel, peak hours)
- [ ] Billing integration (Stripe checkout + portal + webhook)
- [ ] Kitchen Display upgrade (WebSocket real-time, audio chime, timers)

**Priority 3 — Nice to Have (Sprint Days 13-14 or Post-Launch)**
- [ ] Returning customer recognition (phone lookup → history in LLM context)
- [ ] Delivery zone validation (geocoding + distance check)
- [ ] Promo code support (voice flow + admin management)
- [ ] Call recording playback in admin
- [ ] Email reports (daily/weekly order summaries)
- [ ] Multi-language support (Spanish first)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Mission](#2-product-vision--mission)
3. [Current State Assessment](#3-current-state-assessment)
4. [Target Architecture](#4-target-architecture)
5. [User Personas](#5-user-personas)
6. [User Stories](#6-user-stories)
7. [Feature Specifications](#7-feature-specifications)
8. [Landing Page Design Specification](#8-landing-page-design-specification)
9. [Admin Dashboard Design Specification](#9-admin-dashboard-design-specification)
10. [Design System](#10-design-system)
11. [Database Schema Updates](#11-database-schema-updates)
12. [API Specification](#12-api-specification)
13. [LLM Integration Architecture](#13-llm-integration-architecture)
14. [Testing Strategy](#14-testing-strategy)
15. [2-Week Sprint Plan](#15-two-week-sprint-plan)
16. [Deployment & DevOps](#16-deployment--devops)
17. [Success Metrics & KPIs](#17-success-metrics--kpis)
18. [Risk Assessment & Mitigation](#18-risk-assessment--mitigation)
19. [Post-Launch Roadmap](#19-post-launch-roadmap)
20. [New Enhancement Suggestions](#20-new-enhancement-suggestions)

---

## 1. Executive Summary

OrderFlow AI is an AI-powered voice ordering system that answers restaurant phone calls, takes orders through natural conversation, sends SMS confirmations, and routes orders to a real-time kitchen display. The product targets small-to-medium restaurants (pizzerias, Chinese takeout, burger joints, food trucks) that lose 20-30% of phone orders due to busy lines, staff limitations, and after-hours closures.

**Current State (Updated):** The core AI backbone is complete. LLM-powered conversational ordering with 3 free providers (Groq, OpenRouter, Gemini) + keyword fallback is fully implemented. Voice processor has been rewritten from keyword matching to a full state machine with natural language understanding. Session state persists in Upstash Redis (serverless-safe). Voice webhooks handle the complete call lifecycle. 55+ automated tests cover unit and integration scenarios. The voice flow is production-ready for real calls. What's missing: the frontend (landing page, admin dashboard), authentication, onboarding, and deployment infrastructure.

**Target State (remaining ~10 days):** A production-grade SaaS platform with the completed LLM-powered backend, an Awwwards-tier marketing site, a professional restaurant admin dashboard, Supabase Auth, self-service onboarding, and CI/CD — ready to deploy at a real restaurant in the Greater Atlanta area.

**Revenue Target:** First 3 paying restaurants within 30 days of launch. $4K MRR within 90 days.

---

## 2. Product Vision & Mission

**Vision:** Every restaurant in America answers every phone call, every time — powered by AI that sounds human, never makes mistakes, and gets better with every order.

**Mission:** Replace the chaos of restaurant phone ordering with an intelligent voice agent that captures orders accurately, delights customers, and pays for itself within the first week.

**Positioning Statement:** For small restaurant owners who lose revenue from missed or mishandled phone orders, OrderFlow AI is a voice ordering system that answers calls 24/7 with human-like conversation. Unlike hiring extra staff or using generic IVR systems, OrderFlow AI understands natural speech, learns your menu, and improves with every call.

**Unique Value Propositions:**

1. **Zero friction for customers** — They just call the same number they always have. No app, no signup, no QR code.
2. **Self-improving intelligence** — The Reflexion module analyzes every call and automatically suggests menu config improvements, prompt refinements, and flow optimizations.
3. **60-second onboarding** — Restaurant owner enters their menu, picks a plan, and gets a phone number. Calls start routing immediately.
4. **Pays for itself** — At $299/month, a restaurant only needs to capture 3 extra orders per day (that they would have missed) to see positive ROI.

---

## 3. Current State Assessment

### What Works
- Core Twilio voice webhook flow (incoming call → greeting → gather speech → process → confirm)
- TwiML generation for greetings, menu reading, order confirmation, and fallback/transfer
- SMS order confirmation via Twilio
- Multi-tenant restaurant config system (JSON files per restaurant)
- Supabase PostgreSQL schema with RLS, order tracking, call logs, and analytics views
- Kitchen display (real-time order cards with status tabs)
- Stripe subscription billing integration
- Reflexion self-improvement module (call evaluator + learning loop + pattern detection)
- Vercel serverless deployment pipeline

### Critical Gaps (Updated — Resolved items marked with ✅)

| Gap | Severity | Status | Impact |
|-----|----------|--------|--------|
| ~~No LLM integration~~ | CRITICAL | ✅ RESOLVED | `src/llm/` — 4 providers, router, prompts, extractor |
| ~~In-memory conversation state~~ | CRITICAL | ✅ RESOLVED | `src/session.py` — Upstash Redis + InMemory fallback |
| **No authentication** — No login, no API keys, no session management | CRITICAL | ❌ OPEN | Anyone can access any restaurant's orders and data |
| ~~No test suite~~ | HIGH | ✅ RESOLVED | 55+ tests across unit + integration |
| ~~Duplicated entry points~~ | HIGH | ✅ PARTIAL | New `api/voice.py` router added; old routes in `api/index.py` still need cleanup |
| **MVP-quality frontend** — Vanilla HTML/CSS/JS, no responsive polish | HIGH | ❌ OPEN | Doesn't justify $299/month pricing |
| **No admin dashboard** — Restaurant owners have no way to manage their account | HIGH | ❌ OPEN | Can't self-serve, every change requires developer intervention |
| ~~Weak error handling~~ | MEDIUM | ✅ RESOLVED | Try/except on all provider calls, graceful LLM failover, speech failure re-prompts |
| **No call recording/playback** — Transcripts stored but no audio review | MEDIUM | ❌ OPEN | Hard to debug ordering issues |
| **No delivery zone validation** — Accepts all delivery orders regardless of range | LOW | ❌ OPEN | Could lead to unfulfillable orders |

---

## 4. Target Architecture

### System Architecture (Post-Refactor)

```
                                    ┌─────────────────────────────────┐
                                    │      Vercel Edge Network        │
                                    │  ┌───────────────────────────┐  │
                                    │  │    Next.js Frontend        │  │
┌──────────┐    Phone Call          │  │  ┌─────────────────────┐  │  │
│ Customer  │──────────────────────▶│  │  │  Landing Page (SSR)  │  │  │
│  (Phone)  │                       │  │  │  Admin Dashboard     │  │  │
└──────────┘                        │  │  │  Kitchen Display     │  │  │
      │                             │  │  │  Onboarding Flow     │  │  │
      │ SMS                         │  │  └─────────────────────┘  │  │
      │                             │  └───────────────────────────┘  │
      ▼                             │  ┌───────────────────────────┐  │
┌──────────┐    Webhook             │  │    FastAPI Backend         │  │
│  Twilio   │──────────────────────▶│  │  ┌─────────────────────┐  │  │
│  (Voice   │                       │  │  │  Voice Webhooks      │  │  │
│   + SMS)  │◀──────────────────────│  │  │  Order API           │  │  │
└──────────┘    TwiML               │  │  │  Auth (Supabase)     │  │  │
                                    │  │  │  Billing (Stripe)    │  │  │
                                    │  │  │  Analytics API       │  │  │
                                    │  │  └─────────────────────┘  │  │
                                    │  └───────────┬───────────────┘  │
                                    └──────────────┼──────────────────┘
                                                   │
                         ┌─────────────────────────┼─────────────────────────┐
                         │                         │                         │
                    ┌────▼─────┐            ┌──────▼──────┐          ┌──────▼──────┐
                    │ Supabase  │            │   Upstash    │          │  Claude /   │
                    │ Postgres  │            │    Redis     │          │  OpenAI     │
                    │  + Auth   │            │  (Sessions)  │          │  (LLM API)  │
                    └──────────┘            └─────────────┘          └─────────────┘
                    - Restaurants            - Call state              - Order parsing
                    - Orders                 - Rate limiting           - Conversation
                    - Menu items             - Caching                 - Upselling
                    - Call logs                                        - Intent detection
                    - User auth
```

### Key Architectural Decisions

**Decision 1: Next.js for the Frontend**
Move from vanilla HTML to Next.js (React). This gives us: SSR for the landing page (SEO), React components for the admin dashboard, API routes colocated with the frontend, and Tailwind CSS + Framer Motion for Awwwards-quality design.

**Decision 2: Upstash Redis for Conversation State**
Replace in-memory dict with Upstash Redis (serverless-compatible). Each call's `ConversationManager` state is serialized to Redis with a 30-minute TTL. Survives Vercel cold starts.

**Decision 3: Supabase Auth for Authentication**
Use Supabase's built-in auth (email/password + magic link) for restaurant owners. Row-Level Security policies tied to `auth.uid()`. No custom auth implementation needed.

**Decision 4: Free-Tier LLM Providers for Order Parsing** ✅ IMPLEMENTED
Replace keyword matching with free LLM providers: Groq (Llama 3.3 70B, primary), OpenRouter (free models, secondary), Gemini Flash 2.0 (tertiary). All use REST via httpx — zero SDK cost. Structured output via SPOKEN + ORDER_UPDATE format. Keyword fallback if all APIs are down. Upgrade path to Claude/OpenAI when revenue justifies it.

**Decision 5: Consolidated FastAPI Backend**
Single `app.py` that both Vercel and local dev import. No more duplicated routes. Vercel entry point becomes a thin wrapper.

---

## 5. User Personas

### Persona 1: Marco — Restaurant Owner
- **Age:** 45. Owns "Italy's Pizza & Pasta" in Buford, GA.
- **Tech Savvy:** Low-medium. Uses Square POS, has a basic website, manages Facebook page.
- **Pain Points:** Misses 15-20 calls during dinner rush (6-9pm). Can't afford a dedicated phone person. Loses ~$200/night in missed orders.
- **Motivation:** "If this thing can answer my phones and get orders right, I'll pay $300/month in a heartbeat."
- **Key Needs:** Dead-simple setup. Accurate orders. Ability to see what's happening. Quick support if something goes wrong.

### Persona 2: Sarah — Kitchen Manager
- **Age:** 32. Runs the kitchen at a busy pizzeria.
- **Tech Savvy:** Medium. Uses tablets, familiar with kitchen display systems.
- **Pain Points:** Paper tickets get lost. Phone orders shouted across the kitchen get garbled. No way to prioritize.
- **Motivation:** "I need to see orders on a screen the second they come in, organized by when they need to go out."
- **Key Needs:** Real-time kitchen display. Clear item details. One-tap status updates. Audible alert for new orders.

### Persona 3: David — Regular Customer
- **Age:** 28. Orders from the same 2-3 restaurants weekly.
- **Tech Savvy:** High. Uses apps but also calls in orders when driving.
- **Pain Points:** Gets put on hold. Has to repeat his order twice. Doesn't get confirmation until he shows up.
- **Motivation:** "I just want to call, say what I want, and know it'll be ready when I get there."
- **Key Needs:** Fast, natural conversation. Accurate order capture. Text confirmation with ETA.

### Persona 4: Lisa — First-Time Caller
- **Age:** 55. Saw the restaurant on Google, calling to order for the first time.
- **Tech Savvy:** Low. Doesn't use delivery apps. Prefers calling.
- **Pain Points:** Nervous talking to a robot. Wants to ask questions about the menu. Might change her mind.
- **Motivation:** "I just want to order food without feeling stupid talking to a computer."
- **Key Needs:** Warm, patient conversation. Ability to ask about menu items. Clear confirmation. Human fallback if needed.

---

## 6. User Stories

### Epic 1: Voice Ordering (Core)

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| VO-1 | As a customer, I want to call the restaurant and be greeted by a friendly AI so I can start ordering immediately | P0 | 1 |
| VO-2 | As a customer, I want to speak naturally ("I'll have a large pepperoni and two cokes") and have the AI understand my full order in one sentence | P0 | 1 |
| VO-3 | As a customer, I want the AI to ask clarifying questions when I'm ambiguous ("What size pizza would you like?") | P0 | 1 |
| VO-4 | As a customer, I want to hear my order read back to me for confirmation before it's placed | P0 | 1 |
| VO-5 | As a customer, I want to receive an SMS with my order details, total, and estimated pickup time | P0 | 1 |
| VO-6 | As a customer, I want to modify my order mid-conversation ("Actually, make that a medium instead") | P0 | 1 |
| VO-7 | As a customer, I want to ask about the menu ("What kinds of pizza do you have?") and get a natural response | P1 | 1 |
| VO-8 | As a customer, I want the AI to suggest additions ("Would you like to add a drink or side?") | P1 | 1 |
| VO-9 | As a customer, I want to be transferred to a human if the AI can't understand me after 3 attempts | P0 | 1 |
| VO-10 | As a customer, I want the AI to recognize me if I've called before and offer my usual order | P2 | 2 |
| VO-11 | As a customer, I want to specify pickup or delivery and give my address for delivery orders | P1 | 2 |
| VO-12 | As a customer, I want to order in Spanish and have the AI respond in Spanish | P2 | Post |

### Epic 2: Kitchen Display System (KDS)

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| KD-1 | As a kitchen manager, I want to see new orders appear on the display in real-time with an audible chime | P0 | 1 |
| KD-2 | As a kitchen manager, I want to tap an order to move it from "New" → "Preparing" → "Ready" → "Complete" | P0 | 1 |
| KD-3 | As a kitchen manager, I want to see order details (items, quantities, sizes, modifications, special instructions) clearly | P0 | 1 |
| KD-4 | As a kitchen manager, I want orders color-coded by age (green = fresh, yellow = aging, red = overdue) | P1 | 2 |
| KD-5 | As a kitchen manager, I want to see estimated prep time and a countdown timer per order | P1 | 2 |
| KD-6 | As a kitchen manager, I want the customer to be automatically SMS'd when their order status changes to "Ready" | P1 | 2 |
| KD-7 | As a kitchen manager, I want to print an order ticket from the display | P2 | Post |

### Epic 3: Restaurant Admin Dashboard

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| AD-1 | As an owner, I want to log in with my email and password to a secure admin dashboard | P0 | 1 |
| AD-2 | As an owner, I want to see today's order count, revenue, and average order value on the dashboard home | P0 | 2 |
| AD-3 | As an owner, I want to edit my menu (add/remove items, change prices, update descriptions) through a visual editor | P0 | 2 |
| AD-4 | As an owner, I want to view call analytics (total calls, conversion rate, avg call duration, peak hours) | P1 | 2 |
| AD-5 | As an owner, I want to listen to call recordings to verify order accuracy | P1 | 2 |
| AD-6 | As an owner, I want to see the AI's improvement suggestions from the Reflexion module | P1 | 2 |
| AD-7 | As an owner, I want to manage my subscription plan and billing through the dashboard | P1 | 2 |
| AD-8 | As an owner, I want to set my restaurant hours and have the AI greet differently when we're closed | P1 | 2 |
| AD-9 | As an owner, I want to customize the AI's greeting message and voice personality | P2 | 2 |
| AD-10 | As an owner, I want to see a daily/weekly email report summarizing order stats | P2 | Post |
| AD-11 | As an owner, I want to manage multiple restaurant locations from one dashboard | P2 | Post |

### Epic 4: Onboarding & Billing

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| OB-1 | As a prospective customer, I want to sign up and configure my restaurant in under 5 minutes | P0 | 2 |
| OB-2 | As a new user, I want to enter my menu items through a guided wizard (not raw JSON) | P0 | 2 |
| OB-3 | As a new user, I want to select a subscription plan and enter payment details | P0 | 2 |
| OB-4 | As a new user, I want to receive a dedicated phone number for my restaurant immediately after signup | P1 | 2 |
| OB-5 | As a new user, I want to make a test call to hear how the AI handles my menu before going live | P1 | 2 |
| OB-6 | As an owner, I want to upgrade/downgrade my plan through the dashboard | P1 | 2 |
| OB-7 | As an owner, I want to see my usage (orders this month) vs. my plan limit | P1 | 2 |

### Epic 5: Marketing Landing Page

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| LP-1 | As a visitor, I want to immediately understand what OrderFlow AI does within 3 seconds of landing | P0 | 1 |
| LP-2 | As a visitor, I want to see a live demo (call the number right from the page) | P0 | 1 |
| LP-3 | As a visitor, I want to see pricing clearly and compare plans | P0 | 1 |
| LP-4 | As a visitor, I want to see social proof (testimonials, logos, stats) | P1 | 2 |
| LP-5 | As a visitor, I want the page to feel premium and trustworthy (Awwwards-quality design) | P0 | 1 |
| LP-6 | As a visitor, I want to sign up directly from the landing page with a smooth transition to onboarding | P0 | 2 |

### Epic 6: Infrastructure & Reliability

| ID | Story | Priority | Sprint |
|----|-------|----------|--------|
| IN-1 | As a developer, I want conversation state persisted in Redis so calls survive serverless cold starts | P0 | 1 |
| IN-2 | As a developer, I want a single consolidated FastAPI app imported by both local and Vercel entry points | P0 | 1 |
| IN-3 | As a developer, I want Supabase Auth integrated for restaurant owner login | P0 | 1 |
| IN-4 | As a developer, I want unit tests for voice processing, order parsing, and price calculation | P0 | 1 |
| IN-5 | As a developer, I want integration tests for the full Twilio webhook flow | P1 | 2 |
| IN-6 | As a developer, I want error monitoring and alerting (Sentry or similar) | P1 | 2 |
| IN-7 | As a developer, I want rate limiting on all public API endpoints | P1 | 2 |
| IN-8 | As a developer, I want CI/CD pipeline with tests running on every push | P1 | 2 |

---

## 7. Feature Specifications

### 7.1 LLM-Powered Order Parsing

**Current:** `VoiceProcessor._generate_response()` uses keyword matching ("menu" → read menu, "yes" → confirm order). Cannot handle natural language.

**Target:** Claude 3.5 Haiku processes each customer utterance with full conversation history and structured tool calling to extract order data.

**Flow:**
```
Customer Speech → Twilio STT → Text → Claude API (with menu context + history) → Structured Response
                                                                                      │
                                                            ┌─────────────────────────┤
                                                            ▼                         ▼
                                                    TTS Response Text         Order Items JSON
                                                    (spoken to customer)      (stored in Redis)
```

**Claude System Prompt Structure:**
```
You are the voice ordering assistant for {restaurant_name}.
Your personality: {personality_config}
Current menu: {full_menu_json}
Current order so far: {order_items}
Conversation turn: {turn_count}
Restaurant hours: {hours}
Current time: {now}

Instructions:
- Parse the customer's speech into order items using the extract_order tool
- Ask clarifying questions for ambiguous items (size, quantity)
- Suggest upsells after 2+ items ordered (drinks, sides, desserts)
- Confirm the complete order before finalizing
- Use natural, warm conversational tone
- Keep responses under 3 sentences (voice must be concise)
- If you can't understand after 2 attempts, offer to transfer to staff
```

**Tool Definition for Structured Output:**
```json
{
  "name": "extract_order",
  "description": "Extract or update order items from customer speech",
  "parameters": {
    "action": "add | remove | modify | confirm | cancel",
    "items": [
      {
        "name": "string (must match menu item)",
        "quantity": "integer",
        "size": "small | medium | large (if applicable)",
        "modifications": ["string"],
        "price": "float (calculated from menu)"
      }
    ],
    "response_text": "string (what to say back to customer)",
    "needs_clarification": "boolean",
    "clarification_question": "string (if needs_clarification)",
    "order_complete": "boolean",
    "transfer_to_human": "boolean"
  }
}
```

**Fallback Strategy (Implemented):** ✅
1. Primary: Groq — Llama 3.3 70B (free, ~200ms latency, 30 RPM)
2. Secondary: OpenRouter — Llama 3.3 70B (free tier, ~500ms)
3. Tertiary: Gemini Flash 2.0 (free tier, ~300ms)
4. Emergency: Keyword Fallback (no API, basic pattern matching)
5. Last resort: Transfer to human (after 3 consecutive failures)

**Cost Estimate (Updated):**
- All three LLM providers are on free tiers = **$0/month**
- Groq free tier: 30 requests/minute, 14,400 tokens/minute
- OpenRouter free tier: rate-limited but sufficient for low-volume launch
- Gemini free tier: 15 RPM, 1M tokens/day
- At 500 calls/month with 5 turns each = 2,500 requests → well within free limits
- **Upgrade to paid tiers only when exceeding free limits (~$5-15/month)**

### 7.2 Conversation State Management (Redis)

**Current:** `conversations = {}` — Python dict in memory, lost on every serverless cold start.

**Target:** Upstash Redis with JSON serialization.

**Data Model (Redis Key: `call:{call_sid}`):**
```json
{
  "call_sid": "CA...",
  "restaurant_id": "sample",
  "caller_phone": "+1234567890",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "I'd like a large pepperoni"},
    {"role": "assistant", "content": "Great choice! ..."}
  ],
  "order_items": [
    {"name": "Pepperoni Pizza", "quantity": 1, "size": "large", "price": 16.99}
  ],
  "turn_count": 3,
  "state": "ordering",
  "created_at": "2026-03-24T12:00:00Z"
}
```

**TTL:** 30 minutes (calls should never last longer; auto-cleanup)
**Library:** `upstash-redis` (native REST, no TCP — perfect for serverless)

### 7.3 Authentication System

**Implementation:** Supabase Auth (email + password, magic link)

**Flows:**
1. **Restaurant Owner Signup:** Email → Verify → Create `auth.users` entry → Link to `restaurants` table
2. **Restaurant Owner Login:** Email + Password → Supabase JWT → Stored in httpOnly cookie
3. **Admin Dashboard Access:** JWT validated on every page load; redirects to login if expired
4. **API Protection:** Bearer token in Authorization header; validated against Supabase
5. **Kitchen Display:** PIN-based access (4-digit PIN set by owner, no full auth needed)

**RLS Policy Updates:**
```sql
-- Restaurant owners can only read/write their own data
CREATE POLICY "owner_access" ON public.orders
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );
```

### 7.4 Returning Customer Recognition

**How it works:**
- When a call comes in, look up `caller_phone` in `call_logs` + `orders` tables
- If they've ordered before, retrieve their last 3 orders
- Include in LLM context: "This is a returning customer. Their previous orders: [...]"
- AI can say: "Welcome back! Would you like your usual — a large pepperoni and two Cokes?"

**Privacy:** Phone numbers hashed in long-term storage. Raw number only used during active call session.

### 7.5 Smart Upselling

**Rules engine (configurable per restaurant):**
1. **Drink suggestion:** If order has food but no drinks after 2+ items, suggest: "Would you like to add a drink to that?"
2. **Side suggestion:** If order has a main but no appetizer, suggest the most popular side
3. **Size upgrade:** If ordering medium, mention the large is "only $2 more"
4. **Dessert close:** Before confirming, mention: "Can I add a dessert today? Our cannoli is really popular"

**Implementation:** Rules defined in restaurant config JSON, injected into LLM system prompt.

### 7.6 Business Hours & Closed State

**When restaurant is closed:**
- AI greets: "Thanks for calling {restaurant}. We're currently closed. Our hours are {hours}. You can leave a voicemail and we'll call you back, or call again during business hours."
- Option to still take a pre-order for next opening

**When restaurant is closing soon (< 30 min):**
- AI mentions: "Just so you know, our kitchen closes in {X} minutes, so this would be our last order window."

### 7.7 Delivery Zone Validation

**Implementation:**
- Restaurant config includes `delivery_radius_miles` and `address` (lat/lng)
- When customer says "delivery", AI asks for address
- Geocode via free Nominatim API → calculate distance → accept or suggest pickup
- If outside zone: "I'm sorry, that address is outside our delivery area. Would you like to do pickup instead?"

### 7.8 Promo Code Support

**Voice flow:**
- At confirmation: "Do you have a promo code?"
- Customer speaks code → AI validates against `promo_codes` table
- Applies discount, reads updated total

**Data model:**
```json
{
  "code": "FIRST10",
  "type": "percent",
  "value": 10,
  "min_order": 20.00,
  "max_uses": 100,
  "expires_at": "2026-04-30",
  "active": true
}
```

---

## 8. Landing Page Design Specification

### Design Philosophy: Awwwards / Godly.website Tier

The landing page is the first impression. It must communicate trust, innovation, and premium quality in under 3 seconds. The design should feel like a $10,000+ professional build — not a template, not AI slop.

### Design Profile: Dark Tech

**Color Palette:**
- Background: `#0A0A0F` (near-black with blue undertone)
- Surface: `#12121A` (card backgrounds)
- Border: `rgba(255, 255, 255, 0.06)` (subtle glass borders)
- Primary Accent: `#FF4D00` → `#FF6B2C` (OrderFlow orange/red gradient)
- Secondary Accent: `#7C3AED` (purple for highlights)
- Text Primary: `#F5F5F7` (near-white)
- Text Secondary: `#8B8B9E` (muted gray)
- Success: `#22C55E`
- Glass: `rgba(255, 255, 255, 0.05)` with `backdrop-blur-xl`

**Typography:**
- Display Font: Inter (or Satoshi/General Sans if custom loaded)
- Headline: 64-96px, `font-bold`, `tracking-tight`, `leading-[1.05]`
- Subheadline: 20-24px, `font-normal`, `text-secondary`
- Body: 16-18px, `leading-relaxed`
- Monospace (for code/stats): JetBrains Mono

### Page Sections (Top to Bottom)

**Section 1: Navigation Bar**
- Floating glassmorphism nav: `bg-white/5 backdrop-blur-xl border-b border-white/10`
- Logo (left): "OrderFlow" wordmark with subtle gradient on "Flow"
- Links (center): Features, Pricing, Demo, Docs
- CTAs (right): "Login" (ghost button) + "Start Free Trial" (primary gradient button with glow)
- Appears on scroll with smooth slide-down animation
- Mobile: Hamburger menu with full-screen overlay, staggered link animations

**Section 2: Hero (Full Viewport)**
- Layout: Split — left side text, right side animated visual
- Left side:
  - Badge: `<span>` with glass background, pulsing dot, text: "Now AI-Powered with Claude"
  - Headline: "Never Miss a Phone Order Again" — word-by-word fade-in animation using Framer Motion
  - Subheadline: "AI voice ordering that answers your restaurant's phone, takes orders naturally, and sends them straight to the kitchen. 24/7. No app required."
  - Two CTAs:
    - Primary: "Start Free Trial" → gradient button with shadow glow (`shadow-orange-500/25`), spring hover physics
    - Secondary: "Call Our Demo" → glass button with phone icon, links to `tel:+17705255393`
  - Social proof strip: "Trusted by 12+ restaurants in Atlanta" + mini avatars
- Right side:
  - Animated phone mockup showing a live conversation transcript
  - Messages animate in one by one (customer → AI → customer → AI)
  - Floating glassmorphism cards orbit the phone showing: order total, SMS confirmation, kitchen ticket
  - Subtle parallax on mouse movement
- Background: Animated gradient mesh (dark purple → dark orange → dark blue, slowly shifting)
- Scroll indicator: Animated chevron at bottom

**Section 3: Logo Strip / Social Proof**
- Dark section with subtle border-top
- Text: "Powering voice ordering for restaurants across Atlanta"
- Logo row: Restaurant partner logos (or placeholder logos) in muted grayscale, slight glow on hover
- Infinite horizontal scroll (marquee animation)

**Section 4: How It Works (3-Step Process)**
- Section title: "How It Works" with gradient text accent
- Three steps in a horizontal layout (stacks on mobile):
  1. **Customer Calls** — Phone icon with ring animation. "Your customer calls your existing phone number. No new number needed."
  2. **AI Takes the Order** — Waveform/voice visualization. "Our AI converses naturally, captures every detail, and confirms the order."
  3. **Kitchen Gets It Instantly** — Kitchen display mockup. "The order appears on your kitchen display in real-time. Customer gets a text confirmation."
- Each step animates in on scroll (fade up + slide, staggered)
- Connecting line/arrow between steps with animated dash pattern

**Section 5: Features (Bento Grid)**
- Asymmetric bento grid layout (not equal-size cards)
- Large card (2x2): "AI That Actually Understands" — Shows a conversation transcript with highlighted intent detection. Animated typing effect.
- Medium card (2x1): "Real-Time Kitchen Display" — Screenshot/mockup of the KDS with live-updating order cards
- Medium card (1x2): "Self-Improving Intelligence" — Animated chart showing call quality scores trending upward over time
- Small card (1x1): "SMS Confirmations" — Phone mockup showing text message
- Small card (1x1): "24/7 Availability" — Clock animation with "Never closed" text
- Medium card (2x1): "60-Second Onboarding" — Animated progress bar showing menu setup flow
- All cards: Glass background, subtle border, hover: scale(1.02) + shadow lift with spring physics

**Section 6: Live Demo**
- Dark gradient background with noise texture overlay
- Centered layout:
  - Headline: "Try It Right Now"
  - Subheadline: "Call our demo line and experience AI ordering firsthand"
  - Giant phone number: `+1 (770) 525-5393` — glowing text with click-to-call
  - Animated soundwave visualization below the number
  - "Or watch a 60-second demo" → embedded video player with custom controls

**Section 7: Pricing**
- Three-tier card layout (Starter, Pro, Enterprise)
- Pro card is elevated/highlighted (recommended badge, gradient border)
- Each card:
  - Plan name + price
  - Feature list with checkmark icons (Lucide)
  - CTA button
  - Glass background, border glow on hover
- Toggle: Monthly / Annual (annual saves 20%)
- Below cards: "All plans include a 14-day free trial. No credit card required."

**Section 8: Testimonials**
- Editorial-style large quotes (not a carousel)
- Two testimonial blocks side by side:
  - Large quote text with opening quotation mark as oversized decorative element
  - Restaurant owner photo (circular), name, restaurant name, location
  - Star rating
- Floating review cards in background with subtle parallax

**Section 9: FAQ**
- Accordion-style with smooth open/close animations (Framer Motion `AnimatePresence`)
- Common questions:
  - "How does the AI handle complex orders?"
  - "What if the AI can't understand a customer?"
  - "How long does setup take?"
  - "Can I customize the AI's voice and personality?"
  - "What happens if I exceed my plan's order limit?"
  - "Do customers know they're talking to an AI?"

**Section 10: Final CTA**
- Full-width gradient background (orange → purple, subtle)
- Large headline: "Ready to Stop Missing Orders?"
- Subheadline: "Set up in 60 seconds. First 14 days free."
- CTA button: "Get Started Now" — large, glowing, animated
- Small text: "No credit card required. Cancel anytime."

**Section 11: Footer**
- 4-column layout:
  - Column 1: Logo + tagline + social links (Twitter, LinkedIn, GitHub)
  - Column 2: Product (Features, Pricing, Demo, Kitchen Display)
  - Column 3: Company (About, Blog, Careers, Contact)
  - Column 4: Legal (Privacy, Terms, Cookie Policy)
- Bottom bar: "© 2026 OrderFlow AI. Built in Atlanta."

### Animations Specification

| Element | Animation Type | Timing |
|---------|---------------|--------|
| Hero headline | Word-by-word fade + y-translate | 0.6s stagger 0.08s per word |
| Hero badge | Fade in + scale from 0.9 | 0.4s, delay 0.2s |
| Hero phone mockup | Slide in from right + slight rotate | 0.8s spring |
| Chat messages in mockup | Fade in + slide up, staggered | 0.3s each, 1.5s delay between |
| Floating cards | Continuous orbital float | 6s infinite, CSS keyframes |
| Nav on scroll | Slide down from -100% | 0.3s ease-out |
| How-it-works steps | Fade up on scroll-trigger | 0.5s each, staggered 0.15s |
| Bento cards | Scale from 0.95 + fade on scroll | 0.4s spring |
| Pricing cards | Slide up + fade on scroll | 0.5s, staggered 0.1s |
| FAQ accordion | Height animate + rotate chevron | 0.3s ease |
| CTA buttons | Scale 1.02 + y-1 on hover | Spring stiffness 400, damping 17 |
| Background gradient mesh | Continuous color shift | 8s infinite |

### Responsive Breakpoints

| Breakpoint | Layout Changes |
|-----------|----------------|
| Desktop (1440px+) | Full bento grid, side-by-side hero, 3-column pricing |
| Laptop (1024px) | Slightly compressed spacing, same layout |
| Tablet (768px) | Hero stacks vertically, bento goes 2-column, pricing stacks |
| Mobile (375px) | Single column everything, reduced animation, hamburger nav, full-width cards |

---

## 9. Admin Dashboard Design Specification

### Layout: Sidebar + Main Content

**Sidebar (fixed, left):**
- Logo at top
- Nav items with icons (Lucide): Dashboard, Orders, Menu Editor, Calls & Analytics, Settings, Billing
- Active state: gradient background pill + white text
- Collapsed mode on mobile (icon-only, expandable)
- User avatar + restaurant name at bottom

**Main Content Area:**
- Top bar: Page title, search, notifications bell, user dropdown
- Content renders below based on active nav item

### Dashboard Home

**Stat Cards Row (4 cards):**
- Today's Orders (count + % change from yesterday)
- Today's Revenue ($ + % change)
- Avg Order Value ($ + trend arrow)
- Call Conversion Rate (% + trend)
- Each card: glass background, colored accent icon, sparkline mini-chart

**Orders Chart:**
- 7-day bar chart (Recharts) showing daily order volume
- Hover shows exact numbers
- Toggle: Orders / Revenue / Avg Value

**Recent Orders Table:**
- Columns: Order #, Customer, Items (truncated), Total, Status (badge), Time
- Click to expand order details
- Real-time updates (WebSocket or polling)

**AI Performance Widget:**
- Overall call quality score (circular progress)
- Top 3 improvement suggestions from Reflexion
- "View Details" link to full analytics

### Menu Editor

**Interface:**
- Left panel: Category list (drag to reorder)
- Right panel: Items in selected category (card grid)
- Each item card shows: name, price, description, available toggle
- Click card to edit in modal: name, description, price, sizes, addons, aliases, image
- "Add Item" button with inline form
- "Add Category" button
- Drag-and-drop reordering within categories
- Save button (persists to Supabase `menu_items` table)

### Calls & Analytics Page

**Call Log Table:**
- Columns: Date/Time, Caller, Duration, Status (completed/failed/transferred), Conversion (ordered/browsed/abandoned), Score
- Expandable row shows: full transcript, order details (if any), recording player
- Filters: date range, status, minimum score

**Analytics Charts:**
- Calls per day (line chart)
- Peak hours heatmap (7x24 grid, colored by call volume)
- Conversion funnel: Calls → Orders → Completed
- Average call quality score over time (with Reflexion data)

---

## 10. Design System

### Token Reference

```css
/* Colors */
--color-bg-primary: #0A0A0F;
--color-bg-surface: #12121A;
--color-bg-elevated: #1A1A2E;
--color-border: rgba(255, 255, 255, 0.06);
--color-border-hover: rgba(255, 255, 255, 0.12);
--color-accent-primary: #FF4D00;
--color-accent-gradient: linear-gradient(135deg, #FF4D00, #FF6B2C);
--color-accent-purple: #7C3AED;
--color-text-primary: #F5F5F7;
--color-text-secondary: #8B8B9E;
--color-text-muted: #555566;
--color-success: #22C55E;
--color-warning: #F59E0B;
--color-error: #EF4444;

/* Typography Scale */
--text-display: 96px / 1.0 / -0.02em;
--text-h1: 64px / 1.05 / -0.02em;
--text-h2: 48px / 1.1 / -0.01em;
--text-h3: 36px / 1.2 / -0.01em;
--text-h4: 24px / 1.3 / 0;
--text-body-lg: 20px / 1.6 / 0;
--text-body: 16px / 1.6 / 0;
--text-small: 14px / 1.5 / 0;
--text-xs: 12px / 1.4 / 0.02em;

/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-32: 128px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
--shadow-glow-orange: 0 0 40px rgba(255, 77, 0, 0.15);
--shadow-glow-purple: 0 0 40px rgba(124, 58, 237, 0.15);

/* Glass Effect */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-blur: blur(20px);

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

/* Transitions */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### Component Library (Shared across Landing + Dashboard)

1. **Button** — Primary (gradient + glow), Secondary (glass), Ghost (text-only), Danger (red)
2. **Card** — Glass background, subtle border, hover lift, multiple sizes
3. **Badge** — Status badges (received/preparing/ready/completed), plan badges
4. **Input** — Glass background, focus ring with accent color, error state
5. **Modal** — Backdrop blur, slide-in animation, close on escape
6. **Toast** — Bottom-right stack, auto-dismiss, success/error/info variants
7. **Tooltip** — Hover-triggered, positioned smartly, subtle fade-in
8. **Table** — Striped rows, hover highlight, sortable headers
9. **Chart** — Recharts with custom theme matching dark palette
10. **Skeleton** — Shimmer loading states for every data component

---

## 11. Database Schema Updates

### New Tables

```sql
-- Restaurant owner accounts (linked to Supabase Auth)
ALTER TABLE public.restaurants ADD COLUMN owner_id UUID REFERENCES auth.users(id);
ALTER TABLE public.restaurants ADD COLUMN kitchen_pin TEXT DEFAULT '1234';
ALTER TABLE public.restaurants ADD COLUMN ai_config JSONB DEFAULT '{
  "voice": "Polly.Joanna",
  "personality": "friendly",
  "upsell_enabled": true,
  "greeting_message": null,
  "closed_message": null,
  "max_retries": 3,
  "transfer_number": null
}';

-- Promo codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'percent',  -- percent, fixed
  value DECIMAL(10,2) NOT NULL,
  min_order DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_promo_code ON public.promo_codes (restaurant_id, code);

-- Customer recognition (for returning callers)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  phone_hash TEXT NOT NULL,  -- SHA256 of phone number
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  favorite_items JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_customer_phone ON public.customers (restaurant_id, phone_hash);

-- Delivery zones
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  radius_miles DECIMAL(5,2) DEFAULT 5.0,
  center_lat DECIMAL(10,7),
  center_lng DECIMAL(10,7),
  min_order_delivery DECIMAL(10,2) DEFAULT 15.00,
  delivery_fee DECIMAL(10,2) DEFAULT 3.99,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Updated RLS Policies

```sql
-- Drop overly permissive policies
DROP POLICY IF EXISTS "orders_access" ON public.orders;
DROP POLICY IF EXISTS "call_logs_access" ON public.call_logs;
DROP POLICY IF EXISTS "menu_items_access" ON public.menu_items;

-- Owner can manage their restaurant's data
CREATE POLICY "owner_orders" ON public.orders
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())
    OR auth.role() = 'service_role'
  );

CREATE POLICY "owner_call_logs" ON public.call_logs
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())
    OR auth.role() = 'service_role'
  );

CREATE POLICY "owner_menu_items" ON public.menu_items
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())
    OR auth.role() = 'service_role'
  );

-- Public can read menu items (for the ordering flow)
CREATE POLICY "public_menu_read" ON public.menu_items
  FOR SELECT USING (
    available = true
    AND restaurant_id IN (SELECT id FROM public.restaurants WHERE active = true)
  );
```

---

## 12. API Specification

### New / Updated Endpoints

**Authentication:**
```
POST   /api/auth/signup        → Create account (email, password, restaurant_name)
POST   /api/auth/login         → Login (email, password) → returns JWT
POST   /api/auth/logout        → Invalidate session
POST   /api/auth/reset-password → Send password reset email
GET    /api/auth/me             → Get current user + restaurant info
```

**Restaurant Management:**
```
GET    /api/restaurant             → Get own restaurant config
PATCH  /api/restaurant             → Update restaurant settings
PATCH  /api/restaurant/hours       → Update business hours
PATCH  /api/restaurant/ai-config   → Update AI personality/voice settings
```

**Menu Management:**
```
GET    /api/menu                    → Get full menu (public, for ordering)
GET    /api/menu/admin              → Get menu with admin metadata (auth required)
POST   /api/menu/items              → Add menu item
PATCH  /api/menu/items/:id          → Update menu item
DELETE /api/menu/items/:id          → Remove menu item
PATCH  /api/menu/categories/reorder → Reorder categories
```

**Orders:**
```
GET    /api/orders                  → List orders (filtered by status, date range)
GET    /api/orders/:id              → Get order details
PATCH  /api/orders/:id/status       → Update order status
POST   /api/orders/:id/refund       → Initiate refund (future)
GET    /api/orders/stats             → Order statistics (period, comparison)
```

**Voice Webhooks (Twilio — service_role auth only):**
```
POST   /api/voice/incoming          → Handle incoming call
POST   /api/voice/process           → Process speech input (calls LLM)
POST   /api/voice/confirm           → Finalize order
POST   /api/voice/transfer          → Transfer to human
POST   /api/voice/status            → Call status callback (recording URL, duration)
```

**Analytics:**
```
GET    /api/analytics/overview       → Dashboard stats (today, yesterday, this week)
GET    /api/analytics/calls          → Call analytics (volume, duration, conversion)
GET    /api/analytics/revenue        → Revenue analytics (daily, weekly, monthly)
GET    /api/analytics/peak-hours     → Peak ordering hours heatmap data
GET    /api/analytics/popular-items  → Most ordered items
GET    /api/analytics/reflexion      → AI improvement data (scores, patterns, suggestions)
```

**Billing:**
```
POST   /api/billing/checkout         → Create Stripe checkout session
POST   /api/billing/portal           → Create Stripe customer portal session
GET    /api/billing/subscription     → Get current subscription details
POST   /api/billing/webhook          → Stripe webhook handler
```

**Promo Codes:**
```
GET    /api/promos                   → List promo codes (admin)
POST   /api/promos                   → Create promo code
PATCH  /api/promos/:id               → Update promo code
DELETE /api/promos/:id               → Delete promo code
POST   /api/promos/validate          → Validate a promo code (used in voice flow)
```

---

## 13. LLM Integration Architecture ✅ IMPLEMENTED

### Provider Abstraction Layer (Actual Implementation)

```python
# src/llm/providers.py — 4 providers, all free tier, all REST via httpx

class LLMProvider(ABC):
    @abstractmethod
    async def chat(self, messages: list[dict]) -> LLMResponse:
        pass

class GroqProvider(LLMProvider):
    """Primary: Llama 3.3 70B via Groq (free, ~200ms, 30 RPM)"""
    model = "llama-3.3-70b-versatile"

class OpenRouterProvider(LLMProvider):
    """Secondary: Llama 3.3 70B via OpenRouter (free tier)"""
    model = "meta-llama/llama-3.3-70b-instruct:free"

class GeminiProvider(LLMProvider):
    """Tertiary: Gemini 2.0 Flash (free tier, converts OpenAI→Gemini format)"""
    model = "gemini-2.0-flash"

class KeywordFallbackProvider(LLMProvider):
    """Emergency: No API needed, keyword matching for basic responses"""
    pass

# src/llm/router.py — Automatic failover with exponential backoff
class LLMRouter:
    """Routes to available provider with automatic failover + cooldown"""
    providers = [GroqProvider(), OpenRouterProvider(), GeminiProvider(), KeywordFallbackProvider()]

    async def process(self, messages):
        for provider in self.providers:
            if not provider.is_available() or self._in_cooldown(provider.name):
                continue
            try:
                result = await provider.chat(messages)
                self._reset_failure(provider.name)
                return result
            except Exception as e:
                self._record_failure(provider.name)
                continue
        return await KeywordFallbackProvider().chat(messages)
```

**Monthly LLM Cost: $0** (all providers on free tiers)

**Upgrade Path (when revenue justifies it):**
- Tier 1: Add `GROQ_API_KEY` paid plan ($0.05/1M tokens) for higher rate limits
- Tier 2: Add Claude 3.5 Haiku ($0.25/1M input) for superior reasoning
- Tier 3: Add GPT-4o-mini for maximum redundancy

### Voice Flow State Machine

```
GREETING → TAKING_ORDER → CLARIFYING → CONFIRMING → FINALIZING → COMPLETE
    │           │              │            │             │
    │           │              │            ▼             │
    │           │              │       MODIFYING ─────────┘
    │           │              │            │
    │           ▼              ▼            │
    └─── TRANSFER_TO_HUMAN ◀──┘◀───────────┘
              (after 3 failed attempts)
```

Each state transition is logged and the state is persisted in Redis.

---

## 14. Testing Strategy ✅ PARTIALLY IMPLEMENTED

### Test Structure (Actual — Built)

```
tests/
├── conftest.py                          # ✅ Fixtures: restaurant_config, menu_config, mock_llm_response, memory_session
├── unit/
│   ├── test_order_extractor.py          # ✅ 15 tests — spoken extraction, order actions, item validation, totals, speech formatting
│   ├── test_voice_processor.py          # ✅ 13 tests — init, serialization, items, actions, failures, finalization, LLM integration
│   ├── test_llm_providers.py            # ✅ 12 tests — availability, keyword fallback, router failover, JSON extraction
│   └── test_session_manager.py          # ✅  7 tests — CRUD, overwrite, complex data, concurrency
├── integration/
│   └── test_voice_flow.py              # ✅  8 tests — full HTTP cycle with mocked LLM via FastAPI TestClient
└── (planned but not yet built)
    ├── unit/test_call_evaluator.py      # ❌ Reflexion scoring accuracy
    ├── unit/test_promo_codes.py         # ❌ Validation, discount calculation
    ├── unit/test_delivery_zones.py      # ❌ Distance calculation, zone check
    ├── integration/test_supabase_orders.py  # ❌ CRUD operations on orders table
    ├── integration/test_stripe_billing.py   # ❌ Checkout + webhook flow
    ├── e2e/test_full_order_flow.py      # ❌ Call → Order → KDS → Complete
    ├── e2e/test_onboarding_flow.py      # ❌ Signup → Menu setup → First call
    └── fixtures/                        # ❌ Sample transcripts, orders, configs
```

**Current Test Count: 55+ tests across 4 unit test files + 1 integration test file**

### Testing Tools
- **Framework:** pytest + pytest-asyncio
- **HTTP Client:** httpx (TestClient for FastAPI)
- **Mocking:** unittest.mock + responses (for external APIs)
- **Coverage:** pytest-cov (target: 80%+)

### Key Test Cases

**Voice Processing:**
- Single item order ("I'll have a large pepperoni pizza")
- Multi-item order ("Two cokes and a cheese pizza")
- Modification mid-order ("Actually make that a medium")
- Ambiguous item (matches multiple menu items)
- Item not on menu (graceful handling)
- Size clarification flow
- Complete order confirmation and total calculation

**LLM Integration:**
- Claude returns structured order JSON
- Claude asks clarification question
- Claude suggests upsell
- Claude provider fails → OpenAI fallback
- All providers fail → keyword fallback
- Latency timeout handling (< 3s total)

**Session Persistence:**
- Create session → retrieve from Redis → same data
- Session expires after TTL
- Concurrent calls don't interfere with each other
- Session survives simulated serverless cold start

---

## 15. Two-Week Sprint Plan

### Sprint Overview (Revised)

| Week | Focus | Goal | Status |
|------|-------|------|--------|
| Day 1 (Tue Mar 24) | Core Backend | LLM integration, session mgmt, voice processor, webhooks, tests | ✅ COMPLETE |
| Days 2-4 (Wed-Fri) | Frontend | Landing page, clean up old routes, basic admin structure | IN PROGRESS |
| Days 5-7 (Sat-Mon) | Auth + Dashboard | Supabase Auth, admin dashboard, menu editor | UPCOMING |
| Days 8-10 (Tue-Thu) | Product | Onboarding, billing, analytics, KDS upgrade | UPCOMING |
| Days 11-12 (Fri-Sat) | Testing + Polish | E2E tests, bug fixes, performance audit | UPCOMING |
| Days 13-14 (Sun-Mon) | Deploy + Launch | Production deploy, first restaurant onboarding | UPCOMING |

---

### DAY 1 (Tue Mar 24) — Core Backend ✅ COMPLETE

Everything in this day was completed ahead of schedule:

| Task | Status | Deliverable |
|------|--------|-------------|
| LLM Provider abstraction (4 free providers) | ✅ | `src/llm/providers.py` (13KB) |
| LLM Router with failover + cooldown | ✅ | `src/llm/router.py` (5.6KB) |
| System prompt builder | ✅ | `src/llm/prompts.py` (9.8KB) |
| Order extractor with fuzzy matching | ✅ | `src/llm/order_extractor.py` (11KB) |
| Voice processor rewrite (state machine) | ✅ | `src/voice_processor.py` (16KB) |
| Redis session manager | ✅ | `src/session.py` (8.1KB) |
| Voice webhooks (5 endpoints) | ✅ | `api/voice.py` (19KB) |
| Test suite (55+ tests) | ✅ | `tests/` (4 unit + 1 integration file) |
| Config updates | ✅ | requirements.txt, .env.example, pytest.ini |

### DAYS 2-4: Frontend (Landing Page + Cleanup)

**Day 2 (Wed Mar 25) — Landing Page Build**

| Task | Hours | Details |
|------|-------|---------|
| Build Awwwards-tier landing page (.jsx) | 6h | Dark tech design, Framer Motion, all 11 sections |
| Remove old voice endpoints from api/index.py | 1h | Keep only new router, remove duplicated routes |
| Update api/index.py version and imports | 1h | Clean imports, remove dead code |

**Day 3 (Thu Mar 26) — Landing Page Polish**

| Task | Hours | Details |
|------|-------|---------|
| Responsive testing (375px → 1440px) | 2h | Mobile-first verification |
| Animation timing and scroll triggers | 1.5h | Stagger tweaks, performance |
| Accessibility pass | 1.5h | Contrast, focus states, reduced motion, ARIA |
| SEO meta tags + Open Graph | 1h | Title, description, OG image |
| Deploy landing page to Vercel preview | 1h | Verify production build works |

**Day 4 (Fri Mar 27) — Admin Dashboard Shell**

| Task | Hours | Details |
|------|-------|---------|
| Build admin dashboard layout (sidebar + main) | 3h | Glass sidebar, responsive, route structure |
| Build login/signup pages | 2h | Glass forms, validation, error states |
| Build dashboard home (stat cards + placeholder data) | 3h | Stat cards, orders chart, recent orders table |

### DAYS 5-7: Auth + Dashboard Features

**Day 5 (Sat Mar 28) — Authentication**

| Task | Hours | Details |
|------|-------|---------|
| Implement Supabase Auth API endpoints | 3h | signup, login, logout, me, reset-password |
| Auth middleware for protected routes | 2h | JWT validation, redirect logic |
| Connect login/signup UI to auth endpoints | 2h | Form submission, error handling, redirects |
| Kitchen PIN auth (simplified) | 1h | 4-digit PIN for KDS access |

**Day 6 (Sun Mar 29) — Menu Editor**

| Task | Hours | Details |
|------|-------|---------|
| Menu editor API (CRUD + categories) | 2h | Full REST API for menu items |
| Menu editor UI | 4h | Category sidebar, item cards, edit modal, drag reorder |
| Restaurant settings page | 2h | Hours, AI config, greeting customization |

**Day 7 (Mon Mar 30) — Analytics + Call History**

| Task | Hours | Details |
|------|-------|---------|
| Analytics API endpoints | 2h | Overview, calls, revenue, peak hours |
| Analytics dashboard page (Recharts) | 3h | Charts, stat cards, date range picker |
| Call history page | 3h | Table, expandable rows, transcript view |

### DAYS 8-10: Product Features

**Day 8 (Tue Mar 31) — Onboarding + Billing**

| Task | Hours | Details |
|------|-------|---------|
| Onboarding wizard (3-step) | 3h | Restaurant info → Menu setup → Plan selection |
| AI menu import (paste text → structured data) | 2h | LLM parses pasted menu text |
| Stripe checkout + portal integration | 2h | Plan selection → checkout → redirect |
| Billing page UI | 1h | Current plan, usage, upgrade/downgrade |

**Day 9 (Wed Apr 1) — Kitchen Display Upgrade**

| Task | Hours | Details |
|------|-------|---------|
| WebSocket real-time order updates | 3h | Instant order appearance on KDS |
| Audio chime for new orders | 1h | Configurable alert sound |
| Order timers + color-coded aging | 2h | Green→yellow→red countdown |
| Mobile-friendly KDS | 2h | Tablet-optimized touch targets |

**Day 10 (Thu Apr 2) — Additional Features**

| Task | Hours | Details |
|------|-------|---------|
| Returning customer recognition | 2h | Phone lookup → history in LLM context |
| SMS auto-notification on order ready | 1h | KDS "Ready" status triggers SMS |
| Promo code support (basic) | 2h | Voice flow + admin management |
| Error monitoring (Sentry setup) | 1h | FastAPI integration |

### DAYS 11-14: Testing, Polish, Launch

**Day 11 (Fri Apr 3) — Testing**

| Task | Hours | Details |
|------|-------|---------|
| E2E test: full order flow | 2h | Call → Order → KDS → SMS |
| E2E test: onboarding flow | 1h | Signup → Menu → Plan → First call |
| Cross-browser testing | 1h | Chrome, Safari, Firefox, mobile |
| Performance audit (Lighthouse) | 1h | LLM latency, page speed |
| Bug fixes from testing | 3h | Buffer for issues found |

**Day 12 (Sat Apr 4) — CI/CD + Production Prep**

| Task | Hours | Details |
|------|-------|---------|
| GitHub Actions pipeline | 2h | Test on push, deploy on main |
| Production environment setup | 2h | Vercel prod, Supabase prod, Redis prod |
| Custom domain + SSL | 1h | orderflow-ai.com |
| Production env vars + secrets | 1h | All API keys, webhook URLs |
| Twilio production number | 1h | Purchase + configure webhooks |

**Day 13 (Sun Apr 5) — Pre-Launch**

| Task | Hours | Details |
|------|-------|---------|
| Load test voice flow (10 concurrent) | 2h | Stress test LLM + Redis |
| Security audit | 2h | Auth bypass checks, API key exposure, RLS verification |
| Prepare onboarding materials | 2h | PDF guide for restaurant owners |
| Final smoke test | 2h | End-to-end call + order + KDS + SMS |

**Day 14 (Mon Apr 7) — LAUNCH DAY**

| Task | Hours | Details |
|------|-------|---------|
| Deploy to production | 1h | Final deploy + verify |
| Onboard first restaurant | 2h | In-person: enter menu, configure, test calls |
| Monitor first live calls | 2h | Watch Reflexion, check transcripts |
| Document lessons learned | 1h | What worked, what to improve |

---

### WEEK 2: Product & Polish

**Day 8 (Tue Apr 1) — Authentication & Admin Dashboard (Structure)**

| Task | Hours | Details |
|------|-------|---------|
| Implement auth API endpoints | 2h | Signup, login, logout, me |
| Build login/signup pages | 2h | Glass design, form validation, error states |
| Build admin dashboard layout | 2h | Sidebar, top bar, route structure |
| Build dashboard home page | 2h | Stat cards, orders chart, recent orders table |

**Day 9 (Wed Apr 2) — Menu Editor & Settings**

| Task | Hours | Details |
|------|-------|---------|
| Build menu editor API | 2h | CRUD for menu items, category management |
| Build menu editor UI | 3h | Category sidebar, item cards, edit modal, drag reorder |
| Build restaurant settings page | 2h | Hours, AI config, greeting customization |
| Build kitchen PIN management | 1h | Set/change PIN in settings |

**Day 10 (Thu Apr 3) — Analytics & Call History**

| Task | Hours | Details |
|------|-------|---------|
| Build analytics API endpoints | 2h | Overview, calls, revenue, peak hours, popular items |
| Build analytics dashboard page | 3h | Charts (Recharts), stat cards, date range picker |
| Build call history page | 2h | Table with expandable rows, transcript view, recording player |
| Integrate Reflexion data into dashboard | 1h | AI improvement widget, suggestions list |

**Day 11 (Fri Apr 4) — Onboarding & Billing**

| Task | Hours | Details |
|------|-------|---------|
| Build onboarding wizard (3-step) | 3h | Restaurant info → Menu setup → Plan selection |
| Menu import helper | 1h | Paste menu text → AI parses into structured data |
| Stripe checkout integration | 1.5h | Plan selection → checkout → redirect |
| Build billing page | 1.5h | Current plan, usage bar, upgrade/downgrade, invoices |
| Stripe webhook handling | 1h | Subscription created/updated/cancelled events |

**Day 12 (Sat Apr 5) — Integration Testing & Bug Fixes**

| Task | Hours | Details |
|------|-------|---------|
| E2E test: full order flow | 2h | Call → Order parsed → KDS → Status update → SMS |
| E2E test: onboarding flow | 1h | Signup → Menu → Plan → First call |
| Cross-browser testing | 1h | Chrome, Safari, Firefox, mobile Safari |
| Fix bugs from testing | 3h | Buffer time for issues found |
| Performance audit | 1h | Lighthouse score, LLM latency check, Redis performance |

**Day 13 (Sun Apr 6) — Production Prep**

| Task | Hours | Details |
|------|-------|---------|
| Set up production environment | 1h | Vercel prod, Supabase prod, Redis prod |
| Configure production env vars | 1h | All API keys, webhook URLs, domains |
| Set up custom domain | 0.5h | orderflow-ai.com (or similar) |
| Set up error monitoring (Sentry) | 1h | FastAPI + Next.js integration |
| Set up Twilio production number | 1h | Purchase number, configure webhooks |
| Load test voice flow | 1.5h | Simulate 10 concurrent calls |
| Write deployment runbook | 1h | Step-by-step for future deploys |
| Prepare restaurant onboarding packet | 1h | PDF or doc for the first restaurant partner |

**Day 14 (Mon Apr 7) — Launch Day**

| Task | Hours | Details |
|------|-------|---------|
| Final smoke test on production | 1h | Call the number, place an order, verify SMS + KDS |
| Deploy to production | 1h | Final deploy, verify all services |
| Onboard first restaurant | 2h | In-person setup at restaurant, enter their menu, configure |
| Monitor first live calls | 2h | Watch Reflexion scores, check transcripts, fix any issues |
| Celebrate | 1h | You earned it |
| Document lessons learned | 1h | What worked, what didn't, what to improve |

---

## 16. Deployment & DevOps

### Environment Setup

| Service | Provider | Purpose | Est. Cost |
|---------|----------|---------|-----------|
| Frontend + API | Vercel (Hobby→Pro) | Hosting, serverless functions, edge network | $0-20/mo |
| Database + Auth | Supabase (Free→Pro) | PostgreSQL, Auth, Row-Level Security | $0-25/mo |
| Session State | Upstash Redis (Free tier) | Conversation state, caching | $0 (10K commands/day free) |
| Voice + SMS | Twilio | Phone calls, speech recognition, SMS | ~$50/mo (usage) |
| LLM API | Groq + OpenRouter + Gemini | Order parsing, conversation (all free tiers) | **$0/mo** |
| Error Monitoring | Sentry (Free) | Error tracking, alerting | $0 |
| Domain | Namecheap/Cloudflare | orderflow-ai.com | $12/yr |
| **Total (Launch)** | | | **~$50-55/mo** |
| **Total (Scaled)** | | With paid tiers as traffic grows | **~$115/mo** |

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: pytest tests/ -v --cov=src --cov-report=xml
      - uses: codecov/codecov-action@v3

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Monitoring & Alerting

1. **Sentry:** Captures all Python exceptions + JS errors. Alert on new issues.
2. **Vercel Analytics:** Page load times, function durations, error rates.
3. **Upstash Dashboard:** Redis operation counts, latency.
4. **Custom Health Check:** `/api/health` endpoint called every 5 min by UptimeRobot.
5. **Twilio Dashboard:** Call success/failure rates, SMS delivery rates.

---

## 17. Success Metrics & KPIs

### Launch KPIs (First 30 Days)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Call-to-Order Conversion | > 70% | `orders / total_calls` from `call_conversion` view |
| Order Accuracy | > 95% | Manual review of 50 calls + Reflexion accuracy scores |
| Average Call Duration | < 3 minutes | Twilio call duration data |
| Customer Satisfaction | > 4.0/5.0 | Post-order SMS survey (optional) |
| SMS Delivery Rate | > 98% | Twilio delivery reports |
| System Uptime | > 99.5% | UptimeRobot monitoring |
| Landing Page Conversion | > 5% | Visitors → Signup clicks (Vercel Analytics) |
| Onboarding Completion | > 80% | Signup started → First order received |
| Reflexion Score Trend | Improving weekly | Average `overall_score` week-over-week |

### Revenue KPIs (First 90 Days)

| Metric | Target |
|--------|--------|
| Paying restaurants | 3 (by day 30), 10 (by day 90) |
| Monthly Recurring Revenue | $1.2K (day 30), $4K (day 90) |
| Churn rate | < 10%/month |
| Average Revenue Per Restaurant | $350/month |
| Customer Acquisition Cost | < $200 (in-person sales in Atlanta area) |

---

## 18. Risk Assessment & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| LLM API outage during live calls | Medium | High | 4-tier provider failover (Groq → OpenRouter → Gemini → Keywords) ✅ IMPLEMENTED |
| Twilio speech recognition returns garbage | Medium | Medium | Retry with "I didn't catch that", transfer after 3 failures |
| Redis cold start latency | Low | Medium | Upstash REST API has no cold start; connection pooling |
| Restaurant owner can't set up menu | Medium | Medium | AI-powered menu import ("paste your menu, we'll structure it") |
| Customer frustrated by AI | Medium | High | Warm personality, quick human transfer, satisfaction monitoring |
| Vercel function timeout (10s limit) | Low | High | Stream LLM response, keep prompts concise, cache menu context |
| Data breach / unauthorized access | Low | Critical | Supabase RLS, JWT auth, encrypted secrets, no PII in logs |
| First restaurant has negative experience | Medium | High | On-site support during first week, real-time Reflexion monitoring |
| Cost overrun on LLM API | Very Low | Low | All providers on free tiers at launch; usage limits per restaurant/plan |
| Free-tier rate limiting (Groq 30 RPM) | Medium | Medium | 4-provider failover spreads load; upgrade to paid tier at ~$5/mo when needed |

---

## 19. Post-Launch Roadmap

### Month 2: Growth Features

- **Multi-language support** — Spanish first (large market in Atlanta), then Mandarin
- **POS integration** — Square API (most common among target restaurants)
- **Web ordering** — Same menu, same system, but through a branded web page per restaurant
- **SMS marketing opt-in** — "Want to get texts about specials?" → build customer contact list
- **Referral program** — "Refer a restaurant, both get 1 month free"

### Month 3: Intelligence & Scale

- **Predictive prep times** — ML model based on order complexity + historical kitchen speed
- **Demand forecasting** — Predict rush times, suggest prep quantities
- **Smart routing** — For multi-location restaurants, route calls to nearest location
- **Custom voice cloning** — Restaurant owner records a greeting, AI uses their voice tone
- **API marketplace** — Webhook integrations for third-party tools

### Month 4-6: Enterprise & Expansion

- **White-label option** — Restaurants can brand the entire experience
- **Multi-location dashboard** — Aggregate analytics across all locations
- **Franchise model** — Per-city franchise partners who onboard local restaurants
- **Mobile app for owners** — Push notifications for new orders, daily reports
- **Payment processing** — Take payment over the phone (credit card via voice)

---

## Appendix A: First Restaurant Onboarding Checklist

For deploying at a restaurant in Buford/Greater Atlanta:

- [ ] Restaurant selected and agreement signed (verbal or written)
- [ ] Full menu collected (printed menu or PDF)
- [ ] Menu entered into system and verified by owner
- [ ] Business hours configured
- [ ] Twilio number purchased and configured
- [ ] Test calls completed (at least 5 different order scenarios)
- [ ] Kitchen display set up on restaurant tablet/screen
- [ ] Kitchen staff trained on KDS (tap to update status)
- [ ] Owner shown admin dashboard
- [ ] Stripe subscription activated
- [ ] Existing phone number set up to forward to OrderFlow (or new number posted)
- [ ] Monitoring dashboard open for first 48 hours
- [ ] Follow-up visit scheduled for day 3 and day 7

## Appendix B: Competitive Landscape

| Competitor | Approach | Weakness vs OrderFlow |
|-----------|----------|----------------------|
| SoundHound (HOUND) | Enterprise voice AI for restaurants | $$$, enterprise-only, long contracts |
| ConverseNow | AI phone ordering | Minimum 5+ locations, not for single-location restaurants |
| Presto Voice | Drive-through AI | Hardware-dependent, not for phone orders |
| Popmenu | Online ordering + AI phone | AI phone is add-on, not core. $400+/mo |
| Generic IVR (RingCentral, etc.) | "Press 1 for pickup..." | Not conversational. Customers hate IVR menus |

**OrderFlow's Edge:** Purpose-built for single-location and small-chain restaurants (1-5 locations). No hardware. 60-second setup. Self-improving AI. $299/month vs $1000+ for enterprise alternatives.

---

---

## 20. New Enhancement Suggestions

Based on what was built and industry trends, here are additional enhancements not in the original plan:

### 20.1 Production-Critical Fixes (MUST DO before first live restaurant)

> These are not features — they are safety and reliability gaps that will cause real problems on day one if not addressed.

**Twilio Webhook Signature Validation** — Currently anyone can POST to `/api/voice/incoming` and trigger LLM calls, burning through free-tier rate limits and potentially injecting fake orders. Twilio signs every webhook request with an `X-Twilio-Signature` header. Validating it is ~15 lines of code using `twilio.request_validator.RequestValidator`. Without this, the system is wide open. Priority: P0. Effort: 1 hour.

**STT Confidence Threshold Check** — Twilio's speech-to-text returns a `Confidence` score (0.0–1.0) alongside the recognized text. The current `/process` endpoint accepts any text regardless of confidence. In a noisy restaurant environment (kitchen sounds, bad cell reception, accents), low-confidence transcriptions will send garbage to the LLM, which then produces nonsensical responses. Fix: If `Confidence < 0.6`, skip the LLM call entirely and re-prompt with "Sorry, it's a little noisy — could you say that again?" This single check could prevent 20-30% of failed interactions. Priority: P0. Effort: 1 hour.

**Menu Config Validator** — Restaurant JSON configs are currently hand-edited with no validation. One typo in a price field, a missing comma, or a broken alias and the entire voice flow breaks silently for that restaurant. Build a `MenuConfigValidator` class that runs on app startup and catches: missing required fields (`name`, `phone`, `menu`), price inconsistencies (e.g., large cheaper than medium), duplicate aliases across items, empty categories, unreferenced size keys, and malformed business hours. Should raise a clear error with the exact field and issue. Priority: P0. Effort: 2 hours.

**Idle Caller Handling (30s timeout)** — The current system handles silence (no speech detected) and transfer-after-3-failures, but not the common scenario where a customer puts the phone down to ask someone else what they want. If there's a gap of 15-30 seconds, the system should say "Take your time, I'm still here whenever you're ready" instead of counting it as a speech failure and moving toward transfer. This is a real-world restaurant call pattern that happens on ~15% of calls. Priority: P0. Effort: 2 hours.

### 20.2 Day-One Analytics (Before Admin Dashboard Exists)

**Lightweight Analytics API Endpoint** — The admin dashboard won't be ready for several days, but the first live calls will happen as soon as the restaurant is onboarded. Build a single `/api/analytics/summary` endpoint that returns a JSON blob you can check from your phone during deployment: total calls today, successful orders, conversion rate (orders/calls), average call duration, top 5 failure reasons (from Reflexion), LLM provider usage breakdown (which providers are serving traffic), average LLM latency, keyword fallback rate. Even without a UI, this gives real-time visibility into whether the system is working. Priority: P1. Effort: 3 hours.

**Call-Level Debug Endpoint** — Add `/api/debug/call/{call_sid}` (protected, dev-only) that returns the full conversation history, all LLM requests/responses, provider used at each turn, latency per turn, order state at each step, and final outcome. This is indispensable for diagnosing "why did this order come out wrong?" during the first week. Priority: P1. Effort: 2 hours.

### 20.3 Voice Flow Hardening (High Impact, Week 2)

**Streaming TTS Response** — Instead of waiting for the full LLM response before speaking, stream the SPOKEN portion to Twilio as it generates. This can cut perceived latency from ~2s to ~0.5s. Implementation: use Groq's streaming endpoint, extract SPOKEN text progressively, pipe to Twilio's `<Say>` with SSML. Priority: P1. Effort: 4 hours.

**Voice Selection Per Restaurant** — Let restaurant owners choose from Twilio's voice options (or ElevenLabs for premium). A pizzeria might want a warm Italian accent; a Chinese restaurant might want a different voice. Store in `ai_config.voice` in restaurant config. Priority: P2. Effort: 2 hours.

**Background Noise Handling** — Restaurants are noisy. Add pre-processing hints to Twilio's `<Gather>` for noise tolerance: `speechModel="phone_call"`, `enhanced=true`, `profanityFilter=false` (menu items shouldn't be filtered). Priority: P1. Effort: 1 hour.

**Graceful LLM Degradation UX** — The router handles provider failover well technically, but when it falls all the way to the keyword fallback the customer experience drops dramatically and the customer doesn't know why. Fix: if operating on keyword fallback, change the AI's behavior — shorter responses, skip upselling entirely, and proactively offer to transfer: "I'm having a bit of trouble with our system right now. Would you like me to connect you directly with the restaurant?" The customer should never have to discover the degraded experience through bad interactions. Priority: P1. Effort: 2 hours.

### 20.4 Returning Customer Recognition (Priority Bump: P2 → P1)

> Originally listed as P2 in the user stories (VO-10). Recommending promotion to P1 for launch week. Rationale: the first restaurant will have regulars who call 3-4 times a week. If the AI says "Welcome back! Last time you had a large pepperoni — want the same?" on the second call, that's the moment the restaurant owner becomes a true believer and tells other restaurant owners about OrderFlow. It's technically simple and has outsized business impact.

**Implementation Plan:**
1. On every completed order, hash the caller's phone number (SHA-256) and store in `customers` table with: `phone_hash`, `restaurant_id`, `last_3_orders` (JSONB), `total_orders`, `total_spent`, `favorite_items`
2. On incoming call, look up `phone_hash` in `customers` table for this restaurant
3. If found, inject into LLM system prompt: "This is a returning customer (X previous orders). Their last orders were: [items]. You may offer: 'Welcome back! Would you like your usual — [most recent order items]?'"
4. If customer says "yes" / "the usual" / "same as last time", auto-populate the order from history
5. Privacy: only store phone hash, never raw number. Hash is per-restaurant so cross-restaurant tracking is impossible

Priority: P1. Effort: 3-4 hours.

### 20.5 Smart Order Validation (High Impact, Week 2)

**Impossible Combination Detection** — If a customer orders "a large Coke with extra cheese", the LLM should recognize that modifications don't apply to drinks. Add a `valid_modifications` field per menu category in the config. This prevents the LLM from blindly accepting nonsensical modifications that would confuse the kitchen. Priority: P1. Effort: 2 hours.

**Out-of-Stock Items** — Add an `available` boolean per menu item that kitchen staff can toggle from the KDS. When a customer orders an unavailable item, the AI says: "I'm sorry, we're out of the Buffalo wings tonight. Can I suggest the chicken tenders instead?" The suggestion should come from the same category. Priority: P1. Effort: 3 hours.

**Order Size Sanity Check** — Flag unusual orders (e.g., 50 pizzas, 20 drinks) for human confirmation before processing. Configurable threshold per restaurant (default: any single item with quantity > 10 triggers a confirmation: "Just to confirm, you'd like *fifty* pepperoni pizzas?"). Also flag if order total exceeds a restaurant-configurable maximum (default: $500). Priority: P2. Effort: 1 hour.

### 20.6 Shadow Mode for First Deployment

> This is a business-critical deployment strategy, not a feature. Implement before the first live restaurant.

**How it works:** For the first 3-5 days at a real restaurant, run OrderFlow in "shadow mode" — the AI answers the phone, takes the order, and processes it through the full pipeline, but:
- The SMS confirmation to the customer says: "Thanks! Your order has been received. A staff member will confirm shortly."
- The order appears on the KDS with a **"SHADOW — VERIFY"** badge
- The restaurant staff also takes the same order via their normal process (writing it down, POS, etc.)
- Staff compares the AI's order to what the customer actually wanted and marks it as "correct" or "incorrect" on the KDS
- All shadow mode data feeds into Reflexion for accuracy measurement

**Why this matters:** It gives you real accuracy data with real customers, real accents, real background noise, and real menu edge cases — without risking a bad customer experience. It also gives the restaurant owner confidence before going fully autonomous. After 3-5 days of > 95% accuracy, flip the switch to live mode.

**Implementation:** Add `shadow_mode: true` flag in restaurant config. When enabled: skip SMS order confirmation (send verification-pending message instead), add SHADOW badge to KDS orders, add a "Verify" button on KDS cards (correct/incorrect/partial), log verification data for Reflexion analysis.

Priority: P0 (deployment strategy). Effort: 3 hours.

### 20.7 Revenue Optimization (Medium Impact, Month 2)

**Dynamic Upsell A/B Testing** — The Reflexion module should track which upsell prompts convert best and automatically promote the winners. "Would you like a drink?" vs "Our fresh lemonade is really popular" — test and learn. Store prompt variants and conversion rates in a `upsell_experiments` table. Priority: P2. Effort: 4 hours.

**Abandoned Call Recovery** — If a caller hangs up mid-order (before confirmation), send an SMS within 2 minutes: "Hey! Looks like your call got disconnected. Want to finish your order? Reply YES and we'll call you back, or call us again at [number]." This could recover 10-15% of dropped calls. Detect via Twilio's status callback (`CallStatus: no-answer` or `CallStatus: busy` with an active order in session). Priority: P1. Effort: 3 hours.

**Peak Hour Pricing Hints** — During slow periods, the AI could mention: "By the way, we have a lunch special today — 10% off orders over $20." Configurable per restaurant with time-of-day rules stored in restaurant config as `promotions: [{name, discount, conditions, active_hours}]`. Priority: P2. Effort: 2 hours.

**"Lost Revenue" Calculator on Landing Page** — Interactive widget where a restaurant owner enters their average order size ($) and estimated missed calls per day. Shows them: "You're losing ~$X/month in missed orders. OrderFlow pays for itself in Y days." This converts better than any feature list because it makes the value concrete and personal. Priority: P1 (landing page). Effort: 2 hours.

### 20.8 Technical Debt & Architecture (Medium Priority)

**Consolidate Old Voice Endpoints** — `api/index.py` still has the old inline voice endpoints alongside the new router. Remove the old ones to avoid confusion, potential routing conflicts, and doubled LLM calls if both routes accidentally match. Priority: P1. Effort: 1 hour.

**Structured Logging** — Replace `print()` and basic `logging` with structured JSON logging (e.g., `structlog` or Python's built-in `logging` with JSON formatter). Every log entry must include: `call_sid`, `restaurant_id`, `provider`, `latency_ms`, `turn_count`, `state`. Critical for production debugging — when a call goes wrong at 8pm on a Friday, you need to be able to trace exactly what happened. Priority: P1. Effort: 3 hours.

**Response Caching** — Cache common LLM responses for identical inputs (e.g., "what's on the menu?" always returns the same menu description). Use Redis with a 5-minute TTL keyed on `restaurant_id + normalized_input_hash`. Could reduce LLM calls by 20-30% and improve latency for common questions. Priority: P2. Effort: 3 hours.

**Rate Limiting on Public Endpoints** — Even with Twilio signature validation, add rate limiting on all public API endpoints (10 req/s per IP for webhooks, 30 req/min for landing page APIs). Use Upstash Redis-based rate limiter or Vercel's built-in Edge rate limiting. Priority: P1. Effort: 2 hours.

**Environment-Based Config** — Currently LLM provider selection is hardcoded in `router.py`. Move to environment-based config: `LLM_PROVIDERS=groq,openrouter,gemini` so you can change provider priority without code changes. Also add `LLM_TIMEOUT_MS=5000` and `LLM_MAX_RETRIES=3` as env vars. Priority: P2. Effort: 1 hour.

### 20.9 Customer Experience Enhancements (Month 2-3)

**Order Tracking SMS Updates** — After order placement, send status updates triggered from KDS status changes: "Your order is being prepared" → "Your order is almost ready!" → "Your order is ready for pickup!" Requires a lightweight webhook from KDS to the SMS sender. Priority: P2. Effort: 3 hours.

**Voice-to-Web Handoff** — After placing a voice order, include a link in the SMS confirmation: "Track your order: orderflow.ai/track/ABC123". A simple, single-page status tracker showing: order items, current status (preparing/ready), and estimated time remaining. No login needed — the link IS the auth (short-lived, unique hash). Priority: P2. Effort: 4 hours.

**Multi-Party Ordering** — Support "hold on, let me ask" scenarios where the caller puts down the phone briefly. If Twilio returns a long silence (>15s) without the 3-failure transfer trigger, the AI says "Take your time, I'm still here whenever you're ready" and resets the failure counter. Also support "let me add to the order" where a second person takes over the call. Priority: P2. Effort: 2 hours.

**Post-Call Satisfaction Ping** — 10 minutes after order completion, send an SMS: "How was your ordering experience? Reply 1-5 (5 = great)." One-tap response, feeds into Reflexion scoring and gives the restaurant owner a customer satisfaction metric. Keep it short — don't ask for a written review (that kills response rate). Priority: P2. Effort: 2 hours.

### 20.10 Landing Page Copy & Conversion Optimization

> The landing page design is premium, but the copy needs to hit harder for the actual target audience: small restaurant owners in Buford/Greater Atlanta who are not technical and don't care about "Llama 3.3 70B."

**Outcome-Focused Feature Copy** — Replace technical details with outcome language:
- Instead of: "Powered by Llama 3.3 70B" → "Understands complex orders in one sentence — even with background noise"
- Instead of: "4-tier LLM failover" → "Never goes down. Ever."
- Instead of: "Upstash Redis session persistence" → "Remembers every detail, even if the call drops"
- Instead of: "Groq LLM" badge → "200ms response time" badge (customers care about speed, not the provider name)

**"Calculate Your Lost Revenue" Widget** — Interactive calculator in the hero or above pricing: Restaurant owner enters (1) average order value, (2) estimated missed calls per day. Widget shows: "You're losing ~$4,200/month in missed orders. OrderFlow would pay for itself in 2.1 days." This single widget could double the landing page conversion rate because it makes the pain tangible and the ROI undeniable.

**Restaurant-Specific Social Proof** — The current testimonials are good but generic. Add: "See how Sal's Pizza in Buford captured 127 extra orders in their first month" with a mini case study link. Local specificity (Buford, Suwanee, Lawrenceville) matters enormously for trust with small business owners.

**Video Demo** — Add a 60-second screen recording of an actual call being handled: customer calls, AI answers, takes order, order appears on KDS, SMS arrives. Seeing is believing for this audience. Embed in the Demo section alongside the phone number CTA.

**Simpler CTA Language** — "Start Free Trial" is fine but could be more specific: "Get Your AI Phone Number" or "Answer Every Call — Free for 14 Days". The CTA should reinforce the core value prop, not just describe the business model.

### 20.11 Competitive Differentiators (Month 3+)

**AI Menu Photography** — Use AI image generation to create appetizing menu item photos from text descriptions. Restaurant owners often don't have good food photography. Auto-generate and use on the web ordering page and SMS confirmations. Priority: P3. Effort: 4 hours.

**Voice Sentiment Analysis** — Analyze customer tone during calls (frustrated, happy, confused) and adapt the AI's approach in real-time. A frustrated customer gets faster responses, skipped upselling, and quicker transfer options. Twilio offers sentiment analysis on their Enhanced STT tier. Priority: P3. Effort: 6 hours.

**Restaurant Owner Mobile App** — Push notifications for new orders, daily revenue summaries, and the ability to toggle menu items on/off from their phone. React Native or Expo for quick cross-platform build. This is what restaurant owners actually want — they're never at a desk. Priority: P2 (Month 2). Effort: 2 weeks.

**White-Label API** — Let POS companies and restaurant aggregators embed OrderFlow as a service. Revenue model: per-call pricing ($0.25/call) or monthly licensing. This is the path to 10x scale without 10x sales effort. Priority: P3 (Month 4+). Effort: 2 weeks.

**Multi-Language Support** — Spanish is the highest priority (large Hispanic community in Greater Atlanta). Implementation: detect language from first customer utterance, switch system prompt and TTS voice to Spanish. Groq and Gemini both handle Spanish well. Priority: P2 (Month 2). Effort: 4 hours per language.

### 20.12 Deployment & Operations Enhancements

**Automated Canary Deploys** — Before pushing a new version to all restaurants, route 10% of calls through the new version for 1 hour and compare Reflexion scores. If scores drop, auto-rollback. This prevents a bad deploy from affecting all customers simultaneously. Priority: P2. Effort: 4 hours.

**Restaurant Health Dashboard** — A single internal page (not customer-facing) showing all active restaurants with traffic lights: green (all systems normal), yellow (elevated error rate or latency), red (failures exceeding threshold). Check at a glance whether all restaurants are healthy. Priority: P1 (post-launch week 2). Effort: 3 hours.

**Automatic Alerting** — PagerDuty or simple SMS alert when: any restaurant's error rate exceeds 20%, LLM latency exceeds 5s average over 5 minutes, all LLM providers are in cooldown (keyword fallback only), or no calls received for a restaurant during expected business hours (possible Twilio misconfiguration). Priority: P1. Effort: 2 hours.

**Database Backup & Recovery** — Supabase provides point-in-time recovery on Pro plan, but also implement a nightly export of all restaurant configs and order data to a separate storage bucket. If Supabase has an outage, restaurant configs can be loaded from backup to keep voice flow running. Priority: P1. Effort: 2 hours.

---

*This document is a living artifact. Update after each sprint review.*
*Last updated: March 24, 2026 (v2.1 — Added implementation status, revised sprint plan, new enhancement suggestions)*
