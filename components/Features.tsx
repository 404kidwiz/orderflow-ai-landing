"use client";

import { motion } from "framer-motion";
import {
  Phone,
  TrendingUp,
  Globe,
  BarChart3,
  Plug,
  Route,
} from "lucide-react";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: Phone,
    title: "24/7 Voice Agent",
    description:
      "Answers every call in under 2 seconds. Never misses an order.",
    stat: "2s avg response",
    span: 2,
  },
  {
    icon: TrendingUp,
    title: "Smart Upselling",
    description:
      "AI suggests add-ons based on customer preferences and order history.",
    stat: "+23% avg order value",
    span: 1,
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "English, Spanish, French, and more out of the box.",
    stat: "12+ languages",
    span: 1,
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description:
      "Live order tracking, call analytics, and revenue insights.",
    stat: "Live updates",
    span: 1,
  },
  {
    icon: Plug,
    title: "Seamless POS Integration",
    description:
      "Connects to Square, Toast, Clover, and 14+ POS systems.",
    stat: "14+ integrations",
    span: 1,
  },
  {
    icon: Route,
    title: "Smart Call Routing",
    description:
      "Complex issues transfer to your staff instantly. AI handles the rest.",
    stat: "95% AI handled",
    span: 1,
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

        {/* Bento grid */}
        <div className={styles.bentoGrid}>
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className={`${styles.bentoCard} ${feature.span === 2 ? styles.span2 : ""}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.iconWrapper}>
                    <Icon size={24} className={styles.icon} />
                  </div>
                  <div className={styles.textContent}>
                    <h3 className={styles.cardTitle}>{feature.title}</h3>
                    <p className={styles.cardDesc}>{feature.description}</p>
                  </div>
                  <div className={styles.statBadge}>
                    <span className={styles.statText}>{feature.stat}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
