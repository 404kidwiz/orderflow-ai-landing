"use client";

import { motion } from "framer-motion";

export default function TrustBar() {
  return (
    <section
      className="py-16"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          className="text-sm uppercase tracking-[0.2em] font-semibold mb-6"
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Trusted by independent restaurants across the US
        </motion.p>

        <motion.div
          className="inline-flex items-baseline gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <span
            className="text-7xl sm:text-8xl font-black tracking-tighter"
            style={{
              color: "var(--accent)",
              textShadow: "0 0 60px rgba(59,130,246,0.4)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            500+
          </span>
          <span
            className="text-2xl font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            restaurants
            <br />
            <span className="text-base font-normal">taking orders 24/7</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
