"use client";

import { motion } from "framer-motion";
import { Phone, BrainCircuit, LayoutList } from "lucide-react";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: "01",
    icon: Phone,
    title: "Customer Calls",
    description:
      "A hungry customer dials your number. No app, no website, no password. They just call — like they always do. Call connects in under 1 second.",
    color: "var(--accent)",
  },
  {
    num: "02",
    icon: BrainCircuit,
    title: "AI Takes Order",
    description:
      "OrderFlow's AI understands natural speech, handles modifications like 'extra cheese, no onions', and up-sells like your best employee ever would.",
    color: "#22c55e",
  },
  {
    num: "03",
    icon: LayoutList,
    title: "Kitchen Gets It",
    description:
      "Order drops into your kitchen display in real-time. SMS confirmation fires to the customer. You focus on cooking — not phones.",
    color: "#F59E0B",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className={styles.eyebrow}>Process</p>
          <h2 className={styles.title}>
            Three steps.{" "}
            <span style={{ color: "var(--accent)" }}>Zero complexity.</span>
          </h2>
        </motion.div>

        {/* Vertical timeline */}
        <div className={styles.timeline}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className={styles.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Oversized muted number */}
              <div className={styles.stepNumber} style={{ color: step.color }}>
                {step.num}
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className={styles.connector} style={{ background: `linear-gradient(180deg, ${step.color}40, transparent)` }} />
              )}

              {/* Content */}
              <div className={styles.content} style={{ borderLeftColor: step.color }}>
                <div className={styles.iconRow}>
                  <div
                    className={styles.iconBox}
                    style={{ border: `1px solid ${step.color}30`, background: `${step.color}10` }}
                  >
                    <step.icon size={22} color={step.color} />
                  </div>
                </div>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
