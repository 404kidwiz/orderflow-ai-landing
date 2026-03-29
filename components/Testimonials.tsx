"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Testimonials.module.css";

const TESTIMONIALS = [
  {
    quote:
      "Our phone order volume went up 40% the first month. The AI actually sells better than our staff — it never forgets to offer garlic knots.",
    author: "Marcus T.",
    business: "BBQ Shack",
    location: "Atlanta, GA",
  },
  {
    quote:
      "Setup was literally 60 seconds. I was taking AI-powered calls before my morning coffee was done. My kids thought I was joking.",
    author: "Jennifer L.",
    business: "Mama's Kitchen",
    location: "Decatur, GA",
  },
  {
    quote:
      "We were losing 20% of our calls to voicemail. OrderFlow caught every single one. Revenue up, stress down. No brainer.",
    author: "Roberto M.",
    business: "Taco Express",
    location: "Marietta, GA",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  // Auto-rotate
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[active];

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
          <p className={styles.eyebrow}>Testimonials</p>
        </motion.div>

        {/* Large editorial quote */}
        <div className={styles.quoteArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={styles.quoteWrapper}
            >
              <span className={styles.openQuote}>&ldquo;</span>
              <blockquote className={styles.quoteText}>
                {t.quote}
              </blockquote>

              <div className={styles.attribution}>
                <span className={styles.authorName}>{t.author}</span>
                <span className={styles.separator}>·</span>
                <span className={styles.business}>{t.business}</span>
                <span className={styles.separator}>·</span>
                <span className={styles.location}>{t.location}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          <button onClick={prev} className={styles.navBtn} aria-label="Previous testimonial">
            <ChevronLeft size={20} />
          </button>

          <div className={styles.dots}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.activeDot : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button onClick={next} className={styles.navBtn} aria-label="Next testimonial">
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}
