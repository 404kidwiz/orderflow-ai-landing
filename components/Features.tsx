"use client";
import { motion } from "framer-motion";
import { Mic, Zap, Clock, Building2, MessageSquare, ChartLine, Brain, Monitor } from "lucide-react";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: Mic,
    title: "Voice AI",
    description: "Natural conversation AI that handles complex orders, modifications, and questions — sounds human, never tires.",
    large: true,
    color: "#FF6B35",
  },
  {
    icon: Zap,
    title: "30-Second Setup",
    description: "Enter your menu, pick a plan, get a number. No hardware. No contracts. Start taking orders today.",
    color: "#7C3AED",
  },
  {
    icon: Building2,
    title: "Multi-Location",
    description: "One dashboard. Infinite locations. Total control across your empire.",
    color: "#06b6d4",
  },
  {
    icon: MessageSquare,
    title: "Real SMS Alerts",
    description: "Instant text alerts for every order — you and your staff never miss one.",
    color: "#22c55e",
  },
  {
    icon: Brain,
    title: "Self-Improving AI",
    description: "Reflexion module analyzes every call, learns your menu, gets smarter weekly.",
    color: "#f59e0b",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Take pre-orders when you're closed. AI never sleeps, never takes a break.",
    color: "#ec4899",
  },
  {
    icon: Monitor,
    title: "Kitchen Display",
    description: "Real-time orders appear with timers, status tracking, one-tap updates.",
    large: true,
    color: "#FF6B35",
  },
  {
    icon: ChartLine,
    title: "Analytics Dashboard",
    description: "Track revenue, peak hours, popular items, and AI performance in one place.",
    color: "#8b5cf6",
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>
            Everything you need.
            <br />
            <span className="gradient-text">Nothing you don't.</span>
          </h2>
          <p className={styles.subtitle}>
            A complete voice ordering system built for restaurants that actually care about their customers.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              className={`${styles.card} ${feature.large ? styles.large : ""}`}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: i * 0.07,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -6,
                boxShadow: `0 20px 60px ${feature.color}20`,
                borderColor: `${feature.color}40`,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              <div
                className={styles.iconWrapper}
                style={{ background: `${feature.color}15` }}
              >
                <feature.icon size={24} color={feature.color} />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
              <div
                className={styles.glowBar}
                style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
