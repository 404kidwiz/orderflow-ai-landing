"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./page.module.css";

// ── Defaults ────────────────────────────────────────────────────────────────
const DEFAULTS = {
  avgOrderValue: 28,
  callsPerDay: 30,
  upsellRate: 18,
  avgUpsellValue: 9,
};

const SUBSCRIPTION_PRICE = 129;
const DAYS_PER_MONTH = 22;
const CAPTURE_RATE = 0.12;

// ── Smooth number hook ───────────────────────────────────────────────────────
function useAnimatedNumber(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = display;
    const to = target;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      fromRef.current = from + (to - from) * eased;
      setDisplay(fromRef.current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(to);
        startRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}

// ── Formatters ───────────────────────────────────────────────────────────────
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtDays = (n: number) => {
  if (n < 1) return `${(n * 24).toFixed(1)} hrs`;
  if (n > 99) return "99+";
  return n.toFixed(1);
};

// ── Sub-components ──────────────────────────────────────────────────────────
function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <label className={styles.fieldLabel}>{label}</label>
        <div className={styles.fieldValue}>
          {prefix}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className={styles.numberInput}
          />
          {suffix}
        </div>
      </div>
      <div className={styles.sliderTrack}>
        <div className={styles.sliderFill} style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.fieldRange}>
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ROICalculator() {
  const [avgOrderValue, setAvgOrderValue] = useState(DEFAULTS.avgOrderValue);
  const [callsPerDay, setCallsPerDay] = useState(DEFAULTS.callsPerDay);
  const [upsellRate, setUpsellRate] = useState(DEFAULTS.upsellRate);
  const [avgUpsellValue, setAvgUpsellValue] = useState(DEFAULTS.avgUpsellValue);

  // ── Calculations ────────────────────────────────────────────────────────
  const newRevenuePerMonth =
    callsPerDay * DAYS_PER_MONTH * avgOrderValue * CAPTURE_RATE +
    callsPerDay * DAYS_PER_MONTH * (upsellRate / 100) * avgUpsellValue;

  const monthlyNet = newRevenuePerMonth - SUBSCRIPTION_PRICE;
  const paybackDays = SUBSCRIPTION_PRICE / (newRevenuePerMonth / 30);

  // Animated displays
  const animRevenue = useAnimatedNumber(newRevenuePerMonth);
  const animPayback = useAnimatedNumber(paybackDays);
  const animNet = useAnimatedNumber(monthlyNet);

  const handleReset = useCallback(() => {
    setAvgOrderValue(DEFAULTS.avgOrderValue);
    setCallsPerDay(DEFAULTS.callsPerDay);
    setUpsellRate(DEFAULTS.upsellRate);
    setAvgUpsellValue(DEFAULTS.avgUpsellValue);
  }, []);

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Not sure yet?{" "}
          <em className={styles.heroTitleAccent}>Let the math decide.</em>
        </h1>
        <p className={styles.heroSub}>
          Show restaurant owners exactly how much OrderFlow earns them.
          <br className={styles.heroBreak} />
          The average restaurant sees{" "}
          <span className={styles.heroHighlight}>$1,200–$4,000/month</span> in new orders.
        </p>
      </section>

      {/* Calculator */}
      <section className={styles.calculator}>
        <div className={styles.grid}>
          {/* ── LEFT: Inputs ── */}
          <div className={styles.inputsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Your Numbers</span>
              <button onClick={handleReset} className={styles.resetBtn} type="button">
                Reset
              </button>
            </div>

            <div className={styles.fields}>
              <InputField
                label="Avg food + drink order ($)"
                value={avgOrderValue}
                onChange={setAvgOrderValue}
                min={8}
                max={150}
                prefix="$"
              />
              <InputField
                label="Phone orders you take daily"
                value={callsPerDay}
                onChange={setCallsPerDay}
                min={5}
                max={500}
              />
              <InputField
                label="% of calls where AI suggests an addition"
                value={upsellRate}
                onChange={setUpsellRate}
                min={5}
                max={40}
                step={1}
                suffix="%"
              />
              <InputField
                label="Avg upsell amount ($)"
                value={avgUpsellValue}
                onChange={setAvgUpsellValue}
                min={3}
                max={50}
                prefix="$"
              />
            </div>

            <p className={styles.assumption}>
              <span className={styles.assumptionIcon}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              Assumes 12% of calls are captured by voice AI (industry avg). Adjust your expected capture rate above.
            </p>
          </div>

          {/* ── RIGHT: Outputs ── */}
          <div className={styles.outputsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>What You Get</span>
              <span className={styles.aiBadge}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#8A2BE2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                AI-Powered
              </span>
            </div>

            {/* Headline result */}
            <div className={styles.headlineBlock}>
              <div className={styles.headlineLabel}>OrderFlow pays for itself in</div>
              <div className={styles.headlineNumber}>
                <span className={styles.emberIcon} aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF4500">
                    <path d="M12 23c-4.4 0-8-3.6-8-8 0-3.5 2.3-6.8 5-8.7L12 2l3 4.3C17.7 8.2 20 11.5 20 15c0 4.4-3.6 8-8 8zm0-18.5L9.5 8.8C7.3 10.4 5.5 13 5.5 15c0 3.6 2.9 6.5 6.5 6.5s6.5-2.9 6.5-6.5c0-2-1.8-4.6-4-6.2L12 4.5z"/>
                    <path d="M12 20c-2.8 0-5-2.2-5-5 0-2 1.2-3.8 3-4.8L12 8l2 2.2c1.8 1 3 2.8 3 4.8 0 2.8-2.2 5-5 5z" opacity=".6"/>
                  </svg>
                </span>
                {fmtDays(animPayback)}
              </div>
              <div className={styles.headlineSub}>at your current volume</div>
            </div>

            <div className={styles.statsGrid}>
              {/* New Revenue */}
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>New Revenue / Month</div>
                <div className={styles.statValue}>{fmtCurrency(animRevenue)}</div>
                <div className={styles.statSub}>from captured calls + upsells</div>
              </div>

              <div className={styles.statDivider} />

              {/* Subscription */}
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>OrderFlow Pro</div>
                <div className={styles.statValueMuted}>{fmtCurrency(SUBSCRIPTION_PRICE)}<span className={styles.statPeriod}>/mo</span></div>
                <div className={styles.statSub}>unlimited calls &amp; upsells</div>
              </div>

              <div className={styles.statDivider} />

              {/* Net Value */}
              <div className={styles.statBlock}>
                <div className={styles.statLabel}>Net Monthly Value</div>
                <div className={`${styles.statValue} ${animNet >= 0 ? styles.statPositive : styles.statNegative}`}>
                  {animNet >= 0 ? "+" : ""}{fmtCurrency(animNet)}
                </div>
                <div className={styles.statSub}>after subscription cost</div>
              </div>
            </div>

            {/* CTA */}
            <a href="/" className={styles.ctaButton}>
              Start Free 14-Day Trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <p className={styles.ctaSub}>
              No credit card. No contracts. 14-day free trial.
              <br />
              Your AI agent is live in 30 seconds.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
