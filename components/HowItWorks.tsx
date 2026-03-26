"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "@/lib/scroll-animations";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, BrainCircuit, LayoutList } from "lucide-react";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: "01",
    icon: Phone,
    title: "Customer Calls",
    description: "A hungry customer dials your number. They don't need an app, a website, or a password. They just call — like they always do.",
    detail: "Call connects in under 1 second",
    color: "#FF6B35",
  },
  {
    num: "02",
    icon: BrainCircuit,
    title: "AI Takes Order",
    description: "OrderFlow's AI — powered by Llama 3.3 70B — understands natural speech, handles modifications, and up-sells like your best employee.",
    detail: "Understands 'large pepperoni, extra cheese, no onions' in one breath",
    color: "#7C3AED",
  },
  {
    num: "03",
    icon: LayoutList,
    title: "Kitchen Gets It",
    description: "Order drops into your kitchen display in real-time. SMS confirmation fires to the customer. You focus on cooking, not phones.",
    detail: "Order confirmed in ~20 seconds",
    color: "#22c55e",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  return (
    <section ref={containerRef} className={styles.section} id="how-it-works">
      <div className={styles.stickyWrapper}>
        <div className={styles.track}>
          {/* Header */}
          <div className={styles.header}>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Three steps. Zero complexity.
            </motion.p>
          </div>

          {/* Horizontal panels */}
          <motion.div className={styles.panels} style={{ x }}>
            {STEPS.map((step, i) => (
              <div key={step.num} className={styles.panel}>
                <div className={styles.stepNumber} style={{ color: step.color }}>
                  {step.num}
                </div>
                <div className={styles.panelIcon} style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                  <step.icon size={32} color={step.color} />
                </div>
                <h3 className={styles.panelTitle}>{step.title}</h3>
                <p className={styles.panelDesc}>{step.description}</p>
                <div className={styles.detailTag} style={{ background: `${step.color}15`, color: step.color }}>
                  {step.detail}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Progress indicator */}
          <div className={styles.progress}>
            {STEPS.map((_, i) => (
              <div key={i} className={styles.progressDot} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
