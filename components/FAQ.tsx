"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import styles from "./FAQ.module.css";

const FAQS = [
  {
    q: "How does OrderFlow work?",
    a: "We give you a dedicated phone number. When customers call, our AI answers, takes their order naturally, and sends it directly to your kitchen. No apps, no websites, no training required.",
  },
  {
    q: "What if the AI can't understand the customer?",
    a: "OrderFlow handles 99.4% of calls autonomously. For the rare complex order, it seamlessly transfers to your phone with a full transcript. You never miss a sale.",
  },
  {
    q: "Can I use my existing phone number?",
    a: "Yes! We can port your existing number for $30 (one-time). Or we give you a new dedicated number free with any plan.",
  },
  {
    q: "Does it integrate with my POS?",
    a: "We integrate with Toast, Square, Clover, and 20+ other POS systems. OrderFlow sends orders directly to your kitchen display or printer.",
  },
  {
    q: "Is there a free trial?",
    a: "Absolutely. Every plan comes with a 14-day free trial. No credit card required. Full features, zero risk.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Month-to-month billing. Cancel in one click from your dashboard. No hidden fees, no early termination penalties.",
  },
  {
    q: "How long does setup take?",
    a: "Most restaurants are live in under 30 minutes. Enter your menu, pick your plan, and start taking calls. Seriously.",
  },
  {
    q: "What languages does it support?",
    a: "English is fully live. Spanish, French, and Mandarin are in beta. Contact us for enterprise language customization.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Frequently asked
            <br />
            <span className="gradient-text">questions</span>
          </h2>
          <p className={styles.subtitle}>
            Everything you need to know about OrderFlow.
          </p>
        </motion.div>

        <Accordion.Root
          type="single"
          value={openIndex?.toString() ?? ""}
          onValueChange={(v) => setOpenIndex(v ? parseInt(v) : null)}
          className={styles.list}
        >
          {FAQS.map((faq, i) => (
            <Accordion.Item key={i} value={i.toString()} className={styles.item}>
              <Accordion.Header>
                <Accordion.Trigger className={styles.trigger}>
                  <span className={styles.question}>{faq.q}</span>
                  <motion.div
                    className={styles.chevron}
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className={styles.content}>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className={styles.answer}>{faq.a}</p>
                </motion.div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}