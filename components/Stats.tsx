"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Stats.module.css";

const STATS = [
  { value: 500, suffix: "+", label: "Restaurants" },
  { value: 3, suffix: "M+", label: "Orders Taken" },
  { value: 99.7, suffix: "%", label: "Uptime", decimal: true },
  { value: 23, suffix: "%", label: "Avg Order Increase" },
];

function useCountUp(target: number, duration = 2000, decimal = false) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutExpo
      const current = eased * target;
      setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, duration, decimal]);

  return { count, ref };
}

function StatRing({ value, suffix, label, decimal }: { value: number; suffix: string; label: string; decimal?: boolean }) {
  const { count, ref } = useCountUp(value, 2000, decimal);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (count / value) * circumference;

  return (
    <div ref={ref} className={styles.stat}>
      <svg className={styles.ring} width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#FF6B35"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "80px 80px" }}
        />
      </svg>
      <div className={styles.statInner}>
        <span className={styles.statValue}>
          {decimal ? count.toFixed(1) : count}
          <span className={styles.suffix}>{suffix}</span>
        </span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            Numbers don't lie.
          </h2>
          <p className={styles.subtitle}>
            Real restaurants. Real results.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <StatRing {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
