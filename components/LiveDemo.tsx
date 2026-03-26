"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Send, CheckCircle } from "lucide-react";
import styles from "./LiveDemo.module.css";

const DEMO_MESSAGES = [
  { role: "ai", text: "Thanks for calling Sal's Pizza! What can I get started for you today?" },
  { role: "customer", text: "Yeah, I'd like a large pepperoni pizza and two Cokes." },
  { role: "ai", text: "Great choice! That's a large pepperoni and two Cokes. Anything else? Maybe some garlic knots?" },
  { role: "customer", text: "Oh yeah, add some of those." },
  { role: "ai", text: "Perfect. That's a large pepperoni, garlic knots, and two Cokes. Your total is $28.47. Ready in about 20 minutes!" },
];

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className={styles.waveform}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={styles.bar}
          animate={active ? {
            scaleY: [0.2, 1, 0.4, 0.8, 0.3, 1, 0.5],
          } : { scaleY: 0.2 }}
          transition={{
            duration: 0.8,
            repeat: active ? Infinity : 0,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

function TypingText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <motion.span
        className={styles.cursor}
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      >
        |
      </motion.span>
    </span>
  );
}

export default function LiveDemo() {
  const [visibleMessages, setVisibleMessages] = useState<typeof DEMO_MESSAGES>([]);
  const [userInput, setUserInput] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-play demo on mount
  useEffect(() => {
    let delay = 500;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < DEMO_MESSAGES.length; i++) {
      const t = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, DEMO_MESSAGES[i]]);
        if (i === DEMO_MESSAGES.length - 1) {
          setTimeout(() => setOrderConfirmed(true), 800);
        }
      }, delay);
      timers.push(t);
      delay += (DEMO_MESSAGES[i].text.length * 30) + 1500;
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = { role: "customer" as const, text: userInput };
    setVisibleMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setAiTyping(true);

    setTimeout(() => {
      setAiTyping(false);
      setVisibleMessages((prev) => [
        ...prev,
        { role: "ai", text: "Perfect. Your order has been confirmed! We'll text you when it's ready." },
      ]);
      setTimeout(() => setOrderConfirmed(true), 600);
    }, 2500);
  };

  return (
    <section id="demo" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.badge}>
            <Phone size={14} />
            Live Demo: +1 (770) 525-5393
          </div>
          <h2 className={styles.title}>See OrderFlow In Action</h2>
          <p className={styles.subtitle}>
            Watch how our AI takes a real phone order — naturally, accurately, and fast.
          </p>
        </motion.div>

        {/* Demo Area */}
        <motion.div
          className={styles.demoArea}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {/* Phone Mockup */}
          <div className={styles.phone}>
            <div className={styles.phoneNotch} />
            <div className={styles.phoneScreen}>
              <div className={styles.phoneHeader}>
                <span className={styles.phoneHeaderTitle}>Sal's Pizza</span>
                <span className={styles.phoneHeaderStatus}>
                  <span className={styles.statusDot} />
                  AI Active
                </span>
              </div>

              <div className={styles.messages}>
                <AnimatePresence>
                  {visibleMessages.map((msg, i) => (
                    <motion.div
                      key={`${msg.role}-${i}`}
                      className={`${styles.message} ${msg.role === "ai" ? styles.aiMsg : styles.customerMsg}`}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.bubble}>
                        {msg.role === "ai" && (
                          <div className={styles.waveformWrapper}>
                            <WaveformBars active={i === visibleMessages.length - 1 && msg.role === "ai" && !orderConfirmed} />
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {aiTyping && (
                  <motion.div
                    className={`${styles.message} ${styles.aiMsg}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className={styles.bubble}>
                      <WaveformBars active />
                      <span className={styles.typing}>Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {orderConfirmed && (
                <motion.div
                  className={styles.orderConfirmed}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle size={16} color="#22c55e" />
                  <span>Order Confirmed — $28.47</span>
                </motion.div>
              )}

              <form className={styles.inputArea} onSubmit={handleUserSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Try it — type an order..."
                  className={styles.input}
                />
                <button type="submit" className={styles.sendBtn}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Info */}
          <div className={styles.info}>
            <h3 className={styles.infoTitle}>Talk to OrderFlow like you'd talk to your best employee</h3>
            <ul className={styles.features}>
              {[
                "Natural conversation — no scripts, no button presses",
                "Handles complex mods: 'large pepperoni, extra cheese, no onions'",
                "Smart upselling at the perfect moment",
                "SMS confirmation sent instantly to your customer",
                "Order drops directly into your kitchen display",
              ].map((f, i) => (
                <motion.li
                  key={i}
                  className={styles.featureItem}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className={styles.checkIcon}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {f}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
