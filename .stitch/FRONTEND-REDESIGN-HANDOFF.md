# OrderFlow AI Frontend Redesign Handoff

This repo now contains the approved Stitch redesign package for the OrderFlow AI frontend. The main repo is the handoff home. The separate landing repo was used as reference context, but the implementation source of truth for the next CLI should live here.

## Stitch Source
- **Project:** `OrderFlow AI Frontend Redesign`
- **Project ID:** `13054754492898134388`
- **Design System:** [`.stitch/DESIGN.md`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/.stitch/DESIGN.md)

## Current Preferred Landing Direction
These are the current preferred landing screens for implementation in [`landing-v2/app/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/page.tsx).

| Label | Stitch Title | Screen ID | Role | Preview |
| --- | --- | --- | --- | --- |
| `D1B` | OrderFlow AI - Cinematic Landing Page | `5204a2639a694f3e9873cc996d3a0377` | Preferred desktop landing direction | [open](https://lh3.googleusercontent.com/aida/ADBb0ugadqEOb7qaTiXwvq4v2PIugqGiA4G8GNH5j5La5NAa3joprvNhwF9E00w0OF0bhJ49hdYCBeKuuCcuZ8tl1UrZ7ZVT2GriFzudvvQvvbhFkXtJ9Qd7LhAxoOpuhCmNswLbj1bDBroN3mzWH1cuNPR9EDDaM6yNqFqFYA9JwTSFKKKwx6vLQAs-ZvdqspaPO8guXZSgB_9D8eSBC0VfCpkWPvs6Tf88U7XAai1NWolqIQQMAJosg4dr8XE) |
| `M1B` | OrderFlow AI - Mobile Cinematic Landing | `fbe3f7785ff2497e88fb42406510c40a` | Preferred mobile landing direction | [open](https://lh3.googleusercontent.com/aida/ADBb0uiM6tWWOP4rTCmsk1RPEenSg-ZAfcLbaoCeu05xGsZRUnw5_n-3j2_MwzectHIkkFoBIxzwGTldXmq4YLtOL2dinHcafR4lvTQlGPy4jxvdewu3kXc92HmMH82JYfTKm13R3zPbj-vAN6fUqwW9CB5CtvB5ffZdtfcI7Ee3Toe9OTbSCLR7o3VflXROsXzP4pnsthc-qKB7zOAdPCE93CX423K5R7acySTpL-TCb6SfJiypaTQRZ-t9dY9A) |

## Source Inputs Used
- Main product repo frontend: [`landing-v2`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2)
- Parallel landing reference repo: [`/Users/404kidwiz/projects/orderflow-ai-landing`](/Users/404kidwiz/projects/orderflow-ai-landing)

## Intent
The current frontend is strong on motion and ambition, but it still reads as separate layers:

- landing page as a premium marketing surface
- dashboard as a practical admin screen
- restaurant management as a separate internal utility

The redesign turns those into one product family:

- one editorial dark-tech system across marketing, ops, and admin
- stronger hospitality signal instead of generic AI SaaS framing
- clearer hierarchy between AI intelligence, revenue actions, and restaurant operations
- mobile variants that feel intentionally designed, not collapsed desktop screens

## Screen Inventory
### Desktop
| Label | Stitch Title | Screen ID | Target Repo Surface | Preview |
| --- | --- | --- | --- | --- |
| `D1` | OrderFlow AI - Landing Page | `49785c8a63774d70b993748334ac5887` | [`landing-v2/app/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/page.tsx), landing components in [`landing-v2/components`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/components) | [open](https://lh3.googleusercontent.com/aida/ADBb0uj75cAfAr4pG9wmPdRNjEEfVDaK292drR1Vexm_130kEHj45bmpEn3QgMXbAK8UG-hvLA0EqRnAPXN36j30c4IIMTRGR_y2hTttyjnm9Tc4VoLnZt0Wl9Z5lKQs23_1KO7SJaVj5eyqbuTxjNYrLlJuXDpW0MI7-AZgHo_A0x3bZHbX032eHk90lZGCUY-4Edr92QDmXPy4mlLYMe4piPae97vAzlUvyHBKGhQpr3sXyhm_xc3uauPmy9BT) |
| `D2` | OrderFlow AI - Operations Dashboard | `b149ed5e24bd44baae1d979eb223d97a` | [`landing-v2/app/dashboard/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/dashboard/page.tsx) | [open](https://lh3.googleusercontent.com/aida/ADBb0ugO5RpbLNYTzR3g1Zp1Zh7m5Bzh66_2X41ufRFPm7a8vgHXAeTr0ate1Xu2-fr1mK9PHWcvb-HkvOuyiZDPuqVB6Fi1RwsDtF1cQ4er-c19vdx6YCfM_wJbvl-NeDbo7coqci7QnRC0Jos9MX0Eu4PYYUSG_cK8SIHjBHurD8tsvBd7WU2JP7ySkeNAo_nT5pEWzK8VUNcAJFDXcFRuwK6GiMd8rN_QE0WDdxMnCqTs6OpVbT1ZT9ubp5_m) |
| `D3` | Internal Command Center | `22b1dd05436642f98f3ceea12eb38e5a` | [`landing-v2/app/dashboard/restaurants/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/dashboard/restaurants/page.tsx) | [open](https://lh3.googleusercontent.com/aida/ADBb0ujoNVSuuwsOmi_-3qvFRRdl5rXFazT3xATXWAYnLFmacY_RqJ_BXECpEzx624ceKVqaW9TlVM8ZfvA7vSubM35KA70sVQewexckb5XKu2Q-JE6yN9sUNSpxGzoH-V_J5SafFDo5UOo-xD3wcnxFgdfF8_3L7eDWCO66vK3vAnJDQvbeXJiWzBLd-1O75Z6giyPAkl9lUnVN8fa2-xB7DtEaoE0jelts3CemNb3aT5S5djou22F3IqpJKIMS) |

### Mobile
| Label | Stitch Title | Screen ID | Target Repo Surface | Preview |
| --- | --- | --- | --- | --- |
| `M1` | OrderFlow AI - Mobile Landing | `cda84ad990d7410993b013b7d9b182e3` | Responsive version of `D1` | [open](https://lh3.googleusercontent.com/aida/ADBb0uis7Cz5C9SapEl_JcMQ50zBEPJwb4SKOAJebxjQtaUqXKaw3UCXYHyWGQfckww_qRYGxDZRgOWVFroa9t6o5yjqml_L2c_4cvTpRD6zkeu9k4mJS_Pxle37aMyHI1mVdvcPvJxnYdJMJn_6fihwurhFI7WOh8fafKcl7LnmkIUeG3lEzbFct8MAKBRL-m_k7P82CJSFoovUIty5XvRSzY8mSkEWCVzo8VL1Zk8jfeFGrY8Y2HH_ge5VcJB5) |
| `M2` | Mobile Operations Dashboard | `8b4d5621dd2848edb71cdf7bb6b2966c` | Responsive or dedicated mobile view of `D2` | [open](https://lh3.googleusercontent.com/aida/ADBb0ujnSQmJIHFB4u1I5ocCQ1OA_2pIdYBbepnmRD2Oq3UYpvc5tbpqAxx4s2wWAn4E-sHxcEa3_bzBHpL5itF0N8bsZAkhob9PH_AW1WWjpqESj0aEVUuxOa3QaU-TkJXQnt7kUEWoCCv5iJQZtdnqojTitd-TKCihDOK_idoJyBcQehDxSxqsw8JDwljtI5LgJiLcbS2b70J2JctM3EwV9Oq4rsdb-wTU2XIIpW28yeFfAVlHo1DxhFjC3UEI) |
| `M3` | Mobile Restaurant Admin | `1c683f2beb814173aac5a511b1dbb3e4` | Responsive or dedicated mobile view of `D3` | [open](https://lh3.googleusercontent.com/aida/ADBb0ujOv52pwKpQC4B2-nCMfXaQzd8kpR9sbZZpv1FP91hJjrOJExdtuMuuNCfKfreOFB7tXLeRwjmIH1W-O84_3fm6AX3nIhbeF3iYD_6sz6W8RjrrIh7W714LdUyW_2WPsM_Fp0GHEM8mQ17SibNvMBQcOpyxykBps_iFF8vcqybMXqWpyMJnL37O9d-mk7kASr-tiy0a0ROKwsiIbYSeIyS4iXYFQopPWsjz-Xr4nm_8y4iHQVw2KKqmDkA) |

## What Should Change
### Marketing Surface
- The landing experience should move away from “AI startup with flashy sections” and toward “premium hospitality operations brand.”
- Hero, live demo, trust, features, pricing, and lead capture should all feel like one narrative instead of a stack of individually animated modules.
- The standalone landing repo already pushed in this direction visually; this redesign absorbs that ambition into a more coherent system.
- The current preferred landing direction is the cinematic pair `D1B` and `M1B`, which pushes the hero harder into motion, asymmetry, and AI-call orchestration.

### Restaurant Ops Surface
- The dashboard should become a real operations command center, not a utilitarian tabbed page.
- Orders, calls, leads, and revenue should be visually tiered so managers can scan status before they read details.
- AI-specific intelligence should have its own accent language instead of looking like normal metadata.

### Internal Admin Surface
- Restaurant onboarding and account management should feel like premium internal software, not a password-gated afterthought.
- Multi-restaurant control, API keys, phone routing, and onboarding progress should sit in a high-trust, three-pane desktop system.

## Implementation Mapping
### Main Frontend
- [`landing-v2/app/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/page.tsx) maps to `D1B` and `M1B` as the current preferred landing implementation pair.
- [`landing-v2/app/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/page.tsx) also has the earlier baseline landing pair `D1` and `M1` preserved in Stitch for comparison.
- [`landing-v2/app/dashboard/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/dashboard/page.tsx) maps to `D2` and `M2`.
- [`landing-v2/app/dashboard/restaurants/page.tsx`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/landing-v2/app/dashboard/restaurants/page.tsx) maps to `D3` and `M3`.

### Reference Use
- Use [`/Users/404kidwiz/projects/orderflow-ai-landing`](/Users/404kidwiz/projects/orderflow-ai-landing) only as visual/context reference for implementation choices that were explored outside the main repo.
- Do not treat the standalone landing repo as the documentation or merge target for this redesign pass.

## Build Order
1. Tokenize the system in [`.stitch/DESIGN.md`](/Users/404kidwiz/Desktop/404kidwiz%20Vault/404-projects/orderflow-ai/.stitch/DESIGN.md).
2. Rebuild the landing experience in `landing-v2` against `D1B` and `M1B`.
3. Rework the dashboard around `D2` and `M2` with stronger hierarchy before adding more analytics depth.
4. Rebuild restaurant admin against `D3` and `M3`.
5. Normalize shared nav, card, button, form, and status-chip systems across all three surfaces.

## Guardrails For The Next CLI
- Treat `landing-v2` as a nested repo with its own git history. Be deliberate before editing inside it.
- Keep this redesign handoff package in the main repo root.
- Preserve backend flows, API endpoints, and data assumptions.
- Focus the next pass on frontend orchestration, information hierarchy, tokens, and component structure.
- Do not collapse the design into generic enterprise admin UI.

## Notes
- This is a documentation-only handoff. No frontend implementation was done here.
- The main repo already showed `landing-v2` as modified before this handoff package was added, so review nested repo status before touching app code.
