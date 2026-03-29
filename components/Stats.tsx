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
  const [count, setCount] = useState(target);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || started) return;
    setStarted(true);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = eased * target;
      setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [isInView, started, target, duration, decimal]);

  return { count, ref };
}

function StatNumber({ value, suffix, label, decimal }: { value: number; suffix: string; label: string; decimal?: boolean }) {
  const { count, ref } = useCountUp(value, 2000, decimal);

  return (
    <div ref={ref} className={styles.stat}>
      <span
        className={styles.statValue}
        style={{
          color: "var(--accent)",
          textShadow: "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(59,130,246,0.2)",
        }}
      >
        {decimal ? count.toFixed(1) : count}
        <span className={styles.suffix}>{suffix}</span>
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.eyebrow}>By the numbers</p>
          <h2 className={styles.title}>Results that speak.</h2>
        </motion.div>

        <div className={styles.grid}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <StatNumber {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
