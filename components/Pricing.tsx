"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: 299,
    period: "/mo",
    desc: "Perfect for single-location restaurants",
    features: [
      { text: "Unlimited AI voice calls", included: true },
      { text: "Up to 500 menu items", included: true },
      { text: "SMS order notifications", included: true },
      { text: "Kitchen display integration", included: true },
      { text: "Basic analytics dashboard", included: true },
      { text: "Multi-location support", included: false },
      { text: "Custom voice prompts", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    price: 599,
    period: "/mo",
    desc: "For growing restaurant groups",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Unlimited menu items", included: true },
      { text: "Multi-location support (up to 5)", included: true },
      { text: "Custom voice prompts", included: true },
      { text: "Advanced analytics", included: true },
      { text: "API access", included: true },
      { text: "Priority support", included: true },
      { text: "White-label option", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Contact",
    period: "",
    desc: "For restaurant groups & franchises",
    features: [
      { text: "Everything in Growth", included: true },
      { text: "Unlimited locations", included: true },
      { text: "White-label option", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA guarantee", included: true },
      { text: "24/7 phone support", included: true },
      { text: "On-premise deployment", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

function AnimatedPrice({ value, annual }: { value: number | string; annual: boolean }) {
  const displayValue = typeof value === "number" ? (annual ? Math.round(value * 0.8) : value) : value;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={`${displayValue}-${annual}`}
        className={typeof value === 'number' ? "text-[56px] font-black text-[var(--silk)] tracking-tight leading-none font-mono" : "text-[42px] font-black text-[var(--silk)] tracking-tight leading-none font-serif"}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "inline-block", transformStyle: "preserve-3d", perspective: 400 }}
      >
        {displayValue}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planName: string) => {
    const planMap: Record<string, string> = {
      "Starter": "starter",
      "Growth": "growth",
      "Enterprise": "enterprise",
    };
    const plan = planMap[planName];

    if (plan === "enterprise") {
      window.open("mailto:hello@orderflow.ai?subject=Enterprise%20Plan%20Inquiry", "_self");
      return;
    }

    setLoadingPlan(planName);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api-production-90b5.up.railway.app";
      const res = await fetch(`${API_BASE}/api/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, annual }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback to lead form if Stripe not configured
        window.location.href = "#lead-form";
      }
    } catch {
      window.location.href = "#lead-form";
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-32 px-6" style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--ember) 2%, transparent), transparent)" }}>
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-black tracking-tight text-[var(--silk)] leading-[1.1] mb-4">
            Simple pricing.
            <br />
            <span className="text-[var(--ash)]">No hidden fees.</span>
          </h2>
          <p className="text-lg text-[var(--ash)] mb-8">
            Start free, scale as you grow. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 text-[15px] text-[var(--ash)]">
            <span className={!annual ? "text-[var(--silk)] font-semibold" : ""}>Monthly</span>
            <button
              className="relative w-[52px] h-[28px] bg-[var(--glass)] border border-[var(--border)] rounded-full cursor-pointer p-[3px] flex items-center"
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle annual billing"
            >
              <motion.div
                className="w-[20px] h-[20px] bg-[var(--ember)] rounded-full shadow-[0_2px_8px_rgba(255,69,0,0.4)]"
                animate={{ x: annual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={annual ? "text-[var(--silk)] font-semibold flex items-center" : "flex items-center"}>
              Annual <span className="text-xs py-[3px] px-2 bg-green-500/15 text-green-500 rounded-full ml-1.5 font-semibold">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 max-w-[420px] lg:max-w-none mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 md:p-10 bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] rounded-[24px] flex flex-col transition-all duration-300 ${plan.popular ? 'border-[var(--ember)]/40 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--ember)_8%,transparent)_0%,var(--glass)_100%)] lg:scale-[1.02] shadow-2xl shadow-[var(--ember)]/10' : ''}`}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
              whileHover={{ y: -8 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-[var(--ember)] text-white text-xs font-bold rounded-full uppercase tracking-[0.05em]">
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[var(--silk)] mb-2 font-serif">{plan.name}</h3>
                <p className="text-sm text-[var(--ash)]">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                {typeof plan.price === 'number' && <span className="text-2xl font-semibold text-[var(--ash)]">$</span>}
                <AnimatedPrice value={plan.price} annual={annual} />
                {plan.period && <span className="text-base text-[var(--ash)]">{plan.period}</span>}
              </div>

              <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-[15px]">
                    {f.included ? (
                      <Check size={16} className="text-[#22c55e] shrink-0" />
                    ) : (
                      <X size={16} className="text-[var(--ash)] shrink-0" />
                    )}
                    <span className={f.included ? "text-[var(--silk)]" : "text-[var(--ash)]"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <MagneticButton
                className={`w-full py-4 rounded-xl text-base font-bold transition-all duration-300 ${plan.popular ? 'bg-[linear-gradient(135deg,var(--ember)_0%,var(--ember-glow)_100%)] text-white shadow-[0_8px_30px_rgba(255,69,0,0.35)] hover:shadow-[0_12px_40px_rgba(255,69,0,0.45)] border-none' : 'bg-[var(--glass)] hover:bg-[color-mix(in_srgb,var(--white)_10%,transparent)] border border-[var(--border)] text-[var(--silk)]'}`}
                onClick={() => handleCheckout(plan.name)}
              >
                {loadingPlan === plan.name ? "Redirecting..." : plan.cta}
              </MagneticButton>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--ash)] font-medium">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
