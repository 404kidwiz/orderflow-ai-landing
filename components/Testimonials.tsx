"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { Star, Quote } from "lucide-react";
import styles from "./Testimonials.module.css";

const TESTIMONIALS = [
  {
    quote: "Our phone order volume went up 40% the first month. The AI actually sells better than our staff — it never forgets to offer garlic knots.",
    author: "Marcus T.",
    business: "BBQ Shack",
    location: "Atlanta, GA",
    stars: 5,
  },
  {
    quote: "Setup was literally 60 seconds. I was taking AI-powered calls before my morning coffee was done. My kids thought I was joking.",
    author: "Jennifer L.",
    business: "Mama's Kitchen",
    location: "Decatur, GA",
    stars: 5,
  },
  {
    quote: "We were losing 20% of our calls to voicemail. OrderFlow caught every single one. Revenue up, stress down. No brainer.",
    author: "Roberto M.",
    business: "Taco Express",
    location: "Marietta, GA",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="#FF6B35" color="#FF6B35" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [dragDir, setDragDir] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const bind = useDrag(
    ({ movement: [mx], direction: [dx], velocity: [vx] }) => {
      if (Math.abs(mx) > 50 || vx > 0.5) {
        if (mx > 0 || dx > 0) {
          setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
        } else {
          setActive((prev) => (prev + 1) % TESTIMONIALS.length);
        }
      }
    },
    { axis: "x", filterTaps: true }
  );

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
          <h2 className={styles.title}>What restaurant owners say</h2>
        </motion.div>

        <div className={styles.carousel} {...bind()}>
          <div
            className={styles.track}
            style={{
              transform: `translateX(calc(-${active * 100}% - ${active * 24}px))`,
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`${styles.card} ${i === active ? styles.activeCard : ""}`}
              >
                <Quote className={styles.quoteIcon} size={40} color="#FF6B35" />
                <StarRating count={t.stars} />
                <blockquote className={styles.quote}>&ldquo;{t.quote}&rdquo;</blockquote>
                <div className={styles.author}>
                  <span className={styles.authorName}>{t.author}</span>
                  <span className={styles.authorBusiness}>{t.business}</span>
                  <span className={styles.authorLocation}>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.activeDot : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
