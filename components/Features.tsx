"use client";
import { motion } from "framer-motion";
import styles from "./Features.module.css";

const FEATURES = [
  {
    title: "Natural Voice AI",
    description: "Sounds like a real person. Handles accents, interruptions, and complex orders without breaking a sweat.",
  },
  {
    title: "30-Second Setup",
    description: "Paste your menu. Pick a plan. Get a phone number. Start taking orders before your coffee gets cold.",
  },
  {
    title: "Multi-Location Support",
    description: "One dashboard. Infinite locations. Total visibility across every storefront you own.",
  },
  {
    title: "Real SMS Alerts",
    description: "You and your staff get instant text notifications for every order. Never miss a call.",
  },
  {
    title: "Self-Improving AI",
    description: "Weekly reflexion sessions make the AI smarter about your menu, your customers, and your patterns.",
  },
  {
    title: "24/7 Availability",
    description: "Takes orders when you're closed, when you're busy, when you're on the other line. Always on.",
  },
  {
    title: "Kitchen Display Ready",
    description: "Orders land in your kitchen display the second they're confirmed. Timers, status, one-tap done.",
  },
  {
    title: "Built-In Analytics",
    description: "Track peak hours, best sellers, AI accuracy, and revenue — all in one clean dashboard.",
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className={styles.eyebrow}>Features</p>
          <h2 className={styles.title}>
            Everything your restaurant needs.
            <br />
            <span className="gradient-text">Nothing it doesn&apos;t.</span>
          </h2>
        </motion.div>

        {/* Editorial list — 2 columns */}
        <div className={styles.list}>
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className={styles.featureItem}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ x: 4 }}
            >
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
