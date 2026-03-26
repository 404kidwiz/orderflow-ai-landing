"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import styles from "./Pricing.module.css";

const PLANS = [
  {
    name: "Starter",
    price: 97,
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
    price: 197,
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
    price: 497,
    period: "/mo",
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

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
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

function AnimatedPrice({ value, annual }: { value: number; annual: boolean }) {
  const displayValue = annual ? Math.round(value * 0.8) : value;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={`${displayValue}-${annual}`}
        className={styles.price}
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

  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            Simple pricing.
            <br />
            <span className="gradient-text">No hidden fees.</span>
          </h2>
          <p className={styles.subtitle}>
            Start free, scale as you grow. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className={styles.toggle}>
            <span className={!annual ? styles.activeLabel : ""}>Monthly</span>
            <button
              className={styles.toggleBtn}
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle annual billing"
            >
              <motion.div
                className={styles.toggleKnob}
                animate={{ x: annual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={annual ? styles.activeLabel : ""}>
              Annual <span className={styles.discount}>Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className={styles.grid}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`${styles.card} ${plan.popular ? `${styles.popular} orbiting-border` : ""}`}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
              whileHover={{ y: -8 }}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planDesc}>{plan.desc}</p>
              </div>

              <div className={styles.priceWrapper}>
                <span className={styles.currency}>$</span>
                <AnimatedPrice value={plan.price} annual={annual} />
                <span className={styles.period}>{plan.period}</span>
              </div>

              <ul className={styles.features}>
                {plan.features.map((f, j) => (
                  <li key={j} className={styles.featureItem}>
                    {f.included ? (
                      <Check size={16} className={styles.checkIcon} />
                    ) : (
                      <X size={16} className={styles.xIcon} />
                    )}
                    <span className={f.included ? styles.featureText : styles.featureTextOff}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <MagneticButton
                className={`${styles.cta} ${plan.popular ? styles.ctaPopular : ""}`}
              >
                {plan.cta}
              </MagneticButton>
            </motion.div>
          ))}
        </div>

        <p className={styles.note}>
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
